// Pass B — HTTP 表单直提（无验证码、无登录门槛的站点）
// 用法: node scripts/backlink-submit-http.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const OUT = join(process.cwd(), 'docs', 'seo', 'backlink-campaign', 'evidence');
mkdirSync(OUT, { recursive: true });
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';

const results = [];

// ---------- 1) ki-suche.io (advanced-innovation.io) ----------
try {
  const form = new FormData();
  form.append('$ACTION_REF_1', '');
  form.append('$ACTION_1:0', JSON.stringify({ id: '60b0a723e96c94105f871eb8e9aa40dc3e8a2abe02', bound: '$@1' }));
  form.append('$ACTION_1:1', '[null]');
  form.append('$ACTION_KEY', 'k5526fdc9559ef47776fa1f285193e9ec');
  form.append('title', 'MindMapAny');
  form.append('url', 'https://mindmapany.com');
  form.append(
    'description',
    'MindMapAny verwandelt lange Inhalte in klare, bearbeitbare Mindmaps: Text einfügen oder PDF, Word, EPUB, PPTX und Webartikel hochladen – jede Node führt zurück zur Quelle (Seitenzahl, Folie oder Kapitel). Bis zu 5 Ebenen, 30+ Ausgabesprachen, Export als PNG, SVG oder Markdown, öffentliche Freigabe per Link und Deep-Research-Modus mit zitierten Quellen. Kostenlos starten mit 30 Credits.'
  );
  form.append('tag_slug', 'produktivitaet');
  form.append('company', ''); // honeypot: 必须留空

  const res = await fetch('https://www.ki-suche.io/einreichen', {
    method: 'POST',
    headers: { 'user-agent': UA, accept: 'text/html' },
    body: form,
    redirect: 'follow',
  });
  const html = await res.text();
  const titleM = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const rec = {
    site: 'ki-suche.io',
    status: res.status,
    finalUrl: res.url,
    title: titleM ? titleM[1].trim().slice(0, 150) : '',
    len: html.length,
    hasError: /fehler|error|ungültig|invalid|bereits|existiert/i.test(html),
    hasSuccess: /erfolgreich|danke|thank|eingereicht|vielen dank|success/i.test(html),
    sample: html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600),
  };
  results.push(rec);
  console.log('ki-suche.io:', JSON.stringify(rec));
  writeFileSync(join(OUT, 'submit-ki-suche-response.html'), html, 'utf8');
} catch (e) {
  console.log('ki-suche.io ERROR:', String(e.message || e));
  results.push({ site: 'ki-suche.io', error: String(e.message || e) });
}

// ---------- 2) iuu.ai ----------
try {
  const form2 = new FormData();
  form2.append('web_name', 'MindMapAny');
  form2.append('web_url', 'https://mindmapany.com');
  form2.append('email', 'support@mindmapany.com'); // 公开联系邮箱（官网披露）

  const res2 = await fetch('https://iuu.ai/submit', {
    method: 'POST',
    headers: { 'user-agent': UA, accept: 'text/html' },
    body: form2,
    redirect: 'follow',
  });
  const html2 = await res2.text();
  const titleM2 = html2.match(/<title[^>]*>([^<]*)<\/title>/i);
  const rec2 = {
    site: 'iuu.ai',
    status: res2.status,
    finalUrl: res2.url,
    title: titleM2 ? titleM2[1].trim().slice(0, 150) : '',
    len: html2.length,
    hasError: /error|invalid|already|exist|duplicate/i.test(html2),
    hasSuccess: /success|thank|submitted|added/i.test(html2),
    sample: html2.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').slice(0, 600),
  };
  results.push(rec2);
  console.log('iuu.ai:', JSON.stringify(rec2));
  writeFileSync(join(OUT, 'submit-iuu-response.html'), html2, 'utf8');
} catch (e) {
  console.log('iuu.ai ERROR:', String(e.message || e));
  results.push({ site: 'iuu.ai', error: String(e.message || e) });
}

writeFileSync(join(OUT, 'submit-http-summary.json'), JSON.stringify(results, null, 2), 'utf8');
