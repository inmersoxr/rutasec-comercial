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
    gsap.timeline({ scrollTrigger: { trigger: '.ops-wrap', start: 'top bottom', end: 'top 24%', scrub: .55 } })
      .fromTo('.ops', { clipPath: 'inset(7% 8% 3% 8% round 6px)', y: 26 }, { clipPath: 'inset(0% 0% 0% 0% round 0px)', y: 0, ease: 'power1.inOut' });
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

  let sliderTrigger;
  motion.add('(min-width: 851px) and (min-height: 645px) and (prefers-reduced-motion: no-preference)', () => {
    const track = q('.network-track');
    const visible = q('.network-window');
    const distance = () => Math.max(0, track.scrollWidth - visible.clientWidth);
    const move = gsap.timeline({ scrollTrigger: {
      trigger: '#red', start: 'top top', end: () => '+=' + (distance() * .83), scrub: .48,
      pin: '.network-frame', anticipatePin: 1, invalidateOnRefresh: true,
    } }).to(track, { x: () => -distance(), ease: 'none' });
    sliderTrigger = move.scrollTrigger;

    gsap.timeline({ scrollTrigger: {
      trigger: '#ecuador', start: 'top top', end: () => '+=' + Math.round(window.innerHeight * .32),
      pin: '.hero-frame', scrub: .55, invalidateOnRefresh: true,
    } }).fromTo('.hero-frame .photo img', { scale: 1 }, { scale: 1.13, xPercent: -1.8, ease: 'none' });
    return () => { sliderTrigger = undefined; };
  });

  for (const button of document.querySelectorAll('[data-network]')) {
    button.addEventListener('click', () => {
      const windowEl = q('.network-window');
      const target = Number(button.dataset.network);
      const measured = q('.destination').offsetWidth + 20;
      const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
      if (!sliderTrigger) {
        windowEl.scrollBy({ left: target * measured, behavior });
        return;
      }
      const { start, end, progress } = sliderTrigger;
      const next = Math.max(0, Math.min(1, (Math.round(progress * 3) + target) / 3));
      window.scrollTo({ top: start + (end - start) * next, behavior });
    });
  }
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
