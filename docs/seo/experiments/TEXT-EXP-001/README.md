# TEXT-EXP-001 execution log

This experiment tests a bundled upgrade for `text to mind map`: embedded paste-to-map workflow, reproducible examples, metadata, task-focused guidance, expanded FAQ and contextual internal links. It cannot attribute movement to one element inside that bundle. It is planned for the same deployment window as PDF-EXP-001, so the frozen webpage tool control must be used to distinguish page-specific movement from site-wide movement.

## Weekly sequence

```bash
# The initial live baseline has already been captured. On deployment, record the real ID
npm run seo:experiment -- event TEXT-EXP-001 --type deployed --deployment DEPLOYMENT_ID --note "Embedded Text workflow deployed"

# Capture the deployed page and parsed SEO state
npm run seo:experiment -- snapshot TEXT-EXP-001 --kind after --label live-after --deployment DEPLOYMENT_ID

# Historical pre-deployment command (already completed for this round)
npm run seo:experiment -- snapshot TEXT-EXP-001 --kind before --label live-baseline

# After exporting the same GSC query × page × country × device report
npm run seo:experiment -- snapshot TEXT-EXP-001 --kind observation --label week-01
npm run seo:experiment -- event TEXT-EXP-001 --type gsc_exported --note "GSC data through YYYY-MM-DD saved as docs/seo/data/...csv"

# Inspect this experiment or the complete portfolio
npm run seo:experiment -- status TEXT-EXP-001
npm run seo:experiment -- list
```

Each weekly note must include the GSC data-through date. Do not store pasted user text, generated maps, file contents or PII in artifacts or analytics. A hand-checked SERP position is supporting evidence only, not the primary measurement.
