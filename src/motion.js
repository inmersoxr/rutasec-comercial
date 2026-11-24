import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const wheelIdle = 180;
const scrollTolerance = 2;

function configureBeatGestures(scenes) {
  function getStep(distance) {
    const position = window.scrollY;
    const direction = Math.sign(distance);
    const projected = position + distance;
    // When a gesture crosses into a scene, stop at its entrance beat.
    const ordered = direction > 0 ? scenes : [...scenes].reverse();
    for (const { trigger, last } of ordered) {
      const { start, end } = trigger;
      const increment = (end - start) / last;
      if (position >= start - scrollTolerance && position <= end + scrollTolerance) {
        const current = Math.max(0, Math.min(last, Math.round((position - start) / increment)));
        const next = current + direction;
        if (next >= 0 && next <= last) return start + next * increment;
      } else if (direction > 0 && position < start && projected >= start) {
        return start;
      } else if (direction < 0 && position > end && projected <= end) {
        return end;
      }
    }
  }

  function moveTo(top) {
    window.scrollTo({ top, behavior: 'instant' });
    ScrollTrigger.update();
  }

  const dialogOpen = () => document.querySelector('dialog[open]');
  let wheelTime = -Infinity;
  let wheelHandled = false;
  window.addEventListener('wheel', event => {
    if (event.defaultPrevented || event.ctrlKey || dialogOpen()) return;
    if (event.timeStamp - wheelTime >= wheelIdle) wheelHandled = false;
    wheelTime = event.timeStamp;

    // Trackpads emit a stream of wheel events, including momentum after release.
    if (wheelHandled) {
      event.preventDefault();
      return;
    }
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
    const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1;
    const target = getStep(event.deltaY * unit);
    if (target === undefined || !event.cancelable) return;
    event.preventDefault();
    wheelHandled = true;
    moveTo(target);
  }, { passive: false });

  let swipe;
  window.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || dialogOpen() || !event.target.closest('.cinema-stage')) {
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
    const travel = Math.sign(distance) * window.innerHeight * 0.65;
    swipe.handled = true;
    moveTo(getStep(travel) ?? window.scrollY + travel);
  }, { passive: true });

  function clearSwipe() { swipe = undefined; }
  window.addEventListener('touchend', clearSwipe);
  window.addEventListener('touchcancel', clearSwipe);

  let keyHandled;
  window.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || dialogOpen()) return;
    if (event.target.closest('input, select, textarea, [contenteditable="true"]')) return;
    if (event.key === ' ' && event.target.closest('a, button')) return;
    const distance = {
      ArrowUp: -40, ArrowDown: 40, PageUp: -window.innerHeight,
      PageDown: window.innerHeight, ' ': window.innerHeight * (event.shiftKey ? -1 : 1),
    }[event.key];
    if (!distance) return;
    if (event.repeat && keyHandled === event.key) {
      event.preventDefault();
      return;
    }
    const target = getStep(distance);
    if (target === undefined) return;
    event.preventDefault();
    keyHandled = event.key;
    moveTo(target);
  });
  window.addEventListener('keyup', event => {
    if (keyHandled === event.key) keyHandled = undefined;
  });
}

export function configureMotion() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const scenes = [];
  for (const scene of document.querySelectorAll('.cinema')) {
    const beats = [...scene.querySelectorAll('[data-beat]')];
    const buttons = [...scene.querySelectorAll('[data-jump]')];
    let active = 0;

    function activate(index) {
      if (index === active) return;
      active = index;
      beats.forEach((beat, i) => {
        const visible = i === index;
        beat.classList.toggle('is-active', visible);
        beat.inert = !visible;
        beat.setAttribute('aria-hidden', String(!visible));
      });
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    }

    function applyProgress(self) {
      activate(Math.round(self.progress * (beats.length - 1)));
    }

    const timeline = ScrollTrigger.create({
      trigger: scene, start: 'top top', end: 'bottom bottom',
      onUpdate: applyProgress, onRefresh: applyProgress,
    });
    scenes.push({ trigger: timeline, last: beats.length - 1 });
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      const offset = (timeline.end - timeline.start) * index / (beats.length - 1);
      window.scrollTo({ top: timeline.start + offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }));
  }

  configureBeatGestures(scenes);

  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    gsap.fromTo('.hero-copy h1, .hero-copy > p, .hero-copy > a', { opacity: 0, y: 19 }, {
      opacity: 1, y: 0, stagger: .085, duration: .72, ease: 'power2.out',
    });
  });
  motion.add('(prefers-reduced-motion: no-preference) and (min-width: 721px)', () => {
    gsap.to('.hero .photo img', {
      scale: 1.065, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
    });
  });

  const bar = document.querySelector('.scroll-meter');
  const updateProgress = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    const progress = available > 0 ? window.scrollY / available : 0;
    bar.style.transform = `scaleX(${Math.max(0, Math.min(1, progress))})`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  document.fonts.ready.then(() => ScrollTrigger.refresh());
  updateProgress();
}

export function configureDestinations() {
  const section = document.querySelector('#red');
  const stage = section.querySelector('.network-frame');
  const slides = [...stage.querySelectorAll('.destination')];
  const toggle = stage.querySelector('.network-pause');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let active = 0;
  let scrollStep = 0;
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

  function followScroll() {
    if (!visible) return;
    const travel = Math.max(1, section.offsetHeight - stage.offsetHeight);
    const progress = Math.max(0, Math.min(1, -section.getBoundingClientRect().top / travel));
    const step = Math.min(slides.length - 1, Math.floor(progress * slides.length));
    if (step === scrollStep) return;
    show(step);
    scrollStep = step;
    schedule();
  }

  new IntersectionObserver(([entry]) => {
    visible = entry.intersectionRatio >= .6;
    followScroll();
    schedule();
  }, { threshold: [.6] }).observe(stage);
  toggle.addEventListener('click', () => {
    paused = !paused;
    toggle.textContent = paused ? 'Reanudar fotos' : 'Pausar fotos';
    schedule();
  });
  window.addEventListener('scroll', followScroll, { passive: true });
  window.addEventListener('resize', followScroll, { passive: true });
  document.addEventListener('visibilitychange', schedule);
  reducedMotion.addEventListener('change', schedule);
}
