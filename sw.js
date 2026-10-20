const CACHE='SistemaRH2_Static_2.0.0-r2';
const FILES=['./','./index.html','./styles.css','./app.js','./domain.js','./db.js','./backup.js','./ui.js','./utils.js','./pwa.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png','./manus-routes.json'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES))));
self.addEventListener('message',e=>{if(e.data?.type==='UPDATE_RH2')self.skipWaiting();});
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('SistemaRH2_Static_')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const url=new URL(e.request.url),scope=new URL(self.registration.scope);if(url.origin!==scope.origin)return;const canonical=FILES.map(f=>new URL(f,scope)).find(f=>f.pathname===url.pathname);if(canonical)e.respondWith(caches.open(CACHE).then(c=>c.match(canonical.href)).then(hit=>hit||fetch(e.request)));});
// Apenas arquivos estáticos RH2. Nunca abre/apaga IndexedDB ou caches da versão1.1.
