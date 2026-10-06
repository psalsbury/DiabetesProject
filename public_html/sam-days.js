/* A Day with Sam: a new six-moment adventure every day.
 * Each time slot draws from its own pool of scenarios in a shuffled cycle, so a
 * question is not repeated until its slot pool has been used up, and the mix of
 * moments, setting and label numbers changes from day to day.
 * Shared teaching templates keep care advice consistent.
 * Readings are fictional checkpoints, not a physiological prediction model.
 * Calendar dates are always Europe/London, including daylight-saving changes.
 */
(function(root){
'use strict';
const DUK='https://www.diabetes.org.uk/',NHS='https://www.nhs.uk/';
const sources={
 hypo:[DUK+'about-diabetes/looking-after-diabetes/complications/hypos','Diabetes UK: hypos'],
 carbs:[DUK+'living-with-diabetes/eating/carbohydrates-and-diabetes/learn-about-carb-counting','Diabetes UK: carb counting'],
 activity:[DUK+'living-with-diabetes/exercise','Diabetes UK: exercise'],
 sick:[NHS+'conditions/diabetic-ketoacidosis/','NHS: diabetic ketoacidosis'],
 school:[DUK+'living-with-diabetes/life-with-diabetes/children-and-diabetes','Diabetes UK: children and diabetes'],
 severe:[NHS+'conditions/low-blood-sugar-hypoglycaemia/','NHS: low blood sugar'],
 storage:[NHS+'medicines/insulin/','NHS: insulin'],
 sites:[DUK+'about-diabetes/looking-after-diabetes/treatments/insulin','Diabetes UK: insulin'],
 pump:[DUK+'about-diabetes/looking-after-diabetes/technology/insulin-pumps','Diabetes UK: insulin pumps'],
 t1:[NHS+'conditions/type-1-diabetes/','NHS: type 1 diabetes']
};
function event(topic,time,where,reading,trend,q,choices,learn,source,keepTime){
 return {topic,time,where,reading,trend,q,o:choices.map(c=>({t:c[0],r:c[1],after:c[2],f:c[3]})),learn,src:sources[source][0],srcl:sources[source][1],keepTime:!!keepTime};
}
const templates={
 breakfast:c=>event('meal','07:30','Home · breakfast',6.8,'→',`Sam is getting ready for ${c.place}. Breakfast is ${c.breakfast}. Glucose is 6.8 mmol/L. What is the best approach?`,[
 ['Count the carbohydrate in the portion and follow Sam’s agreed mealtime insulin plan','best',8.1,'A reading in range does not replace mealtime insulin. Use the carbohydrate amount and the timing agreed with Sam’s team.'],
 ['Skip the mealtime insulin because glucose is in range','poor',15.4,'Food can raise glucose even when the starting reading is in range. Follow the mealtime plan.'],
 ['Add extra insulin in case Sam eats more later','poor',3.4,'Unplanned extra insulin can cause a hypo. Match the dose to the food using the care plan.']],
 'Follow the mealtime insulin plan even when the starting glucose is in range.','carbs'),
 packing:c=>event('preparation','08:00','Home · getting ready',6.5,'→',`Before leaving for ${c.place}, Sam checks the diabetes bag. What needs to go?`,[
 ['Insulin and delivery supplies, glucose meter, hypo treatment, ketone kit and the care plan, with a responsible adult aware','best',6.6,'A backup meter and treatment supplies matter even when the CGM is working. Check supplies and agree who can help.'],
 ['Only the CGM phone: it shows all the numbers','poor',6.6,'The phone cannot treat a hypo or deliver insulin. A CGM also needs a backup glucose meter.'],
 ['Leave the bag at home to travel light','poor',6.6,'Diabetes supplies need to be accessible during an outing, including when plans change.']],
 'Take treatment and backup supplies, and make sure an adult knows the care plan.','school'),
 low:c=>event('hypo','10:30',c.place+' · a pause',3.5,'↘',`While ${c.action}, Sam feels shaky. Glucose is 3.5 mmol/L. Sam is awake and can swallow safely. What comes first?`,[
 ['Stop, give the agreed amount of fast-acting carbohydrate, stay with Sam and recheck in 10–15 minutes','best',5.2,'Treat a hypo promptly using Sam’s agreed amount. Rest and recheck; repeat treatment if still below 4.'],
 ['Wait for lunch because it is coming soon','poor',2.8,'Waiting can allow a low to become severe. Treat now.'],
 ['Give chocolate as the first treatment','poor',3.6,'Fat slows sugar absorption. Use the fast-acting treatment in Sam’s plan rather than chocolate.']],
 'Treat a hypo promptly with the agreed fast-acting carbohydrate and recheck.','hypo'),
 sensor:c=>event('sensor','10:00',c.place+' · checking the sensor',7.0,'→',`While ${c.action}, Sam feels shaky, but the CGM says 7.0 mmol/L. What should the adult do?`,[
 ['Check with a finger-prick meter straight away and follow the result and Sam’s care plan; do not ignore symptoms','best',5.7,'CGM readings can lag behind blood glucose. When symptoms and the sensor disagree, use the backup meter and act on the care plan.'],
 ['Ignore Sam’s symptoms because the sensor says 7.0','poor',3.5,'A sensor reading does not rule out a low when symptoms disagree. Check promptly.'],
 ['Give insulin because the sensor must be wrong in the other direction','poor',2.9,'Insulin lowers glucose. Check with the meter instead of guessing.']],
 'Use a finger-prick check when symptoms do not match the sensor.','hypo'),
 recovered:c=>event('recheck','10:45',c.place+' · recovering',3.8,'→',`Earlier, Sam was treated for a hypo during ${c.action}. At this new checkpoint, the repeat test is still 3.8 mmol/L. What next?`,[
 ['Repeat the agreed fast-acting treatment, rest and recheck again; follow Sam’s plan for a snack afterwards','best',5.9,'Below 4 is still a hypo. Continue treatment and monitoring until recovered, using Sam’s agreed plan.'],
 ['Carry on because 3.8 is nearly 4','poor',3.1,'Nearly 4 is still below the treatment threshold. Sam needs more treatment and a recheck.'],
 ['Give insulin to balance the sugar from the treatment','poor',2.5,'Do not give insulin to treat a hypo. It lowers glucose further.']],
 'A repeat reading below 4 needs repeat hypo treatment and another check.','hypo'),
 lunch:c=>event('estimate','12:30',c.place+' · lunch',6.4,'→',`Lunch is ${c.lunch}. There is no obvious carbohydrate total for Sam’s portion. How do you decide?`,[
 ['Use portion sizes, packaging, menu information or a carb-counting resource and follow the insulin plan','best',8.6,'Use the best available information for a sensible estimate. Ask an adult for help and check later as the plan advises.'],
 ['Skip insulin because the exact carbohydrate is unknown','poor',16.2,'Unknown carbs do not mean there are no carbs. Seek help with estimating and follow the plan.'],
 ['Guess a very large carbohydrate amount to be safe','poor',3.3,'Overestimating can give too much insulin and cause a low. Use a sensible portion-based estimate.']],
 'Use reliable food information and portion sizes rather than skipping insulin or guessing high.','carbs'),
 label:c=>event('label','12:15',c.place+' · packed lunch',6.9,'→',`Sam has a snack with ${c.labelCarbs} g carbohydrate per 100 g. The portion weighs ${c.portion} g. Which amount is used for carb counting?`,[
 [`${Math.round(c.labelCarbs*c.portion/100)} g carbohydrate for the portion, then follow Sam’s plan`,'best',8.0,'Multiply carbohydrate per 100 g by portion weight divided by 100. Use total carbohydrate, not only the “of which sugars” line.'],
 [`${c.labelCarbs} g, regardless of the portion size`,'poor',3.4,'The label value is for 100 g. A smaller portion contains less carbohydrate.'],
 ['Zero if the packet says “no added sugar”','poor',14.1,'No added sugar does not mean no carbohydrate. Read the total carbohydrate line.']],
 'Calculate carbohydrate for the actual portion using total carbohydrate on the label.','carbs'),
 activity:c=>event('exercise','14:00',c.place+' · active afternoon',7.2,'→',`Sam is about to start ${c.activity}. Glucose is 7.2 mmol/L and steady. How do you prepare?`,[
 ['Use Sam’s exercise plan, check as advised and keep hypo treatment with the supervising adult nearby','best',6.3,'Activity can change glucose during and afterwards. Use the agreed plan for food, insulin or pump settings and have treatment close by.'],
 ['Leave the hypo kit in the car because glucose is fine','poor',3.1,'A safe starting reading does not remove the need for treatment nearby.'],
 ['Automatically stop Sam from joining in','ok',7.0,'With planning and support, children with Type 1 can take part. Unnecessary exclusion is not the best solution.']],
 'Plan for activity and keep hypo treatment accessible.','activity'),
 exerciseLow:c=>event('exercise-hypo','14:30',c.place+' · taking a break',3.4,'↘',`During ${c.activity}, Sam’s glucose is 3.4 mmol/L. Sam can swallow safely and wants to finish first. What do you do?`,[
 ['Stop the activity, treat the hypo using Sam’s plan and recheck before considering a return','best',5.6,'Do not push through a hypo. Recover first; the plan and a supervising adult guide a safe return to activity.'],
 ['Finish first: there are only a few minutes left','poor',2.6,'Activity can lower glucose further. A hypo needs immediate treatment.'],
 ['Give extra insulin before the next turn','poor',2.3,'Insulin lowers glucose and does not treat a hypo.']],
 'Stop activity and treat a hypo immediately.','hypo'),
 high:c=>event('high','16:30','Home · back from '+c.place,15.1,'↗',`After ${c.action}, Sam is thirsty and glucose is 15.1 mmol/L. What is the sensible first response?`,[
 ['Check glucose and ketones as directed, use the agreed correction plan, offer water and recheck; get advice if it is not improving','best',9.2,'Check for ketones and follow the plan. High glucose that does not respond to insulin needs advice even with normal ketones.'],
 ['Give a sugary drink because Sam seems grumpy','poor',18.3,'Check the reading rather than guessing from mood. A sugary drink is not the usual response to high glucose.'],
 ['Ignore it until tomorrow','poor',17.2,'High readings need monitoring and action according to the plan, including ketone checks when advised.']],
 'Follow the high-glucose and ketone plan; seek advice if insulin is not bringing glucose down.','sick'),
 correction:c=>event('insulin-on-board','15:30',c.place+' · checking again',12.5,'→',`Sam had a correction dose 20 minutes ago. Glucose is still 12.5 mmol/L. Sam feels well and ketones are normal. What now?`,[
 ['Check the recent dose and insulin still working, then follow the plan for when to recheck or seek advice','best',9.5,'Rapid-acting insulin continues working for hours. Avoid extra unscheduled doses; the agreed plan sets safe timing.'],
 ['Give the same correction again immediately without checking the plan','poor',3.0,'Repeated corrections can stack insulin and cause a later hypo.'],
 ['Stop all insulin for the rest of the day','poor',18.0,'A high reading is not a reason to stop essential insulin. Follow the plan and ask for advice if needed.']],
 'Check insulin still working before any further correction; follow the agreed timing.','school'),
 treat:c=>event('inclusion','18:00','Home · an evening treat',7.6,'→',`After ${c.place}, Sam wants ${c.treat}. How can you include it sensibly?`,[
 ['Count the carbohydrate for the portion and use the agreed insulin plan as part of a balanced diet','best',9.4,'Occasional treats can fit with carb counting and the care plan. Include Sam in decisions rather than making diabetes a punishment.'],
 ['Ban all treats because Sam has Type 1','ok',7.3,'A blanket ban is not necessary. Support a balanced diet and use the agreed plan.'],
 ['Do not count it because it is a special occasion','poor',17.6,'A special occasion does not remove the carbohydrate. Count the portion and follow the plan.']],
 'Include occasional treats with carb counting and the agreed insulin plan.','carbs'),
 bedtime:c=>event('overnight','21:00','Home · bedtime',5.4,'↘',`After ${c.activity}, Sam is 5.4 mmol/L and drifting down at bedtime. What is wise?`,[
 ['Use Sam’s after-activity overnight plan and agreed monitoring, with low alarms and a responsible adult ready','best',6.2,'Exercise can affect glucose for hours. Use the agreed bedtime plan rather than relying on one reading in range.'],
 ['Ignore the downward trend because 5.4 is in range','poor',3.1,'A falling trend after activity can matter overnight. Follow the care plan.'],
 ['Give an extra correction dose to lower glucose','poor',2.6,'Extra insulin when already drifting down can cause a night-time hypo.']],
 'Use the after-exercise overnight plan and agreed monitoring.','activity'),
 review:c=>event('patterns','20:30','Home · talking about the day',7.4,'→',`Sam says, “I got a high reading at ${c.place}. I’m bad at diabetes.” What is the best response?`,[
 ['Reassure Sam that readings are information, review patterns together and ask the diabetes team about repeated problems','best',7.4,'Glucose is affected by many things. Support and pattern review help; blame does not. Do not change doses without the agreed plan.'],
 ['Punish Sam for a high reading','poor',7.4,'Glucose numbers are not a mark of character. Shame can make it harder to ask for help.'],
 ['Tell Sam never to check readings again','poor',7.4,'Monitoring supports safe care. Keep it supportive and use the care team for persistent concerns.']],
 'Treat readings as information and support Sam; review recurring patterns with the team.','school'),
 illness:c=>event('sick-day','20:00','Home · feeling unwell',14.2,'↗',`After returning from ${c.place}, Sam has vomited twice. Glucose is 14.2 mmol/L and blood ketones are 1.8 mmol/L. What now?`,[
 ['Follow the sick-day insulin plan and contact the diabetes team or NHS 111 now; call 999 if Sam becomes drowsy or breathes deeply','best',10.4,'Raised ketones with vomiting need urgent advice. Keep essential insulin going using the sick-day plan. This fictional later reading does not mean the danger has passed.'],
 ['Stop insulin because Sam is not eating','poor',21.0,'The body still needs insulin during illness. Stopping it can lead to DKA.'],
 ['Wait until morning before asking for help','poor',19.5,'Vomiting and raised ketones need action now. If Sam deteriorates, use emergency help.']],
 'Never stop essential insulin when ill; vomiting with raised ketones needs urgent advice.','sick'),
 equipment:c=>event('equipment','08:15','Home · before leaving',6.7,'→',`Sam’s CGM receiver will not turn on before ${c.place}. How do you keep the day safe?`,[
 ['Use the backup glucose meter and agreed checking plan while an adult sorts the receiver; take treatment supplies','best',6.8,'A working backup meter means you can still monitor glucose. Follow the care plan and ask the team if you cannot monitor safely.'],
 ['Guess glucose from how Sam looks all day','poor',3.7,'Symptoms alone cannot replace monitoring. Use the backup meter.'],
 ['Skip all insulin until the receiver is fixed','poor',17.0,'A CGM problem is not a reason to stop insulin. Use the backup plan.']],
 'Use the backup meter and care plan when the CGM is unavailable.','school'),
 delayed:c=>event('delayed-meal','12:00',c.place+' · lunch is delayed',5.0,'↘',`Sam has already had mealtime insulin, but ${c.lunch} is delayed. Glucose is 5.0 mmol/L and falling. What should the adult do?`,[
 ['Follow Sam’s plan for a delayed meal, arrange suitable carbohydrate promptly and monitor; treat a hypo if it occurs','best',6.1,'Insulin may be working before the food arrives. Act using the plan and get adult help with food and monitoring.'],
 ['Wait indefinitely without checking again','poor',3.0,'A delayed meal with insulin working can cause a low. Use the plan promptly.'],
 ['Give more insulin because lunch will be bigger later','poor',2.7,'More insulin before delayed food increases the risk of a hypo.']],
 'Use the delayed-meal plan when insulin has been given before food is available.','hypo'),
 handover:c=>event('handover','17:00','Home · a new adult takes over',7.1,'→',`A relative will look after Sam this evening after ${c.place}. What should the handover include?`,[
 ['Recent insulin, food and activity, readings and trends, where supplies are, the written plan and emergency contacts','best',7.1,'A clear handover helps avoid missed or duplicate doses and makes it easier to respond to a low or illness.'],
 ['Just say Sam is fine and leave','poor',7.1,'One reassuring reading does not tell the adult about recent insulin or how to respond to a problem.'],
 ['Ask Sam to manage everything alone without adult support','poor',7.1,'Sam is nine. An informed responsible adult should support the care plan.']],
 'Share recent treatment, the care plan, supplies and emergency contacts when an adult takes over.','school'),
 wakeHigh:c=>event('morning-high','07:30','Home · waking up',13.9,'→',`Sam wakes up at 13.9 mmol/L before a day at ${c.place}. Bedtime was in range and Sam feels fine. What comes first?`,[
 ['Check ketones if the plan says so at this level, look for a cause such as a pump set problem, then use the agreed correction and breakfast plan','best',8.9,'A high morning reading needs a calm check. Ketones and a quick look at the insulin supply come before any decision about extra insulin.'],
 ['Skip breakfast insulin so Sam doesn’t go low later','poor',17.4,'Missing mealtime insulin when already high will push glucose higher still.'],
 ['Give a large extra dose to bring it down fast','poor',3.2,'Big unplanned doses can cause a hypo later in the morning. Use the agreed correction amount.']],
 'Check ketones and look for a cause before correcting a high morning reading using the plan.','sick'),
 siteRotation:c=>event('site-rotation','07:30','Home · changing the pump set',7.4,'→',`It’s time to change Sam’s pump cannula before ${c.place}. Sam always wants the same spot on the tummy, and the skin there now feels lumpy. What is best?`,[
 ['Choose a fresh site away from the lumpy area, keep rotating sites and mention the lumps to the diabetes team','best',7.1,'Using the same spot repeatedly can cause lumpy tissue where insulin is absorbed unpredictably. Rotating sites helps insulin work as expected.'],
 ['Use the lumpy spot because it hurts less','poor',14.6,'Insulin given into lumpy areas can be absorbed erratically, leading to unexplained highs and lows.'],
 ['Put the new cannula right next to the old hole','poor',13.2,'Sites need spacing and rotation. Ask the team to show you a rotation pattern.']],
 'Rotate cannula and injection sites; lumpy areas absorb insulin unpredictably.','sites'),
 newSensor:c=>event('sensor-warmup','07:30','Home · a new sensor',6.3,'→',`Sam put in a new CGM sensor this morning and it is still warming up. Breakfast is ${c.breakfast}. How do you check glucose?`,[
 ['Use finger-prick checks with the meter, as the plan advises, until the sensor starts giving readings','best',8.0,'A backup meter covers the warm-up gap so mealtime decisions and hypo checks can carry on safely.'],
 ['Guess from yesterday’s readings','poor',3.6,'Today’s glucose can be very different from yesterday’s. Check with the meter.'],
 ['Skip breakfast insulin until the sensor works','poor',15.8,'A sensor warm-up is not a reason to miss insulin. Use the meter and follow the plan.']],
 'Use the backup meter while a new sensor warms up.','school'),
 breakfastClub:c=>event('extra-food','07:30','Breakfast club',7.8,'→',`Sam had insulin at home for ${c.breakfast}. At breakfast club before ${c.place}, Sam is offered an extra slice of toast. What should happen?`,[
 ['Sam can have it: count the extra carbohydrate and follow the plan for extra food, with a trained adult helping','best',8.6,'Extra food after a dose just needs counting. Children with Type 1 should be able to eat with their friends.'],
 ['Eat it with no extra insulin: it’s only toast','poor',14.9,'Toast is mostly carbohydrate and will raise glucose if it isn’t covered.'],
 ['Say no because Sam has diabetes','ok',7.8,'Not dangerous, but Sam doesn’t need to miss out. Counting and the plan let Sam join in.']],
 'Extra food after a dose needs counting and the plan for additional carbohydrate.','carbs'),
 classTest:c=>event('hypo-focus','10:30',c.place+' · a timed challenge',3.7,'↘',`At ${c.place}, Sam is about to start a timed quiz challenge. Glucose is 3.7 mmol/L and falling. What do you do?`,[
 ['Treat the hypo now, recheck, and only start once Sam has recovered; the organisers can wait or allow extra time','best',5.5,'A hypo affects concentration as well as safety. Recovery first; schools can agree extra time in an individual healthcare plan.'],
 ['Do the challenge first and treat afterwards','poor',2.9,'A falling low can get worse quickly. Treat it straight away.'],
 ['Eat a chocolate bar and start immediately','poor',3.8,'Chocolate is slow because of its fat, and Sam still needs to recheck before carrying on.']],
 'Treat a hypo before tests or challenges; recovery comes first.','hypo'),
 fastFall:c=>event('trend-arrows','10:30',c.place+' · watching the arrows',6.2,'⇊',`While ${c.action}, Sam’s CGM shows 6.2 mmol/L with two arrows pointing straight down. Sam feels fine. What is wise?`,[
 ['Follow the plan for a fast-falling trend: check, consider carbohydrate as advised and recheck soon','best',5.8,'Trend arrows show where glucose is heading. Acting early can stop a fast fall becoming a hypo.'],
 ['Ignore it: 6.2 is in range','poor',3.2,'A number in range can still be dropping fast. The arrows matter.'],
 ['Give insulin to steady things','poor',2.7,'Insulin lowers glucose further. It is the wrong direction for a fast fall.']],
 'Act on fast-falling trend arrows using the plan, before a hypo starts.','hypo'),
 occlusion:c=>event('pump-alarm','10:30',c.place+' · a pump alarm',11.8,'↗',`While ${c.action}, Sam’s pump shows an occlusion (blocked) alarm. Glucose is 11.8 mmol/L and rising. What now?`,[
 ['Follow the pump troubleshooting plan: change the set or use the backup pen as advised, check ketones and recheck','best',9.1,'A blocked pump means insulin isn’t getting in. Glucose and ketones can rise quickly without it, so act now.'],
 ['Silence the alarm and carry on','poor',17.8,'The alarm is telling you insulin delivery has stopped. Ignoring it risks high glucose and ketones.'],
 ['Wait until home time to look at it','poor',16.9,'Without insulin delivery, waiting several hours is unsafe. Use the backup plan.']],
 'A pump alarm can mean no insulin is going in: troubleshoot now and check ketones.','pump'),
 silentLow:c=>event('silent-hypo','10:30',c.place+' · a CGM alarm',3.6,'↘',`While ${c.action}, Sam’s CGM alarms at 3.6 mmol/L, but Sam says, “I feel fine!” What should the adult do?`,[
 ['Confirm with the meter if the plan says so, and treat a reading below 4 even without symptoms','best',5.3,'Some children don’t always feel lows. Below 4 is a hypo whether or not Sam notices it.'],
 ['No symptoms means no hypo, so carry on','poor',3.0,'Symptoms aren’t a reliable guide. Treat the number.'],
 ['Wait 30 minutes to see if it comes up','poor',2.9,'Waiting lets a low get lower. Treat promptly and recheck.']],
 'Treat a reading below 4 even when Sam feels fine.','hypo'),
 friendsAsk:c=>event('talking','10:30',c.place+' · chatting with friends',7.0,'→',`At ${c.place}, a new friend asks Sam, “Did you get diabetes from eating too many sweets? Can I catch it?” How can Sam answer?`,[
 ['Explain simply: Type 1 isn’t caused by sweets and you can’t catch it; Sam’s body just stopped making insulin','best',7.0,'Type 1 is an autoimmune condition. It isn’t caused by diet or lifestyle and isn’t contagious. Simple, confident answers help.'],
 ['Agree it was the sweets so the questions stop','poor',7.0,'This spreads a myth and can make Sam feel to blame. It isn’t true.'],
 ['Tell Sam to keep diabetes a secret','poor',7.0,'Friends who understand a little can help Sam feel included and fetch an adult if needed.']],
 'Type 1 isn’t caused by sweets or lifestyle, and it isn’t catching.','t1'),
 pizza:c=>event('fat-protein','12:30',c.place+' · pizza lunch',6.6,'→',`Lunch at ${c.place} is pizza and chips. After pizza before, Sam was fine at first but went high later in the afternoon. What is the best approach?`,[
 ['Count the carbohydrate, follow the plan, and ask the diabetes team whether a split or extended dose suits higher-fat meals','best',8.9,'Fat and protein slow digestion, so glucose can rise hours later. The team can suggest a dosing approach for meals like this.'],
 ['Give double the usual dose up front','poor',3.0,'Too much insulin early can cause a hypo before the food is absorbed.'],
 ['Ban pizza from now on','ok',7.0,'Not needed. With planning, pizza can fit into Sam’s diet.']],
 'High-fat meals can raise glucose later; ask the team about dosing for them.','carbs'),
 forgotBolus:c=>event('missed-dose','12:30',c.place+' · after lunch',11.4,'↗',`Thirty minutes after ${c.lunch}, you realise Sam’s mealtime insulin wasn’t given. Glucose is 11.4 mmol/L and rising. What now?`,[
 ['Follow the plan for a missed mealtime dose, which usually says how to give a late dose, then recheck','best',8.8,'Missed doses happen. A plan agreed in advance tells you what to give now so you don’t have to guess.'],
 ['Leave it: it’s too late now','poor',17.4,'Without insulin, glucose will keep rising through the afternoon.'],
 ['Give the full dose plus a big correction without checking the plan','poor',3.1,'Adding up doses without the plan can overshoot into a hypo.']],
 'Have a plan for missed mealtime doses: don’t ignore them and don’t double up.','carbs'),
 fruit:c=>event('fruit','12:30',c.place+' · lunch and fruit',6.7,'→',`Alongside ${c.lunch}, Sam has an apple and a banana. Someone says fruit doesn’t need counting because it is “natural sugar”. What is right?`,[
 ['Fruit contains carbohydrate, so count it with the rest of the meal and follow the plan','best',8.2,'Natural sugars still raise glucose. Fruit is part of a healthy diet, and it needs counting like any other carbohydrate.'],
 ['Don’t count fruit','poor',13.6,'A banana can contain a fair amount of carbohydrate. Leaving it out can lead to a high.'],
 ['Avoid fruit altogether','ok',6.7,'Fruit is good for Sam. Count it rather than cutting it out.']],
 'Fruit contains carbohydrate and needs counting.','carbs'),
 drinks:c=>event('drinks','12:30',c.place+' · choosing a drink',6.9,'→',`With ${c.lunch}, Sam can choose regular cola, diet cola or water. Glucose is 6.9 mmol/L. Which is the easiest choice?`,[
 ['Water or the diet drink, which have no carbohydrate to count; regular sugary drinks are best kept for treating hypos','best',7.6,'Sugary drinks raise glucose very fast. Diet drinks don’t, which is also why they must never be used to treat a hypo.'],
 ['Regular cola with no extra insulin','poor',15.2,'A regular fizzy drink contains a lot of fast sugar and will push glucose up.'],
 ['Regular cola, counted and covered with insulin','ok',9.4,'Possible, but sugary drinks act faster than insulin. Water or diet drinks are usually easier.']],
 'Water or sugar-free drinks are the easy everyday choice; sugary drinks are for hypos.','carbs'),
 ateLess:c=>event('uneaten-meal','12:30',c.place+' · a half-eaten lunch',6.1,'↘',`Sam had insulin for all of ${c.lunch} but only eats half. Glucose is 6.1 mmol/L and drifting down. What should the adult do?`,[
 ['Follow the plan for a meal not finished, which may mean offering other carbohydrate, and keep monitoring for a low','best',6.4,'Insulin was given for food that wasn’t eaten. The plan says how to make up the carbohydrate. Ask the team whether dosing after meals would suit Sam.'],
 ['Do nothing and don’t check again','poor',3.3,'Unused insulin can cause a hypo later. Keep an eye on it.'],
 ['Give more insulin to stop a high later','poor',2.5,'There is already more insulin than food. More would make a low likely.']],
 'If a meal isn’t finished after insulin, use the plan to replace the carbohydrate and monitor.','hypo'),
 adrenaline:c=>event('adrenaline','14:30',c.place+' · nerves and excitement',12.6,'↗',`Just before ${c.activity}, Sam is nervous and excited. Glucose has jumped to 12.6 mmol/L. What is sensible?`,[
 ['Remember adrenaline can raise glucose for a while; follow the plan, check ketones if advised and avoid a big correction right before exercise','best',8.7,'Excitement and stress hormones can push glucose up briefly. A large correction plus exercise can then cause a hypo.'],
 ['Give a full correction dose right before starting','poor',3.1,'Insulin plus exercise together can drop glucose fast.'],
 ['Cancel the activity','ok',11.4,'Not usually necessary. Use the plan and let Sam join in if it says so.']],
 'Adrenaline can raise glucose; big corrections just before exercise risk a hypo.','activity'),
 hotAfternoon:c=>event('heat','14:30',c.place+' · a hot afternoon',5.6,'↘',`It’s a hot afternoon at ${c.place}. Sam’s glucose is 5.6 mmol/L and drifting down. Where should spare insulin and supplies be?`,[
 ['Keep insulin cool and out of the sun, keep hypo treatment close, give Sam water and check more often','best',6.1,'Heat can make insulin absorb faster and can damage stored insulin. Extra checks and a cool bag help on hot days.'],
 ['Leave everything in the car to keep it handy','poor',3.2,'A hot car can damage insulin, and treatment left in the car isn’t close when Sam needs it.'],
 ['Put the insulin straight on an ice pack','poor',14.0,'Frozen insulin must be thrown away. Keep it cool, not frozen.']],
 'On hot days keep insulin cool but not frozen, keep treatment close and check more often.','storage'),
 pumpOff:c=>event('pump-off','14:30',c.place+' · pump off',7.5,'→',`Sam’s pump needs to come off for ${c.activity}. How do you handle it?`,[
 ['Follow the team’s advice on how long it can be off, keep it safe, reconnect on time and check glucose and ketones as advised','best',7.9,'While the pump is off, no insulin is going in. Planned breaks are fine when you know the limits.'],
 ['Leave it off for the rest of the day','poor',17.9,'Without background insulin, glucose and ketones rise. Reconnect as planned.'],
 ['Give a big extra dose before taking it off to make up','poor',2.8,'Extra insulin before activity can cause a hypo.']],
 'When a pump comes off, reconnect on time and check glucose and ketones.','pump'),
 coach:c=>event('briefing','14:30',c.place+' · meeting the leader',7.2,'→',`The adult running ${c.activity} hasn’t looked after a child with Type 1 before. What should they know first?`,[
 ['How to spot and treat a hypo, where supplies are, who to call and the key points of Sam’s plan','best',7.2,'A quick, clear briefing lets the leader keep Sam safe and included.'],
 ['Nothing: Sam can manage alone','poor',3.4,'Sam is nine. A hypo can make it hard to self-treat, so an adult needs to know what to do.'],
 ['Keep Sam out of the activity to avoid any hassle','ok',7.2,'Safe but unfair. With a briefing, Sam can take part.']],
 'Brief new adults on hypos, supplies, contacts and the plan.','school'),
 ketones:c=>event('ketones','17:00','Home · a tummy ache',13.4,'↗',`After ${c.place}, Sam has a tummy ache. Glucose is 13.4 mmol/L and blood ketones are 0.9 mmol/L. What should you do?`,[
 ['Follow the ketone plan: extra insulin as directed, sugar-free fluids, recheck glucose and ketones when it says, and call the team if they rise','best',9.8,'Raised ketones mean the body needs more insulin. Close rechecks show whether the plan is working.'],
 ['Wait and see until tomorrow','poor',16.8,'Ketones can rise quickly. Act on them now.'],
 ['Stop insulin because Sam feels sick','poor',19.2,'Insulin is what clears ketones. Stopping it risks DKA.']],
 'Raised ketones need the plan’s actions and close rechecks; never stop insulin.','sick'),
 siteOut:c=>event('cannula-out','17:00','Home · back from '+c.place,15.8,'↗',`Back from ${c.place}, you find Sam’s pump cannula has come out. Glucose is 15.8 mmol/L and rising. What now?`,[
 ['Put in a new set or use the backup pen as advised, check ketones and recheck in the time the plan sets','best',10.2,'A dislodged cannula means no insulin has been going in. Restore insulin first and check ketones.'],
 ['Tape the old cannula back on','poor',17.5,'A cannula that has come out can’t deliver insulin. Use a new set.'],
 ['Wait for dinner to give the next dose','poor',18.3,'Missing insulin for hours can lead to ketones. Act now.']],
 'If a cannula comes out, restore insulin straight away and check ketones.','pump'),
 sleepover:c=>event('sleepover','17:00','Home · an invitation',7.1,'→',`At ${c.place}, Sam is invited to a sleepover next weekend. How can you make it work?`,[
 ['Plan with the host: share the plan and supplies, agree who responds to overnight alarms and leave contact numbers','best',7.1,'With planning, sleepovers are possible. Some families use remote CGM following so a parent can still see alarms.'],
 ['Send Sam with no information','poor',7.1,'The host needs to know how to respond to a hypo or a pump alarm.'],
 ['Say no to all sleepovers','ok',7.1,'Safe, but Sam misses out. Many children with Type 1 enjoy sleepovers with a plan.']],
 'Sleepovers work with a shared plan, supplies and an agreed overnight response.','school'),
 restaurant:c=>event('eating-out','17:00','A café after '+c.place,6.8,'→',`Dinner out after ${c.place}: Sam chooses a burger and chips. There is no carbohydrate total on the menu. How do you decide?`,[
 ['Use the restaurant’s nutrition information, a carb-counting app or similar portions, follow the plan and check later','best',8.8,'Many chains publish nutrition information online. A sensible estimate plus a later check works well.'],
 ['Skip insulin because you can’t be sure','poor',16.0,'Uncertainty isn’t a reason to give nothing. Make your best estimate.'],
 ['Order Sam nothing','ok',6.8,'Sam can eat out. A good estimate is usually enough.']],
 'When eating out, estimate from nutrition information or portions and check later.','carbs'),
 nightAlarm:c=>event('night-hypo','02:00','Home · a night alarm',3.3,'↘',`At 2am, Sam’s CGM alarm goes off: 3.3 mmol/L. Sam is asleep. What do you do?`,[
 ['Wake Sam, give the agreed fast-acting treatment, recheck in 10–15 minutes and stay until recovered','best',5.4,'A hypo at night still needs treatment and a recheck. Make sure Sam is properly awake and able to swallow before giving anything.'],
 ['Silence the alarm: it’s probably the sensor','poor',2.7,'Don’t assume a low is false. Check and treat.'],
 ['Give a glass of milk and go back to bed','poor',3.6,'Milk is too slow to treat a hypo, and you need to recheck.']],
 'Night-time hypos need prompt treatment and a recheck.','hypo',true),
 compression:c=>event('compression-low','01:00','Home · a puzzling night reading',3.1,'↘',`At 1am, the CGM says 3.1 mmol/L. Sam is lying on the arm with the sensor. What is the best response?`,[
 ['Check with a finger-prick: treat as a hypo if it is below 4; if it is in range, it may be a compression low','best',6.0,'Pressure on a sensor can give falsely low readings. A meter check tells you whether Sam needs treatment.'],
 ['Assume it’s compression and ignore it','poor',2.9,'It might be a real hypo. Check before deciding.'],
 ['Give insulin in case the sensor is wrong the other way','poor',2.4,'Never give insulin to “test” a reading.']],
 'Confirm an unexpected night low with a meter, and treat if it is real.','hypo',true),
 severe:c=>event('severe-hypo','03:00','Home · an emergency',2.4,'↓',`At 3am Sam’s alarm reads 2.4 mmol/L. Sam is very drowsy, isn’t responding normally and can’t swallow safely. What do you do?`,[
 ['Give nothing by mouth, put Sam in the recovery position, give glucagon if prescribed and you know how, and call 999','best',4.9,'A severe hypo is an emergency. Food or drink can choke someone who can’t swallow. This fictional later reading doesn’t mean the danger has passed.'],
 ['Pour a sugary drink into Sam’s mouth','poor',2.2,'Someone who can’t swallow safely could choke. Use glucagon and call 999.'],
 ['Let Sam sleep it off','poor',1.9,'A severe hypo needs emergency treatment now.']],
 'Severe hypo: nothing by mouth, recovery position, glucagon if trained, call 999.','severe',true),
 stomachBug:c=>event('sick-day','21:00','Home · a stomach bug',6.2,'→',`Sam has picked up a stomach bug and isn’t eating much at dinner. Glucose is 6.2 mmol/L. Someone suggests stopping insulin. What is right?`,[
 ['Never stop background insulin; follow the sick-day plan, offer sips of fluid (sugary if not eating, as advised), check glucose and ketones often and call the team','best',6.8,'Illness can raise ketones even when glucose isn’t high. Sick-day rules keep insulin going and catch problems early.'],
 ['Stop all insulin until Sam is eating','poor',18.4,'Without insulin, ketones build up and DKA can develop.'],
 ['Check again in the morning','poor',13.9,'Illness needs frequent checks, including overnight if the plan says.']],
 'Sick-day rules: keep background insulin going and check glucose and ketones often.','sick'),
 clinicPrep:c=>event('clinic','21:00','Home · planning for clinic',7.4,'→',`Sam has been going high most evenings this week. Clinic is next week. What helps most?`,[
 ['Note the pattern with times, food and activity, and take it and your questions to the diabetes team','best',7.4,'Patterns are useful information. The team can suggest changes safely.'],
 ['Change Sam’s doses yourself every night','poor',7.4,'Unplanned changes can cause hypos. Change doses only as agreed with the team.'],
 ['Don’t mention it in case clinic is cross','poor',7.4,'The team wants to help with patterns, not judge them.']],
 'Record patterns and take them to the team rather than changing doses alone.','school')
};
/* One pool per time of day. Days are planned forward from the launch date: each slot
 * picks at random from its least recently used scenarios, so a question only returns
 * after most of its pool has been seen. Scenarios sharing a group never meet in one day. */
const SLOTS=[
 ['breakfast','packing','equipment','wakeHigh','siteRotation','newSensor','breakfastClub'],
 ['low','sensor','recovered','classTest','fastFall','occlusion','silentLow','friendsAsk'],
 ['lunch','label','delayed','pizza','forgotBolus','fruit','drinks','ateLess'],
 ['activity','exerciseLow','correction','adrenaline','hotAfternoon','pumpOff','coach'],
 ['high','handover','treat','ketones','siteOut','sleepover','restaurant'],
 ['bedtime','review','illness','nightAlarm','compression','severe','stomachBug','clinicPrep']
];
const TIMES=['07:30','10:30','12:30','14:30','17:00','21:00'];
const GROUP={equipment:'device',newSensor:'device',sensor:'device',occlusion:'pump-fault',siteOut:'pump-fault',lunch:'estimate',restaurant:'estimate',
 ketones:'ketones',illness:'ketones',stomachBug:'ketones',handover:'briefing',coach:'briefing'};
const TAGS={breakfast:'breakfast insulin',packing:'packing the bag',equipment:'a broken CGM receiver',wakeHigh:'a high wake-up',siteRotation:'a pump set change',newSensor:'a new sensor',breakfastClub:'breakfast club',
 low:'a mid-morning hypo',sensor:'a sensor mismatch',recovered:'a stubborn low',classTest:'a timed challenge',fastFall:'falling arrows',occlusion:'a pump alarm',silentLow:'a silent low',friendsAsk:'curious friends',
 lunch:'a mystery lunch',label:'label maths',delayed:'a delayed lunch',pizza:'pizza for lunch',forgotBolus:'a forgotten dose',fruit:'fruit facts',drinks:'drink choices',ateLess:'a half-eaten lunch',
 activity:'getting active',exerciseLow:'a low during sport',correction:'a correction check',adrenaline:'pre-match nerves',hotAfternoon:'a hot afternoon',pumpOff:'pump off for sport',coach:'a new coach',
 high:'a thirsty high',handover:'a handover',treat:'an evening treat',ketones:'a ketone check',siteOut:'a lost cannula',sleepover:'a sleepover invite',restaurant:'dinner out',
 bedtime:'a bedtime trend',review:'a tough day talk',illness:'a sick evening',nightAlarm:'a 2am alarm',compression:'a puzzling night reading',severe:'a night-time emergency',stomachBug:'a stomach bug',clinicPrep:'clinic planning'};
const SETTINGS=[{"title": "School sports day", "place": "school sports day", "action": "cheering on the relay", "activity": "relay races", "breakfast": "cereal and milk", "lunch": "a sandwich and yoghurt", "treat": "a slice of cake"}, {"title": "Drama club", "place": "the theatre", "action": "rehearsing a scene", "activity": "a dance warm-up", "breakfast": "toast and milk", "lunch": "a pasta pot", "treat": "a small cupcake"}, {"title": "A castle to explore", "place": "the castle", "action": "looking at the armour", "activity": "walking around the grounds", "breakfast": "cereal and yoghurt", "lunch": "a jacket potato", "treat": "a small ice cream"}, {"title": "A park picnic", "place": "the park", "action": "watching the ducks", "activity": "games on the grass", "breakfast": "porridge", "lunch": "a picnic wrap", "treat": "a flapjack"}, {"title": "A community festival", "place": "the community festival", "action": "listening to the band", "activity": "walking between activities", "breakfast": "toast and milk", "lunch": "a rice bowl", "treat": "a small cupcake"}, {"title": "Football tournament", "place": "the football ground", "action": "watching the first match", "activity": "football practice", "breakfast": "toast and cereal", "lunch": "a packed sandwich", "treat": "a slice of birthday cake"}, {"title": "An aquarium visit", "place": "the aquarium", "action": "watching the jellyfish", "activity": "walking around the displays", "breakfast": "porridge and fruit", "lunch": "a cafe wrap", "treat": "a small muffin"}, {"title": "The school fair", "place": "the school fair", "action": "choosing a game stall", "activity": "playground activities", "breakfast": "toast and milk", "lunch": "a filled roll", "treat": "a small cupcake"}, {"title": "A family bowling day", "place": "the bowling alley", "action": "choosing a bowling ball", "activity": "bowling with the family", "breakfast": "cereal and yoghurt", "lunch": "a cafe wrap", "treat": "a small cookie"}, {"title": "Grandparents’ garden", "place": "the grandparents’ house", "action": "helping plant seeds", "activity": "games in the garden", "breakfast": "a breakfast muffin", "lunch": "rice and vegetables", "treat": "a homemade scone"}, {"title": "A cycling picnic", "place": "the cycle trail", "action": "checking the route", "activity": "a family bike ride", "breakfast": "toast and yoghurt", "lunch": "a picnic roll", "treat": "a slice of fruit loaf"}, {"title": "Family treasure hunt", "place": "the treasure trail", "action": "solving a clue", "activity": "walking the trail", "breakfast": "cereal and milk", "lunch": "a picnic pasta salad", "treat": "a small brownie"}, {"title": "A mini-golf adventure", "place": "the mini-golf course", "action": "waiting for a turn", "activity": "walking around the course", "breakfast": "porridge and berries", "lunch": "a jacket potato", "treat": "a small ice cream"}, {"title": "A trip to the zoo", "place": "the zoo", "action": "watching the penguins", "activity": "walking between enclosures", "breakfast": "toast and a banana", "lunch": "a jacket potato", "treat": "a small ice cream"}, {"title": "A seaside adventure", "place": "the seaside", "action": "building a sandcastle", "activity": "beach games", "breakfast": "cereal and a banana", "lunch": "a fish-finger sandwich", "treat": "a small ice cream"}, {"title": "Cricket club", "place": "the cricket ground", "action": "watching the batting", "activity": "cricket training", "breakfast": "porridge", "lunch": "a packed wrap", "treat": "a biscuit"}, {"title": "A climbing lesson", "place": "the climbing centre", "action": "learning about the harness", "activity": "supervised climbing", "breakfast": "toast and yoghurt", "lunch": "a pasta pot", "treat": "a small muffin"}, {"title": "A planetarium adventure", "place": "the planetarium", "action": "looking at the moon display", "activity": "a walk through the science park", "breakfast": "cereal and a banana", "lunch": "a cafe sandwich", "treat": "a small muffin"}, {"title": "A woodland trail", "place": "the woods", "action": "looking for animal tracks", "activity": "a woodland walk", "breakfast": "porridge and berries", "lunch": "a picnic wrap", "treat": "a flapjack"}, {"title": "A cousin’s birthday", "place": "a cousin’s party", "action": "playing pass the parcel", "activity": "party dancing", "breakfast": "toast and milk", "lunch": "a party sandwich", "treat": "a slice of cake"}, {"title": "A train adventure", "place": "the railway museum", "action": "looking at an engine", "activity": "a walk around the station", "breakfast": "cereal and a banana", "lunch": "a packed sandwich", "treat": "a slice of fruit loaf"}, {"title": "A tennis lesson", "place": "the tennis courts", "action": "watching the coach", "activity": "tennis practice", "breakfast": "porridge and a banana", "lunch": "a pasta lunch", "treat": "a small brownie"}, {"title": "A museum adventure", "place": "the museum", "action": "trying the science exhibits", "activity": "walking around the galleries", "breakfast": "cereal and yoghurt", "lunch": "a cafe panini", "treat": "a small brownie"}, {"title": "School art exhibition", "place": "the school art show", "action": "showing a painting", "activity": "playground games", "breakfast": "cereal and milk", "lunch": "a rice salad", "treat": "a small cookie"}, {"title": "A basketball afternoon", "place": "the leisure centre", "action": "watching the warm-up", "activity": "basketball practice", "breakfast": "porridge and yoghurt", "lunch": "a rice bowl", "treat": "a small cookie"}, {"title": "A school nature trip", "place": "the nature reserve", "action": "watching birds", "activity": "a guided nature walk", "breakfast": "toast and milk", "lunch": "a packed roll", "treat": "a slice of cake"}, {"title": "Swimming with friends", "place": "the swimming pool", "action": "waiting by the pool", "activity": "a swimming lesson", "breakfast": "porridge", "lunch": "a pasta lunch", "treat": "a biscuit"}, {"title": "Library discovery day", "place": "the library", "action": "hunting for a new book", "activity": "a walk to the park afterwards", "breakfast": "porridge", "lunch": "a cheese sandwich", "treat": "a biscuit"}, {"title": "A farm park visit", "place": "the farm park", "action": "feeding the goats", "activity": "walking between the pens", "breakfast": "toast and a banana", "lunch": "a cafe sandwich", "treat": "a small scone"}, {"title": "A craft workshop", "place": "the craft centre", "action": "making a paper model", "activity": "a walk after the workshop", "breakfast": "cereal and milk", "lunch": "a cafe panini", "treat": "a small biscuit"}];
const LABEL_CARBS=[30,40,45,50,55,60,65,70,75],PORTIONS=[20,25,30,35,40,45,50,60];
function dateKey(now){return new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/London',year:'numeric',month:'2-digit',day:'2-digit'}).format(now||new Date());}
function ordinal(key){const [y,m,d]=key.split('-').map(Number);return Math.floor(Date.UTC(y,m-1,d)/86400000);}
function rng(seed){return function(){seed=(seed+0x6D2B79F5)|0;let t=Math.imul(seed^(seed>>>15),1|seed);t=(t+Math.imul(t^(t>>>7),61|t))^t;return((t^(t>>>14))>>>0)/4294967296;};}
const START=ordinal('2026-10-04'),FRESH=3,plans=[],lastUsed=new Map();
/* Pick at random from the FRESH least recently used items that pass the filter. */
function freshest(list,day,r,ok){
 const c=list.filter(ok||(()=>true)).map(x=>({x,at:lastUsed.has(x)?lastUsed.get(x):-1,tie:r()})).sort((p,q)=>p.at-q.at||p.tie-q.tie);
 const pick=c[Math.floor(r()*Math.min(FRESH,c.length))].x;lastUsed.set(pick,day);return pick;
}
function compose(n){
 const d=Math.max(0,n-START);
 while(plans.length<=d){
  const day=plans.length,r=rng(START+day),used=new Set();
  const moments=SLOTS.map(pool=>{const m=freshest(pool,day,r,name=>!used.has(GROUP[name]||name));used.add(GROUP[m]||m);return m;});
  const setting=freshest(SETTINGS,day,r);
  const tags=[moments[1],moments[2],moments[5]].map(m=>TAGS[m]);
  plans.push({id:'sam-'+(START+day),title:setting.title,subtitle:tags[0].charAt(0).toUpperCase()+tags[0].slice(1)+', '+tags[1]+' and '+tags[2],moments,
   context:{...setting,labelCarbs:LABEL_CARBS[Math.floor(r()*LABEL_CARBS.length)],portion:PORTIONS[Math.floor(r()*PORTIONS.length)]}});
 }
 return plans[d];
}
function select(now){const key=dateKey(now),n=ordinal(key);return {key,index:n,day:compose(n)};}
function build(day){return day.moments.map((name,i)=>{const e=templates[name](day.context);return e.keepTime?e:{...e,time:TIMES[i]};});}
root.SamDays={slots:SLOTS,templates,dateKey,select,compose,build};
})(typeof window==='undefined'?globalThis:window);
