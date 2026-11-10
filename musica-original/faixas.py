"""As seis trilhas originais do Páginas Solidárias. Uso: python3 faixas.py [nome]"""
import sys
import numpy as np
from scipy.io import wavfile
from synth import (Faixa, SR, acorde, baixo, clap, epiano, hat, hz, kick, marimba, pad, piano, pluck, shaker, snap)


def humano(seg, k, amt=0.006):
    """Pequeno desvio determinístico de tempo, para não soar robótico."""
    return seg + amt * np.sin(k * 12.9898)


# ───────────────────────── 1. Contagem (animada, 118 BPM, Dó maior)
def contagem():
    F = Faixa(118, 16, 'contagem')
    prog = [('C', 'maj'), ('G', 'maj'), ('A', 'min'), ('F', 'maj')]
    graves = {'C': 'C2', 'G': 'G2', 'A': 'A2', 'F': 'F2'}
    gancho = [(0, 'E5', .5), (.5, 'G5', .5), (1, 'A5', .75), (2, 'G5', .5), (2.5, 'E5', .5), (3, 'D5', .9)]
    gancho2 = [(0, 'C5', .5), (.5, 'D5', .5), (1, 'E5', .5), (1.5, 'G5', .5), (2, 'E5', 1), (3, 'C5', .9)]
    for c in range(16):
        raiz, tipo = prog[c % 4]
        cheio = 1 <= c <= 12 or c == 15
        quebra = c in (13, 14)
        # acordes em contratempo
        for b in (0.5, 1.5, 2.5, 3.5):
            for f in acorde(raiz, tipo, 4):
                F.add('ep', epiano(f, 0.22, 0.8), humano(F.t(c, b), c * 4 + b), pan=-0.25)
        if c == 0:
            for b in range(8):
                F.add('hat', hat(), F.t(c, b / 2), pan=0.3, ganho=0.5)
            continue
        if cheio and c < 15:
            for b in range(4):
                if b in (0, 2) or (c % 2 == 1 and b == 3):
                    F.add('kick', kick(), F.t(c, b))
            F.add('kick', kick(), F.t(c, 2.5), ganho=0.6) if c % 4 == 3 else None
            for b in (1, 3):
                F.add('clap', clap(), F.t(c, b), ganho=0.8)
            for b in range(8):
                F.add('hat', hat(aberto=(b % 2 == 1)), humano(F.t(c, b / 2), b), pan=0.3, ganho=0.45 if b % 2 else 0.6)
            for b in (0, .5, 1.5, 2, 2.5, 3.5):
                F.add('baixo', baixo(hz(graves[raiz]), 0.2), F.t(c, b), ganho=0.9)
        if quebra:
            for b in range(16):
                F.add('hat', hat(), F.t(c, b / 4), pan=0.3, ganho=0.25 + 0.03 * b)
            F.add('baixo', baixo(hz(graves[raiz]), 1.6), F.t(c, 0))
        if 3 <= c <= 12:
            linha = gancho if c % 2 == 1 else gancho2
            for b, nota, d in linha:
                F.add('mel', marimba(hz(nota), d, 0.9), humano(F.t(c, b), c + b), pan=0.2)
        if c == 15:
            F.add('kick', kick(), F.t(c, 0))
            F.add('clap', clap(), F.t(c, 0))
            for f in acorde('C', 'add9', 4):
                F.add('ep', epiano(f, 2.5, 1.0), F.t(c, 0))
            F.add('baixo', baixo(hz('C2'), 2.0), F.t(c, 0))
    return F.render(reverb={'ep': .25, 'mel': .35, 'clap': .2}, sidechain=('kick', ['ep', 'baixo'], .35))


