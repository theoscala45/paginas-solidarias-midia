"""Pequeno motor de síntese para as trilhas do Páginas Solidárias.
Tudo é gerado em numpy: instrumentos, sequenciador por compasso, reverb e master.
"""
import numpy as np
from scipy import signal

SR = 44100
RNG = np.random.default_rng(7)

NOTAS = {'C': 0, 'C#': 1, 'Db': 1, 'D': 2, 'D#': 3, 'Eb': 3, 'E': 4, 'F': 5, 'F#': 6, 'Gb': 6,
         'G': 7, 'G#': 8, 'Ab': 8, 'A': 9, 'A#': 10, 'Bb': 10, 'B': 11}


def hz(nome: str) -> float:
    """'A4' -> 440.0"""
    n, o = nome[:-1], int(nome[-1])
    midi = 12 * (o + 1) + NOTAS[n]
    return 440.0 * 2 ** ((midi - 69) / 12)


def env(n, a=0.005, d=0.2, s=0.0, r=0.05, dur=None):
    """Envelope ADSR em amostras; dur = tempo até soltar a nota (s)."""
    t = np.arange(n) / SR
    dur = dur if dur is not None else n / SR
    e = np.zeros(n)
    at = t < a
    e[at] = t[at] / max(a, 1e-6)
    dec = (t >= a) & (t < dur)
    e[dec] = s + (1 - s) * np.exp(-(t[dec] - a) / max(d, 1e-6))
    rel = t >= dur
    lvl = s + (1 - s) * np.exp(-(dur - a) / max(d, 1e-6))
    e[rel] = lvl * np.exp(-(t[rel] - dur) / max(r, 1e-6))
    return e


def lp(x, fc, ordem=2):
    b, a = signal.butter(ordem, min(fc / (SR / 2), 0.99), 'low')
    return signal.lfilter(b, a, x)


def hp(x, fc, ordem=2):
    b, a = signal.butter(ordem, fc / (SR / 2), 'high')
    return signal.lfilter(b, a, x)


def bp(x, lo, hi, ordem=2):
    b, a = signal.butter(ordem, [lo / (SR / 2), min(hi / (SR / 2), 0.99)], 'band')
    return signal.lfilter(b, a, x)


# ───────────── instrumentos (cada um devolve mono)

def kick(dur=0.45, f0=115, f1=52):
    n = int(dur * SR); t = np.arange(n) / SR
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    x = np.sin(ph) * np.exp(-t / 0.16)
    click = hp(RNG.standard_normal(n), 2000) * np.exp(-t / 0.004) * 0.15
    return np.tanh(1.6 * (x + click)) * 0.9


def clap(dur=0.3):
    n = int(dur * SR); t = np.arange(n) / SR
    ruido = bp(RNG.standard_normal(n), 900, 5000)
    e = np.zeros(n)
    for k, off in enumerate([0, 0.011, 0.022]):
        m = t >= off
        e[m] += np.exp(-(t[m] - off) / (0.006 if k < 2 else 0.09))
    return ruido * e * 0.5


def snap(dur=0.18):
    n = int(dur * SR); t = np.arange(n) / SR
    return bp(RNG.standard_normal(n), 1800, 6000) * np.exp(-t / 0.025) * 0.6


def hat(dur=0.06, aberto=False):
    dur = 0.25 if aberto else dur
    n = int(dur * SR); t = np.arange(n) / SR
    return hp(RNG.standard_normal(n), 7000) * np.exp(-t / (0.08 if aberto else 0.012)) * 0.35


def shaker(dur=0.12):
    n = int(dur * SR); t = np.arange(n) / SR
    e = np.minimum(t / 0.02, 1) * np.exp(-t / 0.035)
    return bp(RNG.standard_normal(n), 5000, 11000) * e * 0.3


