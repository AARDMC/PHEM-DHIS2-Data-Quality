// ------------------------------------------------------------------
//  IDSR Dashboard configuration
//
//  The dashboard reads LIVE from Google Sheets (no CSV upload needed).
//  Both sheets must be shared:  Share > General access > "Anyone with the link" > Viewer.
//  The tab is picked by the gid=... number in the link (gid=0 is the first tab).
//
//  The two sheet links are stored OBFUSCATED (XOR + base64) so they never
//  appear as plain text in the published site, in GitHub, or in git history.
//  To change a link, run:  node scripts/set-sheet-url.mjs <data-url> [id-url]
//  See README.md > "Keeping the sheet links private" for details.
//
//  NOTE: obfuscation hides the links from casual source viewing; it is NOT
//  access control. A browser still fetches the sheet directly, so the URL is
//  visible in DevTools > Network. True secrecy requires a server-side proxy.
// ------------------------------------------------------------------

// reversible decoder: base64 -> XOR 0x5A -> original link
const __link = s => [...atob(s)].map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x5A)).join("");

window.IDSR_CONFIG = {
  // ---- data sheet (weekly IDSR facility reports) [obfuscated] ----
  SHEET_URL: __link("Mi4uKilgdXU+NTkpdD01NT02P3Q5NTd1KSooPzs+KTI/Py4pdT51a24sbw4gHhUMLhliGD4pKgAgbmltE2lqNDk3LiMjH2lvCSI5FxwRPA1tGwN1Pz4zLmUvKSpnPigzLD8FNjM0MQ=="),
  FALLBACK_CSV: "",                        // optional backup file path; leave empty for live data only
  REFRESH_MINUTES: 5,                      // auto-refresh interval (0 = off)

  // ---- private-sheet bridge (Google Apps Script web app) ----
  // When these are set, the dashboard reads through the proxy instead of
  // calling Google directly, so BOTH sheets can be made private.
  // Set them with: node scripts/set-sheet-url.mjs --proxy <data-url> <id-url>
  DATA_API_URL: __link(""),
  ID_API_URL: __link(""),

  // ---- sign-in sheet (Sub City ID tab) [obfuscated] ----
  // Headings:  ID  and  Sub_City  (one row per sub-city).
  // A user types their ID on the sign-in page and sees only their Sub_City's reports.
  CREDENTIALS_URL: __link("Mi4uKilgdXU+NTkpdD01NT02P3Q5NTd1KSooPzs+KTI/Py4pdT51axJpbz4tF2gqCxVsKj4jOSB3EjkVEQIzDDYWa2odAgACYwwsNz9uGRYgCx91Pz4zLmU9Mz5naGpjb2Njam1oY3k9Mz5naGpjb2Njam1oYw=="),
  CREDENTIALS_TAB: "Sub City ID",          // used if the gid in the link does not return the ID table
  ID_HEADING: "ID",
  SUBCITY_HEADING: "Sub_City",
  ADMIN_SUBCITY: "Addis Ababa PHEM",       // this Sub_City sees the full dashboard (all sub-cities)

  TITLE: "Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard",
  DESIGNED_BY: "AARDMC",
  LOGO: "assets/logo.png"                  // put your logo file at assets/logo.png (PNG/SVG/JPG) or change this path
};
