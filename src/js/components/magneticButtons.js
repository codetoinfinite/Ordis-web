/* ======================================================
   ORDIS AI LABS — Magnetic Buttons
   Cursor-following effect on elements with .magnetic class
   ====================================================== */
import gsap from 'gsap';

export function initMagneticButtons() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach((el) => {
        const strength = parseFloat(el.dataset.strength) || 20;

        const onMove = (e) => {
            const rect = el.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const dx = e.clientX - cx;
            const dy = e.clientY - cy;

            gsap.to(el, {
                x: dx / (100 / strength),
                y: dy / (100 / strength),
                duration: 0.4,
                ease: 'power2.out',
            });
        };

        const onLeave = () => {
            gsap.to(el, {
                x: 0,
                y: 0,
                duration: 0.6,
                ease: 'elastic.out(1,0.4)',
            });
        };

        el.addEventListener('mousemove', onMove, { passive: true });
        el.addEventListener('mouseleave', onLeave, { passive: true });
    });
}
