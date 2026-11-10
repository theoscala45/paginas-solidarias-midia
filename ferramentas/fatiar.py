import sys
from PIL import Image
# uso: fatiar.py panorama.png prefixo -> prefixo-1.png ... e uma prévia lado a lado
im = Image.open(sys.argv[1]).convert('RGB'); pre = sys.argv[2]
n = im.width // 1080
for i in range(n):
    im.crop((i * 1080, 0, (i + 1) * 1080, 1350)).save(f'{pre}-{i+1}.png')
prev = Image.new('RGB', (n * 280 + (n - 1) * 12, 350), (40, 40, 40))
for i in range(n):
    prev.paste(im.crop((i * 1080, 0, (i + 1) * 1080, 1350)).resize((280, 350)), (i * 292, 0))
prev.save(f'{pre}-previa.png')
