import widths from './photo-widths.json';
import { comparison, modes, places, standard } from './content.js';
import { renderPremiumDemo } from './premium.js';

const arrow = '<svg class="link-icon" viewBox="0 0 16 16" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M4 12 12 4m-6 0h6v6"/></svg>';
const chevron = '<span aria-hidden="true">↓</span>';
const media = './media/';
const logo = `<img class="brand-logo" src="${media}logo.svg" alt="RutasEC" width="80" height="65">`;

const navLinks = [
  ['ecuador', 'Inicio'], ['red', 'Destinos'], ['modalidades', 'Cómo funciona'],
  ['pasajero', 'Pasajeros'], ['standard', 'Standard'], ['premium', 'Premium'], ['asociar', 'Contacto'],
];

export function photo(name, alt, { eager = false, className = '' } = {}) {
  const variants = parts => parts.map(part => `${media}${part}.webp ${widths[part]}w`).join(', ');
  return `<picture class="photo ${className}" data-photo="${name}">
    <source media="(max-width: 720px)" srcset="${variants([name + '-portrait-small', name + '-portrait'])}" sizes="100vw">
    <img src="${media}${name}.webp" srcset="${variants([name + '-small', name])}" sizes="100vw" alt="${alt}" width="1600" height="900" loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : 'decoding="async"'}>
  </picture>`;
}

const sectionTitle = (label, title, extra = '') => `<p class="eyebrow">${label}</p><h2 ${extra}>${title}</h2>`;
const actLink = (id, label, style = 'ink-link') => `<a class="${style}" href="#${id}">${label} ${arrow}</a>`;
const badge = label => `<span class="demo-label">${label}</span>`;
const capture = (file, alt) => `<figure class="scene-capture phone"><img src="${media}app-${file}.webp" alt="${alt}" loading="lazy" decoding="async"></figure>`;

function navigation() {
  const links = navLinks.slice(1, -1);
  return `<a class="skip" href="#ecuador">Saltar al contenido</a>
  <header class="topbar">
    <span class="wordmark">${logo}</span>
    <nav class="primary-nav" aria-label="Recorrido">${links.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav>
    <div class="top-actions"><a href="#incorporacion" class="top-cta">Asociar mi empresa ${arrow}</a>
      <button type="button" class="index-toggle" aria-controls="chapter-menu" aria-expanded="false" aria-label="Abrir menú"><span></span><span></span></button>
    </div>
  </header>
  <nav class="chapter-menu" id="chapter-menu" aria-label="Capítulos de la presentación" hidden>
    ${navLinks.map(([id, label]) => `<a href="#${id}">${label} ${arrow}</a>`).join('')}
  </nav><div class="scroll-meter" aria-hidden="true"></div>`;
}

function openScene() {
  return `<section class="hero cinema-open" id="ecuador" aria-labelledby="hero-title">
    ${photo('hero', 'Furgoneta en una carretera de montaña del Ecuador', { eager: true })}
    <div class="cinema-shade"></div>
    <div class="hero-copy wrap">
      <p class="eyebrow">Plataforma de transporte interprovincial</p>
      <h1 id="hero-title">Conecta<br>Ecuador<span>.</span></h1>
      <p>Publica tus viajes, vende tus boletos y gestiona tu operación. Tus pasajeros pueden encontrar, comparar y reservar sus viajes desde el teléfono.</p>
      <a href="#red" class="ink-link">Recorrer RutasEC ${chevron}</a>
    </div>
  </section>`;
}

function network() {
  return `<section class="network" id="red" aria-labelledby="red-title">
    <div class="network-frame">
      ${places.map(([city, reason, file, alt], i) => `<figure class="destination${i === 0 ? ' is-active' : ''}" aria-hidden="${i !== 0}" style="--portrait: url('${new URL(`./media/${file}-portrait-small.webp`, document.baseURI).href}')">
        ${photo(file, alt)}
        <figcaption class="wrap"><strong>${city}</strong><span>${reason}</span></figcaption>
      </figure>`).join('')}
      <div class="network-shade"></div>
      <div class="network-copy wrap">
        ${sectionTitle('Una red nacional de transporte', 'Más rutas.<br>Más oportunidades.', 'id="red-title"')}
        <p>Cuando alguien busca una ruta por trabajo, estudios, turismo o para visitar a su familia, puede encontrar tus viajes. Tu perfil le permite conocer tus vehículos, horarios, tarifas y servicios antes de reservar.</p>
      </div>
      <button type="button" class="network-pause">Pausar fotos</button>
    </div>
  </section>`;
}

