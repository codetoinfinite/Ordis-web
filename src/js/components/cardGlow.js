/* ======================================================
   ORDIS AI LABS — Card Glow Effect (Strix-inspired)
   Mouse-tracking radial glow on card elements
   ====================================================== */

export function initCardGlow() {
  const cards = document.querySelectorAll('.solution-block, .pricing-card, .impact-banner, .card');

  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${x}%`);
      card.style.setProperty('--mouse-y', `${y}%`);
    }, { passive: true });
  });
}
