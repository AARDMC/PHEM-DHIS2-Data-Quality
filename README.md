# Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard

Designed by: AARDMC

A static dashboard (no build step, no server) that reads the weekly IDSR data **live from your Google Sheet**
and shows completeness and timeliness, completeness status, disease burden, a sub-city heatmap, a watchlist,
trends and a searchable facility table. No CSV upload is needed.

## 1. Share the Google Sheet (one time)

1. Open the sheet and click **Share**.
2. Under **General access** choose **Anyone with the link** and the role **Viewer**, then **Done**.
3. Keep the column headers exactly as in the DHIS2 export and keep one row per facility per week.

The link is already set in `config.js` (`SHEET_URL`). To use another tab, open that tab in Google Sheets and
paste its link instead (the `gid=` number picks the tab).

> Anyone who has the link can read the sheet. Check your data-sharing policy first.

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
| `config.js` | Google Sheet link, refresh interval, title, logo |
| `assets/` | Put `logo.png` here |
| `.github/workflows/pages.yml` | GitHub Pages deployment |
