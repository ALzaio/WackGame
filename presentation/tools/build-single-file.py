"""Builds one self-contained HTML file (CSS, JS, fonts and photos inlined).
Usage:  python3 tools/build-single-file.py [output.html]"""
import base64, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
out = sys.argv[1] if len(sys.argv) > 1 else os.path.join(ROOT, 'blockchain-presentation.html')
read = lambda p: open(os.path.join(ROOT, p), encoding='utf-8').read()
b64 = lambda p: base64.b64encode(open(os.path.join(ROOT, p), 'rb').read()).decode()

css = re.sub(r'url\((assets/fonts/[^)]+)\)', lambda m: 'url(data:font/woff2;base64,%s)' % b64(m.group(1)), read('styles.css'))
scenes = read('scenes.js')
names = [f[:-4] for f in os.listdir(os.path.join(ROOT, 'assets/img')) if f.endswith('.jpg')]
used = sorted(n for n in names if re.search(r"['\"]%s['\"]" % re.escape(n), scenes))   # PH('tanker') or img: 'upstream'
imgs = {n: 'data:image/jpeg;base64,' + b64('assets/img/%s.jpg' % n) for n in used}
old = "const PH = name => `assets/img/${name}.jpg`;"
assert old in scenes
scenes = scenes.replace(old, 'const IMG = %s;\n  const PH = name => IMG[name];' % repr(imgs).replace("'", '"'))

html = read('index.html')
html = html.replace('<link rel="stylesheet" href="styles.css">', '<style>\n' + css + '\n</style>')
html = html.replace('<script src="scenes.js"></script>', '<script>\n' + scenes + '\n</script>')
html = html.replace('<script src="app.js"></script>', '<script>\n' + read('app.js') + '\n</script>')
assert 'styles.css' not in html and 'src="scenes.js"' not in html and 'src="app.js"' not in html
open(out, 'w', encoding='utf-8').write(html)
print('wrote %s (%d KB, photos: %s)' % (out, os.path.getsize(out) // 1024, ', '.join(used)))
