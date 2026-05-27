# Nuestra Boda · Kevin & Maira

Invitación de boda web, elegante, responsiva y lista para abrir en cualquier navegador. Sin dependencias, sin build.

## Estructura

```
nuestra-boda/
├── index.html      ← estructura
├── styles.css      ← diseño (paleta negro · vino · oro)
├── script.js       ← cuenta regresiva, animaciones, RSVP
├── config.js       ← personaliza nombres, fecha y endpoint RSVP
└── README.md
```

## Cómo verla

Solo abre `index.html` en tu navegador. Listo.

> Tip: si prefieres servidor local, en VS Code instala la extensión **Live Server** y haz click derecho en `index.html` → *Open with Live Server*.

## Personalización rápida

### 1. Cambiar nombres / fecha
Edita `config.js`:

```js
novios: { novio: "Kevin", novia: "Maira" },
fecha: new Date(2026, 10, 14, 16, 0, 0), // mes empieza en 0 (10 = Noviembre)
fechaTexto: "Sábado · 14 · Noviembre · 2026"
```

### 2. Cambiar lugares y horarios
Edita los bloques `<section id="evento">` y `<section class="itinerary">` en `index.html`.

### 3. Cambiar mensajes / historia
Edita `<section id="historia">` para tu propia línea de tiempo.

### 4. Cambiar colores
En `styles.css`, edita las variables al inicio:

```css
--accent: #c9a961;   /* dorado */
--red:    #8b1a1a;   /* vino */
--bg:     #0a0707;   /* fondo */
```

### 5. Agregar fotos a la galería
Reemplaza los `<div class="gallery-item">` por:

```html
<a href="ruta/foto-grande.jpg" class="gallery-item">
  <img src="ruta/foto.jpg" alt="">
</a>
```

### 6. Conectar el formulario RSVP
Para que las confirmaciones lleguen a tu correo o a una hoja de cálculo:

- **Formspree**: crea un form en https://formspree.io y pega la URL en `config.js`:
  ```js
  rsvpEndpoint: "https://formspree.io/f/tuID"
  ```
- **Google Forms**: usa la URL `formResponse` del form.

Por defecto las respuestas se guardan en `localStorage` del navegador (solo del invitado).

## Secciones incluidas

- Portada con nombres y fecha
- Cuenta regresiva en tiempo real
- Versículo / frase
- Línea de tiempo de la historia
- Padres / padrinos
- Detalles del evento (ceremonia y recepción) + mapas
- Itinerario del día
- Galería
- Código de vestimenta
- Mesa de regalos
- Formulario RSVP
- Footer con agradecimientos

¡Felicidades! 🤍
