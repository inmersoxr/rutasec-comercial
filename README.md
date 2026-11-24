# RutasEC — Conecta Ecuador

Presentación comercial independiente de la PWA. La landing se monta en siete escenas. En modalidades, pasajeros, Standard y Premium el scroll controla los beats de una composición fija. Los módulos detallados de Premium, el seguimiento, la comparativa, el simulador y el formulario se abren dentro del recorrido y tienen enlaces directos.

## Desarrollo

```sh
npm ci
npm run dev
npm run build
npm run preview
```

El build se genera en `dist/`. La base de Vite es relativa para servir el sitio tanto desde una raíz como desde `/rutasec-comercial/`.

## GitHub Pages

En el repositorio de la landing, seleccionar **Settings → Pages → Build and deployment → GitHub Actions**. El workflow `.github/workflows/pages.yml` compila y publica los cambios de la rama `main`. También puede ejecutarse manualmente desde Actions.

## Contenido y canales comerciales

`src/content.js` reúne las secuencias, textos, planes y configuración de contacto. Correo y WhatsApp también pueden publicarse desde la configuración institucional de RutasEC. El formulario utiliza el servicio institucional de solicitudes, que guarda los datos para revisión administrativa y devuelve una referencia.

Los mapas y las interfaces Premium muestran datos simulados. Las fichas de vehículos, el personal y las rutas de ejemplo viven en `src/premium-data.js`. El acto conecta las pruebas de reserva, mantenimiento, asignación, caja y reportes durante la sesión del navegador. La secuencia de seguimiento puede compartirse mediante un enlace que conserva el avance o la fecha de inicio de la simulación.

Las fotografías usan composiciones WebP independientes en cada orientación. Las capturas son imágenes de la PWA con datos de demostración. Los créditos se publican en `creditos.html`.
