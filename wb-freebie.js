/* WordBloom – free download in exchange for an e-mail address.
 * Markup: <div class="wb-freebie" data-source="matura-autumn" data-lang="pl"> <form>…<input type=email>…<input type=checkbox name=consent>…</form> <div class="ok">…download link…</div></div>
 * Saves the address in the Supabase table public.newsletter_signups (see newsletter_setup.sql),
 * then shows the download link. If saving fails, the visitor still gets the link.
 */
(function () {
  var URL = 'https://ynwumcchbdlejsvwvse.supabase.co/rest/v1/newsletter_signups';
  var KEY = 'sb_publishable_NbLZobLWm-uzdAONUPsbNA_pHrhYVf6';

  function init(box) {
    var form = box.querySelector('form');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = (form.querySelector('input[type=email]').value || '').trim();
      var consent = form.querySelector('input[name=consent]');
      if (!email || (consent && !consent.checked)) return;
      var btn = form.querySelector('button');
      if (btn) btn.disabled = true;
      fetch(URL, {
        method: 'POST',
        headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
        body: JSON.stringify({ email: email.toLowerCase(), source: box.dataset.source || 'site', lang: box.dataset.lang || 'pl', consent: true, page: location.pathname })
      }).then(function (r) {
        if (!r.ok && r.status !== 409) console.warn('WordBloom signup not saved', r.status);
      }).catch(function (err) { console.warn('WordBloom signup not saved', err); })
        .then(function () {
          box.classList.add('done');
          if (window.va) window.va('event', { name: 'freebie_signup', source: box.dataset.source || 'site' });
        });
    });
  }

  function run(doc) { Array.prototype.forEach.call(doc.querySelectorAll('.wb-freebie'), init); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { run(document); });
  else run(document);
  window.wbFreebieInit = run;
})();
