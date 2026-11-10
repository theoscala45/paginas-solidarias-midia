import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS} from './brand';
import {Reciclar, T, impacto, k, mola} from './lib';

// TST-R4 · Nada vai pro lixo
// Conceito: a pergunta "livro rasgado vai pro lixo?" é riscada; folhas caem num medidor que enche até 2.465 kg;
// o medidor vira o cartão da Tramah e a chamada final.
export const R4_DURACAO = 420;

const suaveIO = Easing.inOut(Easing.cubic);
const fmt = (n: number) => Math.round(n).toLocaleString('pt-BR');

// medidor (estado inicial) e cartão (estado final)
const G = {x: 170, y: 520, w: 280, h: 880, r: 40};
const C = {x: 120, y: 800, w: 840, h: 280, r: 40};

const FOLHAS = [
  {f: 96, x: 0.3, rot: -18}, {f: 104, x: 0.62, rot: 14}, {f: 112, x: 0.42, rot: -6},
  {f: 120, x: 0.7, rot: 22}, {f: 128, x: 0.35, rot: 9}, {f: 136, x: 0.55, rot: -15},
];

export const R4: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // abertura: some por completo antes de o medidor entrar
  const aberturaSai = k(f, [70, 84], [0, 1], suaveIO);
  const risco = k(f, [22, 36], [0, 1], Easing.out(Easing.cubic));

  // medidor
  const medEntra = mola(f, fps, 86, 20, 120);
  const nivel = k(f, [110, 230], [0, 0.9], suaveIO);
  const valor = k(f, [110, 230], [0, 2465], Easing.out(Easing.cubic));
  const pousa = impacto(f, 230, 0.7);
  const contadorSai = k(f, [272, 284], [0, 1], suaveIO);
  const morph = k(f, [287, 313], [0, 1], suaveIO);
  const box = {
    x: G.x + (C.x - G.x) * morph, y: G.y + (C.y - G.y) * morph,
    w: G.w + (C.w - G.w) * morph, h: G.h + (C.h - G.h) * morph, r: G.r + (C.r - G.r) * morph,
  };
  const preenchido = nivel + (1 - nivel) * morph;

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      {/* abertura */}
      {f < 86 && (
        <div style={{position: 'absolute', top: 440, left: 80, right: 120, textAlign: 'center', opacity: 1 - aberturaSai,
          translate: `0px ${-60 * aberturaSai}px`}}>
          <T size={110}>Livro rasgado</T>
          <div style={{display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 26}}>
            <T size={110}>vai pro</T>
            <div style={{position: 'relative'}}>
              <T size={140} serif cor={COR.terracota}>lixo?</T>
              <div style={{position: 'absolute', left: -10, top: '55%', height: 14, borderRadius: 7, backgroundColor: COR.olivaEscuro,
                width: `${(100 + 8) * risco}%`, rotate: '-4deg'}} />
            </div>
          </div>
          <T size={96} serif cor={COR.oliva} style={{marginTop: 70, opacity: k(f, [40, 52], [0, 1]), translate: `0px ${k(f, [40, 54], [24, 0])}px`}}>
            Aqui, não.
          </T>
        </div>
      )}

      {/* medidor que vira cartão */}
      {f >= 84 && (
        <div style={{position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h, borderRadius: box.r,
          border: `8px solid ${COR.oliva}`, backgroundColor: COR.cremeEscuro, overflow: 'hidden',
          opacity: Math.min(1, medEntra * 1.2), scale: String(0.92 + 0.08 * medEntra)}}>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: `${preenchido * 100}%`,
            backgroundColor: morph > 0 ? COR.oliva : COR.oliva,
            backgroundImage: `repeating-linear-gradient(0deg, rgba(244,237,224,0.18) 0 6px, transparent 6px 34px)`}} />
          {/* marcas do medidor */}
          {morph === 0 && [0.25, 0.5, 0.75].map((m) => (
            <div key={m} style={{position: 'absolute', right: 0, width: 46, height: 6, borderRadius: 3, backgroundColor: COR.olivaEscuro,
              top: `${(1 - m) * 100}%`, opacity: 0.5}} />
          ))}
          {/* conteúdo do cartão */}
          {f >= 314 && (
            <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', gap: 34, padding: '0 56px',
              opacity: k(f, [314, 328], [0, 1])}}>
              <div style={{width: 150, height: 150, borderRadius: 75, backgroundColor: COR.olivaEscuro, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>
                <Reciclar size={110} />
              </div>
              <div>
                <T size={40} peso={700} cor={COR.creme}>Reciclagem responsável</T>
                <T size={64} cor={COR.branco}>com a Tramah</T>
              </div>
            </div>
          )}
        </div>
      )}

      {/* folhas caindo dentro do medidor (somem ao tocar o nível) */}
      {f >= 96 && f < 160 &&
        FOLHAS.map((fl, i) => {
          if (f < fl.f) return null;
          const p = k(f, [fl.f, fl.f + 20], [0, 1], Easing.in(Easing.quad));
          const topoFill = G.y + G.h * (1 - Math.max(0.08, k(f, [110, 230], [0, 0.9], suaveIO)));
          const y = -160 + (topoFill - 40 + 160) * p;
          return (
            <div key={i} style={{position: 'absolute', left: G.x + G.w * fl.x - 60, top: y, width: 120, height: 150, borderRadius: 8,
              backgroundColor: COR.branco, border: `3px solid ${COR.cremeEscuro}`, rotate: `${fl.rot * (1 - p * 0.6)}deg`,
              opacity: 1 - k(f, [fl.f + 16, fl.f + 22], [0, 1]),
              backgroundImage: `repeating-linear-gradient(0deg, ${COR.cremeEscuro} 0 4px, transparent 4px 22px)`, backgroundPosition: '0 20px'}} />
          );
        })}

      {/* contador (coluna da direita, nunca encosta no medidor) */}
      {f >= 104 && f < 290 && (
        <div style={{position: 'absolute', left: 500, right: 120, top: 760, display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
          opacity: k(f, [104, 116], [0, 1]) * (1 - contadorSai)}}>
          <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 150, lineHeight: 1, color: COR.oliva, fontVariantNumeric: 'tabular-nums',
            scale: `${pousa.sx} ${pousa.sy}`, transformOrigin: '0% 100%'}}>
            {fmt(valor)}
          </div>
          <T size={110} serif cor={COR.terracota} style={{marginTop: 4}}>kg</T>
          <div style={{height: 14, borderRadius: 7, backgroundColor: COR.terracota, marginTop: 18, width: 380 * k(f, [230, 244], [0, 1], Easing.out(Easing.cubic))}} />
          <T size={50} peso={700} cor={COR.olivaEscuro} style={{marginTop: 24, opacity: k(f, [236, 250], [0, 1])}}>de papel reciclado</T>
          <T size={40} peso={500} cor={COR.olivaEscuro} style={{marginTop: 8, opacity: k(f, [242, 256], [0, 1])}}>em 11 meses</T>
        </div>
      )}

      {/* final */}
      {f >= 330 && (
        <>
          <div style={{position: 'absolute', top: 390, left: 80, right: 120, textAlign: 'center'}}>
            <T size={88} style={{opacity: k(f, [330, 344], [0, 1]), translate: `0px ${k(f, [330, 348], [30, 0], suaveIO)}px`}}>Até o livro<br />rasgado</T>
            <T size={108} serif cor={COR.terracota} style={{opacity: k(f, [338, 352], [0, 1]), translate: `0px ${k(f, [338, 356], [30, 0], suaveIO)}px`}}>tem destino.</T>
          </div>
          <div style={{position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{backgroundColor: COR.terracota, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 52, padding: '26px 58px',
              borderRadius: 999, scale: String(mola(f, fps, 352, 18, 140))}}>
              Doe pelo Direct
            </div>
            <T size={44} peso={700} style={{marginTop: 22, opacity: k(f, [362, 374], [0, 1])}}>@paginas_solidariasbr</T>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
