import numpy as np
from scipy import signal
from scipy.io import wavfile
SR = 48000
rng = np.random.default_rng(3)
def salvar(nome, x):
    x = x / (np.abs(x).max() + 1e-9) * 0.7
    st = np.stack([x, x], 1).astype(np.float32)
    wavfile.write(f'/home/claude/sfx/{nome}.wav', SR, st)
def bp(x, lo, hi):
    b, a = signal.butter(2, [lo / (SR / 2), hi / (SR / 2)], 'band'); return signal.lfilter(b, a, x)
t = lambda d: np.arange(int(d * SR)) / SR
# risco de caneta: ruído com filtro que sobe, envelope em "raspadas"
tt = t(0.32); n = rng.standard_normal(len(tt))
risco = np.zeros_like(n)
for lo, hi, a, b in [(1800, 5200, 0, .16), (2400, 6800, .14, .32)]:
    m = (tt >= a) & (tt < b); seg = bp(n, lo, hi) * m
    e = np.zeros_like(tt); e[m] = np.sin(np.pi * (tt[m] - a) / (b - a)) ** 1.5
    risco += seg * e
salvar('risco-caneta', risco)
# folha de papel caindo: farfalhar curto
tt = t(0.45); n = rng.standard_normal(len(tt))
e = np.minimum(tt / 0.03, 1) * np.exp(-tt / 0.12) * (1 + 0.6 * np.sin(2 * np.pi * 23 * tt))
salvar('papel', bp(n, 900, 7000) * e)
# livro deslizando na estante: ruído grave e suave
tt = t(0.55); n = rng.standard_normal(len(tt))
e = np.sin(np.pi * np.minimum(tt / 0.55, 1)) ** 2
salvar('deslizar', bp(n, 250, 2200) * e * 0.8)
# sino suave para o "obrigado"
tt = t(2.2); x = np.zeros_like(tt)
for h, (a, d) in zip([1, 2.0, 3.01, 4.2], [(1, 1.6), (.5, .9), (.25, .5), (.12, .3)]):
    x += a * np.sin(2 * np.pi * 1046.5 * h * tt) * np.exp(-tt / d)
salvar('sino', x * np.minimum(tt / 0.003, 1))
print('ok')
