import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {AviaoPapel, Icone, T, encaixe, impacto, k, mola, tremor} from './lib';

// TST-R3 · Tem livro parado aí?
// Conceito: a palavra "parado" vira a lombada do primeiro livro de uma pilha; os tipos de livro caem em rajada
// sobre ela, e a pilha inteira se transforma no balão da mensagem do Direct.
export const R3_DURACAO = 330;

const BASE = 1440; // chão da pilha
const ALT = 110;
const PILHA = [
  {txt: 'parado', f: 14, w: 700, cor: COR.terracota, tc: COR.creme, serif: true, dx: 0, rot: 0},
  {txt: 'Romance', f: 50, w: 620, cor: COR.oliva, tc: COR.creme, dx: -30, rot: -1.5},
  {txt: 'Didático', f: 62, w: 700, cor: COR.olivaEscuro, tc: COR.creme, dx: 24, rot: 1.2},
  {txt: 'Infantil', f: 71, w: 580, cor: COR.cremeEscuro, tc: COR.oliva, dx: -12, rot: -0.8},
  {txt: 'Rabiscado', f: 78, w: 740, cor: COR.terracota, tc: COR.creme, dx: 18, rot: 1.6},
  {txt: 'Rasgado', f: 84, w: 640, cor: COR.oliva, tc: COR.creme, dx: -20, rot: -1.2},
];

const MSG = 'Oi! Tenho livros para doar.';

