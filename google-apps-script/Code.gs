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
 */

const SHEET_NAME = 'Confirmaciones';

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
    sheet.getRange(1, 1, 1, 7).setFontWeight('bold');
  }
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
