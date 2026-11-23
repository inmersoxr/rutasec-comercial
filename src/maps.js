import { corridors, fleet } from './premium-data.js';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const duration = 110_000;
const shapeSource = './media/route.json';
const selector = name => document.querySelector(name);
const initialPart = .22;
const vehicleIcon = (label, anchor = [14, 14]) => L.divIcon({ html: label, className: 'map-vehicle', iconSize: [29, 29], iconAnchor: anchor });

function createMap(id, boundary) {
  const map = L.map(id, { scrollWheelZoom: false, touchZoom: true, dragging: !L.Browser.touch, attributionControl: true });
  if (boundary) {
    const pane = map.createPane('geographic-background');
    pane.style.zIndex = '190';
    L.geoJSON(boundary, {
      pane: 'geographic-background', interactive: false,
      style: { color: '#8fa18b', weight: 1.3, fillColor: '#d1ddbf', fillOpacity: 1 },
    }).addTo(map);
  }
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    maxZoom: 18,
  }).addTo(map);
  map.attributionControl.setPrefix(false);
  return map;
}

function drawRoute(map, coordinates) {
  L.polyline(coordinates, { color: '#273c31', weight: 8, opacity: .8, interactive: false }).addTo(map);
  return L.polyline(coordinates, { color: '#c29a1e', weight: 5, opacity: 1 }).addTo(map);
}

function distanceIndex(coordinates) {
  const marks = [0];
  for (let index = 1; index < coordinates.length; index += 1) {
    marks.push(marks[index - 1] + L.latLng(coordinates[index - 1]).distanceTo(coordinates[index]));
  }
  const length = marks.at(-1);

  return function at(progress) {
    const position = progress * length;
    let lo = 0;
    let hi = marks.length - 1;
    while (hi - lo > 1) {
      const middle = (hi + lo) >> 1;
      if (marks[middle] < position) lo = middle;
      else hi = middle;
    }
    const a = coordinates[lo];
    const b = coordinates[hi];
    const amount = (position - marks[lo]) / (marks[hi] - marks[lo] || 1);
    return [a[0] + (b[0] - a[0]) * amount, a[1] + (b[1] - a[1]) * amount];
  };
}

function setupFleet(shapes, boundary) {
  const map = createMap('fleet-map', boundary);
  const bounds = L.latLngBounds([]);
  const labeled = new Set();
  const routes = Object.fromEntries(Object.entries(shapes).map(([id, points]) => {
    L.polyline(points, { color: '#536d50', weight: 6, opacity: .72, interactive: false }).addTo(map);
    const line = L.polyline(points, { color: '#f1cc4c', weight: 3, interactive: false }).addTo(map);
    bounds.extend(line.getBounds());
    for (const [name, point] of [[corridors[id].origin, points[0]], [corridors[id].destination, points.at(-1)]]) {
      if (labeled.has(name)) continue;
      labeled.add(name);
      L.circleMarker(point, { radius: 3, color: '#416448', weight: 2, interactive: false }).addTo(map)
        .bindTooltip(name, { permanent: true, direction: 'top', offset: [0, -5], className: 'fleet-city-label' });
    }
    return [id, distanceIndex(points)];
  }));
  const buttons = [...document.querySelectorAll('[data-unit]')];
  // Offset the two co-located Cuenca units so both markers can be selected.
  const anchors = { 'EC–036': [28, 19], 'EC–052': [-8, -7] };
  const markers = fleet.map(({ id, model, status, position, corridor }, index) =>
    L.marker(routes[corridor](position), {
      icon: vehicleIcon(index + 1, anchors[id]), title: id, alt: `${id} · ${model} · ${status}`,
    }).addTo(map).bindTooltip(`${id} · ${model}`).on('click', () => buttons[index].click()));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    markers.forEach((marker, i) => marker.getElement()?.classList.toggle('is-selected', index === i));
    map.panTo(markers[index].getLatLng(), { animate: !reduced.matches });
  }));

  function fit() {
    map.invalidateSize({ pan: false });
    const dock = selector('.fleet-dock');
    const overlay = getComputedStyle(dock).position === 'absolute' ? dock.offsetWidth + 24 : 0;
    map.fitBounds(bounds, { paddingTopLeft: [26, 25], paddingBottomRight: [26 + overlay, 36], animate: false });
  }
  selector('#fleet-fit').addEventListener('click', fit);
  fit();
  markers[0].getElement()?.classList.add('is-selected');

  let animation = 0;
  let visible = false;
  let paused = false;
  let elapsed = 0;
  let last = 0;
  const toggle = selector('#fleet-motion');
  function frame(now) {
    if (last) elapsed += Math.min(100, now - last);
    last = now;
    fleet.forEach(({ position, status, corridor }, index) => {
      if (status !== 'En recorrido') return;
      const offset = (elapsed / 480000) % .075;
      markers[index].setLatLng(routes[corridor](Math.min(.997, position + offset)));
    });
    animation = requestAnimationFrame(frame);
  }
  function syncAnimation() {
    cancelAnimationFrame(animation);
    last = 0;
    toggle.hidden = reduced.matches;
    if (visible && !paused && !document.hidden && !reduced.matches) animation = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    syncAnimation();
  }).observe(map.getContainer());
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Reanudar simulación' : 'Pausar simulación';
    syncAnimation();
  });
  document.addEventListener('visibilitychange', syncAnimation);
  reduced.addEventListener('change', syncAnimation);
}

