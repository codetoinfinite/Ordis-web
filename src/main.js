/* ======================================================
   STRIX AI CLONE — Main Entry Point
   ====================================================== */

// Styles (Only the exact Strix clone styles)
import './styles/index.css';
import './styles/ordis-components.css';

import { setupMcpPulse, setupCounters, setupMktFilters, setupFeatureShowcase } from './js/ordis-components.js';

function setupAgentDeploy() {
  const steps    = document.querySelectorAll('.strix-step');
  const termBody = document.getElementById('agent-terminal-body');
  if (!steps.length || !termBody) return;

  const SCRIPT = [
    {
      cmd: 'ordis connect --provider aws',
      lines: [
        { text: '✔ Authentication successful',                   type: 'ok'   },
        { text: '✔ Scanning 847 infrastructure components...',   type: 'ok'   },
        { text: '✔ Architecture map complete — 3 regions',       type: 'ok'   },
      ],
    },
    {
      cmd: 'ordis deploy agent --type data-pipeline',
      lines: [
        { text: '  Initializing DataForge agent...',             type: 'info' },
        { text: '  Deploying ▸ us-east-1 ▸ us-west-2 ▸ eu-west-1', type: 'info' },
        { text: '✔ Agent active · 1.2M records/sec',             type: 'ok'   },
      ],
    },
    {
      cmd: 'ordis insights --generate --auto-pr',
      lines: [
        { text: '  Analyzing patterns across 3 regions...',      type: 'info' },
        { text: '✔ PR #247 opened → github.com/ordis/infra',     type: 'ok'   },
        { text: '✔ 2 patches applied · $4,200/mo saved',         type: 'ok'   },
      ],
    },
  ];

  const CHAR_MS   = 40;
  const CHAR_JIT  = 18;
  const LINE_GAP  = 520;
  const STEP_HOLD = 1500;
  const CMD_PAUSE = 260;
  const LOOP_WAIT = 2000;

  let timers = [];
  const sched = (fn, ms) => { const id = setTimeout(fn, ms); timers.push(id); };
  const cancelAll = () => { timers.forEach(clearTimeout); timers = []; };

  function activateStep(idx) {
    steps.forEach((s, i) => {
      s.classList.remove('active');
      if (i < idx) {
        s.classList.add('completed');
        const n = s.querySelector('.strix-step-number');
        if (n) n.textContent = '✓';
      }
    });
    const s = steps[idx];
    if (!s) return;
    s.classList.remove('completed');
    s.classList.add('active');
    const n = s.querySelector('.strix-step-number');
    if (n) n.textContent = idx + 1;
  }

  function resetSteps() {
    steps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      const n = s.querySelector('.strix-step-number');
      if (n) n.textContent = i + 1;
    });
  }

  function typeCmd(text, startMs) {
    const p = document.createElement('p');
    p.className = 'agent-term-line';
    const prompt = document.createElement('span');
    prompt.className = 'strix-prompt';
    prompt.textContent = '$ ';
    p.appendChild(prompt);
    const cursor = document.createElement('span');
    cursor.className = 'demo-cursor';
    p.appendChild(cursor);

    sched(() => termBody.appendChild(p), startMs);

    let t = startMs;
    for (let i = 0; i < text.length; i++) {
      t += CHAR_MS + Math.floor(Math.random() * CHAR_JIT);
      const ch = text[i];
      const last = i === text.length - 1;
      ((fireAt, c, isLast) => {
        sched(() => {
          cursor.insertAdjacentText('beforebegin', c);
          if (isLast) cursor.remove();
        }, fireAt);
      })(t, ch, last);
    }
    return t;
  }

  function run() {
    cancelAll();
    termBody.innerHTML = '';
    resetSteps();

    let t = 0;

    SCRIPT.forEach((step, si) => {
      sched(() => activateStep(si), t);
      t += CMD_PAUSE;
      t = typeCmd(step.cmd, t);
      step.lines.forEach(line => {
        t += LINE_GAP;
        ((fireAt, l) => {
          sched(() => {
            const p = document.createElement('p');
            p.className = 'agent-term-line agent-term-' + l.type;
            p.textContent = l.text;
            termBody.appendChild(p);
          }, fireAt);
        })(t, line);
      });
      t += STEP_HOLD;
    });

    // mark all completed then restart
    sched(() => {
      steps.forEach(s => {
        s.classList.remove('active');
        s.classList.add('completed');
        const n = s.querySelector('.strix-step-number');
        if (n) n.textContent = '✓';
      });
    }, t);
    sched(run, t + LOOP_WAIT);
  }

  const section = document.querySelector('.strix-how-it-works');
  if ('IntersectionObserver' in window && section) {
    let live = false;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting && !live) {
          live = true;
          run();
        } else if (!e.isIntersecting && live) {
          live = false;
          cancelAll();
          termBody.innerHTML = '';
          resetSteps();
        }
      });
    }, { threshold: 0.25 });
    obs.observe(section);
  } else {
    run();
  }
}

