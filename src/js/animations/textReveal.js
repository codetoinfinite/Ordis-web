/* ======================================================
   ORDIS AI LABS — Text Reveal
   Letter-split + stagger reveal on scroll for headings
   ====================================================== */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

export function initTextReveal() {
    const elements = document.querySelectorAll('.reveal-text');

    elements.forEach((el) => {
        gsap.fromTo(
            el,
            { opacity: 0, y: 30 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 88%',
                    once: true,
                },
            }
        );
    });

    // Special 3D text effect for hero
    const hero3dText = document.querySelectorAll('.text-3d');
    hero3dText.forEach((el) => {
        gsap.fromTo(
            el,
            {
                textShadow: '0px 0px 0 rgba(212,168,83,0), 0px 0px 0 rgba(212,168,83,0)',
            },
            {
                textShadow:
                    '1px 1px 0 rgba(212,168,83,0.3), 2px 2px 0 rgba(212,168,83,0.2), 3px 3px 0 rgba(212,168,83,0.1), 4px 4px 8px rgba(0,0,0,0.4)',
                duration: 1.2,
                delay: 0.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    once: true,
                },
            }
        );
    });
}
