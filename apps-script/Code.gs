/**
 * Private-sheet bridge for the IDSR dashboard.
 *
 * The static site must NOT contain the Google Sheet IDs. This script runs as
 * YOU inside Google, opens the private sheets, and serves CSV to the dashboard.
 *
 * SETUP (one time)
 * ----------------
 * 1. Open either Google Sheet > Extensions > Apps Script.
 * 2. Paste this file into Code.gs and save.
 * 3. Project Settings (gear icon) > Script Properties > Add script property:
 *      DATA_SHEET_ID   = the weekly-reports sheet ID  (the long string in its URL)
 *      ID_SHEET_ID     = the "Sub City ID" sheet ID
 *      DATA_GID        = 0                    (optional; tab number for the reports)
 *      ID_SHEET_NAME   = Sub City ID          (optional; tab name for the IDs)
 *      API_TOKEN       = a random secret      (optional extra check)
 * 4. Deploy > New deployment > Web app:
 *      Execute as:        Me
 *      Who has access:    Anyone
 *    Copy the /exec URL.
 * 5. In your repo run:
 *      node scripts/set-sheet-url.mjs --proxy \
 *        "<exec-url>?type=data&token=YOUR_TOKEN" \
 *        "<exec-url>?type=ids&token=YOUR_TOKEN"
 *    (omit &token=... if you did not set API_TOKEN)
 * 6. Confirm the dashboard loads, THEN in both sheets:
 *      Share > General access > change "Anyone with the link" to "Restricted".
 *
 * Sheet IDs / tokens stay here in Script Properties - they are never shipped
 * to the browser. The web app URL itself is harmless: it only returns CSV.
 */

function doGet(e) {
  const p = (e && e.parameter) || {};
  const props = PropertiesService.getScriptProperties();
  const token = props.getProperty('API_TOKEN') || '';

  if (token && p.token !== token) {
    return text('Forbidden', ContentService.MimeType.TEXT);
  }

  const isIds = p.type === 'ids';
  const sheetId = props.getProperty(isIds ? 'ID_SHEET_ID' : 'DATA_SHEET_ID');
  if (!sheetId) return text('Not configured', ContentService.MimeType.TEXT);

  let ss;
  try {
    ss = SpreadsheetApp.openById(sheetId);
  } catch (err) {
    return text('Cannot open sheet: ' + err.message, ContentService.MimeType.TEXT);
  }

  const name = p.sheet || (isIds ? (props.getProperty('ID_SHEET_NAME') || 'Sub City ID') : '');
  let sh = name ? ss.getSheetByName(name) : null;
  if (!sh) {
    const gid = p.gid || (isIds ? '' : props.getProperty('DATA_GID'));
    sh = gid ? ss.getSheets().find(s => String(s.getSheetId()) === String(gid)) : null;
  }
  if (!sh) sh = ss.getSheets()[0];
  if (!sh) return text('No sheets found', ContentService.MimeType.TEXT);

  const csv = toCsv(sh.getDataRange().getDisplayValues());

  // JSONP fallback for browsers that block cross-origin fetch.
  const cb = p.callback;
  if (cb && /^[A-Za-z0-9_$]+$/.test(cb)) {
    return text(cb + '(' + JSON.stringify(csv) + ');', ContentService.MimeType.JAVASCRIPT);
  }
  return text(csv, ContentService.MimeType.CSV);
}

function toCsv(rows) {
  return rows.map(function (row) {
    return row.map(function (v) {
      const s = String(v == null ? '' : v);
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    }).join(',');
  }).join('\r\n');
}

function text(body, mime) {
  return ContentService.createTextOutput(body).setMimeType(mime);
}
