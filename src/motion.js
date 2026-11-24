import gsap from 'gsap';

const wheelIdle = 180;
const scrollTolerance = 2;

function configureStoryGestures(step) {
  const dialogOpen = () => document.querySelector('dialog[open]');
  let wheelTime = -Infinity;
  let wheelHandled = false;
  window.addEventListener('wheel', event => {
    if (event.defaultPrevented || event.ctrlKey || dialogOpen()) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    if (event.timeStamp - wheelTime >= wheelIdle) wheelHandled = false;
    wheelTime = event.timeStamp;

    // Trackpads emit a stream of wheel events, including momentum after release.
    if (wheelHandled) {
      event.preventDefault();
      return;
    }
    if (!event.cancelable) return;
    event.preventDefault();
    wheelHandled = true;
    step(Math.sign(event.deltaY));
  }, { passive: false });

  let swipe;
  window.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || dialogOpen() || !event.target.closest('main, .topbar')) {
      swipe = undefined;
      return;
    }
    const { clientX, clientY } = event.touches[0];
    swipe = { x: clientX, y: clientY, handled: false };
  }, { passive: true });

  window.addEventListener('touchmove', event => {
    if (!swipe || event.touches.length !== 1 || dialogOpen()) return;
    const { clientX, clientY } = event.touches[0];
    const distance = swipe.y - clientY;
    if (swipe.handled || Math.abs(distance) < 28 || Math.abs(distance) <= Math.abs(clientX - swipe.x)) return;
    swipe.handled = true;
    step(Math.sign(distance));
  }, { passive: true });

  function clearSwipe() { swipe = undefined; }
  window.addEventListener('touchend', clearSwipe);
  window.addEventListener('touchcancel', clearSwipe);

  let keyHandled;
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || dialogOpen()) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
    if (event.key === ' ' && event.target.closest('a, button')) return;
    const direction = {
      ArrowUp: -1, ArrowDown: 1, PageUp: -1,
      PageDown: 1, ' ': event.shiftKey ? -1 : 1,
    }[event.key];
    if (!direction) return;
    if (event.repeat && keyHandled === event.key) {
      event.preventDefault();
      return;
    }
    event.preventDefault();
    keyHandled = event.key;
    step(direction);
  });
  window.addEventListener('keyup', event => {
    if (keyHandled === event.key) keyHandled = undefined;
  });
}

export function configureMotion() {
  const bar = document.querySelector('.scroll-meter');
  let totalBeats = 0;
  const scenes = [...document.querySelectorAll('main > section')].map(element => {
    const beats = [...element.querySelectorAll('[data-beat]')];
    const buttons = [...element.querySelectorAll('[data-jump]')];
    const scene = { element, first: totalBeats, last: Math.max(0, beats.length - 1), active: 0 };
    totalBeats += scene.last + 1;

    scene.activate = index => {
      if (index === scene.active) return;
      scene.active = index;
      beats.forEach((beat, i) => {
        const visible = i === index;
        beat.classList.toggle('is-active', visible);
        beat.inert = !visible;
        beat.setAttribute('aria-hidden', String(!visible));
      });
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    };
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      scene.activate(index);
      updateProgress();
    }));
    return scene;
  });

  function currentScene() {
    const offsets = scenes.map(({ element }) => element.getBoundingClientRect().top);
    return offsets.reduce((current, offset, index) => (
      Math.abs(offset) < Math.abs(offsets[current]) ? index : current
    ), 0);
  }

  function updateProgress() {
    const scene = scenes[currentScene()];
    bar.style.transform = `scaleX(${(scene.first + scene.active) / (totalBeats - 1)})`;
  }

  function step(direction) {
    const index = currentScene();
    const scene = scenes[index];
    const offset = scene.element.getBoundingClientRect().top;

    // Settle on a full frame first if native navigation landed between two scenes.
    if (Math.abs(offset) > scrollTolerance) {
      const target = Math.sign(offset) === direction ? scene : scenes[index + direction];
      enter(target ?? scene, direction);
      return;
    }

    const next = scene.active + direction;
    if (next >= 0 && next <= scene.last) {
      scene.activate(next);
      updateProgress();
      return;
    }

    const target = scenes[index + direction];
    if (target) enter(target, direction);
  }

  function enter(scene, direction) {
    scene.activate(direction > 0 ? 0 : scene.last);
    scene.element.scrollIntoView({ block: 'start', behavior: 'instant' });
    updateProgress();
  }

  configureStoryGestures(step);
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  window.addEventListener('hashchange', () => {
    const scene = scenes.find(({ element }) => `#${element.id}` === location.hash);
    if (scene) enter(scene, 1);
  });
  updateProgress();

  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo('.hero-copy h1, .hero-copy > p, .hero-copy > a', { opacity: 0, y: 19 }, {
      opacity: 1, y: 0, stagger: .085, duration: .72, ease: 'power2.out',
    });
  });
  motion.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', () => {
    gsap.fromTo('.hero .photo img', { scale: 1.045 }, { scale: 1, duration: 1.6, ease: 'power2.out' });
  });
}

export function configureDestinations() {
  const section = document.querySelector('#red');
  const stage = section.querySelector('.network-frame');
  const slides = [...stage.querySelectorAll('.destination')];
  const toggle = stage.querySelector('.network-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let visible = false;
  let paused = false;
  let timer;

  function show(index) {
    active = index;
    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
      slide.setAttribute('aria-hidden', String(i !== index));
    });
  }

  function schedule() {
    clearTimeout(timer);
    if (!visible || paused || reducedMotion.matches || document.hidden) return;
    timer = setTimeout(() => {
      show((active + 1) % slides.length);
      schedule();
    }, 4800);
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .6;
    schedule();
  }, { threshold: [.6] }).observe(stage);
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Reanudar fotos' : 'Pausar fotos';
    schedule();
  });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
}
