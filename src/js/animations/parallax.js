/* ======================================================
   ORDIS AI LABS — Parallax Effects
   Speed-based parallax on decorative shapes using GSAP
   ====================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initParallax() {
    // Parallax shapes in features section
    const shapes = document.querySelectorAll('.features__shape, .cta__shape');
    shapes.forEach((shape) => {
        const speed = parseFloat(shape.dataset.scrollSpeed) || 1;
        gsap.to(shape, {
            y: () => speed * 150,
            ease: 'none',
            scrollTrigger: {
                trigger: shape.closest('.section') || shape.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });
    });

    // Hero elements subtle parallax
    const heroContent = document.querySelector('.hero__content');
    if (heroContent) {
        gsap.to(heroContent, {
            y: 100,
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
            },
        });
    }

    // Section headers subtle scale on scroll
    const headers = document.querySelectorAll('.section__header');
    headers.forEach((header) => {
        gsap.from(header, {
            y: 40,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: header,
                start: 'top 80%',
                once: true,
            },
        });
    });
}