function setupTracking(route, at, boundary) {
  const map = createMap('tracking-map', boundary);
  const line = drawRoute(map, route.coordinates);
  map.fitBounds(line.getBounds(), { padding: [25, 25], animate: false });
  for (const [index, terminal] of [[0, route.origin], [1, route.destination]]) {
    L.circleMarker(at(index), { radius: 7, color: '#29382c', weight: 2, fillColor: '#fff7d6', fillOpacity: 1 })
      .addTo(map).bindTooltip(terminal.name);
  }

  const params = new URLSearchParams(location.search);
  const clamp = n => Number.isFinite(n) ? Math.max(0, Math.min(1, n)) : initialPart;
  let progress = params.has('avance') ? clamp(Number(params.get('avance'))) : initialPart;
  const sharedStart = Number(params.get('desde'));
  let running = sharedStart > 0;
  let started = running ? sharedStart : 0;
  const marker = L.marker(at(progress), { icon: vehicleIcon('↗'), title: 'Vehículo simulado', interactive: false }).addTo(map);
  const play = selector('#track-play');
  const notice = selector('#track-notice');
  const km = selector('#track-km');
  const eta = selector('#track-eta');
  const percentage = selector('#track-percent');
  let animation = 0;
  let lastFrame = 0;

  function draw() {
    marker.setLatLng(at(progress));
    const remaining = 1 - progress;
    km.textContent = `${Math.round(route.distanceMeters * remaining / 1000)} km`;
    const minutes = Math.ceil(route.durationSeconds * remaining / 60);
    eta.textContent = minutes >= 60 ? `${Math.floor(minutes / 60)} h ${minutes % 60} min` : `${minutes} min`;
    percentage.textContent = `${Math.floor(progress * 100)} %`;
    play.textContent = running ? 'Pausar recorrido' : progress === 1 ? 'Volver a iniciar' : 'Iniciar recorrido';
    if (progress === 1) notice.textContent = 'El recorrido de demostración ha llegado a su destino.';
  }

  function tick(timestamp) {
    if (!running) return;
    if (timestamp - lastFrame >= 90) {
      lastFrame = timestamp;
      progress = clamp((Date.now() - started) / duration);
      if (progress === 1) running = false;
      draw();
    }
    if (running) animation = requestAnimationFrame(tick);
  }

  play.addEventListener('click', () => {
    if (running) {
      running = false;
      cancelAnimationFrame(animation);
    } else {
      if (progress === 1) progress = 0;
      notice.textContent = '';
      started = Date.now() - progress * duration;
      running = true;
      animation = requestAnimationFrame(tick);
    }
    draw();
  });
  selector('#track-reset').addEventListener('click', () => {
    running = false;
    progress = 0;
    cancelAnimationFrame(animation);
    notice.textContent = '';
    draw();
  });
  selector('#track-share').addEventListener('click', async () => {
    const url = new URL(location.href);
    url.hash = 'tracking-demo';
    url.searchParams.set('avance', progress.toFixed(3));
    if (running) url.searchParams.set('desde', String(started));
    else url.searchParams.delete('desde');
    try {
      if (navigator.share) {
        await navigator.share({ title: 'RutasEC · Seguimiento de demostración', url: url.href });
        return;
      }
      await navigator.clipboard.writeText(url.href);
      notice.textContent = 'Enlace copiado.';
    } catch (error) {
      if (error.name === 'AbortError') return;
      const link = document.createElement('a');
      link.href = url.href;
      link.textContent = 'Abrir enlace de seguimiento ↗';
      notice.replaceChildren(link);
    }
  });

  draw();
  if (running) animation = requestAnimationFrame(tick);
}

export async function configureMaps() {
  const [response, boundary, premiumRoutes] = await Promise.all([
    fetch(shapeSource),
    fetch('./media/ecuador-boundary.json').then(result => result.ok ? result.json() : null).catch(() => null),
    fetch('./media/premium-routes.json').then(result => result.ok ? result.json() : null).catch(() => null),
  ]);
  if (!response.ok) throw new Error('Error al cargar el recorrido.');
  const route = await response.json();
  const toLatLng = points => points.map(([longitude, latitude]) => [latitude, longitude]);
  route.coordinates = toLatLng(route.coordinates);
  setupTracking(route, distanceIndex(route.coordinates), boundary);
  if (premiumRoutes?.quito && premiumRoutes?.manta) {
    setupFleet({ cuenca: route.coordinates, quito: toLatLng(premiumRoutes.quito), manta: toLatLng(premiumRoutes.manta) }, boundary);
  } else {
    selector('#fleet-map').textContent = 'No se pudieron cargar las rutas de la flota. Puedes consultar las fichas de las unidades.';
  }
}
