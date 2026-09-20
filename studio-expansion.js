(function(){
'use strict';

/* Extra practice for the Listening, Reading and Writing studios.
   Renders into its own block inside each section, so the level filters keep working. */

function style(){var s=document.createElement('style');s.textContent=[
'.sx-wrap{margin-top:34px;border-top:2px dashed #d9ddec;padding-top:6px}',
'.sx-head{margin:14px 0 6px}',
'.sx-tag{display:inline-block;background:#4055db;color:#fff;border-radius:20px;padding:5px 12px;font-size:11px;font-weight:900;letter-spacing:1.2px}'
].join('');document.head.appendChild(s)}

window.sxKey=function(id){var el=document.getElementById(id);if(el)el.classList.toggle('show')};
window.sxPick=function(b){var p=b.parentElement;var all=p.querySelectorAll('.choice');for(var k=0;k<all.length;k++){all[k].classList.remove('correct','wrong')}b.classList.add(b.getAttribute('data-ok')==='1'?'correct':'wrong')};

function block(sectionId,html){var sec=document.getElementById(sectionId);if(!sec)return;var d=document.createElement('div');d.className='sx-wrap';d.innerHTML=html;sec.appendChild(d)}
function head(title,pl){return '<div class="sx-head"><span class="sx-tag">MORE PRACTICE · WIĘCEJ ĆWICZEŃ</span><h2>'+title+'</h2><div class="pl">'+pl+'</div></div>'}
function grid(inner){return '<div class="grid">'+inner+'</div>'}

/* ---------- LISTENING: more script + question sets ---------- */
var LISTEN_MORE=[
 ['B1','At the doctor','The doctor tells Anna to take the medicine twice a day after meals and to come back in two weeks if the cough does not improve.','How often should Anna take the medicine, and when should she return?','Twice a day after meals; in two weeks if the cough does not improve.'],
 ['B1','Weekend weather','Saturday will be sunny in the morning, but rain is expected after three o\'clock, so the organisers moved the picnic to Sunday morning.','Why was the picnic moved?','Because rain is expected on Saturday afternoon.'],
 ['B2','Job interview tip','The speaker advises candidates to prepare two or three specific examples of past work instead of memorising general answers.','What does the speaker recommend?','Preparing two or three specific examples of past work.'],
 ['B2','Library change','From next month, the library will open an hour earlier on weekdays, but it will close on Sunday afternoons to reduce costs.','What changes on Sundays?','The library will close on Sunday afternoons.'],
 ['C1','Remote work','Although remote work removes commuting time, it can blur the boundary between private and professional life, so clear routines become essential.','What problem can remote work create?','It can blur the boundary between private and professional life.'],
 ['C1','News habits','The journalist argues that reading one reliable source carefully is usually more informative than scanning dozens of headlines.','What does the journalist consider more informative?','Reading one reliable source carefully.']
];

var listenHtml=head('More listening workouts 🎧','Więcej zestawów: tekst, pytanie, odpowiedź.')+
 grid(LISTEN_MORE.map(function(x,i){
  return '<article class="topic"><span class="leveltag">'+x[0]+'</span><h2>🎧 '+x[1]+'</h2><p>'+x[2]+'</p><p><b>'+x[3]+'</b></p><button class="btn secondary" onclick="sxKey(\'sxL'+i+'\')">Show answer / Pokaż odpowiedź</button><div class="answer" id="sxL'+i+'">'+x[4]+'</div></article>';
 }).join(''));

/* ---------- READING: more texts with click-check questions ---------- */
var READ_MORE=[
 {l:'B1',title:'The Night Market',text:'Every Friday evening, the old square in Tomasz\'s town changes into a night market. Farmers sell cheese, honey and fresh bread, and local cooks prepare hot food from different countries. Tomasz first visited the market two years ago with his grandmother. Now he goes almost every week. His favourite stall sells pancakes with apple and cinnamon. Last month, the market organisers started live music evenings, so even more people come. Tomasz thinks the market is good for the town because small local businesses can earn money and neighbours spend more time together.',pl:'Tomasz opowiada o nocnym targu w swoim mieście.',
  qs:[['What does Tomasz buy most often?',['Pancakes.','Cheese.','Bread.'],0],['Why does Tomasz think the market helps the town?',['It brings tourists from abroad.','It supports local businesses and the community.','It gives people free food.'],1]]},
 {l:'B2',title:'Why We Procrastinate',text:'Almost everyone delays unpleasant tasks, but psychologists say procrastination is rarely about laziness. More often, it is about feelings: a task makes us bored, anxious or unsure, and avoiding it gives quick relief. Unfortunately, the relief does not last, and the delayed task usually grows in our imagination. Research suggests two simple strategies. The first is to make the first step extremely small - instead of "write the essay", decide to "write one sentence". Starting reduces the discomfort, and continuing becomes easier. The second strategy is self-compassion. People who forgive themselves for earlier delays procrastinate less in the future, while shame and self-criticism make avoidance stronger. In other words, the way we talk to ourselves about a task can matter as much as the task itself.',pl:'Dlaczego odkładamy rzeczy na później i co z tym zrobić.',
  qs:[['According to the text, procrastination is mostly caused by...',['laziness.','difficult feelings.','lack of time.'],1],['Why does a delayed task feel worse over time?',['It becomes longer.','It grows in our imagination.','Other people notice it.'],1],['What does the text say about self-compassion?',['It reduces future procrastination.','It increases shame.','It works only for students.'],0]]},
 {l:'C1',title:'The Quiet Power of Walking Meetings',text:'Some companies are replacing at least part of their sit-down meetings with walking meetings, and early reports are encouraging. A short walk side by side changes the dynamics of a conversation: without a desk between people, hierarchy feels weaker and honest opinions come more easily. Movement also seems to help creative thinking; studies on attention show that mild physical activity can improve the generation of new ideas. There are limits, of course. A walking meeting is impractical for large groups, impossible when detailed documents must be studied, and unkind in bad weather. It also suits some topics better than others: brainstorming and one-to-one feedback work well, while detailed budget reviews do not. Still, as a partial replacement for the conference room, the walking meeting is a low-cost experiment that many teams find surprisingly effective.',pl:'Spotkania w ruchu - zalety i ograniczenia.',
  qs:[['Walking side by side helps because...',['it saves time.','it weakens hierarchy and encourages honesty.','it replaces exercise.'],1],['Which meeting is NOT suitable for walking?',['Brainstorming.','One-to-one feedback.','A detailed budget review.'],2],['The author\'s attitude to walking meetings is...',['uncritical.','positive but realistic.','dismissive.'],1]]},
 {l:'C2',title:'The Ethics of Recommendation',text:'Recommendation systems decide what we watch, buy and read, yet they are designed to maximise engagement, not understanding. Because these systems learn from our past behaviour, they tend to show us more of what we already like, gradually narrowing the range of ideas we meet. This feedback loop is convenient but not neutral: a person who clicks on one sensational video is offered ten more, while quieter, more difficult content slowly disappears from view. Defenders argue that people remain free to choose, and technically they are right. But a choice made inside a carefully designed menu is not the same as a free choice among all options. Some platforms now experiment with "serendipity" features that deliberately introduce surprising material. Whether users will tolerate recommendations they did not ask for remains an open question - and perhaps the most interesting test of how much discovery we actually want.',pl:'Algorytmy rekomendacji - wygoda czy ograniczanie wyboru?',
  qs:[['Recommendation systems are built mainly to...',['widen understanding.','maximise engagement.','correct past behaviour.'],1],['The "feedback loop" means that...',['users complain about content.','past clicks narrow future choices.','videos become more sensational.'],1],['What is "an open question" for the author?',['Whether platforms are legal.','Whether users want unasked-for discovery.','Whether menus can be well designed.'],1]]}
];

var readHtml=head('More reading workouts 📖','Więcej tekstów z pytaniami i sprawdzaniem odpowiedzi.')+
 grid(READ_MORE.map(function(x,xi){
  return '<article class="topic"><span class="leveltag">'+x.l+'</span><h2>'+x.title+'</h2><div class="readtext">'+x.text+'</div><div class="pl">🇵🇱 '+x.pl+'</div>'+
   x.qs.map(function(q,qi){
    return '<div class="callout"><b>'+(qi+1)+'. '+q[0]+'</b>'+q[1].map(function(a,ai){return '<button type="button" class="choice" data-ok="'+(ai===q[2]?1:0)+'" onclick="sxPick(this)">'+a+'</button>'}).join('')+'</div>';
   }).join('')+'</article>';
 }).join(''));

/* ---------- WRITING: more prompts with useful language and sample ideas ---------- */
var WRITE_MORE=[
 ['A1','Introduce yourself','Write 5-6 sentences about yourself: your name, where you live, your family and one hobby.','Napisz 5-6 zdań o sobie: imię, miejsce zamieszkania, rodzina i hobby.','My name is... - I live in... - There are ... people in my family. - In my free time I...','Sample ideas: My name is Ola. I live in Kraków, in the south of Poland. There are four people in my family. In my free time I play the guitar and meet my friends.'],
 ['A2','A postcard from a trip','Write a short postcard: where you are, what the weather is like, one thing you did, and when you come back.','Napisz krótką pocztówkę: gdzie jesteś, jaka jest pogoda, co robiłeś/aś i kiedy wracasz.','Greetings from...! - The weather is... - Yesterday we... - See you on...','Sample ideas: Greetings from Gdańsk! The weather is sunny but windy. Yesterday we walked along the beach and visited the old town. See you on Friday!'],
 ['B1','A thank-you email','A friend helped you move to a new flat. Write an email: say what they did, why it mattered, and invite them for a meal.','Napisz e-mail z podziękowaniem za pomoc w przeprowadzce i zaproś znajomego na posiłek.','Thank you so much for... - I don\'t know what I would do without... - It meant a lot because... - I\'d like to invite you to...','Sample ideas: Thank you so much for helping me move on Saturday. I don\'t know what I would have done without your van! It meant a lot because I was really stressed. I\'d like to invite you for dinner at my new place next week.'],
 ['B2','For and against: daily homework','Should students have homework every day? Give arguments for and against, then your opinion (120-150 words).','Czy uczniowie powinni dostawać zadania domowe codziennie? Przedstaw argumenty za i przeciw oraz swoją opinię (120-150 słów).','On the one hand... - However... - A clear advantage is... - The main drawback is... - In my view...','Sample structure: intro (the question) - arguments for (repetition builds memory; keeps students organised) - arguments against (tiredness, less time for hobbies and sleep) - your opinion with a reason.'],
 ['C1','Problem and solution: time outdoors','Many young people spend too little time outdoors. Explain the problem and propose two realistic solutions.','Wielu młodych ludzi spędza za mało czasu na świeżym powietrzu. Wyjaśnij problem i zaproponuj dwa rozwiązania.','The root of the problem is... - One practical solution would be... - Another option is... - This would work because...','Sample structure: describe the problem (screens, habits, urban life) - solution 1 (school outdoor lessons or activity challenges) - solution 2 (local clubs and safe green spaces) - short conclusion.'],
 ['C1','A review','Review a book, series or course you would recommend: what it is, its strengths, one weakness, and who would enjoy it.','Napisz recenzję książki, serialu lub kursu: czym jest, mocne strony, jedna słabość i dla kogo.','What stands out is... - Its greatest strength is... - If I had to criticise one thing... - I would recommend it to...','Sample structure: introduce the title and type - strengths (characters, pace, usefulness) - one honest weakness - recommendation with the ideal audience.']
];

var writeHtml=head('More writing workouts ✍️','Więcej tematów z przydatnym językiem i przykładowymi pomysłami.')+
 grid(WRITE_MORE.map(function(x,i){
  return '<article class="topic"><span class="leveltag">'+x[0]+'</span><h2>✍️ '+x[1]+'</h2><p>'+x[2]+'</p><div class="pl">'+x[3]+'</div><div class="explain"><b>Useful language / Przydatne zwroty:</b><br>'+x[4]+'</div><textarea class="textarea" placeholder="Write here / Napisz tutaj..."></textarea><div style="margin-top:10px"><button class="btn secondary" onclick="sxKey(\'sxW'+i+'\')">Sample ideas / Przykładowe pomysły</button></div><div class="answer" id="sxW'+i+'">'+x[5]+'</div></article>';
 }).join(''));

function init(){
 style();
 block('listening',listenHtml);
 block('reading',readHtml);
 block('writing',writeHtml);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
