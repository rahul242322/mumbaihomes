/**
 * Google Apps Script — appends website leads to a Google Sheet.
 *
 * Setup:
 *  1. Create a Google Sheet. Extensions > Apps Script. Paste this file.
 *  2. Deploy > New deployment > type "Web app".
 *       Execute as: Me
 *       Who has access: Anyone
 *  3. Copy the /exec URL into SITE_CONFIG.sheetsUrl in index.html.
 *
 * The page posts with mode:'no-cors', so it cannot read this response —
 * check the Sheet itself when testing.
 */

var HEADERS = ['submittedAt', 'name', 'phone', 'email', 'configuration', 'source', 'project', 'page'];

function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
  var lead = JSON.parse(e.postData.contents);

  if (sheet.getLastRow() === 0) sheet.appendRow(HEADERS);

  sheet.appendRow(HEADERS.map(function (key) { return lead[key] || ''; }));

  // Optional: also email the sales team on every lead.
  // MailApp.sendEmail('sales@example.com', 'New lead — ' + lead.name, JSON.stringify(lead, null, 2));

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}
