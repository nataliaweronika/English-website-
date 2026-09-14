(function(){
  'use strict';

  var READ = [
    ['A1','Everyday','A Morning at Home','Anna gets up at seven. She makes coffee and opens the window. Then she gets ready for work.','What does Anna do first?','PL: Poranna rutyna i czasowniki codziennych czynności.','What does she do after making coffee?',['She gets up.','She opens the window and gets ready.']],
    ['A1','Information','My Neighbourhood','There is a small park near my flat. There are two shops and a bakery on the main street.','What is near the flat?','PL: Opis miejsca i podstawowe informacje.','How many shops are mentioned?',['A small park.','Two shops.']],
    ['A1','Ideas & opinions','My Favourite Place','My favourite place is the local café. It is quiet, friendly and close to my home. I go there on Saturdays.','Why does the writer like the café?','PL: Proste uzasadnianie opinii.','When does the writer go there?',['Because it is quiet, friendly and close.','On Saturdays.']],
    ['A2','Everyday','A Busy Saturday','Last Saturday, Marta went shopping, met a friend for lunch and then watched a film at home. She was tired but happy.','What did Marta do after shopping?','PL: Czytanie kolejności wydarzeń.','How did Marta feel?',['She had lunch with a friend.','Tired but happy.']],
    ['A2','Information','Learning on the Bus','Many people use their journey to listen to podcasts or review vocabulary. Even ten minutes a day can become useful practice.','What can people do during a journey?','PL: Szukanie konkretnych informacji.','How much daily practice can help?',['Listen to podcasts or review vocabulary.','Even ten minutes.']],
    ['A2','Ideas & opinions','A Better Weekend','I think weekends are better when you make one plan and leave the rest free. This gives you something to look forward to without making the day stressful.','What does the writer recommend?','PL: Rozpoznawanie opinii i powodu.','Why should the rest of the weekend be free?',['Make one plan and leave the rest free.','To avoid making the day stressful.']],
    ['B1','Everyday','The New Routine','After changing jobs, Kuba started cycling to work. At first it was difficult, but after a few weeks he noticed that he had more energy during the day.','Why did Kuba start cycling?','PL: Zmiana nawyku i jej rezultat.','What did he notice later?',['He changed jobs and started a new routine.','He had more energy.']],
    ['B1','Information','Why Short Breaks Help','Short breaks can improve concentration when people work for long periods. A useful break might involve walking, stretching or simply looking away from a screen.','What can a useful break involve?','PL: Informacje o nauce i pracy.','What can breaks improve?',['Walking, stretching or looking away from a screen.','Concentration.']],
    ['B1','Ideas & opinions','Online or In Person?','Online lessons are convenient, but face-to-face classes can feel more interactive. The best choice depends on the learner, the subject and the goal.','What is one advantage of online lessons?','PL: Porównywanie dwóch możliwości.','What does the best choice depend on?',['They are convenient.','The learner, subject and goal.']],
    ['B2','Everyday','A Delayed Flight','The flight was delayed for three hours. Rather than waiting at the gate, Lena found a quiet café and finished the report she had been working on.','How did Lena use the delay?','PL: Czytanie tekstu sytuacyjnego i wnioskowanie.','Why was the report already in progress?',['She finished her report.','She had been working on it before the delay.']],
    ['B2','Information','City Transport','Cities that combine buses, trains and cycling routes can give residents more alternatives to driving. However, reliable connections and safe infrastructure are essential.','What can integrated transport provide?','PL: Tekst informacyjny z kontrastem.','What is essential?',['More alternatives to driving.','Reliable connections and safe infrastructure.']],
    ['B2','Ideas & opinions','Four-Day Working Week','A four-day week could improve work-life balance, but its success would depend on the type of job and how productivity is measured.','What could improve?','PL: Ocena argumentu i warunku.','What would success depend on?',['Work-life balance.','The type of job and how productivity is measured.']],
    ['C1','Everyday','The Unexpected Meeting','I had expected the meeting to be difficult. Instead, the discussion became constructive once everyone had clarified what they actually needed.','Why did the discussion improve?','PL: Zaawansowane czytanie i relacje przyczynowe.','What had the writer expected?',['Everyone clarified what they needed.','A difficult meeting.']],
    ['C1','Information','Sleep and Performance','Research increasingly suggests that consistent sleep supports attention and decision-making. However, individual needs vary, so a single ideal number of hours may be misleading.','What does consistent sleep support?','PL: Język ostrożnych wniosków.','Why may one ideal number be misleading?',['Attention and decision-making.','Individual needs vary.']],
    ['C1','Ideas & opinions','The Value of Failure','Failure can provide useful information when people examine what went wrong rather than simply moving on. In that sense, failure is not automatically evidence of poor ability.','What can failure provide?','PL: Argument, zastrzeżenie i wniosek.','What is failure not automatically evidence of?',['Useful information.','Poor ability.']],
    ['C2','Everyday','A Strategic Change','The company had planned a rapid expansion, but weaker-than-expected demand prompted a more cautious approach. Management decided to test one market before committing further resources.','Why did the company change its plan?','PL: Precyzyjne czytanie decyzji i przyczyny.','What approach did management choose?',['Demand was weaker than expected.','Test one market first.']],
    ['C2','Information','Evaluating Evidence','A strong argument depends not only on the amount of evidence but also on its quality, relevance and limitations. A large sample does not automatically eliminate bias.','What three qualities matter?','PL: Czytanie akademickie i analiza argumentu.','Does a large sample automatically eliminate bias?',['Quality, relevance and limitations.','No.']],
    ['C2','Ideas & opinions','Technology and Choice','Technology can expand individual choice while simultaneously shaping the choices people notice. The important question is therefore not simply whether technology gives us options, but who designs the environment in which those options appear.','What tension does the writer identify?','PL: Krytyczne myślenie i niuanse znaczeniowe.','What deeper question does the writer ask?',['Technology expands choice but also shapes it.','Who designs the environment where options appear.']]
  ];

  var VOC = [
    ['A1','Daily life',['get ready — przygotować się','have breakfast — jeść śniadanie','go to work — iść do pracy','take the bus — jechać autobusem']],
    ['A1','At home',['turn on the light — włączyć światło','make the bed — pościelić łóżko','tidy up — posprzątać','sit down — usiąść']],
    ['A2','Travel',['book a ticket — zarezerwować bilet','miss the train — spóźnić się na pociąg','check in — odprawić się','get on the bus — wsiąść do autobusu']],
    ['A2','Food & shopping',['try it on — przymierzyć','pay by card — zapłacić kartą','a good deal — dobra okazja','out of stock — brak w magazynie']],
    ['B1','Work',['meet a deadline — dotrzymać terminu','take responsibility — wziąć odpowiedzialność','solve a problem — rozwiązać problem','work efficiently — pracować wydajnie']],
    ['B1','Communication',['make a point — przedstawić argument','keep in touch — utrzymywać kontakt','bring up a topic — poruszyć temat','get the message across — jasno przekazać myśl']],
    ['B2','Opinions',['from my perspective — z mojej perspektywy','raise a concern — zgłosić obawę','take into account — wziąć pod uwagę','there is no doubt that — nie ma wątpliwości, że']],
    ['B2','Problem solving',['identify the cause — zidentyfikować przyczynę','find a solution — znaleźć rozwiązanie','weigh the options — rozważyć opcje','take a practical approach — przyjąć praktyczne podejście']],
    ['C1','Academic & professional',['draw a conclusion — wyciągnąć wniosek','provide evidence — przedstawić dowody','address an issue — zająć się problemem','raise an important question — postawić ważne pytanie']],
    ['C1','Nuance',['to some extent — do pewnego stopnia','arguably — można argumentować, że','a potential drawback — potencjalna wada','in practical terms — w praktyce']],
    ['C2','Advanced argument',['underlying assumption — ukryte założenie','compelling evidence — przekonujące dowody','unintended consequence — niezamierzona konsekwencja','subject to debate — podlegający dyskusji']],
    ['C2','Formal style',['nevertheless — niemniej jednak','whereas — podczas gdy','consequently — w konsekwencji','with regard to — w odniesieniu do']]
  ];

  var SCRIPTS = [
    {l:'A1',title:'Daily routine',focus:'Present simple + speaking',pl:'Present simple + mówienie',say:'Today we are going to talk about your normal day. I will ask simple questions. Try to answer in full sentences.',saypl:'Dzisiaj porozmawiamy o Twoim typowym dniu. Zadamy proste pytania. Spróbuj odpowiadać pełnymi zdaniami.',ask:['What time do you get up?','What do you do in the morning?','What do you usually do after work or school?'],askpl:['O której wstajesz?','Co robisz rano?','Co zwykle robisz po pracy lub szkole?'],feedback:'Good. Now make it a little longer: answer + one reason or detail.',feedbackpl:'Dobrze. Teraz rozwiń odpowiedź: odpowiedź + jeden powód lub szczegół.',challenge:'Describe your normal day for 30 seconds without stopping. Try to use at least five present-simple verbs.',challengepl:'Opisz swój typowy dzień przez 30 sekund bez zatrzymywania się. Użyj co najmniej pięciu czasowników w Present Simple.'},
    {l:'A2',title:'Past vs present perfect',focus:'Grammar + conversation',pl:'Gramatyka + rozmowa',say:'Let’s compare two ideas: something happened at a finished time, and something that is connected to now.',saypl:'Porównajmy dwie rzeczy: coś wydarzyło się w zakończonym czasie oraz coś, co ma związek z teraźniejszością.',ask:['What did you do last weekend?','Have you ever travelled alone?','What is something you have recently learned?'],askpl:['Co robiłeś/aś w zeszły weekend?','Czy kiedykolwiek podróżowałeś/aś sam/a?','Czego ostatnio się nauczyłeś/aś?'],feedback:'Check the time expression. If the time is finished, use past simple. If the focus is experience or a present result, consider present perfect.',feedbackpl:'Sprawdź określenie czasu. Jeśli czas jest zakończony, użyj Past Simple. Jeśli chodzi o doświadczenie lub rezultat ważny teraz, rozważ Present Perfect.',challenge:'Answer three “Have you ever…?” questions, then add one specific past-time example.',challengepl:'Odpowiedz na trzy pytania „Have you ever…?”, a następnie dodaj jeden konkretny przykład z zakończonym czasem w przeszłości.'},
    {l:'B1',title:'Giving useful advice',focus:'Modals + speaking',pl:'Czasowniki modalne + mówienie',say:'Imagine your friend has a problem. First, listen carefully. Then give two possible solutions and explain which one you recommend.',saypl:'Wyobraź sobie, że Twój znajomy ma problem. Najpierw uważnie posłuchaj. Następnie podaj dwa możliwe rozwiązania i wyjaśnij, które polecasz.',ask:['What should they do first?','What could they try?','What must they avoid?'],askpl:['Co powinni zrobić najpierw?','Czego mogliby spróbować?','Czego muszą unikać?'],feedback:'Good idea. Now explain why. Try to use should, could, have to or must accurately.',feedbackpl:'Dobry pomysł. Teraz wyjaśnij dlaczego. Spróbuj poprawnie użyć should, could, have to lub must.',challenge:'Give advice to someone who is stressed because they have too much work and not enough time.',challengepl:'Udziel rady osobie, która jest zestresowana, bo ma za dużo pracy i za mało czasu.'},
    {l:'B2',title:'Opinion & argument',focus:'Speaking + counterarguments',pl:'Mówienie + kontrargumenty',say:'Today I want you to give an opinion, support it with reasons, and then respond to an alternative point of view.',saypl:'Dzisiaj chcę, żebyś przedstawił/a opinię, poparł/a ją powodami, a następnie odniósł/odniosła się do innego punktu widzenia.',ask:['What is your main position?','What is your strongest reason?','What might someone who disagrees say?'],askpl:['Jakie jest Twoje główne stanowisko?','Jaki jest Twój najmocniejszy argument?','Co może powiedzieć osoba, która się z Tobą nie zgadza?'],feedback:'Your idea is clear. Now make the connection explicit: This matters because… However… On the other hand…',feedbackpl:'Twoja myśl jest jasna. Teraz pokaż wyraźnie zależność: To ma znaczenie, ponieważ… Jednak… Z drugiej strony…',challenge:'30-second challenge: Is working from home better than working in an office? Give one argument and one counterargument.',challengepl:'Wyzwanie 30 sekund: Czy praca z domu jest lepsza niż praca w biurze? Podaj jeden argument i jeden kontrargument.'},
    {l:'C1',title:'Nuanced discussion',focus:'Hedging + critical thinking',pl:'Hedging + krytyczne myślenie',say:'Let’s make your argument more precise. Avoid absolute claims and show how strong your evidence really is.',saypl:'Uczyńmy Twój argument bardziej precyzyjnym. Unikaj stwierdzeń absolutnych i pokaż, jak mocne są Twoje dowody.',ask:['What evidence supports your view?','What is one limitation of that evidence?','How could you make your claim less absolute?'],askpl:['Jakie dowody popierają Twój pogląd?','Jakie jest jedno ograniczenie tych dowodów?','Jak możesz sformułować tezę mniej kategorycznie?'],feedback:'Try language such as may, might, tends to, arguably, or to some extent when the evidence does not justify certainty.',feedbackpl:'Użyj zwrotów takich jak may, might, tends to, arguably lub to some extent, gdy dowody nie uzasadniają pewności.',challenge:'Weaken this claim without changing its basic idea: Technology always makes communication better. Then summarise your position in two sentences.',challengepl:'Osłab to stwierdzenie bez zmiany jego podstawowej myśli: „Technologia zawsze poprawia komunikację”. Następnie podsumuj swoje stanowisko w dwóch zdaniach.'},
    {l:'C2',title:'Advanced debate',focus:'Conditionals + evaluation',pl:'Tryby warunkowe + ocena argumentu',say:'Build a balanced argument. Explore a hypothetical situation, consider the counterfactual, and explain the consequence you think matters most.',saypl:'Zbuduj wyważony argument. Omów sytuację hipotetyczną, rozważ scenariusz kontrfaktyczny i wyjaśnij konsekwencję, która Twoim zdaniem ma największe znaczenie.',ask:['What would happen if the situation changed?','What might have happened under different circumstances?','What consequence matters most now?'],askpl:['Co by się stało, gdyby sytuacja się zmieniła?','Co mogłoby się wydarzyć w innych okolicznościach?','Jaka konsekwencja ma teraz największe znaczenie?'],feedback:'Focus on precision. Check whether you need a real condition, a hypothetical condition, or a past counterfactual.',feedbackpl:'Skup się na precyzji. Sprawdź, czy potrzebujesz warunku realnego, hipotetycznego czy kontrfaktycznego dotyczącego przeszłości.',challenge:'90-second balanced argument: Should governments regulate artificial intelligence more strictly? Include one condition, one counterargument and your evaluation.',challengepl:'Wyważony argument 90 sekund: Czy rządy powinny bardziej rygorystycznie regulować sztuczną inteligencję? Uwzględnij jeden warunek, kontrargument i własną ocenę.'}
  ];

  window.READ = READ;
  window.VOC = VOC;

  function addStyle(){
    if(document.getElementById('siteFixStyle')) return;
    var style=document.createElement('style');
    style.id='siteFixStyle';
    style.textContent='.teacher-filters{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0}.teacher-filters button{border:0;border-radius:999px;padding:8px 13px;cursor:pointer;font-weight:700;background:#eef2f8;color:#18233d}.teacher-filters button.active{background:#253c72;color:#fff}.teacher-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}.teacher-card{background:#f6f8fc;border-radius:18px;padding:18px;border:1px solid #e6eaf2}.teacher-card h2{margin:6px 0 4px}.teacher-level{font-size:12px;font-weight:800;letter-spacing:.08em;color:#536a9b}.teacher-box{padding:12px 14px;border-radius:13px;margin-top:12px;background:#fff}.teacher-box strong{display:block;margin-bottom:5px}.teacher-pl{color:#596273;font-size:.92em;margin-top:5px}.teacher-challenge{background:#edf5ff}.teacher-ask{margin:6px 0 0 18px}@media(max-width:760px){.teacher-grid{grid-template-columns:1fr}}';
    document.head.appendChild(style);
  }

  function teacherCard(x){
    var asks='';
    for(var i=0;i<x.ask.length;i++) asks += '<li>'+x.ask[i]+'<div class="teacher-pl">'+x.askpl[i]+'</div></li>';
    return '<article class="teacher-card"><div class="teacher-level">'+x.l+'</div><h2>'+x.title+'</h2><div><b>Lesson focus / Cel:</b> '+x.focus+'<div class="teacher-pl">'+x.pl+'</div></div><div class="teacher-box"><strong>🗣️ Say this / Powiedz:</strong><div>'+x.say+'</div><div class="teacher-pl">'+x.saypl+'</div></div><div class="teacher-box"><strong>❓ Ask / Zapytaj:</strong><ul class="teacher-ask">'+asks+'</ul></div><div class="teacher-box"><strong>💬 Feedback / Informacja zwrotna:</strong><div>'+x.feedback+'</div><div class="teacher-pl">'+x.feedbackpl+'</div></div><details class="teacher-box teacher-challenge"><summary><b>🎯 Final challenge / Zadanie końcowe</b></summary><p>'+x.challenge+'</p><div class="teacher-pl">'+x.challengepl+'</div></details></article>';
  }

  function renderTeacher(level){
    var page=document.getElementById('teacher');
    if(!page) return;
    addStyle();
    var host=document.getElementById('teacherScripts');
    if(!host) return;
    var html='';
    for(var i=0;i<SCRIPTS.length;i++) if(level==='ALL'||SCRIPTS[i].l===level) html+=teacherCard(SCRIPTS[i]);
    host.innerHTML='<div class="teacher-grid">'+html+'</div>';
    var buttons=document.querySelectorAll('#teacherFilters button');
    for(var j=0;j<buttons.length;j++) buttons[j].classList.toggle('active',buttons[j].getAttribute('data-level')===level);
  }

  function setupTeacher(){
    var page=document.getElementById('teacher');
    if(!page) return;
    page.innerHTML='<div class="tag">TEACHER MODE</div><h1>Teacher Resources 👩‍🏫</h1><p>Ready-to-use lesson scripts for A1–C2. Each script gives you exact teacher language, Polish support, questions, correction prompts and a final speaking challenge.</p><div class="pl">Gotowe scenariusze lekcji A1–C2. Każdy zawiera dokładne zwroty nauczyciela, wsparcie po polsku, pytania, sposób poprawiania oraz końcowe wyzwanie.</div><div class="teacher-filters" id="teacherFilters"></div><div id="teacherScripts"></div>';
    var f=document.getElementById('teacherFilters');
    var levels=['ALL','A1','A2','B1','B2','C1','C2'];
    for(var i=0;i<levels.length;i++){
      var b=document.createElement('button');
      b.type='button'; b.setAttribute('data-level',levels[i]); b.textContent=levels[i]==='ALL'?'All':levels[i];
      (function(level){b.addEventListener('click',function(){renderTeacher(level);});})(levels[i]);
      f.appendChild(b);
    }
    renderTeacher('ALL');
  }

  try{
    if(window.filters && window.renderRead){window.filters('rf','renderRead');window.renderRead();}
    if(window.filters && window.renderG){window.filters('gf','renderG');window.renderG();}
    if(window.filters && window.renderV){window.filters('vf','renderV');window.renderV();}
  }catch(e){console.error('Learning content refresh failed',e);}

  setupTeacher();

  var tm=document.getElementById('tm'), sm=document.getElementById('sm'), navTeacher=document.querySelector('.nav button.teacher-only');
  function openPage(id){
    var pages=document.querySelectorAll('.page');
    for(var i=0;i<pages.length;i++) pages[i].classList.toggle('active',pages[i].id===id);
    var nav=document.querySelectorAll('.nav button');
    for(var j=0;j<nav.length;j++) nav[j].classList.toggle('active',nav[j].getAttribute('data-page')===id);
    window.scrollTo(0,0);
  }
  function setMode(m){
    var teacher=m==='teacher';
    document.body.className=teacher?'teacher-mode':'student-mode';
    if(tm) tm.classList.toggle('active',teacher);
    if(sm) sm.classList.toggle('active',!teacher);
    if(navTeacher) navTeacher.style.display=teacher?'':'none';
    openPage(teacher?'teacher':'home');
  }
  if(tm) tm.onclick=function(e){e.preventDefault();setMode('teacher');};
  if(sm) sm.onclick=function(e){e.preventDefault();setMode('student');};
  setMode('student');
})();