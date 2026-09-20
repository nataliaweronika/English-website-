(function(){
'use strict';

var REG={};
function style(){var s=document.createElement('style');s.textContent=[
'.mx-wrap{margin-top:34px;border-top:2px dashed #d9ddec;padding-top:6px}',
'.mx-head{margin:14px 0 6px}',
'.mx-tag{display:inline-block;background:#152f4f;color:#fff;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:900;letter-spacing:1.2px}',
'.mx-note{background:#fff7d9;border:1px solid #efe3ae;border-radius:13px;padding:12px;margin:12px 0;font-size:14px}',
'.mx-q{margin-top:10px}',
'.mx-in{padding:8px 10px;border:1px solid #e5e8f1;border-radius:9px;min-width:150px;margin:2px 4px}',
'.mx-sel{padding:8px 10px;border:1px solid #e5e8f1;border-radius:9px;background:#fff;margin-left:8px}',
'.mx-ok{background:#ddf6e8!important}',
'.mx-bad{background:#fff0f3!important}',
'.mx-res{font-weight:800;margin-left:10px}',
'.mx-script{font-family:Georgia;font-size:15.5px;background:#fbfbfe;border-left:4px solid #5968e8;padding:16px;border-radius:10px;line-height:1.6;margin:10px 0}',
'.mx-model{font-family:Georgia;background:#fbfbfe;border-left:4px solid #ff9fc8;padding:16px;border-radius:10px;line-height:1.65;margin-top:10px;white-space:pre-line}',
'.mx-wc{font-size:12px;color:#68738d;margin-top:4px}'
].join('');document.head.appendChild(s)}

window.mxPick=function(b){var p=b.parentElement;var all=p.querySelectorAll('.choice');for(var k=0;k<all.length;k++){all[k].classList.remove('correct','wrong')}b.classList.add(b.getAttribute('data-ok')==='1'?'correct':'wrong')};
window.mxKey=function(id){var el=document.getElementById(id);if(el)el.classList.toggle('show')};
window.mxGap=function(gid){var ans=REG[gid],score=0;for(var i=0;i<ans.length;i++){var el=document.getElementById(gid+'-'+i);if(!el)continue;var v=(el.value||'').trim().toLowerCase().replace(/\s+/g,' ');var ok=ans[i].some(function(a){return v===a});el.classList.remove('mx-ok','mx-bad');el.classList.add(ok?'mx-ok':'mx-bad');if(ok)score++}document.getElementById(gid+'r').textContent=score+'/'+ans.length};
window.mxMatch=function(gid){var ans=REG[gid],score=0;for(var i=0;i<ans.length;i++){var el=document.getElementById(gid+'-'+i);if(!el)continue;var ok=(el.selectedIndex-1)===ans[i];el.classList.remove('mx-ok','mx-bad');el.classList.add(ok?'mx-ok':'mx-bad');if(ok)score++}document.getElementById(gid+'r').textContent=score+'/'+ans.length};
window.mxWC=function(ta,id){var w=(ta.value.trim().match(/\S+/g)||[]).length;var el=document.getElementById(id);if(el)el.textContent=w+' words / słów'};

function mc(qs){return qs.map(function(q,i){return '<div class="mx-q"><p><b>'+(i+1)+'. '+q.q+'</b></p>'+q.opts.map(function(o,j){return '<button type="button" class="choice" data-ok="'+(j===q.a?1:0)+'" onclick="mxPick(this)">'+String.fromCharCode(65+j)+'. '+o+'</button>'}).join('')+'</div>'}).join('')}

function gaps(gid,items){
 REG[gid]=items.map(function(it){return it.ans.map(function(a){return a.toLowerCase()})});
 var rows=items.map(function(it,i){return '<p>'+(i+1)+'. '+it.pre+' <input class="mx-in" id="'+gid+'-'+i+'" autocomplete="off" autocapitalize="off"> '+it.post+'</p>'}).join('');
 var key=items.map(function(it,i){return (i+1)+'. '+it.ans[0]}).join('<br>');
 return rows+'<button class="btn secondary" onclick="mxGap(\''+gid+'\')">Check / Sprawdź</button> <button class="btn secondary" onclick="mxKey(\''+gid+'k\')">Show key / Pokaż klucz</button><span class="mx-res" id="'+gid+'r"></span><div class="answer" id="'+gid+'k"><b>Key / Klucz:</b><br>'+key+'</div>';
}

function matchSel(gid,rows,opts,answers,labels){
 REG[gid]=answers;
 var letters=opts.map(function(o,i){return String.fromCharCode(65+i)});
 var list='<div class="callout"><b>Options / Opcje:</b><br>'+opts.map(function(o,i){return '<b>'+letters[i]+'.</b> '+o}).join('<br>')+'</div>';
 var body=rows.map(function(r,i){
  var sel='<select class="mx-sel" id="'+gid+'-'+i+'"><option value="">?</option>'+letters.map(function(L){return '<option>'+L+'</option>'}).join('')+'</select>';
  return '<p><b>'+(labels?labels[i]:(i+1))+'. </b>'+r+' '+sel+'</p>';
 }).join('');
 var key=answers.map(function(a,i){return (labels?labels[i]:(i+1))+': '+letters[a]}).join(' · ');
 return list+body+'<button class="btn secondary" onclick="mxMatch(\''+gid+'\')">Check / Sprawdź</button> <button class="btn secondary" onclick="mxKey(\''+gid+'k\')">Show key / Pokaż klucz</button><span class="mx-res" id="'+gid+'r"></span><div class="answer" id="'+gid+'k"><b>Key / Klucz:</b> '+key+'</div>';
}

function head(title,pl,extra){return '<div class="mx-head"><span class="mx-tag">MATURA - ENGLISH EAL 🇵🇱</span><h2>'+title+'</h2><div class="pl">'+pl+'</div></div>'+(extra||'')}
function hubnote(){return '<div class="mx-note">Strategy guides for this exam part are in the <b>Matura - English EAL</b> hub (the floating button in the corner). / Strategie znajdziesz w centrum <b>Matura - English EAL</b> (przycisk w rogu ekranu).</div>'}
function block(sectionId,html){var sec=document.getElementById(sectionId);if(!sec)return;var d=document.createElement('div');d.className='mx-wrap';d.innerHTML=html;sec.appendChild(d)}

/* ================= LISTENING ================= */
var L1={q:'Why does the caller choose the afternoon group?',opts:['The morning group was cancelled.','It fits her son\'s timetable.','It is cheaper.'],a:1};
var L2={q:'How much will the caller pay if she registers before Friday?',opts:['128 zł.','140 zł.','160 zł.'],a:0};
var L3={q:'What must the boy bring?',opts:['His own goggles.','A swimming cap and a towel.','Sports shoes.'],a:1};
var L4={q:'Why is the first session in the small pool?',opts:['The main pool is being repaired.','The group is very small.','The water is warmer there.'],a:0};

var LSCRIPT1='<b>Receptionist:</b> Good morning, Westfield Sports Centre. How can I help you?<br><b>Caller:</b> Hi, I\'d like to ask about the Saturday swimming course for teenagers. Is it still possible to sign up?<br><b>Receptionist:</b> Let me check... The morning group is full, I\'m afraid, but there are three places left in the afternoon group, at 2 p.m.<br><b>Caller:</b> I see. My son finishes his extra maths class at half past one, so the afternoon group actually works better for us.<br><b>Receptionist:</b> Great. The course runs for eight weeks and costs 160 złotys. There\'s a 20% discount if you register before Friday.<br><b>Caller:</b> Oh, that\'s good to know. And does he need to bring anything?<br><b>Receptionist:</b> Just a swimming cap and a towel. We provide everything else. Oh, and the first session is in the small pool, not the main one, because of the repair work.<br><b>Caller:</b> Understood. I\'ll come and register this afternoon, then.';

var LS2=[
 'I used to memorise word lists, but I failed my first mock exam, so now I watch series with subtitles and note down five phrases a day.',
 'Every evening I play online games with people from other countries, and we chat in English. It doesn\'t feel like studying at all.',
 'My cousin and I meet twice a week on a video call and only speak English for half an hour. We correct each other\'s mistakes.',
 'For me, a notebook is everything. I write new grammar rules by hand and then make three example sentences for each one.'
];
var LOPTS2=['I learn best by writing things down.','I use English for fun every day.','I changed my method after a bad result.','I practise with another person regularly.','I plan to take an exam abroad.'];

var LSCRIPT3='Good morning, everyone. A few things about tomorrow\'s trip to the science museum. The bus leaves school at 8:15, so please be at the main entrance ten minutes earlier. The entrance tickets are already paid, but bring some money for lunch - there is a café on the second floor, or you can eat your own sandwiches in the garden. We will visit the space exhibition first because it closes at 1 p.m. for maintenance. Your worksheets must be finished before we return; you will need them for Monday\'s lesson. We\'ll be back at school at about half past four.';

var LGAPS=[
 {pre:'The bus leaves at',post:'',ans:['8:15','8.15','quarter past eight','eight fifteen']},
 {pre:'Students should arrive at the main entrance',post:'minutes before departure.',ans:['ten','10']},
 {pre:'Students can buy lunch in the',post:'on the second floor.',ans:['café','cafe']},
 {pre:'The space exhibition closes at',post:'for maintenance.',ans:['1 p.m.','1 pm','13:00','13.00','one','1']},
 {pre:'Students will need their worksheets for the lesson on',post:'.',ans:['monday']}
];

var listenHtml=head('Matura Listening practice 🎧','Rozumienie ze słuchu - ćwiczenia maturalne',hubnote())+
 '<article class="topic"><span class="leveltag">PODSTAWOWY · B1</span><h2>Set 1 - Multiple choice / Wybór wielokrotny</h2><p>Read the dialogue twice, like the double listening in the real exam, then answer.</p><div class="pl">Przeczytaj dialog dwa razy - tak jak dwukrotny odsłuch na egzaminie - i odpowiedz.</div><div class="mx-script">'+LSCRIPT1+'</div>'+mc([L1,L2,L3,L4])+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY · B1+</span><h2>Set 2 - Matching / Dobieranie</h2><p>Four speakers talk about how they learn English. Match each speaker (1-4) to the correct statement (A-E). One statement is extra.</p><div class="pl">Cztery osoby mówią o nauce angielskiego. Dopasuj osobę (1-4) do zdania (A-E). Jedno zdanie jest zbędne.</div><div class="mx-script"><b>Speaker 1:</b> '+LS2[0]+'<br><br><b>Speaker 2:</b> '+LS2[1]+'<br><br><b>Speaker 3:</b> '+LS2[2]+'<br><br><b>Speaker 4:</b> '+LS2[3]+'</div>'+matchSel('lm',LS2.map(function(s,i){return 'Speaker '+(i+1)}),LOPTS2,[2,1,3,0])+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY · B1</span><h2>Set 3 - Gap-fill / Uzupełnianie luk</h2><p>Read the announcement twice, then complete the sentences with 1-3 words. Spelling counts - just like in the exam.</p><div class="pl">Przeczytaj ogłoszenie dwa razy i uzupełnij zdania 1-3 słowami. Liczy się pisownia.</div><div class="mx-script">'+LSCRIPT3+'</div>'+gaps('lg',LGAPS)+'</article>';

/* ================= READING ================= */
var RTEXT='Ten years ago, the roof of the Markowskis\' apartment building in Poznań was just a grey space with antennas. Today it is a garden with tomatoes, herbs and even a few bee hives. The project started when a group of neighbours decided they wanted fresh vegetables without driving to a supermarket. At first, the building manager was against the idea. He worried about the weight of the soil and the cost of insurance. The neighbours did not give up: they invited an engineer to check the roof and promised to pay for everything themselves. After six months of discussions, the manager finally agreed.<br><br>The garden is now run by fourteen families. Each family looks after its own small section, but everyone shares the watering duties during the holidays. "The vegetables are nice," says Marta, one of the founders, "but the best thing is that we finally know our neighbours. Before, we just said a quick hello in the lift." The group organises monthly meetings where members exchange recipes and decide what to plant next season.<br><br>Not everything has been easy. Last summer, strong winds destroyed half of the plants, and the bees frightened some residents at first. The group solved the second problem by inviting a beekeeper to give a talk; now the residents are proud of "their" honey, which sells out at every local market.<br><br>Other buildings in the area have started to copy the idea, and the city council is preparing a small grant programme for similar projects. Marta hopes that in a few years, roof gardens will be as normal as balconies.';

var RQS=[
 {q:'At first, the building manager...',opts:['supported the garden immediately.','had doubts about the project.','asked an engineer for help.'],a:1},
 {q:'The neighbours got permission after they...',opts:['paid the manager extra money.','proved the roof was safe and covered the costs.','asked the city council for help.'],a:1},
 {q:'What does Marta value most about the garden?',opts:['cheaper vegetables','the contact with neighbours','selling honey at markets'],a:1},
 {q:'The residents\' attitude to the bees changed after...',opts:['a talk given by a specialist.','the honey sold well.','the bees were moved.'],a:0}
];

var RHP=[
 'Research on memory shows that twenty minutes of focused study every day is usually more effective than three hours the night before a test. Short, regular sessions give your brain time to move information into long-term memory.',
 'One of the best ways to check whether you really understand something is to explain it to another person. If you cannot explain a grammar rule to a friend in simple words, you probably do not understand it well enough yet.',
 'Many students keep their phone next to their books and check it every few minutes. Each short look costs more than a few seconds: your brain needs several minutes to return to deep focus. Leave the phone in another room.',
 'Students often study until late at night before an exam, but a tired brain remembers much less. A full night\'s sleep after studying helps the brain organise new information.'
];
var RHOPTS=['Sleep matters more than you think.','Technology can wait.','A mistake that changed everything.','Small sessions beat long ones.','Teach it to learn it.','The right place to work.'];

var RGTEXT='When Kasia moved to Dublin for a year, she expected the language to be the biggest problem. <b>(1) ___</b> Instead, everyday life brought different challenges. The accent was difficult at first, but people were patient and friendly. <b>(2) ___</b> She joined a running club in her second month, and most of her new friends come from there. Looking back, she says the year taught her more about herself than about English. <b>(3) ___</b> She recommends the experience to anyone who is not afraid of change.';
var RGOPTS=['Surprisingly, she could understand almost everyone from the first week.','Making friends turned out to be easier than she had feared.','She also became much more confident about trying new things.','The weather was exactly as bad as everyone had told her.'];

var readingHtml=head('Matura Reading practice 📖','Rozumienie tekstów pisanych - ćwiczenia maturalne',hubnote())+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY · B1-B2</span><h2>Set 1 - Multiple choice / Wybór wielokrotny</h2><p>Read the text, then choose the best answer. Underline the words that prove each answer.</p><div class="pl">Przeczytaj tekst i wybierz najlepszą odpowiedź. Podkreśl fragment, który ją potwierdza.</div><div class="readtext">'+RTEXT+'</div>'+mc(RQS)+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY · B1+</span><h2>Set 2 - Headings / Dopasowanie nagłówków</h2><p>Match the best heading (A-F) to each paragraph (1-4). Two headings are extra.</p><div class="pl">Dopasuj nagłówek (A-F) do akapitu (1-4). Dwa nagłówki są zbędne.</div>'+RHP.map(function(p,i){return '<div class="mx-script"><b>Paragraph '+(i+1)+'.</b> '+p+'</div>'}).join('')+matchSel('rh',RHP.map(function(p,i){return 'Paragraph '+(i+1)}),RHOPTS,[3,4,1,0])+'</article>'+
 '<article class="topic"><span class="leveltag">ROZSZERZONY · B2</span><h2>Set 3 - Missing sentences / Brakujące zdania</h2><p>Three sentences are missing from the text. Choose sentence A-D for each gap. One sentence is extra.</p><div class="pl">W tekście brakuje trzech zdań. Wybierz zdanie A-D do każdej luki. Jedno zdanie jest zbędne.</div><div class="readtext">'+RGTEXT+'</div>'+matchSel('rg',['Gap 1','Gap 2','Gap 3'],RGOPTS,[0,1,2])+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY</span><h2>Set 4 - Short answers / Odpowiedzi otwarte</h2><p>Answer in your own words, based on the "Gardens in the City" text in Set 1. Complete, precise answers only - like the open tasks in the real exam.</p><div class="pl">Odpowiedz własnymi słowami na podstawie tekstu z zestawu 1. Na egzaminie liczy się pełna, precyzyjna odpowiedź.</div><p><b>1. What two problems did the garden face last summer?</b></p><p><b>2. What is the city council planning to do?</b></p><button class="btn secondary" onclick="mxKey(\'ro\')">Show key / Pokaż klucz</button><div class="answer" id="ro"><b>Key / Klucz:</b><br>1. Strong winds destroyed half of the plants, and the bees frightened some residents.<br>2. It is preparing a small grant programme for similar (roof garden) projects.</div></article>';

/* ================= USE OF ENGLISH (GRAMMAR TAB) ================= */
var TRANS=[
 {s1:'I last saw Marta two years ago.',word:'SEEN',pre:'I have not',post:'two years.',ans:['seen marta for']},
 {s1:'Smoking is forbidden in this building.',word:'ALLOWED',pre:'You are not',post:'in this building.',ans:['allowed to smoke']},
 {s1:'"Why don\'t we visit the lake this weekend?" said Kasia.',word:'SUGGESTED',pre:'Kasia',post:'to the lake that weekend.',ans:['suggested going','suggested we go','suggested we should go','suggested that we go','suggested that we should go']},
 {s1:'I have never eaten sushi before.',word:'FIRST',pre:'This is the',post:'sushi.',ans:['first time i have eaten','first time i\'ve eaten','first time i have ever eaten']},
 {s1:'I am sure he took the train, because his car is in the garage.',word:'MUST',pre:'He',post:'the train, because his car is in the garage.',ans:['must have taken']}
];

var WF=[
 {pre:'Learning a language is a',post:'(CHALLENGE) experience...',ans:['challenging']},
 {pre:'...but also one of the most',post:'(REWARD) things you can do.',ans:['rewarding']},
 {pre:'Regular practice improves your',post:'(CONFIDENT) surprisingly quickly.',ans:['confidence']},
 {pre:'Many learners make the',post:'(MISTAKE) of waiting until they feel "ready" to speak.',ans:['mistake']},
 {pre:'In',post:'(REAL), you become ready by speaking.',ans:['reality']},
 {pre:'Choose materials that match your',post:'(PERSON) interests, and progress will feel natural.',ans:['personal']}
];

var TR=[
 {pre:'If I had known about the traffic,',post:'(wziąłbym pociąg).',ans:['i would have taken the train','i would have taken a train','i\'d have taken the train']},
 {pre:'The report',post:'(powinien zostać oddany) by Friday.',ans:['should be handed in','should be submitted','ought to be handed in']},
 {pre:'',post:'(Im więcej ćwiczysz,) the more confident you become.',ans:['the more you practise','the more you practice']},
 {pre:'He apologised',post:'(za to, że nie przyszedł).',ans:['for not coming','for not showing up','for not turning up']},
 {pre:'No sooner',post:'(dotarliśmy do domu) than it started to rain.',ans:['had we arrived home','had we got home','had we reached home']}
];

var UEMC=[
 {q:'When I moved flats last month, I ___ that I had far too many things.',opts:['realised','recognised','remembered'],a:0},
 {q:'I decided to ___ some of my old books to the local library.',opts:['borrow','donate','lend'],a:1},
 {q:'The librarian was ___ grateful that she invited me to their reading club.',opts:['so','such','too'],a:0},
 {q:'Now we meet every Thursday and I ___ forward to it all week.',opts:['look','wait','expect'],a:0}
];

var grammarHtml=head('Matura Use of English practice 🧩','Znajomość środków językowych - ćwiczenia maturalne',hubnote())+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY</span><h2>Set 1 - Transformations / Transformacje</h2><p>Complete the second sentence so it means the same as the first. Use the word in CAPITALS without changing it. Use 2-5 words.</p><div class="pl">Uzupełnij drugie zdanie tak, aby znaczyło to samo. Użyj słowa drukowanymi literami bez zmiany jego formy. Użyj 2-5 słów.</div>'+TRANS.map(function(t,i){return '<p><b>'+(i+1)+'. '+t.s1+'</b> <span class="leveltag">'+t.word+'</span><br>'+t.pre+' <input class="mx-in" id="tr-'+i+'" autocomplete="off" autocapitalize="off"> '+t.post+'</p>'}).join('')+'<button class="btn secondary" onclick="mxGap(\'tr\')">Check / Sprawdź</button> <button class="btn secondary" onclick="mxKey(\'trk\')">Show key / Pokaż klucz</button><span class="mx-res" id="trr"></span><div class="answer" id="trk"><b>Key / Klucz:</b><br>'+TRANS.map(function(t,i){return (i+1)+'. '+t.ans[0]}).join('<br>')+'</div></article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY</span><h2>Set 2 - Word formation / Słowotwórstwo</h2><p>Read the text about learning languages. Build the correct form of the word in CAPITALS for each gap.</p><div class="pl">Utwórz właściwą formę słowa podanego drukowanymi literami.</div>'+gaps('wf',WF)+'</article>'+
 '<article class="topic"><span class="leveltag">ROZSZERZONY · B2-C1</span><h2>Set 3 - Translation fragments / Tłumaczenie fragmentów</h2><p>Translate the Polish fragments into natural English so the whole sentence is correct.</p><div class="pl">Przetłumacz polskie fragmenty tak, aby całe zdanie było poprawne i naturalne.</div>'+gaps('tl',TR)+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY · B1</span><h2>Set 4 - Multiple choice / Wybór wielokrotny</h2><p>Choose the word that completes each sentence in the mini-story.</p><div class="pl">Wybierz słowo, które poprawnie uzupełnia zdanie.</div>'+mc(UEMC)+'</article>';

/* ================= VOCABULARY TAB ================= */
var COLLOC=[
 {pre:'You should take',post:'in the discussion, not just listen.',ans:['part']},
 {pre:'The price depends',post:'the season.',ans:['on']},
 {pre:'She is very good',post:'explaining grammar.',ans:['at']},
 {pre:'I am looking forward',post:'the holidays.',ans:['to']},
 {pre:'He apologised',post:'being late.',ans:['for']},
 {pre:'This song reminds me',post:'my first school trip.',ans:['of']}
];
var PARA=[
 {q:'"Booking is essential" means...',opts:['you must reserve a place','booking is optional','books are important'],a:0},
 {q:'"The course is free of charge" means it...',opts:['is cheap','costs nothing','has variable prices'],a:1},
 {q:'"Places are limited" means...',opts:['there are many places','only some places are left','the place is small'],a:1},
 {q:'"The event has been called off" means it has been...',opts:['cancelled','moved','renamed'],a:0}
];
var vocabHtml=head('Matura Vocabulary practice 🧠','Słownictwo maturalne - kolokacje i parafrazy',hubnote())+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY</span><h2>Set 1 - Collocations / Kolokacje</h2><p>Complete each sentence with ONE word. Fixed phrases like these are tested constantly in Use of English.</p><div class="pl">Uzupełnij każde zdanie JEDNYM słowem. Stałe połączenia słów bardzo często pojawiają się na maturze.</div>'+gaps('col',COLLOC)+'</article>'+
 '<article class="topic"><span class="leveltag">PODSTAWOWY/ROZSZERZONY</span><h2>Set 2 - Paraphrase / Parafraza</h2><p>Correct matura answers often say the same thing in different words. Choose the closest meaning.</p><div class="pl">Poprawne odpowiedzi maturalne często mówią to samo innymi słowami. Wybierz najbliższe znaczenie.</div>'+mc(PARA)+'</article>';

/* ================= WRITING ================= */
var WC1='<b>Self-check like an examiner / Sprawdź się jak egzaminator:</b><ul class="mx-points"><li><b>Treść (content) 0-5:</b> all 4 points included and developed</li><li><b>Spójność (coherence) 0-2:</b> clear paragraphs and linking words</li><li><b>Zakres (range) 0-3:</b> varied grammar and vocabulary</li><li><b>Poprawność (accuracy) 0-2:</b> grammar and spelling</li></ul>';
var WC2='<b>Self-check like an examiner / Sprawdź się jak egzaminator:</b><ul class="mx-points"><li><b>Zgodność z poleceniem 0-5:</b> you answered the topic and both required elements</li><li><b>Spójność 0-2:</b> logical order and linking</li><li><b>Zakres 0-3:</b> range of grammar and vocabulary</li><li><b>Poprawność 0-3:</b> accuracy</li></ul>';

var MODEL1='Hi Alex,\nHow are you? I\'m writing because our class is organising a one-day trip next month and I would love you to come with us.\nWe are going to Kazimierz Dolny, a small town by the Vistula river. We chose it because it has beautiful old buildings and it is only two hours away by bus.\nDuring the day we are planning a photo competition in teams. Each team will get a list of ten things to photograph, and the winners get a prize at the school party.\nThe trip is on the second Saturday of June. The weather can change quickly there, so could you tell me if you have a good rain jacket I could borrow? Also, let me know what snacks you usually take on trips.\nWrite back soon!\nKasia';

var MODEL2='Small changes, big results: my water habit\nLast year I noticed that I almost never drank water during the school day. I often had headaches in the afternoon and found it hard to concentrate in the last lessons.\nI decided to make one small change: I bought a reusable bottle and promised myself to finish it twice a day. At first I forgot all the time, so I started keeping the bottle next to my books. After two weeks it became completely normal.\nWhat changed? My headaches almost disappeared, and I have more energy after school. I even stopped buying sweet drinks, because I simply do not want them any more.\nIf you want to try a similar habit, start really small - one glass of water with every meal is enough. Do not try to change everything at once. In my experience, one small habit that you actually keep is worth much more than five big plans that you forget after a week.';

var MODEL3='For many people, the place where they grow up shapes the rest of their lives. Both the countryside and a big city offer clear advantages, and the better choice depends on what a person values most.\nSupporters of the countryside point to space, nature and community. Children can play outside safely, the air is cleaner and neighbours usually know each other well. Life is also slower, which means less stress and more time with family. For people who value peace and close relationships, a village can be an ideal home.\nOn the other hand, cities give young people more opportunities. There are better schools, sports clubs, cultural events and part-time jobs, all within easy reach. Public transport makes it simple to be independent, and meeting people from different backgrounds teaches tolerance and open-mindedness. Ambitious students may simply find more doors open in a city.\nIn my opinion, growing up in a city offers more long-term benefits, as long as the family makes time for nature and rest. The skills learned in a busy environment, such as independence and dealing with different people, are useful in almost every career. However, I understand those who prefer the countryside, and for a quiet childhood it can be the healthier choice.\nTo sum up, both places can give a child a happy start in life, but for me the opportunities of the city win.';

var MODEL4='Dear Sir or Madam,\nI am writing to complain about the online English course "Fluent in Six Months", which I bought from your website on 5 May for 499 złoty.\nFirst of all, the course is advertised as suitable for B2 students, but the first ten lessons repeat basic A2 material. In addition, the video lessons often freeze, and two of the listening files will not open at all. Finally, the website promised a personal tutor, yet my messages have remained unanswered for two weeks.\nI have tried restarting the application and using a different browser, but the technical problems continue. As you can imagine, I am very disappointed, because I bought the course to prepare for an important exam in June.\nI would therefore like to request a full refund of the course fee. If a refund is not possible, I expect immediate access to the correct B2 material and a working tutor service within seven days.\nI look forward to your reply within fourteen days. If I do not hear from you, I will have no choice but to report the matter to the consumer protection office.\nYours faithfully,\nAlex Kowalski';

function writeCard(tag,title,pl,prompt,points,phrases,model,mid,wc){
 return '<article class="topic"><span class="leveltag">'+tag+'</span><h2>'+title+'</h2><p>'+prompt+'</p><div class="pl">'+pl+'</div><div class="callout"><b>Your text must include / Twój tekst musi zawierać:</b><ul class="mx-points">'+points.map(function(p){return '<li>'+p+'</li>'}).join('')+'</ul></div><div class="explain"><b>Useful language / Przydatne zwroty:</b><br>'+phrases+'</div><textarea class="textarea" placeholder="Write here / Napisz tutaj..." oninput="mxWC(this,\''+mid+'\')"></textarea><div class="mx-wc" id="'+mid+'">0 words / słów</div><div style="margin-top:10px"><button class="btn secondary" onclick="mxKey(\''+mid+'m\')">Model answer / Przykładowa odpowiedź</button></div><div class="answer" id="'+mid+'m"><div class="mx-model">'+model+'</div></div>'+wc+'</article>';
}

var writingHtml=head('Matura Writing practice ✍️','Wypowiedź pisemna - zadania maturalne',hubnote())+
 writeCard('PODSTAWOWY · 100-150 WORDS','Task 1 - Email with an invitation','Napisz e-mail ze zaproszeniem (100-150 słów).','You and your class are organising a one-day trip. Write an email to your English-speaking friend Alex (100-150 words).',
  ['Invite Alex on the trip.','Say where you are going and why you chose that place.','Describe one activity planned for the day.','Ask about something Alex should bring or lend you.'],
  'How are you? - I\'m writing because... - I would love you to come. - We chose it because... - Could you tell me if...? - Write back soon!',
  MODEL1,'mw1',WC1)+
 writeCard('PODSTAWOWY · 100-150 WORDS','Task 2 - Blog post','Napisz wpis na blog (100-150 słów).','Your school blog has a series called "Small changes, big results". Write a post (100-150 words) about a healthy habit.',
  ['Say what the habit is.','Explain why you started it.','Describe what changed because of it.','Give advice to readers who want to try.'],
  'Last year I noticed that... - I decided to... - At first... - What changed? - If you want to try... - In my experience...',
  MODEL2,'mw2',WC1)+
 writeCard('ROZSZERZONY · 200-250 WORDS','Task 3 - Essay / Rozprawka','Napisz rozprawkę (200-250 słów).','Some people believe it is better to grow up in the countryside, others in a big city. Write an essay (200-250 words).',
  ['Present arguments for both sides.','Give your own opinion with reasons.'],
  'Both ... offer clear advantages. - Supporters of ... point to... - On the other hand... - In my opinion... - To sum up...',
  MODEL3,'mw3',WC2)+
 writeCard('ROZSZERZONY · 200-250 WORDS','Task 4 - Formal complaint','Napisz formalny e-mail z reklamacją (200-250 słów).','You recently bought an online language course and you are not satisfied. Write a formal email of complaint (200-250 words).',
  ['Describe the product and the problems.','Demand a specific solution (refund, repair, replacement).'],
  'Dear Sir or Madam, - I am writing to complain about... - First of all... - In addition... - I would therefore like to request... - I look forward to your reply. - Yours faithfully,',
  MODEL4,'mw4',WC2);

/* ================= SPEAKING (ORAL EXAM) ================= */
var WARMUP=['Where do you live, and what do you like about it?','Do you work or are you a student? What do you like about it?','What do you usually do in your free time?','Do you like travelling? Why / why not?','What are your plans for next weekend?','Tell me about the people you live with.'];

function speakCard(tag,title,pl,body){return '<article class="topic"><span class="leveltag">'+tag+'</span><h2>'+title+'</h2>'+body+'<div class="pl">'+pl+'</div></article>'}

var speakingHtml=head('Matura Oral exam practice 🗣️','Egzamin ustny - trening do wszystkich części',hubnote())+
 speakCard('CZĘŚĆ 1 · ROZMOWA WSTĘPNA','Warm-up questions','Odpowiadaj pełnymi zdaniami: odpowiedź + powód + przykład.',
  '<p>Answer each question in full sentences: answer + reason + example. The examiner wants relaxed, natural English here.</p><ol class="mx-points">'+WARMUP.map(function(q){return '<li>'+q+'</li>'}).join('')+'</ol><div class="callout"><b>Examiner listens for / Egzaminator słucha:</b> fluent, communicative answers - not one word, not a memorised speech.</div>')+
 speakCard('CZĘŚĆ 2 · ODGYWANIE ROLI','Role-play 1: At the tourist information office','Odgrywanie roli - zrealizuj wszystkie 4 punkty.',
  '<p>You are visiting London with a friend. Talk to the clerk (your teacher or a partner plays the clerk; you start). You must:</p><ol class="mx-points"><li>Find out what you can see in two days.</li><li>Ask about ticket prices.</li><li>Ask about discounts for students.</li><li>Choose one attraction and explain why.</li></ol><div class="callout"><b>Examiner listens for:</b> all 4 points completed, natural reactions, polite questions (Could you tell me...? / Is there a discount for...?).</div>')+
 speakCard('CZĘŚĆ 2 · ODGYWANIE ROLI','Role-play 2: Planning a class party','Negocjuj i podejmij decyzje wspólnie z rozmówcą.',
  '<p>You and a classmate are organising a class party. Discuss and decide together:</p><ol class="mx-points"><li>Where it should be.</li><li>What food to order.</li><li>How much money each person should pay.</li><li>What to do if someone cannot come.</li></ol><div class="callout"><b>Examiner listens for:</b> suggesting (How about...? / Why don\'t we...?), responding to ideas (That\'s a good point, but...), and reaching a decision together.</div>')+
 speakCard('CZĘŚĆ 3 · OPIS ILUSTRACJI','Picture 1: A family picnic','Opisz ilustrację, a potem odpowiedz na 3 pytania.',
  '<p><b>Imagine a photo:</b> a family is having a picnic in a park. Two teenagers are laying out food on a blanket, a younger child is playing with a dog, and in the background other people are cycling. Describe it for about a minute: who, where, what is happening, what might happen next.</p><ol class="mx-points"><li>Do you like spending time outdoors? Why?</li><li>Tell me about a situation when you spent free time with your family.</li><li>Some people say cities need more green spaces. Do you agree?</li></ol><div class="callout"><b>Examiner listens for:</b> description first (don\'t start with opinions), present continuous for the scene, speculation language (It looks like... / They might...).</div>')+
 speakCard('CZĘŚĆ 3 · OPIS ILUSTRACJI','Picture 2: In the school library','Opisz scenę i odpowiedz na pytania rozwiniętymi zdaniami.',
  '<p><b>Imagine a photo:</b> in a school library, a girl is helping a younger boy with a laptop; there are shelves of books behind them, and a teacher is talking to a group of students at a table. Describe the scene, then answer:</p><ol class="mx-points"><li>Do you prefer studying alone or with other people? Why?</li><li>Tell me about a time someone helped you learn something.</li><li>Will libraries still exist in twenty years? Why / why not?</li></ol><div class="callout"><b>Examiner listens for:</b> full answers with reasons, past tenses for the story, and an opinion with a justification for question 3.</div>')+
 speakCard('CZĘŚĆ 4 · WYBÓR TEMATU','Stimulus choice: pick ONE and justify','Wybierz jeden materiał, uzasadnij wybór i odpowiedz na pytania.',
  '<p><b>Stimulus A:</b> a poster advertising weekend volunteering at an animal shelter.<br><b>Stimulus B:</b> a short article saying that 60% of teenagers in Poland read for pleasure less than 30 minutes a week.</p><p>Choose one stimulus, explain why you chose it (and not the other), then answer its questions:</p><ul class="mx-points"><li><b>A:</b> Would you like to volunteer there? Why? What can young people learn from volunteering?</li><li><b>B:</b> Why do teenagers read so little? How could schools encourage reading?</li></ul><div class="callout"><b>Examiner listens for:</b> a clear choice with a real reason, then developed answers - this part tests discussion, not description.</div>');

/* ================= init ================= */
function init(){
 style();
 block('listening',listenHtml);
 block('reading',readingHtml);
 block('grammar',grammarHtml);
 block('vocab',vocabHtml);
 block('writing',writingHtml);
 block('speaking',speakingHtml);
 REG['tr']=TRANS.map(function(t){return t.ans.map(function(a){return a.toLowerCase()})});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
