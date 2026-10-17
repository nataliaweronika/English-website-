// WordBloom – download page shown right after a Stripe payment.
// Stripe redirects buyers to: https://wordbloom.ca/pobierz?produkt=k4-pakiet&session_id=cs_...
// This function checks with Stripe that the session is really paid and was bought
// through the matching payment link, then shows the link to that class's materials.
//
// Needs one environment variable in Vercel: STRIPE_SECRET_KEY (or "key") (a restricted key with
// read access to Checkout Sessions is enough).

const PRODUCTS = {
  'k1-pakiet': { name: 'Klasa 1 · Pakiet na cały rok', link: 'plink_1UQcsUJxbitbq8VleBonNDMt', url: 'https://drive.google.com/drive/folders/16NbSYl8wGErnxC2ICZDI4W89v0c0CvJ1' },
  'k2-pakiet': { name: 'Klasa 2 · Pakiet na cały rok', link: 'plink_1UQcsYJxbitbq8VlFq6PQ6pi', url: 'https://drive.google.com/drive/folders/1U2A6td4iiSH4waZecF1Vaum95MxdS9G7' },
  'k3-pakiet': { name: 'Klasa 3 · Pakiet na cały rok', link: 'plink_1UQcscJxbitbq8Vl04eeAESg', url: 'https://drive.google.com/drive/folders/1jzhKK3qY3xTbW1w-S4Vq1W1S1ML0KV-3' },
  'k4-pakiet': { name: 'Klasa 4 · Pakiet na cały rok', link: 'plink_1UQcsgJxbitbq8Vl2RVqbPPL', url: 'https://drive.google.com/drive/folders/1ZftcON7_pRcH8mPc89EBIfGxhdB2naiu' },
  'k5-pakiet': { name: 'Klasa 5 · Pakiet na cały rok', link: 'plink_1UQcskJxbitbq8Vl0E5sA4a1', url: 'https://drive.google.com/drive/folders/1uNPalxAQRYGxAiKrtWmd0Kvq5QWyrZAt' },
  'k6-pakiet': { name: 'Klasa 6 · Pakiet na cały rok', link: 'plink_1UQcsoJxbitbq8VlqltJWoya', url: 'https://drive.google.com/drive/folders/1iqGIbkMMtu7rj5cdBZptYtFjxLBlzCuS' },
  'k7-pakiet': { name: 'Klasa 7 · Pakiet na cały rok', link: 'plink_1UQcssJxbitbq8Vl8kSeaeqx', url: 'https://drive.google.com/drive/folders/129cWNeCE9GTl9CQ6SVM7UYVb3JDCkdGE' },
  'k8-pakiet': { name: 'Klasa 8 · Pakiet na cały rok', link: 'plink_1UQcswJxbitbq8VlgWyVTNZZ', url: 'https://drive.google.com/drive/folders/1WUUseGK4KQYVuYj_IVFM_1JQwEoBcDSU' },
};

const CONTACT = 'rduchnatalia@gmail.com';

function page(title, body) {
  return `<!doctype html><html lang="pl"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">
<title>${title} – WordBloom</title>
<style>
body{margin:0;font-family:system-ui,-apple-system,Segoe UI,sans-serif;background:#f7f5f0;color:#2b2b2b;display:flex;min-height:100vh;align-items:center;justify-content:center;padding:16px}
.card{background:#fff;max-width:480px;width:100%;border-radius:16px;padding:32px;box-shadow:0 4px 24px rgba(0,0,0,.06);text-align:center}
h1{font-size:1.5rem;margin:0 0 12px}p{line-height:1.5;margin:0 0 16px}
a.btn{display:inline-block;background:#2f7d5b;color:#fff;text-decoration:none;padding:14px 24px;border-radius:10px;font-weight:600}
small{color:#777}
</style></head><body><div class="card">${body}</div></body></html>`;
}

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');

  const { produkt, session_id } = req.query || {};
  const product = PRODUCTS[produkt];
  const help = `<p><small>Problem? Napisz: <a href="mailto:${CONTACT}">${CONTACT}</a></small></p>`;

  if (!product || !session_id || !/^cs_(live|test)_/.test(session_id)) {
    res.status(400).send(page('Nieprawidłowy link', `<h1>Nieprawidłowy link</h1><p>Ten link do pobrania jest niepełny.</p>${help}`));
    return;
  }

  try {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(session_id)}`, {
      headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY || process.env.key}` },
    });
    const s = await r.json();
    const ok = r.ok && s.payment_status === 'paid' && s.payment_link === product.link;

    if (!ok) {
      res.status(403).send(page('Brak dostępu', `<h1>Nie znaleźliśmy płatności</h1><p>Nie możemy potwierdzić zakupu dla tego linku. Jeśli właśnie zapłaciłeś(-aś), odśwież stronę za chwilę.</p>${help}`));
      return;
    }

    res.status(200).send(page('Dziękuję!', `
<h1>Dziękuję za zakup! 🌱</h1>
<p><strong>${product.name}</strong></p>
<p>Twoje materiały są gotowe. Zapisz ten link – możesz wrócić do plików w każdej chwili.</p>
<p><a class="btn" href="${product.url}" target="_blank" rel="noopener">Pobierz materiały</a></p>
<p><small>Licencja dla jednego nauczyciela – prosimy nie udostępniać linku dalej.</small></p>
${help}`));
  } catch (e) {
    res.status(500).send(page('Błąd', `<h1>Coś poszło nie tak</h1><p>Spróbuj odświeżyć stronę.</p>${help}`));
  }
};