# ───────────────────────── 2. Pilha (animada, 124 BPM, Lá menor -> brilhante)
def pilha():
    F = Faixa(124, 16, 'pilha')
    prog = [('A', 'min'), ('F', 'maj'), ('C', 'maj'), ('G', 'maj')]
    graves = {'A': 'A2', 'F': 'F2', 'C': 'C2', 'G': 'G2'}
    for c in range(16):
        raiz, tipo = prog[c % 4]
        notas = acorde(raiz, tipo, 4)
        arp = [notas[0], notas[1], notas[2], notas[1] * 2, notas[2], notas[1], notas[0] * 2, notas[2]]
        for i in range(16):
            f = arp[i % 8]
            F.add('arp', pluck(f, 0.18, 0.55 + 0.25 * (i % 4 == 0), brilho=0.7), humano(F.t(c, i / 4), c * 16 + i, 0.003),
                  pan=0.35 if i % 2 else -0.35)
        F.add('pad', pad(acorde(raiz, tipo, 3), 4 * F.beat, 0.7, 1400), F.t(c, 0))
        if c >= 1 and c not in (12, 13):
            for b in range(4):
                F.add('kick', kick(f0=100), F.t(c, b), ganho=0.85)
            for b in (1, 3):
                F.add('snap', snap(), F.t(c, b), pan=0.15)
            for i in range(16):
                F.add('shk', shaker(), humano(F.t(c, i / 4), i, 0.004), pan=0.4, ganho=0.7 if i % 2 else 0.4)
            for b in (0, 1.5, 2, 3):
                F.add('baixo', baixo(hz(graves[raiz]), 0.35), F.t(c, b))
        if c in (12, 13):
            F.add('baixo', baixo(hz(graves[raiz]), 3.5), F.t(c, 0), ganho=0.8)
            if c == 13:
                for i in range(8):
                    F.add('snap', snap(), F.t(c, 2 + i / 4), ganho=0.3 + 0.08 * i)
        if c == 15:
            pass
    F.add('kick', kick(), F.t(16, 0))
    for f in acorde('A', 'min7', 4):
        F.add('pad', pluck(f, 2.0, 0.8), F.t(16, 0))
    return F.render(reverb={'arp': .3, 'pad': .4, 'snap': .25}, sidechain=('kick', ['pad', 'baixo', 'arp'], .35), niveis={'kick': -17, 'arp': -17})


# ───────────────────────── 3. Estante (leve e divertida, 104 BPM, Fá maior)
def estante():
    F = Faixa(104, 16, 'estante')
    prog = [('F', 'maj'), ('A#', 'maj'), ('C', 'maj'), ('F', 'maj'), ('D', 'min'), ('A#', 'maj'), ('C', 'maj'), ('C', 'dom7')]
    graves = {'F': 'F2', 'A#': 'A#2', 'C': 'C2', 'D': 'D2'}
    mel = [
        [(0, 'A5', .4), (.5, 'C6', .4), (1, 'A5', .4), (1.5, 'F5', .4), (2, 'G5', .9), (3.5, 'A5', .4)],
        [(0, 'A#5', .4), (.5, 'A5', .4), (1, 'G5', .4), (1.5, 'F5', .4), (2, 'D5', .9)],
        [(0, 'E5', .4), (.5, 'G5', .4), (1, 'C6', .4), (1.5, 'A#5', .4), (2, 'A5', .4), (2.5, 'G5', .4), (3, 'E5', .9)],
        [(0, 'F5', 1.2), (2, 'C5', .4), (2.5, 'D5', .4), (3, 'E5', .4), (3.5, 'F5', .4)],
    ]
    for c in range(16):
        raiz, tipo = prog[c % 8]
        g = hz(graves[raiz])
        # baixo saltitante (pizzicato)
        for b, mult in ((0, 1), (1, 1.5), (2, 1), (3, 1.5)):
            F.add('baixo', pluck(g * mult, 0.25, 0.9, brilho=0.2), F.t(c, b), pan=-0.1)
        # acordes de marimba nos tempos 2 e 4
        for b in (1, 3):
            for f in acorde(raiz, tipo, 4):
                F.add('acd', marimba(f, 0.3, 0.5), humano(F.t(c, b), c + b), pan=-0.3)
        if c >= 1:
            for b in (1, 3):
                F.add('snap', snap(), F.t(c, b), pan=0.2, ganho=0.9)
            for i in range(8):
                F.add('shk', shaker(), humano(F.t(c, i / 2 + 0.25), i, 0.005), pan=0.45, ganho=0.6)
            F.add('kick', kick(f0=90, dur=0.35), F.t(c, 0), ganho=0.7)
            F.add('kick', kick(f0=90, dur=0.35), F.t(c, 2.5), ganho=0.5)
        if 2 <= c <= 13:
            for b, nota, d in mel[(c - 2) % 4]:
                F.add('mel', marimba(hz(nota), d, 1.0), humano(F.t(c, b), c * 7 + b), pan=0.25)
                F.add('mel', marimba(hz(nota) * 2, d, 0.2), humano(F.t(c, b) + 0.004, c), pan=0.25)
    for f in acorde('F', 'add9', 4):
        F.add('acd', marimba(f, 1.5, 0.9), F.t(16, 0))
    F.add('baixo', pluck(hz('F2'), 1.5, 1.0, 0.3), F.t(16, 0))
    return F.render(reverb={'mel': .3, 'acd': .25, 'snap': .3})


