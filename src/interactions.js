import gsap from 'gsap';
import { contacts, trip } from './content.js';

const q = selector => document.querySelector(selector);
const all = selector => [...document.querySelectorAll(selector)];
const reduced = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

export function configureNavigation() {
  const toggle = q('.index-toggle');
  const menu = q('.chapter-menu');
  function setIndex(open) {
    menu.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
  }
  toggle.addEventListener('click', () => setIndex(menu.hidden));
  menu.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (!link) return;
    setIndex(false);
    const target = document.querySelector(link.getAttribute('href'));
    target?.setAttribute('tabindex', '-1');
    target?.focus({ preventScroll: true });
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setIndex(false);
      toggle.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!menu.hidden && !menu.contains(event.target) && !toggle.contains(event.target)) setIndex(false);
  });
}

export function configurePassenger() {
  const steps = all('.trip-step');
  const buttons = all('[data-trip]');
  const screen = q('#trip-screen');
  const display = q('.trip-display');
  let active = -1;
  let manual = false;
  let referenceY = 0;
  function activate(index, clicked = false) {
    if (clicked) {
      manual = true;
      referenceY = scrollY;
    }
    if (index === active) return;
    active = index;
    const [title, , picture, capture] = trip[index];
    steps.forEach((step, i) => step.classList.toggle('is-active', i === index));
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    all('.trip-photo').forEach(photo => photo.classList.toggle('is-active', photo.dataset.photo === picture));
    q('.trip-count').textContent = `${String(index + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
    q('.trip-caption p').textContent = title;
    screen.hidden = !capture;
    if (capture) {
      const img = screen.querySelector('img');
      img.src = `./media/app-${capture}.webp`;
      img.alt = `RutasEC · ${title}`;
      if (!reduced()) gsap.fromTo(screen, { y: 12, opacity: .18 }, { y: 0, opacity: 1, duration: .32, overwrite: true });
    }
  }
  buttons.forEach((button, index) => button.addEventListener('click', () => activate(index, true)));
  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      if (manual && Math.abs(scrollY - referenceY) < 65) return;
      manual = false;
      const bounds = display.getBoundingClientRect();
      if (bounds.top >= innerHeight || bounds.bottom <= 0) return;
      const center = innerWidth <= 720 ? Math.min(innerHeight - 35, bounds.bottom + 130) : innerHeight * .58;
      const current = steps.findLastIndex(step => step.getBoundingClientRect().top <= center);
      activate(Math.max(0, current));
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  activate(0);
}

export function configureSimulator() {
  const amount = new Intl.NumberFormat('es-EC', { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const keys = ['price', 'seats', 'days'];
  const paired = Object.fromEntries(keys.map(key => [key, {
    number: q(`[data-number="${key}"]`), range: q(`[data-range="${key}"]`),
  }]));
  const displays = [
    [q('#sim-day'), true], [q('#sim-month-seats'), false],
    [q('#sim-month'), true], [q('#sim-year'), true],
  ].map(([element, money]) => ({ element, money, current: { amount: 0 } }));
  function update(animate) {
    const [price, seats, days] = keys.map(key => +paired[key].range.value);
    const daily = price * seats;
    const values = [daily, seats * days, daily * days, daily * days * 12];
    displays.forEach(({ element, money, current }, index) => {
      const label = () => { element.textContent = `${money ? 'USD ' : ''}${amount.format(current.amount)}`; };
      if (!animate || reduced()) {
        current.amount = values[index];
        label();
      } else {
        gsap.to(current, { amount: values[index], duration: .24, ease: 'power2.out', overwrite: true, onUpdate: label });
      }
    });
  }
  for (const {number, range} of Object.values(paired)) {
    range.addEventListener('input', () => { number.value = range.value; update(true); });
    number.addEventListener('input', () => {
      if (number.value === '' || !Number.isFinite(number.valueAsNumber)) return;
      range.value = number.value;
      update(true);
    });
    number.addEventListener('change', () => { number.value = range.value; update(true); });
  }
  update(false);
}

export function configureApplication() {
  const form = q('#application');
  const status = q('#application-status');
  const submit = form.querySelector('button[type="submit"]');
  const purposes = { association: 'Asociación de operadora', demo: 'Solicitud de demostración', advisor: 'Contacto con asesor' };
  let requestId = crypto.randomUUID();
  let pending = false;
  let lastAttempt = '';
  all('[data-purpose]').forEach(link => link.addEventListener('click', () => {
    form.elements.purpose.value = link.dataset.purpose;
    requestAnimationFrame(() => form.elements.purpose.focus({ preventScroll: true }));
  }));
  function renderContacts(settings = {}) {
    const whatsapp = String(contacts.whatsapp || settings.whatsapp || '').replace(/\D/g, '');
    const email = contacts.email || settings.email;
    if (/^[1-9]\d{7,14}$/.test(whatsapp)) {
      const link = q('[data-whatsapp]');
      link.href = `https://wa.me/${whatsapp}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.hidden = false;
    }
    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email ?? '')) {
      const link = q('[data-email]');
      link.href = `mailto:${email}`;
      link.hidden = false;
    }
  }
  renderContacts();
  fetch(contacts.settingsUrl, { signal: AbortSignal.timeout(10000) })
    .then(response => response.ok ? response.json() : {})
    .then(response => renderContacts(response.settings))
    .catch(() => {});
  function showStatus(text, isError = false) {
    status.textContent = text;
    status.dataset.error = String(isError);
  }
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (pending || !form.reportValidity()) return;
    const data = new FormData(form);
    const types = data.getAll('vehicleTypes');
    if (!types.length) {
      showStatus('Selecciona al menos un tipo de vehículo.', true);
      form.querySelector('[name="vehicleTypes"]').focus();
      return;
    }
    const details = String(data.get('observations') || '').trim();
    const body = {
      company: String(data.get('company')).trim(),
      responsible: String(data.get('responsible')).trim(),
      email: String(data.get('email')).trim(),
      whatsapp: String(data.get('whatsapp')).trim(),
      city: String(data.get('city')).trim(),
      routes: String(data.get('routes')).trim(),
      vehicleCount: Number(data.get('vehicleCount')),
      vehicleTypes: types,
      observations: [`Landing comercial RutasEC · ${purposes[data.get('purpose')]}`, details].filter(Boolean).join('\n').slice(0, 1100),
      website: '',
      consent: data.get('consent') === 'on',
    };
    if (![body.company, body.responsible, body.city, body.routes].every(Boolean)) {
      showStatus('Completa los datos de tu empresa antes de enviar.', true);
      return;
    }
    const signature = JSON.stringify(body);
    if (lastAttempt && lastAttempt !== signature) requestId = crypto.randomUUID();
    lastAttempt = signature;
    pending = true;
    submit.disabled = true;
    showStatus('Enviando solicitud…');
    try {
      const response = await fetch(contacts.applicationUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, ...body }),
        signal: AbortSignal.timeout(15000),
      });
      const result = await response.json();
      if (!response.ok || !result.receipt?.id) throw new Error(result.error || 'El servicio no confirmó la recepción.');
      form.reset();
      requestId = crypto.randomUUID();
      lastAttempt = '';
      showStatus(`Solicitud recibida. Referencia ${result.receipt.id}. El equipo comercial podrá darle seguimiento.`);
    } catch (error) {
      showStatus(error.name === 'TimeoutError' || error instanceof TypeError || error instanceof SyntaxError
        ? 'La conexión se interrumpió. Puedes volver a intentar con los mismos datos.'
        : error.message, true);
    } finally {
      pending = false;
      submit.disabled = false;
    }
  });
}
