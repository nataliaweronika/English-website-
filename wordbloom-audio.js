(function(){
'use strict';
var active=null, repeats=0;
function esc(s){return String(s||'').trim()}
function voices(){
 var vs=speechSynthesis.getVoices().filter(function(v){return /^en[-_]/i.test(v.lang)});
 // Voice availability varies by browser and device. Prefer enhanced/natural voices,
 // then familiar English voices, while keeping the system default as a fallback.
 function score(v){var name=v.name||'', lang=v.lang||'';var n=0;
  if(/natural|enhanced|premium/i.test(name))n+=100;
  if(/google (uk|us) english|microsoft (aria|jenny|guy|sonia|ryan|libby|emma|andrew)/i.test(name))n+=50;
  if(/^en[-_]GB$/i.test(lang))n+=10;
  if(v.default)n+=3;
  if(v.localService)n+=1;
  return n;
 }
 return vs.sort(function(a,b){return score(b)-score(a)});
}
function stop(){speechSynthesis.cancel();active=null;document.querySelectorAll('.wb-audio-play,.wb-audio-once').forEach(function(b){b.textContent=b.classList.contains('wb-audio-once')?'Play once / Odtwórz 1×':'▶ Play twice / Odtwórz 2×'})}
function speak(text,rate,twice,btn){stop();active=btn;repeats=twice?2:1;btn.textContent='■ Stop / Zatrzymaj';function run(){if(!repeats){stop();return}repeats--;var u=new SpeechSynthesisUtterance(text);var vs=voices();u.voice=vs[0]||null;u.lang=u.voice?u.voice.lang:'en-GB';u.rate=rate;u.onend=run;u.onerror=run;speechSynthesis.speak(u)}run()}
function controls(text){var wrap=document.createElement('div');wrap.className='wb-audio';wrap.innerHTML='<button type="button" class="wb-audio-play">▶ Play twice / Odtwórz 2×</button><label>Speed / Tempo <select><option value="0.8">0.8×</option><option value="1" selected>1.0× Normal</option><option value="1.1">1.1×</option></select></label><button type="button" class="wb-audio-once">Play once / Odtwórz 1×</button>';
 var play=wrap.querySelector('.wb-audio-play'),once=wrap.querySelector('.wb-audio-once'),sel=wrap.querySelector('select');play.onclick=function(){if(active===play){stop()}else speak(text,+sel.value,true,play)};once.onclick=function(){if(active===once){stop()}else speak(text,+sel.value,false,once)};return wrap}
function add(){
 document.querySelectorAll('#listen article.topic').forEach(function(a){if(a.querySelector('.wb-audio'))return;var ps=a.querySelectorAll('p');var text=ps.length>1?ps[1].textContent:ps[0]&&ps[0].textContent;if(text)a.insertBefore(controls(esc(text)),a.querySelector('button'))});
 document.querySelectorAll('#speak article.card').forEach(function(a){if(a.querySelector('.wb-audio'))return;var p=a.querySelector('p');if(p){var text=p.textContent.replace(/^Task\s*\/\s*Zadanie:\s*/i,'');a.insertBefore(controls(esc(text)),p.nextSibling)}});
 document.querySelectorAll('.mhx-task').forEach(function(a){if(a.querySelector('.wb-audio'))return;var d=Array.from(a.querySelectorAll('details')).find(function(x){return /Recording script/i.test(x.textContent)});var p=d&&d.querySelector('p');if(p)d.parentNode.insertBefore(controls(esc(p.textContent)),d)});
 document.querySelectorAll('#listening .mx-script').forEach(function(s){var a=s.closest('article');if(a&&!a.querySelector('.wb-audio'))a.insertBefore(controls(esc(s.textContent)),s)});
}
var st=document.createElement('style');st.textContent='.wb-audio{display:flex;gap:8px;align-items:center;flex-wrap:wrap;background:#e0f0ff;border-radius:12px;padding:10px;margin:10px 0}.wb-audio button,.wb-audio select{border:0;border-radius:18px;padding:8px 11px;font-weight:800;background:#fff;color:#17244b;cursor:pointer}.wb-audio label{font-size:12px;font-weight:800;color:#59657e}';document.head.appendChild(st);add();new MutationObserver(add).observe(document.body,{childList:true,subtree:true});window.addEventListener('beforeunload',stop)
})();
