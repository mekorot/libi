/* ─────────────────────────────────────────────
   Configuration
───────────────────────────────────────────── */
const FLOW_URL = 'flow.json';   // ← change this path if the JSON is hosted elsewhere

/* ─────────────────────────────────────────────
   Utilities
───────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function esc(t) {
    return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function renderText(raw) {
    return raw
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/<code>(.+?)<\/code>/g, '<code>$1</code>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/\*(.+?)\*/g, '<em>$1</em>')
        .split('\n\n').map(p => {
            if (p.startsWith('---')) return '<hr class="divider">';
            if (p.match(/^\d+\. /)) {
                const items = p.split('\n').filter(Boolean);
                return '<ol style="padding-right:18px;margin:6px 0">' +
                    items.map(i => '<li style="margin-bottom:5px">' + i.replace(/^\d+\. /, '') + '</li>').join('') +
                    '</ol>';
            }
            return '<p>' + p + '</p>';
        }).join('');
}

/* ─────────────────────────────────────────────
   DOM helpers
───────────────────────────────────────────── */
function appendRow(html) {
    const msgs = document.getElementById('messages');
    const wrap = document.createElement('div');
    wrap.innerHTML = html;
    const row = wrap.firstElementChild;
    msgs.appendChild(row);
    requestAnimationFrame(() => requestAnimationFrame(() => row.classList.add('visible')));
    msgs.scrollTop = msgs.scrollHeight;
    return row;
}

function removeTyping() {
    const t = document.getElementById('typingRow');
    if (t) t.remove();
}

async function showTyping() {
    removeTyping();
    appendRow(`<div class="message-row" id="typingRow">
    <div class="msg-avatar agent">
      <svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2C8 7 4 9.5 4 14a8 8 0 0 0 16 0c0-4.5-4-7-8-12z"/>
      </svg>
    </div>
    <div class="msg-body">
      <div class="msg-name">ליבי</div>
      <div class="typing-indicator">
        <div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>
      </div>
    </div>
  </div>`);
}

/* ─────────────────────────────────────────────
   Loading / Error states
───────────────────────────────────────────── */
function showLoadingState() {
    const msgs = document.getElementById('messages');
    msgs.innerHTML = `<div class="flow-loading" id="flowLoading">
      <div class="flow-loading-spinner"></div>
      <span>טוען את תרחיש השיחה…</span>
    </div>`;
}

function showErrorState(err) {
    const msgs = document.getElementById('messages');
    msgs.innerHTML = `<div class="flow-error" id="flowError">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>שגיאה בטעינת תרחיש השיחה</p>
      <code>${esc(String(err))}</code>
      <button class="restart-btn" onclick="runFlow()">נסה שוב</button>
    </div>`;
}

