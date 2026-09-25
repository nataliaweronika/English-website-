/* WordBloom client access codes (v1)
   Lessons are open to clients with a personal access code.
   Home, Study with me and the Teacher Area stay as they were.
   Codes are managed by Natalia in the Admin panel (Client access > Admin). */
(function(){
'use strict';
if(window.__wbAccess)return;window.__wbAccess=true;
var URL='https://ynwumcchbhdlejsvwlse.supabase.co/rest/v1/rpc/';
var KEY='sb_publishable_NbLZobLWm-uzdAONUPsbNA_pHrhYVf6';
var SITE='https://everydayenglish.vercel.app/';
var PUBLIC_PAGES={home:1,teacher:1,'study-with-me':1};
var GRACE_MS=3*24*3600*1000;
var LS={code:'wbClientCode',name:'wbClientName',ok:'wbClientOkAt',admin:'wbAdminToken'};
var state={unlocked:false,admin:false,name:''};
function ls(k,v){try{if(v===undefined)return localStorage.getItem(k);if(v===null)localStorage.removeItem(k);else localStorage.setItem(k,v);}catch(e){return null;}}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function rpc(fn,body){return fetch(URL+fn,{method:'POST',headers:{'apikey':KEY,'Authorization':'Bearer '+KEY,'Content-Type':'application/json'},body:JSON.stringify(body||{})}).then(function(r){return r.json().then(function(j){if(!r.ok){var e=new Error((j&&j.message)||('HTTP '+r.status));e.server=true;throw e;}return j;});});}

function css(){if(document.getElementById('wbAccessStyle'))return;var s=document.createElement('style');s.id='wbAccessStyle';s.textContent=
'#wbGate,#wbAdmin{position:fixed;inset:0;z-index:2147483100;background:rgba(23,36,75,.35);display:none;align-items:center;justify-content:center;padding:18px;font-family:Inter,system-ui,sans-serif;color:#17244b}'+
'#wbGate.on,#wbAdmin.on{display:flex}'+
'.wbBox{width:min(440px,100%);background:#fff;border-radius:24px;padding:30px;box-shadow:0 18px 60px rgba(30,45,90,.18);text-align:center;max-height:92vh;overflow:auto}'+
'.wbBox.wide{width:min(860px,100%);text-align:left}'+
'.wbBox h2{font:30px Georgia,serif;margin:6px 0 8px}.wbBox .wbBrand{font:italic 26px Georgia,serif}'+
'.wbBox p{color:#68738d;margin:0 0 14px}.wbBox .pl{color:#68738d;font-size:13px}'+
'.wbBox input{width:100%;box-sizing:border-box;border:1px solid #dfe3ee;border-radius:14px;padding:13px 15px;font-size:17px;margin:6px 0;text-align:center;letter-spacing:.06em}'+
'.wbBox.wide input{text-align:left;letter-spacing:0;font-size:15px}'+
'.wbBtn{border:0;border-radius:22px;padding:11px 18px;background:#5968e8;color:#fff;font-weight:800;font-size:15px;cursor:pointer;margin-top:8px}'+
'.wbBtn.full{width:100%}.wbBtn.light{background:#eef0fb;color:#17244b}.wbBtn.red{background:#fde8ec;color:#b4233d}.wbBtn.green{background:#ddf6e8;color:#1c6b3f}'+
'.wbBtn.sm{padding:7px 12px;font-size:13px;margin:2px}'+
'.wbLink{border:0;background:transparent;color:#4055db;font-weight:700;cursor:pointer;margin-top:12px;font-size:14px}'+
'.wbMsg{min-height:22px;margin-top:10px;font-weight:700;color:#b4233d}.wbMsg.ok{color:#1c6b3f}'+
'.wbRow{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end}.wbRow>div{flex:1;min-width:180px}'+
'.wbRow label{font-size:13px;font-weight:700;color:#68738d}'+
'.wbTable{width:100%;border-collapse:collapse;margin-top:14px;font-size:14px}.wbTable th,.wbTable td{padding:9px 8px;border-bottom:1px solid #e5e8f1;text-align:left;vertical-align:middle}'+
'.wbTable th{color:#68738d;font-size:12px;text-transform:uppercase;letter-spacing:.05em}'+
'.wbTable td.wbCode,.wbTable td.wbNw{white-space:nowrap}.wbCode{font:700 15px ui-monospace,Menlo,monospace;letter-spacing:.05em}'+
'.wbPill{display:inline-block;border-radius:999px;padding:3px 10px;font-size:12px;font-weight:800}.wbPill.on{background:#ddf6e8;color:#1c6b3f}.wbPill.off{background:#f1f2f6;color:#8a93a8}'+
'.wbNew{background:#f5f6ff;border:1px solid #e0e3fb;border-radius:16px;padding:14px;margin-top:14px;white-space:pre-wrap;font-size:14px}'+
'.wbTop{display:flex;justify-content:space-between;align-items:center;gap:10px}'+
'.nav button.wbNavAccess{margin-top:14px;border-top:1px solid #e5e8f1;padding-top:12px}'+
'body.wb-locked .nav button[data-wb-locked]::after{content:" \\1F512";font-size:12px;opacity:.7}';
document.head.appendChild(s);}

/* ---------- client gate ---------- */
var pending=null;
function gateEl(){var g=document.getElementById('wbGate');if(g)return g;g=document.createElement('div');g.id='wbGate';g.innerHTML=
'<div class="wbBox" role="dialog" aria-modal="true" aria-labelledby="wbGateTitle"><div class="wbBrand">WordBloom</div>'+
'<h2 id="wbGateTitle">Lessons for my students</h2>'+
'<p>Enter the personal access code you got from Natalia.</p><div class="pl">Wpisz swój osobisty kod dostępu od Natalii.</div>'+
'<form id="wbGateForm"><input id="wbGateCode" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="WB-XXXXXX" aria-label="Access code"><button class="wbBtn full" type="submit">Open lessons / Otwórz lekcje →</button></form>'+
'<div id="wbGateMsg" class="wbMsg"></div>'+
'<p style="margin-top:10px">No code yet? <a href="mailto:rduchnatalia@gmail.com?subject=WordBloom%20lessons">Write to Natalia</a> / Nie masz kodu? Napisz do Natalii.</p>'+
'<button type="button" class="wbLink" id="wbGateHome">← Back to Home / Wróć</button><br><button type="button" class="wbLink" id="wbGateAdmin" style="font-size:12px;color:#8a93a8">Admin</button></div>';
document.body.appendChild(g);
g.querySelector('#wbGateForm').onsubmit=function(e){e.preventDefault();tryCode(g.querySelector('#wbGateCode').value);};
g.querySelector('#wbGateHome').onclick=function(){hideGate();goHome();};
g.querySelector('#wbGateAdmin').onclick=function(){hideGate();openAdmin();};
return g;}
function showGate(msg){var g=gateEl();g.classList.add('on');var m=g.querySelector('#wbGateMsg');m.className='wbMsg';m.textContent=msg||'';setTimeout(function(){var i=g.querySelector('#wbGateCode');if(i)i.focus();},50);}
function hideGate(){var g=document.getElementById('wbGate');if(g)g.classList.remove('on');}
function goHome(){var b=document.querySelector('.nav button[data-page="home"]');if(b)b.click();}
function tryCode(v){var m=document.getElementById('wbGateMsg');v=(v||'').trim();if(!v){m.textContent='Please type your code. / Wpisz kod.';return;}
m.className='wbMsg ok';m.textContent='Checking… / Sprawdzam…';
rpc('wb_check_code',{p_code:v}).then(function(r){
 if(r&&r.ok){ls(LS.code,r.code);ls(LS.name,r.name||'');ls(LS.ok,String(Date.now()));setUnlocked(true,false,r.name);m.textContent='Welcome'+(r.name?', '+r.name:'')+'!';setTimeout(function(){hideGate();var p=pending;pending=null;if(p)p();},500);}
 else{m.className='wbMsg';m.textContent=(r&&r.reason==='inactive')?'This code has been switched off. Please contact Natalia. / Ten kod jest nieaktywny.':(r&&r.reason==='too_many')?'Too many tries. Please wait 15 minutes. / Za dużo prób, spróbuj za 15 minut.':'That code doesn\u2019t match. Check it and try again. / Nieprawidłowy kod.';}
}).catch(function(){m.className='wbMsg';m.textContent='Could not check the code right now. Please try again in a moment. / Spróbuj ponownie za chwilę.';});}

function setUnlocked(on,admin,name){state.unlocked=!!on;state.admin=!!admin;state.name=name||'';document.body.classList.toggle('wb-locked',!state.unlocked);markNav();updateNav();}
function isLockedPage(id){return id&&!PUBLIC_PAGES[id];}
function markNav(){document.querySelectorAll('.nav button[data-page]').forEach(function(b){if(isLockedPage(b.getAttribute('data-page')))b.setAttribute('data-wb-locked','1');});}

/* intercept navigation to lessons while locked */
document.addEventListener('click',function(e){if(state.unlocked)return;var t=e.target;if(!t||!t.closest)return;
 var nb=t.closest('.nav button[data-page]');
 if(nb&&isLockedPage(nb.getAttribute('data-page'))){e.preventDefault();e.stopImmediatePropagation();pending=function(){nb.click();};showGate();return;}
 var mb=t.closest('#eeMaturaBtn');
 if(mb){e.preventDefault();e.stopImmediatePropagation();pending=function(){mb.click();};showGate();return;}
},true);
/* safety net: lesson pages opened some other way (home cards, search) */
setInterval(function(){if(state.unlocked)return;
 var a=document.querySelector('.page.active');
 if(a&&isLockedPage(a.id)){goHome();if(!pending){var id=a.id;pending=function(){var b=document.querySelector('.nav button[data-page="'+id+'"]');if(b)b.click();};}showGate();}
 var mm=document.getElementById('eeMaturaModal');
 if(mm&&mm.style.display!=='none'&&getComputedStyle(mm).display!=='none'){mm.style.display='none';document.documentElement.style.overflow='';pending=function(){var b=document.getElementById('eeMaturaBtn');if(b)b.click();};showGate();}
},400);

/* ---------- sidebar entry ---------- */
function navBtn(){var nav=document.querySelector('.nav');if(!nav)return null;var b=document.getElementById('wbNavAccess');if(b)return b;
 b=document.createElement('button');b.id='wbNavAccess';b.type='button';b.className='wbNavAccess';nav.appendChild(b);
 b.addEventListener('click',function(e){e.preventDefault();e.stopImmediatePropagation();
  if(state.admin)openAdmin();else if(state.unlocked)clientMenu();else{pending=null;showGate();}},true);
 return b;}
function updateNav(){var b=navBtn();if(!b)return;b.innerHTML=state.admin?'🔑 <label>Admin · client codes</label>':state.unlocked?'✅ <label>'+esc(state.name||'Student')+'</label>':'🔑 <label>Student login</label>';}
function clientMenu(){var g=gateEl();g.classList.add('on');var box=g.querySelector('.wbBox');
 var old=box.innerHTML;box.innerHTML='<div class="wbBrand">WordBloom</div><h2>Hi'+(state.name?', '+esc(state.name):'')+'!</h2><p>Your lessons are unlocked on this device.</p>'+
 '<button class="wbBtn full" id="wbCmClose">Continue / Dalej</button><button class="wbLink" id="wbCmOut">Log out on this device / Wyloguj</button>';
 function restore(){box.innerHTML=old;g.remove();}
 box.querySelector('#wbCmClose').onclick=function(){restore();};
 box.querySelector('#wbCmOut').onclick=function(){ls(LS.code,null);ls(LS.name,null);ls(LS.ok,null);setUnlocked(false);restore();goHome();};}

/* ---------- admin ---------- */
var codes=[];
function adminEl(){var a=document.getElementById('wbAdmin');if(a)return a;a=document.createElement('div');a.id='wbAdmin';document.body.appendChild(a);
 a.addEventListener('click',function(e){if(e.target===a)closeAdmin();});return a;}
function closeAdmin(){var a=document.getElementById('wbAdmin');if(a)a.classList.remove('on');}
function openAdmin(){var a=adminEl();a.classList.add('on');var tok=ls(LS.admin);if(tok&&state.admin)renderAdmin();else renderAdminLogin();}
function renderAdminLogin(){var a=adminEl();a.innerHTML='<div class="wbBox"><div class="wbBrand">WordBloom</div><h2>Admin</h2><p>Natalia only. Enter your admin password.</p>'+
 '<form id="wbAdmForm"><input id="wbAdmPw" type="password" autocomplete="current-password" placeholder="Admin password" style="letter-spacing:0"><button class="wbBtn full" type="submit">Sign in</button></form><div id="wbAdmMsg" class="wbMsg"></div><button class="wbLink" id="wbAdmCancel">Cancel</button></div>';
 a.querySelector('#wbAdmCancel').onclick=closeAdmin;
 a.querySelector('#wbAdmForm').onsubmit=function(e){e.preventDefault();var m=a.querySelector('#wbAdmMsg');m.className='wbMsg ok';m.textContent='Checking…';
  rpc('wb_admin_login',{p_password:a.querySelector('#wbAdmPw').value}).then(function(t){if(t){ls(LS.admin,t);setUnlocked(true,true,'Natalia');hideGate();renderAdmin();}else{m.className='wbMsg';m.textContent='Wrong password (or too many tries - wait 15 minutes).';}}).catch(function(){m.className='wbMsg';m.textContent='Could not reach the server. Try again.';});};
 setTimeout(function(){var i=a.querySelector('#wbAdmPw');if(i)i.focus();},50);}
function fmt(d){if(!d)return '-';var x=new Date(d);return x.toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'});}
function clientMsg(c){return 'Hi '+c.client_name+'! Here is your WordBloom access code: '+c.code+'\nOpen '+SITE+' , click any lesson (or "Student login" in the menu) and type the code. It stays unlocked on your device.\n\nCześć! Twój kod dostępu do WordBloom: '+c.code+'\nWejdź na '+SITE+' , kliknij dowolną lekcję i wpisz kod.';}
function copy(txt,btn){function done(){if(btn){var o=btn.textContent;btn.textContent='Copied ✓';setTimeout(function(){btn.textContent=o;},1500);}}
 if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(done,function(){fallback();});}else fallback();
 function fallback(){var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();try{document.execCommand('copy');}catch(e){}t.remove();done();}}
function renderAdmin(newCode){var a=adminEl();
 a.innerHTML='<div class="wbBox wide"><div class="wbTop"><div><div class="wbBrand">WordBloom</div><h2 style="margin:0">Client access codes</h2></div><div><button class="wbBtn light sm" id="wbAdmOut">Sign out</button> <button class="wbBtn light sm" id="wbAdmClose">Close ✕</button></div></div>'+
 '<p style="margin-top:8px">Each student gets their own code. Switch a code off and only that student loses access (next time they open the site).</p>'+
 '<form id="wbNewForm" class="wbRow"><div><label>Student name</label><input id="wbNewName" placeholder="e.g. Ola Nowak" maxlength="80"></div><div><label>Note (optional)</label><input id="wbNewNote" placeholder="e.g. B1, Tuesdays" maxlength="120"></div><div style="flex:0 0 auto"><button class="wbBtn" type="submit">+ Create code</button></div></form>'+
 '<div id="wbAdmMsg" class="wbMsg"></div>'+
 (newCode?'<div class="wbNew"><strong>New code for '+esc(newCode.client_name)+': <span class="wbCode">'+esc(newCode.code)+'</span></strong><br><br>Message to send:<br>'+esc(clientMsg(newCode))+'<br><button class="wbBtn sm" id="wbCopyNew">Copy message</button> <button class="wbBtn light sm" id="wbCopyNewCode">Copy code only</button></div>':'')+
 '<div id="wbList">Loading…</div></div>';
 a.querySelector('#wbAdmClose').onclick=closeAdmin;
 a.querySelector('#wbAdmOut').onclick=function(){var t=ls(LS.admin);ls(LS.admin,null);if(t)rpc('wb_admin_logout',{p_token:t}).catch(function(){});setUnlocked(false);closeAdmin();verify();};
 if(newCode){a.querySelector('#wbCopyNew').onclick=function(){copy(clientMsg(newCode),this);};a.querySelector('#wbCopyNewCode').onclick=function(){copy(newCode.code,this);};}
 a.querySelector('#wbNewForm').onsubmit=function(e){e.preventDefault();var n=a.querySelector('#wbNewName').value.trim(),note=a.querySelector('#wbNewNote').value.trim(),m=a.querySelector('#wbAdmMsg');
  if(!n){m.className='wbMsg';m.textContent='Type the student name first.';return;}
  m.className='wbMsg ok';m.textContent='Creating…';
  rpc('wb_admin_create',{p_token:ls(LS.admin),p_name:n,p_note:note||null}).then(function(c){renderAdmin(c);}).catch(adminErr);};
 loadList();}
function adminErr(e){if(e&&/not_admin/.test(e.message)){ls(LS.admin,null);setUnlocked(false);renderAdminLogin();return;}var m=document.getElementById('wbAdmMsg');if(m){m.className='wbMsg';m.textContent='Something went wrong: '+(e&&e.message||'try again');}}
function loadList(){rpc('wb_admin_list',{p_token:ls(LS.admin)}).then(function(rows){codes=rows||[];var l=document.getElementById('wbList');if(!l)return;
 if(!codes.length){l.innerHTML='<p style="margin-top:14px">No codes yet. Create the first one above.</p>';return;}
 l.innerHTML='<table class="wbTable"><thead><tr><th>Student</th><th>Code</th><th>Status</th><th>Created</th><th>Last used</th><th></th></tr></thead><tbody>'+codes.map(function(c,i){
  return '<tr><td><strong>'+esc(c.client_name)+'</strong>'+(c.note?'<div class="pl">'+esc(c.note)+'</div>':'')+'</td><td class="wbCode">'+esc(c.code)+'</td><td><span class="wbPill '+(c.active?'on">Active':'off">Off')+'</span></td><td class="wbNw">'+fmt(c.created_at)+'</td><td class="wbNw">'+fmt(c.last_used_at)+'</td><td style="white-space:nowrap">'+
  '<button class="wbBtn light sm" data-act="copy" data-i="'+i+'">Copy message</button>'+
  (c.active?'<button class="wbBtn red sm" data-act="off" data-i="'+i+'">Switch off</button>':'<button class="wbBtn green sm" data-act="on" data-i="'+i+'">Switch on</button>')+
  '<button class="wbBtn light sm" data-act="del" data-i="'+i+'" title="Delete">🗑</button></td></tr>';}).join('')+'</tbody></table>';
 l.querySelectorAll('button[data-act]').forEach(function(b){b.onclick=function(){var c=codes[+b.getAttribute('data-i')],act=b.getAttribute('data-act'),t=ls(LS.admin);
  if(act==='copy'){copy(clientMsg(c),b);return;}
  if(act==='del'){if(!confirm('Delete the code for '+c.client_name+'? They will lose access. This cannot be undone.'))return;rpc('wb_admin_delete',{p_token:t,p_id:c.id}).then(loadList).catch(adminErr);return;}
  rpc('wb_admin_set_active',{p_token:t,p_id:c.id,p_active:act==='on'}).then(loadList).catch(adminErr);};});
}).catch(adminErr);}

/* ---------- startup ---------- */
function verify(){var tok=ls(LS.admin);
 if(tok){rpc('wb_admin_check',{p_token:tok}).then(function(ok){if(ok)setUnlocked(true,true,'Natalia');else{ls(LS.admin,null);verifyClient();}}).catch(function(){setUnlocked(true,true,'Natalia');});return;}
 verifyClient();}
function verifyClient(){var code=ls(LS.code);if(!code){setUnlocked(false);return;}
 var okAt=+ls(LS.ok)||0;setUnlocked(Date.now()-okAt<GRACE_MS,false,ls(LS.name));
 rpc('wb_check_code',{p_code:code}).then(function(r){if(r&&r.ok){ls(LS.ok,String(Date.now()));ls(LS.name,r.name||'');setUnlocked(true,false,r.name);}
  else if(r&&r.reason!=='too_many'){ls(LS.code,null);ls(LS.name,null);ls(LS.ok,null);setUnlocked(false);var a=document.querySelector('.page.active');if(a&&isLockedPage(a.id)){goHome();}showGate(r.reason==='inactive'?'Your code has been switched off. Please contact Natalia. / Twój kod jest nieaktywny.':'');hideGateIfPublic(r.reason);}
 }).catch(function(){});}
function hideGateIfPublic(reason){if(reason!=='inactive')hideGate();}
function init(){if(!document.body||!document.querySelector('.nav')){setTimeout(init,200);return;}css();document.body.classList.add('wb-locked');markNav();updateNav();verify();
 if(/[?&#]admin\b/.test(String((window.parent||window).location.href)))setTimeout(openAdmin,300);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
