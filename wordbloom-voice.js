/* WordBloom voices – one shared British-English voice setup for the whole site.
   window.WBVoice:
     ready()            -> Promise, resolves when the browser has loaded its voices
     list()             -> English voices, best first (British first)
     main()             -> the voice to use (the learner's choice, or the best one)
     pair()             -> [voiceA, voiceB, pitchB] two different voices for dialogues
     speak(text, opt)   -> Promise; opt: { rate, voice, pitch }
     stop()
     choose(voiceURI) / speed(mult) / getSpeed()
     label(voice)       -> friendly Polish label, e.g. "Sonia · brytyjski · kobiecy"
   The choice is saved on this device (localStorage: wbVoice, wbVoiceSpeed). */
(function () {
'use strict';
if (window.WBVoice) return;
var synth = window.speechSynthesis;
function ls(k, v) { try { if (v === undefined) return localStorage.getItem(k); if (v === null) localStorage.removeItem(k); else localStorage.setItem(k, v); } catch (e) { return null; } }

/* Joke / robotic voices shipped with macOS and eSpeak – never pick these. */
var BAD = /\b(albert|bad news|bahh|bells|boing|bubbles|cellos|good news|jester|organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|ralph|kathy|rocko|grandma|grandpa|eddy|flo|reed|sandy|shelley|espeak)\b/i;
var FEMALE = /(female|woman|sonia|libby|maisie|abbie|bella|hollie|olivia|mia|amelia|kate|serena|stephanie|martha|fiona|moira|tessa|karen|catherine|samantha|victoria|susan|hazel|aria|jenny|emma|ava|allison|zoe|siri.*voice 2|natasha|clara|emily|ellie|nancy|sara|jane|libby|google uk english female)/i;
var MALE = /(\bmale\b|\bman\b|ryan|thomas|alfie|elliot|ethan|noah|oliver|daniel|arthur|oliver|george|james|guy|andrew|brian|christopher|eric|roger|steffan|william|tom\b|aaron|gordon|rishi|lee|google uk english male)/i;

function gender(v) { var n = v.name || ''; if (/female/i.test(n)) return 'f'; if (/\bmale\b/i.test(n)) return 'm'; if (FEMALE.test(n)) return 'f'; if (MALE.test(n)) return 'm'; return '?'; }
function isGB(v) { return /^en[-_](GB|UK)/i.test(v.lang || ''); }
function score(v) {
  var n = 0, nm = v.name || '';
  if (BAD.test(nm)) return -1000;
  if (isGB(v)) n += 400;                                   // British first
  else if (/^en[-_](IE|AU|NZ)/i.test(v.lang)) n += 120;    // closest accents next
  else if (/^en[-_]US/i.test(v.lang)) n += 60;
  if (/natural|neural|online|enhanced|premium|siri/i.test(nm)) n += 200; // modern, human-sounding voices
  if (/^google/i.test(nm)) n += 150;
  if (/microsoft (sonia|libby|ryan|maisie|thomas|abbie|alfie|bella|elliot|ethan|hollie|noah|oliver|olivia)/i.test(nm)) n += 80;
  if (/\b(daniel|kate|serena|arthur|martha|stephanie|jamie|oliver)\b/i.test(nm)) n += 60; // good Apple British voices
  if (/compact|desktop|mobile/i.test(nm)) n -= 40;         // older, flatter voices
  if (v.default) n += 2;
  return n;
}

var cache = [];
function refresh() {
  if (!synth) return (cache = []);
  cache = synth.getVoices().filter(function (v) { return /^en[-_]/i.test(v.lang) && !BAD.test(v.name); })
    .sort(function (a, b) { return score(b) - score(a); });
  return cache;
}
var readyP = null;
function ready() {
  if (readyP) return readyP;
  readyP = new Promise(function (res) {
    if (!synth) return res([]);
    if (refresh().length) return res(cache);
    var done = false, fin = function () { if (done) return; done = true; res(refresh()); };
    if (synth.addEventListener) synth.addEventListener('voiceschanged', function h() { if (refresh().length) { synth.removeEventListener('voiceschanged', h); fin(); } });
    var tries = 0, t = setInterval(function () { if (refresh().length || ++tries > 30) { clearInterval(t); fin(); } }, 100);
  });
  return readyP;
}
if (synth) { refresh(); if (synth.addEventListener) synth.addEventListener('voiceschanged', function () { refresh(); notify(); }); }
var listeners = [];
function notify() { listeners.forEach(function (f) { try { f(); } catch (e) {} }); }

function list() { return cache.length ? cache : refresh(); }
function main() {
  var vs = list(), want = ls('wbVoice');
  if (want) for (var i = 0; i < vs.length; i++) if (vs[i].voiceURI === want || vs[i].name === want) return vs[i];
  return vs[0] || null;
}
function pair() {
  var vs = list(), a = main();
  if (!a) return [null, null, 1.25];
  var ga = gender(a), same = function (v) { return v.voiceURI === a.voiceURI; };
  var pools = [
    function (v) { return isGB(v) && gender(v) !== '?' && gender(v) !== ga; },      // British, other gender
    function (v) { return isGB(v) && v.name.split(' ')[0] !== a.name.split(' ')[0] && !/compact/i.test(v.name); }, // another British voice
    function (v) { return isGB(v); },
    function (v) { return gender(v) !== '?' && gender(v) !== ga && score(v) > 0; },  // other accent, other gender
    function () { return true; }
  ];
  for (var p = 0; p < pools.length; p++) for (var i = 0; i < vs.length; i++) if (!same(vs[i]) && pools[p](vs[i])) return [a, vs[i], 1];
  return [a, a, 1.25]; // only one voice on this device – change the pitch so two speakers still sound different
}
function getSpeed() { var s = parseFloat(ls('wbVoiceSpeed')); return s > 0.5 && s < 1.6 ? s : 1; }
function speed(m) { ls('wbVoiceSpeed', String(m)); notify(); }
function choose(uri) { ls('wbVoice', uri || null); notify(); }

/* Chrome stops long Google utterances after ~15 s, so long texts are read sentence by sentence. */
function chunks(text) {
  text = String(text || '').replace(/\s+/g, ' ').trim();
  if (text.length < 180) return text ? [text] : [];
  var parts = text.match(/[^.!?…]+[.!?…]+["')\]]*\s*|[^.!?…]+$/g) || [text], out = [], cur = '';
  parts.forEach(function (p) { if ((cur + p).length > 200 && cur) { out.push(cur.trim()); cur = p; } else cur += p; });
  if (cur.trim()) out.push(cur.trim());
  return out;
}
var gen = 0, keepAlive = null;
function stop() { gen++; clearInterval(keepAlive); if (synth) synth.cancel(); }
function speak(text, opt) {
  opt = opt || {};
  var my = ++gen;
  return ready().then(function () {
    return new Promise(function (res) {
      if (!synth) return res(false);
      var v = opt.voice === undefined ? main() : opt.voice, parts = chunks(text), i = 0;
      var rate = Math.max(0.5, Math.min(1.5, (opt.rate || 0.95) * getSpeed()));
      if (synth.speaking || synth.pending) synth.cancel();
      clearInterval(keepAlive);
      // Chrome on desktop can go silent mid-text; a resume() every 10 s keeps it alive.
      keepAlive = setInterval(function () { if (synth.speaking && !synth.paused) { synth.pause(); synth.resume(); } }, 10000);
      function end(ok) { clearInterval(keepAlive); res(ok); }
      (function next() {
        if (my !== gen) return end(false);
        if (i >= parts.length) return end(true);
        var u = new SpeechSynthesisUtterance(parts[i++]), done = false;
        if (v) { u.voice = v; u.lang = v.lang; } else u.lang = 'en-GB';
        u.rate = rate; u.pitch = opt.pitch || 1;
        var fin = function () { if (done) return; done = true; setTimeout(next, 60); };
        u.onend = fin; u.onerror = function (e) { if (e && (e.error === 'interrupted' || e.error === 'canceled')) { done = true; return end(false); } fin(); };
        setTimeout(function () { if (my === gen) synth.speak(u); }, 30); // a tiny gap avoids the Chrome "cancel then silence" bug
        setTimeout(fin, 2500 + u.text.length * 140 / rate);       // safety net if the browser never fires onend
      })();
    });
  });
}
function nice(name) {
  return String(name || '').replace(/^(Microsoft|Google|Apple)\s+/i, '').replace(/\s*\(.*?\)\s*/g, ' ').replace(/\s+Online|\s+Natural|\s+-\s+English.*$/gi, '').replace(/\s+/g, ' ').trim() || 'Głos';
}
function label(v) {
  if (!v) return 'Domyślny głos';
  var acc = isGB(v) ? 'brytyjski' : /^en[-_]US/i.test(v.lang) ? 'amerykański' : /^en[-_]IE/i.test(v.lang) ? 'irlandzki' : /^en[-_]AU/i.test(v.lang) ? 'australijski' : 'angielski';
  var g = gender(v), gl = g === 'f' ? ' · kobiecy' : g === 'm' ? ' · męski' : '';
  var q = /natural|neural|online|enhanced|premium|siri/i.test(v.name) || /^google/i.test(v.name) ? ' ✨' : '';
  return nice(v.name) + ' · ' + acc + gl + q;
}
window.WBVoice = { ready: ready, list: list, main: main, pair: pair, speak: speak, stop: stop, choose: choose, speed: speed, getSpeed: getSpeed, label: label, gender: gender, isGB: isGB, onChange: function (f) { listeners.push(f); }, supported: !!synth };
})();
