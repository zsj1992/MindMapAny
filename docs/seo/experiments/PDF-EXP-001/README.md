# PDF-EXP-001 execution log

This directory is the append-only evidence bundle for round 1. `experiment.json` defines the hypothesis and frozen variables. `events.ndjson` records actions in time order. `artifacts/` is created by the snapshot command and holds rendered HTML, a full-page screenshot and parsed SEO state with SHA-256 hashes.

## Required sequence

```bash
# Before deployment, against the currently live page
npm run seo:experiment -- snapshot PDF-EXP-001 --kind before --label live-before

# Record the deployment; use the real provider deployment ID
npm run seo:experiment -- event PDF-EXP-001 --type deployed --deployment DEPLOYMENT_ID --note "Round 1 deployed"

# Capture the deployed page
npm run seo:experiment -- snapshot PDF-EXP-001 --kind after --label live-after --deployment DEPLOYMENT_ID

# Every seven days, after adding the matching GSC export under docs/seo/data
npm run seo:experiment -- snapshot PDF-EXP-001 --kind observation --label week-01

# Inspect the complete ledger and current Git state
npm run seo:experiment -- status PDF-EXP-001
```

Do not record a ranking conclusion until both stopping conditions in `experiment.json` are met. A deployment event without its real deployment ID, an observation without its GSC export, or an event written from a dirty worktree must be treated as incomplete evidence, not silently repaired later.
