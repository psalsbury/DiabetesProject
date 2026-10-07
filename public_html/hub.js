/* Diabetes Learning Hub: shared progress, recommendations and badges.
   Everything is stored in this browser only (localStorage); nothing is sent anywhere. */
(function(){
"use strict";
var KEY='dlh-progress-v1';
var GAMES=[
 {id:'symptom-sorter',url:'symptom-sorter.html',icon:'🚦',title:'Symptom Sorter',blurb:'Low, high or get help? Sort the signs against the clock.',group:'everyone',mins:4},
 {id:'day-with-sam',url:'day-with-sam.html',icon:'📈',title:'A Day with Sam',blurb:'Make the calls for Sam’s day and watch the glucose graph react.',group:'parents',mins:6},
 {id:'uk-gi',url:'uk-gi-quiz.html',icon:'🍞',title:'High or Low GI?',blurb:'Drag bread, rice, pasta and potatoes into the right box.',group:'food',mins:5},
 {id:'type1-food-groups',url:'type1-food-groups-quiz.html',icon:'🥗',title:'Food Groups',blurb:'Carbs, protein, fat and fibre: what do they do to glucose?',group:'parents',mins:5},
 {id:'hcl',url:'hybrid-closed-loop-quiz.html',icon:'🔄',title:'Closed Loop Pumps',blurb:'Meals, exercise and staying safe on a hybrid closed loop.',group:'parents',mins:6},
 {id:'type1-parent',url:'type1-parent-quiz.html',icon:'🧭',title:'Parent Skills',blurb:'Hypos, ketones, sick days and when to get help.',group:'parents',mins:5},
 {id:'asian-food',url:'indian-food-quiz.html',icon:'🥘',title:'Asian Food Choices',blurb:'Pick the better everyday swap: breads, rice, snacks and sweets.',group:'food',mins:4}
];
function today(d){var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(d||new Date()),v={};p.forEach(function(x){v[x.type]=x.value});return v.year+'-'+v.month+'-'+v.day}
function dayDiff(a,b){return Math.round((Date.parse(b+'T12:00:00')-Date.parse(a+'T12:00:00'))/864e5)}
function load(){try{var s=JSON.parse(localStorage.getItem(KEY));if(s&&typeof s==='object')return Object.assign({games:{},daily:{},days:[]},s)}catch(e){}return{games:{},daily:{},days:[]}}
function save(s){try{localStorage.setItem(KEY,JSON.stringify(s))}catch(e){}}
function markDay(s){var t=today();if(s.days.indexOf(t)<0){s.days.push(t);s.days=s.days.slice(-60)}}
function streak(days){if(!days.length)return 0;var set={};days.forEach(function(d){set[d]=1});var d=new Date(),n=0;if(!set[today(d)])d.setDate(d.getDate()-1);while(set[today(d)]){n++;d.setDate(d.getDate()-1)}return n}
function record(id,score,max){var s=load(),g=s.games[id]||{plays:0,best:0,max:max};g.plays++;g.max=max;g.last=Date.now();g.lastScore=score;if(score/max>=(g.best||0)/(g.max||max))g.best=score;s.games[id]=g;markDay(s);save(s);if(max&&score/max>=.8)setTimeout(celebrate,250);return g}
function pct(g){return g&&g.max?g.best/g.max:0}
function recommend(excludeId,n){var s=load();var list=GAMES.filter(function(g){return g.id!==excludeId});
 list.sort(function(a,b){var A=s.games[a.id],B=s.games[b.id];if(!A!==!B)return A?1:-1;if(!A)return 0;var d=pct(A)-pct(B);if(Math.abs(d)>.001)return d;return(A.last||0)-(B.last||0)});
 return list.slice(0,n||2).map(function(g){var p=s.games[g.id];return{game:g,reason:!p?'New to you':pct(p)<.8?'Best '+p.best+'/'+p.max+' · beat it!':'Last played '+ago(p.last)}})}
function ago(t){if(!t)return'';var d=Math.floor((Date.now()-t)/864e5);return d<=0?'today':d===1?'yesterday':d+' days ago'}
function badges(){var s=load(),played=GAMES.filter(function(g){return s.games[g.id]}).length,perfect=GAMES.some(function(g){var p=s.games[g.id];return p&&p.best===p.max}),st=streak(s.days),dailyDone=Object.keys(s.daily).length;
 return[
  {icon:'🌱',name:'First game',desc:'Finish any game',got:played>=1},
  {icon:'🧭',name:'Explorer',desc:'Play 4 different games',got:played>=4},
  {icon:'🏅',name:'Full set',desc:'Play every game',got:played===GAMES.length},
  {icon:'⭐',name:'Full marks',desc:'Get full marks in any game',got:perfect},
  {icon:'🔥',name:'On fire',desc:'Play 3 days in a row',got:st>=3},
  {icon:'📅',name:'Daily hero',desc:'Do 7 daily challenges',got:dailyDone>=7}
 ]}
function esc(t){return String(t).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var cssDone=false;
function css(){if(cssDone)return;cssDone=true;var st=document.createElement('style');st.textContent=
'.dlh-next{margin:26px auto 0;max-width:620px;text-align:left;font-family:Nunito,-apple-system,"Segoe UI",sans-serif;color:#1d2e29}'+
'.dlh-next h3{margin:0 0 10px;font:800 13px/1.2 Nunito,sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#2f7d61}'+
'.dlh-next .dlh-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}'+
'.dlh-next a.dlh-card{display:flex;gap:12px;align-items:flex-start;padding:14px;border:2px solid #dbe6df;border-radius:18px;background:#fff;color:inherit;text-decoration:none;transition:border-color .15s,transform .15s}'+
'.dlh-next a.dlh-card:hover,.dlh-next a.dlh-card:focus-visible{border-color:#2f7d61;transform:translateY(-2px)}'+
'.dlh-next .dlh-ic{flex:none;display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:#dff1e8;font-size:21px}'+
'.dlh-next b{display:block;font:600 18px Fredoka,Nunito,sans-serif;color:#173f35}.dlh-next small{display:block;margin-top:3px;font-size:12px;color:#65766f}'+
'.dlh-next .dlh-why{display:inline-block;margin-top:6px;padding:2px 8px;border-radius:99px;background:#edf6f1;color:#2f7d61;font-size:10px;font-weight:700;letter-spacing:.04em;text-transform:uppercase}'+
'.dlh-next .dlh-foot{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;margin-top:12px;font-size:12px;color:#65766f}'+
'.dlh-next .dlh-foot a{color:#2f7d61;font-weight:700}.dlh-next button.dlh-share{padding:9px 15px;border:2px solid #dbe6df;border-radius:99px;background:#fff;color:#173f35;font:800 13px Nunito,sans-serif;cursor:pointer}'+
'@media(max-width:560px){.dlh-next .dlh-row{grid-template-columns:1fr}}';
document.head.appendChild(st)}
function renderNext(el,currentId,opts){if(!el)return;css();opts=opts||{};var s=load(),played=GAMES.filter(function(g){return s.games[g.id]}).length,recs=recommend(currentId,2),st=streak(s.days);
 var h='<h3>'+(played<GAMES.length?'Play next 👉':'Beat your best 🏆')+'</h3><div class="dlh-row">';
 recs.forEach(function(r){h+='<a class="dlh-card" href="'+r.game.url+'"><span class="dlh-ic" aria-hidden="true">'+r.game.icon+'</span><span><b>'+esc(r.game.title)+'</b><small>'+esc(r.game.blurb)+'</small><span class="dlh-why">'+esc(r.reason)+'</span></span></a>'});
 h+='</div><div class="dlh-foot"><span>'+played+' of '+GAMES.length+' games played'+(st>1?' · 🔥 '+st+' days':'')+' · <a href="/">All games</a></span>';
 if(opts.shareText)h+='<button type="button" class="dlh-share">Share with family ↗</button>';
 h+='</div>';el.className=(el.className?el.className+' ':'')+'dlh-next';el.innerHTML=h;
 var b=el.querySelector('.dlh-share');if(b)b.onclick=function(){share(opts.shareText,b)}}
function share(text,btn,u){var url=u||(location.origin+location.pathname);if(navigator.share){navigator.share({title:document.title,text:text,url:url}).catch(function(){});return}
 var full=text+' '+url;if(navigator.clipboard){navigator.clipboard.writeText(full).then(function(){btn.textContent='Link copied ✓'},function(){prompt('Copy this link:',full)})}else prompt('Copy this link:',full)}
function celebrate(){if(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 var c=document.createElement('canvas'),x=c.getContext('2d'),W=c.width=innerWidth,H=c.height=innerHeight,cols=['#ffd166','#ff8a80','#8cbcff','#8fe3bd','#c3a6ff'],P=[];
 c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:9999';document.body.appendChild(c);
 for(var k=0;k<140;k++)P.push({x:W/2+(Math.random()-.5)*W*.3,y:H*.35,vx:(Math.random()-.5)*14,vy:-Math.random()*14-4,r:Math.random()*6+4,c:cols[k%5],a:Math.random()*6});
 var t0=performance.now();(function f(t){x.clearRect(0,0,W,H);P.forEach(function(p){p.vy+=.35;p.x+=p.vx;p.y+=p.vy;p.vx*=.99;p.a+=.15;x.save();x.translate(p.x,p.y);x.rotate(p.a);x.fillStyle=p.c;x.fillRect(-p.r/2,-p.r/4,p.r,p.r/2);x.restore()});
 if(t-t0<2600)requestAnimationFrame(f);else c.remove()})(t0)}
window.Hub={celebrate:celebrate,GAMES:GAMES,load:load,save:save,record:record,recommend:recommend,renderNext:renderNext,badges:badges,streak:function(){return streak(load().days)},markDay:function(){var s=load();markDay(s);save(s)},today:today,dayDiff:dayDiff,share:share,esc:esc};
})();