function renderBeat(beat, index) {
  const current = index === 0;
  return `<article class="beat${current ? ' is-active' : ''}" data-beat ${current ? '' : 'inert aria-hidden="true"'}>
    ${photo(beat.image, beat.alt)}
    <div class="cinema-shade"></div>
    <div class="beat-content wrap">
      <div class="beat-copy">
        <h3>${beat.title}</h3>
        <p>${beat.copy}</p>
        ${beat.badge ? badge(beat.badge) : ''}
        ${beat.links?.length ? `<div class="beat-links">${beat.links.map(([id, name]) => actLink(id, name)).join('')}</div>` : ''}
      </div>
      ${beat.screen ? capture(beat.screen, `Vista de RutasEC: ${beat.title}`) : ''}
      ${beat.preview ? `<aside class="beat-preview" aria-label="Ejemplo de interfaz"><span>${beat.preview[0]}</span><strong>${beat.preview[1]}</strong><small>${beat.preview[2]}</small></aside>` : ''}
    </div>
  </article>`;
}

function story({ id, label, title, beats, runway }) {
  return `<section class="cinema" id="${id}" style="--runway:${runway}svh" aria-labelledby="${id}-title">
    <div class="cinema-stage">
      <div class="cinema-title wrap">${sectionTitle(label, title, `id="${id}-title"`)}</div>
      ${beats.map(renderBeat).join('')}
      <div class="beat-control wrap" role="group" aria-label="Secuencia de ${label}">
        ${beats.map((beat, i) => `<button type="button" data-jump="${i}" aria-pressed="${i === 0}">${beat.label}</button>`).join('')}
      </div>
    </div>
  </section>`;
}

const travel = {
  id: 'modalidades', label: 'La experiencia del viaje', title: 'Diferentes formas de viajar.', runway: 62,
  beats: modes.map(([title, image, alt, copy, badge], i) => ({
    title, image, alt, copy, badge, label: ['Compartido', 'Privado', 'Personalizado'][i],
  })),
};

const passenger = {
  id: 'pasajero', label: 'Del primer clic a la llegada', title: 'Así viaja un pasajero.', runway: 79,
  beats: [
    { label: 'Busca', title: 'Encuentra su viaje', copy: 'Elige origen, destino y fecha. Compara horarios, tarifas, vehículos y cupos de distintas operadoras antes de decidir.', image: 'booking', alt: 'Pasajera consultando un viaje en el teléfono', screen: 'results' },
    { label: 'Reserva', title: 'Recibe su boleto', copy: 'Selecciona los asientos, confirma el pago de demostración y recibe un boleto digital con los datos de su salida.', image: 'welcome', alt: 'Pasajera junto a una furgoneta en el punto de embarque', screen: 'ticket' },
    { label: 'Aborda', title: 'Presenta su código QR', copy: 'El conductor valida el boleto antes de abordar. La operadora registra el embarque en el manifiesto del viaje.', image: 'qr', alt: 'Una pasajera sostiene el teléfono mientras el conductor escanea su boleto' },
    { label: 'Comparte', title: 'Su familia sigue el recorrido', copy: 'La pasajera comparte un enlace con el mapa y el tiempo estimado de llegada. Al completar el viaje, puede valorar el servicio en el flujo ilustrativo.', image: 'cabin', alt: 'Pasajera mirando por la ventana durante el viaje', screen: 'tracking', links: [['tracking-demo', 'Probar seguimiento']] },
  ],
};

