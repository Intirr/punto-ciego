#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Punto Ciego · marcar-guias.js

   Pone la marca en las guías de guias/: el bloque horizontal en la
   portada, la diana compacta en la cabecera fija, el bloque corto en
   el informe, la diana en el candado de compra, el favicon en la
   pestaña y la diana en la tarjeta de resultado descargable.

       node marcar-guias.js

   Los anillos van en el color de la materia de cada guía —el que ya
   declara `meta.paleta`— y el centro siempre en oro, como manda el
   manual de marca. Todo se dibuja con las variables de la plantilla
   (--acento, --oro, --tinta), así que la marca acompaña al tema: en
   modo oscuro pasa sola a su versión negativa.

   El script es idempotente: si una guía ya está marcada, la salta.
   Está pensado para volver a pasarlo si algún día se regeneran las
   guías desde una plantilla nueva.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');

const DIR = path.join(__dirname, 'guias');
const MARCA = '/* marca: logos Punto Ciego */';

/* ── las piezas, tal como quedan dentro de la guía ─────────────── */

// bloque horizontal de la portada
const HORIZONTAL =
  "'<svg class=\"logo-bloque\" viewBox=\"0 0 470 92\" role=\"img\" aria-label=\"Punto Ciego · Estudia lo que no sabes que no sabes\">' +" +
  "'<g transform=\"translate(4,10) scale(0.72)\">' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"4\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"26\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"4\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"12\" fill=\"none\" stroke=\"var(--oro)\" stroke-width=\"3\" stroke-dasharray=\"3.77 3.77\"/></g>' +" +
  "'<text x=\"94\" y=\"45\" font-family=\"Space Mono, monospace\" font-size=\"27\" font-weight=\"700\" letter-spacing=\"6.6\" fill=\"var(--tinta)\">PUNTO CIEGO</text>' +" +
  "'<text x=\"96\" y=\"70\" font-family=\"Fraunces, Georgia, serif\" font-size=\"15\" fill=\"var(--tinta-3)\">Estudia lo que no sabes que no sabes.</text>' +" +
  "'</svg>'";

// bloque corto del informe
const CORTO =
  "'<svg class=\"logo-corto\" viewBox=\"0 0 340 64\" role=\"img\" aria-label=\"Punto Ciego\">' +" +
  "'<g transform=\"translate(2,8) scale(0.48)\">' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"5\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"26\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"5\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"12\" fill=\"none\" stroke=\"var(--oro)\" stroke-width=\"3.6\" stroke-dasharray=\"3.77 3.77\"/></g>' +" +
  "'<text x=\"62\" y=\"42\" font-family=\"Space Mono, monospace\" font-size=\"23\" font-weight=\"700\" letter-spacing=\"5\" fill=\"var(--tinta)\">PUNTO CIEGO</text>' +" +
  "'</svg>'";

// diana compacta de la cabecera: centro sólido, que a 24 px los puntos no se leen
const COMPACTA =
  "'<svg class=\"logo-cabeza\" viewBox=\"0 0 100 100\" width=\"24\" height=\"24\" aria-hidden=\"true\">' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"7\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"24\" fill=\"none\" stroke=\"var(--acento)\" stroke-width=\"7\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"8\" fill=\"var(--oro)\"/></svg>'";

// diana del candado: ese bloque es oscuro en los dos temas,
// así que sus anillos van siempre en claro, no con var(--papel)
const CANDADO =
  "'<svg class=\"logo-candado\" viewBox=\"0 0 100 100\" width=\"46\" height=\"46\" aria-hidden=\"true\">' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"40\" fill=\"none\" stroke=\"#F1EDE4\" stroke-width=\"4\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"26\" fill=\"none\" stroke=\"#F1EDE4\" stroke-width=\"4\"/>' +" +
  "'<circle cx=\"50\" cy=\"50\" r=\"12\" fill=\"none\" stroke=\"var(--oro)\" stroke-width=\"3\" stroke-dasharray=\"3.77 3.77\"/></svg>'";

const CSS = `
/* ── marca ───────────────────────────────────────────────────── */
.logo-bloque{display:block;width:100%;max-width:300px;height:auto;margin:0 0 16px}
.logo-corto{display:block;width:182px;max-width:62%;height:auto;margin:0 0 8px}
.logo-cabeza{flex-shrink:0;display:block}
.logo-candado{display:block;margin:0 auto 10px}
`;

const FAVICON = "<link rel=\"icon\" href=\"data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%20100%20100'%3E%3Ccircle%20cx='50'%20cy='50'%20r='38'%20fill='none'%20stroke='%2314161B'%20stroke-width='14'/%3E%3Ccircle%20cx='50'%20cy='50'%20r='11'%20fill='%23C9A227'/%3E%3C/svg%3E\">";