/* ─────────────────────────────────────────────
   Icon library
───────────────────────────────────────────── */
function iconSvg(name) {
    const icons = {
        upload:       '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
        'file-text':  '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
        database:     '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
        activity:     '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
        list:         '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
        terminal:     '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
        search:       '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        'git-compare':'<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
        'edit-3':     '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'
    };
    const d = icons[name] || icons.list;
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

/* ─────────────────────────────────────────────
   Tool block animation
───────────────────────────────────────────── */
async function runToolBlock(toolEl, tool) {
    const statusEl = toolEl.querySelector('.tool-status');
    const barEl    = toolEl.querySelector('.progress-bar');
    const durEl    = toolEl.querySelector('.tool-dur');

    statusEl.textContent = 'מעבד...';
    statusEl.className   = 'tool-status running';

    if (barEl) {
        barEl.style.transition = `width ${tool.ms}ms linear`;
        requestAnimationFrame(() => { barEl.style.width = '100%'; });
    }

    await sleep(tool.ms);

    statusEl.textContent = 'הושלם';
    statusEl.className   = 'tool-status done';
    if (durEl) durEl.textContent = (tool.ms / 1000).toFixed(1) + 'ש';
}

/* ─────────────────────────────────────────────
   Message renderers
───────────────────────────────────────────── */
async function playAgentMessage(msg) {
    await showTyping();
    await sleep(msg.delay || 300);
    removeTyping();

    let toolsHtml = '';
    if (msg.tools && msg.tools.length) {
        toolsHtml = '<div class="tool-blocks">';
        for (const t of msg.tools) {
            toolsHtml += `
        <div class="tool-block" id="tb_${t.id}">
          <div class="tb-icon">${iconSvg(t.icon)}</div>
          <div class="tb-content">
            <div class="tb-top">
              <span class="tool-label">${esc(t.label)}</span>
              <span class="tool-status pending">ממתין</span>
            </div>
            <div class="tool-desc">${esc(t.desc)}</div>
            <div class="progress-bar-wrap"><div class="progress-bar" id="pb_${t.id}"></div></div>
          </div>
          <span class="tool-dur" id="dur_${t.id}"></span>
        </div>`;
        }
        toolsHtml += '</div>';
    }

    const bid = 'bubble_' + Date.now();
    appendRow(`<div class="message-row">
    <div class="msg-avatar agent">${iconSvg('activity').replace('stroke="currentColor"', 'stroke="#fff"')}</div>
    <div class="msg-body">
      <div class="msg-name">ליבי <span style="font-weight:400;color:var(--text-tertiary)">· AI</span></div>
      <div class="msg-bubble">
        ${toolsHtml}
        <div id="${bid}" style="opacity:0"></div>
      </div>
    </div>
  </div>`);

    if (msg.tools) {
        for (const t of msg.tools) {
            const el = document.getElementById('tb_' + t.id);
            await runToolBlock(el, t);
            await sleep(70);
        }
        await sleep(200);
    }

    const textEl = document.getElementById(bid);
    textEl.style.transition = 'opacity 0.35s';
    textEl.innerHTML = renderText(msg.text);
    requestAnimationFrame(() => requestAnimationFrame(() => textEl.style.opacity = '1'));
    document.getElementById('messages').scrollTop = 99999;
}

async function playUserMessage(msg) {
    let attachHtml = '';
    if (msg.attachment) {
        attachHtml = `<div class="file-pill">${iconSvg('file-text')} ${esc(msg.attachment)}</div>`;
    }
    appendRow(`<div class="message-row user">
    <div class="msg-avatar user-av">רד</div>
    <div class="msg-body" style="display:flex;flex-direction:column;align-items:flex-start">
      <div class="msg-name" style="justify-content:flex-start">עודד קלר</div>
      ${attachHtml}
      <div class="msg-bubble">${esc(msg.text)}</div>
    </div>
  </div>`);
    await sleep(300);
}

/* ─────────────────────────────────────────────
   Flow runner  — fetches flow.json each time
───────────────────────────────────────────── */
let running = false;

async function runFlow() {
    if (running) return;
    running = true;

    const msgs = document.getElementById('messages');
    msgs.innerHTML = '';
    showLoadingState();

    let flow;
    try {
        const res = await fetch(FLOW_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
        flow = await res.json();
    } catch (err) {
        showErrorState(err);
        running = false;
        return;
    }

    msgs.innerHTML = '';   // clear the loading indicator

    for (const step of flow) {
        if (step.type === 'user') await playUserMessage(step);
        else                      await playAgentMessage(step);
        await sleep(500);
    }

    // Restart button
    const wrap = document.createElement('div');
    wrap.style.textAlign = 'center';
    wrap.style.padding   = '20px 0 8px';
    wrap.innerHTML = `<button class="restart-btn" onclick="runFlow()">
    ${iconSvg('activity')} הפעל מחדש את השיחה
  </button>`;
    msgs.appendChild(wrap);
    msgs.scrollTop = 99999;

    running = false;
}

/* ─────────────────────────────────────────────
   Live input (non-scripted)
───────────────────────────────────────────── */
function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

function sendMessage() {
    const inp = document.getElementById('chatInput');
    const val = inp.value.trim();
    if (!val) return;
    playUserMessage({ text: val });
    inp.value = '';
    setTimeout(() => { showTyping(); setTimeout(removeTyping, 2200); }, 400);
}

/* ─────────────────────────────────────────────
   Boot
───────────────────────────────────────────── */
runFlow();
