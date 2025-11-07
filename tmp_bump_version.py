import json
p='package.json'
js=json.load(open(p))
if 'version' not in js:
    js['version']='0.1.0'
else:
    v=js['version'].split('.')
    v[-1]=str(int(v[-1])+1)
    js['version']='.'.join(v)
open(p,'w').write(json.dumps(js,indent=2)+"\n")
print('updated',js['version'])
