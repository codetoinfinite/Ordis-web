/* ======================================================
   ORDIS AI LABS — Scroll Reveal Animations
   ScrollTrigger stagger reveal for layout sections
   ====================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initScrollAnimations() {
    // 1. Solution Blocks
    const solutionBlocks = document.querySelectorAll('.solution-block');
    if (solutionBlocks.length > 0) {
        gsap.set(solutionBlocks, { opacity: 0, x: 50 });
        ScrollTrigger.batch(solutionBlocks, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    stagger: 0.15,
                });
            },
            start: 'top 85%',
            once: true,
        });
    }

    // 2. Feature Rows & Impact Banners
    const rows = document.querySelectorAll('.feature-row, .impact-banner');
    if (rows.length > 0) {
        gsap.set(rows, { opacity: 0, y: 60 });
        ScrollTrigger.batch(rows, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    ease: 'power3.out',
                    stagger: 0.2,
                });
            },
            start: 'top 85%',
            once: true,
        });
    }

    // 3. Pricing Cards
    const pricingCards = document.querySelectorAll('.pricing-card');
    if (pricingCards.length > 0) {
        gsap.set(pricingCards, { opacity: 0, y: 50, scale: 0.95 });
        ScrollTrigger.batch(pricingCards, {
            onEnter: (batch) => {
                gsap.to(batch, {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.7,
                    ease: 'power3.out',
                    stagger: 0.1,
                });
            },
            start: 'top 85%',
            once: true,
        });
    }

    // 4. Robust GSAP Pinning for Solutions Sidebar (Desktop Only)
    // This perfectly synchronizes with Locomotive Scroll proxy and disables on mobile/tablets
    ScrollTrigger.matchMedia({
      "(min-width: 993px)": function() {
        ScrollTrigger.create({
          trigger: ".solutions__layout",
          start: "top 25%", // Pin when layout reaches 25% from top
          end: "bottom 90%", // Unpin right before the end
          pin: ".solutions__sticky",
          pinSpacing: false,
          markers: false
        });
      }
    });

}
