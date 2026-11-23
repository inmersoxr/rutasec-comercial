import widths from './photo-widths.json';
import { renderPremiumDemo } from './premium.js';
import { chapters, comparison, modes, photoDescriptions, places, standard, trip } from './content.js';

const linkIcon = direction => `<svg class="link-icon" viewBox="0 0 16 16" width="15" height="15" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="${direction === 'up' ? 'M3.5 12.5 12 4m-6.5 0H12v6.5' : 'm3.5 3.5 8.5 8.5m0-6.5V12H5.5'}"/></svg>`;
const chevron = linkIcon('down');
const arrow = linkIcon('up');

export function photo(name, alt, options = {}) {
  const { eager = false, className = '' } = options;
  return `<picture class="photo ${className}" data-photo="${name}">
    <source media="(max-width: 720px)" srcset="./media/${name}-portrait-small.webp ${widths[name + '-portrait-small']}w, ./media/${name}-portrait.webp ${widths[name + '-portrait']}w" sizes="100vw">
    <img src="./media/${name}.webp" srcset="./media/${name}-small.webp ${widths[name + '-small']}w, ./media/${name}.webp ${widths[name]}w" sizes="100vw" alt="${alt}" width="1600" height="900"
      loading="${eager ? 'eager' : 'lazy'}" ${eager ? 'fetchpriority="high"' : 'decoding="async"'}>
  </picture>`;
}

const capture = (name, alt, kind = '') => `<figure class="capture ${kind}"><img src="./media/app-${name}.webp" alt="${alt}" loading="lazy" decoding="async"></figure>`;
const sectionTitle = (label, title, extra = '') => `<p class="eyebrow">${label}</p><h2 ${extra}>${title}</h2>`;
function navigation() {
  return `<a href="#ecuador" class="skip">Saltar al contenido</a>
  <header class="topbar">
    <a class="wordmark" href="#ecuador" aria-label="RutasEC · Inicio"><img src="./media/logo.svg" alt="" width="40" height="40"><span>Rutas<b>EC</b></span></a>
    <nav aria-label="Actos de la presentación" class="primary-nav">
      ${chapters.filter(([, , act]) => act).map(([id, , act]) => `<a href="#${id}">${act}</a>`).join('')}
    </nav>
    <div class="top-actions"><button type="button" class="index-toggle" aria-controls="chapter-menu" aria-expanded="false" aria-label="Índice de la presentación"><span></span><span></span></button><a class="top-cta" href="#asociar">Asociar mi empresa ${arrow}</a></div>
  </header>
  <nav class="chapter-menu" id="chapter-menu" aria-label="Capítulos de la presentación" hidden>
    <ol>${chapters.map(([id, title, act]) => `<li>${act ? `<span class="menu-act">${act}</span>` : ''}<a href="#${id}">${title} ${arrow}</a></li>`).join('')}</ol>
  </nav>
  <div class="scroll-meter" aria-hidden="true"></div>`;
}

function hero() {
  return `<section class="hero scene" id="ecuador" aria-labelledby="hero-title">
    <div class="hero-frame">
      ${photo('hero', 'Carretera entre montañas del Ecuador a última hora de la tarde', { eager: true })}
      <div class="hero-shade"></div>
      <div class="hero-grid wrap">
        <div class="hero-intro">
          <p class="eyebrow hero-eyebrow">Plataforma de transporte interprovincial</p>
          <h1 id="hero-title" aria-label="Conecta Ecuador."><span aria-hidden="true" data-letters>CONECTA</span><span aria-hidden="true" data-letters>ECUADOR<span class="hero-dot">.</span></span></h1>
          <p class="hero-line">Nuevos pasajeros. Nuevas oportunidades.<br>Una red nacional de transporte.</p>
        </div>
        <div class="hero-detail">
          <p>RutasEC conecta a personas que necesitan viajar entre ciudades con empresas de transporte privado del Ecuador.</p>
          <p>Los pasajeros comparan opciones y reservan desde su teléfono. Tu empresa publica sus viajes, llega a nuevos clientes y organiza las reservas.</p>
          <a class="ink-link" href="#red">Conoce cómo funciona ${chevron}</a>
        </div>
      </div>
      <div class="hero-bottom wrap"><span>Ecuador conectado</span><a href="#red" aria-label="Continuar a Más rutas. Más oportunidades.">Desliza <span aria-hidden="true">↓</span></a></div>
    </div>
  </section>`;
}

