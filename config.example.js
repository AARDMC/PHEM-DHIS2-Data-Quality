// Template for config.js.
// Copy to config.js, then run:
//   node scripts/set-sheet-url.mjs "<data-sheet-url>" "<id-sheet-url>"
// That writes the obfuscated links into config.js for you.
//
// If you prefer to keep config.js OUT of git entirely:
//   1. add `config.js` to .gitignore
//   2. store the two plain URLs as GitHub Actions secrets SHEET_URL / CREDENTIALS_URL
//   3. generate config.js in your Pages workflow before uploading the site
// See README.md > "Keeping the sheet links private".

const __link = s => [...atob(s)].map(c => String.fromCharCode(c.charCodeAt(0) ^ 0x5A)).join("");

window.IDSR_CONFIG = {
  // replaced by scripts/set-sheet-url.mjs (do not paste plain links here)
  SHEET_URL: __link(""),
  FALLBACK_CSV: "",
  REFRESH_MINUTES: 5,

  CREDENTIALS_URL: __link(""),
  CREDENTIALS_TAB: "Sub City ID",
  ID_HEADING: "ID",
  SUBCITY_HEADING: "Sub_City",
  ADMIN_SUBCITY: "Addis Ababa PHEM",

  TITLE: "Addis Ababa City PHEM DHIS2 Data Quality Monitoring Dashboard",
  DESIGNED_BY: "AARDMC",
  LOGO: "assets/logo.png"
};