export const R3: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // abertura
  const sai = k(f, [46, 58], [0, -900], Easing.in(Easing.cubic));
  const capa = k(f, [8, 14], [0, 1], encaixe); // a lombada cresce atrás de "parado"
  const queda0 = k(f, [14, 28], [0, 1], Easing.in(Easing.quad));
  const pousos = PILHA.map((p, i) => p.f + (i === 0 ? 14 : 10));
  const ultimoPouso = [...pousos].reverse().find((t) => f >= t) ?? -1;
  const tr = ultimoPouso >= 0 ? tremor(f, ultimoPouso, ultimoPouso === pousos[0] ? 14 : 7, `r3${ultimoPouso}`) : {x: 0, y: 0};

  // pilha -> balão
  const MORPH = 152;
  const m = k(f, [MORPH, MORPH + 22], [0, 1], Easing.inOut(Easing.cubic));
  const topoPilha = BASE - PILHA.length * ALT;
  const A = {x: 150, y: topoPilha - 10, w: 780, h: PILHA.length * ALT + 20, r: 18};
  const B = {x: 120, y: 820, w: 840, h: 300, r: 60};
  const box = {
    x: A.x + (B.x - A.x) * m, y: A.y + (B.y - A.y) * m,
    w: A.w + (B.w - A.w) * m, h: A.h + (B.h - A.h) * m, r: A.r + (B.r - A.r) * m,
  };
  const digitado = Math.max(0, Math.min(MSG.length, Math.floor((f - 182) * 1.1)));
  const ENVIA = 232;
  const aperto = f >= ENVIA ? impacto(f, ENVIA, 1.3) : {sx: 1, sy: 1};
  const voa = k(f, [ENVIA + 6, ENVIA + 22], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${tr.x}px ${tr.y}px`}}>
        {/* "Tem livro" e "aí?" */}
        <div style={{position: 'absolute', top: 470, left: 80, right: 120, textAlign: 'center', translate: `0px ${sai}px`}}>
          <T size={140} style={{scale: String(1 + 0.04 * Math.sin(Math.min(1, f / 10) * Math.PI))}}>Tem livro</T>
        </div>
        <div style={{position: 'absolute', top: 1000 - 0, left: 80, right: 120, textAlign: 'center',
          translate: `0px ${k(f, [18, 32], [0, -390], Easing.out(Easing.back(1.6))) + sai * 0.9}px`}}>
          <T size={140}>aí?</T>
        </div>

        {/* pilha de livros (some dentro do balão) */}
        {f < MORPH + 22 &&
          PILHA.map((p, i) => {
            if (i > 0 && f < p.f) return null;
            const yFinal = BASE - (i + 1) * ALT;
            let y: number, xs = 1, ys = 1;
            if (i === 0) {
              const yIni = 740; // "parado" começa no meio da frase
              y = yIni + (yFinal - yIni) * queda0;
            } else {
              y = k(f, [p.f, p.f + 10], [-200, yFinal], Easing.in(Easing.quad));
            }
            const imp = impacto(f, pousos[i], i === 0 ? 1.2 : 0.8);
            xs = imp.sx; ys = imp.sy;
            const fundo = i === 0 ? capa : 1;
            return (
              <div key={p.txt} style={{position: 'absolute', left: 540 - p.w / 2 + p.dx, top: y, width: p.w, height: ALT - 8,
                rotate: `${p.rot * (f >= pousos[i] ? 1 : 0.3)}deg`, scale: `${xs} ${ys}`, transformOrigin: '50% 100%',
                opacity: 1 - k(f, [MORPH + 4, MORPH + 16], [0, 1])}}>
                <div style={{position: 'absolute', inset: 0, borderRadius: 14, backgroundColor: p.cor, scale: `${fundo} 1`,
                  boxShadow: '0 6px 0 rgba(0,0,0,0.12)'}} />
                <div style={{position: 'absolute', left: 22, top: 18, bottom: 18, width: 10, borderRadius: 5, backgroundColor: '#00000026', opacity: fundo}} />
                <div style={{position: 'absolute', right: 22, top: 18, bottom: 18, width: 10, borderRadius: 5, backgroundColor: '#00000026', opacity: fundo}} />
                <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: p.serif ? SERIF : SANS, fontStyle: p.serif ? 'italic' : 'normal', fontWeight: p.serif ? 700 : 900,
                  fontSize: i === 0 ? k(f, [8, 14], [170, 84]) : 66, color: i === 0 ? (capa > 0.5 ? p.tc : COR.terracota) : p.tc}}>
                  {p.txt}
                </div>
              </div>
            );
          })}

        {/* "Todos servem." */}
        {f >= 96 && (
          <div style={{position: 'absolute', top: 400, left: 80, right: 120, textAlign: 'center',
            opacity: 1 - k(f, [MORPH, MORPH + 10], [0, 1])}}>
            <T size={150} serif cor={COR.terracota} style={{scale: String(mola(f, fps, 96, 10, 180))}}>Todos</T>
            <T size={120} style={{scale: String(mola(f, fps, 103, 12))}}>servem.</T>
          </div>
        )}

        {/* balão do Direct */}
        {f >= MORPH && f < ENVIA + 24 && (
          <div style={{position: 'absolute', left: box.x, top: box.y - 700 * voa, width: box.w, height: box.h, borderRadius: box.r,
            backgroundColor: m > 0.5 ? COR.branco : 'transparent', border: `6px solid ${COR.oliva}`,
            scale: String(1 - 0.7 * voa), opacity: 1 - voa,
            boxShadow: m > 0.5 ? '0 24px 60px rgba(63,68,36,0.18)' : 'none'}}>
            {m >= 1 && (
              <div style={{position: 'absolute', inset: 0, padding: '0 56px', display: 'flex', alignItems: 'center'}}>
                <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 64, color: COR.olivaEscuro, lineHeight: 1.2}}>
                  {MSG.slice(0, digitado)}
                  <span style={{opacity: digitado < MSG.length || Math.floor(f / 8) % 2 === 0 ? 1 : 0, color: COR.terracota}}>|</span>
                </span>
              </div>
            )}
          </div>
        )}
        {f >= MORPH + 20 && f < ENVIA + 24 && (
          <>
            <div style={{position: 'absolute', top: 470, left: 80, right: 120, textAlign: 'center', opacity: k(f, [MORPH + 20, MORPH + 30], [0, 1]) * (1 - voa)}}>
              <T size={100}>É só mandar</T>
              <T size={110} serif cor={COR.terracota}>uma mensagem.</T>
            </div>
            <div style={{position: 'absolute', left: 540 - 85, top: 1180, width: 170, height: 170, borderRadius: 85, backgroundColor: COR.terracota,
              display: 'flex', alignItems: 'center', justifyContent: 'center', scale: `${mola(f, fps, MORPH + 26, 11) * aperto.sx} ${mola(f, fps, MORPH + 26, 11) * aperto.sy}`,
              opacity: 1 - voa}}>
              <AviaoPapel size={90} />
            </div>
          </>
        )}

        {/* final */}
        {f >= ENVIA + 16 && (
          <AbsoluteFill style={{alignItems: 'center'}}>
            <div style={{position: 'absolute', top: 470, left: 80, right: 120, textAlign: 'center'}}>
              <T size={120} style={{scale: String(mola(f, fps, ENVIA + 18, 12))}}>Manda no</T>
              <T size={160} serif cor={COR.terracota} style={{scale: String(mola(f, fps, ENVIA + 24, 10, 170))}}>Direct</T>
            </div>
            <div style={{position: 'absolute', top: 920, backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 52,
              padding: '26px 56px', borderRadius: 999, scale: String(mola(f, fps, ENVIA + 34, 12))}}>
              @paginas_solidariasbr
            </div>
            <T size={46} peso={700} cor={COR.olivaEscuro} style={{position: 'absolute', top: 1080, opacity: k(f, [ENVIA + 42, ENVIA + 52], [0, 1])}}>
              ou pelo site · link na bio
            </T>
            <div style={{position: 'absolute', top: 1220, opacity: k(f, [ENVIA + 48, ENVIA + 58], [0, 1])}}>
              <Icone w={170} />
            </div>
          </AbsoluteFill>
        )}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