function network() {
  return `<section class="network scene" id="red" aria-labelledby="red-title">
    <div class="network-frame">
      ${places.map(([city, reason, file, alt], index) => `<figure class="destination${index === 0 ? ' is-active' : ''}" aria-hidden="${index !== 0}" style="--portrait: url('${new URL(`./media/${file}-portrait-small.webp`, document.baseURI).href}')">
        ${photo(file, alt)}
        <figcaption class="wrap"><strong>${city}</strong><span>${reason}</span></figcaption>
      </figure>`).join('')}
      <div class="network-shade"></div>
      <div class="network-copy wrap">
        ${sectionTitle('Una red nacional de transporte', 'Más rutas.<br>Más oportunidades.', 'id="red-title"')}
        <p>RutasEC reúne la oferta de distintas operadoras. Los pasajeros encuentran tus viajes cuando buscan un destino por trabajo, estudios, turismo, negocios o para visitar a su familia.</p>
        <p>Tu perfil reúne vehículos, horarios, tarifas y servicios. Los pasajeros pueden conocer tu oferta antes de reservar.</p>
      </div>
      <button type="button" class="network-pause">Pausar fotos</button>
    </div>
  </section>`;
}

function company() {
  return `<section class="company scene" id="empresa" aria-labelledby="empresa-title">
    <div class="company-frame">
      ${photo('fleet', 'Equipo de una operadora junto a sus vehículos')}
      <div class="company-shade"></div>
      <div class="company-layout wrap">
        <div>
          ${sectionTitle('Un canal de ventas para tu operadora', 'Tu empresa.<br>Tus vehículos.<br>Tus tarifas.', 'id="empresa-title"')}
          <p>Publica las rutas que ya operas con tus propios vehículos. Define horarios, fija tu tarifa y decide cuántos asientos ofrecer en cada salida.</p>
          <p>Cuando un pasajero busca ese trayecto, puede encontrar tu viaje y reservarlo. Tu equipo recibe la reserva y gestiona el cupo desde el panel de operadora.</p>
        </div>
        <div class="company-capture">
          ${capture('operator', 'Pantalla de la PWA para publicar una salida', 'phone')}
          <p>Publicación de salidas · Captura de la PWA</p>
        </div>
      </div>
    </div>
  </section>`;
}

function travelModes() {
  return `<section class="modes scene" id="modalidades" aria-labelledby="modalidades-title">
    <div class="modes-intro wrap">
      ${sectionTitle('La experiencia del viaje', 'Una plataforma.<br>Diferentes formas de viajar.', 'id="modalidades-title"')}
      <p>Ofrece lugares en tus salidas habituales, contrata un vehículo completo o prepara una propuesta para un itinerario a medida.</p>
    </div>
    ${modes.map(([title, name, alt, description, status], i) => `<article class="mode-item mode-${i}">
      ${photo(name, alt)}
      <div class="mode-shade"></div>
      <div class="mode-copy wrap"><div><h3>${title}</h3><p>${description}</p>${status ? `<span class="demo-label">${status}</span>` : ''}</div></div>
    </article>`).join('')}
  </section>`;
}