def baixo(f, dur, vel=1.0):
    n = int((dur + 0.15) * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    x = np.tanh(2.2 * x) * env(n, a=0.006, d=0.35, s=0.55, r=0.08, dur=dur)  # mais harmônicos: aparece no alto-falante do celular
    return lp(x, 1400) * 0.55 * vel


def epiano(f, dur, vel=1.0):
    """Piano elétrico simples por FM (sinos suaves)."""
    n = int((dur + 1.0) * SR); t = np.arange(n) / SR
    idx = 1.6 * np.exp(-t / 0.4) * vel
    mod = np.sin(2 * np.pi * f * t) * idx
    x = np.sin(2 * np.pi * f * t + mod)
    x += 0.12 * np.sin(2 * np.pi * 14 * f * t) * np.exp(-t / 0.02)  # ataque metálico leve
    trem = 1 + 0.08 * np.sin(2 * np.pi * 4.5 * t)
    return x * trem * env(n, a=0.003, d=0.9, s=0.25, r=0.35, dur=dur) * 0.28 * vel


def marimba(f, dur=0.6, vel=1.0):
    n = int((dur + 0.3) * SR); t = np.arange(n) / SR
    x = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.35)
    x += 0.35 * np.sin(2 * np.pi * 4 * f * t) * np.exp(-t / 0.06)
    x += 0.1 * np.sin(2 * np.pi * 9.9 * f * t) * np.exp(-t / 0.015)
    return x * np.minimum(t / 0.002, 1) * 0.35 * vel


def pluck(f, dur=1.2, vel=1.0, brilho=0.5):
    """Corda dedilhada (Karplus-Strong, processado em blocos)."""
    n = int((dur + 0.4) * SR)
    p = max(2, int(round(SR / f)))
    b = lp(RNG.uniform(-1, 1, p), 1500 + 6000 * brilho)
    rep = 0.997 if f < 300 else 0.994
    blocos = []
    total = 0
    while total < n:
        blocos.append(b)
        total += p
        b = rep * 0.5 * (b + np.roll(b, -1))
    out = np.concatenate(blocos)[:n]
    t = np.arange(n) / SR
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.08), 1)
    return out * rel * np.minimum(t / 0.001, 1) * 0.45 * vel


