// ------------------------------------------------------------------
//  IDSR Dashboard configuration
//
//  The dashboard reads LIVE from this Google Sheet (no CSV upload needed).
//  The sheet must be shared:  Share > General access > "Anyone with the link" > Viewer.
//  The tab is picked by the gid=... number in the link (gid=0 is the first tab).
// ------------------------------------------------------------------
window.IDSR_CONFIG = {
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1BTi1SYNNyz55z_-OjW47iQEcUoKmhWAolz4D5Pk2QmA/edit?gid=0#gid=0",
  FALLBACK_CSV: "",                        // optional backup file path; leave empty for live data only
  REFRESH_MINUTES: 5,                      // auto-refresh interval (0 = off)
  TITLE: "Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard",
  DESIGNED_BY: "AARDMC",
  LOGO: "assets/logo.png"                  // put your logo file at assets/logo.png (PNG/SVG/JPG) or change this path
};
