# Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard

Designed by: AARDMC

A static dashboard (no build step, no server) that reads the weekly IDSR data **live from your Google Sheet**
and shows completeness and timeliness, completeness status, disease burden, a sub-city heatmap, a watchlist,
trends and a searchable facility table. No CSV upload is needed.

## 1. Share the Google Sheet (one time)

1. Open the sheet and click **Share**.
2. Under **General access** choose **Anyone with the link** and the role **Viewer**, then **Done**.
3. Keep the column headers exactly as in the DHIS2 export and keep one row per facility per week.

The data link is already set (obfuscated) in `config.js` as `SHEET_URL`. To point at a different sheet or tab,
run the helper instead of pasting a plain link into the file:

```bash
node scripts/set-sheet-url.mjs "<data-sheet-link>" "<sub-city-id-sheet-link>"
node scripts/set-sheet-url.mjs --check          # decode and show the links currently in use
```

The `gid=` number in the link picks the tab (`gid=0` is the first tab).

> Anyone who has the link can read the sheet. Check your data-sharing policy first.

## Keeping the sheet links private

`config.js` stores both sheet links **obfuscated** (XOR + base64), so the plain URLs do not appear in the
published site's source, in GitHub, or in git history. Use `scripts/set-sheet-url.mjs` to update them.

What this does and does not protect against:

- **Does** stop casual "View Source", keyword/GitHub code search, and secret scanners from finding the link.
- **Does not** stop someone who opens **DevTools → Network**: this is a static, browser-only dashboard, so the
  browser must fetch the sheet directly and the request URL is visible there.

To go further (real hiding), keep `config.js` out of the repository and generate it at deploy time:

1. Copy `config.example.js` to `config.js` locally and add `config.js` to `.gitignore`.
2. In GitHub, add repository **Secrets**: `SHEET_URL` and `CREDENTIALS_URL` (the plain links).
3. In your Pages workflow, write `config.js` from those secrets before uploading the site. Encode the values
   with `scripts/set-sheet-url.mjs` so the deployed file stays obfuscated too.
4. For actual access control, stop using "Anyone with the link" and put a server-side proxy between the
   dashboard and the sheets, with the sheets kept private.

> If the links or sub-city IDs were ever exposed, rotate them (new sheet links / new IDs). Editing the file
> now does not remove old values from git history.

## 2. Add your logo

Save your logo as `assets/logo.png` (or set `LOGO` in `config.js`). A square or transparent-background logo looks best.

## 3. Put it on GitHub Pages

```bash
git init
git add .
git commit -m "IDSR dashboard"
git branch -M main
git remote add origin https://github.com/AARDMC/PHEM-DHIS2-Data-Quality.git
git push -u origin main
```

Then in the repo: **Settings -> Pages -> Build and deployment -> Source: GitHub Actions**.
The workflow in `.github/workflows/pages.yml` deploys on every push to `main`.
Your dashboard will be at `https://aardmc.github.io/PHEM-DHIS2-Data-Quality/`.

## 4. Weekly routine

Add the new week's rows to the Google Sheet. The dashboard re-reads the sheet every 5 minutes
(or click Refresh), and the trend chart grows as weeks are added.

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole dashboard (HTML, CSS, JS) |
| `config.js` | Obfuscated Google Sheet links, refresh interval, title, logo |
| `config.example.js` | Template for `config.js` |
| `scripts/set-sheet-url.mjs` | Set / verify the obfuscated sheet links |
| `assets/` | Put `logo.png` here |
| `.github/workflows/pages.yml` | GitHub Pages deployment (if you use Actions) |
