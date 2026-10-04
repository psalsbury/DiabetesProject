const assert=require('node:assert/strict');
require('../public_html/sam-days.js');
const S=global.SamDays;
assert.equal(S.days.length,90);
assert.equal(new Set(S.days.map(d=>d.id)).size,90);
const full=new Set();
for(const d of S.days){
 const events=S.build(d); assert.equal(events.length,6);
 assert.equal(new Set(events.map(e=>e.topic)).size,6,d.id);
 assert.deepEqual(events.map(e=>e.time),['07:30','10:30','12:30','14:30','17:00','21:00']);
 for(const e of events){assert.equal(e.o.length,3);assert.equal(e.o.filter(o=>o.r==='best').length,1);assert.ok(e.q&&e.learn&&e.src.startsWith('https://'));for(const o of e.o){assert.ok(Number.isFinite(o.after));assert.ok(o.t&&o.f);}}
 full.add(JSON.stringify(events.map(e=>e.q)));
}
assert.equal(full.size,90);
const seen=new Set();for(let i=0;i<90;i++){const dt=new Date(Date.UTC(2026,9,4+i,12));const x=S.select(dt);seen.add(x.day.id);assert.equal(S.select(new Date(Date.UTC(2026,9,4+i,13))).day.id,x.day.id);}
assert.equal(seen.size,90);assert.equal(S.select(new Date('2027-01-02T12:00:00Z')).day.id,S.days[0].id);
assert.equal(S.dateKey(new Date('2026-10-04T22:59:59Z')),'2026-10-04');assert.equal(S.dateKey(new Date('2026-10-04T23:00:00Z')),'2026-10-05');
assert.equal(S.dateKey(new Date('2026-10-25T00:30:00Z')),'2026-10-25');assert.equal(S.dateKey(new Date('2026-10-25T01:30:00Z')),'2026-10-25');
assert.equal(S.dateKey(new Date('2027-03-28T00:30:00Z')),'2027-03-28');assert.equal(S.dateKey(new Date('2027-03-28T01:30:00Z')),'2027-03-28');
assert.equal(S.select(new Date('2026-10-03T12:00:00Z')).index,89);
console.log('PASS: 90 unique six-moment days, options, chronology, full cycle, UK midnight and DST');
const vm=require('node:vm'),fs=require('node:fs');
class Element{
 constructor(){this.classes=new Set();this.classList={add:(v)=>this.classes.add(v),remove:(v)=>this.classes.delete(v),contains:(v)=>this.classes.has(v)};this.style={};this.children=[];this.textContent='';}
 set innerHTML(v){this.html=v;this.children=[];} get innerHTML(){return this.html||'';}
 set className(v){this.classes=new Set(v.split(' '));}get className(){return [...this.classes].join(' ');}
 appendChild(v){this.children.push(v);}focus(){}
}
const ids=['welcome','game','results','daily-date','daily-title','daily-story','daily-score','game-day','result-day','val','state','graph','fill','counter','points','clock','where','question','options','feedback','next','r-tir','r-pts','r-best','r-title','r-copy','review','next-games'];
const elements=Object.fromEntries(ids.map(id=>[id,new Element()]));elements.welcome.classList.add('active');
const storage=new Map();let selected=S.select(new Date('2026-10-04T12:00:00Z'));
const context={console,Intl,Date,Math,Set,JSON,SamDays:{...S,select:()=>selected},document:{getElementById:id=>elements[id],querySelectorAll:s=>s==='.screen'?[elements.welcome,elements.game,elements.results]:elements.options.children,createElement:()=>new Element(),createTextNode:t=>({textContent:t}),addEventListener(){}},window:{scrollTo(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setInterval(){},Hub:{esc:s=>s,record(){},renderNext(){}}};
vm.createContext(context);
const html=fs.readFileSync(require('node:path').join(__dirname,'../public_html/day-with-sam.html'),'utf8');const script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).join('\n');
vm.runInContext(script,context);
for(const d of S.days){selected={key:'2026-10-04',index:0,day:d};
 for(const mode of ['best','poor']){vm.runInContext('start()',context);
  for(let step=0;step<6;step++){vm.runInContext(`choose(events[i].order.findIndex(o=>o.r==='${mode}'));var previous=pts;choose(0);if(pts!==previous)throw Error('double answer');nextEvent();`,context);}
  assert.equal(elements['r-pts'].textContent,mode==='best'?'12/12':'0/12',d.id);assert.ok(elements.results.classList.contains('active'));
 }
}
assert.equal(JSON.parse(storage.get('dlh-sam-daily-v1')).best,12);
console.log('PASS: 180 complete game-script playthroughs, scoring, daily best, replay and duplicate answer protection');
