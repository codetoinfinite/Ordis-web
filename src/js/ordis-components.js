export function setupMcpPulse() {
  const grid = document.getElementById('mcp-grid');
  if (!grid) return;

  grid.addEventListener('click', e => {
    const tile = e.target.closest('.mcp-tile');
    if (!tile) return;
    tile.classList.toggle('on');
  });

  setInterval(() => {
    const on = [...grid.querySelectorAll('.mcp-tile.on')];
    if (!on.length) return;
    on.forEach(t => t.classList.remove('pulse'));
    const t = on[Math.floor(Math.random() * on.length)];
    t.classList.add('pulse');
    setTimeout(() => t.classList.remove('pulse'), 650);
  }, 950);
}

export function setupCounters() {
  const els = document.querySelectorAll('[data-counter]');
  if (!els.length) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.counter, 10);
      const start = performance.now();
      const duration = 1400;
      const tick = now => {
        const t = Math.min((now - start) / duration, 1);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = Math.round(eased * target);
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => observer.observe(el));
}

export function setupMktFilters() {
  const filters = document.getElementById('mkt-filters');
  const grid = document.getElementById('mkt-grid');
  if (!filters || !grid) return;

  const MODELS = {
    text: [
      { logo: '/logos/openai.svg',        provider: 'OpenAI',    model: 'GPT-5.5',         meta: '1M · $30/M out',   on: true  },
      { logo: '/logos/anthropic.svg',     provider: 'Anthropic', model: 'Opus 4.7',         meta: '200k · $25/M out', on: true  },
      { logo: '/logos/gemini-color.svg',  provider: 'Google',    model: 'Gemini 3.1 Pro',   meta: '1M · $12/M out',   on: true  },
      { logo: '/logos/deepseek-color.svg',provider: 'DeepSeek',  model: 'V4 Pro',           meta: '1M · $3.48/M out', on: true  },
      { logo: '/logos/mistral-color.svg', provider: 'Mistral',   model: 'Large 3',          meta: '128k · $6/M out',  on: false },
      { logo: '/logos/logo-mark-white.png',        invert: true,          provider: 'Your model',    model: 'Custom fine-tune', meta: 'your data · on-prem', on: true },
    ],
    vision: [
      { logo: '/logos/openai.svg',        provider: 'OpenAI',    model: 'GPT-5.5',         meta: '1M · $30/M out',   on: true  },
      { logo: '/logos/gemini-color.svg',  provider: 'Google',    model: 'Gemini 3.1 Pro',   meta: '1M · $12/M out',   on: true  },
      { logo: '/logos/anthropic.svg',     provider: 'Anthropic', model: 'Opus 4.7',         meta: '200k · $25/M out', on: true  },
      { logo: '/logos/meta-color.svg',    provider: 'Meta',      model: 'Llama 4 Maverick', meta: '1M · OSS',         on: true  },
      { logo: '/logos/kimi-color.svg',    provider: 'Moonshot',  model: 'Kimi K2.6',        meta: '256k · $4/M out',  on: false, invert: true },
      { logo: '/logos/logo-mark-white.png',        invert: true,          provider: 'Your model',    model: 'Custom fine-tune', meta: 'your data · on-prem', on: true },
    ],
    video: [
      { logo: '/logos/runway.svg',        provider: 'Runway',    model: 'Gen-4',            meta: 'video · $0.05/s',  on: true  },
      { logo: '/logos/kling-color.svg',   provider: 'Kling',     model: 'Kling 2.0',        meta: 'video · $0.04/s',  on: true  },
      { logo: '/logos/gemini-color.svg',  provider: 'Google',    model: 'Gemini 3.1 Pro',   meta: '1M · $12/M out',   on: true  },
      { logo: '/logos/openai.svg',        provider: 'OpenAI',    model: 'GPT-5.5',          meta: '1M · $30/M out',   on: true  },
      { logo: '/logos/kimi-color.svg',    provider: 'Moonshot',  model: 'Kimi K2.6',        meta: '256k · $4/M out',  on: false, invert: true },
      { logo: '/logos/logo-mark-white.png',        invert: true,          provider: 'Your model',    model: 'Custom fine-tune', meta: 'your data · on-prem', on: true },
    ],
  };

  const render = tab => {
    grid.innerHTML = MODELS[tab].map(m => `
      <div class="mkt-tile${m.on ? ' mkt-on' : ''}">
        <span class="mkt-provider"><span class="mbadge${m.invert ? ' mbadge-invert' : ''}"><img src="${m.logo}" alt="${m.provider}"/></span>${m.provider}</span>
        <span class="mkt-model">${m.model}</span>
        <span class="mkt-meta">${m.meta}</span>
      </div>`).join('');
  };

  render('text');

  filters.addEventListener('click', e => {
    const btn = e.target.closest('.mkt-filter');
    if (!btn) return;
    filters.querySelector('.mkt-filter-active')?.classList.remove('mkt-filter-active');
    btn.classList.add('mkt-filter-active');
    render(btn.dataset.filter);
  });
}

export function setupFeatureShowcase() {
  const tabs = document.querySelectorAll('.sfs-tab');
  const panels = document.querySelectorAll('.sfs-panel');
  if (!tabs.length || !panels.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => t.classList.remove('active'));
      // Add active to clicked
      tab.classList.add('active');

      // Hide all panels
      panels.forEach(p => p.classList.remove('active'));
      
      // Show target panel
      const targetId = `panel-${tab.dataset.target}`;
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) targetPanel.classList.add('active');
    });
  });
}

