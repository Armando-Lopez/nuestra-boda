/* ============================================================
   CONFIGURACIÓN DE LA BODA
   Edita estos valores para personalizar la invitación
   ============================================================ */
window.WEDDING_CONFIG = {
  novios: {
    novio: "Kevin",
    novia: "Maira"
  },

  // Fecha y hora del evento (hora local de tu PC)
  // Formato: AAAA-MM-DDTHH:MM:SS  (mes 08 = agosto)
  fecha: "2026-08-30T19:00:00",

  // Texto que se muestra debajo del nombre
  fechaTexto: "Domingo · 30 · Agosto · 2026",
  fechaCorta: "30 · 08 · 2026",
  fechaHistoria: "30 de Agosto, 2026",

  // Imagen de portada (hero)
  portada: "img/P-4.JPG",

  // Música al abrir el sobre
  musica: "music/nuestro-sueño.mp3",

  // URL de la aplicación web de Google Apps Script (termina en /exec)
  // Ver google-apps-script/Code.gs para crear la hoja y obtener la URL.
  rsvpEndpoint: "https://script.google.com/macros/s/AKfycbw4MVClCg1-ja4_WwjSDn3-cLdHRgWGu7mV_zFA9T4I-Oq3-FcGF8XeSyykAZsYXrrUyw/exec"
};
