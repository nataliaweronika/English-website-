// WordBloom – download page shown right after a Stripe payment.
// Stripe redirects buyers to: https://wordbloom.ca/pobierz?produkt=k4-pakiet&session_id=cs_...
// This function checks with Stripe that the session is really paid and was bought
// through the matching payment link, then shows the link to that class's materials.
//
// Environment variables in Vercel (restricted keys with read access to Checkout Sessions are enough):
//   STRIPE_SECRET_KEY_PL  – Polish Stripe account (all current payment links)
//   STRIPE_SECRET_KEY     – old Canadian account (keeps earlier buyers' download links working)

const PRODUCTS = {
  'k1-pakiet': { name: 'Klasa 1 · Pakiet na cały rok', link: 'plink_1UYIQrFT3aB0L7IKPznR0Xca', oldLinks: ['plink_1UQcsUJxbitbq8VleBonNDMt', 'plink_1UVZ9VJxbitbq8Vlgakld1NL'], url: 'https://drive.google.com/drive/folders/16NbSYl8wGErnxC2ICZDI4W89v0c0CvJ1' },
  'k2-pakiet': { name: 'Klasa 2 · Pakiet na cały rok', link: 'plink_1UYIQsFT3aB0L7IKw2DnTGQl', oldLinks: ['plink_1UQcsYJxbitbq8VlFq6PQ6pi', 'plink_1UVZCVJxbitbq8Vl2uGrr1l9'], url: 'https://drive.google.com/drive/folders/1U2A6td4iiSH4waZecF1Vaum95MxdS9G7' },
  'k3-pakiet': { name: 'Klasa 3 · Pakiet na cały rok', link: 'plink_1UYIQuFT3aB0L7IKb5fqxnjH', oldLinks: ['plink_1UQcscJxbitbq8Vl04eeAESg', 'plink_1UVZEaJxbitbq8Vl40rTBwUI'], url: 'https://drive.google.com/drive/folders/1jzhKK3qY3xTbW1w-S4Vq1W1S1ML0KV-3' },
  'k4-pakiet': { name: 'Klasa 4 · Pakiet na cały rok', link: 'plink_1UYIQwFT3aB0L7IKqGDlbkt5', oldLinks: ['plink_1UQcsgJxbitbq8Vl2RVqbPPL', 'plink_1UVZGSJxbitbq8Vlf2B59LlZ'], url: 'https://drive.google.com/drive/folders/1ZftcON7_pRcH8mPc89EBIfGxhdB2naiu' },
  'k5-pakiet': { name: 'Klasa 5 · Pakiet na cały rok', link: 'plink_1UYIQyFT3aB0L7IKGA0ecyEO', oldLinks: ['plink_1UQcskJxbitbq8Vl0E5sA4a1', 'plink_1UVZIsJxbitbq8Vlh1AG7VoN'], url: 'https://drive.google.com/drive/folders/1uNPalxAQRYGxAiKrtWmd0Kvq5QWyrZAt' },
  'k6-pakiet': { name: 'Klasa 6 · Pakiet na cały rok', link: 'plink_1UYIR0FT3aB0L7IKkj77AMOo', oldLinks: ['plink_1UQcsoJxbitbq8VlqltJWoya', 'plink_1UVZLmJxbitbq8VlEAvjSK02'], url: 'https://drive.google.com/drive/folders/1iqGIbkMMtu7rj5cdBZptYtFjxLBlzCuS' },
  'k7-pakiet': { name: 'Klasa 7 · Pakiet na cały rok', link: 'plink_1UYIR2FT3aB0L7IKPIEez4q2', oldLinks: ['plink_1UQcssJxbitbq8Vl8kSeaeqx', 'plink_1UVZNrJxbitbq8VlWEqvmizR'], url: 'https://drive.google.com/drive/folders/129cWNeCE9GTl9CQ6SVM7UYVb3JDCkdGE' },
  'k8-pakiet': { name: 'Klasa 8 · Pakiet na cały rok', link: 'plink_1UYIR4FT3aB0L7IKeMRKRyE9', oldLinks: ['plink_1UQcswJxbitbq8VlgWyVTNZZ', 'plink_1UVZQWJxbitbq8VlDvQS3C6F'], url: 'https://drive.google.com/drive/folders/1WUUseGK4KQYVuYj_IVFM_1JQwEoBcDSU' },
  'matura-2027': { name: 'Matura 2027 · Pełny zeszyt (licencja nauczyciela)', link: 'plink_1UYIRAFT3aB0L7IKAPj5mNcs', oldLinks: ['plink_1UQYvCJxbitbq8VlPe76oQUa'], url: 'https://drive.google.com/file/d/1idTUj1akbrQ7pyipL1jogRAUbINcxi0A/view', licence: 'Licencja dla jednego nauczyciela – możesz drukować kopie dla swoich klas, prosimy nie udostępniać pliku dalej.' },
  // Files kept in the private Vercel Blob store "wordbloom-paid-packs"; served only after the payment check.
  'e8-level-up': { name: 'E8 Level Up! · Egzamin ósmoklasisty 2027 · pełna wersja', link: 'plink_1UYIR8FT3aB0L7IKZ4UscdyY', oldLinks: ['plink_1UTnnfJxbitbq8Vlp0YOHyBm', 'plink_1UY9bOJxbitbq8VlBGEiO5xD'], file: 'e8-level-up-pelna-wersja.pdf', licence: 'Licencja dla jednego ucznia – prosimy nie udostępniać pliku dalej.' },
  'speaking-30': { name: '30 Days of Speaking · wersja interaktywna', link: 'plink_1UYIR6FT3aB0L7IK9xDNbWeQ', oldLinks: ['plink_1US1sPJxbitbq8VluhUkoBOw'], file: '30-days-of-speaking-interactive.pdf', licence: 'Licencja dla jednego ucznia – prosimy nie udostępniać pliku dalej.' },
  'matura-transformacje': { name: 'Matura · Use of English: Transformacje (Basic + Advanced)', link: 'plink_1UYvKTFT3aB0L7IKZW96yooH', file: 'matura-transformacje.pdf', licence: 'Licencja dla jednego nauczyciela – możesz drukować kopie dla swoich klas, prosimy nie udostępniać pliku dalej.' },
  'e8-czasy': { name: 'Czasy angielskie – E8 w pigułce (PDF + PowerPoint)', link: 'plink_1UYVwRFT3aB0L7IKCO5mGGc9', url: 'https://drive.google.com/file/d/1ACuYKTBQY_Ku4NCrZlNwb2kLN5dkI4Hi/view', label: 'Pobierz PDF', extra: { label: 'Pobierz PowerPoint', url: 'https://drive.google.com/file/d/1v_QSLehwPbXSlKA5r8Erbg8WDDfuj6gN/view' }, licence: 'Licencja dla jednego nauczyciela – możesz używać prezentacji na swoich lekcjach, prosimy nie udostępniać linku dalej.' },
};

