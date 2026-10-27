/* WordBloom Skills Studio – app engine (reading, listening, speaking, writing).
   Access: free sample (first activity of each skill) · personal plan codes (1/3/6 months)
   · teacher class codes shared with pupils · existing WordBloom client codes keep working. */
(function () {
'use strict';
var D = window.WB_SKILLS;

/* ====================== CONFIG – edit prices and Stripe links here ====================== */
var CFG = {
  supabase: 'https://ynwumcchbhdlejsvwlse.supabase.co/rest/v1/rpc/',
  key: 'sb_publishable_NbLZobLWm-uzdAONUPsbNA_pHrhYVf6',
  contact: 'rduchnatalia@gmail.com',
  seats: 30,
  plans: {
    'uczen-1m':  { kind: 'student', months: 1, price: 19 },
    'uczen-3m':  { kind: 'student', months: 3, price: 49, best: true },
    'uczen-6m':  { kind: 'student', months: 6, price: 89 },
    'klasa-1m':  { kind: 'teacher', months: 1, price: 30 },
    'klasa-3m':  { kind: 'teacher', months: 3, price: 80, best: true },
    'klasa-6m':  { kind: 'teacher', months: 6, price: 150 }
  },
  /* Paste each Stripe payment link here (buy.stripe.com/...). After payment, set the link's
     confirmation page to: https://wordbloom.ca/api/plan?plan=uczen-1m&session_id={CHECKOUT_SESSION_ID} */
  payLinks: {
    'uczen-1m': 'https://buy.stripe.com/00wfZi0dlbq98kUeYS4sE0S',
    'uczen-3m': 'https://buy.stripe.com/eVq6oI5xFeClgRq3ga4sE0T',
    'uczen-6m': 'https://buy.stripe.com/aFa6oIbW30Lv44EbMG4sE0U',
    'klasa-1m': 'https://buy.stripe.com/3cIaEY1hpam5bx6aIC4sE11',
    'klasa-3m': 'https://buy.stripe.com/3cI5kEe4b1Pz44E7wq4sE12',
    'klasa-6m': 'https://buy.stripe.com/3cI7sM8JRfGpcBa2c64sE13'
  }
};

/* ====================== helpers ====================== */
function $(s, r) { return (r || document).querySelector(s); }
function $$(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
function shuffleNot(a) { if (a.length < 2) return a.slice(); var s; do { s = shuffle(a); } while (s.join('|') === a.join('|')); return s; }
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }
function apos(s) { return String(s).replace(/[‘’ʼ`]/g, "'").replace(/[“”]/g, '"'); }
function norm(s) { return apos(s).toLowerCase().replace(/[^a-z0-9' ]+/g, ' ').replace(/\s+/g, ' ').trim(); }
function words(s) { return norm(s).split(' ').filter(Boolean); }
function strict(s) { return apos(s).replace(/\s+/g, ' ').trim(); }
function today() { var d = new Date(); return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); }
function fmtDate(t) { try { return new Date(t).toLocaleDateString('pl-PL', { day: 'numeric', month: 'short', year: 'numeric' }); } catch (e) { return ''; } }
function daysLeft(iso) { return Math.ceil((new Date(iso) - Date.now()) / 864e5); }
function toast(t) { var el = $('#toast'); el.textContent = t; el.classList.add('on'); clearTimeout(toast._t); toast._t = setTimeout(function () { el.classList.remove('on'); }, 2400); }
function copy(t) { (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { toast('Skopiowano! · Copied!'); }).catch(function () { prompt('Skopiuj / Copy:', t); }); }
function starsHtml(n) { var h = ''; for (var i = 1; i <= 3; i++) h += i <= n ? '★' : '<span class="off">★</span>'; return '<span class="stars" aria-label="' + n + '/3">' + h + '</span>'; }
function rpc(fn, body) {
  return fetch(CFG.supabase + fn, { method: 'POST', headers: { apikey: CFG.key, Authorization: 'Bearer ' + CFG.key, 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}) })
    .then(function (r) { return r.json().then(function (j) { if (!r.ok) { var e = new Error((j && j.message) || 'HTTP ' + r.status); e.status = r.status; throw e; } return j; }); });
}

/* ====================== progress (stored on this device, synced for class pupils) ====================== */
var KEY = 'wbSkillsV1';
var P = (function () { try { return JSON.parse(ls(KEY)) || {}; } catch (e) { return {}; } })();
P.done = P.done || {}; P.log = P.log || []; P.days = P.days || []; P.goal = P.goal || 5; P.texts = P.texts || {};
P.band = P.band || 'k46'; P.name = P.name || '';
function save() { ls(KEY, JSON.stringify(P)); }

var ALL = {}; // id -> {act, band, skill, index}
Object.keys(D.activities).forEach(function (b) { Object.keys(D.activities[b]).forEach(function (s) { D.activities[b][s].forEach(function (a, i) { ALL[a.id] = { act: a, band: b, skill: s, index: i }; }); }); });

function totalStars() { var n = 0; for (var k in P.done) n += P.done[k].stars || 0; return n; }
function streak() {
  var set = {}; P.days.forEach(function (d) { set[d] = 1; });
  var n = 0, d = new Date();
  if (!set[today()]) d.setDate(d.getDate() - 1);
  for (;;) { var k = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate(); if (set[k]) { n++; d.setDate(d.getDate() - 1); } else break; }
  return n;
}
function weekLog() { var from = Date.now() - 7 * 864e5; return P.log.filter(function (l) { return l.at >= from; }); }
function skillStats(skill, band) {
  var list = D.activities[band || P.band][skill], done = 0, sum = 0, cnt = 0;
  list.forEach(function (a) { if (P.done[a.id]) done++; });
  P.log.forEach(function (l) { if (l.skill === skill) { sum += l.score; cnt++; } });
  return { done: done, total: list.length, avg: cnt ? sum / cnt : null, count: cnt };
}
function summary() {
  var sk = {}; Object.keys(D.skills).forEach(function (s) { var st = skillStats(s); sk[s] = { done: st.done, avg: st.avg == null ? null : Math.round(st.avg * 100) }; });
  return { total: Object.keys(P.done).length, stars: totalStars(), week: weekLog().length, streak: streak(), band: P.band, skills: sk, last: P.log.length ? new Date(P.log[P.log.length - 1].at).toISOString() : null,
    recent: P.log.slice(-6).reverse().map(function (l) { return { id: l.id, s: Math.round(l.score * 100) }; }) };
}

/* ====================== access ====================== */
var A = { full: false, kind: 'free', name: '' };
var PREVIEW = !/(^|\.)wordbloom\.ca$/.test(location.hostname) && !/[?&]nopreview/.test(location.search);
function canOpen(id) { var x = ALL[id]; if (!x) return false; if (A.full || x.index === 0) return true; return !!(A.assignment && A.assignment.ids && A.assignment.ids.indexOf(id) > -1 && A.kind === 'pupil'); }

function applyPlan(r, code) {
  A = { full: true, kind: r.kind, name: r.name || '', code: code, expires: r.expires_at, classCode: r.class_code, className: r.class_name, teacher: r.teacher_name, assignment: r.assignment || null, seats: r.seats, used: r.used };
  if (r.kind === 'pupil' && r.name && !P.name) { P.name = r.name; save(); }
  ls('wbPlanCache', JSON.stringify({ at: Date.now(), r: r, code: code }));
}
function checkAccess() {
  if (PREVIEW) { A = { full: true, kind: 'preview', name: 'Podgląd' }; return Promise.resolve(); }
  var tok = ls('wbAdminToken'), plan = ls('wbPlanCode'), client = ls('wbClientCode');
  var chain = Promise.resolve(false);
  if (tok) chain = rpc('wb_admin_check', { p_token: tok }).then(function (ok) { if (ok) { A = { full: true, kind: 'admin', name: 'Natalia' }; return true; } return false; }).catch(function () { return false; });
  return chain.then(function (done) {
    if (done || !plan) return done;
    return rpc('wb_plan_check', { p_code: plan }).then(function (r) {
      if (r && r.ok) { applyPlan(r, plan); return true; }
      if (r && r.reason === 'expired') { A = { full: false, kind: 'expired', expiredKind: r.kind, name: r.name || '', expires: r.expires_at }; return true; }
      if (r && r.reason !== 'too_many') { ls('wbPlanCode', null); ls('wbPlanCache', null); }
      return false;
    }).catch(function () {
      try { var c = JSON.parse(ls('wbPlanCache')); if (c && c.code === plan && Date.now() - c.at < 3 * 864e5) { applyPlan(c.r, plan); return true; } } catch (e) {}
      return false;
    });
  }).then(function (done) {
    if (done || !client) return;
    return rpc('wb_check_code', { p_code: client }).then(function (r) { if (r && r.ok) A = { full: true, kind: 'client', name: r.name || '' }; }).catch(function () {
      var ok = +ls('wbClientOkAt') || 0; if (Date.now() - ok < 3 * 864e5) A = { full: true, kind: 'client', name: ls('wbClientName') || '' };
    });
  });
}
function redeem(code, msgEl) {
  code = String(code || '').trim().toUpperCase().replace(/\s+/g, '');
  var say = function (t, ok) { if (msgEl) { msgEl.className = 'msg ' + (ok ? 'ok' : 'err'); msgEl.textContent = t; } };
  if (!code) { say('Wpisz kod. · Please type your code.'); return Promise.resolve(false); }
  say('Sprawdzam… · Checking…', true);
  return rpc('wb_plan_check', { p_code: code }).catch(function () { return null; }).then(function (r) {
    if (r && r.ok) { ls('wbPlanCode', code); applyPlan(r, code); return 'ok'; }
    if (r && r.reason === 'class') return askPupilName(code, r.class_name, r.teacher_name);
    if (r && r.reason === 'expired') { say('Ten kod wygasł ' + fmtDate(r.expires_at) + '. Przedłuż dostęp w zakładce „Dostęp i ceny”. · This code has expired.'); return false; }
    if (r && r.reason === 'too_many') { say('Za dużo prób – spróbuj za 15 minut. · Too many tries.'); return false; }
    return rpc('wb_check_code', { p_code: code }).then(function (c) {
      if (c && c.ok) { ls('wbClientCode', c.code || code); ls('wbClientName', c.name || ''); ls('wbClientOkAt', String(Date.now())); A = { full: true, kind: 'client', name: c.name || '' }; return 'ok'; }
      say(c && c.reason === 'inactive' ? 'Ten kod jest nieaktywny. Napisz do Natalii. · This code is switched off.' : 'Nie znaleziono kodu. Sprawdź i spróbuj ponownie. · Code not found.');
      return false;
    }).catch(function () { say('Nie udało się sprawdzić kodu. Spróbuj za chwilę. · Please try again.'); return false; });
  }).then(function (res) { if (res === 'ok') { closeModal(); refresh(); toast('Witaj' + (A.name ? ', ' + A.name : '') + '! Pełny dostęp odblokowany 🎉'); } return res; });
}
function askPupilName(classCode, className, teacher) {
  return new Promise(function (resolve) {
    openModal('<h2>Dołącz do klasy 👋</h2><p>Klasa <b>' + esc(className || classCode) + '</b>' + (teacher ? ' · ' + esc(teacher) : '') + '</p><p class="pl">Join the class – type your first name and the first letter of your surname.</p>' +
      '<form id="joinF"><input class="field" id="joinName" maxlength="40" placeholder="np. Ola N." autocomplete="off" required><button class="btn big" style="width:100%;margin-top:12px">Dołącz · Join</button></form><div class="msg" id="joinMsg"></div>');
    $('#joinName').focus();
    $('#joinF').onsubmit = function (e) {
      e.preventDefault(); var name = $('#joinName').value.trim(); var m = $('#joinMsg');
      if (name.length < 2) { m.className = 'msg err'; m.textContent = 'Wpisz imię. · Type your name.'; return; }
      m.className = 'msg ok'; m.textContent = 'Dołączam… · Joining…';
      rpc('wb_class_join', { p_class_code: classCode, p_name: name }).then(function (r) {
        if (!r || !r.ok) { m.className = 'msg err'; m.textContent = r && r.reason === 'full' ? 'Klasa jest pełna – poproś nauczyciela o więcej miejsc.' : r && r.reason === 'expired' ? 'Dostęp klasy wygasł – poinformuj nauczyciela.' : 'Nie udało się dołączyć.'; return; }
        ls('wbPlanCode', r.code); P.name = name; save();
        return rpc('wb_plan_check', { p_code: r.code }).then(function (c) {
          if (c && c.ok) applyPlan(c, r.code);
          openModal('<h2>Gotowe! 🎉</h2><p>To jest Twój osobisty kod. <b>Zapisz go</b> – przyda się na innym urządzeniu.</p><p class="pl">This is your personal code. Write it down for other devices.</p><div class="codebox">' + esc(r.code) + '</div><button class="btn big" style="width:100%" id="goStart">Zaczynamy! · Let\'s start</button>');
          $('#goStart').onclick = function () { closeModal(); refresh(); };
          resolve('joined');
        });
      }).catch(function () { m.className = 'msg err'; m.textContent = 'Błąd połączenia. Spróbuj ponownie.'; });
    };
  });
}

/* ====================== audio: text-to-speech (shared British voices: wordbloom-voice.js) ====================== */
var V = window.WBVoice;
/* calmer speed for the youngest learners, natural speed for adults */
function bandRate() { return { k13: 0.85, k46: 0.9, k78: 0.95, adult: 1 }[P.band] || 0.92; }
function speak(text, opt) {
  opt = opt || {};
  if (!V || !V.supported) { toast('Ta przeglądarka nie odtwarza dźwięku. Spróbuj Chrome, Edge lub Safari.'); return Promise.resolve(); }
  var r = opt.rate == null ? bandRate() : opt.rate;
  if (opt.rate != null && opt.rate >= 0.8) r = opt.rate * bandRate() / 0.92; // keep each activity's relative speed, scaled to the level
  return V.speak(text, { rate: r, voice: opt.voiceObj, pitch: opt.pitch });
}
function stopSpeak() { if (V) V.stop(); }
function audioBox(getText, opts) {
  opts = opts || {};
  var box = document.createElement('div'); box.className = 'audio';
  box.innerHTML = '<button class="play" type="button" aria-label="Odtwórz / Play">▶</button><button class="slow" type="button">🐢 Wolniej · Slow</button><div style="flex:1;min-width:140px"><b>' + (opts.label || 'Posłuchaj · Listen') + '</b><div class="pl">' + (opts.sub || 'Możesz słuchać wiele razy. · Play as many times as you like.') + '</div></div><button class="slow vpick" type="button" title="Zmień głos · Change voice" aria-label="Zmień głos">🔊 Głos</button>';
  var play = $('.play', box), slow = $('.slow', box), busy = false, runId = 0;
  function reset() { busy = false; play.classList.remove('on'); play.textContent = '▶'; }
  function run(slowMode) {
    if (busy) { speakLines.stop = true; stopSpeak(); reset(); return; }
    var id = ++runId; busy = true; play.classList.add('on'); play.textContent = '■';
    var rate = slowMode ? bandRate() * 0.75 : bandRate();
    var t = getText(); var p = Array.isArray(t) ? speakLines(t, rate) : V.speak(t, { rate: rate });
    p.then(function () { if (id !== runId) return; reset(); if (opts.onPlayed) opts.onPlayed(); });
  }
  play.onclick = function () { run(false); }; slow.onclick = function () { run(true); };
  $('.vpick', box).onclick = voiceModal;
  box.autoplay = function () { setTimeout(function () { run(false); }, 350); };
  return box;
}
/* dialogues: speaker A and speaker B get two different British voices (female + male when possible) */
function speakLines(lines, rate) {
  speakLines.stop = false;
  var pr = V ? V.pair() : [null, null, 1.25], who = {}, i = 0;
  lines.forEach(function (l) { if (!(l[0] in who)) who[l[0]] = Object.keys(who).length % 2 ? { v: pr[1], p: pr[2] } : { v: pr[0], p: 1 }; });
  return new Promise(function (res) {
    (function next() {
      if (i >= lines.length || speakLines.stop) { speakLines.stop = false; return res(); }
      var l = lines[i++], w = who[l[0]];
      V.speak(l[1], { rate: rate || bandRate(), voice: w.v, pitch: w.p }).then(function (ok) { if (ok === false && speakLines.stop) return res(); setTimeout(next, 380); });
    })();
  });
}
/* voice picker – the choice is remembered on this device and used everywhere on WordBloom */
function voiceModal() {
  if (!V || !V.supported) { toast('Ta przeglądarka nie odtwarza dźwięku.'); return; }
  V.ready().then(function () {
    var vs = V.list(), cur = V.main(), gb = vs.filter(V.isGB), other = vs.filter(function (v) { return !V.isGB(v); });
    var sample = 'Hello! I\'m your WordBloom voice. Let\'s practise English together.';
    function row(v) { var on = cur && v.voiceURI === cur.voiceURI; return '<div class="vrow' + (on ? ' on' : '') + '"><button type="button" class="vsel" data-uri="' + esc(v.voiceURI) + '">' + (on ? '✓ ' : '') + esc(V.label(v)) + '</button><button type="button" class="vtry" data-try="' + esc(v.voiceURI) + '" aria-label="Posłuchaj próbki">▶</button></div>'; }
    var sp = V.getSpeed();
    openModal('<h2>Wybierz głos 🔊</h2><p class="pl">Lektor czyta ćwiczenia po angielsku z akcentem brytyjskim. Wybór zapisze się na tym urządzeniu. · Choose a voice.</p>' +
      '<div style="margin:14px 0 6px"><b>Tempo · Speed</b></div><div class="seg" id="vSpeed">' + [[0.85, '🐢 Wolniej'], [1, 'Normalnie'], [1.12, '🐇 Szybciej']].map(function (x) { return '<button type="button" data-sp="' + x[0] + '" class="' + (Math.abs(sp - x[0]) < .01 ? 'on' : '') + '">' + x[1] + '</button>'; }).join('') + '</div>' +
      (gb.length ? '<div style="margin:16px 0 6px"><b>🇬🇧 Brytyjskie · British</b></div><div class="vlist">' + gb.map(row).join('') + '</div>' : '<div class="banner warn" style="margin-top:14px">Na tym urządzeniu nie ma brytyjskiego głosu. W Chrome lub Edge będzie ich więcej. Możesz też dodać głos „English (UK)” w ustawieniach systemu.</div>') +
      (other.length ? '<details style="margin-top:12px"><summary style="font-weight:800;cursor:pointer">Inne akcenty · Other accents (' + other.length + ')</summary><div class="vlist" style="margin-top:8px">' + other.map(row).join('') + '</div></details>' : '') +
      '<button class="btn big" type="button" style="width:100%;margin-top:16px" data-close>Gotowe · Done</button>' +
      '<p class="pl" style="margin:10px 0 0;font-size:13px">✨ = najbardziej naturalne głosy. Najlepiej brzmią w Chrome i Edge na komputerze oraz w Safari na iPhonie/iPadzie.</p>');
    var m = $('#mbox');
    $$('[data-close]', m).forEach(function (b) { b.onclick = function () { stopSpeak(); closeModal(); }; });
    $$('[data-sp]', m).forEach(function (b) { b.onclick = function () { V.speed(+b.getAttribute('data-sp')); $$('[data-sp]', m).forEach(function (x) { x.classList.toggle('on', x === b); }); V.speak(sample, { rate: bandRate() }); }; });
    function find(u) { for (var i = 0; i < vs.length; i++) if (vs[i].voiceURI === u) return vs[i]; return null; }
    $$('[data-try]', m).forEach(function (b) { b.onclick = function () { V.speak(sample, { rate: bandRate(), voice: find(b.getAttribute('data-try')) }); }; });
    $$('[data-uri]', m).forEach(function (b) { b.onclick = function () { V.choose(b.getAttribute('data-uri')); toast('Zapisano głos 🔊 ' + V.label(V.main()).split(' · ')[0]); voiceModal(); V.speak(sample, { rate: bandRate() }); }; });
  });
}

/* ====================== microphone: speech recognition + recording ====================== */
var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
function recognise() {
  return new Promise(function (res, rej) {
    if (!SR) return rej(new Error('nosr'));
    var r = new SR(); r.lang = 'en-GB'; r.interimResults = false; r.maxAlternatives = 4; r.continuous = false;
    var got = [];
    r.onresult = function (e) { for (var i = 0; i < e.results[0].length; i++) got.push(e.results[0][i].transcript); };
    r.onerror = function (e) { rej(e.error || e); };
    r.onend = function () { res(got); };
    try { r.start(); } catch (e) { rej(e); }
    recognise.current = r;
    setTimeout(function () { try { r.stop(); } catch (e) {} }, 9000);
  });
}
function matchWords(expected, heardList) {
  var exp = words(expected), best = null;
  (heardList.length ? heardList : ['']).forEach(function (h) {
    var pool = words(h), status = exp.map(function (w) { var k = pool.indexOf(w); if (k > -1) { pool.splice(k, 1); return true; } return false; });
    var ok = status.filter(Boolean).length / (exp.length || 1);
    if (!best || ok > best.score) best = { score: ok, status: status, heard: h };
  });
  best.words = exp; return best;
}
function recorder() {
  var rec = null, chunks = [], stream = null;
  return {
    start: function () {
      if (!navigator.mediaDevices || !window.MediaRecorder) return Promise.reject(new Error('norec'));
      return navigator.mediaDevices.getUserMedia({ audio: true }).then(function (s) { stream = s; chunks = []; rec = new MediaRecorder(s); rec.ondataavailable = function (e) { if (e.data.size) chunks.push(e.data); }; rec.start(); });
    },
    stop: function () {
      return new Promise(function (res) {
        if (!rec || rec.state === 'inactive') return res(null);
        rec.onstop = function () { if (stream) stream.getTracks().forEach(function (t) { t.stop(); }); res(URL.createObjectURL(new Blob(chunks, { type: rec.mimeType || 'audio/webm' }))); };
        rec.stop();
      });
    }
  };
}

/* ====================== views ====================== */
var SKILLS = Object.keys(D.skills);
function setTop() {
  var b = D.bands[P.band];
  $('#bandChip').textContent = b.emoji + ' ' + b.name;
  $('#starCount').textContent = totalStars();
  $('#streakCount').textContent = streak();
  var label = A.kind === 'teacher' ? '👩‍🏫 ' + (A.name || 'Nauczyciel') : A.full ? '🌸 ' + (P.name || A.name || 'Pełny dostęp') : A.kind === 'expired' ? '⏳ Odnów dostęp' : '🔑 Mam kod';
  $('#whoBtn').textContent = label;
}
function route() {
  stopSpeak();
  var h = (location.hash || '#home').slice(1).split('?')[0];
  var v = SKILLS.indexOf(h) > -1 ? 'skill' : (['home', 'parent', 'teacher', 'plans'].indexOf(h) > -1 ? h : 'home');
  $$('.view').forEach(function (s) { s.classList.toggle('on', s.id === 'v-' + v); });
  $$('[data-v]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-v') === (v === 'skill' ? h : v)); });
  ({ home: viewHome, skill: function () { viewSkill(h); }, parent: viewParent, teacher: viewTeacher, plans: viewPlans })[v]();
  setTop(); window.scrollTo(0, 0);
}
function refresh() { route(); }

function nextFor(skill) { var list = D.activities[P.band][skill]; for (var i = 0; i < list.length; i++) if (!P.done[list[i].id] && canOpen(list[i].id)) return list[i]; for (i = 0; i < list.length; i++) if (canOpen(list[i].id)) return null; return null; }
function garden() {
  var fl = ['🌷', '🌼', '🌻', '🌸', '🪻', '🌹', '🌺'], n = Object.keys(P.done).length;
  if (!n) return '<span style="display:flex;gap:10px;align-items:center">🌱 <span style="font-size:14px;opacity:.85;letter-spacing:0;line-height:1.4">Twój ogród czeka. Każde ćwiczenie to nowy kwiatek!<br><span style="opacity:.75">Every activity grows a flower.</span></span></span>';
  var s = ''; for (var i = 0; i < Math.min(n, 24); i++) s += fl[(i * 3) % fl.length];
  return s + (n > 24 ? ' <span style="font-size:15px">+' + (n - 24) + '</span>' : '');
}
var LESSON_URL = 'https://buy.stripe.com/8x2dRa9NV51L30Ag2W4sE10';
function lessonCard() {
  if (P.band !== 'adult') return '';
  return '<div class="card" style="margin-top:18px;background:#fdf1dc;border:2px solid #f0c987;display:flex;gap:16px;align-items:center;flex-wrap:wrap">' +
    '<div style="font-size:42px">📅</div><div style="flex:1;min-width:220px"><b style="font-size:20px">Chcesz mówić swobodniej? Zarezerwuj lekcję online</b>' +
    '<p style="margin:4px 0 0">Indywidualna lekcja angielskiego online: rozmowa, praca, podróże, rozmowy o pracę.</p></div>' +
    '<a class="btn" href="' + LESSON_URL + '" target="_blank" rel="noopener">Zarezerwuj lekcję</a></div>';
}
function viewHome() {
  var b = D.bands[P.band], wk = weekLog().length, name = P.name || (A.kind === 'pupil' ? A.name : '');
  var h = '';
  if (A.kind === 'expired') h += '<div class="banner warn">⏳ Twój dostęp wygasł ' + fmtDate(A.expires) + '. Darmowe ćwiczenia nadal działają. <a class="btn sm" href="#plans">Przedłuż · Renew</a></div>';
  if (A.kind === 'preview') h += '<div class="banner info">👀 Tryb podglądu – wszystko odblokowane (strona testowa). Na wordbloom.ca obowiązują kody dostępu.</div>';
  h += '<div class="hero"><div class="hello"><div class="eyebrow">Skills Studio · ' + esc(b.en) + '</div><h1>' + (name ? 'Cześć, ' + esc(name) + '! 👋' : 'Cześć! Gotowy/a? 👋') + '</h1>' +
    '<p>Czytaj, słuchaj, mów i pisz po angielsku – po 5 minut dziennie.</p><div class="pl">Read, listen, speak and write in English – five minutes a day.</div>' +
    '<div class="garden" aria-label="Twój ogród">' + garden() + '</div>' +
    '<div class="row" style="margin-top:14px">' + (A.full ? '' : '<a class="btn" href="#plans">Odblokuj wszystko</a><button class="btn light" style="background:rgba(255,255,255,.14);color:#fff" data-code>🔑 Mam kod</button>') + (name ? '' : '<button class="btn light" style="background:rgba(255,255,255,.14);color:#fff" id="setName">✏️ Jak masz na imię?</button>') + '</div></div>' +
    '<div class="grid" style="align-content:start"><div class="stats"><div class="stat"><b>' + totalStars() + '</b><span>⭐ gwiazdki</span></div><div class="stat"><b>' + streak() + '</b><span>🔥 dni z rzędu</span></div><div class="stat"><b>' + wk + '/' + P.goal + '</b><span>🎯 cel tygodnia</span></div></div>' +
    '<div class="card" style="padding:16px"><b>Twój poziom · Your level</b><div class="bands" style="margin-top:10px">' + Object.keys(D.bands).map(function (k) { var x = D.bands[k]; return '<button class="band' + (k === P.band ? ' on' : '') + '" data-band="' + k + '"><b>' + x.emoji + ' ' + x.name + '</b><small>' + x.en + ' · ' + x.level + '</small></button>'; }).join('') + '</div></div></div></div>';

  if (A.assignment && A.assignment.ids && A.assignment.ids.length) {
    h += '<div class="card assign" style="margin-top:18px"><div class="eyebrow" style="color:#9a5b00">📌 Zadanie od nauczyciela · Homework</div>' + (A.assignment.note ? '<p style="margin:6px 0 10px"><b>' + esc(A.assignment.note) + '</b></p>' : '') + '<div class="today">' +
      A.assignment.ids.filter(function (id) { return ALL[id]; }).map(function (id) { return todoRow(ALL[id].act, ALL[id].skill); }).join('') + '</div></div>';
  }
  h += lessonCard();
  var plan = SKILLS.map(function (s) { var a = nextFor(s); return a ? todoRow(a, s) : ''; }).join('');
  h += '<div class="grid g2" style="margin-top:18px;align-items:start"><div class="card"><div class="eyebrow">Na dziś · Today</div><h2 style="font-size:26px;margin:4px 0 12px">Twój plan na dziś</h2><div class="today">' + (plan || '<p>🎉 Wszystko zrobione na tym poziomie! Spróbuj ponownie, aby zdobyć 3 gwiazdki, albo wybierz wyższy poziom.</p>') + '</div></div>' +
    '<div class="grid g2 keep2">' + SKILLS.map(function (s) { var k = D.skills[s], st = skillStats(s); return '<a class="skilltile" href="#' + s + '" style="text-decoration:none;color:inherit"><div class="ic" style="background:' + k.soft + '">' + k.emoji + '</div><h3>' + k.pl + '</h3><div class="pl" style="margin-top:-6px" lang="en">' + k.en + '</div><small style="font-weight:700;color:var(--muted)">' + st.done + ' / ' + st.total + ' ćwiczeń</small><div class="bar"><i style="width:' + (st.done / st.total * 100) + '%;background:' + k.color + '"></i></div></a>'; }).join('') + '</div></div>';
  $('#v-home').innerHTML = h;
  $$('[data-band]', $('#v-home')).forEach(function (b) { b.onclick = function () { P.band = b.getAttribute('data-band'); save(); refresh(); }; });
  bindTodos($('#v-home'));
  var sn = $('#setName'); if (sn) sn.onclick = askName;
}
function todoRow(a, s) {
  var k = D.skills[s], d = P.done[a.id], t = D.types[a.type];
  return '<button class="todo' + (d ? ' done' : '') + '" data-open="' + a.id + '"><span class="ic" style="background:' + k.soft + '">' + k.emoji + '</span><span><b>' + esc(a.title) + '</b><small class="pl">' + k.pl + ' · ' + t[1] + ' <span lang="en">· ' + t[0] + '</span></small></span><span class="chev">' + (d ? starsHtml(d.stars) : canOpen(a.id) ? '→' : '🔒') + '</span></button>';
}
function bindTodos(root) { $$('[data-open]', root).forEach(function (b) { b.onclick = function () { openAct(b.getAttribute('data-open')); }; }); $$('[data-code]', root).forEach(function (b) { b.onclick = codeModal; }); }
function askName() {
  openModal('<h2>Jak masz na imię? ✏️</h2><p class="pl">What\'s your name?</p><form id="nmF"><input class="field" id="nm" maxlength="30" value="' + esc(P.name) + '" placeholder="np. Ola"><button class="btn big" style="width:100%;margin-top:12px">Zapisz · Save</button></form>');
  $('#nm').focus(); $('#nmF').onsubmit = function (e) { e.preventDefault(); P.name = $('#nm').value.trim(); save(); closeModal(); refresh(); };
}

function viewSkill(s) {
  var k = D.skills[s], list = D.activities[P.band][s], st = skillStats(s), b = D.bands[P.band];
  var h = '<div class="skillhead" style="background:' + k.soft + '"><div class="ic">' + k.emoji + '</div><div style="flex:1;min-width:220px"><div class="eyebrow" style="color:' + k.color + '">' + b.emoji + ' ' + b.name + ' · ' + b.level + '</div><h1>' + k.pl + ' <span style="color:var(--muted);font-size:.6em" lang="en">· ' + k.en + '</span></h1><p style="margin:6px 0 0">💡 ' + k.tipPl + '</p><div class="pl" lang="en">' + k.tip + '</div></div>' +
    '<div style="min-width:160px"><b style="font:30px var(--serif)">' + st.done + '/' + st.total + '</b><div class="bar" style="margin-top:6px;background:#fff"><i style="width:' + (st.done / st.total * 100) + '%;background:' + k.color + '"></i></div><small class="pl">ukończone · completed</small></div></div>';
  h += '<div class="acts">' + list.map(function (a, i) {
    var t = D.types[a.type], d = P.done[a.id], open = canOpen(a.id), assigned = A.assignment && A.assignment.ids && A.assignment.ids.indexOf(a.id) > -1;
    return '<button class="act' + (open ? '' : ' locked') + '" data-open="' + a.id + '"><span class="type" style="color:' + k.color + '">' + t[1] + '</span><small class="pl" style="margin-top:-6px" lang="en">' + t[0] + '</small><h3>' + esc(a.title) + '</h3><span class="pl">' + esc(a.pl || '') + '</span>' +
      '<div class="foot">' + (d ? starsHtml(d.stars) : starsHtml(0)) + (assigned ? '<span class="badge task">📌 zadanie</span>' : !A.full && i === 0 ? '<span class="badge free">Za darmo</span>' : open ? '' : '<span class="badge lock">🔒 Pełna wersja</span>') + '</div></button>';
  }).join('') + '</div>';
  h += lessonCard();
  h += '<div class="card" style="margin-top:20px"><b>Inne poziomy · Other levels</b><div class="bands" style="margin-top:10px">' + Object.keys(D.bands).map(function (x) { var y = D.bands[x]; return '<button class="band' + (x === P.band ? ' on' : '') + '" data-band="' + x + '"><b>' + y.emoji + ' ' + y.name + '</b><small>' + y.level + '</small></button>'; }).join('') + '</div></div>';
  if (!A.full) h += '<div class="card lockcta" style="margin-top:16px"><div class="row" style="justify-content:space-between"><div><h3 style="font-size:22px">Odblokuj wszystkie ćwiczenia</h3><div class="pl">60 interaktywnych ćwiczeń w 3 poziomach · od 19 zł / miesiąc</div></div><div class="row"><button class="btn light" data-code>🔑 Mam kod</button><a class="btn" href="#plans">Zobacz plany</a></div></div></div>';
  $('#v-skill').innerHTML = h;
  bindTodos($('#v-skill'));
  $$('[data-band]', $('#v-skill')).forEach(function (b) { b.onclick = function () { P.band = b.getAttribute('data-band'); save(); refresh(); }; });
}

/* ---------- parent ---------- */
function viewParent() {
  var wk = weekLog(), mins = Math.round(wk.reduce(function (a, l) { return a + (l.secs || 0); }, 0) / 60), name = P.name || 'Twoje dziecko';
  var weakest = null; SKILLS.forEach(function (s) { var st = skillStats(s); var v = st.avg == null ? -1 : st.avg + st.done / 20; if (weakest == null || v < weakest.v) weakest = { s: s, v: v }; });
  var ws = D.skills[weakest.s];
  var h = '<div class="eyebrow">👪 Kącik rodzica · Parent corner</div><h1 style="font-size:36px;margin:6px 0 4px">Postępy: ' + esc(name) + '</h1><p class="pl" style="margin:0 0 16px">Wszystko w jednym miejscu, po polsku. Nie musisz znać angielskiego, żeby pomagać. · Everything in one place.</p>';
  h += '<div class="banner info noprint">' + accessLine() + '</div>';
  h += '<div class="grid g4"><div class="stat"><b>' + wk.length + '</b><span>ćwiczeń w tym tygodniu</span></div><div class="stat"><b>' + (mins < 1 && wk.length ? '<1' : mins) + '</b><span>minut nauki (7 dni)</span></div><div class="stat"><b>' + totalStars() + '</b><span>⭐ gwiazdek</span></div><div class="stat"><b>' + streak() + '</b><span>🔥 dni z rzędu</span></div></div>';
  h += '<div class="grid g2" style="margin-top:16px;align-items:start"><div class="card"><h3 style="font-size:22px">🎯 Cel tygodnia</h3><p class="pl">Ile ćwiczeń tygodniowo? Zalecamy 5 (ok. 5–10 minut dziennie).</p><div class="seg noprint" style="margin:8px 0 12px">' + [3, 5, 7, 10].map(function (g) { return '<button data-goal="' + g + '" class="' + (P.goal === g ? 'on' : '') + '">' + g + '</button>'; }).join('') + '</div>' +
    '<div class="bar"><i style="width:' + Math.min(100, wk.length / P.goal * 100) + '%;background:var(--ok)"></i></div><p style="margin:8px 0 0;font-weight:700">' + wk.length + ' z ' + P.goal + (wk.length >= P.goal ? ' – cel osiągnięty! 🎉 Pochwal dziecko!' : '') + '</p></div>' +
    '<div class="card"><h3 style="font-size:22px">💡 Co dalej?</h3><p>Warto teraz poćwiczyć: <b>' + ws.emoji + ' ' + ws.pl + '</b> (' + ws.en + ').</p><ul style="padding-left:18px;margin:8px 0 0">' + D.parentTips[weakest.s].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div></div>';
  h += '<div class="card" style="margin-top:16px"><h3 style="font-size:22px;margin-bottom:12px">Umiejętności · Skills <small class="pl">(' + D.bands[P.band].name + ')</small></h3><div class="grid g2">' + SKILLS.map(function (s) {
    var k = D.skills[s], st = skillStats(s);
    return '<div><div class="row" style="justify-content:space-between"><b>' + k.emoji + ' ' + k.pl + ' <span class="pl">' + k.en + '</span></b><span class="pl">' + st.done + '/' + st.total + (st.avg != null ? ' · śr. wynik ' + Math.round(st.avg * 100) + '%' : '') + '</span></div><div class="bar" style="margin-top:6px"><i style="width:' + (st.done / st.total * 100) + '%;background:' + k.color + '"></i></div></div>';
  }).join('') + '</div></div>';
  var recent = P.log.slice(-12).reverse();
  h += '<div class="card" style="margin-top:16px"><h3 style="font-size:22px;margin-bottom:10px">Ostatnie ćwiczenia</h3>' + (recent.length ? '<div class="tablewrap"><table class="rep"><tr><th>Data</th><th>Umiejętność</th><th>Ćwiczenie</th><th>Wynik</th></tr>' + recent.map(function (l) {
    var x = ALL[l.id]; if (!x) return ''; var k = D.skills[x.skill];
    return '<tr><td>' + fmtDate(l.at) + '</td><td>' + k.emoji + ' ' + k.pl + '</td><td><b>' + esc(x.act.title) + '</b><br><small class="pl">' + esc(x.act.pl || '') + '</small></td><td>' + starsHtml(l.stars) + ' <small class="pl">' + Math.round(l.score * 100) + '%</small></td></tr>';
  }).join('') + '</table></div>' : '<p class="pl">Jeszcze nic – zachęć dziecko do pierwszego ćwiczenia! Darmowe ćwiczenia są oznaczone „Za darmo”.</p>') + '</div>';
  var texts = Object.keys(P.texts);
  if (texts.length) h += '<div class="card" style="margin-top:16px"><h3 style="font-size:22px;margin-bottom:10px">✍️ Teksty dziecka</h3>' + texts.map(function (id) { var x = ALL[id]; return x ? '<details style="margin-bottom:8px"><summary><b>' + esc(x.act.title) + '</b> <small class="pl">' + fmtDate(P.texts[id].at) + '</small></summary><p style="white-space:pre-wrap;background:#faf9f5;border-radius:12px;padding:12px">' + esc(P.texts[id].text) + '</p></details>' : ''; }).join('') + '</div>';
  h += '<div class="card noprint" style="margin-top:16px"><h3 style="font-size:22px;margin-bottom:10px">Jak pomagać w domu · How to help</h3><div class="grid g2">' + SKILLS.map(function (s) { var k = D.skills[s]; return '<div><b>' + k.emoji + ' ' + k.pl + '</b><ul style="padding-left:18px;margin:6px 0">' + D.parentTips[s].map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul></div>'; }).join('') + '</div></div>';
  h += '<div class="row noprint" style="margin-top:16px"><button class="btn" id="printRep">🖨️ Drukuj raport</button><button class="btn light" id="editName">✏️ Zmień imię dziecka</button><a class="btn ghost" href="#plans">💳 Dostęp i ceny</a></div>';
  h += '<p class="pl" style="margin-top:16px">🔒 Postępy zapisują się na tym urządzeniu. Nie zbieramy danych osobowych dziecka – w klasie nauczyciel widzi tylko imię i wyniki.</p>';
  var v = $('#v-parent'); v.innerHTML = h;
  $$('[data-goal]', v).forEach(function (b) { b.onclick = function () { P.goal = +b.getAttribute('data-goal'); save(); viewParent(); }; });
  $('#printRep').onclick = function () { v.classList.add('printme'); window.print(); setTimeout(function () { v.classList.remove('printme'); }, 500); };
  $('#editName').onclick = askName;
  var cb = $('[data-code]', v); if (cb) cb.onclick = codeModal;
}
function accessLine() {
  if (A.kind === 'preview') return '👀 Podgląd – wszystko odblokowane.';
  if (A.kind === 'admin') return '🔐 Konto administratora – pełny dostęp.';
  if (A.kind === 'client') return '✅ Pełny dostęp (kod klienta WordBloom).';
  if (A.kind === 'pupil') return '🏫 Konto klasowe: <b>' + esc(A.className || '') + '</b>' + (A.teacher ? ' · nauczyciel: ' + esc(A.teacher) : '') + '. Dostęp zapewnia szkoła' + (A.expires ? ' do ' + fmtDate(A.expires) : '') + '.';
  if (A.full && A.expires) { var d = daysLeft(A.expires); return '✅ Pełny dostęp do <b>' + fmtDate(A.expires) + '</b> (' + d + ' dni). ' + (d < 10 ? '<a class="btn sm" href="#plans">Przedłuż</a>' : '') + ' Bez automatycznego odnawiania.'; }
  if (A.kind === 'expired') return '⏳ Dostęp wygasł ' + fmtDate(A.expires) + '. <a class="btn sm" href="#plans">Przedłuż</a>';
  return '🆓 Wersja darmowa: 1 ćwiczenie w każdej umiejętności. <a class="btn sm" href="#plans">Odblokuj wszystko</a> <button class="btn sm light" data-code>🔑 Mam kod</button>';
}

/* ---------- teacher ---------- */
function viewTeacher() {
  var v = $('#v-teacher');
  if (A.kind !== 'teacher') {
    var h = '<div class="eyebrow">👩‍🏫 Dla nauczyciela · For teachers</div><h1 style="font-size:36px;margin:6px 0 8px">Cała klasa w Skills Studio</h1><p style="max-width:640px">Kup plan klasowy, a dostaniesz <b>kod klasy</b>. Udostępnij go uczniom (np. w Librusie) – każdy dołącza w 10 sekund, bez e-maili i haseł. Ty widzisz postępy całej klasy i zadajesz ćwiczenia na tydzień.</p><div class="pl">Buy a class plan, share one class code with up to ' + CFG.seats + ' pupils, follow progress and set weekly tasks.</div>';
    h += '<div class="grid g3" style="margin-top:18px"><div class="card"><div style="font-size:34px">🔑</div><h3 style="font-size:21px;margin:6px 0">1. Kod klasy</h3><p class="pl">Po płatności od razu dostajesz kod nauczyciela i kod klasy.</p></div><div class="card"><div style="font-size:34px">📲</div><h3 style="font-size:21px;margin:6px 0">2. Uczniowie dołączają</h3><p class="pl">Wpisują kod klasy i imię – dostają własny kod do domu.</p></div><div class="card"><div style="font-size:34px">📊</div><h3 style="font-size:21px;margin:6px 0">3. Postępy i zadania</h3><p class="pl">Tabela wyników klasy, zadania tygodniowe, raport dla rodziców.</p></div></div>';
    h += '<div class="row" style="margin-top:18px"><a class="btn big" href="#plans?teacher">Zobacz plany klasowe</a><button class="btn big light" data-code>🔑 Mam kod nauczyciela</button></div>';
    h += '<div class="card" style="margin-top:18px"><h3 style="font-size:22px">Szkoła płaci fakturą?</h3><p class="pl" style="margin:6px 0 0">Napisz na <a href="mailto:' + CFG.contact + '?subject=WordBloom%20Skills%20Studio%20–%20faktura">' + CFG.contact + '</a> – wystawię fakturę i przygotuję kody ręcznie.</p></div>';
    if (A.kind === 'admin' || A.kind === 'preview') h += adminIssueHtml();
    v.innerHTML = h; bindTodos(v); bindAdmin(v); return;
  }
  var share = 'Dzień dobry! Zapraszam do ćwiczeń z angielskiego w WordBloom Skills Studio.\n1) Wejdź na: https://wordbloom.ca/skills.html\n2) Kliknij „Mam kod” i wpisz kod klasy: ' + A.classCode + '\n3) Wpisz imię i pierwszą literę nazwiska.\nUczeń dostanie własny kod – warto go zapisać.\n\nHello! Join our English practice at https://wordbloom.ca/skills.html – click "I have a code" and type the class code ' + A.classCode + '.';
  var h = '<div class="eyebrow">👩‍🏫 Panel nauczyciela · Teacher dashboard</div><h1 style="font-size:36px;margin:6px 0 4px">' + esc(A.className || 'Moja klasa') + '</h1><p class="pl">Dostęp do ' + fmtDate(A.expires) + ' (' + daysLeft(A.expires) + ' dni) · ' + (A.used || 0) + '/' + (A.seats || CFG.seats) + ' uczniów</p>';
  h += '<div class="grid g2" style="margin-top:14px;align-items:start"><div class="card"><b>Kod klasy · Class code</b><div class="codebox">' + esc(A.classCode) + '</div><div class="row"><button class="btn" id="cpCode">📋 Kopiuj kod</button><button class="btn light" id="cpMsg">✉️ Kopiuj wiadomość dla rodziców</button></div><p class="pl" style="margin-top:10px">Wklej wiadomość do Librusa, Teams lub e-maila. Uczniowie nie potrzebują e-maili ani haseł.</p></div>' +
    '<div class="card"><b>Zadanie na ten tydzień · Weekly task</b><p class="pl" style="margin:4px 0 10px">Zaznacz ćwiczenia – uczniowie zobaczą je na górze strony startowej.</p><select class="field" id="asBand">' + Object.keys(D.bands).map(function (k) { return '<option value="' + k + '"' + (k === P.band ? ' selected' : '') + '>' + D.bands[k].emoji + ' ' + D.bands[k].name + ' · ' + D.bands[k].level + '</option>'; }).join('') + '</select><div id="asList" class="grid" style="gap:6px;margin:10px 0;max-height:300px;overflow:auto"></div><input class="field" id="asNote" maxlength="140" placeholder="Notatka, np. Na piątek – 3 ćwiczenia" value="' + esc(A.assignment && A.assignment.note || '') + '"><div class="row" style="margin-top:10px"><button class="btn" id="asSave">Zapisz zadanie</button><button class="btn ghost" id="asClear">Wyczyść</button></div></div></div>';
  h += '<div class="card" style="margin-top:16px"><div class="row" style="justify-content:space-between"><h3 style="font-size:22px">Postępy klasy · Class progress</h3><button class="btn sm light" id="repRefresh">↻ Odśwież</button></div><div id="rep" class="tablewrap" style="margin-top:10px"><p class="pl">Ładuję…</p></div></div>';
  h += '<p class="pl" style="margin-top:14px">Sam/a też możesz robić ćwiczenia – jako nauczyciel masz pełny dostęp.</p>';
  v.innerHTML = h;
  $('#cpCode').onclick = function () { copy(A.classCode); };
  $('#cpMsg').onclick = function () { copy(share); };
  var drawList = function () {
    var band = $('#asBand').value, sel = (A.assignment && A.assignment.ids) || [];
    $('#asList').innerHTML = SKILLS.map(function (s) { return D.activities[band][s].map(function (a) { return '<label class="pick"><input type="checkbox" value="' + a.id + '"' + (sel.indexOf(a.id) > -1 ? ' checked' : '') + '> ' + D.skills[s].emoji + ' ' + esc(a.title) + ' <small class="pl">· ' + D.types[a.type][1] + '</small></label>'; }).join(''); }).join('');
  };
  $('#asBand').onchange = drawList; drawList();
  var saveAs = function (ids, note) {
    var asg = ids.length ? { ids: ids, note: note, set_at: new Date().toISOString() } : null;
    rpc('wb_class_set_assignment', { p_code: A.code, p_assignment: asg }).then(function (r) { if (r && r.ok) { A.assignment = asg; toast(ids.length ? 'Zadanie zapisane ✅' : 'Zadanie usunięte'); } else toast('Nie udało się zapisać.'); }).catch(function () { toast('Błąd połączenia.'); });
  };
  $('#asSave').onclick = function () { var ids = $$('#asList input:checked').map(function (i) { return i.value; }); if (!ids.length) return toast('Zaznacz co najmniej jedno ćwiczenie.'); saveAs(ids, $('#asNote').value.trim()); };
  $('#asClear').onclick = function () { $$('#asList input').forEach(function (i) { i.checked = false; }); $('#asNote').value = ''; saveAs([], ''); };
  $('#repRefresh').onclick = loadReport; loadReport();
}
function loadReport() {
  var box = $('#rep'); if (!box) return;
  rpc('wb_class_report', { p_code: A.code }).then(function (r) {
    if (!r || !r.ok) { box.innerHTML = '<p class="pl">Nie udało się pobrać wyników.</p>'; return; }
    A.used = (r.pupils || []).length;
    if (!A.used) { box.innerHTML = '<p>Jeszcze nikt nie dołączył. Udostępnij uczniom kod klasy <b>' + esc(A.classCode) + '</b>.</p>'; return; }
    box.innerHTML = '<table class="rep"><tr><th>Uczeń</th><th>Kod</th><th>Ćw.</th><th>⭐</th>' + SKILLS.map(function (s) { return '<th>' + D.skills[s].emoji + '</th>'; }).join('') + '<th>Ostatnio</th><th></th></tr>' + r.pupils.map(function (p) {
      var g = p.progress || {}, sk = g.skills || {};
      return '<tr><td><b>' + esc(p.name) + '</b></td><td><code>' + esc(p.code) + '</code></td><td>' + (g.total || 0) + '</td><td>' + (g.stars || 0) + '</td>' + SKILLS.map(function (s) { var x = sk[s] || {}; return '<td title="' + D.skills[s].pl + ': ' + (x.done || 0) + ' ćw., śr. ' + (x.avg == null ? '–' : x.avg + '%') + '"><span class="mini"><i style="width:' + Math.min(100, (x.done || 0) * 20) + '%;background:' + D.skills[s].color + '"></i></span></td>'; }).join('') + '<td>' + (g.last ? fmtDate(g.last) : '–') + '</td><td><button class="btn sm ghost" data-rm="' + esc(p.code) + '" title="Usuń ucznia">✕</button></td></tr>';
    }).join('') + '</table>';
    $$('[data-rm]', box).forEach(function (b) { b.onclick = function () { if (!confirm('Usunąć tego ucznia z klasy? Jego kod przestanie działać.')) return; rpc('wb_class_remove_pupil', { p_code: A.code, p_pupil_code: b.getAttribute('data-rm') }).then(function () { loadReport(); }); }; });
  }).catch(function () { box.innerHTML = '<p class="pl">Błąd połączenia – spróbuj odświeżyć.</p>'; });
}
function adminIssueHtml() {
  return '<div class="card" style="margin-top:18px;border:2px solid var(--brandsoft)"><h3 style="font-size:22px">🔐 Admin: wystaw kod ręcznie</h3><p class="pl">Dla faktur, przelewów lub prezentów. Widoczne tylko dla Ciebie.</p><form id="admF" class="grid g2" style="margin-top:10px"><select class="field" id="admPlan">' + Object.keys(CFG.plans).map(function (k) { var p = CFG.plans[k]; return '<option value="' + k + '">' + (p.kind === 'teacher' ? 'Klasa' : 'Uczeń') + ' · ' + p.months + ' mies.</option>'; }).join('') + '</select><input class="field" id="admName" placeholder="Imię / nazwa klasy" maxlength="80"><input class="field" id="admEmail" placeholder="E-mail (opcjonalnie)" maxlength="120"><button class="btn">Utwórz kod</button></form><div class="msg" id="admMsg"></div></div>';
}
function bindAdmin(v) {
  var f = $('#admF', v); if (!f) return;
  f.onsubmit = function (e) {
    e.preventDefault(); var m = $('#admMsg'); var p = CFG.plans[$('#admPlan').value];
    rpc('wb_plan_admin_create', { p_token: ls('wbAdminToken') || '', p_kind: p.kind, p_months: p.months, p_name: $('#admName').value.trim(), p_email: $('#admEmail').value.trim() }).then(function (r) {
      if (!r || !r.ok) { m.className = 'msg err'; m.textContent = 'Nie udało się (zaloguj się jako admin na wordbloom.ca).'; return; }
      m.className = 'msg ok'; m.innerHTML = 'Kod: <b>' + esc(r.code) + '</b>' + (r.class_code ? ' · kod klasy: <b>' + esc(r.class_code) + '</b>' : '') + ' · ważny do ' + fmtDate(r.expires_at);
    }).catch(function () { m.className = 'msg err'; m.textContent = 'Błąd – czy uruchomiono supabase_plans.sql?'; });
  };
}

/* ---------- plans ---------- */
function viewPlans() {
  var teacher = /teacher/.test(location.hash) || viewPlans.t === 'teacher';
  var kind = teacher ? 'teacher' : 'student';
  var h = '<div style="text-align:center;max-width:680px;margin:0 auto"><div class="eyebrow">Dostęp i ceny · Plans</div><h1 style="font-size:40px;margin:6px 0 8px">Wybierz swój plan</h1><p>Wszystkie ćwiczenia: czytanie, słuchanie, mówienie i pisanie dla klas 1–8. <b>Płatność jednorazowa – bez automatycznego odnawiania.</b></p><div class="pl">One-off payment, no auto-renewal. Access starts right after payment.</div>' +
    '<div class="seg" style="margin-top:16px"><button data-k="student" class="' + (kind === 'student' ? 'on' : '') + '">🎓 Uczeń / Rodzic</button><button data-k="teacher" class="' + (kind === 'teacher' ? 'on' : '') + '">👩‍🏫 Nauczyciel / Klasa</button></div></div>';
  h += '<div class="grid g3" style="margin-top:28px">' + Object.keys(CFG.plans).filter(function (k) { return CFG.plans[k].kind === kind; }).map(function (k) {
    var p = CFG.plans[k], per = (p.price / p.months).toFixed(2).replace('.', ','), save = p.months > 1 ? Math.round((1 - p.price / (CFG.plans[kind === 'teacher' ? 'klasa-1m' : 'uczen-1m'].price * p.months)) * 100) : 0;
    var feats = kind === 'teacher'
      ? ['Do ' + CFG.seats + ' uczniów z jednym kodem klasy', 'Tabela postępów całej klasy', 'Zadania tygodniowe dla uczniów', 'Wiadomość dla rodziców gotowa do wklejenia', 'Ty też masz pełny dostęp']
      : ['60 ćwiczeń · 4 umiejętności · 3 poziomy', 'Ćwiczenia mówienia z rozpoznawaniem mowy', 'Kącik rodzica z raportem do druku', 'Działa na telefonie, tablecie i komputerze', 'Gwiazdki, ogród i seria dni motywują do nauki'];
    return '<div class="plan' + (p.best ? ' best' : '') + '">' + (p.best ? '<span class="flag">Najczęściej wybierany</span>' : '') + '<b style="font-size:18px">' + p.months + ' ' + (p.months === 1 ? 'miesiąc' : p.months < 5 ? 'miesiące' : 'miesięcy') + '</b><div class="price">' + p.price + ' zł</div><small class="pl">' + per + ' zł / mies.' + (save > 0 ? ' · oszczędzasz ' + save + '%' : '') + '</small><ul>' + feats.map(function (f) { return '<li>' + f + '</li>'; }).join('') + '</ul><button class="btn' + (p.best ? '' : ' light') + ' big" data-buy="' + k + '">Kupuję · Buy</button></div>';
  }).join('') + '</div>';
  h += '<div class="row" style="justify-content:center;margin-top:18px"><button class="btn ghost" data-code>🔑 Mam już kod · I have a code</button></div>';
  h += '<div class="grid g2" style="margin-top:30px;align-items:start"><div class="card"><h3 style="font-size:24px;margin-bottom:12px">Jak to działa?</h3><div class="steps3">' + (kind === 'teacher'
    ? '<div><span><b>Płacisz kartą, BLIK-iem lub przelewem.</b><br><span class="pl">Faktura? Napisz – przygotuję kody ręcznie.</span></span></div><div><span><b>Dostajesz kod nauczyciela i kod klasy.</b><br><span class="pl">Wpisz kod nauczyciela w „Mam kod”.</span></span></div><div><span><b>Udostępniasz kod klasy uczniom.</b><br><span class="pl">Każdy uczeń dostaje własny kod do domu – rodzice widzą postępy.</span></span></div>'
    : '<div><span><b>Płacisz online (karta, BLIK).</b><br><span class="pl">Bezpieczna płatność przez Stripe.</span></span></div><div><span><b>Od razu dostajesz osobisty kod.</b><br><span class="pl">Pojawi się na ekranie – zapisz go lub zrób zdjęcie.</span></span></div><div><span><b>Wpisujesz kod i uczysz się.</b><br><span class="pl">Na dowolnym urządzeniu – kod działa wszędzie.</span></span></div>') + '</div></div>' +
    '<div class="faq"><details><summary>Czy subskrypcja odnowi się sama?</summary><p class="pl">Nie. Płacisz raz za wybrany okres. Na 10 dni przed końcem zobaczysz w aplikacji przycisk „Przedłuż” – decyzja należy do Ciebie.</p></details><details><summary>Czy mogę wypróbować przed zakupem?</summary><p class="pl">Tak – pierwsze ćwiczenie w każdej umiejętności jest darmowe, na każdym poziomie.</p></details><details><summary>Czy dziecko może korzystać na kilku urządzeniach?</summary><p class="pl">Tak. Wystarczy wpisać ten sam kod. Postępy zapisują się na urządzeniu, a w planie klasowym także u nauczyciela.</p></details><details><summary>Czy mój kod mogę dać rodzeństwu?</summary><p class="pl">Plan ucznia jest dla jednej osoby. Dla kilkorga dzieci lub grupy korepetycyjnej wybierz plan klasowy.</p></details><details><summary>Jakie dane zbieracie?</summary><p class="pl">Tylko imię dziecka (w klasie) i wyniki ćwiczeń. Nagrania głosu nie opuszczają urządzenia.</p></details><details><summary>Mam pytanie</summary><p class="pl">Napisz: <a href="mailto:' + CFG.contact + '">' + CFG.contact + '</a></p></details></div></div>';
  var v = $('#v-plans'); v.innerHTML = h;
  $$('[data-k]', v).forEach(function (b) { b.onclick = function () { viewPlans.t = b.getAttribute('data-k'); if (location.hash !== '#plans') location.hash = '#plans'; else viewPlans(); }; });
  $$('[data-buy]', v).forEach(function (b) { b.onclick = function () { buy(b.getAttribute('data-buy')); }; });
  bindTodos(v);
}
function buy(k) {
  var link = CFG.payLinks[k], p = CFG.plans[k];
  if (link) { location.href = link + (link.indexOf('?') > -1 ? '&' : '?') + 'locale=pl'; return; }
  openModal('<h2>Prawie gotowe 🌱</h2><p>Płatności online dla tego planu uruchamiamy w tych dniach. Napisz – wyślę link do płatności lub fakturę i kod od razu po wpłacie.</p><a class="btn big" style="width:100%" href="mailto:' + CFG.contact + '?subject=' + encodeURIComponent('WordBloom Skills Studio – ' + (p.kind === 'teacher' ? 'plan klasowy' : 'plan ucznia') + ' ' + p.months + ' mies. (' + p.price + ' zł)') + '">✉️ Napisz do Natalii</a>');
}

/* ---------- modals ---------- */
function openModal(html) { $('#mbox').innerHTML = '<button class="x" type="button" aria-label="Zamknij">✕</button>' + html; $('#modal').classList.add('on'); $('#mbox .x').onclick = closeModal; }
function closeModal() { $('#modal').classList.remove('on'); }
$('#modal').addEventListener('click', function (e) { if (e.target.id === 'modal') closeModal(); });
function codeModal() {
  openModal('<h2>Wpisz kod 🔑</h2><p class="pl">Kod ucznia, kod klasy od nauczyciela lub kod nauczyciela. · Your student code, class code or teacher code.</p><form id="cdF"><input class="field" id="cd" autocomplete="off" autocapitalize="characters" placeholder="np. WB-7K2P-9QXM" style="text-align:center;font-size:20px;letter-spacing:.06em"><button class="btn big" style="width:100%;margin-top:12px">Odblokuj · Unlock</button></form><div class="msg" id="cdMsg"></div><p class="pl" style="margin-top:12px">Nie masz kodu? <a href="#plans" id="toPlans">Zobacz plany</a></p>');
  $('#cd').focus(); $('#toPlans').onclick = closeModal;
  $('#cdF').onsubmit = function (e) { e.preventDefault(); redeem($('#cd').value, $('#cdMsg')); };
}
function accountModal() {
  if (!A.full && A.kind !== 'expired') return codeModal();
  var code = ls('wbPlanCode') || ls('wbClientCode') || '';
  openModal('<h2>' + (A.kind === 'teacher' ? '👩‍🏫 ' : '🌸 ') + esc(P.name || A.name || 'Moje konto') + '</h2><p>' + accessLine() + '</p>' + (code ? '<p class="pl">Twój kod (zapisz go):</p><div class="codebox" style="font-size:22px">' + esc(code) + '</div>' : '') +
    '<div class="row"><button class="btn light" id="chName">✏️ Zmień imię</button><button class="btn light" id="chCode">🔑 Inny kod</button><button class="btn ghost" id="logout">Wyloguj na tym urządzeniu</button></div>');
  $('#chName').onclick = askName; $('#chCode').onclick = codeModal;
  $('#logout').onclick = function () { if (!confirm('Wylogować? Postępy zostaną na tym urządzeniu.')) return; ['wbPlanCode', 'wbPlanCache', 'wbClientCode', 'wbClientName', 'wbClientOkAt'].forEach(function (k) { ls(k, null); }); A = { full: false, kind: 'free' }; closeModal(); refresh(); };
}
$('#whoBtn').onclick = accountModal;
$('#voiceBtn').onclick = voiceModal;
$('#bandChip').onclick = function () {
  openModal('<h2>Wybierz poziom</h2><p class="pl">Choose your level</p><div class="grid" style="margin-top:12px">' + Object.keys(D.bands).map(function (k) { var b = D.bands[k]; return '<button class="band' + (k === P.band ? ' on' : '') + '" data-b="' + k + '" style="width:100%"><b>' + b.emoji + ' ' + b.name + '</b><small>' + b.en + ' · ' + b.level + '</small></button>'; }).join('') + '</div>');
  $$('[data-b]', $('#mbox')).forEach(function (b) { b.onclick = function () { P.band = b.getAttribute('data-b'); save(); closeModal(); refresh(); }; });
};

/* ====================== activity player ====================== */
var CTX = null;
function openAct(id) {
  var x = ALL[id]; if (!x) return;
  if (!canOpen(id)) {
    openModal('<h2>To ćwiczenie jest w pełnej wersji 🔒</h2><p>Odblokuj wszystkie 60 ćwiczeń: czytanie, słuchanie, mówienie i pisanie – od 19 zł miesięcznie, bez automatycznego odnawiania.</p><div class="pl">Unlock all activities from 19 zł a month.</div><div class="grid" style="margin-top:16px"><a class="btn big" href="#plans" id="lp">Zobacz plany</a><button class="btn big light" id="lc">🔑 Mam kod</button></div>');
    $('#lp').onclick = closeModal; $('#lc').onclick = codeModal; return;
  }
  var a = x.act, k = D.skills[x.skill], t = D.types[a.type];
  CTX = { id: id, act: a, skill: x.skill, start: Date.now(), right: 0, n: 0 };
  $('#pTitle').textContent = k.emoji + ' ' + a.title;
  $('#pSub').textContent = t[1] + ' · ' + t[0];
  $('#pBar').style.background = k.color; setBar(0);
  $('#player').classList.add('on'); document.body.style.overflow = 'hidden';
  var body = $('#pBody'); body.innerHTML = '';
  R[a.type](a, body);
}
function closePlayer() { stopSpeak(); speakLines.stop = true; try { recognise.current && recognise.current.abort(); } catch (e) {} $('#player').classList.remove('on'); document.body.style.overflow = ''; CTX = null; refresh(); }
$('#pClose').onclick = closePlayer;
document.addEventListener('keydown', function (e) {
  if (!$('#player').classList.contains('on')) { if (e.key === 'Escape') closeModal(); return; }
  if (e.key === 'Escape') closePlayer();
  if (e.key === 'Enter' && !/TEXTAREA|INPUT/.test(document.activeElement.tagName)) { var n = $('#pBody [data-next]'); if (n) { e.preventDefault(); n.click(); } }
});
function setBar(f) { $('#pBar').style.width = Math.round(f * 100) + '%'; }
function instr(en, pl, ic) { return '<div class="instr"><span class="ic">' + (ic || '💡') + '</span><div><b>' + (pl || en) + '</b>' + (pl ? '<div class="pl" lang="en">' + en + '</div>' : '') + '</div></div>'; }
function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d; }
function praise(ok) { var g = ['Brawo! Great job! 🎉', 'Super! Well done! ⭐', 'Świetnie! Excellent! 🌟', 'Tak jest! That\'s right! ✅'], b = ['Prawie! Not quite. 💪', 'Spróbuj jeszcze! Keep going! 🌱']; var l = ok ? g : b; return l[Math.floor(Math.random() * l.length)]; }
function nextBtn(label) { return '<div class="pfoot"><button class="btn big" data-next type="button">' + (label || 'Dalej · Next →') + '</button></div>'; }

/* generic stepper: render(i, host, done(correct)) */
function stepper(n, top, render) {
  var i = 0, body = $('#pBody');
  CTX.n = n;
  function go() {
    setBar(i / n);
    if (i >= n) return finish(CTX.right / n);
    body.innerHTML = ''; if (top) body.appendChild(top);
    var host = el(''); body.appendChild(host);
    host.appendChild(el('<div class="pl" style="font-weight:800;margin-bottom:6px">' + (i + 1) + ' / ' + n + '</div>'));
    render(i, host, function (ok, extra) {
      if (ok) CTX.right += ok === true ? 1 : ok;
      var fb = el('<div class="feedback on ' + (ok === true || ok >= .8 ? 'good' : 'bad') + '">' + praise(ok === true || ok >= .8) + (extra ? '<div style="font-weight:600;margin-top:4px">' + extra + '</div>' : '') + '</div>');
      host.appendChild(fb); host.appendChild(el(nextBtn(i + 1 >= n ? 'Zakończ · Finish ✓' : null)));
      var nb = $('[data-next]', host); nb.onclick = function () { stopSpeak(); i++; go(); }; nb.focus({ preventScroll: true }); fb.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  }
  go();
}
function mcq(host, q, opts, ans, done, cls) {
  host.appendChild(el('<div class="q">' + esc(q) + '</div>'));
  var box = el(''); box.className = cls || 'opts'; host.appendChild(box);
  opts.forEach(function (o, k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'opt';
    b.innerHTML = cls && cls.indexOf('emojis') > -1 ? esc(o) : '<span class="k">' + 'ABCD'[k] + '</span>' + esc(o);
    b.onclick = function () {
      $$('.opt', box).forEach(function (x) { x.disabled = true; });
      var ok = k === ans; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) box.children[ans].classList.add('right');
      done(ok, ok ? '' : 'Poprawna odpowiedź · Answer: <b>' + esc(opts[ans]) + '</b>');
    };
    box.appendChild(b);
  });
}
function glossText(paras, gloss) {
  var keys = Object.keys(gloss || {}).sort(function (a, b) { return b.length - a.length; });
  return paras.map(function (p) {
    var s = esc(p);
    if (keys.length) {
      var re = new RegExp('\\b(' + keys.map(function (k) { return esc(k).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\b', 'gi');
      s = s.replace(re, function (m) { var pl = gloss[m.toLowerCase()] || gloss[m]; return pl ? '<button type="button" class="gw" data-pl="' + esc(pl) + '">' + m + '</button>' : m; });
    }
    return '<p>' + s + '</p>';
  }).join('');
}
function bindGloss(root) { $$('.gw', root).forEach(function (g) { g.onclick = function () { var on = g.classList.contains('show'); $$('.gw.show').forEach(function (x) { x.classList.remove('show'); }); if (!on) { g.classList.add('show'); speak(g.textContent, { rate: .85 }); } }; }); }

/* ---------- order (shared by reading order + listening order) ---------- */
function orderBoard(items, host, onDone) {
  var pool = shuffleNot(items.map(function (t, i) { return i; })), ans = [];
  var wrap = el('<div class="pl" style="font-weight:800;margin-bottom:6px">Dotknij w dobrej kolejności · Tap in the right order</div><div class="seq" id="sAns" style="margin-bottom:14px"></div><div class="seq" id="sPool"></div>' + '<div class="pfoot"><button class="btn ghost" type="button" id="sReset">↺ Od nowa</button><button class="btn big" type="button" id="sCheck" disabled>Sprawdź · Check</button></div>');
  host.appendChild(wrap);
  function draw() {
    $('#sAns', wrap).innerHTML = ans.map(function (i, k) { return '<button class="seqi" type="button" data-a="' + k + '"><span class="n">' + (k + 1) + '</span>' + esc(items[i]) + '</button>'; }).join('') || '<div class="pl" style="padding:10px;border:2px dashed var(--line);border-radius:14px;text-align:center">Tutaj pojawi się Twoja kolejność</div>';
    $('#sPool', wrap).innerHTML = pool.map(function (i) { return '<button class="seqi" type="button" data-p="' + i + '"><span class="n" style="background:#c9cfe0">?</span>' + esc(items[i]) + '</button>'; }).join('');
    $$('[data-p]', wrap).forEach(function (b) { b.onclick = function () { var i = +b.getAttribute('data-p'); pool.splice(pool.indexOf(i), 1); ans.push(i); draw(); }; });
    $$('[data-a]', wrap).forEach(function (b) { b.onclick = function () { var k = +b.getAttribute('data-a'); pool.push(ans.splice(k, 1)[0]); draw(); }; });
    $('#sCheck', wrap).disabled = pool.length > 0;
  }
  draw();
  $('#sReset', wrap).onclick = function () { pool = shuffleNot(items.map(function (t, i) { return i; })); ans = []; draw(); };
  $('#sCheck', wrap).onclick = function () {
    var right = 0; $$('[data-a]', wrap).forEach(function (b, k) { var ok = ans[k] === k; if (ok) right++; b.classList.add(ok ? 'right' : 'wrong'); b.disabled = true; });
    $('#sReset', wrap).remove(); this.remove();
    var f = right / items.length;
    host.appendChild(el('<div class="feedback on ' + (f === 1 ? 'good' : 'bad') + '">' + (f === 1 ? praise(true) : 'Dobrze: ' + right + ' z ' + items.length + '. Poprawna kolejność:<ol style="margin:6px 0 0">' + items.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ol>') + '</div>'));
    host.appendChild(el(nextBtn('Zakończ · Finish ✓'))); $('[data-next]', host).onclick = function () { onDone(f); };
  };
}

/* ====================== RENDERERS ====================== */
var R = {};

/* ---------- READING ---------- */
R.story = function (a, body) {
  var top = el(instr('Read the text. Tap the underlined words to see them in Polish.', 'Przeczytaj tekst. Dotknij podkreślonych słów, aby zobaczyć tłumaczenie.', '📖') + '<div class="passage">' + glossText(a.text, a.gloss) + '</div>');
  bindGloss(top);
  stepper(a.q.length, top, function (i, host, done) { mcq(host, a.q[i][0], a.q[i][1], a.q[i][2], done); });
};
R.tf = function (a, body) {
  var top = el(instr('Read the text. Is each sentence true or false?', 'Przeczytaj tekst. Czy zdanie jest prawdziwe, czy fałszywe?', '🔍') + '<div class="passage">' + glossText([a.text], a.gloss) + '</div>');
  stepper(a.items.length, top, function (i, host, done) { tfStep(host, a.items[i][0], a.items[i][1], done); });
};
function tfStep(host, s, val, done) {
  host.appendChild(el('<div class="q">' + esc(s) + '</div>'));
  var box = el('<div class="tfbtns"><button class="opt" type="button" data-v="1">✅ True · Prawda</button><button class="opt" type="button" data-v="0">❌ False · Fałsz</button></div>').firstChild;
  host.appendChild(box);
  $$('.opt', box).forEach(function (b) { b.onclick = function () { $$('.opt', box).forEach(function (x) { x.disabled = true; }); var ok = (b.getAttribute('data-v') === '1') === val; b.classList.add(ok ? 'right' : 'wrong'); if (!ok) $('[data-v="' + (val ? 1 : 0) + '"]', box).classList.add('right'); done(ok, ok ? '' : 'To zdanie jest ' + (val ? '<b>prawdziwe</b> (true).' : '<b>fałszywe</b> (false).')); }; });
}
R.order = function (a, body) {
  CTX.n = 1; body.appendChild(el(instr(a.intro.split(' / ')[0], a.intro.split(' / ')[1] || 'Ułóż po kolei.', '🔢')));
  orderBoard(a.items, body, function (f) { finish(f); });
};
R.match = function (a, body) {
  body.appendChild(el(instr('Tap one card on the left, then its pair on the right.', 'Dotknij karty po lewej, a potem pasującej po prawej.', '🧩')));
  var left = shuffle(a.pairs.map(function (p, i) { return i; })), right = shuffle(left), sel = null, found = 0, miss = 0;
  var b = el('<div class="cols"><div class="opts" id="mL"></div><div class="opts" id="mR"></div></div>'); body.appendChild(b);
  left.forEach(function (i) { var x = document.createElement('button'); x.type = 'button'; x.className = 'opt'; x.style.justifyContent = 'center'; x.style.fontSize = /^\p{Extended_Pictographic}/u.test(a.pairs[i][0]) && a.pairs[i][0].length < 4 ? '34px' : '16px'; x.textContent = a.pairs[i][0]; x.dataset.i = i; $('#mL', b).appendChild(x); });
  right.forEach(function (i) { var x = document.createElement('button'); x.type = 'button'; x.className = 'opt'; x.textContent = a.pairs[i][1]; x.dataset.i = i; $('#mR', b).appendChild(x); });
  $$('#mL .opt', b).forEach(function (x) { x.onclick = function () { if (x.classList.contains('done')) return; $$('#mL .opt', b).forEach(function (y) { y.classList.remove('sel'); }); x.classList.add('sel'); sel = x; }; });
  $$('#mR .opt', b).forEach(function (x) { x.onclick = function () {
    if (x.classList.contains('done')) return;
    if (!sel) { toast('Najpierw wybierz kartę po lewej · Pick a left card first'); return; }
    if (sel.dataset.i === x.dataset.i) { sel.classList.remove('sel'); sel.classList.add('done'); x.classList.add('done'); sel.disabled = x.disabled = true; speak(x.textContent, { rate: .9 }); sel = null; found++; setBar(found / a.pairs.length);
      if (found === a.pairs.length) { var f = a.pairs.length / (a.pairs.length + miss); body.appendChild(el('<div class="feedback on good">' + praise(true) + (miss ? ' (pomyłki: ' + miss + ')' : ' Bez pomyłek!') + '</div>' + nextBtn('Zakończ · Finish ✓'))); $('[data-next]', body).onclick = function () { finish(f); }; }
    } else { miss++; x.classList.add('shake', 'wrong'); setTimeout(function () { x.classList.remove('shake', 'wrong'); }, 400); }
  }; });
};
R.gap = function (a, body) {
  body.appendChild(el(instr('Tap a gap, then tap a word from the box.', 'Dotknij luki, a potem słowa z ramki.', '✏️')));
  var answers = [], html = esc(a.text).replace(/\[([^\]]+)\]/g, function (m, w) { answers.push(w); return '<button type="button" class="gap" data-g="' + (answers.length - 1) + '">&nbsp;</button>'; });
  var g = el('<div class="gaptext">' + html + '</div><div class="tiles" id="bank" style="margin-top:14px"></div><div class="pfoot"><button class="btn big" id="gCheck" type="button" disabled>Sprawdź · Check</button></div>'); body.appendChild(g);
  var fill = answers.map(function () { return null; }), cur = 0, bank = shuffle(answers.concat(a.extra || []));
  function draw() {
    $$('.gap', g).forEach(function (x, i) { x.innerHTML = fill[i] == null ? '&nbsp;' : esc(bank[fill[i]]); x.classList.toggle('act', i === cur); });
    $('#bank', g).innerHTML = bank.map(function (w, i) { return '<button type="button" class="tile' + (fill.indexOf(i) > -1 ? ' used' : '') + '" data-w="' + i + '">' + esc(w) + '</button>'; }).join('');
    $$('[data-w]', g).forEach(function (t) { t.onclick = function () { if (cur == null || t.classList.contains('used')) return; fill[cur] = +t.getAttribute('data-w'); var nx = fill.indexOf(null); cur = nx === -1 ? null : nx; draw(); }; });
    $('#gCheck', g).disabled = fill.indexOf(null) > -1;
  }
  $$('.gap', g).forEach(function (x, i) { x.onclick = function () { if (fill[i] != null) fill[i] = null; cur = i; draw(); }; });
  draw();
  $('#gCheck', g).onclick = function () {
    var right = 0; $$('.gap', g).forEach(function (x, i) { var ok = bank[fill[i]] === answers[i]; if (ok) right++; else x.innerHTML = '<s>' + esc(bank[fill[i]]) + '</s> ' + esc(answers[i]); x.classList.add(ok ? 'right' : 'wrong'); x.disabled = true; });
    this.remove(); $('#bank', g).remove();
    body.appendChild(el('<div class="feedback on ' + (right === answers.length ? 'good' : 'bad') + '">' + (right === answers.length ? praise(true) : 'Dobrze: ' + right + ' z ' + answers.length + '. Sprawdź poprawki powyżej.') + '</div>' + nextBtn('Zakończ · Finish ✓')));
    $('[data-next]', body).onclick = function () { finish(right / answers.length); };
    speak(a.text.replace(/[\[\]]/g, ''), { rate: .9 });
  };
};

/* ---------- LISTENING ---------- */
R.pick = function (a, body) {
  var cur = 0, ab = audioBox(function () { return a.items[cur].say; }, { label: 'Posłuchaj i wybierz · Listen and choose' });
  var top = el(''); top.appendChild(ab);
  var text = a.items.some(function (it) { return it.a.length > 4; });
  stepper(a.items.length, top, function (i, host, done) {
    cur = i; var it = a.items[i], opts = shuffle(it.opts.slice()); ab.autoplay();
    mcq(host, 'Co słyszysz? · What do you hear?', opts, opts.indexOf(it.a), function (ok, ex) { done(ok, (ok ? '' : ex + '<br>') + '🔊 „' + esc(it.say) + '”'); }, 'opts emojis' + (text ? ' text' : ''));
  });
};
R.lmcq = function (a, body) {
  var played = false;
  var top = el(instr('Listen to the conversation. Then answer the questions.', 'Posłuchaj rozmowy, a potem odpowiedz na pytania.', '🎧'));
  top.appendChild(audioBox(function () { return a.script; }, { label: 'Rozmowa · Conversation', onPlayed: function () { played = true; } }));
  var tr = el('<details class="card" style="padding:12px 16px;margin-bottom:16px"><summary><b>📝 Pokaż tekst · Show transcript</b> <small class="pl">(najpierw spróbuj bez!)</small></summary><div style="margin-top:8px">' + a.script.map(function (l) { return '<p style="margin:4px 0"><b>' + esc(l[0]) + ':</b> ' + esc(l[1]) + '</p>'; }).join('') + '</div></details>');
  top.appendChild(tr);
  stepper(a.q.length, top, function (i, host, done) { mcq(host, a.q[i][0], a.q[i][1], a.q[i][2], done); });
};
R.ltf = function (a, body) {
  var top = el(instr('Listen. Are the sentences true or false?', 'Posłuchaj. Czy zdania są prawdziwe, czy fałszywe?', '🎧'));
  top.appendChild(audioBox(function () { return a.script; }));
  top.appendChild(el('<details class="card" style="padding:12px 16px;margin-bottom:16px"><summary><b>📝 Pokaż tekst · Show transcript</b></summary><p>' + esc(a.script) + '</p></details>'));
  stepper(a.items.length, top, function (i, host, done) { tfStep(host, a.items[i][0], a.items[i][1], done); });
};
R.lorder = function (a, body) {
  CTX.n = 1;
  body.appendChild(el(instr('Listen to the story. Put the events in order.', 'Posłuchaj historii i ułóż wydarzenia po kolei.', '🎧')));
  body.appendChild(audioBox(function () { return a.script; }));
  orderBoard(a.items, body, function (f) { finish(f); });
};
R.dict = function (a, body) {
  var cur = 0, ab = audioBox(function () { return a.items[cur]; }, { label: 'Dyktando · Dictation', sub: 'Pisz to, co słyszysz. Wielkie litery i kropki się nie liczą.' });
  var top = el(''); top.appendChild(ab);
  stepper(a.items.length, top, function (i, host, done) {
    cur = i; ab.autoplay();
    var f = el('<form><input class="field" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="Napisz tutaj · Type here" style="font-size:20px"><div class="pfoot"><button class="btn big">Sprawdź · Check</button></div></form>').firstChild;
    host.appendChild(f); var inp = $('input', f); setTimeout(function () { inp.focus(); }, 400);
    f.onsubmit = function (e) {
      e.preventDefault(); if (!inp.value.trim()) return;
      var exp = words(a.items[i]), got = words(inp.value), pool = got.slice(), html = exp.map(function (w) { var k = pool.indexOf(w); if (k > -1) { pool.splice(k, 1); return '<span class="ok">' + esc(w) + '</span>'; } return '<span class="miss">' + esc(w) + '</span>'; }).join(' ');
      var right = exp.length - $$('.miss', el(html)).length, extra = pool.length, score = Math.max(0, (right - extra * .5) / exp.length);
      inp.disabled = true; $('button', f).remove();
      done(score >= .999 ? true : score, '<div class="diff" style="margin-top:6px">' + html + '</div><div style="margin-top:6px">✔ ' + esc(a.items[i]) + '</div>');
    };
  });
};

/* ---------- SPEAKING ---------- */
function micUI(host, expected, done, opts) {
  opts = opts || {};
  var box = el('<div style="text-align:center"><button class="mic" type="button" aria-label="Nagrywaj / Speak">🎙️</button><div class="pl" style="margin-top:8px;font-weight:700" data-hint>' + (SR ? 'Dotknij mikrofonu i powiedz · Tap and speak' : 'Powiedz na głos, potem oceń się · Say it aloud, then rate yourself') + '</div><div class="heard" style="margin-top:10px"></div></div>');
  host.appendChild(box);
  var mic = $('.mic', box), heard = $('.heard', box), tries = 0;
  if (!SR) { selfRate(host, done); mic.onclick = function () { speak(expected, { rate: .9 }); }; mic.textContent = '🔊'; return; }
  mic.onclick = function () {
    if (mic.classList.contains('on')) { try { recognise.current.stop(); } catch (e) {} return; }
    stopSpeak(); mic.classList.add('on'); heard.textContent = 'Słucham… · Listening…';
    recognise().then(function (alts) {
      mic.classList.remove('on'); tries++;
      var m = matchWords(expected, alts);
      heard.innerHTML = alts.length ? m.words.map(function (w, k) { return '<span class="w ' + (m.status[k] ? 'ok' : 'no') + '">' + esc(w) + '</span>'; }).join(' ') + '<div class="pl" style="margin-top:6px">Usłyszałam: „' + esc(m.heard) + '” · ' + Math.round(m.score * 100) + '%</div>' : 'Nic nie usłyszałam – spróbuj głośniej. · I didn\'t hear anything.';
      if (m.score >= (opts.pass || .7) || tries >= 3) { mic.disabled = true; done(m.score >= (opts.pass || .7) ? true : Math.max(m.score, .3), m.score >= (opts.pass || .7) ? '' : 'Dobra próba! Posłuchaj jeszcze raz i idź dalej. · Good try!'); }
      else $('[data-hint]', box).textContent = 'Spróbuj jeszcze raz (' + tries + '/3) · Try again – czerwone słowa powiedz wyraźniej';
    }).catch(function (err) {
      mic.classList.remove('on');
      if (err === 'not-allowed' || err === 'service-not-allowed') { heard.textContent = 'Brak dostępu do mikrofonu. Oceń się sam/a. · No mic access.'; mic.disabled = true; selfRate(host, done); }
      else heard.textContent = 'Spróbuj jeszcze raz. · Try again.';
    });
  };
}
function selfRate(host, done) {
  var b = el('<div style="margin-top:14px"><div class="q" style="text-align:center;font-size:18px">Jak poszło? · How did it go?</div><div class="tfbtns" style="grid-template-columns:repeat(3,1fr)"><button class="opt" data-s="1" type="button">😀 Dobrze</button><button class="opt" data-s=".7" type="button">🙂 Prawie</button><button class="opt" data-s=".4" type="button">😐 Trudno</button></div></div>');
  host.appendChild(b);
  $$('[data-s]', b).forEach(function (x) { x.onclick = function () { $$('[data-s]', b).forEach(function (y) { y.disabled = true; }); x.classList.add('right'); var s = +x.getAttribute('data-s'); done(s === 1 ? true : s, ''); }; });
}
R.repeat = function (a, body) {
  var top = el(instr('Listen, then say the sentence. The app checks your words.', 'Posłuchaj, a potem powiedz zdanie. Aplikacja sprawdzi Twoje słowa.', '🗣️'));
  stepper(a.items.length, top, function (i, host, done) {
    var s = a.items[i];
    host.appendChild(el('<div class="say">' + esc(s) + '</div>'));
    var ab = audioBox(function () { return s; }, { label: 'Posłuchaj wzoru · Listen first', sub: 'Potem naciśnij mikrofon. · Then tap the microphone.' }); host.appendChild(ab); ab.autoplay();
    micUI(host, s, done);
  });
};
R.minimal = function (a, body) {
  var items = shuffle(a.items.concat(a.items).map(function (p, k) { return { p: p, which: k < a.items.length ? 0 : 1 }; }));
  var top = el(instr('Two words sound almost the same. Listen – which one is it?', 'Dwa słowa brzmią prawie tak samo. Posłuchaj – które słyszysz?', '👂'));
  stepper(items.length, top, function (i, host, done) {
    var it = items[i], w = it.p[it.which];
    var ab = audioBox(function () { return w; }, { label: 'Które słowo? · Which word?' }); host.appendChild(ab); ab.autoplay();
    var opts = [it.p[2] + ' ' + it.p[0], it.p[3] + ' ' + it.p[1]];
    mcq(host, 'Wybierz obrazek · Choose', opts, it.which, function (ok, ex) { done(ok, (ex ? ex + '<br>' : '') + 'Teraz powiedz oba: <b>' + esc(it.p[0]) + '</b> – <b>' + esc(it.p[1]) + '</b> 🗣️'); }, 'emojis text');
  });
};
function timerRing(sec) {
  var c = 2 * Math.PI * 48, box = el('<div class="timer"><svg width="110" height="110"><circle cx="55" cy="55" r="48" fill="none" stroke="#eef0f5" stroke-width="10"/><circle cx="55" cy="55" r="48" fill="none" stroke="var(--speaking)" stroke-width="10" stroke-linecap="round" stroke-dasharray="' + c + '" stroke-dashoffset="0" data-r/></svg><b>' + sec + '</b></div>').firstChild;
  var t = null, left = sec;
  box.start = function (onEnd) { left = sec; clearInterval(t); t = setInterval(function () { left--; $('b', box).textContent = left; $('[data-r]', box).style.strokeDashoffset = c * (1 - left / sec); if (left <= 0) { clearInterval(t); onEnd && onEnd(); } }, 1000); };
  box.stop = function () { clearInterval(t); };
  return box;
}
function talkPanel(host, sec, onDone) {
  var rec = recorder(), ring = timerRing(sec), url = null;
  var p = el('<div class="card" style="text-align:center"><div class="row" style="justify-content:center;gap:24px;align-items:center"></div><div class="row" style="justify-content:center;margin-top:14px"><button class="btn big" style="background:var(--speaking)" type="button" data-rec>🎙️ Start</button><button class="btn big light" type="button" data-play style="display:none">▶ Odsłuchaj się</button></div><p class="pl" data-tip style="margin:10px 0 0">Mów, aż skończy się czas. Nagranie zostaje tylko na Twoim urządzeniu. · Talk until the time is up.</p></div>');
  $('.row', p).appendChild(ring); host.appendChild(p);
  var recBtn = $('[data-rec]', p), playBtn = $('[data-play]', p), recording = false, rated = false;
  function stopRec() { if (!recording) return; recording = false; ring.stop(); rec.stop().then(function (u) { url = u; if (u) playBtn.style.display = ''; }); recBtn.textContent = '↺ Jeszcze raz'; if (!rated) { rated = true; selfRate(host, onDone); } }
  recBtn.onclick = function () {
    if (recording) return stopRec();
    stopSpeak(); recording = true; recBtn.textContent = '■ Stop'; ring.start(stopRec);
    rec.start().catch(function () { $('[data-tip]', p).textContent = 'Bez nagrywania – po prostu mów na głos. · Speak aloud (no recording).'; });
  };
  playBtn.onclick = function () { if (url) new Audio(url).play(); };
}
R.picture = function (a, body) {
  CTX.n = 1;
  body.appendChild(el(instr('Look at the picture and talk about it. Use the questions and sentence starters.', 'Popatrz na obrazek i opowiedz o nim. Skorzystaj z pytań i początków zdań.', '🖼️')));
  body.appendChild(el('<div class="scene" aria-label="obrazek">' + a.scene + '</div>'));
  var g = el('<div class="grid g2" style="margin:16px 0"><div class="card" style="padding:16px"><b>❓ Pytania · Questions</b><ol style="margin:8px 0 0;padding-left:20px">' + a.prompts.map(function (q) { return '<li style="margin-bottom:4px">' + esc(q) + ' <button class="slow" style="padding:3px 8px" type="button" data-say="' + esc(q) + '">🔊</button></li>'; }).join('') + '</ol></div><div class="card" style="padding:16px"><b>🧱 Pomocne zwroty · Sentence starters</b><div class="frames">' + a.frames.map(function (f) { return '<span class="frame">' + esc(f) + '</span>'; }).join('') + '</div></div></div>');
  body.appendChild(g); $$('[data-say]', g).forEach(function (b) { b.onclick = function () { speak(b.getAttribute('data-say')); }; });
  talkPanel(body, a.seconds || 60, function (ok) { body.appendChild(el(nextBtn('Zakończ · Finish ✓'))); $('[data-next]', body).onclick = function () { finish(ok === true ? 1 : ok); }; });
};
R.challenge = function (a, body) {
  var top = el(instr('Answer each question. Try to speak until the time runs out!', 'Odpowiedz na każde pytanie. Spróbuj mówić do końca czasu!', '⏱️'));
  top.appendChild(el('<div class="card" style="padding:14px 16px;margin-bottom:14px"><b>🧱 Pomocne zwroty</b><div class="frames">' + a.frames.map(function (f) { return '<span class="frame">' + esc(f) + '</span>'; }).join('') + '</div></div>'));
  stepper(a.qs.length, top, function (i, host, done) {
    host.appendChild(el('<div class="say">' + esc(a.qs[i]) + '</div>'));
    speak(a.qs[i]);
    talkPanel(host, a.seconds || 45, done);
  });
};
R.roleplay = function (a, body) {
  CTX.n = 1; var i = 0, scores = [], hide = false;
  body.appendChild(el(instr('Have a conversation! The app speaks the other person. You say the lines in pink.', 'Rozmowa! Aplikacja mówi za drugą osobę, a Ty mówisz różowe kwestie.', '🎭')));
  var opt = el('<label class="pick" style="margin-bottom:14px"><input type="checkbox"> 🙈 Ukryj moje kwestie (trudniej!) · Hide my lines</label>'); body.appendChild(opt);
  $('input', opt).onchange = function () { hide = this.checked; };
  var chat = el('<div class="chat"></div>').firstChild; body.appendChild(chat);
  var ctrl = el(''); body.appendChild(ctrl);
  function next() {
    setBar(i / a.lines.length);
    if (i >= a.lines.length) { var f = scores.length ? scores.reduce(function (x, y) { return x + y; }, 0) / scores.length : 1; ctrl.innerHTML = ''; ctrl.appendChild(el('<div class="feedback on good">Rozmowa skończona! 🎉 Conversation complete!</div>' + nextBtn('Zakończ · Finish ✓'))); $('[data-next]', ctrl).onclick = function () { finish(f); }; return; }
    var l = a.lines[i], mine = l[0] === a.you;
    var bub = el('<div class="bub ' + (mine ? 'b todo' : 'a') + '"><small>' + (mine ? 'Ty · You' : 'Rozmówca') + '</small>' + (mine && hide ? '<i>🙈 (powiedz swoją kwestię)</i>' : esc(l[1])) + '</div>').firstChild;
    chat.appendChild(bub); bub.scrollIntoView({ behavior: 'smooth', block: 'center' });
    ctrl.innerHTML = '';
    if (!mine) { speak(l[1]).then(function () { i++; setTimeout(next, 300); }); return; }
    micUI(ctrl, l[1], function (ok) {
      scores.push(ok === true ? 1 : ok); bub.classList.remove('todo'); bub.innerHTML = '<small>Ty · You</small>' + esc(l[1]);
      i++; setTimeout(next, 700);
    }, { pass: .6 });
  }
  var start = el('<div style="text-align:center"><button class="btn big" style="background:var(--speaking)" type="button">▶ Zaczynamy · Start</button></div>'); ctrl.appendChild(start);
  $('button', start).onclick = next;
};

/* ---------- WRITING ---------- */
function tileBuilder(host, tokens, target, done, opts) {
  opts = opts || {};
  var pool = tokens.map(function (t, i) { return i; }), ans = [];
  var w = el('<div class="tiles answer" data-a></div><div class="tiles ' + (opts.letters ? 'letters' : '') + '" data-p style="justify-content:center"></div><div class="pfoot"><button class="btn ghost" type="button" data-back>⌫ Cofnij</button><button class="btn big" type="button" data-check disabled>Sprawdź · Check</button></div>');
  host.appendChild(w);
  function draw() {
    $('[data-a]', w).innerHTML = ans.map(function (i, k) { return '<button type="button" class="tile" data-k="' + k + '">' + esc(tokens[i]) + '</button>'; }).join('');
    $('[data-p]', w).innerHTML = tokens.map(function (t, i) { return '<button type="button" class="tile' + (ans.indexOf(i) > -1 ? ' used' : '') + '" data-i="' + i + '">' + esc(t) + '</button>'; }).join('');
    $$('[data-i]', w).forEach(function (b) { b.onclick = function () { if (b.classList.contains('used') || (opts.letters && ans.length >= target.length)) return; ans.push(+b.getAttribute('data-i')); draw(); }; });
    $$('[data-k]', w).forEach(function (b) { b.onclick = function () { ans.splice(+b.getAttribute('data-k'), 1); draw(); }; });
    $('[data-check]', w).disabled = opts.letters ? ans.length !== target.length : ans.length !== tokens.length;
    if (opts.onDraw) opts.onDraw(ans.map(function (i) { return tokens[i]; }));
  }
  draw();
  $('[data-back]', w).onclick = function () { ans.pop(); draw(); };
  $('[data-check]', w).onclick = function () {
    var got = ans.map(function (i) { return tokens[i]; }).join(opts.letters ? '' : ' '), ok = got === (opts.letters ? target : target);
    $$('.tile', w).forEach(function (t) { t.disabled = true; }); $('.pfoot', w).remove();
    if (!opts.letters) speak(target, { rate: .9 });
    done(ok, ok ? '' : 'Poprawnie · Correct: <b>' + esc(target) + '</b>');
  };
}
R.unscramble = function (a, body) {
  var top = el(instr('Tap the words to build the sentence.', 'Dotykaj słów, aby ułożyć zdanie.', '🧱'));
  stepper(a.items.length, top, function (i, host, done) {
    var s = a.items[i], toks = s.replace(/([.?!])$/, ' $1').split(' ');
    var punct = /[.?!]/.test(toks[toks.length - 1]) ? toks.pop() : '';
    var target = toks.join(' ');
    host.appendChild(el('<div class="q">' + (punct === '?' ? 'Ułóż pytanie · Build the question' : 'Ułóż zdanie · Build the sentence') + ' <span class="pl">(' + toks.length + ' słów)</span></div>'));
    tileBuilder(host, shuffleNot(toks), target, function (ok, ex) { done(ok, ex ? ex + esc(punct) : ''); });
  });
};
R.spell = function (a, body) {
  var top = el(instr('Look and listen. Tap the letters to spell the word.', 'Popatrz i posłuchaj. Dotykaj liter, aby przeliterować słowo.', '🔤'));
  var abc = 'abcdefghijklmnopqrstuvwxyz';
  stepper(a.items.length, top, function (i, host, done) {
    var it = a.items[i], word = it[1], extra = [];
    while (extra.length < Math.min(3, Math.max(2, 8 - word.length))) { var c = abc[Math.floor(Math.random() * 26)]; if (word.indexOf(c) === -1 && extra.indexOf(c) === -1) extra.push(c); }
    host.appendChild(el('<div class="bigemoji">' + it[0] + '</div><div style="text-align:center"><button class="slow" type="button" data-say>🔊 Posłuchaj · Listen</button></div>'));
    $('[data-say]', host).onclick = function () { speak(word, { rate: .8 }); }; speak(word, { rate: .8 });
    var slots = el('<div class="slots">' + word.split('').map(function () { return '<span class="slot"></span>'; }).join('') + '</div>').firstChild; host.appendChild(slots);
    tileBuilder(host, shuffle(word.split('').concat(extra)), word, function (ok, ex) { speak(word, { rate: .85 }); done(ok, ok ? '🔤 ' + word.toUpperCase().split('').join(' – ') : ex); }, { letters: true, onDraw: function (got) { $$('.slot', slots).forEach(function (s, k) { s.textContent = got[k] || ''; s.classList.toggle('f', !!got[k]); }); } });
  });
};
R.wgap = function (a, body) {
  var top = el(instr(a.hint ? a.hint.split(' / ')[0] : 'Write the missing word.', a.hint ? a.hint.split(' / ')[1] : 'Wpisz brakujące słowo.', '✏️'));
  stepper(a.items.length, top, function (i, host, done) {
    var it = a.items[i], parts = it[0].split('___'), accept = it[1].split('|');
    var f = el('<form><div class="gaptext">' + esc(parts[0]) + '<input class="gap" style="width:' + Math.max(110, accept[0].length * 16) + 'px;outline:0" autocomplete="off" autocapitalize="off" spellcheck="false">' + esc(parts[1] || '') + '</div><div class="pfoot"><button class="btn big">Sprawdź · Check</button></div></form>').firstChild;
    host.appendChild(f); var inp = $('input', f); setTimeout(function () { inp.focus(); }, 200);
    f.onsubmit = function (e) {
      e.preventDefault(); if (!inp.value.trim()) return;
      var ok = accept.some(function (x) { return norm(x) === norm(inp.value); });
      inp.classList.add(ok ? 'right' : 'wrong'); inp.disabled = true; $('button', f).remove();
      speak((parts[0] + accept[0] + (parts[1] || '')).replace(/^[^\w]+/, '').split('→').pop());
      done(ok, ok ? '' : 'Poprawnie · Answer: <b>' + esc(accept[0]) + '</b>');
    };
  });
};
R.fix = function (a, body) {
  var top = el(instr('Each sentence has a mistake. Correct it and check.', 'W każdym zdaniu jest błąd. Popraw go i sprawdź.', '🛠️'));
  stepper(a.items.length, top, function (i, host, done) {
    var it = a.items[i];
    host.appendChild(el('<div class="q" style="color:var(--bad)">✗ ' + esc(it[0]) + '</div>'));
    var f = el('<form><input class="field" style="font-size:19px" autocomplete="off" spellcheck="false" value="' + esc(it[0]) + '"><div class="pfoot"><button class="btn ghost" type="button" data-hint>💡 Podpowiedź</button><button class="btn big">Sprawdź · Check</button></div><div class="pl" data-h style="display:none;font-weight:700"></div></form>').firstChild;
    host.appendChild(f); var inp = $('input', f); setTimeout(function () { inp.focus(); inp.setSelectionRange(inp.value.length, inp.value.length); }, 200);
    var usedHint = false;
    $('[data-hint]', f).onclick = function () { usedHint = true; var h = $('[data-h]', f); h.style.display = 'block'; h.textContent = '💡 ' + it[2]; };
    f.onsubmit = function (e) {
      e.preventDefault();
      var ok = strict(inp.value) === strict(it[1]) || strict(inp.value).replace(/\.$/, '') === strict(it[1]).replace(/\.$/, '') && /\.$/.test(it[1]) === /\.$/.test(inp.value);
      inp.disabled = true; inp.style.borderColor = ok ? 'var(--ok)' : 'var(--bad)'; $('.pfoot', f).remove();
      done(ok ? (usedHint ? .8 : true) : false, (ok ? '' : '✔ <b>' + esc(it[1]) + '</b><br>') + '💡 ' + esc(it[2]));
    };
  });
};
R.guided = function (a, body) {
  CTX.n = 1;
  body.appendChild(el(instr(a.prompt, a.promptPl, '📝')));
  var saved = P.texts[a.id] ? P.texts[a.id].text : '';
  var w = el('<div class="card" style="padding:16px;margin-bottom:12px"><b>🧱 Dotknij, aby wstawić · Tap to add</b><div class="frames">' + a.frames.map(function (f) { return '<button type="button" class="frame" data-f="' + esc(f) + '">' + esc(f) + '</button>'; }).join('') + '</div></div>' +
    '<textarea class="field write" placeholder="Pisz tutaj · Write here…" spellcheck="true" lang="en">' + esc(saved) + '</textarea>' +
    '<div class="grid g2" style="margin-top:12px;align-items:start"><div class="card" style="padding:16px"><b>✅ Lista kontrolna · Checklist</b><ul class="checklist" data-cl></ul></div><div class="card" style="padding:16px"><b>👀 Przykład · Example</b><p class="pl">Najpierw napisz sam/a – potem porównaj!</p><details><summary style="cursor:pointer;font-weight:700">Pokaż przykład</summary><p style="white-space:pre-wrap;margin:8px 0 0">' + esc(a.model) + '</p></details></div></div>' +
    '<div class="pfoot"><button class="btn big" type="button" data-done>Gotowe · Done ✓</button></div>');
  body.appendChild(w);
  var ta = $('textarea', w), cl = $('[data-cl]', w);
  $$('[data-f]', w).forEach(function (b) { b.onclick = function () { var v = ta.value, pos = ta.selectionStart || v.length, ins = (pos && !/\s$/.test(v.slice(0, pos)) ? ' ' : '') + b.getAttribute('data-f').replace(/…$/, ' '); ta.value = v.slice(0, pos) + ins + v.slice(pos); ta.focus(); ta.selectionStart = ta.selectionEnd = pos + ins.length; check(); }; });
  function checks() {
    var t = ta.value.trim(), wc = t ? t.split(/\s+/).length : 0, sents = t.split(/(?<=[.!?])\s+|\n+/).map(function (s) { return s.trim(); }).filter(Boolean);
    var low = norm(t);
    var list = [
      [wc >= a.min, 'Co najmniej ' + a.min + ' słów (' + wc + ') · At least ' + a.min + ' words'],
      [sents.length > 0 && sents.every(function (s) { return /^[A-Z"'(]/.test(s) || /^[A-Z]/.test(s.replace(/^[^A-Za-z]+/, '')); }), 'Zdania zaczynają się wielką literą · Capital letters'],
      [/[.!?]["')]?$/.test(t) || /,$/.test(t) && false || /\n[A-Z][a-z]+$/.test(t), 'Kończysz kropką lub znakiem zapytania · Full stop at the end'],
      [!/(^|[^A-Za-z])i([^A-Za-z']|'m|'ve|'ll|'d)/.test(t.replace(/\bi\.e\./g, '')), '„I” zawsze wielką literą · "I" is always capital']
    ];
    a.words.forEach(function (x) { list.push([low.indexOf(norm(x)) > -1, 'Użyj: „' + x + '” · Use "' + x + '"']); });
    return { list: list, wc: wc };
  }
  function check() { var c = checks(); cl.innerHTML = c.list.map(function (x) { return '<li class="' + (x[0] ? 'ok' : '') + '">' + esc(x[1]) + '</li>'; }).join(''); setBar(c.list.filter(function (x) { return x[0]; }).length / c.list.length); }
  ta.oninput = check; check();
  $('[data-done]', w).onclick = function () {
    var c = checks(); if (c.wc < Math.min(5, a.min)) { toast('Napisz trochę więcej 🙂 · Write a bit more'); ta.focus(); return; }
    P.texts[a.id] = { text: ta.value.trim(), at: Date.now() }; save();
    finish(c.list.filter(function (x) { return x[0]; }).length / c.list.length, '✍️ Twój tekst został zapisany – rodzic zobaczy go w „Kąciku rodzica”.');
  };
};

/* ---------- finish ---------- */
function finish(f, note) {
  f = Math.max(0, Math.min(1, f || 0));
  var stars = f >= .9 ? 3 : f >= .6 ? 2 : 1, secs = Math.round((Date.now() - CTX.start) / 1000), id = CTX.id, prev = P.done[id];
  P.done[id] = { stars: Math.max(stars, prev ? prev.stars : 0), at: Date.now() };
  P.log.push({ id: id, skill: CTX.skill, at: Date.now(), score: f, stars: stars, secs: Math.min(secs, 1800) });
  if (P.log.length > 500) P.log = P.log.slice(-500);
  if (P.days.indexOf(today()) === -1) P.days.push(today());
  save(); setBar(1); sync();
  var x = ALL[id], list = D.activities[x.band][x.skill], nx = list[x.index + 1];
  var msg = stars === 3 ? ['🏆', 'Fantastycznie!', 'Amazing work!'] : stars === 2 ? ['🌟', 'Bardzo dobrze!', 'Well done!'] : ['🌱', 'Dobry początek!', 'Good start – try again for more stars!'];
  var body = $('#pBody');
  body.innerHTML = '<div class="result"><div class="trophy">' + msg[0] + '</div><h2>' + msg[1] + '</h2><div class="pl">' + msg[2] + '</div>' + starsHtml(stars) + '<p style="font-weight:700">Wynik · Score: ' + Math.round(f * 100) + '% · ⏱ ' + Math.max(1, Math.round(secs / 60)) + ' min</p>' + (note ? '<p class="pl">' + note + '</p>' : '') +
    '<p>🌸 W Twoim ogrodzie wyrósł nowy kwiatek! · A new flower in your garden!</p><div class="row" style="justify-content:center;margin-top:18px"><button class="btn big light" type="button" data-again>↺ Jeszcze raz</button>' +
    (nx ? '<button class="btn big" type="button" data-next data-nx="' + nx.id + '">Następne · Next →</button>' : '<button class="btn big" type="button" data-next data-home>Gotowe · Done ✓</button>') + '</div></div>';
  $('[data-again]', body).onclick = function () { openAct(id); };
  var n = $('[data-next]', body); n.onclick = function () { if (n.dataset.nx) openAct(n.dataset.nx); else closePlayer(); }; n.focus();
  if (stars === 3) confetti();
}
function confetti() {
  var c = document.createElement('div'); c.className = 'confetti'; var cols = ['#5968e8', '#f2b632', '#e5625b', '#2f9e6e', '#3577e0'];
  for (var i = 0; i < 60; i++) { var p = document.createElement('i'); p.style.left = Math.random() * 100 + '%'; p.style.background = cols[i % 5]; p.style.animationDelay = Math.random() * .6 + 's'; p.style.animationDuration = 1.4 + Math.random() + 's'; c.appendChild(p); }
  document.body.appendChild(c); setTimeout(function () { c.remove(); }, 3200);
}
var syncT = null;
function sync() { if (A.kind !== 'pupil' || !A.code) return; clearTimeout(syncT); syncT = setTimeout(function () { rpc('wb_progress_save', { p_code: A.code, p_progress: summary() }).catch(function () {}); }, 800); }

/* ====================== start ====================== */
window.WBSkills = { open: openAct };
window.addEventListener('hashchange', route);
var q = new URLSearchParams(location.search), band = q.get('band'), codeQ = q.get('code');
if (band && D.bands[band]) { P.band = band; save(); }
route();
checkAccess().then(function () {
  route();
  if (codeQ) { history.replaceState(null, '', location.pathname + location.hash); codeModal(); $('#cd').value = codeQ; redeem(codeQ, $('#cdMsg')); }
  else if (A.kind === 'pupil') sync();
});
})();
