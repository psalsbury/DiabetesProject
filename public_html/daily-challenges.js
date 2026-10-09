/* Daily practice: synthetic UK food labels, never insulin dose advice. */
(function(){
'use strict';
const $=id=>document.getElementById(id),key=Hub.today(),day=Math.floor(Date.parse(key+'T12:00:00Z')/86400000),STORE='dlh-carb-daily-v1';
/* Foods: [emoji, food, carbohydrate g per 100g, of which sugars g per 100g, portion g, portion description, CoFID code].
   Per-100g values are from McCance and Widdowson's Composition of Foods Integrated Dataset (CoFID 2021, PHE),
   converted from monosaccharide equivalents to the weight basis used on UK food labels (starch / 1.10, disaccharides / 1.05).
   Portions are from the British Nutrition Foundation's "Find your balance" portion guide (2019); half a 400g can of beans
   and half a 250g rice pouch are as given there. */
const foods=[["🥣", "Cornflakes (no milk)", 83.1, 7.1, 40, "a bowl, about 3 handfuls", "11-742"],
 ["🥣", "Wheat biscuits, Weetabix-type (no milk)", 66.3, 3.8, 40, "2 biscuits", "11-773"],
 ["🥣", "Swiss-style muesli (no milk)", 67.4, 20.8, 50, "a bowl, about 3 handfuls", "11-780"],
 ["🥣", "Porridge oats, weighed dry", 64.3, 0.3, 45, "about 1½ handfuls of dry oats", "11-788"],
 ["🍞", "Wholemeal bread, medium sliced", 38.4, 2.7, 80, "2 slices", "11-981"],
 ["🍞", "White bread, thick sliced", 42.1, 3.2, 94, "2 slices", "11-980"],
 ["🥯", "Plain bagel", 52.8, 4.7, 85, "1 bagel", "11-970"],
 ["🫓", "Crumpet, toasted", 41.5, 3.0, 50, "1 crumpet", "11-989"],
 ["🫓", "White pitta bread", 50.4, 2.9, 60, "1 pitta", "11-974"],
 ["🌯", "Soft wheat tortilla wrap", 49.1, 1.9, 65, "1 wrap", "11-925"],
 ["🫓", "Chapati made without fat", 39.8, 1.5, 45, "1 small chapati", "11-459"],
 ["🫓", "Plain naan bread", 45.8, 3.1, 70, "half a naan", "11-973"],
 ["🍝", "White pasta, weighed dry", 68.8, 2.0, 75, "2 handfuls of dry pasta", "11-716"],
 ["🍝", "White pasta, boiled", 33.9, 1.1, 180, "enough to fill 2 cupped hands", "11-1129"],
 ["🍚", "White basmati rice, boiled", 24.1, 0.0, 180, "enough to fill 2 cupped hands", "11-858"],
 ["🍚", "Plain microwave rice, heated", 30.8, 0.0, 125, "half a 250g pouch", "11-884"],
 ["🍜", "Medium egg noodles, boiled", 32.5, 0.0, 175, "about 1 nest, cooked", "11-724"],
 ["🥙", "Couscous, cooked", 34.1, 1.0, 150, "enough to fill 2 cupped hands", "11-902"],
 ["🥔", "Baked potato, flesh and skin", 20.7, 1.4, 220, "1 potato about the size of your fist", "13-491"],
 ["🥔", "New potatoes, boiled in their skins", 13.6, 1.1, 175, "about 6 small potatoes", "13-495"],
 ["🥔", "Mashed potato with butter", 14.6, 1.1, 180, "about 4 tablespoons", "13-553"],
 ["🥔", "Roast potatoes in rapeseed oil", 24.1, 1.2, 200, "about 4 small roast potatoes", "13-534"],
 ["🍟", "Oven chips, baked", 32.3, 1.1, 165, "about 2 handfuls", "13-487"],
 ["🫘", "Baked beans in tomato sauce", 13.9, 4.6, 200, "half a 400g can", "13-532"],
 ["🥛", "Low-fat fruit yogurt", 13.1, 12.2, 125, "1 small pot", "12-380"],
 ["🥛", "Low-fat plain yogurt", 7.6, 7.3, 120, "about 4 tablespoons", "12-379"],
 ["🥛", "Soya fruit yogurt alternative", 10.7, 10.4, 125, "1 individual pot", "12-609"],
 ["🍪", "Plain oatcakes", 57.2, 3.0, 24, "2 oatcakes", "11-823"],
 ["🍪", "Cream crackers", 63.4, 1.4, 24, "3 crackers", "11-820"],
 ["🧁", "Fruit scone", 52.1, 18.2, 40, "1 small scone", "11-993"],
 ["🍇", "Grapes", 16.1, 16.1, 80, "a handful, one of your 5 A DAY", "14-350"],
 ["🌽", "Sweetcorn, canned and drained", 13.0, 7.2, 80, "3 heaped serving spoons, one of your 5 A DAY", "13-529"],
 ["🍇", "Raisins", 62.6, 62.6, 30, "1 heaped serving spoon, one of your 5 A DAY", "14-393"]];
const r1=x=>Math.round(x*10)/10,r0=x=>Math.round(x);
function puzzle(d,n){
 const food=foods[((d*3+n)*7)%foods.length],[,,carb,sugars,weight]=food;
 const exact=r1(carb*weight/100),correct=r0(carb*weight/100);
 // Wrong answers are common carb-counting slips, so the feedback can say what went wrong.
 const slips=[[r0(carb),'per100'],[r0(sugars*weight/100),'sugars'],[r0((carb+sugars)*weight/100),'added'],[r0(carb*weight/200),'half'],[r0(carb*weight*1.5/100),'more']];
 const wrong=[],why={};
 const gap=Math.max(3,correct*0.15); // a gram or two either way is fine in real carb counting, so wrong answers must be clearly wrong
 for(const [v,k] of slips){if(wrong.length<3&&v>0&&Math.abs(v-correct)>=gap&&wrong.every(w=>Math.abs(w-v)>=2)){wrong.push(v);why[v]=k}}
 const options=[correct,...wrong],shift=(d+n)%4;options.push(...options.splice(0,shift));
 return {food,weight,exact,correct,options,why};
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
 box.innerHTML='<div class="n">Case '+(n+1)+' of 3 · '+key+'</div><div class="st">'+f[0]+' <b>'+f[1]+'</b></div><table class="label-table"><caption>Typical values per 100g</caption><tbody><tr><th scope="row">Carbohydrate</th><td>'+f[2]+'g</td></tr><tr><th scope="row">of which sugars</th><td>'+f[3]+'g</td></tr></tbody></table><p class="st">Your portion: '+f[5]+', weighing <b>'+p.weight+'g</b>. How many grams of carbohydrate are in it?</p><div class="row carb-options">'+p.options.map(v=>'<button type="button" data-carb="'+v+'">'+v+'g</button>').join('')+'</div><div class="ex" role="status"></div><button class="btn dark more" type="button"></button>';
 box.querySelectorAll('[data-carb]').forEach(b=>b.onclick=()=>{
  if(box.dataset.answered==='yes')return;box.dataset.answered='yes';
  const picked=Number(b.dataset.carb),ok=picked===p.correct;
  box.querySelectorAll('[data-carb]').forEach(x=>{x.disabled=true;if(Number(x.dataset.carb)===p.correct)x.classList.add('right');else if(x===b)x.classList.add('wrong')});
  const slip={per100:'That’s the amount in 100g. Your portion is '+p.weight+'g, so scale it to your portion.',sugars:'That’s only the sugars. Starch counts too, so use the total carbohydrate figure.',added:'That adds the sugars on top. “Of which sugars” is already included in the total carbohydrate.',half:'That’s too low. Check the portion weight again.',more:'That’s too high. Check the portion weight again.'}[p.why[picked]];
  const ex=box.querySelector('.ex');ex.textContent=(ok?'🎉 Case cracked! ':'A clue for next time: '+(slip?slip+' ':''))+f[2]+' × '+p.weight+' ÷ 100 = '+p.exact+'g, so about '+p.correct+'g of carbohydrate.';ex.classList.add('show');
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
