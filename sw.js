/* ============================================================
   HIFZ COMPANION — service worker (offline use)
   Only used by the hosted edition. The single-file edition is
   already offline by nature.
     • app shell  : network first, fall back to the cache; the
                    new shell only replaces the old one once it
                    has been cached successfully
     • mushaf/…   : cache first (pages never change)
   The page itself fills PAGES with the Mushaf images the user
   asks to keep, through caches.open(PAGES). Learning data lives
   in localStorage / IndexedDB and is never touched here.
   ============================================================ */
const V = '1.20.7';
const SHELL = 'hifz-shell-' + V, PAGES = 'hifz-pages-v1';
const SHELL_URLS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    try { await c.addAll(SHELL_URLS); }
    catch (err) {
      // could not fetch the new shell: keep whatever older shell exists rather than installing an empty one
      const keys = await caches.keys(); const olds = keys.filter(k => k.startsWith('hifz-shell-') && k !== SHELL);
      if (olds.length) { const old = await caches.open(olds[olds.length - 1]); for (const u of SHELL_URLS) { const r = await old.match(u); if (r) await c.put(u, r); } }
      if (!(await c.match('./index.html'))) { await caches.delete(SHELL); throw err; }   // nothing usable: abort this install, the previous worker stays
    }
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL); const ok = !!(await c.match('./index.html'));
    if (ok) for (const k of await caches.keys()) if (k.startsWith('hifz-shell-') && k !== SHELL) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener('message', e => {
  const d = e.data || {};
  if (d.type === 'skipWaiting') self.skipWaiting();
  if (d.type === 'ping' && e.source) e.source.postMessage({ type: 'pong', version: V });
});

const isNav = req => req.mode === 'navigate' || (req.destination === 'document') || ((req.headers.get('accept') || '').includes('text/html') && req.destination === '');

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;          // audio, APIs, tafsīr, YouTube — left alone
  if (url.pathname.includes('/mushaf/')) {                   // Mushaf pages: cache first, never evicted here
    e.respondWith((async () => {
      const c = await caches.open(PAGES);
      const hit = await c.match(req, { ignoreSearch: true });
      if (hit) return hit;
      const res = await fetch(req);
      if (res && res.ok) e.waitUntil(c.put(req, res.clone()));
      return res;
    })());
    return;
  }
  e.respondWith((async () => {                               // app shell: network first; cached copy on network failure or a server error
    const c = await caches.open(SHELL);
    const cached = async () => (await c.match(req, { ignoreSearch: true })) || (isNav(req) ? await c.match('./index.html') : null);
    try {
      const res = await fetch(req);
      if (res && res.ok) { if (isNav(req) || url.pathname.endsWith('/sw.js') === false) e.waitUntil(c.put(req, res.clone())); return res; }
      if (res && res.status >= 500) { const hit = await cached(); if (hit) return hit; }
      return res;                                            // 404 etc. are returned as they are — never index.html for a missing script
    } catch (err) {
      const hit = await cached();
      if (hit) return hit;
      throw err;
    }
  })());
});
