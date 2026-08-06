# Punto Ciego · Biblioteca de recursos

Interfaz de biblioteca para los recursos didácticos de estudio de **Punto Ciego** (BYMCYL):
guías interactivas, simulacros, videos, lecturas y fichas de repaso, todo en un solo catálogo.

Es un único archivo autocontenido (`index.html`), sin dependencias ni servidor: se abre
directo en el navegador, igual que las guías hechas con la plantilla v3. Comparte con ellas
el mismo sistema visual (tinta / papel / oro, acento por materia, Fraunces + Inter + Space Mono)
y las mismas convenciones de código (zona editable de datos + motor, delegación de eventos,
guardado en `localStorage` con sonda, código de transferencia entre dispositivos).

## Qué hace

- **Catálogo** con buscador en vivo (título, descripción, temas, materia, formato) y
  filtros por materia y por tipo de recurso.
- **Ficha de cada recurso**: nivel, duración, contenido, temas que cubre, y botón de
  abrir/continuar. Los recursos `premium` muestran el candado con compra por WhatsApp;
  los que no tienen `enlace` se marcan como «Pronto».
- **Sigue donde ibas**: la biblioteca recuerda el último recurso en curso y lo ofrece
  de primero en la portada.
- **Mis recursos**: en curso, favoritos y terminados.
- **Actividad**: marcador de totales, mapa por materia y recomendaciones de qué hacer ahora.
- **Progreso automático de las guías Punto Ciego**: si un recurso declara
  `clave:{titulo, version}`, la biblioteca lee el avance que esa guía guardó en el mismo
  dispositivo (clave `pc:<titulo>:<version>` de `localStorage`) y pinta la barra de
  progreso sola, sin que el estudiante marque nada. Para eso la biblioteca y las guías
  deben servirse desde el mismo origen (misma carpeta o mismo dominio).
- **Transferir avance**: código de respaldo `PB1.…` para pasar favoritos y avance de un
  dispositivo a otro, igual que el `PC1.…` de las guías.
- Guardado local con sonda real (funciona también donde `localStorage` existe pero falla
  al escribir, como navegadores dentro de WhatsApp o modo incógnito: avisa en vez de romperse).

## Cómo añadir o quitar recursos

Todo se edita en la **única zona editable** al inicio del `<script>` de `index.html`
(el objeto `BIBLIOTECA`). El motor de ahí en adelante no se toca.

```js
{ id:'r13',                    // único y estable: es la llave del avance guardado
  tipo:'guia',                 // clave de `tipos`
  materia:'matematicas',       // clave de `materias`
  titulo:'…',
  descripcion:'…',
  nivel:'10° y 11°',
  minutos:35,
  preguntas:20,                // recursos evaluables (o usa `contenido:'40 fichas'`)
  temas:['…','…'],             // alimenta el buscador
  enlace:'guias/mi-guia.html', // ruta o URL; vacío = «Pronto»
  nuevo:true,                  // etiqueta NUEVO
  premium:true,                // candado + compra por WhatsApp
  precio:'$18.000',            // opcional, prima sobre ajustes.precio
  clave:{titulo:'…', version:'3.0'} } // lee el avance de esa guía Punto Ciego
```

Paletas por materia (mismas de la plantilla de guías): `violeta` (matemáticas),
`verde` (ciencias), `azul` (sociales), `terracota` (lectura), `vino` (inglés).

## Estructura sugerida

```
punto-ciego/
├── index.html            ← la biblioteca (este archivo)
├── guias/                ← guías hechas con la plantilla v3
│   └── razonamiento-cuantitativo.html
└── fichas/               ← otros recursos
```

Los `enlace` de los recursos de ejemplo apuntan a rutas de esta estructura; reemplázalos
por los archivos reales (o URLs de YouTube para los videos).

## Depuración

Abrir con `#debug` al final de la URL expone `window.__pcb` con el estado, el almacén
y las funciones de análisis.
