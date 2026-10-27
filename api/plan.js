// WordBloom Skills Studio – shows the access code right after a Stripe payment.
// Stripe payment link → after payment redirect to:
//   https://wordbloom.ca/api/plan?plan=uczen-3m&session_id={CHECKOUT_SESSION_ID}
// The function checks with Stripe that the session is paid with the right amount,
// then creates (once per session) the plan in Supabase and shows the code.
//
// Environment variables in Vercel:
//   STRIPE_SECRET_KEY            (already used by /pobierz)
//   SUPABASE_SERVICE_ROLE_KEY    (Supabase → Project settings → API → service_role)

const SUPABASE = 'https://ynwumcchbhdlejsvwlse.supabase.co';
const CONTACT = 'rduchnatalia@gmail.com';

// Keep in sync with CFG.plans in skills-app.js. `link` (plink_...) is optional but recommended.
const PLANS = {
  'uczen-1m': { kind: 'student', months: 1, price: 19, label: 'Plan ucznia · 1 miesiąc', link: 'plink_1UUCURJxbitbq8Vl5wkXurTn' },
  'uczen-3m': { kind: 'student', months: 3, price: 49, label: 'Plan ucznia · 3 miesiące', link: 'plink_1UUCWIJxbitbq8VlciGK6YyS' },
  'uczen-6m': { kind: 'student', months: 6, price: 89, label: 'Plan ucznia · 6 miesięcy', link: 'plink_1UUCXwJxbitbq8VlH9qRM61V' },
  'klasa-1m': { kind: 'teacher', months: 1, price: 30, label: 'Plan klasowy · 1 miesiąc', link: 'plink_1UVCrJJxbitbq8VlfkexumR6' },
  'klasa-3m': { kind: 'teacher', months: 3, price: 80, label: 'Plan klasowy · 3 miesiące', link: 'plink_1UVCtwJxbitbq8VlEjVWpoiG' },
  'klasa-6m': { kind: 'teacher', months: 6, price: 150, label: 'Plan klasowy · 6 miesięcy', link: 'plink_1UVCyMJxbitbq8Vl9RwBzYxU' },
};

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

function page(title, body) {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title} – WordBloom</title>
<style>
body{margin:0;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif;background:#f6f4ee;color:#17244b;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}
.card{background:#fff;max-width:520px;width:100%;border-radius:24px;padding:32px;box-shadow:0 8px 30px rgba(23,36,75,.08);text-align:center}
h1{font:normal 30px Georgia,serif;margin:8px 0 10px}p{line-height:1.55;margin:0 0 14px}
.code{font:800 28px ui-monospace,Menlo,monospace;letter-spacing:.08em;background:#eceefe;border-radius:16px;padding:16px;margin:8px 0 6px;word-break:break-all}
.lbl{font:800 12px Inter,system-ui,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#6b7590;margin-top:14px}
a.btn{display:inline-block;background:#5968e8;color:#fff;text-decoration:none;padding:14px 24px;border-radius:999px;font-weight:800;margin-top:10px}
small{color:#6b7590}ol{text-align:left;line-height:1.6}
</style></head><body><div class="card">${body}</div></body></html>`;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  const { plan: planKey, session_id } = req.query || {};
  const plan = PLANS[planKey];
  const help = `<p><small>Problem? Napisz: <a href="mailto:${CONTACT}">${CONTACT}</a> – podaj e-mail użyty przy płatności.</small></p>`;

  if (!plan || !session_id || !/^cs_(live|test)_[A-Za-z0-9]+$/.test(session_id)) {
    res.status(400).send(page('Nieprawidłowy link', `<h1>Nieprawidłowy link</h1><p>Ten link jest niepełny.</p>${help}`));
    return;
  }
  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`, {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY || process.env.key}` },
    });
    const s = await r.json();
    const paid = r.ok && s.payment_status === 'paid' && s.currency === 'pln' && s.amount_total === plan.price * 100 && (!plan.link || s.payment_link === plan.link);
    if (!paid) {
      res.status(403).send(page('Brak płatności', `<h1>Nie znaleźliśmy płatności</h1><p>Jeśli właśnie zapłaciłeś(-aś), odśwież stronę za chwilę.</p>${help}`));
      return;
    }
    const email = (s.customer_details && s.customer_details.email) || '';
    const name = (s.customer_details && s.customer_details.name) || '';
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const out = await fetch(`${SUPABASE}/rest/v1/rpc/wb_plan_issue`, {
      method: 'POST',
      headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ p_kind: plan.kind, p_months: plan.months, p_name: plan.kind === 'teacher' ? '' : name.split(' ')[0], p_email: email, p_session: session_id }),
    });
    const p = await out.json();
    if (!out.ok || !p || !p.ok) throw new Error('issue failed');

    const until = new Date(p.expires_at).toLocaleDateString('pl-PL', { day: 'numeric', month: 'long', year: 'numeric' });
    const start = `https://wordbloom.ca/skills.html?code=${encodeURIComponent(p.code)}`;
    const body = plan.kind === 'teacher'
      ? `<div style="font-size:48px">🎉</div><h1>Dziękuję! Twoja klasa jest gotowa</h1><p>${esc(plan.label)} · ważny do <b>${until}</b></p>
         <div class="lbl">Twój kod nauczyciela (tylko dla Ciebie)</div><div class="code">${esc(p.code)}</div>
         <div class="lbl">Kod klasy (dla uczniów)</div><div class="code">${esc(p.class_code)}</div>
         <ol><li>Kliknij przycisk poniżej – kod nauczyciela wpisze się sam.</li><li>W „Dla nauczyciela” skopiuj gotową wiadomość dla rodziców.</li><li>Uczniowie wpisują kod klasy i imię – i gotowe.</li></ol>
         <a class="btn" href="${start}#teacher">Otwórz panel nauczyciela →</a><p><small>Zrób zrzut ekranu lub zapisz kody. Potwierdzenie płatności wysłał Stripe na ${esc(email)}.</small></p>`
      : `<div style="font-size:48px">🎉</div><h1>Dziękuję! Dostęp jest aktywny</h1><p>${esc(plan.label)} · ważny do <b>${until}</b></p>
         <div class="lbl">Twój kod dostępu</div><div class="code">${esc(p.code)}</div>
         <p><small>Zapisz kod – wpiszesz go na każdym urządzeniu (telefon, tablet, komputer). Bez automatycznego odnawiania.</small></p>
         <a class="btn" href="${start}">Zacznij naukę →</a>`;
    res.status(200).send(page('Twój kod', body + help));
  } catch (e) {
    res.status(500).send(page('Błąd', `<h1>Coś poszło nie tak</h1><p>Płatność jest bezpieczna – odśwież stronę za chwilę albo napisz do mnie, a wyślę kod ręcznie.</p>${help}`));
  }
};
