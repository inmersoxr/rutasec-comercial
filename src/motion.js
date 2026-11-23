import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function configureMotion() {
  const q = selector => document.querySelector(selector);
  const motion = gsap.matchMedia();
  motion.add('(prefers-reduced-motion: no-preference)', () => {
    const wide = matchMedia('(min-width: 721px)').matches;
    const entrance = gsap.timeline({ defaults: { ease: 'power3.out' } });
    const letters = document.querySelectorAll('[data-letters]');
    for (const line of letters) {
      for (const node of [...line.childNodes]) {
        if (node.nodeType !== Node.TEXT_NODE) continue;
        const fragment = document.createDocumentFragment();
        for (const char of node.textContent) {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = char;
          fragment.append(span);
        }
        node.replaceWith(fragment);
      }
    }
    entrance.fromTo('.hero .letter, .hero-dot', { yPercent: 29, opacity: 0 }, { yPercent: 0, opacity: 1, duration: .63, stagger: .027 })
      .fromTo('.hero-eyebrow, .hero-line, .hero-detail', { y: 13, opacity: .12 }, { y: 0, opacity: 1, duration: .6, stagger: .1 }, .21);
    const reveal = (target, trigger, offset = 26) => gsap.timeline({
      scrollTrigger: { trigger, start: 'top 94%', end: 'top 56%', scrub: .43, invalidateOnRefresh: true },
    }).fromTo(target, { y: offset, opacity: .62 }, { y: 0, opacity: 1, ease: 'none' });

    reveal('.company-capture', '.company-layout', 64);
    reveal('.modes-intro h2', '.modes-intro', 25);
    for (const section of document.querySelectorAll('.mode-item')) {
      gsap.timeline({ scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: .5 } })
        .fromTo(section.querySelector('.photo img'), { scale: wide ? 1.035 : 1 }, { scale: 1, ease: 'none' })
        .fromTo(section.querySelector('.mode-copy'), { y: 22 }, { y: 0, ease: 'none' }, '<');
    }
    reveal('.passenger-head', '.passenger-head');
    for (const item of document.querySelectorAll('.standard-panel')) {
      reveal(item.querySelector('.capture'), item, 50);
    }
    gsap.timeline({ scrollTrigger: { trigger: '.premium-entry', start: 'top top', end: 'bottom top', scrub: .65 } })
      .fromTo('.premium-entry .photo img', { scale: 1 }, { scale: wide ? 1.52 : 1, transformOrigin: '64% 47%', ease: 'none' })
      .fromTo('.premium-shade', { opacity: 1 }, { opacity: .76 }, '<');
    for (const module of document.querySelectorAll('.premium-module')) {
      const copy = module.querySelector('.premium-module-copy');
      const content = module.querySelector('.premium-module-content');
      const horizontal = wide && module.matches('.premium-identity, .premium-branding, .premium-insights');
      gsap.timeline({ scrollTrigger: { trigger: module, start: 'top 92%', end: 'top 48%', scrub: .45 } })
        .fromTo(copy, { opacity: .6, y: 17 }, { opacity: 1, y: 0 }, 0)
        .fromTo(content, { x: horizontal ? 34 : 0, y: horizontal ? 0 : 30, opacity: .65 }, { x: 0, y: 0, opacity: 1 }, 0);
    }
    gsap.timeline({ scrollTrigger: { trigger: '.tracking-intro', start: 'top top', end: 'bottom top', scrub: .57 } })
      .fromTo('.tracking-intro .photo img', { scale: 1 }, { scale: wide ? 1.115 : 1, ease: 'none' });
    gsap.timeline({ scrollTrigger: { trigger: '.tracking-demo', start: 'top bottom', end: 'top 30%', scrub: .6 } })
      .fromTo('#tracking-map', { clipPath: 'inset(5% 12% 0% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none' });
    reveal('.sim-results', '.simulator', 37);
    gsap.timeline({ scrollTrigger: { trigger: '.compare', start: 'top 96%', end: 'center 62%', scrub: .45 } })
      .fromTo('.compare tbody tr', { opacity: .68, y: 9 }, { opacity: 1, y: 0, stagger: .13 });
    gsap.timeline({ scrollTrigger: { trigger: '.close-frame', start: 'top bottom', end: 'bottom top', scrub: .65 } })
      .fromTo('.close-frame .photo img', { scale: wide ? 1.055 : 1 }, { scale: 1, ease: 'none' });
  });

  motion.add('(min-width: 851px) and (min-height: 645px) and (prefers-reduced-motion: no-preference)', () => {
    gsap.timeline({ scrollTrigger: {
      trigger: '#ecuador', start: 'top top', end: () => '+=' + Math.round(window.innerHeight * .32),
      pin: '.hero-frame', scrub: .55, invalidateOnRefresh: true,
    } }).fromTo('.hero-frame .photo img', { scale: 1 }, { scale: 1.13, xPercent: -1.8, ease: 'none' });
  });

  const bar = q('.scroll-meter');
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