function passenger() {
  return `<section class="passenger scene paper" id="pasajero" aria-labelledby="pasajero-title">
    <div class="passenger-head wrap">
      <div>${sectionTitle('Del primer clic a la llegada', 'Viajar nunca fue tan sencillo.', 'id="pasajero-title"')}</div>
      <p>Una pasajera necesita viajar. Acompáñala para ver qué hace en RutasEC y qué sucede en cada momento entre su reserva, tu equipo y su llegada.</p>
    </div>
    <div class="trip-visual wrap">
      <div class="trip-display" aria-label="Escenas del viaje">
        ${Object.entries(photoDescriptions).map(([name, description], i) => photo(name, description, { className: `trip-photo${i === 0 ? ' is-active' : ''}` })).join('')}
        <div class="trip-screen phone" id="trip-screen"><img src="./media/app-search.webp" alt="Buscador de viajes de RutasEC" loading="lazy"></div>
        <div class="trip-caption"><span class="trip-count">01 / 09</span><p>La experiencia de la pasajera</p></div>
      </div>
      <div class="trip-steps" aria-label="Pasos del viaje">
        ${trip.map(([title, description, , ,], i) => `<article class="trip-step${i === 0 ? ' is-active' : ''}">
          <h3><button type="button" data-trip="${i}" aria-pressed="${i === 0}"><span class="step-num">${String(i + 1).padStart(2, '0')}</span>${title}${arrow}</button></h3>
          <div class="trip-step-body"><p>${description}</p></div>
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function standardScene() {
  return `<section class="standard scene" id="standard" aria-labelledby="standard-title">
    <div class="standard-layout wrap">
      <div class="standard-copy">
        ${sectionTitle('RutasEC Standard', 'El control de<br>tu operación.', 'id="standard-title"')}
        <p>Standard es la modalidad para vender tus viajes en RutasEC y administrar las reservas que recibes. El acceso es sin mensualidad y el modelo comercial se asocia a las reservas generadas por la plataforma.</p>
        <span class="demo-label">Capturas de la PWA de demostración</span>
      </div>
      <div class="standard-panels">
        ${standard.map(([title, description, screen]) => `<article class="standard-panel">
          <div><h3>${title}</h3><p>${description}</p></div>
          ${capture(screen, `Panel de operadora · ${title}`, 'phone')}
        </article>`).join('')}
      </div>
    </div>
  </section>`;
}

function premiumScene() {
  return `<section class="premium scene" id="premium" aria-labelledby="premium-title">
    <div class="premium-entry">
      ${photo('ops', 'Equipo de despacho en un centro de operaciones')}
      <div class="premium-shade"></div>
      <div class="premium-intro wrap">
        ${sectionTitle('RutasEC Premium', 'Tu marca.<br>Toda tu operación.', 'id="premium-title"')}
        <p>Tu operadora tiene su propia mini app dentro de RutasEC. Tus pasajeros la abren desde un enlace, reconocen tu marca y compran tus boletos. Tus salidas también aparecen en el buscador general de RutasEC.</p>
        <p>Tu equipo trabaja en el panel privado de la misma operadora. Desde ahí organiza personal y flota, asigna conductores y vehículos a las salidas y controla reservas, cobros, facturas y gastos.</p>
        <a class="ink-link" href="#premium-demo">Explorar RutasEC Premium ${chevron}</a>
      </div>
    </div>
    ${renderPremiumDemo()}
  </section>`;
}

function tracking() {
  return `<section class="tracking scene" id="seguimiento" aria-labelledby="track-title">
    <div class="tracking-intro">
      ${photo('minibus', 'Furgoneta viajando por una carretera ecuatoriana')}
      <div class="tracking-shade"></div>
      <div class="tracking-copy wrap">
        ${sectionTitle('Durante el recorrido', 'Viajes conectados.', 'id="track-title"')}
        <p>Desde el boleto y la validación de la reserva hasta la llegada, pasajero, conductor y operadora comparten información del mismo viaje.</p>
        <p>El pasajero puede enviar un enlace a su familia. La operadora puede consultar el estado de sus unidades desde el centro de operaciones.</p>
      </div>
    </div>
    <div class="tracking-demo wrap" id="tracking-demo">
      <div class="tracking-bar"><h3>Seguimiento de un viaje</h3><span class="demo-label">Demostración · Posición simulada</span></div>
      <div id="tracking-map" class="map-surface" aria-label="Mapa de seguimiento de un viaje de demostración"></div>
      <div class="tracking-ui">
        <div class="tracking-metrics"><div><small>Distancia restante</small><strong id="track-km">—</strong></div><div><small>Tiempo estimado</small><strong id="track-eta">—</strong></div><div><small>Avance</small><strong id="track-percent">0 %</strong></div></div>
        <div class="tracking-controls"><button class="solid" type="button" id="track-play">Iniciar recorrido</button><button type="button" id="track-reset">Reiniciar</button><button type="button" id="track-share">Compartir enlace ${arrow}</button></div>
        <p id="track-notice" role="status"></p>
      </div>
    </div>
  </section>`;
}

function simulator() {
  const controls = [['price','Precio promedio por asiento',0,100,0.01,15,'USD'],['seats','Asientos comercializados al día',0,500,1,24,'asientos'],['days','Días de operación al mes',0,31,1,26,'días']];
  return `<section class="simulator scene" id="simulador" aria-labelledby="sim-title">
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
  return `<section class="plans scene paper" id="planes" aria-labelledby="plans-title">
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

function close() {
  return `<section class="close scene" id="asociar" aria-labelledby="close-title">
    <div class="close-frame">
      ${photo('coast', 'Furgoneta en una carretera ecuatoriana hacia el horizonte')}
      <div class="close-shade"></div>
      <div class="close-copy wrap">
        ${sectionTitle('Sé parte de la red', 'Conecta tu empresa.<br>Conecta tus pasajeros.<br><em>Conecta Ecuador.</em>', 'id="close-title"')}
        <p>Cuéntanos qué rutas y servicios ofrece tu operadora. El equipo de RutasEC te acompaña en la incorporación, la configuración de tus primeros viajes y el uso de las herramientas disponibles para tu operación.</p>
        <div class="close-actions"><a class="solid" data-purpose="association" href="#incorporacion">Asociar mi empresa ${arrow}</a><a class="ink-link" data-purpose="demo" href="#incorporacion">Solicitar una demostración ${arrow}</a><a class="ink-link" data-purpose="advisor" href="#incorporacion">Contactar con un asesor ${arrow}</a><a class="ink-link" data-whatsapp hidden>WhatsApp ${arrow}</a></div>
      </div>
    </div>
    <div class="form-section paper" id="incorporacion">
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
    </div>
  </section>`;
}

function footer() {
  return `<footer class="footer"><div class="wrap"><a class="wordmark" href="#ecuador"><img src="./media/logo.svg" alt="" width="34" height="34"><span>Rutas<b>EC</b></span></a><span>Conecta Ecuador</span><a href="./creditos.html">Créditos de imágenes y mapa</a><a href="#ecuador">Volver al inicio ↑</a></div></footer>`;
}

export function render() {
  return `${navigation()}<main>${hero()}${network()}${company()}${travelModes()}${passenger()}${standardScene()}${premiumScene()}${tracking()}${simulator()}${plans()}${close()}</main>${footer()}`;
}
