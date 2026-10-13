'use strict';
// CampusIQ Academic Intelligence Server: Serves pages & proxies real-time AI requests.
// Supports Google Gemini, OpenAI, and Anthropic Claude.
const http = require('http'), fs = require('fs'), path = require('path');

try { // .env loader
  const envPath = path.join(__dirname, '.env');
  if (fs.existsSync(envPath)) {
    for (const l of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  }
} catch (e) {}

const PORT = +process.env.PORT || 3000, HOST = process.env.HOST || '127.0.0.1';

// API Keys & Config
const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = process.env.ANTHROPIC_MODEL || 'claude-3-5-sonnet-20241022';
const ANTHROPIC_API = process.env.ANTHROPIC_API_URL || 'https://api.anthropic.com/v1/messages';

const ACTIVE_AI = GEMINI_KEY ? 'gemini' : OPENAI_KEY ? 'openai' : ANTHROPIC_KEY ? 'anthropic' : null;
const ACTIVE_MODEL = GEMINI_KEY ? GEMINI_MODEL : OPENAI_KEY ? OPENAI_MODEL : ANTHROPIC_KEY ? ANTHROPIC_MODEL : 'none';

const PAGES = {
  '/': 'index.html',
  '/index.html': 'index.html',
  '/login.html': 'index.html',
  '/faculty-portal.html': 'faculty-portal.html',
  '/student-portal.html': 'student-portal.html',
  '/faculty-login.html': 'faculty-login.html',
  '/student-login.html': 'student-login.html',
  '/ai-client.js': 'ai-client.js'
};

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8'
};

const ACADEMIC_SYSTEM_BASE = `You are CampusIQ Senior Academic Dean & Pedagogical Intelligence Specialist inside an elite university faculty senate and advising system.
Provide rigorous, formal, constructive, and evidence-based academic diagnostics and student success interventions.
Maintain a distinguished, collegiate, and authoritative academic tone.
When analyzing student progress reports, diagnose root causes (exam performance, continuous assessment, statutory attendance, coding proficiency, mock interviews, and backlogs), and formulate concrete, multi-week pedagogical interventions and faculty actions.
Format your output using clear markdown headings (##, ###), bullet points, and numbered action plans.`;

const ROLES = {
  faculty: 'You are advising university faculty, course professors, and department deans. Explain disaggregated performance metrics, risk vectors, and placement-readiness gaps, and formulate concrete academic remediation (tutoring, syllabus milestones, lab practice, mock viva sessions) and structured mentor check-ins.',
  student: 'You are the University Academic & Advising Assistant speaking with an enrolled undergraduate. Be encouraging, precise, and supportive. Discuss their coursework schedule, attendance status, subject performance, deadlines, and faculty advisor office hours.'
};

const hits = new Map();
const limited = ip => {
  const n = Date.now(), a = (hits.get(ip) || []).filter(t => n - t < 60000);
  a.push(n);
  hits.set(ip, a);
  return a.length > 40;
};

const send = (res, code, obj, type = 'application/json; charset=utf-8') => {
  res.writeHead(code, {
    'Content-Type': type,
    'X-Content-Type-Options': 'nosniff',
    'Cache-Control': 'no-store',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(typeof obj === 'string' || Buffer.isBuffer(obj) ? obj : JSON.stringify(obj));
};

const body = req => new Promise((ok, no) => {
  let b = '';
  req.on('data', c => {
    b += c;
    if (b.length > 100000) { no(new Error('payload too large')); req.destroy(); }
  });
  req.on('end', () => ok(b));
  req.on('error', no);
});

async function callGeminiBackend(prompt, systemInstruction) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_KEY}`;
  const r = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\n${prompt}` }] }],
      generationConfig: { temperature: 0.4, maxOutputTokens: 2048 }
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || `Gemini HTTP ${r.status}`);
  return j.candidates[0].content.parts[0].text;
}

async function callOpenAIBackend(messages, systemInstruction) {
  const r = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_KEY}` },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      messages: [{ role: 'system', content: systemInstruction }, ...messages],
      temperature: 0.4,
      max_tokens: 1800
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || `OpenAI HTTP ${r.status}`);
  return j.choices[0].message.content;
}

async function callAnthropicBackend(messages, systemInstruction) {
  const r = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: ANTHROPIC_MODEL,
      max_tokens: 1800,
      system: systemInstruction,
      messages: messages
    })
  });
  const j = await r.json();
  if (!r.ok) throw new Error((j.error && j.error.message) || `Anthropic HTTP ${r.status}`);
  return (j.content || []).filter(b => b.type === 'text').map(b => b.text).join('\n').trim();
}

async function chat(req, res) {
  if (limited(req.socket.remoteAddress)) return send(res, 429, { error: 'Rate limit exceeded. Please wait a moment.' });
  let d;
  try { d = JSON.parse(await body(req)); } catch { return send(res, 400, { error: 'Invalid JSON request.' }); }

  const role = d.role || 'faculty';
  const systemPrompt = `${ACADEMIC_SYSTEM_BASE}\n${ROLES[role] || ''}\n\nDATA:\n${String(d.context || '').slice(0, 30000)}`;
  
  let msgs = (Array.isArray(d.messages) ? d.messages : [])
    .filter(m => m && ['user', 'assistant'].includes(m.role) && typeof m.content === 'string' && m.content.trim())
    .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));

  if (!msgs.length) return send(res, 400, { error: 'Inquiry content missing.' });

  try {
    let reply = '';
    if (ACTIVE_AI === 'gemini') {
      const userText = msgs.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      reply = await callGeminiBackend(userText, systemPrompt);
    } else if (ACTIVE_AI === 'openai') {
      reply = await callOpenAIBackend(msgs, systemPrompt);
    } else if (ACTIVE_AI === 'anthropic') {
      reply = await callAnthropicBackend(msgs, systemPrompt);
    } else {
      return send(res, 503, { error: 'No server API key configured. Use Gemini, OpenAI, or Anthropic in .env, or use client-side AI Settings in browser.' });
    }
    return send(res, 200, { reply });
  } catch (e) {
    console.error('AI execution error:', e.message);
    return send(res, 502, { error: `AI Service Error: ${e.message}` });
  }
}

http.createServer(async (req, res) => {
  const p = new URL(req.url, 'http://x').pathname;

  if (p === '/api/health' && req.method === 'GET') {
    return send(res, 200, {
      ai: !!ACTIVE_AI,
      provider: ACTIVE_AI,
      model: ACTIVE_MODEL,
      status: 'ready'
    });
  }

  if (p === '/api/chat') {
    return req.method === 'POST' ? chat(req, res) : send(res, 405, { error: 'POST method required.' });
  }

  const f = PAGES[p];
  if (!f || req.method !== 'GET') return send(res, 404, 'Resource not found', 'text/plain');

  fs.readFile(path.join(__dirname, f), (e, buf) => {
    if (e) return send(res, 404, 'File not found', 'text/plain');
    send(res, 200, buf, MIME[path.extname(f)] || 'text/html; charset=utf-8');
  });
}).listen(PORT, HOST, () => {
  console.log(`=======================================================`);
  console.log(`  CampusIQ Academic Portal running at http://localhost:${PORT}`);
  console.log(`  AI Provider: ${ACTIVE_AI ? ACTIVE_AI.toUpperCase() + ' (' + ACTIVE_MODEL + ')' : 'Client-Side Real-Time Mode'}`);
  console.log(`=======================================================`);
});
