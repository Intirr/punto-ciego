#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   Punto Ciego · construir.js

   Mete las guías de guias/ dentro de index.html, para que la
   biblioteca sea un solo archivo que se abre y funciona solo: las
   guías se leen desde dentro, sin descargar nada aparte.

       node construir.js

   Cada guía queda en un <script type="text/html"> inerte. El navegador
   no lo ejecuta ni lo interpreta: solo lo guarda como texto. Al abrir
   una guía, la biblioteca vuelca ese texto en un iframe srcdoc, que
   hereda el origen de la página y por eso comparte su localStorage:
   el avance de la guía queda donde la biblioteca puede leerlo, incluso
   abriendo el archivo con doble clic (file://).

   Lo único que hay que retocar del HTML es la etiqueta de cierre del
   script de la guía: escrita tal cual cortaría el bloque que la
   contiene, así que va escapada y la biblioteca la restituye al abrir.

   El emparejamiento va por el campo `enlace` de cada recurso: si apunta
   a un archivo de guias/ que existe, se incrusta con el id del recurso.
   Los enlaces externos (videos) se quedan como enlaces.
   ═══════════════════════════════════════════════════════════════ */
'use strict';

const fs = require('fs');
const path = require('path');

const RAIZ = __dirname;
const INDICE = path.join(RAIZ, 'index.html');
const INICIO = '<!-- GUIAS:INICIO -->';
const FIN = '<!-- GUIAS:FIN -->';

function salir(msg){ console.error('✗ ' + msg); process.exit(1); }

let html = fs.readFileSync(INDICE, 'utf8');
const i = html.indexOf(INICIO);
const j = html.indexOf(FIN);
if(i < 0 || j < 0 || j < i) salir('no encuentro las marcas GUIAS:INICIO / GUIAS:FIN en index.html');

// ── lee el catálogo declarado en index.html ──────────────────────
const ini = html.indexOf('const BIBLIOTECA = {');
const fin = html.indexOf('▲▲▲');
if(ini < 0 || fin < 0) salir('no encuentro el objeto BIBLIOTECA');
const literal = html.slice(ini, fin);
const BIBLIOTECA = eval('(' + literal.slice(0, literal.lastIndexOf('};') + 1)
  .replace('const BIBLIOTECA = ', '') + ')');

// ── incrusta cada recurso que apunte a un archivo local ──────────
const bloques = [];
let incrustadas = 0, sueltas = 0;

for(const r of BIBLIOTECA.recursos){
  if(!r.enlace){ console.log('  ·', r.id, '— sin archivo todavía'); continue; }
  if(/^https?:/i.test(r.enlace)){
    sueltas++;
    console.log('  ·', r.id, '— enlace externo, se deja como enlace');
    continue;
  }
  const ruta = path.join(RAIZ, r.enlace);
  if(!fs.existsSync(ruta)) salir(r.id + ': no existe ' + r.enlace);

  const guia = fs.readFileSync(ruta, 'utf8');
  // la única etiqueta que cortaría el bloque contenedor
  const seguro = guia.split('</script>').join('<\\/script>');
  if(seguro.indexOf('</script>') > -1) salir(r.id + ': quedó un </script> sin escapar');

  bloques.push('<script type="text/html" id="guia-' + r.id + '">\n' + seguro + '\n</script>');
  incrustadas++;
  const kb = Math.round(Buffer.byteLength(guia) / 1024);
  console.log('  ✓', r.id, '—', path.basename(r.enlace), '(' + kb + ' KB)');
}

const zona = INICIO + '\n' + bloques.join('\n') + '\n' + FIN;
html = html.slice(0, i) + zona + html.slice(j + FIN.length);
fs.writeFileSync(INDICE, html);

const total = Math.round(Buffer.byteLength(html) / 1024);
console.log('\n' + incrustadas + ' guías incrustadas' +
  (sueltas ? ' · ' + sueltas + ' enlaces externos' : '') +
  ' → index.html (' + total + ' KB)');