# ───────────────────────── 4. Recado (leve, 96 BPM, Sol maior)
def recado():
    F = Faixa(96, 16, 'recado')
    prog = [('G', 'maj'), ('E', 'min'), ('C', 'maj'), ('D', 'maj')]
    graves = {'G': 'G2', 'E': 'E2', 'C': 'C2', 'D': 'D2'}
    padrao = [(0, 1, .9), (1, -1, .5), (1.5, 1, .6), (2.5, -1, .5), (3, 1, .7), (3.5, -1, .45)]
    mel = [(0, 'B4', 1), (1, 'D5', .5), (1.5, 'E5', .5), (2, 'D5', 1.5),
           (4, 'B4', .5), (4.5, 'A4', .5), (5, 'G4', 1), (6, 'E4', 1.5),
           (8, 'G4', .5), (8.5, 'A4', .5), (9, 'B4', 1), (10, 'C5', .5), (10.5, 'B4', .5), (11, 'A4', 1),
           (12, 'D5', 1), (13, 'B4', .5), (13.5, 'A4', .5), (14, 'G4', 1.8)]
    for c in range(16):
        raiz, tipo = prog[c % 4]
        notas = acorde(raiz, tipo, 4)
        for b, dirc, vel in padrao:
            ordem = notas if dirc > 0 else notas[::-1]
            for k, f in enumerate(ordem):
                F.add('uke', pluck(f, 0.45, vel, brilho=0.55), humano(F.t(c, b) + k * 0.012, c * 9 + b, 0.004), pan=-0.3)
        if c >= 1:
            F.add('kick', kick(f0=95, dur=0.35), F.t(c, 0), ganho=0.65)
            F.add('kick', kick(f0=95, dur=0.35), F.t(c, 2), ganho=0.55)
            for b in (1, 3):
                F.add('clap', clap(), F.t(c, b), pan=0.1, ganho=0.55)
            for b in (0, 2, 2.5):
                F.add('baixo', baixo(hz(graves[raiz]), 0.4), F.t(c, b), ganho=0.8)
        if 2 <= c <= 13:
            base = ((c - 2) % 4) * 4
            for b, nota, d in mel:
                if base <= b < base + 4:
                    F.add('mel', epiano(hz(nota) * 2, d, 0.9), humano(F.t(c, b - base), c + b), pan=0.25)
    for f in acorde('G', 'add9', 4):
        F.add('uke', pluck(f, 2.0, 0.9, 0.5), F.t(16, 0))
    F.add('baixo', baixo(hz('G2'), 1.8), F.t(16, 0))
    return F.render(reverb={'mel': .35, 'uke': .2, 'clap': .25}, sidechain=('kick', ['baixo'], .25))


