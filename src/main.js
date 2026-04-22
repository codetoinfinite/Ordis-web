/* ======================================================
   STRIX AI CLONE — Main Entry Point
   ====================================================== */

// Styles (Only the exact Strix clone styles)
import './styles/index.css';

const init = () => {
  console.log('[Ordis AI] Strix-Clone UI Initialized with WT Bobine typography.');
};

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
