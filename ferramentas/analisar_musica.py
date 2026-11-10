import sys, subprocess, numpy as np
from scipy import signal
# uso: analisar_musica.py arquivo.mp3 -> duração, BPM, brilho, melhor ponto de início
f = sys.argv[1]; sr = 22050
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', f, '-ac', '1', '-ar', str(sr), '-f', 'f32le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, np.float32)
dur = len(x) / sr
hop = 512
fr, t, S = signal.stft(x, sr, nperseg=2048, noverlap=2048 - hop)
mag = np.abs(S)
flux = np.maximum(0, np.diff(mag, axis=1)).sum(0)
flux = (flux - flux.mean()) / (flux.std() + 1e-9)
fps = sr / hop
ac = np.correlate(flux, flux, 'full')[len(flux) - 1:]
lags = np.arange(len(ac)) / fps
bpms = 60 / lags[1:]
ok = (bpms >= 70) & (bpms <= 170)
bpm = bpms[ok][np.argmax(ac[1:][ok])]
cent = (fr[:, None] * mag).sum(0) / (mag.sum(0) + 1e-9)
rms = np.sqrt((mag ** 2).mean(0))
rms_s = np.convolve(rms, np.ones(int(fps)) / int(fps), 'same')
alvo = 0.7 * np.median(rms_s)
inicio = t[np.argmax(rms_s > alvo)]
# energia por trecho de 5 s (0-10 = calmo a intenso)
seg = int(5 * fps)
blocos = [rms_s[i:i + seg].mean() for i in range(0, len(rms_s), seg)]
m = max(blocos)
perfil = ''.join(str(min(9, int(10 * b / m))) for b in blocos)
lufs = subprocess.run(['ffmpeg', '-hide_banner', '-i', f, '-af', 'ebur128', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = [l for l in lufs.splitlines() if l.strip().startswith('I:')][-1].split()[1]
print(f"{f.split('/')[-1]:38s} {dur:6.1f}s  ~{bpm:5.1f} BPM  brilho {np.median(cent):5.0f} Hz  início útil {inicio:4.1f}s  {I} LUFS  energia a cada 5s: {perfil}")
