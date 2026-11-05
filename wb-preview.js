/* WordBloom – preview PDFs before downloading.
 * Any link on the site that points to a .pdf on wordbloom.ca opens a preview window
 * (pages rendered with pdf.js, self-hosted in /vendor/pdfjs/) with a "Pobierz" button.
 * Ctrl/Cmd/Shift-click still opens or downloads the file directly.
 * Optional: data-preview-title="…" on the link sets the window title; data-no-preview skips it.
 */
(function () {
  var PDFJS = '/vendor/pdfjs/pdf.min.js';
  var WORKER = '/vendor/pdfjs/pdf.worker.min.js';
  var MAX_PAGES = 40;
  var libPromise = null;
  var modal = null, current = null;

  function loadLib() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (libPromise) return libPromise;
    libPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = PDFJS;
      s.onload = function () {
        if (!window.pdfjsLib) return reject(new Error('pdf.js missing'));
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = WORKER;
        resolve(window.pdfjsLib);
      };
      s.onerror = function () { libPromise = null; reject(new Error('pdf.js failed to load')); };
      document.head.appendChild(s);
    });
    return libPromise;
  }

  function css() {
    var st = document.createElement('style');
    st.textContent =
      '.wbp-back{position:fixed;inset:0;z-index:10000;background:rgba(20,24,31,.72);display:flex;align-items:center;justify-content:center;padding:16px}' +
      '.wbp-box{background:#fff;color:#1d2330;border-radius:14px;width:min(860px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:inherit}' +
      '.wbp-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #e6e8ee}' +
      '.wbp-title{flex:1;min-width:0;margin:0;font-size:1rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}' +
      '.wbp-title small{display:block;font-weight:400;color:#6a7282;font-size:.8rem}' +
      '.wbp-x{border:0;background:#f1f3f7;color:#1d2330;width:36px;height:36px;border-radius:50%;font-size:22px;line-height:1;cursor:pointer;flex:none}' +
      '.wbp-pages{flex:1;overflow:auto;background:#eef0f4;padding:16px;display:flex;flex-direction:column;align-items:center;gap:14px;-webkit-overflow-scrolling:touch}' +
      '.wbp-page{width:100%;max-width:780px;background:#fff;box-shadow:0 2px 10px rgba(0,0,0,.12);position:relative}' +
      '.wbp-page canvas{display:block;width:100%;height:auto}' +
      '.wbp-page span{position:absolute;right:8px;bottom:6px;font-size:.72rem;color:#6a7282;background:rgba(255,255,255,.85);padding:1px 6px;border-radius:8px}' +
      '.wbp-msg{margin:40px 0;color:#4a5262;text-align:center}' +
      '.wbp-foot{display:flex;flex-wrap:wrap;gap:10px;justify-content:flex-end;align-items:center;padding:12px 16px;border-top:1px solid #e6e8ee}' +
      '.wbp-foot .wbp-note{flex:1;min-width:160px;font-size:.82rem;color:#6a7282;margin:0}' +
      '.wbp-btn{display:inline-block;border-radius:999px;padding:10px 18px;font-weight:700;text-decoration:none;cursor:pointer;border:2px solid #2f6b4f;font-size:.95rem}' +
      '.wbp-dl{background:#2f6b4f;color:#fff}.wbp-close{background:#fff;color:#2f6b4f}' +
      '@media (max-width:560px){.wbp-back{padding:0}.wbp-box{border-radius:0;height:100%}.wbp-pages{padding:10px}.wbp-foot .wbp-btn{flex:1;text-align:center}}' +
      '.wbp-back[hidden]{display:none}' +
      'html.wbp-lock,html.wbp-lock body{overflow:hidden}';
    document.head.appendChild(st);
  }

  function build() {
    css();
    modal = document.createElement('div');
    modal.className = 'wbp-back';
    modal.hidden = true;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'wbp-title');
    modal.innerHTML =
      '<div class="wbp-box">' +
      '<div class="wbp-head"><p class="wbp-title" id="wbp-title"></p>' +
      '<button type="button" class="wbp-x" aria-label="Zamknij podgląd / Close preview">&times;</button></div>' +
      '<div class="wbp-pages" tabindex="0"></div>' +
      '<div class="wbp-foot"><p class="wbp-note">Podgląd pliku · <span lang="en">File preview</span></p>' +
      '<button type="button" class="wbp-btn wbp-close">Zamknij</button>' +
      '<a class="wbp-btn wbp-dl" download>Pobierz PDF</a></div></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', function (e) { if (e.target === modal) close(); });
    modal.querySelector('.wbp-x').addEventListener('click', close);
    modal.querySelector('.wbp-close').addEventListener('click', close);
    modal.querySelector('.wbp-dl').addEventListener('click', function () {
      track('pdf_preview_download');
      setTimeout(close, 300);
    });
    document.addEventListener('keydown', function (e) { if (!modal.hidden && e.key === 'Escape') close(); });
  }

  function track(name) {
    if (window.va && current) window.va('event', { name: name, file: current.path });
  }

  function titleFor(a) {
    if (a.dataset.previewTitle) return a.dataset.previewTitle;
    var card = a.closest('article, section, .card');
    var h = card && card.querySelector('h1, h2, h3');
    var t = h ? h.textContent : a.textContent;
    return (t || 'PDF').replace(/\s+/g, ' ').trim();
  }

  function open(a, url) {
    if (!modal) build();
    var file = decodeURIComponent(url.pathname.split('/').pop());
    current = { path: url.pathname, task: null, observer: null, opener: a };
    var title = modal.querySelector('.wbp-title');
    title.textContent = titleFor(a);
    var sub = document.createElement('small');
    sub.textContent = file;
    title.appendChild(sub);
    var dl = modal.querySelector('.wbp-dl');
    dl.href = url.pathname;
    dl.setAttribute('download', file);
    var pages = modal.querySelector('.wbp-pages');
    pages.innerHTML = '<p class="wbp-msg">Wczytuję podgląd… <span lang="en">Loading preview…</span></p>';
    pages.scrollTop = 0;
    modal.hidden = false;
    document.documentElement.classList.add('wbp-lock');
    modal.querySelector('.wbp-x').focus();
    track('pdf_preview_open');
    var mine = current;

    loadLib().then(function (lib) {
      var task = lib.getDocument({ url: url.pathname });
      mine.task = task;
      return task.promise;
    }).then(function (pdf) {
      if (current !== mine) return;
      pages.innerHTML = '';
      var n = Math.min(pdf.numPages, MAX_PAGES);
      modal.querySelector('.wbp-note').innerHTML = 'Podgląd · ' + pdf.numPages + ' ' + plural(pdf.numPages) +
        (pdf.numPages > n ? ' (pokazuję pierwsze ' + n + ')' : '');
      var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) { io.unobserve(en.target); render(pdf, en.target, mine); }
        });
      }, { root: pages, rootMargin: '600px 0px' }) : null;
      mine.observer = io;
      for (var i = 1; i <= n; i++) {
        var box = document.createElement('div');
        box.className = 'wbp-page';
        box.dataset.page = i;
        box.style.aspectRatio = '1 / 1.414';
        box.innerHTML = '<span>' + i + ' / ' + pdf.numPages + '</span>';
        pages.appendChild(box);
        if (io) io.observe(box); else render(pdf, box, mine);
      }
    }).catch(function (err) {
      if (current !== mine) return;
      console.warn('WordBloom preview failed', err);
      pages.innerHTML = '<p class="wbp-msg">Nie udało się wyświetlić podglądu – możesz pobrać plik przyciskiem poniżej.<br>' +
        '<span lang="en">The preview could not be shown – use the button below to download the file.</span></p>';
    });
  }

  function plural(n) {
    if (n === 1) return 'strona';
    var d = n % 10, t = n % 100;
    return (d >= 2 && d <= 4 && (t < 12 || t > 14)) ? 'strony' : 'stron';
  }

  function render(pdf, box, mine) {
    pdf.getPage(Number(box.dataset.page)).then(function (page) {
      if (current !== mine) return;
      var base = page.getViewport({ scale: 1 });
      var width = Math.min(box.clientWidth || 780, 780);
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var vp = page.getViewport({ scale: (width / base.width) * dpr });
      var c = document.createElement('canvas');
      c.width = Math.floor(vp.width);
      c.height = Math.floor(vp.height);
      c.setAttribute('aria-label', 'Strona ' + box.dataset.page);
      box.style.aspectRatio = base.width + ' / ' + base.height;
      box.insertBefore(c, box.firstChild);
      return page.render({ canvasContext: c.getContext('2d'), viewport: vp }).promise;
    }).catch(function (e) { console.warn('WordBloom preview page failed', e); });
  }

  function close() {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.documentElement.classList.remove('wbp-lock');
    if (current) {
      if (current.observer) current.observer.disconnect();
      if (current.task) current.task.destroy();
      if (current.opener && current.opener.focus) current.opener.focus();
    }
    current = null;
    modal.querySelector('.wbp-pages').innerHTML = '';
  }

  document.addEventListener('click', function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]');
    if (!a || a.hasAttribute('data-no-preview') || a.closest('.wbp-back')) return;
    var url;
    try { url = new URL(a.getAttribute('href'), location.href); } catch (_) { return; }
    if (url.origin !== location.origin || !/\.pdf$/i.test(url.pathname)) return;
    e.preventDefault();
    open(a, url);
  });
})();
