# Punto Ciego · Biblioteca de recursos

Interfaz de biblioteca para los recursos didácticos de estudio de **Punto Ciego** (BYMCYL).
Reúne en un solo catálogo las guías interactivas hechas con la plantilla v3 y deja sitio
para simulacros, videos, lecturas y fichas cuando los haya.

**Es un solo archivo: `index.html` lleva las diez guías dentro.** Se manda por WhatsApp
o se sube a cualquier hosting, se abre y funciona —sin servidor, sin dependencias y sin
descargar nada aparte—. Las guías se abren desde el propio catálogo: no hay que enviar
diez archivos ni pedirle a nadie que los guarde en la misma carpeta.

Comparte con las guías el mismo sistema visual (tinta / papel / oro, acento por materia,
Fraunces + Inter + Space Mono) y las mismas convenciones de código (zona editable de datos
+ motor, delegación de eventos, guardado en `localStorage` con sonda, código de
transferencia entre dispositivos).

## Contenido actual

Diez guías interactivas que cubren las cinco áreas del Saber 11, cada una con 4 secciones
y 20 preguntas, en **modo muestra** (`modo:'demo'`): se abre gratis la sección 1 y las
otras tres se desbloquean por WhatsApp.

Las diez corren sobre la misma plantilla v3 con la escala de seguridad obligatoria:
las opciones quedan bloqueadas hasta que el estudiante declara qué tan seguro está
(`confianzaObligatoria`), en una escala de tres colores —verde *Seguro*, amarillo
*Más o menos*, rojo *Adivinando*— y una pregunta sin responder no se puede saltar
(`responderObligatorio`): mientras esté pendiente no hay «Atrás» ni «Índice». Si no
sabe, marca *Adivinando* y elige: eso también es un dato.

| # | Guía | Materia |
|---|------|---------|
| 01 | Lectura crítica: inferir sin inventar | Lectura crítica |
| 02 | Argumentación y falacias | Lectura crítica |
| 03 | Álgebra: del enunciado a la ecuación | Matemáticas |
| 04 | Geometría y medición sin fórmulas de memoria | Matemáticas |
| 05 | Biología: célula, genética y ecosistemas | Ciencias naturales |
| 06 | Física: movimiento, fuerzas y energía | Ciencias naturales |
| 07 | Química: átomos, enlaces y reacciones | Ciencias naturales |
| 08 | Constitución, Estado y ciudadanía | Sociales y ciudadanas |
| 09 | Colombia: historia y territorio | Sociales y ciudadanas |
| 10 | Inglés: los errores que todos repiten | Inglés |

## Qué hace

- **Catálogo** con buscador en vivo (título, descripción, secciones, materia, formato) y
  filtros por materia. La fila de formatos aparece sola cuando haya más de un tipo de
  recurso; los filtros solo listan lo que existe, nunca opciones que devuelven cero.
  El buscador solo ve lo que está en la ficha del recurso, no dentro del archivo de la
  guía: si un término clave importa («tutela», «mol», «present perfect»), nómbralo en la
  descripción o en `temas`.
- **Ficha de cada recurso**: nivel, duración, preguntas, secciones, las secciones que trae
  y botón de abrir/continuar.
- **Muestra**: las guías en `modo:'demo'` avisan antes de abrirse cuánto es gratis
  («sección 1, 5 de las 20 preguntas») y ofrecen la guía completa por WhatsApp, para que
  nadie se estrelle con el candado a mitad de camino.
- **Sigue donde ibas**: la biblioteca recuerda el último recurso en curso y lo ofrece
  de primero en la portada.
- **Lector incrustado**: al abrir una guía, esta se despliega dentro de la misma página,
  con una barra «‹ Biblioteca» para volver. La guía corre entera y sin recortes —su
  índice, su simulacro, su informe—; al volver, el catálogo ya refleja lo que se avanzó.
- **Progreso automático**: como cada recurso declara `clave:{titulo, version}`, la
  biblioteca lee el avance que esa guía guardó (clave `pc:<titulo>:<version>` de
  `localStorage`) y pinta la barra de progreso sola, sin que el estudiante marque nada.
  El porcentaje se calcula sobre la guía completa: una muestra terminada marca 25%, que
  es la verdad.
- **Mis recursos**: en curso, favoritos y terminados.
- **Actividad**: marcador de totales, mapa por materia y recomendaciones de qué hacer ahora.
- **Transferir avance**: código de respaldo `PB1.…` para pasar favoritos y avance de un
  dispositivo a otro, igual que el `PC1.…` de las guías.
