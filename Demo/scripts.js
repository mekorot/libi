/* ─────────────────────────────────────────────────────────────
   MEKOROT · LIBI — deterministic flow runner
   - Waits for the user at every flow step where type === "user"
   - Does NOT display/reveal the expected user phrase
   - Displays the interactive report card at the end
   ───────────────────────────────────────────────────────────── */

const FLOW_URL = 'flow.json';

/* ─────────────────────────────────────────────────────────────
   Utilities
   ───────────────────────────────────────────────────────────── */
function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

function esc(t) {
    return String(t ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function normalizePhrase(s) {
    return String(s ?? '').replace(/\s+/g, ' ').trim();
}

/* Kept for compatibility with older code; not required for current flow. */
async function typeText(el, text, speed = 55) {
    el.textContent = '';
    for (const char of String(text ?? '')) {
        el.textContent += char;
        await sleep(speed);
    }
}

/* ─────────────────────────────────────────────────────────────
   Document download
   ───────────────────────────────────────────────────────────── */
function downloadDoc(fname, src) {
    fetch(src)
        .then(r => {
            if (!r.ok) throw new Error(r.status);
            return r.blob();
        })
        .then(blob => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = fname;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 10000);
        })
        .catch(() => {
            try {
                const a = document.createElement('a');
                a.href = src;
                a.download = fname;
                a.target = '_blank';
                a.rel = 'noopener';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } catch (_) {
                showDocToast(`הקובץ "${fname}" אינו זמין כרגע. ודא שהקובץ נמצא בתיקיית הפרויקט.`);
            }
        });
    return false;
}

function showDocToast(msg) {
    const t = document.createElement('div');
    t.textContent = msg;
    Object.assign(t.style, {
        position: 'fixed', bottom: '24px', right: '24px', left: '24px',
        maxWidth: '480px', margin: '0 auto', background: '#1e3a5f', color: '#fff',
        padding: '12px 18px', borderRadius: '10px', fontSize: '13px', lineHeight: '1.5',
        boxShadow: '0 4px 18px rgba(0,0,0,0.25)', zIndex: '9999', textAlign: 'right',
        animation: 'fadeInUp .25s ease'
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 5000);
}

/* ─────────────────────────────────────────────────────────────
   Markdown-lite renderer
   ───────────────────────────────────────────────────────────── */
function renderText(raw) {
    const docIcon = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>';

    const DOCX_FILE_MAP = {
        'InterimReport.docx': 'InterimReport.docx',
        'SummeryReport.docx': 'SummeryReport.docx',
        'summeryReport.docx': 'SummeryReport.docx'
    };

    let html = esc(raw)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/`(.+?)`/g, '<code>$1</code>')
        .replace(/([\w._-]+\.docx)/g, (_, fname) => {
            const src = DOCX_FILE_MAP[fname] || fname;
            return `<a href="#" class="doc-link" onclick="return downloadDoc('${fname}','${src}')">${docIcon} ${fname}</a>`;
        });

    return html.split('\n\n').map(p => {
        if (p.trim().startsWith('---')) return '<hr class="divider">';
        return '<p>' + p.replace(/\n/g, '<br>') + '</p>';
    }).join('');
}

/* ─────────────────────────────────────────────────────────────
   DOM helpers
   ───────────────────────────────────────────────────────────── */
function appendRow(html) {
    const msgs = document.getElementById('messages');
    const wrap = document.createElement('div');
    wrap.innerHTML = html.trim();
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
    appendRow(`
    <div class="message-row" id="typingRow">
      <div class="msg-avatar agent">${iconSvg('activity').replace('stroke="currentColor"', 'stroke="#fff"')}</div>
      <div class="msg-body">
        <div class="msg-name">ליבי</div>
        <div class="typing-indicator">
          <span class="typing-dot"></span><span class="typing-dot"></span><span class="typing-dot"></span>
        </div>
      </div>
    </div>
  `);
}

function showLoadingState() {
    document.getElementById('messages').innerHTML = `
    <div class="flow-loading" id="flowLoading">
      <div class="flow-loading-spinner"></div>
      <span>טוען את תרחיש השיחה…</span>
    </div>`;
}

