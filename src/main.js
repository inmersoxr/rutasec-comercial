import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource-variable/dm-sans/wght.css';
import './styles.css';
import { render } from './sections.js';
import { configureMotion } from './motion.js';
import { configureApplication, configureNavigation, configurePassenger, configurePremium, configureSimulator } from './interactions.js';

document.querySelector('#app').innerHTML = render();
configureNavigation();
configurePassenger();
configurePremium();
configureSimulator();
configureApplication();
configureMotion();

const mapAreas = document.querySelectorAll('.map-surface');
const mapsObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  mapsObserver.disconnect();
  import('./maps.js').then(({ configureMaps }) => configureMaps()).catch(() => {
    for (const area of mapAreas) area.textContent = 'El mapa no pudo cargarse. Recarga la página para volver a intentarlo.';
  });
}, { rootMargin: '300px' });
mapAreas.forEach(map => mapsObserver.observe(map));

if (location.hash) {
  const section = document.getElementById(location.hash.slice(1));
  if (section) requestAnimationFrame(() => section.scrollIntoView());
}
