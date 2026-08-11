# MindMapAny Chrome Extension

Manifest V3 extension for capturing the active page, selected text, or a web PDF and handing it to the authenticated MindMapAny workspace.

## Privacy and permissions

- `activeTab`: grants access only after the user opens the extension on a page.
- `scripting`: extracts visible text from that active tab; no background browsing.
- `storage`: holds one single-use payload for at most 15 minutes so captured text never appears in a URL or browser history.
- `https://mindmapany.com/*`: delivers the single-use payload to the first-party workspace.

The extension does not request browsing history, cookies, all-site host access, or background execution.

## Local verification

1. Run `npm run extension:icons` after changing `icon.svg`.
2. Open `chrome://extensions`, enable Developer mode, and load this directory unpacked.
3. Test a public article, a text selection, and a public PDF URL.

The checked-in manifest targets production intentionally. Do not add localhost or `<all_urls>` to the store build.
