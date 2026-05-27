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
  const targetDate = (cfg && cfg.fecha) ? cfg.fecha.getTime() : new Date(2026, 7, 30, 16, 0, 0).getTime();

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
  const successMsg = document.getElementById('formSuccess');

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // Validación simple
    if (!data.nombre || !data.asistencia) {
      alert('Por favor completa los campos obligatorios.');
      return;
    }

    // Si hay endpoint configurado, lo enviamos
    if (cfg && cfg.rsvpEndpoint) {
      try {
        await fetch(cfg.rsvpEndpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
      } catch (err) {
        console.warn('No se pudo enviar al endpoint:', err);
      }
    }

    // Guardamos también en localStorage por seguridad
    try {
      const list = JSON.parse(localStorage.getItem('rsvp_list') || '[]');
      list.push({ ...data, fecha: new Date().toISOString() });
      localStorage.setItem('rsvp_list', JSON.stringify(list));
    } catch (_) {}

    // Mostrar mensaje de éxito
    successMsg?.classList.add('show');
    form.reset();

    setTimeout(() => {
      successMsg?.classList.remove('show');
    }, 6000);
  });

});
