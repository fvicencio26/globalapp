/* GlobalApp — app.js
   Lógica cliente para enviar consultas al webhook central, renderizar resultados y manejar estados.
   Coloca este archivo en: agents/app.js
*/

(() => {
  'use strict';

  // Config (puede ser sobrescrito antes de carga)
  const CONFIG = window.__GLOBALAPP_CONFIG__ || { WEBHOOK_URL: 'http://localhost:5681/webhook/...' };

  // Elementos
  const queryInput = document.getElementById('query-input');
  const submitBtn = document.getElementById('submit-btn');
  const resultsEl = document.getElementById('results');
  const statusEl = document.getElementById('status');
  const clearBtn = document.getElementById('clear-btn');
  const webhookDisplay = document.getElementById('webhook-url-display');

  // Mostrar webhook actual
  webhookDisplay.textContent = CONFIG.WEBHOOK_URL;

  // Estado UI helpers
  function setLoading(loading, message = 'Pensando...') {
    if (loading) {
      submitBtn.disabled = true;
      statusEl.innerHTML = `<span class="spinner" aria-hidden="true"></span> ${message}`;
    } else {
      submitBtn.disabled = false;
      statusEl.textContent = 'Listo';
    }
  }

  function clearResults() {
    resultsEl.innerHTML = `<div class="empty">Aquí aparecerán los resultados de GlobalApp. Ejecuta una consulta para ver texto enriquecido, tarjetas de datos y marcadores para mapas o gráficos.</div>`;
  }

  // Render helpers
  function renderTextBlock(text) {
    const p = document.createElement('div');
    p.className = 'card';
    p.innerHTML = `<div class="card-title">Respuesta</div><div>${escapeHtml(text).replace(/\n/g,'<br/>')}</div>`;
    return p;
  }

  function renderCard(card) {
    const c = document.createElement('div');
    c.className = 'card';
    const title = card.title || 'Detalle';
    const body = card.body || '';
    c.innerHTML = `<div class="card-title">${escapeHtml(title)}</div><div>${escapeHtml(body)}</div>`;
    if (card.kv && Array.isArray(card.kv)) {
      const list = document.createElement('div');
      list.style.marginTop = '8px';
      card.kv.forEach(({k,v})=>{
        const row = document.createElement('div');
        row.className = 'kv';
        row.innerHTML = `<div class="k">${escapeHtml(k)}</div><div class="v">${escapeHtml(v)}</div>`;
        list.appendChild(row);
      });
      c.appendChild(list);
    }
    return c;
  }

  function renderPlaceholderMap(meta) {
    const ph = document.createElement('div');
    ph.className = 'placeholder card';
    ph.innerHTML = `<div><strong>Mapa / Gráfico</strong><div style="margin-top:8px;color:var(--muted);font-size:13px">Datos recibidos: ${escapeHtml(JSON.stringify(meta || {}).slice(0,200))}...</div></div>`;
    // Nota: aquí podrías inicializar Leaflet/Mapbox/D3 si lo deseas, usando los meta para renderizar.
    return ph;
  }

  // Escapa HTML básico
  function escapeHtml(str){
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#39;');
  }

  // Mapea la respuesta flexible del motor a UI
  function renderResponse(payload){
    // payload puede ser flexible. Maneja varios formatos comunes:
    // - { text: "..." }
    // - { html: "<p>...</p>" }
    // - { cards: [{title, body, kv: [{k,v}]}], mapData: {...} }
    // - { blocks: [{type:'text'|'card'|'map', ...}], raw: {...} }

    resultsEl.innerHTML = ''; // limpiar

    if (!payload) {
      resultsEl.appendChild(renderTextBlock('Respuesta vacía'));
      return;
    }

    // If server returned pre-rendered HTML
    if (payload.html) {
      const wrapper = document.createElement('div');
      wrapper.className = 'card';
      wrapper.innerHTML = `<div class="card-title">Respuesta</div><div>${payload.html}</div>`;
      resultsEl.appendChild(wrapper);
      return;
    }

    if (payload.blocks && Array.isArray(payload.blocks)) {
      payload.blocks.forEach(block => {
        if (block.type === 'text') resultsEl.appendChild(renderTextBlock(block.text || block.content || ''));
        else if (block.type === 'card') resultsEl.appendChild(renderCard(block));
        else if (block.type === 'map') resultsEl.appendChild(renderPlaceholderMap(block.meta));
        else resultsEl.appendChild(renderTextBlock(JSON.stringify(block)));
      });
      return;
    }

    if (Array.isArray(payload.cards)) {
      payload.cards.forEach(c => resultsEl.appendChild(renderCard(c)));
      if (payload.mapData) resultsEl.appendChild(renderPlaceholderMap(payload.mapData));
      return;
    }

    if (payload.text) {
      resultsEl.appendChild(renderTextBlock(payload.text));
      return;
    }

    // fallback: show entire JSON
    const pre = document.createElement('pre');
    pre.className = 'card';
    pre.style.whiteSpace='pre-wrap';
    pre.textContent = JSON.stringify(payload, null, 2);
    resultsEl.appendChild(pre);
  }

  // Enviar la consulta al webhook central
  async function sendQuery(queryText){
    const url = CONFIG.WEBHOOK_URL;
    if (!url) throw new Error('Webhook URL no configurada');

    const body = {
      query: queryText,
      // metadatos útiles — el backend puede usarlos para enrutar a agentes
      meta: {
        source: 'globalapp.client',
        timestamp: (new Date()).toISOString(),
        userAgent: navigator.userAgent
      }
    };

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body: JSON.stringify(body),
      // Note: si tu webhook requiere autenticación añade aquí Authorization
    });

    if (!resp.ok){
      const text = await resp.text().catch(()=>null);
      const err = new Error(`Error desde el servidor: ${resp.status} ${resp.statusText}`);
      err.details = text;
      throw err;
    }

    // Se espera JSON. Si el backend devuelve texto o HTML, intenta parsear.
    const contentType = resp.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      return await resp.json();
    } else {
      const txt = await resp.text();
      // envuelve en structure predictable
      return { html: txt };
    }
  }

  // Handler principal
  async function handleSubmit(ev){
    ev && ev.preventDefault();
    const q = queryInput.value && queryInput.value.trim();
    if (!q) {
      queryInput.focus();
      return;
    }

    setLoading(true, 'Enviando consulta…');
    try {
      setLoading(true, 'Procesando…');
      const payload = await sendQuery(q);
      setLoading(false);
      renderResponse(payload);
    } catch (err) {
      console.error('[GlobalApp] request error', err);
      setLoading(false);
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `<div class="card-title">Error</div><div style="color:var(--danger);margin-top:8px">${escapeHtml(String(err.message || 'Error desconocido'))}</div>
                        <details style="margin-top:8px;color:var(--muted)"><summary>Detalles</summary><pre style="white-space:pre-wrap">${escapeHtml(err.details || '')}</pre></details>`;
      resultsEl.innerHTML = '';
      resultsEl.appendChild(card);
    }
  }

  // Event bindings
  submitBtn.addEventListener('click', handleSubmit);
  queryInput.addEventListener('keydown', (e)=>{
    // Ctrl+Enter / Cmd+Enter para enviar
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  });
  clearBtn.addEventListener('click', ()=>{
    queryInput.value = '';
    clearResults();
  });

  // Inicialización
  clearResults();
  setLoading(false);

  // Exponer para debugging (opcional)
  window.GlobalAppClient = {
    sendQuery, renderResponse, setConfig: (cfg)=>Object.assign(CONFIG, cfg)
  };

  // Accessibility: focus inicial
  queryInput.focus();

})();
