import React from 'react';
import {AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {T, impacto, k, mola, tremor, vaiVolta} from './lib';

// SEG-16/11 · Chegaram 61 livros
// Conceito: 61 livros entram deslizando nas prateleiras, um por um, até formar o próprio número 61
// (a base do 1 fica terracota). Depois o número encolhe e vira a moldura do obrigado.
export const S46_DURACAO = 435;

const CW = 70; // largura da célula
const CH = 76; // altura da célula
const X0 = 100; // 12 colunas * 70 = 840, centrado na área segura (80..960)
const Y0 = 560;
const LINHAS = 9;

// 6 (38 livros) + 1 (23 livros) = 61 livros
const SEIS = ['.#####', '##....', '##....', '#####.', '######', '##..##', '##..##', '######', '.####.'];
const UM = ['..##.', '####.', '..##.', '..##.', '..##.', '..##.', '..##.', '..##.', '#####'];

type Livro = {
  x: number; y: number; w: number; h: number; deitado: boolean;
  de: number; chegada: number; dur: number; cor: string; lombada: string; rot0: number;
};

const montar = (): Livro[] => {
  // filas por prateleira: pares entram pela esquerda (enche da direita p/ esquerda), ímpares pela direita
  const filas: {col: number; row: number}[][] = [];
  for (let r = 0; r < LINHAS; r++) {
    const cols: number[] = [];
    for (let c = 0; c < 6; c++) if (SEIS[r][c] === '#') cols.push(c);
    for (let c = 0; c < 5; c++) if (UM[r][c] === '#') cols.push(c + 7);
    cols.sort((a, b) => (r % 2 === 0 ? b - a : a - b));
    filas.push(cols.map((col) => ({col, row: r})));
  }
  const total = filas.reduce((n, f) => n + f.length, 0);
  const ordemFilas = [0, 4, 8, 2, 6, 1, 5, 3, 7];
  const seq: {col: number; row: number}[] = [];
  while (seq.length < total) {
    for (const r of ordemFilas) {
      const c = filas[r].shift();
      if (c) seq.push(c);
    }
  }
  const livros: Livro[] = [];
  let t = 44;
  seq.forEach((c, i) => {
    const deEsq = c.row % 2 === 0;
    const x = X0 + c.col * CW + 5;
    const y = Y0 + c.row * CH + 4;
    const de = deEsq ? -120 : 1200;
    const dur = Math.min(30, Math.max(14, Math.ceil(Math.abs(x - de) / 36) + 4));
    const base = c.row === LINHAS - 1 && c.col >= 7; // a base do "1" fica terracota
    const escuro = random(`cor${i}`) > 0.55;
    livros.push({
      x, y, w: CW - 10, h: CH - 8, deitado: false, de, chegada: t, dur,
      cor: base ? COR.terracota : escuro ? COR.olivaEscuro : COR.oliva,
      lombada: base ? '#8E4426' : escuro ? '#2C3018' : '#474C27',
      rot0: (deEsq ? -1 : 1) * (6 + random(`rot${i}`) * 8),
    });
    t += Math.max(2, Math.round(12 * Math.pow(0.8, i)));
  });
  return livros;
};

const LIVROS = montar();
const ULTIMO = LIVROS[LIVROS.length - 1].chegada;

const LivroMini: React.FC<{l: Livro; f: number}> = ({l, f}) => {
  const ini = l.chegada - l.dur;
  if (f < ini) return null;
  const p = k(f, [ini, l.chegada], [0, 1], Easing.out(Easing.quad));
  const x = l.de + (l.x - l.de) * p;
  const rot = l.rot0 * (1 - p);
  const imp = impacto(f, l.chegada, l.deitado ? 0.5 : 0.7);
  return (
    <div
      style={{
        position: 'absolute', left: x, top: l.y, width: l.w, height: l.h,
        rotate: `${rot}deg`, scale: `${imp.sx} ${imp.sy}`, transformOrigin: '50% 100%',
        backgroundColor: l.cor, borderRadius: 6, overflow: 'hidden',
        boxShadow: '0 4px 0 #00000018',
      }}
    >
      {l.deitado ? (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, backgroundColor: l.lombada}} />
          <div style={{position: 'absolute', left: 24, right: 18, top: 15, height: 7, borderRadius: 4, backgroundColor: COR.creme, opacity: 0.8}} />
        </>
      ) : (
        <>
          <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 11, backgroundColor: l.lombada}} />
          <div style={{position: 'absolute', left: 20, right: 10, top: 16, height: 7, borderRadius: 4, backgroundColor: COR.creme, opacity: 0.85}} />
          <div style={{position: 'absolute', left: 20, right: 20, top: 30, height: 5, borderRadius: 3, backgroundColor: COR.creme, opacity: 0.55}} />
        </>
      )}
    </div>
  );
};

