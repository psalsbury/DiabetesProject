const assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const source=fs.readFileSync(require('node:path').join(__dirname,'../public_html/sw.js'),'utf8'),handlers={};const store=new Map();let offline=false,deleted=[],claimed=false;
const cache={addAll:async paths=>{for(const p of paths)store.set(new URL(p,'https://salsbury.co.uk').pathname,new Response('cached:'+p));},put:async(r,s)=>store.set(new URL(r.url).pathname,s),match:async r=>{const p=typeof r==='string'?r:r.url;return store.get(new URL(p,'https://salsbury.co.uk').pathname)?.clone();}};
const caches={open:async()=>cache,keys:async()=>['diabetes-games-old','another-app'],delete:async k=>deleted.push(k)};
const context={self:{location:{origin:'https://salsbury.co.uk'},addEventListener:(n,f)=>handlers[n]=f,skipWaiting:async()=>{},clients:{claim:async()=>{claimed=true}}},caches,URL,Set,Promise,Response,fetch:async r=>{if(offline)throw Error('offline');return new Response('fresh:'+r.url)}};
vm.runInNewContext(source,context);
(async()=>{
 const event={waitUntil:p=>event.promise=p};handlers.install(event);await event.promise;assert.ok(store.has('/sam-days.js'));assert.ok(store.has('/language.js'));assert.ok(store.has('/pwa.js'));
 handlers.activate(event);await event.promise;assert.deepEqual(deleted,['diabetes-games-old']);assert.ok(claimed);
 async function get(path,mode='navigate'){let p;handlers.fetch({request:{url:'https://salsbury.co.uk'+path,method:'GET',mode},respondWith:x=>p=x});return p&&await p;}
 assert.match(await(await get('/day-with-sam.html')).text(),/^fresh:/);offline=true;assert.match(await(await get('/day-with-sam.html')).text(),/^fresh:/);
 assert.match(await(await get('/hub.js?v=99','cors')).text(),/^cached:/);assert.equal(await get('/private-report'),undefined);
 let other;handlers.fetch({request:{url:'https://translate.google.com/translate',method:'GET'},respondWith:x=>other=x});assert.equal(other,undefined);
 console.log('PASS: precache, updates, offline page/script fallback and public-asset scope');
 const m=JSON.parse(fs.readFileSync(require('node:path').join(__dirname,'../public_html/site.webmanifest'),'utf8'));assert.equal(m.display,'standalone');assert.equal(m.scope,'/');assert.deepEqual(m.icons.map(i=>i.sizes),['192x192','512x512']);console.log('PASS: app manifest');
})().catch(e=>{console.error(e);process.exitCode=1});