const operators = {
  id: 'standard', label: 'RutasEC Standard', title: 'Tus viajes, en el marketplace.', runway: 60,
  beats: standard.map(([title, copy, screen], i) => ({
    title, copy: i === 0 ? `${copy} Standard permite publicar y recibir reservas sin mensualidad.` : copy,
    label: ['Publicar', 'Reservas', 'Embarque'][i], screen,
    image: ['fleet','premium-despacho','qr'][i],
    alt: ['Flota de transporte de una operadora','Equipo de despacho de una operadora','Validación del boleto antes de abordar'][i],
  })),
};

const enterprise = {
  id: 'premium', label: 'RutasEC Premium', title: 'Tu marca. Toda tu operación.', runway: 112,
  beats: [
    { label: 'Tu mini app', title: 'Un espacio con tu marca', copy: 'Personaliza tu perfil, logotipo, colores y servicios. Comparte tu enlace para vender en tu propia mini app y mantén tus salidas visibles en el buscador de RutasEC.', image: 'premium-ventas', alt: 'Pasajera haciendo una reserva desde el teléfono', preview: ['Vista de una operadora', 'Andes Movilidad', 'Rutas · Horarios · Reservar'], links: [['premium-marca', 'Probar personalización'], ['premium-demo', 'Ver ejemplos de marca']] },
    { label: 'Operaciones', title: 'Cada salida, coordinada', copy: 'Asigna a una persona y a un vehículo desde despacho. Durante el viaje, el equipo consulta en qué ruta va la unidad, quién conduce y a qué hora llegará.', image: 'premium-despacho', alt: 'Responsable de despacho supervisando una flota de transporte ecuatoriana', preview: ['Centro de operaciones', 'Cuenca → Guayaquil', 'Vehículo y conductor asignados'], links: [['premium-operaciones', 'Abrir mapa de flota']] },
    { label: 'Flota y equipo', title: 'Tu flota lista para salir', copy: 'Consulta el odómetro, los documentos y el próximo mantenimiento de cada unidad. Vincula los turnos y licencias de tus conductores a los viajes que tienen asignados.', image: 'premium-taller', alt: 'Mecánico y conductor revisan una furgoneta en el taller', preview: ['Ficha del vehículo', 'Revisión programada', 'Disponible después del servicio'], links: [['premium-flota', 'Ver ficha del vehículo'], ['premium-personal', 'Ver perfil del empleado']] },
    { label: 'Ventas y caja', title: 'Del boleto a la caja', copy: 'Cada reserva se relaciona con su pasajero y su viaje. Registra cobros, pagos y gastos por unidad y consulta los comprobantes asociados en Finanzas.', image: 'premium-finanzas', alt: 'Dos personas de una operadora revisan los comprobantes del día', preview: ['Venta directa', 'Boleto confirmado', 'Cobro vinculado al viaje'], links: [['premium-ventas', 'Simular una reserva'], ['premium-finanzas', 'Abrir Finanzas']] },
    { label: 'Reportes', title: 'Decide con tu operación a la vista', copy: 'Compara ocupación, ventas y costos por ruta o vehículo. La suscripción reúne reportes, gestión y comercialización con el alcance acordado para tu operadora.', image: 'ops', alt: 'Equipo de una operadora revisando resultados de operación', preview: ['Reportes de operación', 'Rendimiento por ruta', 'Ventas · Ocupación · Costos'], links: [['premium-reportes', 'Explorar reportes'], ['premium-conectada', 'Ver el flujo completo'], ['premium-suscripcion', 'Consultar suscripción']] },
  ],
};

function closingScene() {
  return `<section class="cinema-open closing" id="asociar" aria-labelledby="close-title">
    ${photo('coast', 'Furgoneta en una carretera ecuatoriana hacia el horizonte')}
    <div class="cinema-shade"></div>
    <div class="closing-copy wrap">
      ${sectionTitle('Sé parte de la red', 'Conecta tu empresa.<br>Conecta Ecuador.', 'id="close-title"')}
      <p>Cuéntanos qué rutas ofrece tu operadora. Nuestro equipo te acompaña al publicar tus primeros viajes y explorar las herramientas de gestión.</p>
      <div class="close-actions">
        <a class="solid" data-purpose="association" href="#incorporacion">Asociar mi empresa ${arrow}</a>
        <a class="ink-link" data-purpose="demo" href="#incorporacion">Solicitar una demostración ${arrow}</a>
        <a class="ink-link" data-purpose="advisor" href="#incorporacion">Contactar con un asesor ${arrow}</a>
      </div>
      <div class="close-actions">${actLink('planes', 'Comparar planes')}${actLink('simulador', 'Simular ventas')}<a class="ink-link" data-whatsapp hidden>WhatsApp ${arrow}</a></div>
    </div>
  </section>`;
}

