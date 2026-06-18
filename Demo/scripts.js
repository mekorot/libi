const FLOW = [
    {
        type: "user",
        text: "היי ליבי, אני רוצה להתחיל בבקשה ביקורת בנושא קליטת עובדים חדשים בארגון",
        delay: 100
    },
    {
        type: "agent",
        tools: [
            {
                id: "fetch",
                icon: "database",
                label: "שולפת את נהלי החברה הרלוונטיים ",
                ms: 1100,
                desc: "ווטרנט הפורטל הארגוני"
            },
            {
                id: "parse",
                icon: "file-text",
                label: "מנתחת את נוהל קליטת עובד חדש בחברה",
                ms: 1300,
                desc: "חילוץ טקסט מ-42 עמודים"
            },
            {
                id: "parse",
                icon: "file-text",
                label: "מנתחת את תקן כוח אדם בחברה",
                ms: 1300,
                desc: "חילוץ טקסט מ-30 עמודים"
            },
            {
                id: "parse",
                icon: "file-text",
                label: "מנתחת את נוהל גיוס ואיוש משרות",
                ms: 1300,
                desc: "חילוץ טקסט מ-41 עמודים"
            },
            {
                id: "upload",
                icon: "upload",
                label: "העלאת מסמך",
                ms: 900,
                desc: "דוח_תשתיות_Q3_2024.pdf · 3.1 MB"
            },

            {
                id: "fetch",
                icon: "database",
                label: "שולפת את נוהל גיוס עובדים מהווטרנט",
                ms: 1100,
                desc: "בסיס נתונים תחנות שאיבה ורשתות הולכה"
            },
            {
                id: "analyse",
                icon: "activity",
                label: "ניתוח ממצאי תשתיות",
                ms: 2400,
                desc: "הרצת מודלי סיכון על 142 נקודות ניטור"
            },
            {
                id: "summary",
                icon: "list",
                label: "גיבוש סיכום",
                ms: 700,
                desc: "מבנה ממצאים לפי רמת חומרה"
            }
        ],
        text: "עברתי על דוח ה-Q3 במלואו. הנה מה שמצריך תשומת לב מיידית:\n\n**ירידה בלחץ אספקה** – 14 אזורי חלוקה רשמו ירידת לחץ של מעל 12% מהתקן, בריכוז בצפון הארץ. האזורים: חיפה מזרח, קרית אתא וקרית ביאליק.\n\n**בלאי תחנות שאיבה** – 3 תחנות שאיבה ראשיות (ת׳ 7, ת׳ 12, ת׳ 19) חרגו מ-85% שעות הפעולה הנומינליות. תחנה 7 מצריכה תחזוקה מונעת בתוך 45 יום.\n\n**איכות מים – חריגות נקודתיות** – 2 מדגמים ברשת חיפה הדרומית הציגו ערכי כלוריד מעל הסף המותר (<code>148 מ״ג/ל מול 250 מ״ג/ל מותר</code>). ברמת מעקב ולא דורש פעולה מיידית.\n\n**המלצה עיקרית** – תיעדוף תחזוקת תחנה 7 ובדיקת תשתית הולכה בקרית אתא. עיכוב של מעל חודש עלול לגרור הפסקת אספקה חלקית לכ-12,000 מנויים.",
        delay: 400
    },
    {
        type: "user",
        text: "מה גורם לירידת הלחץ בחיפה מזרח ספציפית?",
        delay: 0
    },
    {
        type: "agent",
        tools: [
            {
                id: "cmd1",
                icon: "terminal",
                label: "שאילתת נתוני לחץ",
                ms: 1600,
                desc: "SELECT zone, pressure_avg FROM telemetry WHERE region='haifa_east' AND period='Q3'"
            },
            {
                id: "search",
                icon: "search",
                label: "חיפוש אירועי תשתית",
                ms: 1000,
                desc: "סריקת יומני תקלות ותחזוקה – יולי–ספטמבר 2024"
            },
            {
                id: "diff",
                icon: "git-compare",
                label: "השוואת Q2 מול Q3",
                ms: 800,
                desc: "דיף על 24 קטגוריות ניטור"
            }
        ],
        text: "שלושה גורמים עיקריים מסבירים 88% מהירידה:\n\n1. **דליפה לא מאובחנת בקו ראשי** – קו ה-DN400 ברחוב הנמל זיהה אובדן של כ-7 מ״ק לשעה. הדליפה טרם תוקנה מאז אוגוסט.\n\n2. **עומס יתר בתחנת שאיבה 12** – גידול של 18% בצריכה בשל גל חום יולי. התחנה פועלת ב-94% מהקיבולת ולא מספיקה לפצות.\n\n3. **חסימה חלקית בצומת הולכה ח-7** – שקיעת קרקע מינורית גרמה לעיוות בצנרת ולצמצום ספיקה. מאובחן אך לא טופל.\n\nהבשורה הטובה: שלושת הגורמים ניתנים לטיפול תוך 3–4 שבועות. איטום הדליפה בקו הראשי לבדו יחזיר כ-60% מלחץ האספקה הנורמלי.",
        delay: 300
    },
    {
        type: "user",
        text: "כתוב לי סיכום מנהלים בפסקה אחת לדוח הדירקטוריון.",
        delay: 0
    },
    {
        type: "agent",
        tools: [
            {
                id: "draft",
                icon: "edit-3",
                label: "גיבוש סיכום מנהלים",
                ms: 1200,
                desc: "עיצוב ממצאים לשפה ניהולית"
            }
        ],
        text: "הנה פסקת הסיכום לדירקטוריון:\n\n---\n\n*ברבעון השלישי של 2024 נרשמו לחצי אספקה נמוכים מהתקן ב-14 אזורי חלוקה, בדגש על חיפה מזרח, כתוצאה מדליפה פעילה בקו ראשי DN400, עומס יתר בתחנת שאיבה 12 וחסימה חלקית בצומת הולכה ח-7. שלושה גופים מרכזיים – כ-12,000 מנויים – חשופים לסיכון הפסקת אספקה אם הטיפול יידחה מעבר ל-45 יום. איכות המים נמצאת ברמת מעקב ואינה מצריכה פעולה מיידית. ההנהלה הגדירה תוכנית תיקון מיידית לשלושת הגורמים המרכזיים שתושלם עד סוף נובמבר 2024, עם צפי לחזרה מלאה ללחץ נורמטיבי תוך 30 יום מהתחלת הטיפול.*\n\n---\n\nאפשר לעדכן את הטון, להוסיף נתוני עלות, או לבקש גרסה קצרה יותר לשקף.",
        delay: 300
    }
];

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

