import json, sys
d = json.load(open(sys.argv[1]))
def n(x):
    try: return float(x)
    except: return 0.0  # 'Tr' (trace), 'N' (not measured) or blank
def label(c):
    # CoFID gives carbohydrate as monosaccharide equivalents. Food labels give the actual weight:
    # starch (and oligosaccharides) / 1.10, disaccharides / 1.05, monosaccharides as they are.
    r = d[c]; cho = n(r['CHO']); totsug = n(r['TOTSUG'])
    mono = n(r['GLUC']) + n(r['FRUCT']) + n(r['GALACT'])
    di = n(r['SUCR']) + n(r['MALT']) + n(r['LACT'])
    note = ''
    if abs(mono + di - totsug) <= 0.2: sug = mono + di / 1.05
    else: sug = totsug / 1.05; note += ' [sugars not broken down: /1.05]'
    starch = n(r['STAR']) + n(r['OLIGO'])
    if abs(starch + totsug - cho) > 0.6: starch = cho - totsug; note += ' [starch = CHO - sugars]'
    if note: print('   NOTE', c, note, file=sys.stderr)
    return round(starch / 1.10 + sug, 1), round(sug, 1)
ALLOW = set()
# emoji, what it is (plain English), CoFID code, portion description, grams (BNF "Find your balance" 2019 unless noted)
F = [
 ('🥣', 'Cornflakes (no milk)', '11-742', 'a bowl, about 3 handfuls', 40),
 ('🥣', 'Wheat biscuits, Weetabix-type (no milk)', '11-773', '2 biscuits', 40),
 ('🥣', 'Swiss-style muesli (no milk)', '11-780', 'a bowl, about 3 handfuls', 50),
 ('🥣', 'Porridge oats, weighed dry', '11-788', 'about 1½ handfuls of dry oats', 45),
 ('🍞', 'Wholemeal bread, medium sliced', '11-981', '2 slices', 80),
 ('🍞', 'White bread, thick sliced', '11-980', '2 slices', 94),
 ('🥯', 'Plain bagel', '11-970', '1 bagel', 85),
 ('🫓', 'Crumpet, toasted', '11-989', '1 crumpet', 50),
 ('🫓', 'White pitta bread', '11-974', '1 pitta', 60),
 ('🌯', 'Soft wheat tortilla wrap', '11-925', '1 wrap', 65),
 ('🫓', 'Chapati made without fat', '11-459', '1 small chapati', 45),
 ('🫓', 'Plain naan bread', '11-973', 'half a naan', 70),
 ('🍝', 'White pasta, weighed dry', '11-716', '2 handfuls of dry pasta', 75),
 ('🍝', 'White pasta, boiled', '11-1129', 'enough to fill 2 cupped hands', 180),
 ('🍚', 'White basmati rice, boiled', '11-858', 'enough to fill 2 cupped hands', 180),
 ('🍚', 'Plain microwave rice, heated', '11-884', 'half a 250g pouch', 125),
 ('🍜', 'Medium egg noodles, boiled', '11-724', '1 nest, cooked', 175),
 ('🥙', 'Couscous, cooked', '11-902', 'enough to fill 2 cupped hands', 150),
 ('🥔', 'Baked potato, flesh and skin', '13-491', '1 potato about the size of your fist', 220),
 ('🥔', 'New potatoes, boiled in their skins', '13-495', 'about 6 small potatoes', 175),
 ('🥔', 'Mashed potato with butter', '13-553', 'about 4 tablespoons', 180),
 ('🥔', 'Roast potatoes in rapeseed oil', '13-534', 'about 4 small roast potatoes', 200),
 ('🍟', 'Oven chips, baked', '13-487', 'about 2 handfuls', 165),
 ('🫘', 'Baked beans in tomato sauce', '13-532', 'half a 400g can', 200),
 ('🥛', 'Low-fat fruit yogurt', '12-380', '1 small pot', 125),
 ('🥛', 'Low-fat plain yogurt', '12-379', 'about 4 tablespoons', 120),
 ('🥛', 'Soya fruit yogurt alternative', '12-609', '1 individual pot', 125),
 ('🍪', 'Plain oatcakes', '11-823', '2 oatcakes', 24),
 ('🍪', 'Cream crackers', '11-820', '3 crackers', 24),
 ('🧁', 'Fruit scone', '11-993', '1 small scone', 40),
 ('🍇', 'Grapes', '14-350', 'a handful, one of your 5 A DAY', 80),
 ('🌽', 'Sweetcorn, canned and drained', '13-529', '3 heaped serving spoons, one of your 5 A DAY', 80),
 ('🍇', 'Raisins', '14-393', '1 heaped serving spoon, one of your 5 A DAY', 30),
]
# Children aged 5-11: portions from the Caroline Walker Trust "Eating well for 5-11 year olds" photo resources (2010),
# which "meet the needs of an average 5-11 year old". Counts are only given where the item is a single obvious unit
# or the Trust states it (1 and a half wheat biscuits).
KIDS = [
 ('🥣', 'Cornflakes (no milk)', '11-742', 'a child’s bowl', 30),
 ('🥣', 'Crisped rice cereal (no milk)', '11-750', 'a child’s bowl', 30),
 ('🥣', 'Puffed wheat cereal (no milk)', '11-756', 'a child’s bowl', 30),
 ('🥣', 'Shredded wheat-type cereal (no milk)', '11-775', 'a child’s bowl', 25),
 ('🥣', 'Wheat biscuits, Weetabix-type (no milk)', '11-773', '1½ biscuits', 30),
 ('🥣', 'Swiss-style muesli (no milk)', '11-780', 'a child’s bowl', 40),
 ('🥣', 'Porridge made with semi-skimmed milk', '11-789', 'a child’s bowl, milk included', 200),
 ('🍞', 'Wholemeal toast', '11-982', 'toast with a cooked breakfast', 30),
 ('🥯', 'Plain bagel', '11-970', '1 bagel', 70),
 ('🫓', 'Crumpet, toasted', '11-989', '1 crumpet', 40),
 ('🫓', 'White pitta bread', '11-974', '1 small pitta', 50),
 ('🌯', 'Soft wheat tortilla wrap', '11-925', '1 small wrap', 40),
 ('🫓', 'Chapati made without fat', '11-459', '1 chapati with a curry', 55),
 ('🧁', 'Currant bun', '11-1009', '1 small bun', 35),
 ('🥖', 'Plain breadsticks', '11-826', 'a snack portion', 15),
 ('🍪', 'Plain oatcakes', '11-823', 'a snack portion', 20),
 ('🧁', 'Fruit scone', '11-993', '1 small scone', 30),
 ('🍞', 'Malt loaf', '11-462', 'a packed-lunch portion', 40),
 ('🍝', 'Spaghetti, boiled', '11-722', 'served with bolognese sauce', 120),
 ('🍜', 'Egg noodles, boiled', '11-724', 'served with a stir-fry', 120),
 ('🍚', 'White long grain rice, boiled', '11-862', 'served with a curry', 120),
 ('🍚', 'Brown rice, boiled', '11-869', 'served with a curry', 120),
 ('🥔', 'Jacket potato, flesh and skin', '13-491', '1 jacket potato', 170),
 ('🥔', 'Mashed potato with butter', '13-553', 'served with sausages and beans', 130),
 ('🥔', 'Roast potatoes in rapeseed oil', '13-534', 'with a roast dinner', 120),
 ('🫘', 'Baked beans in tomato sauce', '13-532', 'on toast or with a jacket potato', 90),
 ('🥛', 'Low-fat fruit yogurt', '12-380', '1 pot', 125),
 ('🥛', 'Plain (natural) yogurt', '12-184', '1 pot', 125),
 ('🍇', 'Grapes', '14-350', 'one of your 5 A DAY', 80),
 ('🍇', 'Raisins', '14-393', 'a small handful', 20),
 ('🍌', 'Banana (peeled)', '14-318', 'one of your 5 A DAY', 80),
 ('🍎', 'Apple, eaten with skin', '14-319', 'one of your 5 A DAY', 80),
 ('🌽', 'Sweetcorn, canned and drained', '13-529', 'in a packed lunch', 80),
]
which = sys.argv[2] if len(sys.argv) > 2 else 'adult'
if which == 'kids': F = KIDS
out = []
for e, name, code, por, g in F:
    carb, sug = label(code)
    out.append([e, name, carb, sug, g, por, code])
    print(f"{code:8} {name:42} {d[code]['name'][:60]:60} label {carb:5} sug {sug:5} | {por} {g}g -> {carb*g/100:.1f}", file=sys.stderr)
print(json.dumps(out, ensure_ascii=False))
