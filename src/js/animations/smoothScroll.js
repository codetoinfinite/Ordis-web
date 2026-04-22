/* ======================================================
   ORDIS AI LABS — Locomotive Scroll Integration
   ====================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import LocomotiveScroll from 'locomotive-scroll';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const scrollContainer = document.querySelector('#ui-overlay');
  if (!scrollContainer) return;

  // Initialize Locomotive Scroll
  const locoScroll = new LocomotiveScroll({
    el: scrollContainer,
    smooth: true,
    multiplier: 1.0,
    class: 'is-revealed',
    getDirection: true,
    getSpeed: true
  });

  // GSAP ScrollTrigger Proxy integration
  locoScroll.on('scroll', ScrollTrigger.update);
  ScrollTrigger.defaults({ scroller: scrollContainer });

  ScrollTrigger.scrollerProxy(scrollContainer, {
    scrollTop(value) {
      return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
      return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: scrollContainer.style.transform ? 'transform' : 'fixed'
  });

  // Sync scroll values to global window for external access (e.g., 3D Core)
  locoScroll.on('scroll', (args) => {
    window.scrollY = args.scroll.y; // Override scrollY for proxying into the 3D canvas
  });

  // Anchor Scrolling
  const anchors = document.querySelectorAll('a[href^="#"]');
  anchors.forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return locoScroll.scrollTo(0);
      const target = document.querySelector(targetId);
      if (!target) return;

      // Close mobile menu
      const mobileMenu = document.getElementById('mobileMenu');
      const hamburger = document.getElementById('hamburger');
      if (mobileMenu?.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
        hamburger?.classList.remove('is-active');
      }

      locoScroll.scrollTo(target, { offset: -80 });
    });
  });

  // Nav state
  const nav = document.getElementById('nav');
  locoScroll.on('scroll', (args) => {
    if (args.scroll.y > 50) {
      nav?.classList.add('is-scrolled');
    } else {
      nav?.classList.remove('is-scrolled');
    }
  });

  // Mobile menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger?.addEventListener('click', () => {
    hamburger.classList.toggle('is-active');
    mobileMenu?.classList.toggle('is-open');
  });

  // Update ScrollTrigger instances on window resize
  ScrollTrigger.addEventListener('refresh', () => locoScroll.update());
  ScrollTrigger.refresh();

  // Export locoScroll attached to window for manual updates if needed
  window.locoScroll = locoScroll;
}