export const S46: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const chegaram = LIVROS.filter((l) => f >= l.chegada).length;

  // câmera: leve aproximação durante o enchimento, tremor no último pouso, parada na pausa
  const cam = k(f, [40, ULTIMO], [1, 1.035], Easing.inOut(Easing.quad));
  const tr = tremor(f, ULTIMO, 7, 's46');

  // saídas (título e contador) antes de o número se mover
  const SAI = 240;
  const saiT = k(f, [SAI, SAI + 12], [0, 1], vaiVolta);
  // reorganização: o número encolhe e sobe (centro 908 -> 680)
  const MOVE = 254;
  const mv = k(f, [MOVE, MOVE + 30], [0, 1], vaiVolta);
  const escala = 1 - 0.4 * mv;
  const dy = -222 * mv;

  // obrigado + chamada
  const OBR = 288;
    const PERG = 316;
  const BOTAO = 334;
  const aperto = impacto(f, BOTAO + 8, 1.1);
  const ARROBA = 350;

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      <AbsoluteFill style={{scale: String(cam), translate: `${tr.x}px ${tr.y}px`}}>
        {/* título */}
        <div style={{position: 'absolute', top: 432, left: 80, right: 120, textAlign: 'center',
          opacity: 1 - saiT, translate: `0px ${-40 * saiT}px`,
          scale: String(k(f, [0, 14], [1.05, 1], Easing.out(Easing.cubic)))}}>
          <T size={84}>Neste domingo</T>
        </div>

        {/* número feito de livros */}
        <div style={{position: 'absolute', inset: 0, transformOrigin: '520px 902px', scale: String(escala), translate: `0px ${dy}px`}}>
          {LIVROS.map((l, i) => (
            <div key={`g${i}`} style={{position: 'absolute', left: l.x, top: l.y, width: l.w, height: l.h,
              borderRadius: 6, backgroundColor: COR.cremeEscuro, opacity: f >= l.chegada ? 0 : 1}} />
          ))}
          {LIVROS.map((l, i) => <LivroMini key={i} l={l} f={f} />)}
        </div>

        {/* contador */}
        <div style={{position: 'absolute', top: 1296, left: 80, right: 120, display: 'flex', justifyContent: 'center',
          alignItems: 'baseline', gap: 22,
          opacity: k(f, [LIVROS[0].chegada - 2, LIVROS[0].chegada + 8], [0, 1]) * (1 - saiT),
          translate: `0px ${30 * saiT}px`}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, color: COR.terracota, lineHeight: 1,
            minWidth: 170, textAlign: 'right', fontVariantNumeric: 'tabular-nums',
            scale: String(f >= ULTIMO ? 1 + 0.12 * Math.exp(-(f - ULTIMO) / 5) * Math.cos((f - ULTIMO) * 0.7) : 1)}}>
            {chegaram}
          </div>
          <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 56, color: COR.oliva}}>{chegaram === 1 ? 'livro chegou' : 'livros chegaram'}</div>
        </div>

        {/* obrigado (duas linhas) */}
        {[['Obrigado'], ['a', 'quem', 'doou.']].map((linha, li) => (
          <div key={li} style={{position: 'absolute', top: 940 + li * 120, left: 80, right: 120, display: 'flex', justifyContent: 'center', gap: 24}}>
            {linha.map((p, i) => {
              const idx = li === 0 ? 0 : i + 1;
              const s = mola(f, fps, OBR + idx * 5, 20, 160);
              return (
                <div key={p} style={{fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: li === 0 ? 112 : 92,
                  lineHeight: 1, color: p === 'doou.' ? COR.terracota : COR.olivaEscuro, opacity: s, translate: `0px ${(1 - s) * 40}px`}}>
                  {p}
                </div>
              );
            })}
          </div>
        ))}

        {/* chamada */}
        <div style={{position: 'absolute', top: 1196, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [PERG, PERG + 14], [0, 1], vaiVolta), translate: `0px ${k(f, [PERG, PERG + 14], [24, 0], vaiVolta)}px`}}>
          <T size={50} peso={700} cor={COR.oliva}>Tem livro sobrando em casa?</T>
        </div>
        <div style={{position: 'absolute', top: 1272, left: 0, right: 40, display: 'flex', justifyContent: 'center'}}>
          <div style={{backgroundColor: COR.oliva, borderRadius: 999, padding: '26px 64px',
            opacity: mola(f, fps, BOTAO, 18, 170), scale: `${mola(f, fps, BOTAO, 18, 170) * aperto.sx} ${mola(f, fps, BOTAO, 18, 170) * aperto.sy}`}}>
            <T size={58} peso={800} cor={COR.creme}>Manda no Direct</T>
          </div>
        </div>
        <div style={{position: 'absolute', top: 1416, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [ARROBA, ARROBA + 12], [0, 1], vaiVolta)}}>
          <T size={44} peso={700} cor={COR.olivaEscuro}>@paginas_solidariasbr</T>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const S46_TEMPOS = {chegadas: LIVROS.map((l) => l.chegada), ultimo: ULTIMO};