const CONTACT = 'rduchnatalia@gmail.com';

// Payments now go to the Polish Stripe account (WORDBLOOM POLAND). Purchases made earlier went to the
// Canadian account, so we try every configured key: Polish first, then the old Canadian one.
async function getSession(sessionId) {
  const keys = [process.env.STRIPE_SECRET_KEY_PL, process.env.STRIPE_SECRET_KEY || process.env.key].filter(Boolean);
  for (const k of keys) {
    const r = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, {
      headers: { Authorization: `Bearer ${k}` },
    });
    if (r.ok) return { ok: true, s: await r.json() };
  }
  return { ok: false, s: {} };
}

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

  const { produkt, session_id, plik } = req.query || {};
  const product = PRODUCTS[produkt];
  const help = `<p><small>Problem? Napisz: <a href="mailto:${CONTACT}">${CONTACT}</a></small></p>`;

  if (!product || !session_id || !/^cs_(live|test)_/.test(session_id)) {
    res.status(400).send(page('Nieprawidłowy link', `<h1>Nieprawidłowy link</h1><p>Ten link do pobrania jest niepełny.</p>${help}`));
    return;
  }

  try {
    const r = await getSession(session_id);
    const s = r.s;
    const ok = r.ok && s.payment_status === 'paid' && [product.link, ...(product.oldLinks || [])].includes(s.payment_link);

    if (!ok) {
      res.status(403).send(page('Brak dostępu', `<h1>Nie znaleźliśmy płatności</h1><p>Nie możemy potwierdzić zakupu dla tego linku. Jeśli właśnie zapłaciłeś(-aś), odśwież stronę za chwilę.</p>${help}`));
      return;
    }

    if (product.file && plik) {
      // Stream the private file straight to the buyer.
      const { get } = require('@vercel/blob');
      const { Readable } = require('stream');
      const result = await get(product.file, { access: 'private' });
      if (!result || !result.stream) {
        res.status(404).send(page('Brak pliku', `<h1>Nie znaleźliśmy pliku</h1><p>Napisz do mnie – wyślę go e-mailem.</p>${help}`));
        return;
      }
      res.setHeader('Content-Type', result.blob.contentType || 'application/pdf');
      if (result.blob.size) res.setHeader('Content-Length', String(result.blob.size));
      res.setHeader('Content-Disposition', `attachment; filename="${product.file}"`);
      res.setHeader('Cache-Control', 'private, no-store');
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.status(200);
      Readable.fromWeb(result.stream).pipe(res);
      return;
    }

    const href = product.file
      ? `/pobierz?produkt=${encodeURIComponent(produkt)}&session_id=${encodeURIComponent(session_id)}&plik=1`
      : product.url;
    res.status(200).send(page('Dziękuję!', `
<h1>Dziękuję za zakup! 🌱</h1>
<p><strong>${product.name}</strong></p>
<p>Twoje materiały są gotowe. Zapisz ten link – możesz wrócić do plików w każdej chwili.</p>
<p><a class="btn" href="${href}"${product.file ? '' : ' target="_blank" rel="noopener"'}>${product.label || 'Pobierz materiały'}</a></p>
${product.extra ? `<p><a class="btn" href="${product.extra.url}" target="_blank" rel="noopener">${product.extra.label}</a></p>` : ''}
<p><small>${product.licence || 'Licencja dla jednego nauczyciela – prosimy nie udostępniać linku dalej.'}</small></p>
${help}`));
  } catch (e) {
    res.status(500).send(page('Błąd', `<h1>Coś poszło nie tak</h1><p>Spróbuj odświeżyć stronę.</p>${help}`));
  }
};
