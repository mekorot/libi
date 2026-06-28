/* ─────────────────────────────────────────────────────────────
   MEKOROT · LIBI — flow runner
   Dual-gate version: chat waits for the user at EVERY user step,
   and renders an interactive report card at the end.
   ───────────────────────────────────────────────────────────── */

const FLOW_URL = 'flow.json';

/* ─────────────────────────────────────────────────────────────
   Utilities
   ───────────────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function esc(t) {
  return String(t)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/* Normalize phrases for tolerant matching (whitespace + trailing punctuation) */
function normalizePhrase(s) {
  return String(s || '')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ─────────────────────────────────────────────────────────────
   Document download (used for the .docx file pills)
   ───────────────────────────────────────────────────────────── */
function downloadDoc(fname, src) {
  fetch(src)
    .then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
    .then(blob => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = fname;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    })
    .catch(() => {
      try {
        const a = document.createElement('a');
        a.href = src; a.download = fname; a.target = '_blank'; a.rel = 'noopener';
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
      } catch (_) {
        showDocToast(`הקובץ "${fname}" אינו זמין כרגע.`);
      }
    });
  return false;
}

function showDocToast(msg) {
  const t = document.createElement('div');
  t.textContent = msg;
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px', left: '24px',
    maxWidth: '480px', margin: '0 auto',
    background: '#1e3a5f', color: '#fff',
    padding: '12px 18px', borderRadius: '10px',
    fontSize: '13px', lineHeight: '1.5',
    boxShadow: '0 4px 18px rgba(0,0,0,0.25)',
    zIndex: '9999', textAlign: 'right',
    animation: 'fadeInUp .25s ease'
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

/* ─────────────────────────────────────────────────────────────
   Markdown-lite renderer (bold, line breaks, code, .docx links)
   ───────────────────────────────────────────────────────────── */
function renderText(raw) {
  const docIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" '
    + 'stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">'
    + '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>'
    + '<polyline points="14 2 14 8 20 8"/>'
    + '<line x1="16" y1="13" x2="8" y2="13"/>'
    + '<line x1="16" y1="17" x2="8" y2="17"/>'
    + '</svg>';

  const DOCX_FILE_MAP = {
    'InterimReport.docx': 'InterimReport.docx',
    'SummeryReport.docx': 'SummeryReport.docx',
    'summeryReport.docx': 'SummeryReport.docx'
  };

  let html = String(raw)
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/([\w._-]+\.docx)/g, (_, fname) => {
      const src = DOCX_FILE_MAP[fname] || fname;
      return `<a href="#" class="doc-link" onclick="return downloadDoc('${fname}','${src}')">${docIcon} ${fname}</a>`;
    });

  // Paragraph + line-break handling
  return html.split('\n\n').map(p => {
    if (p.startsWith('---')) return '<hr class="divider">';
    return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
  }).join('');
}

/* ─────────────────────────────────────────────────────────────
   DOM helpers
   ───────────────────────────────────────────────────────────── */
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

function showLoadingState() {
  document.getElementById('messages').innerHTML = `<div class="flow-loading" id="flowLoading">
    <div class="flow-loading-spinner"></div>
    <span>טוען את תרחיש השיחה…</span>
  </div>`;
}