function dialog(id, title, content) {
  return `<dialog class="story-dialog" id="${id}" aria-label="${title}">
    <header class="dialog-top"><span>${title}</span><button type="button" data-close-dialog>Cerrar <span aria-hidden="true">×</span></button></header>
    ${content}
  </dialog>`;
}

function tracking() {
  return `    <div class="tracking-demo wrap">
      <div class="tracking-bar"><h3>Seguimiento de un viaje</h3><span class="demo-label">Demostración · Posición simulada</span></div>
      <div id="tracking-map" class="map-surface" aria-label="Mapa de seguimiento de un viaje de demostración"></div>
      <div class="tracking-ui">
        <div class="tracking-metrics"><div><small>Distancia restante</small><strong id="track-km">—</strong></div><div><small>Tiempo estimado</small><strong id="track-eta">—</strong></div><div><small>Avance</small><strong id="track-percent">0 %</strong></div></div>
        <div class="tracking-controls"><button class="solid" type="button" id="track-play">Iniciar recorrido</button><button type="button" id="track-reset">Reiniciar</button><button type="button" id="track-share">Compartir enlace ${arrow}</button></div>
        <p id="track-notice" role="status"></p>
      </div>
    </div>`;
}
function simulator() {
  const controls = [['price','Precio promedio por asiento',0,100,0.01,15,'USD'],['seats','Asientos comercializados al día',0,500,1,24,'asientos'],['days','Días de operación al mes',0,31,1,26,'días']];
  return `<section class="simulator scene" aria-labelledby="sim-title">
    <div class="sim-layout wrap">
      <div class="sim-copy">
        ${sectionTitle('Simulador de ventas', 'Descubre el potencial<br>de tus rutas.', 'id="sim-title"')}
        <p>Usa los valores de tu operación para estimar las ventas de asientos que podrías generar. Mueve los controles o escribe las cifras.</p>
        <div class="sim-inputs">${controls.map(([key, title, min, max, step, value, unit]) => `<div class="sim-field">
          <label for="sim-${key}">${title}</label><div class="sim-number"><input id="sim-${key}" data-number="${key}" type="number" min="${min}" max="${max}" step="${step}" value="${value}"><span>${unit}</span></div>
          <input data-range="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" aria-label="${title}">
        </div>`).join('')}</div>
      </div>
      <div class="sim-results" aria-label="Resultados estimados">
        <div class="sim-main"><span>Ventas mensuales estimadas</span><strong id="sim-month">USD 9.360</strong></div>
        <div class="sim-breakdown">
          <div><span>Ventas diarias</span><strong id="sim-day">USD 360</strong></div>
          <div><span>Asientos al mes</span><strong id="sim-month-seats">624</strong></div>
          <div><span>Ventas anuales</span><strong id="sim-year">USD 112.320</strong></div>
        </div>
        <p>Estimación ilustrativa de ventas brutas. El cálculo anual aplica los mismos valores durante doce meses.</p>
      </div>
    </div>
  </section>`;
}

