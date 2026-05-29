/**
 * Google Sheets · Confirmaciones RSVP
 *
 * CONFIGURACIÓN (una sola vez):
 * 1. Crea una hoja en Google Drive (Archivo → Hoja de cálculo).
 * 2. Extensoiones → Apps Script → pega este archivo y guarda.
 * 3. Despliega → Nueva implementación → Tipo: Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquiera
 * 4. Copia la URL que termina en /exec y pégala en config.js → rsvpEndpoint
 * 5. Colores por asistencia: ejecuta aplicarColoresAsistencia() una vez (▶ Run)
 */

const SHEET_NAME = 'Confirmaciones';
const DATA_COLS = 7;
const DATA_ROWS = 500;

/** Ejecuta esta función una vez si la hoja ya tenía datos (▶ en Apps Script). */
function aplicarColoresAsistencia() {
  applyAttendanceColors_(getSheet_());
}

function applyAttendanceColors_(sheet) {
  const range = sheet.getRange(2, 1, DATA_ROWS, DATA_COLS);

  const ruleSi = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$C2="si"')
    .setBackground('#b8e0c8')
    .setFontColor('#0a4838')
    .setRanges([range])
    .build();

  const ruleNo = SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=$C2="no"')
    .setBackground('#e8b0b0')
    .setFontColor('#5c2020')
    .setRanges([range])
    .build();

  sheet.setConditionalFormatRules([ruleSi, ruleNo]);
}

function getSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      'Fecha registro',
      'Nombre',
      'Asistencia',
      'Invitados',
      'Mensaje',
      'Canción',
      'Fecha envío (ISO)'
    ]);
    sheet.getRange(1, 1, 1, DATA_COLS).setFontWeight('bold');
  }

  applyAttendanceColors_(sheet);
  return sheet;
}

function parsePayload_(e) {
  if (e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  return e.parameter || {};
}

function doPost(e) {
  try {
    const data = parsePayload_(e);
    const sheet = getSheet_();

    sheet.appendRow([
      new Date(),
      data.nombre || '',
      data.asistencia || '',
      data.invitados || '',
      data.mensaje || '',
      data.cancion || '',
      data.fechaEnvio || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Prueba en el navegador: https://script.google.com/.../exec?test=1 */
function doGet() {
  return ContentService
    .createTextOutput('RSVP webhook activo. Usa POST desde la invitación.')
    .setMimeType(ContentService.MimeType.TEXT);
}
