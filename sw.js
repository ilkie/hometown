// Mijn Dorp service worker: cache the game so it also loads offline and installs as an app.
const CACHE='mijn-dorp-v3';
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(['./','./index.html','./manifest.webmanifest','./assets/tiles.json','./assets/gebouwen.json','./assets/boerderij.json']))); self.skipWaiting(); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); self.clients.claim(); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return; const url=new URL(e.request.url); if(url.origin!==location.origin) return;
  if(url.pathname.endsWith('/')||url.pathname.endsWith('index.html')||url.pathname.endsWith('.json')){ // network first for the game itself, fall back to cache
    e.respondWith(fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; }).catch(()=>caches.match(e.request))); return; }
  e.respondWith(caches.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{ const cp=r.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); return r; })));
});