def piano(f, dur, vel=1.0):
    n = int((dur + 1.4) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for h, (amp, dec) in enumerate([(1, 1.4), (0.45, 0.9), (0.25, 0.6), (0.12, 0.4), (0.06, 0.25)], start=1):
        x += amp * np.sin(2 * np.pi * f * h * t * (1 + 0.0004 * h * h)) * np.exp(-t / dec)
    x *= np.minimum(t / 0.004, 1)
    rel = np.where(t > dur, np.exp(-(t - dur) / 0.3), 1)
    return lp(x * rel, 7500) * 0.25 * vel


def pad(freqs, dur, vel=1.0, brilho=1800):
    n = int((dur + 1.5) * SR); t = np.arange(n) / SR
    x = np.zeros(n)
    for f in freqs:
        for dt in (-0.12, 0.0, 0.11):
            fr = f * 2 ** (dt / 12)
            ph = RNG.uniform(0, 1)
            x += signal.sawtooth(2 * np.pi * (fr * t + ph))
    x = lp(x / (3 * len(freqs)), brilho, 2)
    return x * env(n, a=0.6, d=1.0, s=0.8, r=1.2, dur=dur) * 0.35 * vel


# ───────────── mixagem

class Faixa:
    def __init__(self, bpm, compassos, nome):
        self.bpm, self.nome = bpm, nome
        self.beat = 60 / bpm
        self.dur = compassos * 4 * self.beat + 2.5  # cauda final
        self.n = int(self.dur * SR)
        self.trilhas = {}

    def t(self, compasso, tempo=0.0):
        return (compasso * 4 + tempo) * self.beat

    def add(self, trilha, som, seg, pan=0.0, ganho=1.0):
        L = self.trilhas.setdefault(trilha, np.zeros((2, self.n)))
        i = int(seg * SR)
        if i >= self.n:
            return
        som = som[: self.n - i] * ganho
        gl, gr = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
        L[0, i:i + len(som)] += som * gl * 1.41
        L[1, i:i + len(som)] += som * gr * 1.41

    def nivelar(self, alvo_db):
        """Ajusta cada trilha para um RMS-alvo (medido só nos trechos em que ela toca)."""
        for nome, L in self.trilhas.items():
            m = np.abs(L).mean(0)
            q = int(0.05 * SR)
            k = len(m) // q
            rms_q = np.sqrt((m[: k * q].reshape(k, q) ** 2).mean(1))
            ativo = rms_q[rms_q > 10 ** (-60 / 20)]
            if len(ativo) == 0:
                continue
            rms = np.sqrt((ativo ** 2).mean())
            alvo = alvo_db.get(nome, alvo_db.get('_padrao', -20))
            self.trilhas[nome] = L * (10 ** (alvo / 20) / rms)

    def render(self, reverb=None, sidechain=None, niveis=None):
        """reverb: {trilha: envio}; sidechain: (trilha_gatilho, [trilhas_afetadas], profundidade)."""
        NIVEIS = {'kick': -14, 'clap': -21, 'snap': -21, 'hat': -28, 'shk': -28, 'baixo': -16,
                  'ep': -18, 'acd': -19, 'uke': -18, 'arp': -19, 'harpa': -17, 'pad': -22, 'mel': -16, '_padrao': -20}
        NIVEIS.update(niveis or {})
        self.nivelar(NIVEIS)
        reverb = reverb or {}
        mix = np.zeros((2, self.n))
        envio = np.zeros((2, self.n))
        duck = np.ones(self.n)
        if sidechain:
            gat = np.abs(self.trilhas.get(sidechain[0], np.zeros((2, self.n)))).sum(0)
            envl = lp(gat, 8, 1)
            envl = envl / (envl.max() + 1e-9)
            duck = 1 - sidechain[2] * np.clip(envl * 3, 0, 1)
        for nome, L in self.trilhas.items():
            x = L * (duck if sidechain and nome in sidechain[1] else 1)
            mix += x
            envio += x * reverb.get(nome, 0.0)
        if envio.any():
            ir_n = int(2.2 * SR); t = np.arange(ir_n) / SR
            ir = RNG.standard_normal((2, ir_n)) * np.exp(-t / 0.55)
            ir = np.stack([lp(ir[0], 4500), lp(ir[1], 4500)])
            ir[:, : int(0.02 * SR)] = 0
            ir /= np.abs(ir).sum(1, keepdims=True) ** 0.5 * 20
            rv = np.stack([signal.fftconvolve(envio[c], ir[c])[: self.n] for c in range(2)])
            mix += rv * 0.9
        mix = np.stack([hp(mix[0], 45), hp(mix[1], 45)])
        # brilho leve (prateleira de agudos) e cola suave
        ar = np.stack([hp(mix[0], 6000, 1), hp(mix[1], 6000, 1)])
        mix = mix + 0.25 * ar
        pico = np.abs(mix).max() + 1e-9
        mix = mix / pico * 1.4
        mix = np.tanh(mix) / np.tanh(1.4)
        # fade final
        fade = int(1.5 * SR)
        mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
        mix /= np.abs(mix).max() + 1e-9
        return (mix * 0.89).T.astype(np.float32)


def acorde(fund, tipo='maj', oit=4):
    base = hz(f'{fund}{oit}')
    iv = {'maj': [0, 4, 7], 'min': [0, 3, 7], 'maj7': [0, 4, 7, 11], 'min7': [0, 3, 7, 10], 'sus2': [0, 2, 7],
          'add9': [0, 4, 7, 14], 'dom7': [0, 4, 7, 10]}[tipo]
    return [base * 2 ** (i / 12) for i in iv]