# ───────────────────────── 5. Obrigado (calma e afetiva, 76 BPM, Dó maior)
def obrigado():
    F = Faixa(76, 12, 'obrigado')
    prog = [('F', 'maj7'), ('E', 'min7'), ('D', 'min7'), ('C', 'maj7')]
    graves = {'F': 'F2', 'E': 'E2', 'D': 'D2', 'C': 'C2'}
    mel = [[(0, 'A5', 1.5), (1.5, 'G5', .5), (2, 'E5', 2)],
           [(0, 'G5', 1), (1, 'B5', 1), (2, 'D6', 1.5), (3.5, 'C6', .5)],
           [(0, 'F5', 1.5), (1.5, 'E5', .5), (2, 'D5', 1), (3, 'A5', 1)],
           [(0, 'G5', 3.5)]]
    for c in range(12):
        raiz, tipo = prog[c % 4]
        F.add('pad', pad(acorde(raiz, tipo, 3), 4 * F.beat, 0.8, 1200), F.t(c, 0))
        for b, f in zip((0, 1, 2, 3), acorde(raiz, tipo, 4)):
            F.add('ep', epiano(f, 0.9, 0.55), humano(F.t(c, b + 0.5 if b % 2 else b), c * 4 + b, 0.01), pan=-0.3 + 0.2 * b)
        if c >= 2:
            F.add('baixo', baixo(hz(graves[raiz]), 3.5 * F.beat, 0.7), F.t(c, 0))
        if c >= 4:
            F.add('kick', kick(f0=80, dur=0.5), F.t(c, 0), ganho=0.45)
            F.add('shk', shaker(0.2), F.t(c, 1.5), pan=0.4, ganho=0.4)
            F.add('shk', shaker(0.2), F.t(c, 3.5), pan=0.4, ganho=0.4)
        if 2 <= c <= 10:
            for b, nota, d in mel[(c - 2) % 4]:
                F.add('mel', piano(hz(nota) / 2, d * F.beat, 0.9), humano(F.t(c, b), c + b, 0.012), pan=0.15)
    for f in acorde('C', 'maj7', 3):
        F.add('pad', pad([f], 3.0, 0.9, 1100), F.t(12, 0))
    F.add('mel', piano(hz('C5'), 3.0, 0.9), F.t(12, 0))
    return F.render(reverb={'ep': .4, 'mel': .5, 'pad': .5})


# ───────────────────────── 6. Paraisópolis (calma, 84 BPM, Ré maior)
def paraisopolis():
    F = Faixa(84, 12, 'paraisopolis')
    prog = [('D', 'add9'), ('A', 'maj'), ('B', 'min7'), ('G', 'maj7')]
    graves = {'D': 'D2', 'A': 'A2', 'B': 'B2', 'G': 'G2'}
    for c in range(12):
        raiz, tipo = prog[c % 4]
        notas = acorde(raiz, tipo, 4)
        seq = (notas + [notas[0] * 2, notas[1] * 2])[:6]
        ordem = [0, 2, 1, 3, 2, 4, 3, 5]
        for i, j in enumerate(ordem):
            F.add('harpa', pluck(seq[j % len(seq)], 0.9, 0.7, brilho=0.45), humano(F.t(c, i / 2), c * 8 + i, 0.008),
                  pan=-0.4 + 0.1 * i)
        F.add('pad', pad(acorde(raiz, 'maj' if tipo in ('add9', 'maj7') else 'min', 3), 4 * F.beat, 0.7, 1000), F.t(c, 0))
        if c >= 1:
            F.add('baixo', baixo(hz(graves[raiz]), 1.6 * F.beat, 0.6), F.t(c, 0))
            F.add('baixo', baixo(hz(graves[raiz]), 1.4 * F.beat, 0.45), F.t(c, 2.5))
        if c >= 6:
            for i in range(4):
                F.add('shk', shaker(0.18), humano(F.t(c, i + 0.5), i, 0.006), pan=0.4, ganho=0.35)
        if c in (4, 5, 8, 9):
            alto = {4: 'F#5', 5: 'E5', 8: 'A5', 9: 'F#5'}[c]
            F.add('mel', piano(hz(alto), 2 * F.beat, 0.6), F.t(c, 0), pan=0.2)
    F.add('harpa', pluck(hz('D4'), 2.5, 0.9, 0.5), F.t(12, 0))
    F.add('harpa', pluck(hz('A4'), 2.5, 0.7, 0.5), F.t(12, 0.25))
    F.add('harpa', pluck(hz('F#5'), 2.5, 0.6, 0.5), F.t(12, 0.5))
    return F.render(reverb={'harpa': .45, 'pad': .5, 'mel': .5})


FAIXAS = {'contagem': contagem, 'pilha': pilha, 'estante': estante, 'recado': recado, 'obrigado': obrigado,
          'paraisopolis': paraisopolis}

if __name__ == '__main__':
    nomes = sys.argv[1:] or list(FAIXAS)
    for nome in nomes:
        audio = FAIXAS[nome]()
        wavfile.write(f'bruto/{nome}.wav', SR, audio)
        print(nome, f'{len(audio) / SR:.1f}s')
