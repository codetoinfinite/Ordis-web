/* ======================================================
   ORDIS AI LABS — Tile Effects
   3D tilt + glow follow on elements with .tile-effect
   ====================================================== */

export function initTileEffects() {
    const tiles = document.querySelectorAll('.tile-effect');

    tiles.forEach((tile) => {
        const glow = tile.querySelector('.bento__glow');
        const maxRotation = 8; // degrees

        const onMove = (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const cx = rect.width / 2;
            const cy = rect.height / 2;
            const rotateY = ((x - cx) / cx) * maxRotation;
            const rotateX = ((cy - y) / cy) * maxRotation;

            tile.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;

            // Move glow
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
                glow.style.opacity = '1';
            }
        };

        const onLeave = () => {
            tile.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1)';
            tile.style.transition = 'transform 0.5s cubic-bezier(0.22,1,0.36,1)';
            if (glow) {
                glow.style.opacity = '0';
            }
        };

        const onEnter = () => {
            tile.style.transition = 'none';
        };

        tile.addEventListener('mouseenter', onEnter, { passive: true });
        tile.addEventListener('mousemove', onMove, { passive: true });
        tile.addEventListener('mouseleave', onLeave, { passive: true });
    });
}
