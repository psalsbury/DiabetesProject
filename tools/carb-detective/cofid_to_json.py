import openpyxl, sys, json
wb = openpyxl.load_workbook(sys.argv[1], read_only=True); ws = wb['1.3 Proximates']
hdr = None; out = {}
for i, r in enumerate(ws.iter_rows(values_only=True)):
    if i == 1: hdr = r
    if i < 3 or not r[0]: continue
    out[r[0]] = {hdr[j]: r[j] for j in range(len(hdr)) if hdr[j]} | {'name': r[1], 'desc': r[2]}
json.dump(out, open(sys.argv[2], 'w'), default=str)