function plans() {
  return `<section class="plans scene paper" aria-labelledby="plans-title">
    <div class="wrap plans-layout">
      <div>${sectionTitle('RutasEC Standard y Premium', 'Crece con nosotros.', 'id="plans-title"')}</div>
      <p>Con Standard puedes incorporar tus viajes a la red y gestionar las reservas que recibes. Premium suma una mini app pública personalizable y un panel privado donde tu equipo gestiona empleados, vehículos, salidas, reservas, cobros y facturación.</p>
      <div class="compare">
        <table aria-describedby="compare-note"><thead><tr><th scope="col">Capacidades</th><th scope="col">Standard<span>Sin mensualidad</span></th><th scope="col">Premium<span>Suscripción · Consultar</span></th></tr></thead>
        <tbody>${comparison.map(([label,a,b]) => `<tr><th scope="row">${label}</th><td>${a ? 'Incluido' : '<span aria-label="Fuera del plan">—</span>'}</td><td>${b ? (a ? 'Incluido' : 'Previsto') : '<span aria-label="Fuera del plan">—</span>'}</td></tr>`).join('')}</tbody></table>
        <p id="compare-note">La demostración ilustra el alcance empresarial previsto de Premium. Consulta la disponibilidad de cada módulo e integración al solicitar una demostración.</p>
      </div>
      <a class="ink-link" href="#asociar">Consultar un plan ${chevron}</a>
    </div>
  </section>`;
}


function application() {
  return `    <div class="form-section paper">
      <div class="wrap form-layout">
        <div>${sectionTitle('Incorporación de operadoras', 'Hablemos de tus rutas.')}
          <p>Completa los datos de tu empresa y de la persona de contacto. RutasEC usará esta información para responder a tu solicitud.</p>
          <a class="ink-link" data-email hidden>Escribir por correo ${arrow}</a>
        </div>
        <form id="application">
          <div class="form-grid">
            <label>Motivo de contacto<select name="purpose"><option value="association">Asociar mi empresa</option><option value="demo">Solicitar una demostración</option><option value="advisor">Contactar con un asesor comercial</option></select></label>
            <label>Nombre de la empresa<input name="company" required maxlength="160" autocomplete="organization"></label>
            <label>Persona de contacto<input name="responsible" required maxlength="120" autocomplete="name"></label>
            <label>Correo electrónico<input name="email" type="email" required maxlength="180" autocomplete="email"></label>
            <label>WhatsApp<input name="whatsapp" type="tel" required maxlength="25" autocomplete="tel" placeholder="+593"></label>
            <label>Ciudad base<input name="city" required maxlength="100" autocomplete="address-level2"></label>
            <label>Rutas principales<input name="routes" required maxlength="320" placeholder="Ciudad de origen y destinos"></label>
            <label>Número de vehículos<input name="vehicleCount" required type="number" min="1" max="9999" inputmode="numeric"></label>
          </div>
          <fieldset><legend>Tipos de vehículo</legend><div class="vehicle-options">${[['van','Furgoneta grande'],['minivan','Furgoneta pequeña'],['suv','SUV'],['sedan','Sedán'],['other','Otro']].map(([val,label]) => `<label><input type="checkbox" name="vehicleTypes" value="${val}"> ${label}</label>`).join('')}</div></fieldset>
          <label>Cuéntanos qué necesita tu empresa <span>(opcional)</span><textarea name="observations" rows="3" maxlength="1000"></textarea></label>
          <label class="consent"><input type="checkbox" name="consent" required> Autorizo a RutasEC a contactar conmigo para dar seguimiento a esta solicitud.</label>
          <div class="submit-line"><button type="submit" class="solid">Enviar solicitud ${arrow}</button><p id="application-status" role="status" aria-live="polite"></p></div>
        </form>
      </div>
    </div>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap"><a href="#ecuador" aria-label="RutasEC · Inicio">${logo}</a><a href="./creditos.html">Créditos de imágenes y mapa</a><a href="#ecuador">Volver al inicio ↑</a></div></footer>`;
}

export function render() {
  return `${navigation()}<main>${openScene()}${network()}${story(travel)}${story(passenger)}${story(operators)}${story(enterprise)}${closingScene()}</main>${footer()}
    ${renderPremiumDemo()}
    ${dialog('tracking-demo', 'Seguimiento del viaje', tracking())}
    ${dialog('simulador', 'Simulador comercial', simulator())}
    ${dialog('planes', 'Planes RutasEC', plans())}
    ${dialog('incorporacion', 'Asocia tu empresa', application())}`;
}
