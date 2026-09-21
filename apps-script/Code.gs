/**
 * Bangur Complex Durga Puja 2026 — Google Apps Script Backend
 * 
 * Instructions:
 * 1. Open your Google Sheet: https://docs.google.com/spreadsheets/d/1oLa7_OfSUHLGej-LQ0_Y3Q9ITyPA2CbnHSuQ0IGHDaE/edit
 * 2. Click Extensions > Apps Script.
 * 3. Replace any code in Code.gs with this entire file.
 * 4. Run setupSheet() once (or let auto-setup create tabs upon first request).
 * 5. Click Deploy > New deployment:
 *    - Type: Web app
 *    - Description: Bangur Puja 2026 API
 *    - Execute as: Me (your email)
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and set it in frontend .env as:
 *    VITE_APPS_SCRIPT_URL=<Your Web App URL>
 */

const SPREADSHEET_ID = '1oLa7_OfSUHLGej-LQ0_Y3Q9ITyPA2CbnHSuQ0IGHDaE';

const TAB_CONTRIBUTIONS = 'Contributions';
const TAB_EXPENSES = 'Expenses';
const TAB_PERFORMANCES = 'Performances';
const TAB_VOLUNTEERS = 'Volunteers';

/**
 * Get active spreadsheet reference (works container-bound or standalone)
 */
function getSpreadsheet() {
  try {
    const active = SpreadsheetApp.getActiveSpreadsheet();
    if (active) return active;
  } catch (e) {}
  return SpreadsheetApp.openById(SPREADSHEET_ID);
}

/**
 * One-click Setup: Automatically creates and formats all tabs
 */
function setupSheet() {
  const ss = getSpreadsheet();
  
  // 1. Contributions tab
  let contSheet = ss.getSheetByName(TAB_CONTRIBUTIONS);
  if (!contSheet) {
    contSheet = ss.insertSheet(TAB_CONTRIBUTIONS);
  }
  if (contSheet.getLastRow() === 0) {
    const headers = [['Timestamp', 'Name', 'Amount', 'Mode']];
    contSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    contSheet.getRange(1, 1, 1, headers[0].length)
      .setFontWeight('bold')
      .setBackground('#8B0000')
      .setFontColor('#FFFFFF');
    contSheet.setFrozenRows(1);
    contSheet.setColumnWidth(1, 180);
    contSheet.setColumnWidth(2, 200);
    contSheet.setColumnWidth(3, 120);
    contSheet.setColumnWidth(4, 140);
  }

  // 2. Expenses tab
  let expSheet = ss.getSheetByName(TAB_EXPENSES);
  if (!expSheet) {
    expSheet = ss.insertSheet(TAB_EXPENSES);
  }
  if (expSheet.getLastRow() === 0) {
    const headers = [['Date', 'Item', 'Category', 'Amount', 'Paid To', 'Notes']];
    expSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    expSheet.getRange(1, 1, 1, headers[0].length)
      .setFontWeight('bold')
      .setBackground('#B8860B')
      .setFontColor('#FFFFFF');
    expSheet.setFrozenRows(1);
    expSheet.setColumnWidth(1, 120);
    expSheet.setColumnWidth(2, 220);
    expSheet.setColumnWidth(3, 150);
    expSheet.setColumnWidth(4, 120);
    expSheet.setColumnWidth(5, 180);
    expSheet.setColumnWidth(6, 250);
  }

  // 3. Performances tab
  let perfSheet = ss.getSheetByName(TAB_PERFORMANCES);
  if (!perfSheet) {
    perfSheet = ss.insertSheet(TAB_PERFORMANCES);
  }
  if (perfSheet.getLastRow() === 0) {
    const headers = [['Timestamp', 'Name', 'Act Name', 'Category', 'Contact']];
    perfSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    perfSheet.getRange(1, 1, 1, headers[0].length)
      .setFontWeight('bold')
      .setBackground('#166534')
      .setFontColor('#FFFFFF');
    perfSheet.setFrozenRows(1);
    perfSheet.setColumnWidth(1, 180);
    perfSheet.setColumnWidth(2, 200);
    perfSheet.setColumnWidth(3, 220);
    perfSheet.setColumnWidth(4, 140);
    perfSheet.setColumnWidth(5, 150);
  }

  // 4. Volunteers tab
  let volSheet = ss.getSheetByName(TAB_VOLUNTEERS);
  if (!volSheet) {
    volSheet = ss.insertSheet(TAB_VOLUNTEERS);
  }
  if (volSheet.getLastRow() === 0) {
    const headers = [['Timestamp', 'Name', 'Role', 'Availability', 'Contact', 'Notes']];
    volSheet.getRange(1, 1, 1, headers[0].length).setValues(headers);
    volSheet.getRange(1, 1, 1, headers[0].length)
      .setFontWeight('bold')
      .setBackground('#1E3A8A')
      .setFontColor('#FFFFFF');
    volSheet.setFrozenRows(1);
    volSheet.setColumnWidth(1, 180);
    volSheet.setColumnWidth(2, 200);
    volSheet.setColumnWidth(3, 220);
    volSheet.setColumnWidth(4, 180);
    volSheet.setColumnWidth(5, 150);
    volSheet.setColumnWidth(6, 250);
  }

  Logger.log('Bangur Durga Puja 2026 sheets initialized successfully.');
  return { success: true, message: 'All sheets initialized with required columns.' };
}