function showErrorState(err) {
    document.getElementById('messages').innerHTML = `
    <div class="flow-error" id="flowError">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="32" height="32">
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
    wrap.innerHTML = `<button class="restart-btn" onclick="runFlow()">${iconSvg('activity')} הפעל מחדש את השיחה</button>`;
    msgs.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
}

/* Generic wait message only. The required phrase is intentionally hidden. */
async function showNudge() {
    await showTyping();
    await sleep(700);
    removeTyping();

    appendRow(`
    <div class="message-row">
      <div class="msg-avatar agent">${iconSvg('activity').replace('stroke="currentColor"', 'stroke="#fff"')}</div>
      <div class="msg-body">
        <div class="msg-name">ליבי <span style="font-weight:400;color:var(--text-tertiary)">· AI</span></div>
        <div class="msg-bubble"><p>ממתינה לאישורך להמשך…</p></div>
      </div>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────────
   Icons
   ───────────────────────────────────────────────────────────── */
function iconSvg(name) {
    const icons = {
        upload: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
        'file-text': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
        database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
        activity: '<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
        list: '<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
        terminal: '<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>',
        search: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>',
        'git-compare': '<circle cx="18" cy="18" r="3"/><circle cx="6" cy="6" r="3"/><path d="M13 6h3a2 2 0 0 1 2 2v7"/><path d="M11 18H8a2 2 0 0 1-2-2V9"/>',
        'edit-3': '<path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.list}</svg>`;
}

/* ─────────────────────────────────────────────────────────────
   Tool animation
   ───────────────────────────────────────────────────────────── */
async function runToolBlock(toolEl, tool) {
    if (!toolEl) return;
    const statusEl = toolEl.querySelector('.tool-status');
    const barEl = toolEl.querySelector('.progress-bar');
    const durEl = toolEl.querySelector('.tool-dur');

    statusEl.textContent = 'מעבד...';
    statusEl.className = 'tool-status running';

    if (barEl) {
        barEl.style.transition = `width ${tool.ms || 800}ms linear`;
        requestAnimationFrame(() => { barEl.style.width = '100%'; });
    }

    await sleep(tool.ms || 800);
    statusEl.textContent = 'הושלם';
    statusEl.className = 'tool-status done';
    if (durEl) durEl.textContent = ((tool.ms || 800) / 1000).toFixed(1) + 'ש';
}

/* ─────────────────────────────────────────────────────────────
   Message renderers
   ───────────────────────────────────────────────────────────── */
async function playAgentMessage(msg) {
    await showTyping();
    await sleep(msg.delay || 300);
    removeTyping();

    const uid = 'm_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
    let toolsHtml = '';

    if (Array.isArray(msg.tools) && msg.tools.length) {
        toolsHtml = '<div class="tool-blocks">' + msg.tools.map((t, i) => `
      <div class="tool-block" id="${uid}_tool_${i}">
        <div class="tb-icon">${iconSvg(t.icon)}</div>
        <div class="tb-content">
          <div class="tb-top">
            <span class="tool-label">${esc(t.label)}</span>
            <span class="tool-status pending">ממתין</span>
          </div>
          <div class="tool-desc">${esc(t.desc)}</div>
          <div class="progress-bar-wrap"><div class="progress-bar"></div></div>
        </div>
        <span class="tool-dur"></span>
      </div>`).join('') + '</div>';
    }

    appendRow(`
    <div class="message-row">
      <div class="msg-avatar agent">${iconSvg('activity').replace('stroke="currentColor"', 'stroke="#fff"')}</div>
      <div class="msg-body">
        <div class="msg-name">ליבי <span style="font-weight:400;color:var(--text-tertiary)">· AI</span></div>
        <div class="msg-bubble">
          ${toolsHtml}
          <div id="${uid}_text" style="opacity:0"></div>
        </div>
      </div>
    </div>
  `);

    if (Array.isArray(msg.tools)) {
        for (let i = 0; i < msg.tools.length; i++) {
            await runToolBlock(document.getElementById(`${uid}_tool_${i}`), msg.tools[i]);
            await sleep(80);
        }
    }

    const textEl = document.getElementById(`${uid}_text`);
    let html = renderText(msg.text || '');

    if (msg.reportLink) {
        html += `<div style="margin-top:14px;padding-top:12px;border-top:1px solid rgba(0,0,0,0.08)">
      <a href="${esc(msg.reportLink.url)}" target="_blank" rel="noopener" class="doc-link">${iconSvg('file-text')} ${esc(msg.reportLink.caption || 'פתח דוח אינטראקטיבי')}</a>
    </div>`;
    }

    textEl.innerHTML = html;
    textEl.style.transition = 'opacity .25s ease';
    requestAnimationFrame(() => { textEl.style.opacity = '1'; });
    document.getElementById('messages').scrollTop = document.getElementById('messages').scrollHeight;
}

async function playUserMessage(msg) {
    const attachHtml = msg.attachment ? `<div class="file-pill">${iconSvg('file-text')} ${esc(msg.attachment)}</div>` : '';
    appendRow(`
    <div class="message-row user">
      <div class="msg-avatar user-av">ימ</div>
      <div class="msg-body" style="display:flex;flex-direction:column;align-items:flex-start">
        <div class="msg-name" style="justify-content:flex-start">יפעת מלכא</div>
        ${attachHtml}
        <div class="msg-bubble">${esc(msg.text)}</div>
      </div>
    </div>
  `);
    await sleep(250);
}

function showInteractiveReportCard(link) {
    appendRow(`
    <div class="message-row" style="justify-content:center;padding-top:8px">
      <div style="flex:1;max-width:680px;background:linear-gradient(135deg,#1E5ECC 0%,#0D1F4E 100%);color:#fff;border-radius:18px;padding:22px 24px;box-shadow:0 8px 24px rgba(13,31,78,.25);text-align:right;direction:rtl">
        <div style="font-size:17px;font-weight:700;margin-bottom:6px">📊 דוח ביקורת אינטראקטיבי</div>
        <div style="font-size:13px;opacity:.86;margin-bottom:16px">${esc(link.caption || 'לצפייה בדוח האינטראקטיבי')}</div>
        <a href="${esc(link.url)}" target="_blank" rel="noopener" style="display:inline-flex;align-items:center;gap:8px;background:#fff;color:#1E5ECC;font-weight:700;padding:10px 18px;border-radius:10px;text-decoration:none;font-size:14px">
          פתח דוח אינטראקטיבי
        </a>
      </div>
    </div>
  `);
}

/* ─────────────────────────────────────────────────────────────
   Flow state
   ───────────────────────────────────────────────────────────── */
let running = false;
let flowStarted = false;
let waitingForUser = false;
let remainingSteps = [];
let expectedPhrase = '';
let allSteps = [];
let finalReportShown = false;

async function loadFlowIfNeeded() {
    if (allSteps.length) return allSteps;

    const res = await fetch(FLOW_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status} – ${res.statusText}`);
    const flow = await res.json();
    allSteps = flow.steps || [];

    const titleEl = document.getElementById('topBarTitle');
    const subEl = document.getElementById('topBarSub');
    const navLabel = document.getElementById('navActiveLabel');
    if (titleEl) titleEl.textContent = flow.title || 'ביקורת חדשה';
    if (subEl) subEl.textContent = 'סוכן מקורות · פעיל';
    if (navLabel) navLabel.textContent = flow.title || 'ביקורת חדשה';

    return allSteps;
}

async function playSteps(steps) {
    running = true;

    for (let i = 0; i < steps.length; i++) {
        const step = steps[i];

        if (step.type === 'user') {
            waitingForUser = true;
            expectedPhrase = step.text;
            remainingSteps = steps.slice(i + 1);
            running = false;
            await showNudge();
            return;
        }

        await playAgentMessage(step);
        await sleep(350);
    }

    const lastReportStep = [...steps].reverse().find(s => s && s.reportLink);
    if (lastReportStep && !finalReportShown) {
        finalReportShown = true;
        await sleep(350);
        showInteractiveReportCard(lastReportStep.reportLink);
    }

    showRestartButton();
    running = false;
}

async function runFlow() {
    if (running) return;

    running = false;
    flowStarted = false;
    waitingForUser = false;
    remainingSteps = [];
    expectedPhrase = '';
    allSteps = [];
    finalReportShown = false;

    showLoadingState();
    try {
        await loadFlowIfNeeded();
        showIdleState();
    } catch (err) {
        showErrorState(err);
    }
}

function showIdleState() {
    document.getElementById('messages').innerHTML = `
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;min-height:320px;gap:20px;padding:48px 24px;text-align:center">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" width="44" height="44" style="color:var(--mekorot-blue);opacity:.35">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p style="font-size:15px;font-weight:500;color:var(--text-secondary)">ליבי מוכנה לסייע לך בביצוע ביקורת הפנים</p>
      <p style="font-size:12px;color:var(--text-tertiary)">שלחי הודעה לליבי</p>
    </div>`;
}

function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

async function sendMessage() {
    const inp = document.getElementById('chatInput');
    const val = inp.value.trim();
    if (!val) return;
    inp.value = '';

    let steps;
    try {
        steps = await loadFlowIfNeeded();
    } catch (err) {
        showErrorState(err);
        return;
    }

    if (!flowStarted) {
        const firstUserIdx = steps.findIndex(s => s.type === 'user');
        const firstUser = steps[firstUserIdx];

        // Clear idle screen before rendering first user bubble.
        document.getElementById('messages').innerHTML = '';
        await playUserMessage({ text: val });

        if (firstUser && normalizePhrase(val) === normalizePhrase(firstUser.text)) {
            flowStarted = true;
            await playSteps(steps.slice(firstUserIdx + 1));
        } else {
            await showNudge();
        }
        return;
    }

    if (waitingForUser) {
        await playUserMessage({ text: val });

        if (normalizePhrase(val) === normalizePhrase(expectedPhrase)) {
            waitingForUser = false;
            const next = remainingSteps;
            remainingSteps = [];
            expectedPhrase = '';
            await playSteps(next);
        } else {
            await showNudge();
        }
        return;
    }

    await playUserMessage({ text: val });
}

/* Boot — show idle state only, do not auto-start. */
showIdleState();
