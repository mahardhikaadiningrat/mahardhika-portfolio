import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll(options?: {
  progressBarSelector?: string;
  velocitySkewSelector?: string;
}) {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const lenis = new Lenis({
    lerp: prefersReducedMotion ? 1 : 0.1,
    smoothWheel: !prefersReducedMotion,
    wheelMultiplier: 1,
    touchMultiplier: 1.5,
  });

  const progressBar = options?.progressBarSelector
    ? (document.querySelector(options.progressBarSelector) as HTMLElement | null)
    : null;

  const clampSkew = gsap.utils.clamp(-1.6, 1.6);
  const skewSetter = options?.velocitySkewSelector
    ? gsap.quickSetter(options.velocitySkewSelector, 'skewY', 'deg')
    : null;

  let rafId = 0;

  function raf(time: number) {
    lenis.raf(time);
    ScrollTrigger.update();

    if (progressBar) {
      progressBar.style.transform = `scaleX(${lenis.progress})`;
    }

    if (skewSetter && !prefersReducedMotion) {
      skewSetter(clampSkew(lenis.velocity * 0.06));
    }

    rafId = requestAnimationFrame(raf);
  }

  rafId = requestAnimationFrame(raf);

  // Safe Anchor Navigation: mencegah scroll default hanya jika lenis aktif & elemen target ditemukan
  document.addEventListener('click', (e) => {
    const target = e.target as HTMLElement | null;
    const anchor = target?.closest('a[href^="#"]') as HTMLAnchorElement | null;
    if (!anchor) return;

    const hash = anchor.getAttribute('href');
    if (!hash || hash === '#') return;

    const targetEl = document.querySelector(hash) as HTMLElement | null;
    if (!targetEl) return;

    e.preventDefault();
    lenis.start(); // Pastikan Lenis tidak dalam kondisi terhenti (stopped)
    lenis.scrollTo(targetEl, {
      offset: -80,
      duration: 1.05,
      easing: (t) => 1 - Math.pow(1 - t, 3),
    });
  });

  window.addEventListener('beforeunload', () => {
    cancelAnimationFrame(rafId);
    lenis.destroy();
  });

  return lenis;
}