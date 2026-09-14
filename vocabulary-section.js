(function(){
  'use strict';
  const SETS=[
    ['A1','Daily life',[['get up','wstawać'],['get ready','przygotować się'],['have breakfast','jeść śniadanie'],['go to work','iść do pracy'],['take the bus','jechać autobusem']]],
    ['A1','Home',[['make the bed','ścielić łóżko'],['tidy up','sprzątać'],['turn on','włączać'],['sit down','siadać'],['near','blisko']]],
    ['A2','Travel',[['book a ticket','zarezerwować bilet'],['miss the train','spóźnić się na pociąg'],['check in','odprawić się'],['get on','wsiąść'],['journey','podróż']]],
    ['A2','Shopping',[['try it on','przymierzyć'],['pay by card','zapłacić kartą'],['a good deal','dobra okazja'],['out of stock','brak w magazynie'],['receipt','paragon']]],
    ['B1','Work',[['meet a deadline','dotrzymać terminu'],['take responsibility','wziąć odpowiedzialność'],['solve a problem','rozwiązać problem'],['work efficiently','pracować wydajnie'],['colleague','współpracownik']]],
    ['B1','Communication',[['make a point','przedstawić argument'],['keep in touch','utrzymywać kontakt'],['bring up a topic','poruszyć temat'],['get the message across','jasno przekazać myśl'],['clarify','wyjaśnić']]],
    ['B2','Opinions',[['from my perspective','z mojej perspektywy'],['raise a concern','zgłosić obawę'],['take into account','wziąć pod uwagę'],['to some extent','do pewnego stopnia'],['convincing','przekonujący']]],
    ['B2','Problem solving',[['identify the cause','zidentyfikować przyczynę'],['find a solution','znaleźć rozwiązanie'],['weigh the options','rozważyć opcje'],['practical approach','praktyczne podejście'],['drawback','wada']]],
    ['C1','Academic & professional',[['draw a conclusion','wyciągnąć wniosek'],['provide evidence','przedstawić dowody'],['address an issue','zająć się problemem'],['raise a question','postawić pytanie'],['relevant','istotny']]],
    ['C1','Nuance',[['arguably','można argumentować, że'],['potential drawback','potencjalna wada'],['in practical terms','w praktyce'],['to a certain extent','do pewnego stopnia'],['underlying','leżący u podstaw']]],
    ['C2','Advanced argument',[['underlying assumption','ukryte założenie'],['compelling evidence','przekonujące dowody'],['unintended consequence','niezamierzona konsekwencja'],['subject to debate','podlegający dyskusji'],['counterargument','kontrargument']]],
    ['C2','Formal style',[['nevertheless','niemniej jednak'],['whereas','podczas gdy'],['consequently','w konsekwencji'],['with regard to','w odniesieniu do'],['notwithstanding','pomimo']]]
  ];

  function student(){
    const host=document.getElementById('vocab'); if(!host)return;
    const old=host.querySelector('#voc');
    if(old)old.innerHTML='';
    let filters=host.querySelector('#vf');
    if(!filters){filters=document.createElement('div');filters.id='vf';filters.className='filters';host.appendChild(filters)}
    filters.innerHTML='';
    let grid=host.querySelector('#voc');
    if(!grid){grid=document.createElement('div');grid.id='voc';grid.className='grid';host.appendChild(grid)}
    const draw=(level)=>{grid.innerHTML=SETS.filter(x=>level==='ALL'||x[0]===level).map((s,si)=>`<article class="card"><div class="tag">${s[0]} • ${s[1]}</div><h2>${s[1]}</h2><p>Learn useful chunks, then test yourself.</p><div class="pl">Ucz się przydatnych zwrotów, a następnie sprawdź się.</div><div>${s[2].map((w,i)=>`<button class="choice" data-vocab="${si}-${i}" data-en="${w[0]}" data-pl="${w[1]}"><b>${w[0]}</b><span class="pl" style="display:none">${w[1]}</span></button>`).join('')}</div><button class="btn secondary" onclick="this.parentElement.querySelectorAll('.choice .pl').forEach(x=>x.style.display=x.style.display==='none'?'block':'none')">Show / hide Polish</button><div class="callout"><b>Speak:</b> Make one sentence using two of the phrases.<br><span class="pl">Powiedz jedno zdanie, używając dwóch zwrotów.</span></div></article>`).join('')};
    ['ALL','A1','A2','B1','B2','C1','C2'].forEach((l,i)=>{let b=document.createElement('button');b.textContent=l;b.className=i===0?'active':'';b.onclick=()=>{filters.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(l)};filters.appendChild(b)});draw('ALL');
  }

  function teacher(){
    const host=document.getElementById('teacher'); if(!host||document.getElementById('teacher-vocabulary-bank'))return;
    const wrap=document.createElement('div');wrap.id='teacher-vocabulary-bank';wrap.innerHTML=`<div class="callout" style="margin-top:24px"><strong>🧠 Vocabulary Classroom Bank</strong><br>Ready-to-use vocabulary sets for lessons, revision and speaking practice.</div><div class="filters" id="tvf"></div><div id="tvoc" class="grid"></div>`;host.appendChild(wrap);
    const f=wrap.querySelector('#tvf'),g=wrap.querySelector('#tvoc');
    const draw=l=>{g.innerHTML=SETS.filter(x=>l==='ALL'||x[0]===l).map(s=>`<article class="card"><div class="tag">${s[0]} • ${s[1]}</div><h2>${s[1]}</h2><ol>${s[2].map(w=>`<li><b>${w[0]}</b> — ${w[1]}</li>`).join('')}</ol><h3>Quick practice</h3><p>1. Students choose three expressions and make sentences.<br>2. Pair work: ask a question using one expression.<br>3. Challenge: use three expressions naturally in a 30-second answer.</p><h3>Mini speaking task</h3><p>Ask students to discuss a real-life situation connected with this topic and use at least three target expressions.</p></article>`).join('')};
    ['ALL','A1','A2','B1','B2','C1','C2'].forEach((l,i)=>{let b=document.createElement('button');b.textContent=l;b.className=i===0?'active':'';b.onclick=()=>{f.querySelectorAll('button').forEach(x=>x.classList.remove('active'));b.classList.add('active');draw(l)};f.appendChild(b)});draw('ALL');
  }
  const timer=setInterval(()=>{student();teacher();if(document.getElementById('vocab')&&document.getElementById('teacher-vocabulary-bank'))clearInterval(timer)},400);
})();