function setupHeroDemo() {
  const QUERIES = {
    finance: { q: "Summarise Q3 earnings and flag cost risks",    model: "GPT-5.5",        tag: "complex reasoning",  save: "74%", lat: "0.9s" },
    code:    { q: "Refactor this function for async execution",   model: "Opus 4.7",        tag: "code generation",    save: "61%", lat: "1.1s" },
    fast:    { q: "Translate 'Good morning' to Japanese",         model: "Haiku 4.5",       tag: "simple task",        save: "89%", lat: "0.2s" },
    vision:  { q: "Describe the chart in this PDF report",        model: "Gemini 3.1 Pro",  tag: "multimodal vision",  save: "55%", lat: "1.4s" },
  };

  const pills      = document.querySelectorAll('.demo-pill');
  const queryEl    = document.getElementById('demo-query-text');
  const systemRow  = document.getElementById('demo-system-row');
  const tagEl      = document.getElementById('demo-tag');
  const modelEl    = document.getElementById('demo-model');
  const footerEl   = document.getElementById('demo-footer');
  const latEl      = document.getElementById('demo-lat');
  const saveEl     = document.getElementById('demo-save');
  const progressEl = document.getElementById('demo-progress-fill');

  if (!queryEl) return;

  const KEYS    = Object.keys(QUERIES);
  const AUTO_MS = 5200;
  let idx       = 0;
  let typeTimer = null;
  let autoTimer = null;

  function reset() {
    clearTimeout(typeTimer);
    clearTimeout(autoTimer);
    queryEl.textContent = '';
    systemRow.classList.remove('visible');
    footerEl.classList.remove('visible');
    progressEl.style.transition = 'none';
    progressEl.style.width = '0%';
  }

  function run(key) {
    const d = QUERIES[key];
    reset();

    const cursor = document.createElement('span');
    cursor.className = 'demo-cursor';
    queryEl.appendChild(cursor);

    let i = 0;
    function tick() {
      if (i < d.q.length) {
        cursor.insertAdjacentText('beforebegin', d.q[i++]);
        typeTimer = setTimeout(tick, 24 + Math.random() * 20);
      } else {
        cursor.remove();
        typeTimer = setTimeout(() => {
          tagEl.textContent   = d.tag;
          modelEl.textContent = d.model;
          systemRow.classList.add('visible');
          typeTimer = setTimeout(() => {
            latEl.textContent  = d.lat;
            saveEl.textContent = d.save;
            footerEl.classList.add('visible');
            // start progress bar then auto-advance
            progressEl.getBoundingClientRect(); // force reflow
            progressEl.style.transition = `width ${AUTO_MS}ms linear`;
            progressEl.style.width = '100%';
            autoTimer = setTimeout(() => {
              idx = (idx + 1) % KEYS.length;
              activate(KEYS[idx]);
              run(KEYS[idx]);
            }, AUTO_MS);
          }, 260);
        }, 360);
      }
    }
    tick();
  }

  function activate(key) {
    pills.forEach(p => p.classList.toggle('active', p.dataset.key === key));
  }

  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      idx = KEYS.indexOf(pill.dataset.key);
      activate(pill.dataset.key);
      run(pill.dataset.key);
    });
  });

  run(KEYS[0]);
}

const init = () => {
  console.log('[Ordis AI] Strix-Clone UI Initialized with WT Bobine typography.');
  
  // Initialize imported Ordis components
  setupMcpPulse();
  
  // Offload intersection observer setup to idle callback so it doesn't block main thread
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => setupCounters());
  } else {
    setTimeout(setupCounters, 1);
  }
  
  setupMktFilters();
  setupFeatureShowcase();

  setupAgentDeploy();
  setupHeroDemo();
};

// Wait for DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
