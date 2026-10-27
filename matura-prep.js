(function(){if(window.WBVoice||document.querySelector('script[src$="wordbloom-voice.js"]'))return;var q=document.createElement('script');q.src='/wordbloom-voice.js';document.head.appendChild(q)})();
/* WordBloom - Matura z angielskiego / English Matura hub (v2, 2026-10)
   Guides + navigation + level filter + interactive exercises + exam-style audio.
   Exercise data lives in matura-hub-exercises.js (window.WBM.tasks). */
(function(){
'use strict';
var WBM=window.WBM=window.WBM||{};WBM.tasks=WBM.tasks||{};
var LEVEL_KEY='wordbloom_matura_level';
function lsGet(k){try{return localStorage.getItem(k)}catch(e){return null}}
function lsSet(k,v){try{localStorage.setItem(k,v)}catch(e){}}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function list(a,ord){var t=ord?'ol':'ul';return '<'+t+'>'+a.map(function(i){return '<li>'+esc(i)+'</li>'}).join('')+'</'+t+'>'}
var uid=0;function nid(p){uid++;return (p||'mh')+uid}

/* ---------------- exam parts: summary + full guide ---------------- */
var PARTS=[
 {id:'listening',i:'🎧',t:'Listening',pl:'Rozumienie ze słuchu',w:'15 pts · 25% of the written score / 25% wyniku',
  tip:'Listen twice: first for the general idea and the speaker’s attitude, then for names, numbers, reasons and contrasts.',
  tipPl:'Słuchasz dwa razy: najpierw ogólny sens i nastawienie mówiącego, potem szczegóły – nazwy, liczby, powody.',
  tryit:{q:'Listen: “I was going to cycle to school, but the weather changed, so my dad drove me.” How did the speaker get to school?',audio:'I was going to cycle to school, but the weather changed, so my dad drove me.',accept:['by car','car','his dad drove him','her dad drove her','dad drove','in a car','in his dad\'s car','in her dad\'s car','by car with his dad','by car with her dad'],model:'By car (his/her dad drove). “Cycle” is mentioned, but it is the distractor – the plan changed.'},
  g:{
   tasks:['Every recording is played twice. The instructions are printed in Polish, so you know what to do before you listen.','Both levels: 15 tasks in 3-4 sets, 15 points. Podstawowy has about 25 minutes of recordings (B1/B1+); rozszerzony about 30 minutes (B2/B2+).','Task types: multiple choice (wybór wielokrotny), matching (dobieranie), gap-fill (luki) and short open answers. At least one set is always open.','Each correct answer is 1 point. The section is 25% of the whole written score.'],
   reward:['Exact, complete answers in open tasks that show you understood the recording.','Correct spelling of numbers, times and common words – a common word spelled wrong scores zero.','Catching paraphrase: the right option usually says the same thing as the recording in different words.'],
   traps:['Distractors: the recording often mentions every option. The right one answers the question, not just repeats words you heard.','Writing a word the way it sounds (zapis fonetyczny) instead of the correct spelling.','Changing your answer on the second listening without a clear reason.','Leaving open answers blank – a reasonable attempt can still score.'],
   steps:['Before the recording, read the tasks and underline what to listen for: who, why, when, opinion.','Predict the type of answer for each gap: a number? a place? a noun?','First listening: follow the whole text and answer what you can. Second listening: confirm, complete and check.','Re-read open answers: do they fit the gap grammatically and is the spelling right?']}},
 {id:'reading',i:'📖',t:'Reading',pl:'Rozumienie tekstów pisanych',w:'Podstawowy 20 pts (33%) · Rozszerzony 18 pts (30%)',
  tip:'Skim each text for its purpose, then scan for evidence. Underline the exact words that prove your answer – paraphrase, not repeated words.',
  tipPl:'Przejrzyj tekst, żeby zrozumieć jego cel, potem szukaj dowodu. Podkreśl słowa, które potwierdzają odpowiedź.',
  tryit:{q:'“The course is free, although booking is essential.” Can you just turn up without registering? Answer yes or no.',accept:['no','no.','no, you can\'t','no you cannot','no, you must book','no, booking is essential'],model:'No. “Booking is essential” = you must register first. “Free” is the distractor.'},
  g:{
   tasks:['Podstawowy: 4-5 texts, about 1,100-1,500 words in total – the biggest part of your score (33%). Rozszerzony: about 1,400-1,800 words, 30%.','Task types: multiple choice, matching (headings, people, missing sentences) and short open answers. At least one set is always open.','Texts are authentic or lightly adapted English texts on everyday and exam topics: articles, blogs, announcements, stories.'],
   reward:['Evidence: every correct answer can be proved from a specific line of the text.','Understanding paraphrase, synonyms and reference words (it, this, they, one).','In open tasks: precise answers that fit the context, with correct spelling of common words.'],
   traps:['Choosing an option because it repeats words from the text – that is usually the trap.','Answering from your own knowledge or opinion instead of from the text.','Using the same paragraph twice in matching without noticing.','Spending 15 minutes on one hard text and running out of time.'],
   steps:['Read the title and skim the text once for its general purpose (30-60 seconds).','Read the questions, then scan for the part that answers each one.','Underline the words that prove your answer. No proof? Keep looking.','In matching, cross out used options and check the extra one last.','Keep moving: about 1 minute per task, then return to the hard ones.']}},
 {id:'uoe',i:'🧩',t:'Use of English',pl:'Znajomość środków językowych',w:'Podstawowy 13 pts (22%) · Rozszerzony 14 pts (23%)',
  tip:'Train transformations, word formation, translation and gap-fills. Check tense, agreement, spelling and the word limit every time.',
  tipPl:'Ćwicz transformacje, słowotwórstwo, tłumaczenia i luki. Zawsze sprawdź czas, zgodność, pisownię i limit słów.',
  tryit:{q:'Rewrite without changing the meaning: “I last saw Marta two years ago.” → I have not seen Marta ______ two years. (one word)',accept:['for'],model:'for – “I have not seen Marta for two years.” Present perfect + for + a period of time.'},
  g:{
   tasks:['Podstawowy: 13 points in 3-4 sets (22% of the score). Rozszerzony: 14 points (23%).','Closed tasks: multiple choice in a text or in single sentences.','Open tasks: gap-fill (luki), transformations (transformacje – rewrite keeping the meaning), word formation (słowotwórstwo), translation of fragments (tłumaczenie fragmentów zdań) and lexico-grammatical sets.'],
   reward:['Full grammatical and spelling accuracy in open tasks – no half points: the answer is right or it is zero.','The right word class in word formation, with the right prefix or suffix (un-, -ness, -tion...).','Keeping the meaning exactly in transformations: same facts, same time, within the word limit.','Collocations and fixed phrases (take part in, be good at, depend on) – tested all the time.'],
   traps:['Going over the word limit, or losing part of the original meaning.','Right word, wrong form: “success” where the sentence needs “successful”.','One wrong letter costs the whole point.','Translating Polish word order or false friends (np. “actually” ≠ “aktualnie”) directly.'],
   steps:['Read the whole sentence or text first – the missing word must fit the grammar AND the meaning.','Ask: what is being tested? Tense? Preposition? Word family? Article?','For transformations, underline what must stay and build the sentence around the key word.','Re-read the finished sentence in your head. If it sounds wrong, it usually is.']}},
 {id:'writing',i:'✍️',t:'Writing',pl:'Wypowiedź pisemna',w:'Podstawowy 12 pts (20%) · Rozszerzony 13 pts (22%)',
  tip:'Plan before you write. Underline every point in the instruction and develop each one with a reason or an example. Leave 5 minutes to check.',
  tipPl:'Zaplanuj tekst. Podkreśl każdy punkt polecenia i rozwiń go – podaj powód lub przykład. Zostaw 5 minut na sprawdzenie.',
  tryit:{q:'Develop this content point (podstawowy email): “Napisz, dlaczego dołączyłeś/aś do klubu.” Write 2 sentences, then compare with the model.',open:true,model:'I joined the climbing club because I wanted to try something completely new this year. What is more, my best friend has been a member for months and she said it really helps her relax after school.'},
  g:{
   tasks:['Podstawowy: one practical text (tekst użytkowy) – an email, blog entry or forum post. The instruction is in Polish and gives the points you must cover. Length: 100-150 words.','Rozszerzony: choose one of two topics and write an argument text (tekst argumentacyjny): a formal letter, an essay (rozprawka) or an article. Each topic gives two elements to discuss. Length: 200-250 words.','Podstawowy marking: content 0-5, coherence 0-2, range 0-3, accuracy 0-2 (12 pts). Rozszerzony: task fulfilment 0-5, coherence 0-2, range 0-3, accuracy 0-3 (13 pts).'],
   reward:['Covering EVERY point and developing each one with a detail, reason or example. A developed point is worth much more than a mentioned one.','Clear paragraphs and linking: one idea per paragraph (first of all, what is more, on the other hand, to sum up).','Range: a mix of tenses, some richer vocabulary and a few longer sentences – used safely.','The right form and register: email style for an email, formal style for a formal letter, a clear thesis in an essay.'],
   traps:['Skipping or barely touching one point – the biggest score loss on the paper.','Writing far under the word count, or so far over that accuracy falls apart.','Copying long chunks of the instruction instead of your own sentences.','Risky grammar you have not mastered. A correct simple sentence beats a broken ambitious one.'],
   steps:['Underline every point in the instruction.','Make a 2-minute plan: one note per paragraph.','Write at least two sentences per point: say it, then add why, how or an example.','Check: every point covered? Linkers? Verb endings, articles, spelling? Save 5 minutes for this.']}},
 {id:'oral',i:'🗣️',t:'Oral exam',pl:'Część ustna',w:'about 15 min · 30 pts · same for all candidates / jednakowa dla wszystkich',
  tip:'Train interaction, not memorised speeches. Extend every answer: opinion + reason + example. Use repair phrases: “What I mean is...”, “Let me put it another way...”.',
  tipPl:'Ćwicz rozmowę, nie wyuczone teksty. Rozwijaj odpowiedź: opinia + powód + przykład. Zapomniałeś słowa? Powiedz to inaczej.',
  tryit:{q:'Answer out loud in 20 seconds: “Do you prefer studying alone or with friends? Why?” Use: opinion + reason + example.',speak:20,model:'I usually prefer studying alone, because I can concentrate better and work at my own speed. For example, before my last biology test I made my own flashcards and revised in my room. But for languages, practising with friends is more fun.'},
  g:{
   tasks:['A conversation with one examiner; a second teacher only listens and takes notes. About 15 minutes, the same for all candidates.','Warm-up (rozmowa wstępna, about 2 minutes): easy questions about you. It is not scored.','Task 1 – role-play (rozmowa z odgrywaniem roli): about 30 seconds to read, up to 4 minutes. Cover four points and react to the examiner.','Task 2 – picture (opis ilustracji): describe the picture, then answer three questions. Up to 3 minutes.','Task 3 – stimulus (materiał stymulujący): about 1 minute to prepare; choose an option, justify it, reject the others, answer two questions. Up to 5 minutes.','Marking: communication 0-6 for each task (18), range 0-4, accuracy 0-4, pronunciation 0-2, fluency 0-2 = 30 points.'],
   reward:['Real communication: answering the actual question, developing it and reacting to the examiner.','Covering all four role-play points – each missed point costs you in the biggest criterion.','Extended answers: opinion + reason + example beats three-word answers every time.','Repair skills: paraphrasing when you forget a word and keeping going.'],
   traps:['One-sentence answers – the examiner cannot reward language you never produce.','Reciting a memorised speech that does not fit the question.','Freezing when you forget a word. Say it another way (“the thing you use to...”) and continue.','In Task 3, forgetting to justify your choice and reject the other options.'],
   steps:['Warm-up: smile, breathe, answer in two or three sentences.','Role-play: read the four points, start politely, tick each point off in your head.','Picture: place → people → actions → details, then full answers to the three questions.','Stimulus: “I would choose A because... It is better than B and C, which...”. Choice, reason, rejection – every time.','Keep talking. Silence scores zero; a repaired sentence still scores.']}}
];

/* ---------------- styles ---------------- */
function injectStyle(){if(document.getElementById('mhStyle'))return;var s=document.createElement('style');s.id='mhStyle';s.textContent=[
'#eeMaturaBtn{position:fixed;right:18px;bottom:76px;z-index:2147482999;border:0;border-radius:999px;padding:13px 18px;background:#b51f2e;color:#fff;font:800 14px/1 system-ui;box-shadow:0 8px 24px #0003;cursor:pointer}',
'#eeMaturaModal{position:fixed;inset:0;z-index:2147483002;overflow:auto;background:#f7f8fb;color:#172033;font-family:Inter,system-ui,sans-serif;scroll-behavior:smooth;scroll-padding-top:120px}',
'#eeMaturaModal *{box-sizing:border-box}',
'.mp-top{position:sticky;top:0;z-index:5;background:#8f1724;color:#fff;box-shadow:0 2px 12px #0002}',
'.mp-topin{max-width:1120px;margin:auto;padding:12px 22px;display:flex;align-items:center;gap:12px}',
'.mp-top h1{margin:0;flex:1;font-size:19px;line-height:1.25}.mp-top h1 small{display:block;font-size:12px;font-weight:600;opacity:.8}',
'.mp-close{border:1px solid #fff7;background:#ffffff14;color:#fff;border-radius:9px;padding:9px 13px;cursor:pointer;font-weight:700}',
'.mp-nav{background:#fff;border-bottom:1px solid #e6d3d6}.mp-navin{max-width:1120px;margin:auto;padding:8px 22px;display:flex;gap:10px;align-items:center}.mp-links{display:flex;gap:8px;overflow-x:auto;scrollbar-width:thin;flex:1 1 auto;min-width:0;padding:2px 0}',
'.mp-nav a{flex:0 0 auto;text-decoration:none;color:#8f1724;font-weight:800;font-size:13px;padding:7px 11px;border-radius:999px;background:#fff1f3;border:1px solid #f2c4ca;white-space:nowrap}',
'.mp-nav a:hover,.mp-nav a.on{background:#8f1724;color:#fff}',
'.mp-lvl{display:flex;gap:4px;margin-left:auto;flex:0 0 auto;background:#f1f3f7;border-radius:999px;padding:3px}',
'.mp-lvl button{border:0;background:none;border-radius:999px;padding:6px 10px;font:700 12px system-ui;color:#3b4a60;cursor:pointer;white-space:nowrap}.mp-lvl button.on{background:#152f4f;color:#fff}',
'.mp-wrap{max-width:1120px;margin:auto;padding:24px 22px 70px}',
'.mp-sec{scroll-margin-top:120px}',
'.mp-hero{border-radius:20px;padding:26px;background:linear-gradient(135deg,#fff,#ffe6e9);border:1px solid #f2c4ca}',
'.mp-hero h2{font-size:28px;margin:0 0 6px}.mp-hero p{font-size:16px;line-height:1.55;max-width:880px;margin:6px 0}.mp-hero .pl,.mp-pl2{color:#5c6c81;font-size:14px;font-style:italic}',
'.mp-pills{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}.mp-pill{padding:7px 11px;border-radius:999px;background:#fff;border:1px solid #e9b5bb;font-weight:700;font-size:13px}',
'.mp-note{margin:16px 0 0;padding:12px 14px;border-left:5px solid #c92536;background:#fff;border-radius:8px;font-size:14px;line-height:1.5}',
'.mp-format{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin:22px 0}',
'.mp-format>div,.mp-card{background:#fff;border:1px solid #dfe5ee;border-radius:15px;padding:20px;box-shadow:0 5px 15px #1720330b}',
'.mp-format h3{margin:0 0 8px}.mp-format li{line-height:1.55;font-size:15px}.mp-format>div.dim{opacity:.4}',
'.mp-grid{display:grid;grid-template-columns:1fr;gap:18px}',
'.mp-card h3{margin:0;font-size:22px}.mp-card .mp-pl{color:#5c6c81;font-size:14px;font-style:italic;margin:2px 0 6px}',
'.mp-card .weight{color:#8f1724;font-weight:800;font-size:13px}',
'.mp-cardtop{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,1fr);gap:18px;align-items:start}',
'.mp-tip p{line-height:1.55;margin:8px 0 4px}',
'.mp-practice{background:#f2f6fb;border-radius:12px;padding:14px;font-size:14px;line-height:1.5}',
'.mp-practice input,.mp-practice textarea{width:100%;margin-top:8px;padding:9px 10px;border:1px solid #cfd8e4;border-radius:9px;font:inherit}',
'.mp-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:9px}',
'.mh-b{border:0;border-radius:999px;padding:8px 13px;font:800 13px system-ui;cursor:pointer;background:#152f4f;color:#fff}.mh-b.alt{background:#fff;color:#152f4f;border:1px solid #b8c6d8}.mh-b.red{background:#8f1724}',
'.mh-fb{font-weight:800;font-size:13px}.mh-fb.ok{color:#1c6b3f}.mh-fb.bad{color:#b4233d}',
'.mh-model{display:none;margin-top:8px;background:#ddf6e8;border-radius:9px;padding:10px;font-size:14px;line-height:1.5}.mh-model.show{display:block}',
'#eeMaturaModal details.mp-guide,#eeMaturaModal details.mp-ex{margin-top:14px;border:1px solid #e9b5bb;border-radius:12px;background:#fff}',
'#eeMaturaModal details.mp-ex{border-color:#b9cbe0}',
'#eeMaturaModal details.mp-guide>summary,#eeMaturaModal details.mp-ex>summary{list-style:none;cursor:pointer;padding:12px 14px;font:800 14px system-ui;color:#8f1724;display:flex;justify-content:space-between;gap:8px}',
'#eeMaturaModal details.mp-ex>summary{background:#173f68;color:#fff;border-radius:11px}',
'#eeMaturaModal details>summary::-webkit-details-marker{display:none}',
'#eeMaturaModal details.mp-guide>summary:after,#eeMaturaModal details.mp-ex>summary:after{content:"▾"}#eeMaturaModal details[open].mp-guide>summary:after,#eeMaturaModal details[open].mp-ex>summary:after{content:"▴"}',
'.mp-gbody{padding:4px 16px 14px;display:grid;grid-template-columns:1fr 1fr;gap:6px 22px}',
'.mp-gbody h4{margin:12px 0 6px;color:#8f1724;font-size:14px}.mp-gbody ul,.mp-gbody ol{margin:0;padding-left:20px}.mp-gbody li{margin:5px 0;line-height:1.5;font-size:14px}',
'.mp-exbody{padding:12px 14px 16px}',
'.mhx-blueprint{background:#e9f3ff;border-left:4px solid #1763a3;padding:11px;border-radius:8px;font-size:13px;line-height:1.45}',
'.mhx-task{margin-top:14px;border:1px solid #ccd8e6;border-radius:12px;padding:15px;background:#fbfdff}',
'.mhx-task h4{margin:8px 0 2px!important;color:#173f68!important;font-size:16px}.mhx-task .mh-tpl{color:#5c6c81;font-size:13px;font-style:italic;margin-bottom:6px}',
'.mhx-tags{display:flex;flex-wrap:wrap;gap:5px}.mhx-tags span{background:#e9edf4;border-radius:999px;padding:4px 8px;font-size:11px;font-weight:800}',
'.mhx-tags span.lv-P{background:#e3f4e8;color:#1c6b3f}.mhx-tags span.lv-R{background:#f6e4f3;color:#7a2a6e}.mhx-tags span.lv-PR{background:#fff1bd;color:#6b5200}',
'.mhx-inst{font-size:14px;background:#fff8df;border-radius:8px;padding:10px;line-height:1.5;margin:8px 0}.mhx-inst .pl{display:block;color:#6b5a1d;font-style:italic;font-size:13px;margin-top:3px}',
'.mhx-text{background:#fff;border:1px solid #e1e6ee;padding:12px 14px;border-radius:9px;font:15px/1.65 Georgia,serif;margin:8px 0}.mhx-text p{margin:0 0 9px}.mhx-text h5{margin:0 0 6px;font:800 14px system-ui}',
'.mh-q{margin:12px 0 4px}.mh-q>p{margin:0 0 6px;font-weight:700;font-size:14.5px;line-height:1.45}',
'.mh-opt{display:block;width:100%;text-align:left;border:1px solid #dfe5ee;background:#fff;border-radius:10px;padding:9px 11px;margin:5px 0;cursor:pointer;font:14px/1.4 system-ui;color:#172033}',
'.mh-opt:hover{border-color:#8aa2c0}.mh-opt.sel{border-color:#152f4f;background:#eef3fa;box-shadow:inset 0 0 0 1px #152f4f}',
'.mh-opt.ok{background:#ddf6e8;border-color:#5aa77b}.mh-opt.bad{background:#fff0f3;border-color:#d97b8c}',
'.mh-why{display:none;font-size:13px;color:#3b4a60;background:#f3f6fa;border-radius:8px;padding:8px 10px;margin-top:4px;line-height:1.45}.mh-done .mh-why{display:block}',
'.mh-opts{background:#f3f6fa;border-radius:9px;padding:10px 12px;font-size:14px;line-height:1.6;margin:8px 0}',
'.mh-in{padding:7px 9px;border:1px solid #cfd8e4;border-radius:8px;min-width:140px;max-width:100%;font:14px system-ui;margin:2px 3px}',
'.mh-sel{padding:7px 9px;border:1px solid #cfd8e4;border-radius:8px;background:#fff;font:700 14px system-ui;margin-left:6px}',
'.mh-in.ok,.mh-sel.ok{background:#ddf6e8;border-color:#5aa77b}.mh-in.bad,.mh-sel.bad{background:#fff0f3;border-color:#d97b8c}',
'.mh-line{font-size:14.5px;line-height:1.7;margin:8px 0}',
'.mh-score{font-weight:900;color:#152f4f;font-size:14px}',
'.mh-ta{width:100%;min-height:170px;padding:11px;border:1px solid #cfd8e4;border-radius:10px;font:15px/1.6 Georgia,serif;margin-top:8px}',
'.mh-wc{font-size:12px;font-weight:800;margin-top:4px;color:#68738d}.mh-wc.ok{color:#1c6b3f}.mh-wc.bad{color:#b4233d}',
'.mh-check{list-style:none;padding:0;margin:8px 0;font-size:14px}.mh-check li{margin:5px 0}.mh-check label{display:flex;gap:8px;align-items:flex-start;cursor:pointer;line-height:1.4}',
'.mh-phr{display:flex;flex-wrap:wrap;gap:6px;margin:8px 0}.mh-phr span{background:#eef3fa;border-radius:999px;padding:5px 10px;font-size:13px}',
'.mh-timer{font:900 26px system-ui;color:#152f4f;min-width:74px}.mh-timer.prep{color:#8a6a00}.mh-timer.end{color:#b4233d}',
'.mh-det{margin-top:10px;border-top:1px dashed #c9d3df;padding-top:8px;font-size:14px}.mh-det summary{cursor:pointer;font-weight:800;color:#8f1724}.mh-det .mh-detb{margin-top:6px;line-height:1.6;white-space:pre-line}',
'.wb-audio.mh-audio{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#e0f0ff;border-radius:12px;padding:10px 12px;margin:10px 0}',
'.mh-audio .mh-b{background:#152f4f;color:#fff}.mh-audio .mh-b.alt{background:#fff;color:#152f4f;border:1px solid #b8c6d8}.mh-audio select{border:0;border-radius:18px;padding:7px 10px;font-weight:800;background:#fff;color:#17244b}',
'.mh-audio label{font-size:12px;font-weight:800;color:#59657e}.mh-astat{font-size:13px;font-weight:800;color:#173f68;flex-basis:100%}',
'.mh-t-line{margin:4px 0}.mh-t-line b{color:#173f68}',
'.mh-filtered{display:none!important}',
'.mp-path{margin-top:26px;background:#152f4f;color:#fff;border-radius:17px;padding:24px}.mp-path h2{margin-top:0}.mp-weeks{display:grid;grid-template-columns:repeat(4,1fr);gap:11px}.mp-week{background:#ffffff13;border-radius:11px;padding:13px;line-height:1.5;font-size:14px}.mp-week strong{color:#ffd08a}.mp-week em{display:block;opacity:.75;font-size:13px;margin-top:4px}',
'.mp-source{margin-top:22px;color:#5c6c81;font-size:12px;line-height:1.5}',
'.mp-h2{margin:30px 0 4px}.mp-h2+.mp-pl2{margin:0 0 14px}',
'@media(max-width:820px){.mp-cardtop,.mp-gbody{grid-template-columns:1fr}.mp-weeks{grid-template-columns:1fr 1fr}}',
'@media(max-width:620px){.mp-format{grid-template-columns:1fr}.mp-weeks{grid-template-columns:1fr}.mp-wrap{padding:16px 12px 60px}.mp-topin,.mp-navin{padding-left:12px;padding-right:12px}.mp-hero{padding:18px}.mp-hero h2{font-size:22px}.mp-card{padding:15px}.mp-card h3{font-size:19px}.mhx-task{padding:12px}.mp-top h1{font-size:16px}#eeMaturaBtn{padding:11px 14px;font-size:13px}.mp-navin{flex-wrap:wrap;gap:6px}.mp-lvl{order:-1;width:100%;margin-left:0}.mp-lvl button{flex:1}.mp-links{width:100%}.mp-nav a{font-size:12px;padding:6px 9px}.mp-sec{scroll-margin-top:150px}#eeMaturaModal{scroll-padding-top:150px}}',
'@media print{.mh-audio,.mp-nav,.mp-practice .mp-row,.mhx-task .mp-row{display:none!important}.mh-filtered{display:none!important}}'
].join('\n');document.head.appendChild(s)}

/* ---------------- speech (exam-style audio) ---------------- */
var SPEECH={busy:null,timer:null};
function enVoices(){if(!window.speechSynthesis)return[];if(window.WBVoice){var pr=WBVoice.pair(),l=WBVoice.list(),o=[];[pr[0],pr[1]].concat(l).forEach(function(v){if(v&&o.indexOf(v)<0)o.push(v)});return o}var vs=speechSynthesis.getVoices().filter(function(v){return /^en[-_]/i.test(v.lang)});
 function sc(v){var n=0,nm=v.name||'';if(/natural|enhanced|premium|neural/i.test(nm))n+=100;if(/google (uk|us) english|microsoft (aria|jenny|guy|sonia|ryan|libby|emma|andrew)/i.test(nm))n+=50;if(/^en[-_]GB$/i.test(v.lang))n+=10;if(v.localService)n+=1;return n}
 return vs.sort(function(a,b){return sc(b)-sc(a)})}
function stopSpeech(){if(window.speechSynthesis)speechSynthesis.cancel();clearTimeout(SPEECH.timer);var b=SPEECH.busy;SPEECH.busy=null;if(b&&b.reset)b.reset()}
/* lines: [[speaker,text],...]; plays = 1 or 2; status callback */
function speakLines(lines,rate,plays,ctl){stopSpeech();if(!window.speechSynthesis){ctl.status('Audio is not available in this browser – use the transcript. / Audio niedostępne – skorzystaj z transkrypcji.');return}
 SPEECH.busy=ctl;var vs=enVoices(),speakers=[];lines.forEach(function(l){if(speakers.indexOf(l[0])<0)speakers.push(l[0])});
 var play=1,idx=0;
 function voiceFor(sp){var k=speakers.indexOf(sp);return {v:vs.length?vs[k%vs.length]:null,pitch:vs.length>k?1:[1,1.25,0.85,1.12][k%4]}}
 function next(){if(SPEECH.busy!==ctl)return;
  if(idx>=lines.length){if(play<plays){play++;idx=0;ctl.status('Pause… second listening in a moment / Przerwa… za chwilę drugie odtworzenie');SPEECH.timer=setTimeout(function(){if(SPEECH.busy!==ctl)return;ctl.status('▶ Listening 2 of 2 / Odtworzenie 2 z 2');next()},4000);return}
   SPEECH.busy=null;ctl.done();return}
  var l=lines[idx++],u=new SpeechSynthesisUtterance(l[1]),vp=voiceFor(l[0]);if(vp.v){u.voice=vp.v;u.lang=vp.v.lang}else u.lang='en-GB';u.pitch=vp.pitch;u.rate=rate;u.onend=function(){SPEECH.timer=setTimeout(next,350)};u.onerror=function(e){if(e&&e.error==='interrupted'||e&&e.error==='canceled')return;next()};speechSynthesis.speak(u)}
 ctl.status(plays>1?'▶ Listening 1 of 2 / Odtworzenie 1 z 2':'▶ Playing / Odtwarzanie');next()}
if(window.speechSynthesis&&speechSynthesis.onvoiceschanged!==undefined){speechSynthesis.getVoices()}
function audioBox(lines,opts){opts=opts||{};var id=nid('au');
 var html='<div class="wb-audio mh-audio" id="'+id+'"><button type="button" class="mh-b" data-a="two">▶ Play twice (exam) / Odtwórz 2×</button><button type="button" class="mh-b alt" data-a="one">Play once / 1×</button><label>Speed / Tempo <select><option value="0.85">0.85×</option><option value="1" selected>1.0×</option><option value="1.1">1.1×</option></select></label><span class="mh-astat" aria-live="polite">'+(opts.hint||'Read the questions first, then press play. / Najpierw przeczytaj pytania.')+'</span></div>';
 return {html:html,bind:function(root){var box=root.querySelector('#'+id);if(!box)return;var st=box.querySelector('.mh-astat'),two=box.querySelector('[data-a=two]'),one=box.querySelector('[data-a=one]'),sel=box.querySelector('select');
  function ctl(btn,label){return {status:function(t){st.textContent=t},reset:function(){two.textContent='▶ Play twice (exam) / Odtwórz 2×';one.textContent='Play once / 1×'},done:function(){this.reset();st.textContent='✓ Finished. Check your answers, then open the transcript. / Koniec – sprawdź odpowiedzi.';if(opts.onDone)opts.onDone()}}}
  two.onclick=function(){if(SPEECH.busy&&SPEECH.busy.btn===two){stopSpeech();st.textContent='Stopped. / Zatrzymano.';return}var c=ctl();c.btn=two;two.textContent='■ Stop / Zatrzymaj';speakLines(lines,+sel.value,2,c)};
  one.onclick=function(){if(SPEECH.busy&&SPEECH.busy.btn===one){stopSpeech();st.textContent='Stopped. / Zatrzymano.';return}var c=ctl();c.btn=one;one.textContent='■ Stop / Zatrzymaj';speakLines(lines,+sel.value,1,c)}}}}

/* ---------------- answer checking ---------------- */
function norm(s){s=String(s||'').toLowerCase().replace(/[’‘`´]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim().replace(/[.!,;:]+$/,'').trim();
 s=s.replace(/\bwon't\b/g,'will not').replace(/\bcan't\b/g,'cannot').replace(/\bshan't\b/g,'shall not').replace(/n't\b/g,' not').replace(/'ve\b/g,' have').replace(/'re\b/g,' are').replace(/'ll\b/g,' will').replace(/'m\b/g,' am').replace(/\bcan not\b/g,'cannot');
 return s.replace(/\s+/g,' ').trim()}
function isOk(v,acc){var n=norm(v);if(!n)return false;return acc.some(function(a){return norm(a)===n})}

/* ---------------- task renderers ---------------- */
var LV={P:'Podstawowy',R:'Rozszerzony',PR:'Both levels / Oba poziomy'};
function head(t){return '<div class="mhx-tags"><span class="lv-'+t.level+'">'+LV[t.level]+'</span>'+(t.time?'<span>⏱ '+esc(t.time)+'</span>':'')+(t.pts?'<span>'+esc(t.pts)+'</span>':'')+'</div><h4>'+esc(t.title)+'</h4>'+(t.pl?'<div class="mh-tpl">'+esc(t.pl)+'</div>':'')+'<div class="mhx-inst">'+esc(t.inst)+(t.instPl?'<span class="pl">'+esc(t.instPl)+'</span>':'')+'</div>'}
function textBlock(t){if(!t.text)return '';var paras=String(t.text).split(/\n\n/);return '<div class="mhx-text">'+(t.textTitle?'<h5>'+esc(t.textTitle)+'</h5>':'')+paras.map(function(p){return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>'}).join('')+'</div>'}
function details(sum,body,cls){return '<details class="mh-det '+(cls||'')+'"><summary>'+sum+'</summary><div class="mh-detb">'+body+'</div></details>'}
function transcript(lines){return details('Transcript / Transkrypcja (after listening / po wysłuchaniu)',lines.map(function(l){return '<div class="mh-t-line">'+(l[0]?'<b>'+esc(l[0])+':</b> ':'')+esc(l[1])+'</div>'}).join(''),'mh-trans')}
function btnRow(extra){return '<div class="mp-row"><button type="button" class="mh-b" data-act="check">Check / Sprawdź</button><button type="button" class="mh-b alt" data-act="reset">Try again / Od nowa</button>'+(extra||'')+'<span class="mh-score" aria-live="polite"></span></div>'}

function renderMC(t){return t.qs.map(function(q,i){return '<div class="mh-q" data-a="'+q.a+'"><p>'+(i+1)+'. '+esc(q.q)+'</p>'+q.o.map(function(o,j){return '<button type="button" class="mh-opt" data-j="'+j+'">'+String.fromCharCode(65+j)+'. '+esc(o)+'</button>'}).join('')+(q.why?'<div class="mh-why">💡 '+esc(q.why)+'</div>':'')+'</div>'}).join('')+btnRow()}
function bindMC(el){el.querySelectorAll('.mh-q').forEach(function(q){q.querySelectorAll('.mh-opt').forEach(function(b){b.onclick=function(){if(q.classList.contains('mh-done'))return;q.querySelectorAll('.mh-opt').forEach(function(x){x.classList.remove('sel')});b.classList.add('sel')}})});
 return {check:function(){var sc=0,n=0;el.querySelectorAll('.mh-q').forEach(function(q){n++;var a=+q.dataset.a,s=q.querySelector('.mh-opt.sel');q.classList.add('mh-done');q.querySelectorAll('.mh-opt').forEach(function(x){if(+x.dataset.j===a)x.classList.add('ok')});if(s&&+s.dataset.j===a)sc++;else if(s)s.classList.add('bad')});return [sc,n]},
  reset:function(){el.querySelectorAll('.mh-q').forEach(function(q){q.classList.remove('mh-done');q.querySelectorAll('.mh-opt').forEach(function(x){x.classList.remove('sel','ok','bad')})})}}}

function renderMatch(t){var L=t.opts.map(function(o,i){return String.fromCharCode(65+i)});
 return '<div class="mh-opts"><b>'+esc(t.optsLabel||'Options / Opcje')+':</b><br>'+t.opts.map(function(o,i){return '<b>'+L[i]+'.</b> '+esc(o)}).join('<br>')+'</div>'+
 t.rows.map(function(r,i){return '<div class="mh-line" data-a="'+t.a[i]+'"><b>'+esc(t.rowLabels?t.rowLabels[i]:(i+1)+'.')+'</b> '+esc(r)+' <select class="mh-sel" aria-label="Answer '+(i+1)+'"><option value="">?</option>'+L.map(function(x,k){return '<option value="'+k+'">'+x+'</option>'}).join('')+'</select></div>'}).join('')+
 (t.why?'<div class="mh-why">💡 '+esc(t.why)+'</div>':'')+btnRow()}
function bindMatch(el){return {check:function(){var sc=0,n=0;el.querySelectorAll('.mh-line').forEach(function(r){n++;var s=r.querySelector('select');var ok=s.value!==''&&+s.value===+r.dataset.a;s.classList.remove('ok','bad');s.classList.add(ok?'ok':'bad');if(ok)sc++});el.classList.add('mh-done');return [sc,n]},
 reset:function(){el.classList.remove('mh-done');el.querySelectorAll('select').forEach(function(s){s.value='';s.classList.remove('ok','bad')})},
 key:function(){var L='ABCDEFGH';return Array.prototype.map.call(el.querySelectorAll('.mh-line'),function(r,i){return (i+1)+' '+L[+r.dataset.a]}).join(' · ')}}}

function renderGap(t){return t.items.map(function(it,i){var inp='<input class="mh-in" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="Gap '+(i+1)+'">',pre=it.pre||'',line=pre.indexOf('_____')>=0?pre.split('_____').map(esc).join(inp)+(it.post?' '+esc(it.post):''):esc(pre)+' '+inp+' '+esc(it.post||'');return '<div class="mh-line" data-i="'+i+'"><b>'+(i+1)+'.</b> '+line+(it.why?'<div class="mh-why">✔ '+esc(it.a[0])+' – '+esc(it.why)+'</div>':'<div class="mh-why">✔ '+esc(it.a.join(' / '))+'</div>')+'</div>'}).join('')+btnRow('<button type="button" class="mh-b alt" data-act="key">Show key / Klucz</button>')}
function bindGap(el,t){return {check:function(){var sc=0;el.querySelectorAll('.mh-line').forEach(function(r){var it=t.items[+r.dataset.i],inp=r.querySelector('input'),ok=isOk(inp.value,it.a);inp.classList.remove('ok','bad');inp.classList.add(ok?'ok':'bad');if(ok)sc++});el.classList.add('mh-done');return [sc,t.items.length]},
 reset:function(){el.classList.remove('mh-done');el.querySelectorAll('input').forEach(function(i){i.value='';i.classList.remove('ok','bad')})},
 showKey:function(){el.classList.add('mh-done')}}}

function renderWrite(t){var id=nid('wc');return '<div class="mh-phr">'+(t.phrases||[]).map(function(p){return '<span>'+esc(p)+'</span>'}).join('')+'</div><textarea class="mh-ta" data-min="'+t.min+'" data-max="'+t.max+'" placeholder="Write here… / Pisz tutaj…"></textarea><div class="mh-wc" id="'+id+'">0 words / słów · target '+t.min+'-'+t.max+'</div>'+
 '<p style="margin:12px 0 2px;font-weight:800;font-size:14px">Self-check before you finish / Sprawdź przed oddaniem:</p><ul class="mh-check">'+t.check.map(function(c){return '<li><label><input type="checkbox"> <span>'+esc(c)+'</span></label></li>'}).join('')+'</ul>'+
 details('Model answer / Przykładowa odpowiedź',esc(t.model))+(t.notes?details('Why it scores / Dlaczego to działa',esc(t.notes)):'')}
function bindWrite(el){var ta=el.querySelector('textarea'),wc=el.querySelector('.mh-wc');ta.oninput=function(){var w=(ta.value.trim().match(/\S+/g)||[]).length,mn=+ta.dataset.min,mx=+ta.dataset.max;wc.textContent=w+' words / słów · target '+mn+'-'+mx;wc.className='mh-wc'+(w===0?'':(w>=mn&&w<=mx?' ok':' bad'))}}

function renderSpeak(t){return '<div class="mh-opts">'+t.prompts.map(function(p){return '<div>'+esc(p)+'</div>'}).join('')+'</div>'+(t.phrases?'<div class="mh-phr">'+t.phrases.map(function(p){return '<span>'+esc(p)+'</span>'}).join('')+'</div>':'')+
 '<div class="mp-row"><button type="button" class="mh-b red" data-act="timer">⏱ Start '+(t.prep?'('+t.prep+' s prep + '+t.talk+' s)':'('+t.talk+' s)')+'</button><span class="mh-timer" aria-live="polite"></span>'+(t.examiner?'<button type="button" class="mh-b alt" data-act="examiner">🔊 Examiner speaks (1/'+t.examiner.length+') / Egzaminator</button>':'')+'</div>'+
 details('Model answer / Przykładowa odpowiedź',esc(t.model))}
var TIMERS=[];
function bindSpeak(el,t){var b=el.querySelector('[data-act=timer]'),out=el.querySelector('.mh-timer'),iv=null;
 function stop(){clearInterval(iv);iv=null;b.textContent='⏱ Start again / Jeszcze raz'}
 b.onclick=function(){if(iv){stop();out.textContent='';return}var phase=t.prep?'prep':'talk',n=t.prep||t.talk;b.textContent='■ Stop';function draw(){out.className='mh-timer'+(phase==='prep'?' prep':'');out.textContent=(phase==='prep'?'Prep ':'Speak ')+n+'s'}draw();iv=setInterval(function(){n--;if(n<=0){if(phase==='prep'){phase='talk';n=t.talk}else{stop();out.className='mh-timer end';out.textContent='Time! / Koniec!';return}}draw()},1000);TIMERS.push(function(){clearInterval(iv)})};
 var ex=el.querySelector('[data-act=examiner]'),k=0;if(ex)ex.onclick=function(){var line=t.examiner[k%t.examiner.length];k++;ex.textContent='🔊 Examiner speaks ('+((k%t.examiner.length)+1)+'/'+t.examiner.length+') / Egzaminator';var c={status:function(){},reset:function(){},done:function(){}};speakLines([['Examiner',line]],0.95,1,c)}}

function renderTask(t,part){var body='',lines=t.script||null,au=null;
 if(lines){au=audioBox(lines)}
 body+=head(t)+(au?au.html:'')+textBlock(t);
 if(t.type==='mc')body+=renderMC(t);else if(t.type==='match')body+=renderMatch(t);else if(t.type==='gap')body+=renderGap(t);else if(t.type==='write')body+=renderWrite(t);else if(t.type==='speak')body+=renderSpeak(t);
 if(lines)body+=transcript(lines);
 if(t.tip)body+='<div class="mh-why" style="display:block;margin-top:10px">🎯 '+esc(t.tip)+'</div>';
 return {html:'<article class="mhx-task" data-level="'+t.level+'" data-type="'+t.type+'">'+body+'</article>',au:au}}
function bindTask(el,t,au){var api=null;
 if(t.type==='mc')api=bindMC(el);else if(t.type==='match')api=bindMatch(el);else if(t.type==='gap')api=bindGap(el,t);else if(t.type==='write')bindWrite(el);else if(t.type==='speak')bindSpeak(el,t);
 if(au)au.bind(el);
 if(!api)return;var sc=el.querySelector('.mh-score');
 el.querySelector('[data-act=check]').onclick=function(){var r=api.check();sc.textContent=r[0]+'/'+r[1]+(r[0]===r[1]?' 🎉 Excellent! / Świetnie!':(r[0]>=r[1]/2?' – good, check the tips / dobrze, przeczytaj wskazówki':' – read the tips and try again / spróbuj jeszcze raz'));if(api.key)sc.textContent+=' · Key: '+api.key()};
 el.querySelector('[data-act=reset]').onclick=function(){api.reset();sc.textContent=''};
 var k=el.querySelector('[data-act=key]');if(k)k.onclick=function(){api.showKey()}}

/* ---------------- Try it ---------------- */
function tryHtml(p){var t=p.tryit,id='mpTry-'+p.id,au=t.audio?audioBox([['',t.audio]],{hint:'Press play, then answer. / Posłuchaj i odpowiedz.'}):null;
 var inner='<strong>Try it now / Spróbuj teraz</strong><br>'+esc(t.q)+(au?au.html:'');
 if(t.accept)inner+='<input type="text" autocomplete="off" aria-label="Your answer" placeholder="Your answer / Twoja odpowiedź"><div class="mp-row"><button type="button" class="mh-b" data-act="tcheck">Check / Sprawdź</button><button type="button" class="mh-b alt" data-act="tshow">Show answer / Pokaż</button><span class="mh-fb" aria-live="polite"></span></div>';
 else if(t.open)inner+='<textarea rows="3" placeholder="Write 2 sentences… / Napisz 2 zdania…"></textarea><div class="mp-row"><button type="button" class="mh-b alt" data-act="tshow">Compare with the model / Porównaj</button></div>';
 else if(t.speak)inner+='<div class="mp-row"><button type="button" class="mh-b red" data-act="tspeak">⏱ Start '+t.speak+' s</button><span class="mh-timer" aria-live="polite"></span><button type="button" class="mh-b alt" data-act="tshow">Model / Wzór</button></div>';
 inner+='<div class="mh-model">✔ '+esc(t.model)+'</div>';
 return {html:'<div class="mp-practice" id="'+id+'">'+inner+'</div>',bind:function(root){var box=root.querySelector('#'+id);if(!box)return;if(au)au.bind(box);var m=box.querySelector('.mh-model'),fb=box.querySelector('.mh-fb');
  var sh=box.querySelector('[data-act=tshow]');if(sh)sh.onclick=function(){m.classList.toggle('show')};
  var ck=box.querySelector('[data-act=tcheck]');if(ck){var inp=box.querySelector('input');var go=function(){var ok=isOk(inp.value,t.accept);fb.className='mh-fb '+(ok?'ok':'bad');fb.textContent=ok?'✓ Correct! / Dobrze!':'✗ Not quite – try again or show the answer. / Spróbuj jeszcze raz.';if(ok)m.classList.add('show')};ck.onclick=go;inp.onkeydown=function(e){if(e.key==='Enter')go()}}
  var spk=box.querySelector('[data-act=tspeak]');if(spk){var out=box.querySelector('.mh-timer'),iv=null;spk.onclick=function(){clearInterval(iv);var n=t.speak;out.className='mh-timer';out.textContent=n+'s';iv=setInterval(function(){n--;if(n<=0){clearInterval(iv);out.className='mh-timer end';out.textContent='Time! / Koniec!';m.classList.add('show');return}out.textContent=n+'s'},1000);TIMERS.push(function(){clearInterval(iv)})}}
 }}}

/* ---------------- level filter ---------------- */
function applyLevel(m,lv){m.querySelectorAll('.mp-lvl button').forEach(function(b){b.classList.toggle('on',b.dataset.lv===lv)});
 m.querySelectorAll('.mhx-task').forEach(function(el){var l=el.dataset.level;el.classList.toggle('mh-filtered',lv!=='all'&&l!=='PR'&&l!==lv)});
 m.querySelectorAll('.mp-format>div').forEach(function(d){d.classList.toggle('dim',lv!=='all'&&d.dataset.lv!==lv)});
 m.querySelectorAll('details.mp-ex').forEach(function(d){var n=d.querySelectorAll('.mhx-task:not(.mh-filtered)').length;var c=d.querySelector('.mp-excount');if(c)c.textContent=n});
 lsSet(LEVEL_KEY,lv)}

/* ---------------- build ---------------- */
function build(m){
 var binders=[];
 var nav=PARTS.map(function(p){return '<a href="#mp-'+p.id+'" data-target="mp-'+p.id+'">'+p.i+' '+p.t+'</a>'}).join('')+'<a href="#mp-plan" data-target="mp-plan">🗓️ Plan</a>';
 var cards=PARTS.map(function(p){var tr=tryHtml(p);binders.push(tr.bind);var tasks=WBM.tasks[p.id]||[];var bp=WBM.blueprints&&WBM.blueprints[p.id];
  var rendered=tasks.map(function(t){var r=renderTask(t,p);binders.push(function(root){});return {t:t,r:r}});
  var exHtml=tasks.length?'<details class="mp-ex"><summary><span>📝 Exam-style exercises / Ćwiczenia egzaminacyjne (<span class="mp-excount">'+tasks.length+'</span>)</span></summary><div class="mp-exbody">'+(bp?'<div class="mhx-blueprint"><strong>CKE blueprint / Budowa tej części:</strong> '+esc(bp)+'</div>':'')+rendered.map(function(x){return x.r.html}).join('')+'</div></details>':'';
  p._rendered=rendered;
  return '<article class="mp-card mp-sec" id="mp-'+p.id+'"><div class="mp-cardtop"><div class="mp-tip"><h3>'+p.i+' '+p.t+'</h3><div class="mp-pl">'+p.pl+'</div><div class="weight">'+esc(p.w)+'</div><p>'+esc(p.tip)+'</p><div class="mp-pl2">'+esc(p.tipPl)+'</div></div>'+tr.html+'</div>'+
  '<details class="mp-guide"><summary><span>📘 Full section guide / Pełny przewodnik</span></summary><div class="mp-gbody"><div><h4>What the tasks are / Zadania</h4>'+list(p.g.tasks)+'<h4>What examiners reward / Co jest nagradzane</h4>'+list(p.g.reward)+'</div><div><h4>Common traps / Typowe pułapki</h4>'+list(p.g.traps)+'<h4>Step by step / Krok po kroku</h4>'+list(p.g.steps,true)+'</div></div></details>'+exHtml+'</article>'}).join('');
 m.innerHTML='<header class="mp-top"><div class="mp-topin"><h1>🎓 Matura – English EAL<small>Matura z języka angielskiego · formuła 2023</small></h1><button class="mp-close" id="mpClose" type="button">Close / Zamknij ×</button></div><nav class="mp-nav" aria-label="Exam parts"><div class="mp-navin"><div class="mp-links">'+nav+'</div><div class="mp-lvl" role="group" aria-label="Level / Poziom"><button type="button" data-lv="all">All / Wszystko</button><button type="button" data-lv="P">Podstawowy</button><button type="button" data-lv="R">Rozszerzony</button></div></div></nav></header>'+
 '<main class="mp-wrap"><section class="mp-hero"><h2>Your English Matura hub 🇵🇱</h2><p>Understand each part of the exam, practise real task types with instant checking, and listen to recordings played twice – just like on exam day.</p><div class="pl">Poznaj każdą część egzaminu, ćwicz zadania jak na maturze ze sprawdzaniem odpowiedzi i słuchaj nagrań odtwarzanych dwa razy – tak jak na egzaminie.</div><div class="mp-pills"><span class="mp-pill">Podstawowy: B1/B1+ · 120 min</span><span class="mp-pill">Rozszerzony: B2/B2+ · 150 min</span><span class="mp-pill">Written + oral / Pisemny + ustny</span><span class="mp-pill">Choose your level above ↑ / Wybierz poziom</span></div><div class="mp-note"><strong>2027 basis / Podstawa:</strong> the exam follows formuła 2023 and the CKE Informator for English from the 2024/2025 school year. Always confirm your subjects, dates and accommodations with your school and current CKE announcements. / Zawsze potwierdź szczegóły w szkole i w komunikatach CKE.</div></section>'+
 '<section class="mp-format"><div data-lv="P"><h3>Poziom podstawowy – 120 min · 60 pts</h3><ul><li>Listening / Słuchanie: ~25 min, played twice – 15 pts</li><li>Reading / Czytanie: ~1,100-1,500 words – 20 pts</li><li>Use of English / Środki językowe – 13 pts</li><li>Writing / Pisanie: email, blog or forum post, 100-150 words – 12 pts</li></ul></div><div data-lv="R"><h3>Poziom rozszerzony – 150 min · 60 pts</h3><ul><li>Listening / Słuchanie: ~30 min, played twice – 15 pts</li><li>Reading / Czytanie: ~1,400-1,800 words – 18 pts</li><li>Use of English / Środki językowe – 14 pts</li><li>Writing / Pisanie: formal letter, essay or article, 200-250 words – 13 pts</li></ul></div></section>'+
 '<h2 class="mp-h2">Prepare each exam part</h2><div class="mp-pl2">Przygotuj się do każdej części egzaminu</div><section class="mp-grid">'+cards+'</section>'+
 '<section class="mp-path mp-sec" id="mp-plan"><h2>🗓️ 4-week plan / Plan na 4 tygodnie</h2><div class="mp-weeks"><div class="mp-week"><strong>Week 1 – Diagnose</strong><br>Do one timed CKE paper. Mark errors by part: listening, reading, use of English, writing, speaking.<em>Tydzień 1: zrób próbny arkusz na czas i zapisz błędy.</em></div><div class="mp-week"><strong>Week 2 – Build</strong><br>Work through the exercises above at your level. Keep a phrase and error notebook.<em>Tydzień 2: ćwiczenia na Twoim poziomie + zeszyt błędów.</em></div><div class="mp-week"><strong>Week 3 – Produce</strong><br>Alternate timed writing with the oral tasks: role-play, picture, stimulus.<em>Tydzień 3: pisanie na czas i zadania ustne.</em></div><div class="mp-week"><strong>Week 4 – Simulate</strong><br>Full sections in exam time. Review recurring errors and your calm-start routine.<em>Tydzień 4: pełne części w czasie egzaminu.</em></div></div></section>'+
 '<p class="mp-source">Task types, timing and marking on this page are based on the official CKE “Informator o egzaminie maturalnym z języka angielskiego od roku szkolnego 2024/2025” (cke.gov.pl – formuła 2023). All exercises are original WordBloom practice material, not official CKE papers. / Ćwiczenia są autorskimi materiałami WordBloom, nie oficjalnymi arkuszami CKE.</p></main>';
 binders.forEach(function(b){b(m)});
 PARTS.forEach(function(p){var card=m.querySelector('#mp-'+p.id);var els=card.querySelectorAll('.mhx-task');(p._rendered||[]).forEach(function(x,i){if(els[i])bindTask(els[i],x.t,x.r.au)})});
 /* nav */
 m.querySelectorAll('.mp-nav a').forEach(function(a){a.onclick=function(e){e.preventDefault();var el=m.querySelector('#'+a.dataset.target);if(el)el.scrollIntoView({behavior:'smooth',block:'start'})}});
 m.addEventListener('scroll',function(){var cur=null;m.querySelectorAll('.mp-sec').forEach(function(s){if(s.getBoundingClientRect().top<160)cur=s.id});m.querySelectorAll('.mp-nav a').forEach(function(a){a.classList.toggle('on',a.dataset.target===cur)})},{passive:true});
 m.querySelectorAll('.mp-lvl button').forEach(function(b){b.onclick=function(){applyLevel(m,b.dataset.lv)}});
 applyLevel(m,lsGet(LEVEL_KEY)||'all');
 m.querySelector('#mpClose').onclick=close;
}
function close(){var m=document.getElementById('eeMaturaModal');if(!m)return;stopSpeech();TIMERS.forEach(function(f){f()});TIMERS=[];m.style.display='none';document.documentElement.style.overflow='';var b=document.getElementById('eeMaturaBtn');if(b)b.focus()}
function open(){var m=document.getElementById('eeMaturaModal');if(!m){m=document.createElement('section');m.id='eeMaturaModal';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-label','Matura – English EAL');document.body.appendChild(m);build(m)}
 m.style.display='block';document.documentElement.style.overflow='hidden';var c=m.querySelector('#mpClose');if(c)c.focus()}
document.addEventListener('keydown',function(e){if(e.key!=='Escape')return;var m=document.getElementById('eeMaturaModal');if(m&&m.style.display!=='none')close()});
WBM.open=open;

function init(){injectStyle();if(document.getElementById('eeMaturaBtn'))return;var b=document.createElement('button');b.id='eeMaturaBtn';b.type='button';b.textContent='🎓 Matura z angielskiego';b.setAttribute('aria-label','Open Matura – English EAL exam preparation / Otwórz przygotowanie do matury');b.onclick=open;document.body.appendChild(b);homeCard()}
/* Matura card on the Home page */
function homeCard(){var g=document.querySelector('#home .section.grid');if(!g){setTimeout(homeCard,300);return}if(document.getElementById('eeMaturaHome'))return;
 var st=document.createElement('style');st.textContent='#eeMaturaHome{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;background:linear-gradient(90deg,#fff5f6,#fff);border-left:6px solid #b51f2e}#eeMaturaHome h3{margin:0 0 6px}#eeMaturaHome p{margin:0 0 4px}#eeMaturaHome .btn{background:#b51f2e;color:#fff;border:0;white-space:nowrap}';document.head.appendChild(st);
 var c=document.createElement('div');c.className='card';c.id='eeMaturaHome';
 c.innerHTML='<div><h3>🎓 Matura z angielskiego / English Matura</h3><p>Every exam part explained, with interactive exam-style tasks, listening played twice and model answers.</p><div class="pl">Wszystkie części egzaminu: zadania ze sprawdzaniem, nagrania odtwarzane dwa razy i wzorcowe odpowiedzi.</div></div><button class="btn" type="button">Przygotuj się / Start →</button>';
 c.querySelector('button').onclick=function(){var b=document.getElementById('eeMaturaBtn');if(b)b.click()};
 g.appendChild(c)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