- Guardado local con sonda real (funciona también donde `localStorage` existe pero falla
  al escribir, como navegadores dentro de WhatsApp o modo incógnito: avisa en vez de romperse).

> Como todo vive en un solo documento, el avance se comparte también al abrir el archivo
> con doble clic (`file://`): la guía se carga en un iframe `srcdoc`, que hereda el origen
> de la página y por tanto su `localStorage`. Antes, con las guías en archivos aparte, eso
> solo funcionaba sirviendo la carpeta desde un servidor.

## Cómo añadir o quitar recursos

1. Deja el archivo de la guía en `guias/`.
2. Añade su entrada al objeto `BIBLIOTECA`, en la **única zona editable** al inicio del
   `<script>` de `index.html`. El motor de ahí en adelante no se toca.
3. Ejecuta **`node construir.js`**: vuelve a meter las guías de `guias/` dentro de
   `index.html` y avisa del tamaño final.

El paso 3 también hay que repetirlo cuando cambie el contenido de una guía ya listada
(por ejemplo, al migrarlas a una plantilla nueva): `index.html` lleva una copia, y sin
reconstruir seguiría sirviendo la vieja.

```js
{ id:'g06',                    // único y estable: es la llave del avance guardado
  tipo:'guia',                 // clave de `tipos`
  materia:'sociales',          // clave de `materias`
  titulo:'…',
  descripcion:'…',
  nivel:'10° y 11°',
  minutos:35,
  secciones:4,
  preguntas:20,                // o `contenido:'40 fichas'` si no es evaluable
  temas:['…','…'],             // alimenta el buscador
  enlace:'guias/06-mi-guia.html',      // ruta o URL; vacío = «Pronto»
  clave:{titulo:'…', version:'3.0'},   // título y versión exactos de la guía
  muestra:{secciones:1, preguntas:5},  // guía en modo demo
  nuevo:true,                  // etiqueta NUEVO
  premium:true,                // no se abre: candado + compra
  precio:'$18.000' }           // opcional, prima sobre ajustes.precio
```

`clave.titulo` y `clave.version` deben coincidir **exactamente** con el `meta.titulo` y
`meta.version` del archivo de la guía: es así como la biblioteca encuentra su avance.

Para pasar una guía de muestra a completa: cambia `modo:'demo'` por `modo:'completa'`
dentro del archivo de la guía y borra aquí su campo `muestra`. Nada más.

Paletas por materia (mismas de la plantilla de guías): `violeta` (matemáticas),
`verde` (ciencias), `azul` (sociales), `terracota` (lectura), `vino` (inglés).
Puedes dejar declaradas materias todavía vacías: no aparecen en los filtros hasta que
tengan recursos.

## Estructura

`index.html` es lo único que hay que repartir: las guías de `guias/` viajan dentro, en
bloques `<script type="text/html">` inertes al final del archivo, entre las marcas
`GUIAS:INICIO` y `GUIAS:FIN`. Esa zona la escribe `construir.js`; no se edita a mano.
Los archivos de `guias/` siguen siendo la fuente —y se pueden seguir enviando sueltos
si quieres compartir una sola guía—.

```
punto-ciego/
├── index.html          ← la biblioteca CON las guías dentro (~1,4 MB) · esto es lo que se reparte
├── construir.js        ← node construir.js → vuelve a incrustar las guías
└── guias/              ← las guías sueltas, fuente de lo que se incrusta
    ├── 01-lectura-critica-inferir-sin-inventar.html
    ├── 02-argumentacion-y-falacias.html
    ├── 03-algebra-del-enunciado-a-la-ecuacion.html
    ├── 04-geometria-y-medicion.html
    ├── 05-biologia-celula-genetica-y-ecosistemas.html
    ├── 06-fisica-movimiento-fuerzas-y-energia.html
    ├── 07-quimica-atomos-enlaces-y-reacciones.html
    ├── 08-constitucion-estado-y-ciudadania.html
    ├── 09-colombia-historia-y-territorio.html
    └── 10-ingles-los-errores-que-todos-repiten.html
```

## Depuración

Abrir con `#debug` al final de la URL expone `window.__pcb` con el estado, el almacén
y las funciones de análisis. Las guías tienen su propio `window.__pc`.
