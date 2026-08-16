#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { appendFile, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { execFileSync } from 'node:child_process';

const root = resolve(import.meta.dirname, '..');
const experimentsRoot = resolve(root, 'docs/seo/experiments');
const [command, experimentId, ...rest] = process.argv.slice(2);
const options = parseOptions(rest);

if (!command || !['list', 'status', 'event', 'snapshot'].includes(command)) usage();

if (command === 'list') {
  if (experimentId) usage('list does not accept an experiment id');
  const entries = await readdir(experimentsRoot, { withFileTypes: true });
  const experiments = await Promise.all(entries
    .filter((entry) => entry.isDirectory())
    .map(async (entry) => {
      const experiment = JSON.parse(await readFile(resolve(experimentsRoot, entry.name, 'experiment.json'), 'utf8'));
      return {
        id: experiment.id,
        status: experiment.status,
        keyword: experiment.targetKeyword,
        targetUrl: experiment.targetUrl,
        controlUrl: experiment.controlUrl,
        nextAction: experiment.nextAction ?? null,
      };
    }));
  console.log(JSON.stringify(experiments.sort((a, b) => a.id.localeCompare(b.id)), null, 2));
  process.exit(0);
}

if (!experimentId) usage(`${command} requires an experiment id`);

const dir = resolve(experimentsRoot, experimentId);
const manifestPath = resolve(dir, 'experiment.json');
const eventsPath = resolve(dir, 'events.ndjson');
const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

if (command === 'status') {
  const events = await readEvents(eventsPath);
  console.log(JSON.stringify({ manifest, events, git: gitState() }, null, 2));
}

if (command === 'event') {
  if (!options.type || !options.note) usage('event requires --type and --note');
  const event = await recordEvent({
    type: options.type,
    note: options.note,
    deploymentId: options.deployment ?? deploymentId(),
  });
  console.log(JSON.stringify(event, null, 2));
}

if (command === 'snapshot') {
  const kind = options.kind ?? 'observation';
  const url = options.url ?? manifest.targetUrl;
  const label = slug(options.label ?? kind);
  const timestamp = new Date().toISOString();
  const stamp = timestamp.replaceAll(':', '-').replaceAll('.', '-');
  const artifactsDir = resolve(dir, 'artifacts');
  await mkdir(artifactsDir, { recursive: true });

  const { chromium } = await import('playwright');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, colorScheme: 'light' });
  const page = await context.newPage();
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 });
  const html = await page.content();
  const screenshotName = `${stamp}-${label}.png`;
  const htmlName = `${stamp}-${label}.html`;
  const snapshotName = `${stamp}-${label}.json`;
  await page.screenshot({ path: resolve(artifactsDir, screenshotName), fullPage: true });
  const seo = await page.evaluate(() => ({
    title: document.title,
    metaDescription: document.querySelector('meta[name="description"]')?.getAttribute('content') ?? null,
    canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null,
    robots: document.querySelector('meta[name="robots"]')?.getAttribute('content') ?? null,
    h1: [...document.querySelectorAll('h1')].map((node) => node.textContent?.trim() ?? ''),
    h2: [...document.querySelectorAll('h2')].map((node) => node.textContent?.trim() ?? ''),
    schema: [...document.querySelectorAll('script[type="application/ld+json"]')].map((node) => node.textContent ?? ''),
  }));
  await browser.close();

  const htmlHash = sha256(html);
  const schemaHash = sha256(seo.schema.join('\n'));
  const snapshot = {
    experimentId,
    kind,
    label,
    capturedAt: timestamp,
    url,
    statusCode: response?.status() ?? null,
    git: gitState(),
    deploymentId: options.deployment ?? deploymentId(),
    artifacts: { html: htmlName, screenshot: screenshotName },
    hashes: { htmlSha256: htmlHash, schemaSha256: schemaHash },
    seo,
  };
  await Promise.all([
    writeFile(resolve(artifactsDir, htmlName), html),
    writeFile(resolve(artifactsDir, snapshotName), `${JSON.stringify(snapshot, null, 2)}\n`),
  ]);
  await recordEvent({ type: 'snapshot', note: `${kind} snapshot captured`, snapshot: snapshotName, url, htmlHash, schemaHash, deploymentId: snapshot.deploymentId });
  console.log(JSON.stringify(snapshot, null, 2));
}

async function recordEvent(extra) {
  const event = { experimentId, recordedAt: new Date().toISOString(), git: gitState(), ...extra };
  await mkdir(dir, { recursive: true });
  await appendFile(eventsPath, `${JSON.stringify(event)}\n`);
  return event;
}

async function readEvents(path) {
  try {
    return (await readFile(path, 'utf8')).split('\n').filter(Boolean).map((line) => JSON.parse(line));
  } catch (error) {
    if (error.code === 'ENOENT') return [];
    throw error;
  }
}

function gitState() {
  const run = (args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
  return { commit: run(['rev-parse', 'HEAD']), branch: run(['branch', '--show-current']), dirtyFiles: run(['status', '--porcelain']).split('\n').filter(Boolean) };
}

function deploymentId() {
  return process.env.VERCEL_GIT_COMMIT_SHA ?? process.env.CF_PAGES_COMMIT_SHA ?? process.env.DEPLOYMENT_ID ?? null;
}

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 50) || 'snapshot';
}

function parseOptions(values) {
  const result = {};
  for (let index = 0; index < values.length; index += 1) {
    const key = values[index];
    if (!key.startsWith('--')) usage(`unexpected argument: ${key}`);
    const value = values[index + 1];
    if (!value || value.startsWith('--')) usage(`missing value for ${key}`);
    result[key.slice(2)] = value;
    index += 1;
  }
  return result;
}

function usage(error) {
  if (error) console.error(error);
  console.error(`Usage:\n  npm run seo:experiment -- list\n  npm run seo:experiment -- status <id>\n  npm run seo:experiment -- event <id> --type <type> --note <note> [--deployment <id>]\n  npm run seo:experiment -- snapshot <id> [--kind before|after|observation] [--url <url>] [--label <label>] [--deployment <id>]`);
  process.exit(1);
}
