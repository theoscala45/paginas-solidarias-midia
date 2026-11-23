import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {T, impacto, k, mola, tremor, vaiVolta} from './lib';

// SEG-23/11 · Chegou doação!
// Conceito: um balão de aviso diz "Chegou doação!"; dentro dele passam, em rajada, caixas, sacolas, pilhas;
// o balão se abre e vira a moldura da foto das caixas, que depois sobe e vira o selo do resto do vídeo.
export const CHEGOU_DURACAO = 470;

const CX = 520; // centro da área segura (80..960)

// fases do balão (contêiner persistente)
const MORPH1 = [156, 186]; // balão -> cartão do contador
const MORPH2 = [262, 292]; // cartão -> selo no topo

const PALAVRAS: [number, number, string][] = [
  [64, 78, 'Caixas.'],
  [78, 90, 'Sacolas.'],
  [90, 102, 'Pilhas.'],
];

export const Chegou: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const m1 = k(f, MORPH1, [0, 1], vaiVolta);
  const m2 = k(f, MORPH2, [0, 1], vaiVolta);
  const cy = 880 + 30 * m1 + (580 - 910) * m2;
  const w = 860 + (700 - 860) * m1 + (440 - 700) * m2;
  const h = 440 + (900 - 440) * m1 + (560 - 900) * m2;
  const corFundo = COR.branco;
  const r = 60 - 20 * m1;

  // a foto aparece dentro da moldura
  const C1 = 196;
  const imp = impacto(f, C1, 0.7);
  const tr = tremor(f, C1, 5, 'che');

  const sel = (a: number, b: number) => (f >= a && f < b ? 1 : 0);

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${tr.x}px ${tr.y}px`}}>
        {/* rótulo acima do balão durante a rajada */}
        <div style={{position: 'absolute', top: 560, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [58, 68], [0, 1]) * (1 - k(f, [148, 158], [0, 1])), translate: `0px ${k(f, [58, 70], [20, 0])}px`}}>
          <T size={56} peso={800} cor={COR.oliva}>Chegaram...</T>
        </div>

        {/* o balão / cartão / selo */}
        <div style={{position: 'absolute', left: CX - w / 2, top: cy - h / 2, width: w, height: h, borderRadius: r,
          backgroundColor: corFundo, boxShadow: '0 24px 60px rgba(63,68,36,0.18)',
          scale: f < 20 ? String(k(f, [0, 16], [1.04, 1], Easing.out(Easing.cubic))) : `${imp.sx} ${imp.sy}`}}>
          {/* rabinho do balão */}
          <svg width="90" height="70" viewBox="0 0 90 70" style={{position: 'absolute', left: 110, bottom: -56, opacity: 1 - k(f, [MORPH1[0], MORPH1[0] + 8], [0, 1])}}>
            <path d="M0 0 L90 0 L10 70 Z" fill={COR.branco} />
          </svg>

          {/* 1 · Hello, Paraisópolis! */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: sel(0, 64)}}>
            <T size={150} serif cor={COR.terracota} style={{lineHeight: 1}}>Chegou</T>
            <T size={110} cor={COR.olivaEscuro} style={{marginTop: 6}}>doação!</T>
          </div>

          {/* 2 · rajada de palavras (corte seco, uma de cada vez) */}
          {PALAVRAS.map(([a, b, p]) => (
            <div key={p} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sel(a, b)}}>
              <T size={130} cor={COR.olivaEscuro}>{p}</T>
            </div>
          ))}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: f < 102 ? 0 : 1 - k(f, [MORPH1[0], MORPH1[0] + 10], [0, 1])}}>
            <T size={120} serif cor={COR.terracota}>de livros!</T>
          </div>

          {/* 3 · a foto das caixas dentro da moldura */}
          <div style={{position: 'absolute', inset: 14, borderRadius: r - 10, overflow: 'hidden', opacity: k(f, [164, 182], [0, 1], vaiVolta)}}>
            <Img src={staticFile('fotos/caixas.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 40%',
              scale: String(k(f, [170, 300], [1, 1.08], Easing.linear))}} />
          </div>
        </div>

        {/* triagem */}
        {[
          {t: 'a', top: 900, el: <T size={52} peso={700} cor={COR.oliva}>Agora começa a triagem,</T>, d: 0},
          {t: 'b', top: 970, el: <T size={96} serif cor={COR.olivaEscuro}>e cada livro ganha</T>, d: 6},
          {t: 'c', top: 1072, el: <T size={96} serif cor={COR.terracota}>um destino.</T>, d: 11},
        ].map((l) => {
          const s = mola(f, fps, 300 + l.d, 20, 160);
          return (
            <div key={l.t} style={{position: 'absolute', top: l.top, left: 80, right: 120, textAlign: 'center', opacity: s, translate: `0px ${(1 - s) * 34}px`}}>
              {l.el}
            </div>
          );
        })}

        {/* chamada */}
        <div style={{position: 'absolute', top: 1222, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [372, 386], [0, 1], vaiVolta), translate: `0px ${k(f, [372, 386], [24, 0], vaiVolta)}px`}}>
          <T size={50} peso={700} cor={COR.oliva}>Obrigado a quem doou!</T>
        </div>
        <div style={{position: 'absolute', top: 1300, left: 0, right: 40, display: 'flex', justifyContent: 'center'}}>
          {(() => {
            const s = mola(f, fps, 392, 18, 170);
            const a = impacto(f, 400, 1);
            return (
              <div style={{backgroundColor: COR.oliva, borderRadius: 999, padding: '26px 64px', opacity: s, scale: `${s * a.sx} ${s * a.sy}`}}>
                <T size={54} peso={800} cor={COR.creme}>Tem livro? Manda no Direct</T>
              </div>
            );
          })()}
        </div>
        <div style={{position: 'absolute', top: 1444, left: 80, right: 120, textAlign: 'center', opacity: k(f, [408, 420], [0, 1], vaiVolta)}}>
          <T size={44} peso={700} cor={COR.olivaEscuro}>@paginas_solidariasbr</T>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