async function runToolBlock(toolEl, tool) {
    const statusEl = toolEl.querySelector('.tool-status');
    const barEl = toolEl.querySelector('.progress-bar');
    const durEl = toolEl.querySelector('.tool-dur');
    statusEl.textContent = 'מעבד...';
    statusEl.className = 'tool-status running';
    if (barEl) {
        barEl.style.transition = `width ${tool.ms}ms linear`;
        requestAnimationFrame(() => { barEl.style.width = '100%'; });
    }
    await sleep(tool.ms);
    statusEl.textContent = 'הושלם';
    statusEl.className = 'tool-status done';
    if (durEl) durEl.textContent = (tool.ms / 1000).toFixed(1) + 'ש';
}

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

let running = false;
async function runFlow() {
    if (running) return;
    running = true;
    document.getElementById('messages').innerHTML = '';
    for (const step of FLOW) {
        if (step.type === 'user') await playUserMessage(step);
        else await playAgentMessage(step);
        await sleep(500);
    }
    const msgs = document.getElementById('messages');
    const wrap = document.createElement('div');
    wrap.style.textAlign = 'center';
    wrap.style.padding = '20px 0 8px';
    wrap.innerHTML = `<button class="restart-btn" onclick="runFlow()">
    ${iconSvg('activity')} הפעל מחדש את השיחה
  </button>`;
    msgs.appendChild(wrap);
    msgs.scrollTop = 99999;
    running = false;
}

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

runFlow();