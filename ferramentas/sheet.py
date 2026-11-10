import sys, glob, os
from PIL import Image, ImageDraw
# uso: sheet.py <pasta_frames> <saida.png> [largura_miniatura]
pasta, saida = sys.argv[1], sys.argv[2]
w = int(sys.argv[3]) if len(sys.argv) > 3 else 270
fs = sorted(glob.glob(os.path.join(pasta, '*.png')))
ims = [Image.open(f).convert('RGB') for f in fs]
h = int(ims[0].height * w / ims[0].width)
cols = min(6, len(ims)); rows = (len(ims) + cols - 1) // cols
s = Image.new('RGB', (cols * (w + 10), rows * (h + 34)), (40, 40, 40))
d = ImageDraw.Draw(s)
for i, (f, im) in enumerate(zip(fs, ims)):
    x, y = (i % cols) * (w + 10), (i // cols) * (h + 34)
    t = im.resize((w, h))
    # linhas guia: zona do Instagram (topo 285, base 1520) e corte 1:1 (420-1500)
    dt = ImageDraw.Draw(t)
    if im.height == 1920:
        for yy, c in [(285, (255, 0, 0)), (1520, (255, 0, 0)), (420, (0, 120, 255)), (1500, (0, 120, 255))]:
            dt.line([(0, yy * h / 1920), (w, yy * h / 1920)], fill=c, width=1)
    s.paste(t, (x, y))
    d.text((x + 4, y + h + 6), os.path.basename(f), fill=(220, 220, 220))
s.save(saida)
