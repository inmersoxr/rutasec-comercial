import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource-variable/dm-sans/wght.css';
import './styles.css';
import { render } from './sections.js';
import { configureMotion, configureDestinations } from './motion.js';
import { configurePremium } from './premium.js';
import { configureApplication, configureDialogs, configureNavigation, configureSimulator } from './interactions.js';

document.querySelector('#app').innerHTML = render();
configureNavigation();
configurePremium();
configureSimulator();
configureApplication();
configureMotion();
configureDestinations();
configureDialogs();

const mapAreas = document.querySelectorAll('.map-surface');
const mapsObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  mapsObserver.disconnect();
  import('./maps.js').then(({ configureMaps }) => configureMaps()).catch(() => {
    for (const area of mapAreas) area.textContent = 'El mapa no pudo cargarse. Recarga la página para volver a intentarlo.';
  });
}, { rootMargin: '300px' });
mapAreas.forEach(map => mapsObserver.observe(map));
