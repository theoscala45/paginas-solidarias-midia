import sys, subprocess, numpy as np
# uso: ritmo.py video.mp4 -> trechos parados e trocas grandes
v = sys.argv[1]
w, h = 108, 192
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', v, '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], capture_output=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(float)
d = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
still = d < 0.15
runs, i = [], 0
while i < len(still):
    if still[i]:
        j = i
        while j < len(still) and still[j]: j += 1
        if j - i >= 15: runs.append((i / 30, (j - i) / 30))
        i = j
    else: i += 1
print(f'duração {len(fr)/30:.1f}s · quadros parados {still.mean()*100:.0f}%')
print('trechos parados ≥0,5 s:', ', '.join(f'{a:.1f}s ({b:.1f}s)' for a, b in runs) or 'nenhum')
print('maior parado:', max([b for _, b in runs], default=0), 's')
big = np.where(d > 25)[0]
print('trocas grandes (corte/rajada) em:', ', '.join(f'{x/30:.2f}' for x in big) or 'nenhuma')
