import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {T, impacto, k, mola, tremor, vaiVolta} from './lib';

// SEG-23/11 · Mais de 300 livros em inglês (Cultura Inglesa de Paraisópolis)
// Conceito: um balão de conversa diz "Hello, Paraisópolis!"; dentro dele passam palavras em inglês em rajada;
// o balão vira o cartão do contador +300 e depois encolhe até virar o selo que acompanha o resto do vídeo.
export const INGLES_DURACAO = 520;

const CX = 520; // centro da área segura (80..960)

// fases do balão (contêiner persistente)
const MORPH1 = [156, 186]; // balão -> cartão do contador
const MORPH2 = [262, 292]; // cartão -> selo no topo

const PALAVRAS: [number, number, string][] = [
  [64, 76, 'Friends.'],
  [76, 86, 'Stories.'],
  [86, 96, 'Adventures.'],
  [96, 108, 'Dreams.'],
];

export const Ingles: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const m1 = k(f, MORPH1, [0, 1], vaiVolta);
  const m2 = k(f, MORPH2, [0, 1], vaiVolta);
  const cy = 880 + 20 * m1 + (470 - 900) * m2;
  const w = 860 - 100 * m2;
  const h = 440 + 120 * m1 + (250 - 560) * m2;
  const corFundo = m1 < 0.5 ? COR.branco : COR.terracota;
  const r = 60 - 10 * m2;

  // contador
  const C0 = 184;
  const C1 = 224;
  const n = Math.round(300 * k(f, [C0, C1], [0, 1], Easing.out(Easing.cubic)));
  const imp = impacto(f, C1, 0.9);
  const tr = tremor(f, C1, 6, 'ing');

  const sel = (a: number, b: number) => (f >= a && f < b ? 1 : 0);

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${tr.x}px ${tr.y}px`}}>
        {/* rótulo acima do balão durante a rajada */}
        <div style={{position: 'absolute', top: 560, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [58, 68], [0, 1]) * (1 - k(f, [148, 158], [0, 1])), translate: `0px ${k(f, [58, 70], [20, 0])}px`}}>
          <T size={52} peso={800} cor={COR.oliva}>Livros em inglês sobre...</T>
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
            <T size={150} serif cor={COR.terracota} style={{lineHeight: 1}}>Hello,</T>
            <T size={86} cor={COR.olivaEscuro} style={{marginTop: 10}}>Paraisópolis!</T>
          </div>

          {/* 2 · rajada de palavras (corte seco, uma de cada vez) */}
          {PALAVRAS.map(([a, b, p]) => (
            <div key={p} style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: sel(a, b)}}>
              <T size={p.length > 9 ? 112 : 130} cor={COR.olivaEscuro}>{p}</T>
            </div>
          ))}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: f < 108 ? 0 : 1 - k(f, [MORPH1[0], MORPH1[0] + 10], [0, 1])}}>
            <T size={120} serif cor={COR.terracota}>e muito mais.</T>
          </div>

          {/* 3 · contador */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            opacity: k(f, [C0 - 8, C0], [0, 1]) * (1 - k(f, [MORPH2[0], MORPH2[0] + 8], [0, 1]))}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 250, lineHeight: 1, color: COR.creme, fontVariantNumeric: 'tabular-nums'}}>+{n}</div>
            <T size={62} peso={800} cor={COR.creme} style={{marginTop: 14}}>livros em inglês</T>
          </div>

          {/* 4 · selo */}
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26,
            opacity: k(f, [MORPH2[0] + 14, MORPH2[1]], [0, 1])}}>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 130, lineHeight: 1, color: COR.creme}}>+300</div>
            <T size={50} peso={800} cor={COR.creme} style={{lineHeight: 1.1}}>livros<br />em inglês</T>
          </div>
        </div>

        {/* destino */}
        {[
          {t: 'a caminho da', top: 650, el: <T size={52} peso={700} cor={COR.oliva}>a caminho da</T>, d: 0},
          {t: 'Cultura Inglesa', top: 720, el: <T size={104} serif cor={COR.olivaEscuro}>Cultura Inglesa</T>, d: 6},
          {t: 'de Paraisópolis', top: 830, el: <T size={104} serif cor={COR.olivaEscuro}>de Paraisópolis</T>, d: 11},
          {t: 'social', top: 960, el: <T size={46} peso={700} cor={COR.terracota}>um projeto novo e totalmente social</T>, d: 22},
        ].map((l) => {
          const s = mola(f, fps, 300 + l.d, 20, 160);
          return (
            <div key={l.t} style={{position: 'absolute', top: l.top, left: 80, right: 120, textAlign: 'center', opacity: s, translate: `0px ${(1 - s) * 34}px`}}>
              {l.el}
            </div>
          );
        })}

        {/* as caixas */}
        {(() => {
          const s = mola(f, fps, 344, 16, 120);
          const sai = k(f, [414, 428], [0, 1], vaiVolta);
          return (
            <div style={{position: 'absolute', left: CX - 175, top: 1060, width: 350, height: 430, rotate: `${-4 + 2 * s}deg`,
              opacity: Math.min(1, s * 1.4) * (1 - sai), translate: `0px ${(1 - s) * 200 + sai * 60}px`,
              borderRadius: 26, overflow: 'hidden', border: `10px solid ${COR.branco}`, boxShadow: '0 18px 40px rgba(63,68,36,0.25)'}}>
              <Img src={staticFile('fotos/caixas.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div style={{position: 'absolute', left: 16, right: 16, bottom: 16, backgroundColor: COR.olivaEscuro, borderRadius: 16, padding: '10px 14px', textAlign: 'center'}}>
                <span style={{fontFamily: SANS, fontWeight: 800, fontSize: 30, color: COR.creme}}>estas caixas vão para lá</span>
              </div>
            </div>
          );
        })()}

        {/* chamada */}
        <div style={{position: 'absolute', top: 1110, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [432, 446], [0, 1], vaiVolta), translate: `0px ${k(f, [432, 446], [24, 0], vaiVolta)}px`}}>
          <T size={50} peso={700} cor={COR.oliva}>Tem livro em inglês parado aí?</T>
        </div>
        <div style={{position: 'absolute', top: 1196, left: 0, right: 40, display: 'flex', justifyContent: 'center'}}>
          {(() => {
            const s = mola(f, fps, 450, 18, 170);
            const a = impacto(f, 458, 1);
            return (
              <div style={{backgroundColor: COR.oliva, borderRadius: 999, padding: '26px 64px', opacity: s, scale: `${s * a.sx} ${s * a.sy}`}}>
                <T size={58} peso={800} cor={COR.creme}>Manda no Direct</T>
              </div>
            );
          })()}
        </div>
        <div style={{position: 'absolute', top: 1350, left: 80, right: 120, textAlign: 'center', opacity: k(f, [466, 478], [0, 1], vaiVolta)}}>
          <T size={44} peso={700} cor={COR.olivaEscuro}>@paginas_solidariasbr</T>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
