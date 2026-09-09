/* ============================================================
   HIFZ COMPANION — service worker (offline use)
   Only used by the hosted edition. The single-file edition is
   already offline by nature.
     • app shell  : network first, fall back to the cache
     • mushaf/…   : cache first (pages never change)
   The page itself fills PAGES with the Mushaf images the user
   asks to keep, through caches.open(PAGES).
   ============================================================ */
const V = '1.11.3';
const SHELL = 'hifz-shell-' + V, PAGES = 'hifz-pages-v1';
const SHELL_URLS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    try { await c.addAll(SHELL_URLS); } catch (_) { }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k.startsWith('hifz-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'skipWaiting') self.skipWaiting();
  if (d.type === 'ping' && e.source) e.source.postMessage({ type: 'pong', version: V });
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // audio, APIs, fonts — left alone
  if (url.pathname.includes('/mushaf/')) {                   // Mushaf pages: cache first
    e.respondWith((async () => {
      const c = await caches.open(PAGES);
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) c.put(req, res.clone());
      return res;
    })());
    return;
  }
  e.respondWith((async () => {                               // app shell: network first
    const c = await caches.open(SHELL);
    try {
      const res = await fetch(req);
      if (res && res.ok) c.put(req, res.clone());
      return res;
    } catch (err) {
      const hit = await c.match(req, { ignoreSearch: true }) || await c.match('./index.html');
      if (hit) return hit;
      throw err;
    }
  })());
});