/* ── los seis cambios ──────────────────────────────────────────── */
const CAMBIOS = [
  { nombre:'favicon en la pestaña',
    de: '<meta name="theme-color" content="#14161B">',
    a:  '<meta name="theme-color" content="#14161B">\n' + FAVICON },

  { nombre:'estilos de la marca',
    de: '@media (max-width:430px){',
    a:  CSS.trim() + '\n\n@media (max-width:430px){' },

  { nombre:'portada: bloque horizontal',
    de: "    '<div class=\"marca-grande\">Punto Ciego</div>' +\n" +
        "    '<p class=\"tagline\">Estudia lo que no sabes que no sabes.</p>' +",
    a:  '    ' + HORIZONTAL + ' +' },

  { nombre:'cabecera: diana compacta de la materia',
    de: "  cabeza.innerHTML = '<div class=\"cabeza-int\">' +\n" +
        "    (conIndice ? '<button class=\"icono\" data-accion=\"indice\">Índice</button>' : '') +",
    a:  "  cabeza.innerHTML = '<div class=\"cabeza-int\">' +\n" +
        '    ' + COMPACTA + ' +\n' +
        "    (conIndice ? '<button class=\"icono\" data-accion=\"indice\">Índice</button>' : '') +" },

  { nombre:'informe: bloque corto',
    de: "    '<div class=\"marca-grande\" style=\"font-size:11px\">Punto Ciego</div>' +",
    a:  '    ' + CORTO + ' +' },

  { nombre:'candado: diana en negativo',
    de: "  return '<section class=\"candado\">' +\n" +
        "    '<h2>Hasta aquí llega la muestra</h2>' +",
    a:  "  return '<section class=\"candado\">' +\n" +
        '    ' + CANDADO + ' +\n' +
        "    '<h2>Hasta aquí llega la muestra</h2>' +" },

  // la tarjeta descargable es un canvas: la diana se dibuja a mano
  { nombre:'tarjeta de resultado: diana dibujada',
    de: "    x.fillStyle = '#C9A227'; x.font = '700 34px \"Space Mono\", monospace';\n" +
        "    trk(x, 'PUNTO CIEGO', 92, 148, 13);",
    a:  "    // diana de la marca: anillos en papel, centro de oro punteado\n" +
        "    (function(cx, cy, r){\n" +
        "      x.strokeStyle = '#F6F3EC'; x.lineWidth = 5;\n" +
        "      x.beginPath(); x.arc(cx, cy, r, 0, 6.2832); x.stroke();\n" +
        "      x.beginPath(); x.arc(cx, cy, r * 0.65, 0, 6.2832); x.stroke();\n" +
        "      x.strokeStyle = '#C9A227'; x.lineWidth = 4;\n" +
        "      if(x.setLineDash) x.setLineDash([5, 5]);\n" +
        "      x.beginPath(); x.arc(cx, cy, r * 0.3, 0, 6.2832); x.stroke();\n" +
        "      if(x.setLineDash) x.setLineDash([]);\n" +
        "    })(118, 134, 34);\n" +
        "    x.fillStyle = '#C9A227'; x.font = '700 34px \"Space Mono\", monospace';\n" +
        "    trk(x, 'PUNTO CIEGO', 172, 148, 13);" }
];

/* ── aplicar ───────────────────────────────────────────────────── */
let marcadas = 0, saltadas = 0;
for(const f of fs.readdirSync(DIR).filter(x => x.endsWith('.html')).sort()){
  const ruta = path.join(DIR, f);
  let s = fs.readFileSync(ruta, 'utf8');

  if(s.indexOf(MARCA) > -1){ saltadas++; console.log('  ·', f.slice(0,2), 'ya estaba marcada'); continue; }

  for(const c of CAMBIOS){
    const n = s.split(c.de).length - 1;
    if(n !== 1){
      console.error('✗ ' + f + ' — «' + c.nombre + '»: ' + n + ' coincidencias, esperaba 1');
      process.exit(1);
    }
    s = s.replace(c.de, c.a);
  }
  s = s.replace('</style>', MARCA + '\n</style>');
  fs.writeFileSync(ruta, s);
  marcadas++;

  const paleta = (s.match(/paleta:'([^']+)'/) || [])[1] || '?';
  console.log('  ✓', f.slice(0,2), '—', CAMBIOS.length, 'sitios · paleta', paleta);
}
console.log('\n' + marcadas + ' guías marcadas' + (saltadas ? ' · ' + saltadas + ' ya lo estaban' : ''));