/**
 * Ensures sheets exist when an API call arrives
 */
function ensureSheetsExist() {
  const ss = getSpreadsheet();
  if (
    !ss.getSheetByName(TAB_CONTRIBUTIONS) ||
    !ss.getSheetByName(TAB_EXPENSES) ||
    !ss.getSheetByName(TAB_PERFORMANCES) ||
    !ss.getSheetByName(TAB_VOLUNTEERS)
  ) {
    setupSheet();
  }
}

/**
 * Handle HTTP GET Requests
 */
function doGet(e) {
  try {
    ensureSheetsExist();
    const action = (e && e.parameter && e.parameter.action) || '';

    if (action === 'getContributions') {
      return handleGetContributions();
    } else if (action === 'getExpenses') {
      return handleGetExpenses();
    } else if (action === 'getPerformances') {
      return handleGetPerformances();
    } else if (action === 'getVolunteers') {
      return handleGetVolunteers();
    } else if (action === 'setup') {
      return jsonResponse(setupSheet());
    } else {
      return jsonResponse({
        success: false,
        error: 'Invalid or missing action parameter. Valid actions: getContributions, getExpenses, getPerformances, getVolunteers'
      });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'Server error: ' + err.toString()
    });
  }
}

/**
 * Handle HTTP POST Requests
 */
function doPost(e) {
  try {
    ensureSheetsExist();

    let data = {};
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter || {};
      }
    } else if (e.parameter) {
      data = e.parameter;
    }

    const action = data.action || (e.parameter && e.parameter.action);

    // Honeypot check: If bot filled the hidden honeypot field, reject quietly
    if (data.honeypot && String(data.honeypot).trim().length > 0) {
      return jsonResponse({ success: true, message: 'Recorded successfully' });
    }

    if (action === 'addContribution') {
      return handleAddContribution(data);
    } else if (action === 'addPerformanceRegistration') {
      return handleAddPerformance(data);
    } else if (action === 'addVolunteer') {
      return handleAddVolunteer(data);
    } else {
      return jsonResponse({
        success: false,
        error: 'Unknown action: ' + action
      });
    }
  } catch (err) {
    return jsonResponse({
      success: false,
      error: 'Server error: ' + err.toString()
    });
  }
}

/**
 * Public Contributions List
 * NOTE: As per critical user instructions:
 * 1. Amount is NEVER sent to browser in plain text - masked server-side
 * 2. Mode is NOT shown on the public list - only name and masked amount
 */
function handleGetContributions() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_CONTRIBUTIONS);
  if (!sheet) return jsonResponse({ contributions: [] });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return jsonResponse({ contributions: [] });
  }

  // Row columns: [Timestamp, Name, Amount, Mode]
  const values = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
  const contributions = [];
  let totalAmount = 0;

  for (let i = values.length - 1; i >= 0; i--) { // Newest first
    const row = values[i];
    const name = String(row[1] || '').trim();
    const amt = Number(row[2]) || 0;
    totalAmount += amt;

    if (name) {
      contributions.push({
        name: name,
        amountMasked: '₹ ● ● ● ●'
      });
    }
  }

  return jsonResponse({
    success: true,
    contributions: contributions,
    totalCount: contributions.length,
    totalAmount: totalAmount
  });
}

/**
 * Read-only Expenses Tab Mirror
 */
function handleGetExpenses() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_EXPENSES);
  if (!sheet) return jsonResponse({ expenses: [], totalAmount: 0 });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return jsonResponse({ expenses: [], totalAmount: 0 });
  }

  // Row columns: [Date, Item, Category, Amount, Paid To, Notes]
  const values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  const expenses = [];
  let totalAmount = 0;

  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const item = String(row[1] || '').trim();
    if (item) {
      let dateVal = row[0];
      let formattedDate = '';
      if (dateVal instanceof Date) {
        formattedDate = Utilities.formatDate(dateVal, Session.getScriptTimeZone() || 'GMT+05:30', 'yyyy-MM-dd');
      } else {
        formattedDate = String(dateVal || '');
      }

      const amt = Number(row[3]) || 0;
      totalAmount += amt;

      expenses.push({
        date: formattedDate,
        item: item,
        category: String(row[2] || 'General').trim(),
        amount: amt,
        paidTo: String(row[4] || '').trim(),
        notes: String(row[5] || '').trim()
      });
    }
  }

  return jsonResponse({
    success: true,
    expenses: expenses,
    totalAmount: totalAmount
  });
}

/**
 * Public Performances List
 * NOTE: Contact number is strictly EXCLUDED from public output
 */
