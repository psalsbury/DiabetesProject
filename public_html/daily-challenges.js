/* Daily practice: synthetic UK food labels, never insulin dose advice. */
(function(){
'use strict';
const $=id=>document.getElementById(id),key=Hub.today(),day=Math.floor(Date.parse(key+'T12:00:00Z')/86400000),STORE='dlh-carb-daily-v1';
const foods=[['🥣','Breakfast cereal',60,12],['🍞','Bread',40,4],['🍚','Cooked rice',30,1],['🍝','Cooked pasta',25,2],['🥔','Potato dish',20,1],['🥛','Yoghurt',10,8],['🍲','Soup',15,3],['🥘','Lentil dish',20,3],['🫓','Flatbread',50,3],['🫘','Beans',15,4]];
const portions=[40,60,80,100,120,150,200,250,300];
function puzzle(d,n){
 const food=foods[(d+n*3)%foods.length],weight=portions[(Math.floor(d/foods.length)+n*2)%portions.length];
 const correct=food[2]*weight/100,offsets=[5,10,15],shift=(d+n)%4;
 const wrong=offsets.map(x=>correct+x);
 const options=[correct,...wrong];options.push(...options.splice(0,shift));
 return {food,weight,correct,options};
}
window.CarbDetective={puzzle};
let answers=[];try{const s=JSON.parse(localStorage.getItem(STORE)||'null');if(s&&s.key===key&&Array.isArray(s.answers))answers=s.answers.slice(0,3)}catch(e){}
function save(){try{localStorage.setItem(STORE,JSON.stringify({key,answers}))}catch(e){}}
function progress(){
 let sam=null;try{sam=JSON.parse(localStorage.getItem('dlh-sam-daily-v1')||'null')}catch(e){}
 const done=[!!Hub.load().daily[Hub.today()],!!(sam&&sam.key===Hub.today()),answers.length===3&&key===Hub.today()];
 ['myth-status','sam-status','carb-status'].forEach((id,i)=>{$(id).textContent=done[i]?'✓ Completed today':'Ready today'});
 const n=done.filter(Boolean).length;
 $('daily-progress').textContent=n+' of 3 completed today · '+(n===3?'Great work! Return tomorrow to keep learning.':'Finish today’s set, then return tomorrow for three refreshed challenges.');
}
function render(){
 const box=$('carb-game');
 if(answers.length===3){
  const score=answers.filter(Boolean).length;
  box.innerHTML='<div class="done"><b>🔎 Case closed: '+score+'/3</b><p>You’ve finished today’s Carb Detective. Come back tomorrow for new labels and portions!</p><div class="cta"><button class="btn dark" id="carb-share" type="button">Challenge a friend ↗</button><a class="btn light" href="#daily">Today’s other challenges ↑</a></div></div>';
  $('carb-share').onclick=function(){Hub.share('Carb Detective '+key+': '+score+'/3. Can you crack today’s food-label puzzles?',this,'https://salsbury.co.uk/#carb-detective')};progress();return;
 }
 const n=answers.length,p=puzzle(day,n),f=p.food;
 box.innerHTML='<div class="n">Case '+(n+1)+' of 3 · '+key+'</div><div class="st">'+f[0]+' '+f[1]+'</div><table class="label-table"><caption>Fictional label · per 100g</caption><tbody><tr><th scope="row">Carbohydrate</th><td>'+f[2]+'g</td></tr><tr><th scope="row">of which sugars</th><td>'+f[3]+'g</td></tr></tbody></table><p class="st">Your portion weighs '+p.weight+'g. How many grams of carbohydrate are in it?</p><div class="row carb-options">'+p.options.map(v=>'<button type="button" data-carb="'+v+'">'+v+'g</button>').join('')+'</div><div class="ex" role="status"></div><button class="btn dark more" type="button"></button>';
 box.querySelectorAll('[data-carb]').forEach(b=>b.onclick=()=>{
  if(box.dataset.answered==='yes')return;box.dataset.answered='yes';
  const ok=Number(b.dataset.carb)===p.correct;
  box.querySelectorAll('[data-carb]').forEach(x=>{x.disabled=true;if(Number(x.dataset.carb)===p.correct)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
  const ex=box.querySelector('.ex');ex.textContent=(ok?'🎉 Case cracked! ':'A clue for next time: ')+f[2]+' ÷ 100 × '+p.weight+' = '+p.correct+'g carbohydrate. Use total carbohydrate; “of which sugars” is already included, so don’t add it again.';ex.classList.add('show');
  answers.push(ok);save();
  if(answers.length===3){Hub.markDay();if(answers.every(Boolean))Hub.celebrate();progress()}
  const next=box.querySelector('.more');next.textContent=answers.length===3?'See my result →':'Next case →';next.classList.add('show');next.focus({preventScroll:true});next.onclick=()=>{delete box.dataset.answered;render()};
 });
 delete box.dataset.answered;
}
window.addEventListener('daily-progress',progress);
window.addEventListener('pageshow',progress);
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Hub.today()!==key)location.reload()});
render();progress();
})();
