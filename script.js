/* ============================================================
   Kevin & Maira · Wedding Invitation
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('loader')?.classList.add('hidden');
    }, 600);
  });

  /* ---------- Configurar fechas ---------- */
  const cfg = window.WEDDING_CONFIG;

  /* ---------- Música al abrir el sobre ---------- */
  const weddingAudio = document.getElementById('weddingMusic');
  if (weddingAudio && cfg?.musica) {
    weddingAudio.src = cfg.musica;
  }

  function playWeddingMusic() {
    if (!weddingAudio) return;
    weddingAudio.volume = 0.7;
    weddingAudio.play().catch(() => {});
  }

  /* ---------- Sobre de entrada ---------- */
  const envelopeScreen = document.getElementById('envelopeScreen');

  function openEnvelope() {
    if (!envelopeScreen || envelopeScreen.classList.contains('opening')) return;

    playWeddingMusic();

    envelopeScreen.classList.add('opening');
    envelopeScreen.setAttribute('aria-busy', 'true');

    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      envelopeScreen.setAttribute('aria-hidden', 'true');
      envelopeScreen.removeAttribute('aria-busy');
      document.body.classList.remove('envelope-locked');
    }, 2200);
  }

  envelopeScreen?.addEventListener('click', openEnvelope);
  envelopeScreen?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openEnvelope();
    }
  });

  const envelopeDate = document.getElementById('envelopeDate');
  const envelopeDateTop = document.getElementById('envelopeDateTop');
  if (envelopeDate && cfg?.fechaHistoria) {
    envelopeDate.textContent = cfg.fechaHistoria;
  }
  if (envelopeDateTop && cfg?.fecha) {
    const wedding = parseWeddingDate(cfg.fecha);
    if (wedding) {
      const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
      envelopeDateTop.textContent =
        `${wedding.getDate()} ${months[wedding.getMonth()]} ${wedding.getFullYear()}`;
    }
  }

  /** Parsea "2026-08-30T16:00:00" como hora local (evita errores de zona horaria). */
  function parseWeddingDate(value) {
    if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
    if (typeof value !== 'string') return null;

    const match = value.trim().match(
      /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2})(?::(\d{2}))?)?$/
    );
    if (!match) return null;

    const [, year, month, day, hour = '0', minute = '0', second = '0'] = match;
    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second)
    );
  }

  if (cfg) {
    const $ = (id) => document.getElementById(id);
    if (cfg.fechaTexto)    $('weddingDateLabel') && ($('weddingDateLabel').textContent = cfg.fechaTexto);
    if (cfg.fechaHistoria) $('storyDateLabel')   && ($('storyDateLabel').textContent   = cfg.fechaHistoria);
    if (cfg.fechaCorta)    $('footerDate')       && ($('footerDate').textContent       = cfg.fechaCorta);
    if (cfg.portada) {
      const heroImg = document.querySelector('.hero-media img');
      if (heroImg) heroImg.src = cfg.portada;
    }
  }

  /* ---------- Cuenta regresiva ---------- */
  const weddingDate = parseWeddingDate(cfg?.fecha) ?? parseWeddingDate('2026-08-30T19:00:00');
  const targetDate = weddingDate.getTime();

  const cdEls = {
    days:  [document.getElementById('cd-days'),  document.getElementById('hcd-days')],
    hours: [document.getElementById('cd-hours'), document.getElementById('hcd-hours')],
    mins:  [document.getElementById('cd-mins'),  document.getElementById('hcd-mins')],
    secs:  [document.getElementById('cd-secs'),  document.getElementById('hcd-secs')]
  };

  const pad = (n) => String(n).padStart(2, '0');
  const setAll = (arr, val) => arr.forEach(el => { if (el) el.textContent = val; });

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      setAll(cdEls.days,  '00');
      setAll(cdEls.hours, '00');
      setAll(cdEls.mins,  '00');
      setAll(cdEls.secs,  '00');
      return;
    }

    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const mins  = Math.floor((diff / (1000 * 60)) % 60);
    const secs  = Math.floor((diff / 1000) % 60);

    setAll(cdEls.days,  pad(days));
    setAll(cdEls.hours, pad(hours));
    setAll(cdEls.mins,  pad(mins));
    setAll(cdEls.secs,  pad(secs));
  }
  updateCountdown();
  setInterval(updateCountdown, 1000);

  /* ---------- Nav: scroll & móvil ---------- */
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  });

  navToggle?.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      navToggle?.classList.remove('active');
      navLinks?.classList.remove('open');
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Lightbox de la galería ---------- */
  const galleryLinks = Array.from(document.querySelectorAll('.gallery-item[data-lightbox]'));

  if (galleryLinks.length) {
    // Crear el lightbox una sola vez
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML = `
      <button class="lightbox-close" aria-label="Cerrar">✕</button>
      <button class="lightbox-prev" aria-label="Anterior">‹</button>
      <button class="lightbox-next" aria-label="Siguiente">›</button>
      <img alt="">
      <div class="lightbox-counter"></div>
    `;
    document.body.appendChild(lb);

    const lbImg = lb.querySelector('img');
    const lbCounter = lb.querySelector('.lightbox-counter');
    const lbClose = lb.querySelector('.lightbox-close');
    const lbPrev = lb.querySelector('.lightbox-prev');
    const lbNext = lb.querySelector('.lightbox-next');

    let currentIndex = 0;

    const showAt = (i) => {
      currentIndex = (i + galleryLinks.length) % galleryLinks.length;
      const href = galleryLinks[currentIndex].getAttribute('href');
      lbImg.src = href;
      lbCounter.textContent = `${currentIndex + 1} / ${galleryLinks.length}`;
    };

    const open = (i) => {
      showAt(i);
      lb.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      lb.classList.remove('open');
      document.body.style.overflow = '';
      setTimeout(() => { lbImg.src = ''; }, 300);
    };

    galleryLinks.forEach((a, i) => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        open(i);
      });
    });

    lbClose.addEventListener('click', close);
    lbPrev.addEventListener('click', () => showAt(currentIndex - 1));
    lbNext.addEventListener('click', () => showAt(currentIndex + 1));

    lb.addEventListener('click', (e) => {
      if (e.target === lb) close();
    });

    document.addEventListener('keydown', (e) => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') showAt(currentIndex - 1);
      if (e.key === 'ArrowRight') showAt(currentIndex + 1);
    });
  }

  /* ---------- RSVP form ---------- */
  const form = document.getElementById('rsvpForm');
  const rsvpModal = document.getElementById('rsvpModal');
  const rsvpModalIcon = document.getElementById('rsvpModalIcon');
  const rsvpModalTitle = document.getElementById('rsvpModalTitle');
  const rsvpModalText = document.getElementById('rsvpModalText');
  const rsvpModalWhatsApp = document.getElementById('rsvpModalWhatsApp');
  const asistenciaSelect = document.getElementById('rsvpAsistencia');
  const invitadosSelect = document.getElementById('rsvpInvitados');
  const attendingFields = document.getElementById('rsvpAttendingFields');

  function toggleAttendingFields() {
    const asiste = asistenciaSelect?.value === 'si';
    attendingFields?.classList.toggle('hidden', !asiste);

    if (!asiste && invitadosSelect) {
      invitadosSelect.value = '1';
    }
  }

  asistenciaSelect?.addEventListener('change', toggleAttendingFields);
  toggleAttendingFields();

  function buildRsvpWhatsAppMessage(payload) {
    const novia = cfg?.novios?.novia || 'Maira';
    const asiste = payload.asistencia === 'si';
    const lines = [
      `Hola ${novia}, quiero confirmar mi asistencia a la boda:`,
      '',
      `Nombre: ${payload.nombre || ''}`,
      `¿Asistirá?: ${asiste ? 'Sí' : 'No'}`
    ];

    if (asiste && payload.invitados) {
      lines.push(`Personas: ${payload.invitados}`);
    }
    if (payload.mensaje?.trim()) {
      lines.push(`Mensaje: ${payload.mensaje.trim()}`);
    }
    if (payload.cancion?.trim()) {
      lines.push(`Canción sugerida: ${payload.cancion.trim()}`);
    }

    return lines.join('\n');
  }

  function getRsvpWhatsAppUrl(payload) {
    const phone = cfg?.whatsappNovia?.replace(/\D/g, '');
    if (!phone) return '';

    const text = encodeURIComponent(buildRsvpWhatsAppMessage(payload));
    return `https://wa.me/${phone}?text=${text}`;
  }

  function openRsvpModal({ type = 'success', icon, title, text, whatsappPayload = null }) {
    if (!rsvpModal) return;

    rsvpModal.classList.toggle('rsvp-modal--error', type === 'error');
    if (rsvpModalIcon) rsvpModalIcon.textContent = icon;
    if (rsvpModalTitle) rsvpModalTitle.textContent = title;
    if (rsvpModalText) rsvpModalText.textContent = text;

    if (rsvpModalWhatsApp) {
      if (whatsappPayload && cfg?.whatsappNovia) {
        rsvpModalWhatsApp.href = getRsvpWhatsAppUrl(whatsappPayload);
        rsvpModalWhatsApp.classList.remove('hidden');
      } else {
        rsvpModalWhatsApp.href = '#';
        rsvpModalWhatsApp.classList.add('hidden');
      }
    }

    rsvpModal.classList.add('open');
    rsvpModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    (rsvpModalWhatsApp && !rsvpModalWhatsApp.classList.contains('hidden')
      ? rsvpModalWhatsApp
      : rsvpModal.querySelector('.rsvp-modal__btn')
    )?.focus();
  }

  function closeRsvpModal() {
    if (!rsvpModal) return;
    rsvpModal.classList.remove('open', 'rsvp-modal--error');
    rsvpModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    rsvpModalWhatsApp?.classList.add('hidden');
  }

  rsvpModal?.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeRsvpModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && rsvpModal?.classList.contains('open')) {
      closeRsvpModal();
    }
  });

  function showRsvpSuccess(data) {
    const nombre = data.nombre.trim().split(/\s+/)[0];
    const asiste = data.asistencia === 'si';

    openRsvpModal({
      type: 'success',
      icon: asiste ? '💚' : '💌',
      title: asiste ? '¡Confirmado!' : 'Gracias por avisarnos',
      text: asiste
        ? `${nombre}, recibimos tu confirmación. ¡Nos vemos en la boda!`
        : `${nombre}, lamentamos que no puedas acompañarnos. Gracias por avisarnos.`
    });
  }

  async function sendRsvpToGoogleSheet(payload) {
    const url = cfg?.rsvpEndpoint?.trim();
    if (!url) return true;

    const body = JSON.stringify({
      ...payload,
      fechaEnvio: new Date().toISOString()
    });

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body
    });

    let result = {};
    try {
      result = await res.json();
    } catch (_) {
      if (!res.ok) throw new Error('Respuesta inválida del servidor');
    }

    if (!res.ok || result.ok === false) {
      throw new Error(result.error || 'No se pudo guardar en la hoja');
    }

    return true;
  }

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const submitBtn = form.querySelector('[type="submit"]');
    const asiste = data.asistencia === 'si';

    if (!data.nombre || !data.asistencia) {
      openRsvpModal({
        type: 'error',
        icon: '✎',
        title: 'Faltan datos',
        text: 'Por favor completa tu nombre y confirma si asistirás.'
      });
      return;
    }

    if (!asiste) {
      data.invitados = '';
    }

    const payload = { ...data };

    if (cfg?.rsvpEndpoint?.trim()) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Enviando…';

      try {
        await sendRsvpToGoogleSheet(payload);
      } catch (err) {
        console.warn('RSVP Google Sheets:', err);
        openRsvpModal({
          type: 'error',
          icon: '⚠',
          title: 'No se pudo enviar',
          text:
            'Hubo un problema al guardar tu confirmación. ' +
            'Puedes enviar directamente por WhatsApp a la novia.',
          whatsappPayload: payload
        });
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar confirmación';
        return;
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar confirmación';
    }

    try {
      const list = JSON.parse(localStorage.getItem('rsvp_list') || '[]');
      list.push({ ...payload, fecha: new Date().toISOString() });
      localStorage.setItem('rsvp_list', JSON.stringify(list));
    } catch (_) {}

    form.reset();
    toggleAttendingFields();
    showRsvpSuccess(data);
  });

});