function handleGetPerformances() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_PERFORMANCES);
  if (!sheet) return jsonResponse({ performances: [] });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return jsonResponse({ performances: [] });
  }

  // Row columns: [Timestamp, Name, Act Name, Category, Contact]
  const values = sheet.getRange(2, 1, lastRow - 1, 5).getValues();
  const performances = [];

  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const name = String(row[1] || '').trim();
    const actName = String(row[2] || '').trim();
    if (name && actName) {
      performances.push({
        name: name,
        actName: actName,
        category: String(row[3] || 'Other').trim()
      });
    }
  }

  return jsonResponse({
    success: true,
    performances: performances,
    totalCount: performances.length
  });
}

/**
 * Add Contribution
 */
function handleAddContribution(data) {
  const name = String(data.name || '').trim();
  const amount = Number(data.amount);
  const mode = String(data.mode || '').trim();

  // Server-side validation
  if (!name || name.length > 100) {
    return jsonResponse({ success: false, error: 'Name is required (max 100 characters)' });
  }
  if (!amount || isNaN(amount) || amount <= 0) {
    return jsonResponse({ success: false, error: 'Amount must be a positive number' });
  }
  const allowedModes = ['Cash', 'UPI', 'Bank Transfer'];
  if (!allowedModes.includes(mode)) {
    return jsonResponse({ success: false, error: 'Mode must be Cash, UPI, or Bank Transfer' });
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_CONTRIBUTIONS);
  if (!sheet) {
    return jsonResponse({ success: false, error: 'Contributions sheet not found' });
  }

  sheet.appendRow([new Date(), name, amount, mode]);

  return jsonResponse({
    success: true,
    message: 'Contribution recorded successfully. Thank you for supporting Bangur Durga Puja!'
  });
}

/**
 * Add Performance Registration
 */
function handleAddPerformance(data) {
  const name = String(data.name || '').trim();
  const actName = String(data.actName || '').trim();
  const category = String(data.category || 'Other').trim();
  const contact = String(data.contact || '').trim();

  // Server-side validation
  if (!name || name.length > 100) {
    return jsonResponse({ success: false, error: 'Participant name is required (max 100 characters)' });
  }
  if (!actName || actName.length > 150) {
    return jsonResponse({ success: false, error: 'Act name is required (max 150 characters)' });
  }
  if (contact && contact.length > 25) {
    return jsonResponse({ success: false, error: 'Contact number cannot exceed 25 characters' });
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_PERFORMANCES);
  if (!sheet) {
    return jsonResponse({ success: false, error: 'Performances sheet not found' });
  }

  sheet.appendRow([new Date(), name, actName, category, contact]);

  return jsonResponse({
    success: true,
    message: 'Performance registration received successfully! See you on stage.'
  });
}

/**
 * Public Volunteers List
 * NOTE: Contact and notes are strictly kept private for the committee
 */
function handleGetVolunteers() {
  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_VOLUNTEERS);
  if (!sheet) return jsonResponse({ volunteers: [] });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    return jsonResponse({ volunteers: [] });
  }

  // Row columns: [Timestamp, Name, Role, Availability, Contact, Notes]
  const values = sheet.getRange(2, 1, lastRow - 1, 6).getValues();
  const volunteers = [];

  for (let i = values.length - 1; i >= 0; i--) {
    const row = values[i];
    const name = String(row[1] || '').trim();
    const role = String(row[2] || '').trim();
    if (name) {
      volunteers.push({
        name: name,
        role: role || 'General Help & Support',
        availability: String(row[3] || 'Flexible').trim()
      });
    }
  }

  return jsonResponse({
    success: true,
    volunteers: volunteers,
    totalCount: volunteers.length
  });
}

/**
 * Add Volunteer Registration
 */
function handleAddVolunteer(data) {
  const name = String(data.name || '').trim();
  const role = String(data.role || 'General Help & Support').trim();
  const availability = String(data.availability || 'All Days').trim();
  const contact = String(data.contact || '').trim();
  const notes = String(data.notes || '').trim();

  // Server-side validation
  if (!name || name.length > 100) {
    return jsonResponse({ success: false, error: 'Volunteer name is required (max 100 characters)' });
  }
  if (!role || role.length > 100) {
    return jsonResponse({ success: false, error: 'Volunteer role is required' });
  }
  if (contact && contact.length > 25) {
    return jsonResponse({ success: false, error: 'Contact number cannot exceed 25 characters' });
  }
  if (notes && notes.length > 500) {
    return jsonResponse({ success: false, error: 'Notes cannot exceed 500 characters' });
  }

  const ss = getSpreadsheet();
  const sheet = ss.getSheetByName(TAB_VOLUNTEERS);
  if (!sheet) {
    return jsonResponse({ success: false, error: 'Volunteers sheet not found' });
  }

  sheet.appendRow([new Date(), name, role, availability, contact, notes]);

  return jsonResponse({
    success: true,
    message: 'Welcome to the Bangur Puja 2026 volunteer squad! The committee will connect with you soon.'
  });
}

/**
 * Utility: Standard JSON Response with proper mime type
 */
function jsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
