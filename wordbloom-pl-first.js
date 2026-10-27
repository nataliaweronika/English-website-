/* WordBloom – Polish first. Many labels on the site are written "English / Polski".
   This script flips them to "Polski / English" in headings, buttons, labels and tags,
   including ones that other scripts add later. Learning content (texts, questions) is not touched. */
(function () {
'use strict';
if (window.__wbPlFirst) return; window.__wbPlFirst = true;
var PLCH = /[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/;
var PLW = /(^|\s)(i|w|z|na|się|lub|oraz|nie|jest|dla|po|do|moje|twoja|twój|twoje|ucz|zacznij|zobacz|wybierz|sprawdź|pokaż|ukryj|dalej|wstecz|zadanie|poziom|słowa|nauka|nauczyciel|uczeń|start)(?=\s|$|[.,!?:])/i;
function isPl(t) { return PLCH.test(t) || PLW.test(t); }
var SEL = 'h1,h2,h3,h4,h5,button,label,summary,th,.tag,.eyebrow,.btn,a.btn,legend,option,.chip';
function flipText(node) {
  var t = node.nodeValue;
  if (!t || t.indexOf(' / ') < 0 || t.length > 160) return;
  var m = t.match(/^(\s*[^\wąćęłńóśźżĄĆĘŁŃÓŚŹŻ]*\s*)(.+?)\s+\/\s+(.+?)(\s*[→✓›»…]*\s*)$/);
  if (!m) return;
  var en = m[2], pl = m[3];
  if (en.indexOf(' / ') > -1 || pl.indexOf(' / ') > -1) return;
  if (!isPl(pl) || PLCH.test(en)) return;               // only when the second half is Polish
  if (/^[A-Z0-9 ]+$/.test(en) && /^[A-ZĄĆĘŁŃÓŚŹŻ0-9 ]+$/.test(pl) && en.length < 3) return;
  node.nodeValue = m[1] + pl + ' / ' + en + m[4];
}
function walk(root) {
  if (!root || root.nodeType !== 1) return;
  var els = root.matches && root.matches(SEL) ? [root] : [];
  els = els.concat(Array.prototype.slice.call(root.querySelectorAll(SEL)));
  els.forEach(function (el) {
    if (el.closest('[data-no-pl-first],textarea,.passage,.mx-script')) return;
    for (var c = el.firstChild; c; c = c.nextSibling) {
      if (c.nodeType === 3) flipText(c);
      else if (c.nodeType === 1 && /^(SPAN|B|STRONG|LABEL|SMALL|EM)$/.test(c.tagName)) for (var d = c.firstChild; d; d = d.nextSibling) if (d.nodeType === 3) flipText(d);
    }
    var al = el.getAttribute && el.getAttribute('aria-label');
    if (al && al.indexOf(' / ') > -1) { var tn = document.createTextNode(al); flipText(tn); if (tn.nodeValue !== al) el.setAttribute('aria-label', tn.nodeValue); }
  });
}
var queued = [], timer = null;
function flush() { timer = null; var q = queued; queued = []; q.forEach(walk); }
function start() {
  walk(document.body);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) queued.push(n); else if (n.nodeType === 3 && n.parentNode) queued.push(n.parentNode); }); });
    if (queued.length && !timer) timer = setTimeout(flush, 30);
  }).observe(document.body, { childList: true, subtree: true });
}
if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
