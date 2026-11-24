import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function configureMotion() {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
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
    buttons.forEach((button, index) => button.addEventListener('click', () => {
      const offset = (timeline.end - timeline.start) * index / (beats.length - 1);
      window.scrollTo({ top: timeline.start + offset, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
    }));
  }

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
