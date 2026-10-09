/* Only public app assets are cached. Network first keeps daily content current. */
'use strict';
const CACHE='diabetes-games-20261009-2';
const ASSETS=['/','/index.html','/day-with-sam.html','/symptom-sorter.html','/type1-food-groups-quiz.html','/type1-parent-quiz.html','/hybrid-closed-loop-quiz.html','/indian-food-quiz.html','/uk-gi-quiz.html','/404.html','/hub.js?v=20261007','/daily-challenges.js?v=20261009-2','/sam-days.js?v=20261006','/language.js?v=20261004-2','/pwa.js?v=20261004-2','/site.webmanifest','/icon-192.png','/icon-512.png','/apple-touch-icon.png','/favicon.svg','/favicon.ico'];
const PATHS=new Set(ASSETS.map(p=>new URL(p,self.location.origin).pathname));
self.addEventListener('install',event=>{event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('diabetes-games-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',event=>{
 const request=event.request,url=new URL(request.url);
 if(request.method!=='GET'||url.origin!==self.location.origin||!PATHS.has(url.pathname))return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);try{const response=await fetch(request);if(response.ok){await cache.put(request,response.clone());}return response;}catch(e){const cached=await cache.match(request,{ignoreSearch:true});if(cached)return cached;if(request.mode==='navigate')return (await cache.match('/'))||Response.error();return Response.error();}})());
});
