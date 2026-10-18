// ------------------------------------------------------------------
//  IDSR Dashboard configuration
//
//  The dashboard reads LIVE from Google Sheets (no CSV upload needed).
//  Both sheets must be shared:  Share > General access > "Anyone with the link" > Viewer.
//  The tab is picked by the gid=... number in the link (gid=0 is the first tab).
// ------------------------------------------------------------------
window.IDSR_CONFIG = {
  // ---- data sheet (weekly IDSR facility reports) ----
  SHEET_URL: "https://docs.google.com/spreadsheets/d/1eT2O1CfgdhkMqxnxoFKYxoyHG8WulCuJIVXL6qI12-o/edit?gid=0#gid=0",
  FALLBACK_CSV: "",                        // optional backup file path; leave empty for live data only
  REFRESH_MINUTES: 5,                      // auto-refresh interval (0 = off)

  // ---- sign-in sheet ----
  // Tab "Sub City ID" with the headings  ID  and  Sub_City  (one row per sub-city).
  // A user types their ID on the sign-in page and sees only the reports of the Sub_City on that row.
  CREDENTIALS_URL: "https://docs.google.com/spreadsheets/d/1H35dwM2pQO6pdycz-HcOKXiVlL10GXZX9Vvme4CLzQE/edit?gid=2095990729#gid=2095990729",
  CREDENTIALS_TAB: "Sub City ID",          // used if the gid in the link does not return the ID table
  ID_HEADING: "ID",
  SUBCITY_HEADING: "Sub_City",
  ADMIN_SUBCITY: "Addis Ababa PHEM",       // this Sub_City sees the full dashboard (all sub-cities)

  TITLE: "Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard",
  DESIGNED_BY: "AARDMC",
  LOGO: "assets/logo.png"                  // put your logo file at assets/logo.png (PNG/SVG/JPG) or change this path
};