function showErrorState(err) {
  document.getElementById('messages').innerHTML = `<div class="flow-error" id="flowError">
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

function showRestartButton() {
  const msgs = document.getElementById('messages');
  const wrap = document.createElement('div');
  wrap.style.textAlign = 'center';
  wrap.style.padding = '20px 0 8px';
  wrap.innerHTML = `<button class="restart-btn" onclick="runFlow()">
    ${iconSvg('activity')} הפעל מחדש את השיחה
  </button>`;
  msgs.appendChild(wrap);
  msgs.scrollTop = 99999;
}

/* ─────────────────────────────────────────────────────────────
   Libi nudge — shown when wrong / no phrase is typed
   ───────────────────────────────────────────────────────────── */
async function showNudge(requiredPhrase) {
  await showTyping();
  await sleep(700);
  removeTyping();
  appendRow(`<div class="message-row">
    <div class="msg-avatar agent">${iconSvg('activity').replace('stroke="currentColor"', 'stroke="#fff"')}</div>
    <div class="msg-body">
      <div class="msg-name">ליבי <span style="font-weight:400;color:var(--text-tertiary)">· AI</span></div>
      <div class="msg-bubble">
        <p>כדי להמשיך לשלב הבא, יש להקליד את המשפט הבא:</p>
        <p><strong>"${esc(requiredPhrase)}"</strong></p>
      </div>
    </div>
  </div>`);
  document.getElementById('messages').scrollTop = 99999;
}

/* ─────────────────────────────────────────────────────────────
   Interactive report card — final element after flow ends
   ───────────────────────────────────────────────────────────── */
function showInteractiveReportCard(link) {
  const msgs = document.getElementById('messages');
  const wrap = document.createElement('div');
  wrap.className = 'message-row visible';
  wrap.style.cssText = 'justify-content:center;padding:8px 22px 0';
  wrap.innerHTML = `
    <div style="
        flex:1;max-width:680px;
        background:linear-gradient(135deg,#1E5ECC 0%,#0D1F4E 100%);
        color:#fff;border-radius:18px;padding:22px 24px;
        box-shadow:0 8px 24px rgba(13,31,78,0.25);
        text-align:right;direction:rtl">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="
            width:42px;height:42px;border-radius:12px;
            background:rgba(255,255,255,0.15);
            display:flex;align-items:center;justify-content:center">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
               stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 3v18h18"/>
            <path d="M7 14l4-4 4 4 5-5"/>
          </svg>
        </div>
        <div>
          <div style="font-size:16px;font-weight:700">דוח ביקורת אינטראקטיבי</div>
          <div style="font-size:12px;opacity:0.85;margin-top:2px">${esc(link.caption || 'לצפייה בדוח האינטראקטיבי')}</div>
        </div>
      </div>
      <p style="font-size:13px;line-height:1.7;opacity:0.92;margin:10px 0 16px">
        הדוח כולל סיכום ויזואלי של ממצאי הביקורת, גרפים אינטראקטיביים ופירוט של כל הליקויים שאותרו.
      </p>
      <a href="${esc(link.url)}" target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:8px;
                background:#fff;color:#1E5ECC;font-weight:600;
                padding:10px 18px;border-radius:10px;
                text-decoration:none;font-size:14px;
                box-shadow:0 2px 6px rgba(0,0,0,0.15)">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/>
          <line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        פתח דוח אינטראקטיבי
      </a>
    </div>`;
  msgs.appendChild(wrap);
  msgs.scrollTop = 99999;
}

/* ─────────────────────────────────────────────────────────────
   Icon library
   ───────────────────────────────────────────────────────────── */
function iconSvg(name) {
  const icons = {
    upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
    'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>',
    database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
    list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
    terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
    search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
    'git-compare': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
    'edit-3': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'
  };
  const d = icons[name] || icons.list;
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
}

/* ─────────────────────────────────────────────────────────────
   Tool block animation
   ───────────────────────────────────────────────────────────── */
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

/* ─────────────────────────────────────────────────────────────
   Message renderers
   ───────────────────────────────────────────────────────────── */
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

  const bid = 'bubble_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
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
  let html = renderText(msg.text || '');

  if (msg.reportLink) {
    html += `<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.08)">
      <a href="${esc(msg.reportLink.url)}" target="_blank" rel="noopener"
         style="display:inline-flex;align-items:center;gap:7px;
                color:var(--mekorot-blue,#1E5ECC);font-weight:600;font-size:13px;
                text-decoration:none;background:rgba(30,94,204,0.07);
                padding:8px 14px;border-radius:8px;
                border:1px solid rgba(30,94,204,0.18)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
             stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
          <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        ${esc(msg.reportLink.caption)}
      </a>
    </div>`;
  }

  textEl.innerHTML = html;
  requestAnimationFrame(() => requestAnimationFrame(() => textEl.style.opacity = '1'));
  document.getElementById('messages').scrollTop = 99999;
}

async function playUserMessage(msg) {
  let attachHtml = '';
  if (msg.attachment) {
    attachHtml = `<div class="file-pill">${iconSvg('file-text')} ${esc(msg.attachment)}</div>`;
  }
  appendRow(`<div class="message-row user">
    <div class="msg-avatar user-av">ימ</div>
    <div class="msg-body" style="display:flex;flex-direction:column;align-items:flex-start">
      <div class="msg-name" style="justify-content:flex-start">יפעת מלכא</div>
      ${attachHtml}
      <div class="msg-bubble">${esc(msg.text)}</div>
    </div>
  </div>`);
  await sleep(300);
}

/* ─────────────────────────────────────────────────────────────
   Flow state
   ───────────────────────────────────────────────────────────── */
let running        = false;
let flowStarted    = false;
let waitingForUser = false;
let remainingSteps = [];
let expectedPhrase = '';
window._flowSteps  = null;

/* ─────────────────────────────────────────────────────────────
   Step player — shared by runFlow + resume
   ───────────────────────────────────────────────────────────── */
async function playSteps(steps) {
  running = true;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];

    // GATE: pause at every user step
    if (step.type === 'user') {
      expectedPhrase = step.text;
      remainingSteps = steps.slice(i + 1);
      waitingForUser = true;
      running        = false;
      await showNudge(expectedPhrase);
      return;
    }

    await playAgentMessage(step);
    await sleep(400);
  }

  // Flow finished — render interactive report card if last agent step had one
  for (let j = steps.length - 1; j >= 0; j--) {
    if (steps[j].reportLink) {
      await sleep(400);
      showInteractiveReportCard(steps[j].reportLink);
      break;
    }
  }

  showRestartButton();
  running = false;
}

/* ─────────────────────────────────────────────────────────────
   Flow runner — fetches flow.json, sets up the first gate
   ───────────────────────────────────────────────────────────── */
async function runFlow() {
  if (running) return;

  waitingForUser = false;
  remainingSteps = [];
  flowStarted    = false;
  expectedPhrase = '';

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

  window._flowSteps = flow.steps || [];

  // Populate header
  const titleEl = document.getElementById('topBarTitle');
  const subEl   = document.getElementById('topBarSub');
  if (titleEl) titleEl.textContent = flow.title || '';
  if (subEl)   subEl.textContent   = 'סוכן מקורות · פעיל';
  const navLabel = document.getElementById('navActiveLabel');
  if (navLabel) {
    navLabel.textContent = flow.title || '';
    navLabel.classList.add('visible');
  }

  // First user step is the entry gate
  const firstUser = (flow.steps || []).find(s => s.type === 'user');
  if (firstUser) {
    expectedPhrase = firstUser.text;
    waitingForUser = false;     // flow not yet started
    msgs.innerHTML = '';
    showIdleState();
  } else {
    msgs.innerHTML = '';
    await playSteps(flow.steps || []);
  }
}

/* ─────────────────────────────────────────────────────────────
   Idle state — shown before the flow starts
   ───────────────────────────────────────────────────────────── */
function showIdleState() {
  document.getElementById('messages').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;
                height:100%;min-height:320px;gap:20px;padding:48px 24px;text-align:center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
           stroke-linecap="round" stroke-linejoin="round" width="44" height="44"
           style="color:var(--mekorot-blue);opacity:0.35">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p style="font-size:15px;font-weight:500;color:var(--text-secondary)">
        ליבי מוכנה לסייע לך בביצוע ביקורת הפנים
      </p>
      <p style="font-size:12px;color:var(--text-tertiary)">
        שלחי הודעה כדי להתחיל
      </p>
    </div>`;
}

/* ─────────────────────────────────────────────────────────────
   Live input handler
   ───────────────────────────────────────────────────────────── */
function handleKey(e) {
  if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
}

async function sendMessage() {
  const inp = document.getElementById('chatInput');
  const val = inp.value.trim();
  if (!val) return;
  inp.value = '';

  // Lazy-load the flow on the very first send
  if (!window._flowSteps) {
    try {
      const res = await fetch(FLOW_URL);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const flow = await res.json();
      window._flowSteps = flow.steps || [];

      const titleEl = document.getElementById('topBarTitle');
      const subEl   = document.getElementById('topBarSub');
      if (titleEl) titleEl.textContent = flow.title || '';
      if (subEl)   subEl.textContent   = 'סוכן מקורות · פעיל';

      const firstUser = window._flowSteps.find(s => s.type === 'user');
      expectedPhrase = firstUser ? firstUser.text : '';

      const msgs = document.getElementById('messages');
      if (msgs && msgs.querySelector('.flow-loading, .flow-error') === null
          && msgs.children.length && msgs.children[0].textContent
              .includes('ליבי מוכנה')) {
        msgs.innerHTML = '';
      }
    } catch (err) {
      showErrorState(err);
      return;
    }
  }

  const steps = window._flowSteps || [];

  // GATE 1 — flow not yet started
  if (!flowStarted) {
    const firstUserIdx = steps.findIndex(s => s.type === 'user');
    const firstUser    = steps[firstUserIdx];
    if (firstUser && normalizePhrase(val) === normalizePhrase(firstUser.text)) {
      flowStarted = true;
      await playUserMessage({ text: val });
      await playSteps(steps.slice(firstUserIdx + 1));
    } else {
      await playUserMessage({ text: val });
      await showNudge(expectedPhrase || (firstUser && firstUser.text) || '');
    }
    return;
  }

  // GATE 2 — paused mid-flow at a user step
  if (waitingForUser) {
    if (normalizePhrase(val) === normalizePhrase(expectedPhrase)) {
      waitingForUser = false;
      await playUserMessage({ text: val });
      await playSteps(remainingSteps);
    } else {
      await playUserMessage({ text: val });
      await showNudge(expectedPhrase);
    }
    return;
  }

  // Post-flow free-form messages
  await playUserMessage({ text: val });
  await showTyping();
  await sleep(1800);
  removeTyping();
}

/* ─────────────────────────────────────────────────────────────
   Boot
   ───────────────────────────────────────────────────────────── */
showIdleState();
