import { brands, corridors, departure, employees, fleet } from './premium-data.js';

const format = new Intl.NumberFormat('es-EC');
const moneyFormat = new Intl.NumberFormat('es-EC', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const money = value => `USD ${moneyFormat.format(value)}`;
const kilometres = value => `${format.format(value)} km`;
const routeName = id => `${corridors[id].origin} → ${corridors[id].destination}`;
const options = (items, selected) => items.map(([value, label]) => `<option value="${value}"${value === selected ? ' selected' : ''}>${label}</option>`).join('');
const facts = entries => `<dl class="premium-facts">${entries.map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
const rows = (heading, items) => `<ul class="premium-records" aria-label="${heading}">${items.map(([title, detail, status]) =>
  `<li><span><strong>${title}</strong><small>${detail}</small></span><span>${status}</span></li>`).join('')}</ul>`;

const chapters = [
  ['premium-demo', 'Tu empresa. Tu marca. Tu propia aplicación.'],
  ['premium-operaciones', 'Toda tu operación. En una sola pantalla.'],
  ['premium-flota', 'Conoce y administra cada vehículo.'],
  ['premium-personal', 'Las personas que mueven tu empresa.'],
  ['premium-ventas', 'Todas tus ventas. Todos tus clientes.'],
  ['premium-finanzas', 'Las finanzas de tu empresa, conectadas.'],
  ['premium-reportes', 'Conoce el rendimiento de tu empresa.'],
  ['premium-conectada', 'Una empresa completamente conectada.'],
  ['premium-marca', 'Personaliza tu plataforma.'],
  ['premium-suscripcion', 'Toda tu empresa. Una plataforma. Una suscripción.'],
];

const timeline = [
  ['Reserva', 'El pasajero reserva la salida RE-1030 en la mini app de Andes Movilidad. La reserva queda en el mismo registro que las ventas del buscador de RutasEC.', 'Ventas → Reservas'],
  ['Disponibilidad', 'El asiento se descuenta de los 12 cupos de la Hyundai H1. Los canales comparten la disponibilidad actualizada.', 'Reservas → Cupos'],
  ['Asignación', 'Despacho asigna la unidad EC–036 y a su conductora para la salida. Ambos registros quedan vinculados a ese viaje.', 'Despacho → Personal y flota'],
  ['Embarque', 'La conductora valida los boletos antes de salir. El manifiesto registra qué pasajeros abordaron.', 'Boletos → Despacho'],
  ['Seguimiento', 'El equipo ve la unidad avanzar en el mapa junto al resto de la flota. El registro conserva el estado y la hora estimada de llegada.', 'GPS → Centro de operaciones'],
  ['Kilometraje', 'El recorrido suma kilómetros estimados por GPS. Al revisar el vehículo, el equipo registra el valor confirmado del odómetro.', 'Viaje → Ficha del vehículo'],
  ['Alerta', 'Al acercarse al intervalo de cambio de aceite, la ficha alerta a mantenimiento y permite agendar la revisión.', 'Kilometraje → Mantenimiento'],
  ['Disponibilidad de flota', 'El taller programa la intervención en el calendario. Despacho ve la unidad en revisión y puede asignar otro vehículo.', 'Mantenimiento → Despacho'],
  ['Caja y factura', 'El cobro del pasaje y el gasto del mantenimiento quedan vinculados a la venta, la salida y la unidad para su conciliación.', 'Ventas y flota → Finanzas'],
  ['Reportes', 'Con esos registros, la administración consulta ocupación, ingresos, costos y rentabilidad estimada por ruta y por vehículo.', 'Finanzas y operaciones → Reportes'],
];

function section(index, caption, description, content, classes = '') {
  const [id, title] = chapters[index];
  return `<section id="${id}" class="premium-module ${classes}" aria-labelledby="${id}-title">
    <div class="premium-module-inner wrap">
      <header class="premium-module-copy">
        <p class="eyebrow">${caption}</p>
        <h3 id="${id}-title">${title}</h3>
        <p>${description}</p>
      </header>
      <div class="premium-module-content">${content}</div>
    </div>
  </section>`;
}

function profileCard(brand, context) {
  return `<article class="premium-profile" style="--operator-color: ${brand.color}">
    <img src="./media/${brand.cover}-small.webp" alt="" width="960" height="540" loading="lazy">
    <div class="profile-brand"><span class="profile-logo" aria-label="Logotipo de muestra">${brand.initials}</span><div><h4>${brand.name}</h4><p>${brand.offer}</p></div></div>
    <p class="profile-context">${context}</p>
  </article>`;
}

export function renderPremiumDemo() {
  return `<div class="premium-act">
    ${section(0, 'Tu plataforma empresarial', 'Cada operadora tiene una plataforma con su marca y sus servicios. La mini app pública permite vender pasajes por enlace directo y aparecer en el buscador de RutasEC. El equipo gestiona la empresa desde su entorno privado.',
      `<div class="profile-pair">${profileCard(brands.andes, 'Cuenca · Salidas compartidas y viajes privados')}${profileCard(brands.costa, 'Guayaquil · Traslados privados a la costa')}</div>
      <p class="premium-note">Dos empresas de ejemplo, cada una con su marca, catálogo y equipo. Ambas usan la infraestructura compartida de RutasEC.</p>
      <p class="premium-note">La suscripción mensual distribuye el costo de la tecnología y sus actualizaciones. Tu empresa evita asumir por su cuenta el desarrollo, el alojamiento y el mantenimiento de una aplicación individual.</p>
      <nav class="premium-index" aria-label="Capítulos de RutasEC Premium">
        ${[['operaciones','Mapa de flota'],['flota','Vehículos'],['personal','Personal'],['ventas','Ventas'],['finanzas','Finanzas'],['reportes','Reportes'],['conectada','Empresa conectada'],['marca','Personalización'],['suscripcion','Suscripción']].map(([id, label]) => `<a href="#premium-${id}">${label}</a>`).join('')}
      </nav>`, 'premium-identity')}
    ${section(1, 'Centro de operaciones · Demostración', 'Ve toda tu flota desde un mismo lugar. El mapa distingue unidades en carretera, en embarque, disponibles y en taller. Selecciona un vehículo para abrir su ficha de operación.',
      `<div class="ops-map-wrap">
        <div id="fleet-map" class="map-surface" aria-label="Seguimiento simulado de seis vehículos en tres rutas de Ecuador"></div>
        <div class="fleet-dock"><div class="fleet-select" role="group" aria-label="Seleccionar vehículo">${fleet.map(({ id }, i) => `<button type="button" data-unit="${i}" aria-pressed="${i === 0}">${id}</button>`).join('')}</div>
        <div class="premium-inline map-options"><button type="button" class="ink-link" id="fleet-fit">Ver toda la flota</button><button type="button" class="ink-link" id="fleet-motion">Pausar simulación</button></div>
        <p id="fleet-status" role="status"></p><div id="fleet-detail"></div>
        <div class="premium-inline"><a id="fleet-open-vehicle" class="ink-link" href="#premium-flota">Abrir ficha del vehículo</a><a id="fleet-open-driver" class="ink-link" href="#premium-personal">Abrir perfil del conductor</a></div></div>
      </div>`, 'premium-operations')}
    ${section(2, 'Flota y mantenimiento · Demostración', 'Reúne por vehículo los permisos, seguros, viajes, combustible y mantenimiento. Usa el GPS para estimar el recorrido y el odómetro para confirmar el kilometraje. Programa las revisiones en función del intervalo de cada unidad.',
      `<div class="premium-console">
        <label>Unidad de la flota <select id="premium-vehicle">${options(fleet.map((v, i) => [i, `${v.id} · ${v.model}`]), 2)}</select></label>
        <div id="vehicle-sheet"></div>
        <h4>Mantenimiento preventivo</h4>
        <div class="premium-inline maintenance-inputs">
          <label>Odómetro confirmado (km)<input type="number" id="maintenance-odometer" required min="1" max="2000000" step="1"></label>
          <label>Próxima revisión (km)<input type="number" id="maintenance-threshold" required min="1" max="2000000" step="1"></label>
          <button class="solid" id="maintenance-apply" type="button">Actualizar kilometraje e intervalo</button>
        </div>
        <p id="maintenance-alert" class="premium-alert" role="status"></p><div id="maintenance-progress" class="premium-chart-track"></div>
        <div class="premium-inline">
          <label>Fecha de mantenimiento <input type="date" id="maintenance-date" required value="2026-11-27"></label>
          <button class="solid" id="maintenance-schedule" type="button">Programar servicio</button>
          <button class="solid" id="maintenance-complete" type="button" disabled>Registrar ejecución</button>
        </div>
        <p id="maintenance-feedback" class="premium-feedback" role="status"></p>
        <p class="premium-note">Recordatorios por kilometraje o fecha para aceite, filtros, frenos, neumáticos, revisiones mecánicas y renovación de documentación.</p>
      </div>`, 'premium-split premium-vehicles')}
    ${section(3, 'Personal, turnos y nómina · Demostración', 'Cada conductor y trabajador tiene un perfil empresarial. Relaciona sus funciones, turnos y documentación con los vehículos y viajes que tiene asignados. Consulta remuneraciones, roles de pago y permisos según tu acceso.',
      `<div class="premium-console">
        <label>Empleado <select id="premium-employee">${options(employees.map((e, i) => [i, `${e[0]} · ${e[1]}`]), 2)}</select></label>
        <div id="employee-sheet"></div>
        <div class="premium-inline"><a id="employee-vehicle-link" class="ink-link" href="#premium-flota">Ver vehículo asignado</a></div>
      </div>`, 'premium-split premium-people')}
    ${section(4, 'Gestión comercial · Demostración', 'Centraliza las ventas del buscador de RutasEC y las de tus propios canales. Organiza pasajes, reservas directas, viajes compartidos y privados, cotizaciones, promociones, clientes y cobros pendientes.',
      `<div class="premium-sales">
        <article class="miniapp-public">
          <img id="sales-cover" class="miniapp-cover" src="./media/fleet-small.webp" alt="" width="960" height="540" loading="lazy">
          <div class="miniapp-brand"><strong id="sales-brand">Andes Movilidad</strong><span>Mini app pública · Reserva directa</span></div>
          <div class="miniapp-ticket"><h4>${routeName('cuenca')}</h4><p>${departure.time} · ${departure.unit} · ${money(departure.price)} por asiento</p><p id="miniapp-seats"></p>
          <button class="solid" type="button" id="miniapp-book">Reservar boleto de prueba</button><p id="miniapp-receipt" role="status"></p></div>
        </article>
        <div class="premium-console"><h4>Ventas y reservas internas</h4><div id="premium-sales-record"></div>
          <a class="ink-link" href="#premium-finanzas">Abrir caja y facturación</a></div>
      </div>`, 'premium-commerce')}
    ${section(5, 'Administración financiera · Demostración', 'Controla ingresos de pasajes y viajes privados, cuentas por cobrar y por pagar, combustible, mantenimiento, pagos a proveedores, nómina y liquidaciones. Los movimientos quedan vinculados al viaje, vehículo o empleado correspondiente.',
      `<div class="premium-console premium-finance-console">
        <label>Período <select id="premium-finance-period"><option value="day">Jornada de ejemplo</option><option value="month">Noviembre · Ejemplo</option></select></label>
        <div id="premium-finance-figures"></div><div id="premium-finance-record"></div>
        <div class="premium-inline"><button class="solid" type="button" id="premium-collect" disabled>Confirmar cobro de muestra</button><button class="solid" type="button" id="premium-invoice" disabled>Generar comprobante de muestra</button></div>
        <p id="premium-finance-feedback" role="status" class="premium-feedback">Reserva un boleto en la mini app para probar el registro del cobro.</p>
        <p class="premium-note">El comprobante es ilustrativo. La emisión electrónica contempla una integración conforme a los requisitos del SRI.</p>
      </div>`, 'premium-finances')}
    ${section(6, 'Inteligencia comercial y operativa · Demostración', 'Cruza las ventas, la ocupación y la demanda con la frecuencia de viajes, el kilometraje y el costo de las unidades. Filtra por destino y vehículo para comparar el rendimiento por servicio.',
      `<div class="premium-console">
        <div class="premium-inline filters">
          <label>Período <select id="report-period"><option value="month">Noviembre · Ejemplo</option><option value="week">Últimos 7 días · Ejemplo</option></select></label>
          <label>Ruta <select id="report-route">${options([['all','Todas las rutas'], ...Object.keys(corridors).map(id => [id, routeName(id)])], 'all')}</select></label>
          <label>Vehículo <select id="report-vehicle"></select></label>
        </div>
        <div id="reports-figures" aria-live="polite"></div>
        <p class="premium-note">La rentabilidad estimada compara ingresos y costos operativos registrados en la muestra.</p>
      </div>`, 'premium-split premium-insights')}
    ${section(7, 'De la reserva a los reportes', 'Sigue la salida RE-1030 para ver qué información genera cada acción y quién la usa en el siguiente departamento.',
      `<div class="premium-sequence">
        <div class="premium-events" role="group" aria-label="Eventos de la salida">${timeline.map(([label], i) => `<button type="button" data-event="${i}" aria-pressed="${i === 0}"><span>${String(i + 1).padStart(2, '0')}</span>${label}</button>`).join('')}</div>
        <div class="premium-event-detail"><p id="premium-event-link" class="eyebrow"></p><h4 id="premium-event-title"></h4><p id="premium-event-description"></p></div>
      </div>`, 'premium-connected')}
    ${section(8, 'Identidad y configuración · Demostración', 'Configura el aspecto del perfil público y del entorno de trabajo. Ajusta tu logotipo, colores, nombre, portada, servicios y contacto. Elige qué información puede consultar cada equipo dentro del panel.',
      `<div class="brand-workbench">
        <div class="brand-fields">
          <label>Ejemplo de operadora <select id="brand-preset">${options(Object.entries(brands).map(([id, brand]) => [id, brand.name]), 'andes')}</select></label>
          <label>Nombre comercial <input id="brand-name" maxlength="40"></label>
          <label>Iniciales del logotipo <input id="brand-logo" maxlength="3"></label>
          <label>Probar un logotipo propio <input id="brand-logo-file" type="file" accept="image/png,image/jpeg,image/webp"></label>
          <label>Color corporativo <input id="brand-color" type="color"></label>
          <label>Foto de portada <select id="brand-cover"><option value="fleet">Flota de la empresa</option><option value="minibus">Carretera de los Andes</option><option value="coast">Costa ecuatoriana</option></select></label>
          <label>Servicios <input id="brand-offer" maxlength="65"></label>
          <label>Contacto de muestra <input id="brand-contact" type="email" maxlength="70"></label>
          <label>Rol de usuario <select id="brand-role"><option value="dispatch">Despacho</option><option value="finance">Administración financiera</option><option value="sales">Ventas</option></select></label>
        </div>
        <div class="premium-profile brand-preview">
          <img id="brand-preview-cover" src="./media/fleet-small.webp" alt="" width="960" height="540" loading="lazy">
          <div class="profile-brand"><span id="brand-preview-logo" class="profile-logo"></span><div><h4 id="brand-preview-name"></h4><p id="brand-preview-offer"></p></div></div>
          <p class="profile-context" id="brand-preview-contact"></p>
          <div class="profile-context"><strong>Entorno privado de la operadora</strong><p id="brand-preview-role"></p></div>
        </div>
      </div>`, 'premium-branding')}
    ${section(9, 'Modelo comercial Premium', 'Accede a una plataforma empresarial especializada mediante una suscripción mensual. El servicio integra infraestructura, actualizaciones y herramientas de administración y comercialización según el plan contratado.',
      `<p class="premium-note">Consulta con RutasEC el alcance y el precio para el tamaño y las necesidades de tu operadora.</p>
      <a class="solid" href="#incorporacion" data-purpose="demo">Solicitar información de RutasEC Premium</a>`, 'premium-subscription')}
  </div>`;
}

function chart(label, entries) {
  const ceiling = Math.max(1, ...entries.map(([, value]) => Math.abs(value)));
  return `<figure class="premium-chart" aria-label="${label}">
    ${entries.map(([name, value]) => `<div class="premium-chart-row"><span>${name}</span><div class="premium-chart-track"><i style="--bar: ${Math.abs(value) / ceiling * 100}%"></i></div><strong>${money(value)}</strong></div>`).join('')}
  </figure>`;
}

export function configurePremium() {
  const root = document.querySelector('.premium-act');
  const q = selector => root.querySelector(selector);
  const all = selector => [...root.querySelectorAll(selector)];
  const state = {
    fleetIndex: 0, vehicleIndex: 2, employeeIndex: 2, booked: false, paid: false, invoiced: false,
    driver: 2, dispatched: false, selectedEvent: 0,
    vehicles: fleet.map(unit => ({ ...unit, appointment: '', completed: '', spending: 0 })),
  };
  const unitButtons = all('[data-unit]');
  const available = () => departure.capacity - departure.reserved - Number(state.booked);
  const currentDriver = unit => unit.id === departure.unit ? employees[state.driver][0] : unit.driver;
  const vehicleState = unit => unit.appointment ? 'Mantenimiento programado' : unit.id === departure.unit && state.dispatched ? 'Despacho confirmado' : unit.status;
  const activity = unit => unit.id === departure.unit ? departure.reserved + Number(state.booked) : unit.passengers;
  const personnelIndex = name => employees.findIndex(([employee]) => employee === name);

  function renderMapSheet() {
    const unit = state.vehicles[state.fleetIndex];
    const corridor = corridors[unit.corridor];
    const passengers = activity(unit);
    const driver = currentDriver(unit);
    unitButtons.forEach((button, i) => button.setAttribute('aria-pressed', String(state.fleetIndex === i)));
    q('#fleet-status').textContent = `${unit.id} · ${vehicleState(unit)}`;
    q('#fleet-detail').innerHTML = facts([
      ['Vehículo y placa', `${unit.model} · ${unit.plate}`], ['Conductor asignado', driver],
      ['Ubicación', unit.location], ['Última actualización de muestra', unit.position > 0 ? '10:20 · Hora Ecuador' : '10:08 · Hora Ecuador'],
      ['Origen', corridor.origin], ['Destino', corridor.destination], ['Ruta actual', routeName(unit.corridor)],
      ['Pasajeros y ocupación', `${passengers} de ${unit.capacity} · ${Math.round(passengers / unit.capacity * 100)} %`],
      ['Llegada estimada', unit.eta], ['Odómetro registrado', kilometres(unit.km)],
      ['Próximo mantenimiento', `${unit.service} · ${kilometres(unit.next)}`],
    ]);
    q('#fleet-open-driver').hidden = personnelIndex(driver) < 0;
  }

  function renderVehicle() {
    const unit = state.vehicles[state.vehicleIndex];
    q('#premium-vehicle').value = state.vehicleIndex;
    q('#vehicle-sheet').innerHTML = facts([
      ['Modelo y placa', `${unit.model} · ${unit.plate}`], ['Capacidad', `${unit.capacity} asientos`], ['Disponibilidad', vehicleState(unit)],
      ['Documentación y permisos', 'Matrícula y permiso de operación vigentes'], ['Póliza de muestra', 'Vence en abril de 2027'],
      ['Historial de viajes', `${unit.trips} salidas registradas este mes`], ['Odómetro confirmado', kilometres(unit.km)],
      ['Estimación por GPS', kilometres(unit.gps)], ['Combustible este mes', `${Math.round(unit.fuel / 2.65)} L · ${money(unit.fuel)}`],
      ['Historial de taller', unit.completed ? `Último servicio registrado · ${unit.completed}` : 'Última inspección registrada · 10 nov.'],
      ['Costo registrado de la unidad', money(unit.fuel + unit.upkeep + unit.spending)],
    ]);
    q('#maintenance-odometer').value = unit.km;
    q('#maintenance-threshold').value = unit.next;
    q('#maintenance-complete').disabled = !unit.appointment;
    const remaining = unit.next - unit.km;
    const alert = q('#maintenance-alert');
    const meter = document.createElement('i');
    meter.style.setProperty('--bar', `${Math.min(100, Math.max(0, 100 - remaining / 5))}%`);
    q('#maintenance-progress').replaceChildren(meter);
    alert.dataset.urgent = String(remaining <= 500);
    alert.textContent = unit.appointment
      ? `${unit.service} programado para ${unit.appointment}. La fecha queda visible para el equipo de despacho.`
      : `${unit.service} · ${remaining > 0 ? `Faltan ${kilometres(remaining)} según el odómetro.` : 'Intervalo alcanzado según el odómetro.'}`;
  }

  function renderEmployee() {
    const [name, role, base, shift, document, salary, payroll, leave] = employees[state.employeeIndex];
    const unit = state.vehicles.find(vehicle => currentDriver(vehicle) === name);
    q('#premium-employee').value = state.employeeIndex;
    q('#employee-sheet').innerHTML = `<h4>${name}</h4>${facts([
      ['Cargo y responsabilidades', role], ['Base', base], ['Turno', shift], ['Documentación', document],
      ['Vehículo asignado', unit?.id ?? 'Por asignar'], ['Viaje asignado', unit ? routeName(unit.corridor) : 'Sin viaje asignado'],
      ['Historial de actividad', unit ? `${unit.trips} salidas registradas este mes` : 'Turnos y tareas de la base'],
      ['Remuneración mensual de muestra', money(salary)], ['Rol de pago y anticipos', payroll], ['Vacaciones y permisos', leave],
    ])}`;
    q('#employee-vehicle-link').hidden = !unit;
  }

  function renderSales() {
    q('#miniapp-seats').textContent = `${available()} asientos disponibles de ${departure.capacity}`;
    q('#miniapp-book').disabled = state.booked;
    const bookings = [
      ['RE-1030 · 7 pasajes', 'Salida compartida · Buscador RutasEC · EC–036', 'Confirmados'],
      ['PR-218 · Viaje privado', 'Cliente recurrente · Reserva directa · EC–021', 'Confirmado'],
      ['CT-074 · Traslado de grupo', 'Solicitud por la mini app · Cotización personalizada', 'Propuesta enviada'],
      ['Promoción Costa', 'Servicio privado · Registro de clientes y seguimiento de ventas', 'Activa'],
    ];
    if (state.booked) bookings.unshift(['RTE-008 · Pasajera demo · Asiento 8', 'Mini app directa · RE-1030 · EC–036 · Cuenca → Guayaquil', state.paid ? 'Cobrado' : 'Por cobrar']);
    q('#premium-sales-record').innerHTML = `${rows('Reservas y clientes', bookings)}
      <div class="premium-inline"><label>Conductor de RE-1030 <select id="sales-driver"${state.dispatched ? ' disabled' : ''}>${options([[2, 'Sara Pérez'], [4, 'Andrés Mora']], state.driver)}</select></label>
      <button class="solid" id="sales-dispatch" type="button"${state.dispatched ? ' disabled' : ''}>${state.dispatched ? 'Despacho confirmado' : 'Confirmar despacho de prueba'}</button></div>`;
  }

  function renderFinance() {
    const monthly = q('#premium-finance-period').value === 'month';
    const fuel = monthly ? 1289 : 45;
    const payroll = monthly ? 1910 : 120;
    const service = state.vehicles.reduce((sum, unit) => sum + unit.spending, 0);
    const shared = (monthly ? 7260 : 7 * departure.price) + (state.paid ? departure.price : 0);
    const privateSale = monthly ? 2840 : 94;
    const expenses = fuel + payroll + service + (monthly ? 840 : 29);
    const pending = state.booked && !state.paid ? departure.price : 0;
    q('#premium-finance-figures').innerHTML = `${facts([
      ['Ingresos cobrados', money(shared + privateSale)], ['Gastos registrados', money(expenses)],
      ['Cuentas por cobrar', money((monthly ? 380 : 0) + pending)], ['Cuentas por pagar', money(monthly ? 460 : 76)],
      ['Resultado ilustrativo', money(shared + privateSale - expenses)],
    ])}${chart('Ingresos y gastos del período', [['Pasajes', shared], ['Viajes privados', privateSale], ['Gastos', expenses]])}`;
    q('#premium-finance-record').innerHTML = rows('Movimientos y comprobantes', [
      ['Combustible y proveedor', 'Gasto de flota · EC–014 y otras unidades', money(fuel)],
      ['Remuneraciones', 'Roles de pago · Vinculados al registro de personal', money(payroll)],
      ['Liquidación marketplace', 'Ventas del canal RutasEC · Lote de muestra', 'En revisión'],
      ...(service ? state.vehicles.filter(unit => unit.spending).map(unit => [`Servicio de taller · ${unit.id}`, 'Mantenimiento ejecutado registrado por unidad', money(unit.spending)]) : []),
      ...(state.booked ? [['Boleto RTE-008', 'Venta directa · RE-1030 · EC–036', state.paid ? 'Cobrado' : 'Por cobrar']] : []),
      ...(state.invoiced ? [['Comprobante F-008', 'Muestra electrónica vinculada al boleto RTE-008', money(departure.price)]] : []),
    ]);
    q('#premium-collect').disabled = !state.booked || state.paid;
    q('#premium-invoice').disabled = !state.paid || state.invoiced;
  }

  function renderReports() {
    const corridor = q('#report-route').value;
    const period = q('#report-period').value;
    const choice = q('#report-vehicle');
    const prev = choice.value ? Number(choice.value) : -1;
    const vehicles = state.vehicles.filter(unit => corridor === 'all' || unit.corridor === corridor);
    const filteredIndex = vehicles.some(unit => state.vehicles[prev] === unit) ? prev : -1;
    choice.innerHTML = options([[-1, 'Toda la selección'], ...vehicles.map(unit => [state.vehicles.indexOf(unit), `${unit.id} · ${unit.model}`])], filteredIndex);
    const factor = period === 'month' ? 1 : .25;
    const records = (filteredIndex >= 0 ? [state.vehicles[filteredIndex]] : vehicles).map((unit, index) => {
      const trips = Math.round(unit.trips * factor);
      const sold = Math.round(unit.capacity * trips * .68) + Number(unit.id === departure.unit && state.booked);
      const income = sold * departure.price;
      const maintenance = Math.round(unit.upkeep * factor) + unit.spending;
      const cost = Math.round(unit.fuel * factor) + maintenance + trips * 28;
      return { unit, trips, sold, income, maintenance, cost, km: Math.round(trips * corridors[unit.corridor].distance), privateIncome: Math.round(income * (index % 2 ? .32 : .19)) };
    });
    const total = key => records.reduce((sum, record) => sum + record[key], 0);
    const capacity = records.reduce((sum, { trips, unit }) => sum + trips * unit.capacity, 0);
    const routeTotals = Object.keys(corridors).filter(id => records.some(({ unit }) => unit.corridor === id)).map(id => {
      const routeRecords = records.filter(({ unit }) => unit.corridor === id);
      return [routeName(id), routeRecords.reduce((sum, item) => sum + item.income, 0), routeRecords.reduce((sum, item) => sum + item.income - item.cost, 0)];
    });
    q('#reports-figures').innerHTML = `${facts([
      ['Ingresos del período', money(total('income'))], ['Demanda · Pasajes vendidos', total('sold')],
      ['Ocupación media', `${Math.round(total('sold') / capacity * 100)} %`], ['Frecuencia · Salidas', total('trips')],
      ['Km recorridos', kilometres(total('km'))], ['Gasto de mantenimiento', money(total('maintenance'))],
      ['Costo operativo', money(total('cost'))], ['Resultado estimado', money(total('income') - total('cost'))],
    ])}<h4>Ventas por ruta</h4>${chart('Ventas por ruta', routeTotals.map(([name, sales]) => [name, sales]))}
      <h4>Resultado estimado por ruta</h4>${chart('Resultado por ruta', routeTotals.map(([name, , result]) => [name, result]))}
      <h4>Rendimiento por servicio</h4>${chart('Ventas por tipo de servicio', [['Pasajes compartidos', total('income') - total('privateIncome')], ['Viajes privados', total('privateIncome')]])}
      <h4>Rendimiento por unidad</h4>${rows('Costos, ocupación y resultado', records.map(({ unit, income, cost, sold, trips }) => [
        `${unit.id} · ${routeName(unit.corridor)}`, `${Math.round(sold / (trips * unit.capacity) * 100)} % de ocupación · Costo ${money(cost)}`, money(income - cost),
      ]))}`;
  }

  function selectEvent(index) {
    if (state.selectedEvent !== index || !q('#premium-event-title').textContent) {
      state.selectedEvent = index;
      const [label, detail, link] = timeline[index];
      all('[data-event]').forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
      q('#premium-event-title').textContent = label;
      q('#premium-event-description').textContent = detail;
      q('#premium-event-link').textContent = link;
      q('.premium-event-detail').animate(
        [{ opacity: .25, transform: 'translateY(10px)' }, { opacity: 1, transform: 'translateY(0)' }],
        matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 280,
      );
    }
  }

  const brandControls = Object.fromEntries(['name', 'logo', 'color', 'cover', 'offer', 'contact', 'role'].map(id => [id, q(`#brand-${id}`)]));
  const roleDescription = {
    dispatch: 'Despacho · Acceso a salidas, flota, empleados asignados y seguimiento.',
    finance: 'Administración financiera · Acceso a cobros, gastos, liquidaciones y facturas.',
    sales: 'Ventas · Acceso a catálogo, promociones, disponibilidad y reservas.',
  };
  let localLogo;
  function renderBrand() {
    const values = Object.fromEntries(Object.entries(brandControls).map(([name, input]) => [name, input.value.trim()]));
    const preview = q('.brand-preview');
    preview.style.setProperty('--operator-color', values.color);
    q('#brand-preview-cover').src = `./media/${values.cover}-small.webp`;
    q('#brand-preview-name').textContent = values.name || 'Nombre de tu operadora';
    q('#brand-preview-offer').textContent = values.offer;
    q('#brand-preview-contact').textContent = values.contact;
    q('#brand-preview-role').textContent = roleDescription[values.role];
    const logo = q('#brand-preview-logo');
    logo.textContent = values.logo || 'RE';
    if (localLogo) {
      const image = document.createElement('img');
      image.src = localLogo;
      image.alt = 'Logotipo local de muestra';
      logo.replaceChildren(image);
    }
    if (q('#brand-preset').value !== 'andes') return;
    q('#sales-brand').textContent = values.name || brands.andes.name;
    q('#sales-cover').src = `./media/${values.cover}-small.webp`;
    q('.miniapp-public').style.setProperty('--operator-color', values.color);
  }

  function chooseBrand() {
    const brand = brands[q('#brand-preset').value];
    for (const name of ['name', 'color', 'cover', 'offer', 'contact']) brandControls[name].value = brand[name];
    brandControls.logo.value = brand.initials;
    if (localLogo) URL.revokeObjectURL(localLogo);
    localLogo = undefined;
    q('#brand-logo-file').value = '';
    renderBrand();
  }

  unitButtons.forEach((button, index) => button.addEventListener('click', () => {
    state.fleetIndex = index;
    renderMapSheet();
  }));
  q('#fleet-open-vehicle').addEventListener('click', () => {
    state.vehicleIndex = state.fleetIndex;
    renderVehicle();
  });
  q('#fleet-open-driver').addEventListener('click', () => {
    state.employeeIndex = personnelIndex(currentDriver(state.vehicles[state.fleetIndex]));
    renderEmployee();
  });
  q('#premium-vehicle').addEventListener('change', event => {
    state.vehicleIndex = Number(event.target.value);
    renderVehicle();
    q('#maintenance-feedback').textContent = '';
  });
  q('#premium-employee').addEventListener('change', event => { state.employeeIndex = Number(event.target.value); renderEmployee(); });
  q('#employee-vehicle-link').addEventListener('click', () => {
    state.vehicleIndex = state.vehicles.findIndex(unit => currentDriver(unit) === employees[state.employeeIndex][0]);
    renderVehicle();
  });
  q('#maintenance-apply').addEventListener('click', () => {
    const odometer = q('#maintenance-odometer');
    const threshold = q('#maintenance-threshold');
    if (!odometer.reportValidity() || !threshold.reportValidity()) return;
    const unit = state.vehicles[state.vehicleIndex];
    unit.km = Number(odometer.value);
    unit.next = Number(threshold.value);
    renderVehicle();
    renderMapSheet();
    q('#maintenance-feedback').textContent = 'Odómetro e intervalo actualizados en la ficha de prueba.';
  });
  q('#maintenance-schedule').addEventListener('click', () => {
    const input = q('#maintenance-date');
    if (!input.reportValidity()) return;
    const unit = state.vehicles[state.vehicleIndex];
    unit.appointment = new Intl.DateTimeFormat('es-EC', { dateStyle: 'medium', timeZone: 'UTC' }).format(input.valueAsDate);
    renderVehicle();
    renderMapSheet();
    q('#maintenance-feedback').textContent = 'Servicio programado en la demo. La ficha y el mapa reflejan el nuevo estado.';
  });
  q('#maintenance-complete').addEventListener('click', () => {
    const unit = state.vehicles[state.vehicleIndex];
    if (!unit.appointment) return;
    unit.completed = unit.appointment;
    unit.appointment = '';
    unit.spending += 85;
    unit.next = unit.km + 5000;
    if (unit.status === 'En mantenimiento') unit.status = 'Disponible';
    renderVehicle();
    renderMapSheet();
    renderFinance();
    renderReports();
    q('#maintenance-feedback').textContent = 'Servicio registrado. Se agregó un gasto de USD 85 al historial de la unidad y a Finanzas.';
  });
  q('#miniapp-book').addEventListener('click', () => {
    if (state.booked) return;
    state.booked = true;
    q('#premium-finance-feedback').textContent = 'Boleto RTE-008 por cobrar. Puedes registrar el movimiento.';
    q('#miniapp-receipt').textContent = 'Boleto de prueba RTE-008 · Asiento 8 · Cobro pendiente.';
    renderSales();
    renderMapSheet();
    renderFinance();
    renderReports();
  });
  q('#premium-sales-record').addEventListener('change', event => {
    if (event.target.id !== 'sales-driver') return;
    state.driver = Number(event.target.value);
    renderMapSheet();
    renderEmployee();
  });
  q('#premium-sales-record').addEventListener('click', event => {
    if (!event.target.closest('#sales-dispatch')) return;
    state.dispatched = true;
    renderSales();
    renderMapSheet();
  });
  q('#premium-finance-period').addEventListener('change', renderFinance);
  q('#premium-collect').addEventListener('click', () => {
    state.paid = true;
    renderFinance();
    renderSales();
    q('#miniapp-receipt').textContent = 'Boleto de prueba RTE-008 · Asiento 8 · Cobro confirmado.';
    q('#premium-finance-feedback').textContent = 'Cobro de muestra registrado. Ya puedes generar el comprobante.';
  });
  q('#premium-invoice').addEventListener('click', () => {
    state.invoiced = true;
    renderFinance();
    q('#premium-finance-feedback').textContent = 'Comprobante de muestra F-008 vinculado al boleto RTE-008.';
  });
  for (const id of ['report-period', 'report-route', 'report-vehicle']) q(`#${id}`).addEventListener('change', renderReports);
  all('[data-event]').forEach((button, index) => button.addEventListener('click', () => selectEvent(index)));
  q('#brand-preset').addEventListener('change', chooseBrand);
  for (const control of Object.values(brandControls)) control.addEventListener('input', renderBrand);
  q('#brand-logo-file').addEventListener('change', event => {
    if (localLogo) URL.revokeObjectURL(localLogo);
    localLogo = event.target.files[0] ? URL.createObjectURL(event.target.files[0]) : undefined;
    renderBrand();
  });

  renderMapSheet();
  renderVehicle();
  renderEmployee();
  renderSales();
  renderFinance();
  renderReports();
  selectEvent(0);
  chooseBrand();
}
