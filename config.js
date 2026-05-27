/* ============================================================
   CONFIGURACIÓN DE LA BODA
   Edita estos valores para personalizar la invitación
   ============================================================ */
const WEDDING_CONFIG = {
  novios: {
    novio: "Kevin",
    novia: "Maira"
  },

  // Fecha y hora del evento (formato 24h)
  // Año, Mes (0 = Enero, 11 = Diciembre), Día, Hora, Minuto
  fecha: new Date(2026, 7, 30, 16, 0, 0), // 30 de Agosto 2026, 4:00 PM

  // Texto que se muestra debajo del nombre
  fechaTexto: "Domingo · 30 · Agosto · 2026",
  fechaCorta: "30 · 08 · 2026",
  fechaHistoria: "30 de Agosto, 2026",

  // Imagen de portada (hero)
  portada: "img/P-4.JPG",

  // Endpoint opcional para enviar RSVP a un servicio externo
  // (Google Forms, Formspree, etc.). Déjalo vacío para solo guardarlo localmente.
  rsvpEndpoint: ""
};
