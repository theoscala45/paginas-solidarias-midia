import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {TransitionSeries, linearTiming} from '@remotion/transitions';
import {slide} from '@remotion/transitions/slide';
import {fade} from '@remotion/transitions/fade';
import {COR, SANS, SERIF} from './brand';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const suave = Easing.bezier(0.16, 1, 0.3, 1);

// Cena 1: logo monta na tela
const CenaLogo: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 11, stiffness: 120}});
  const pulso = interpolate(frame, [30, 38, 46], [1, 1.12, 1], clamp);
  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, alignItems: 'center', justifyContent: 'center'}}>
      <Img
        src={staticFile('icone-verde.png')}
        style={{
          width: 470,
          scale: String(pop * pulso),
          rotate: `${interpolate(pop, [0, 1], [-12, 0])}deg`,
          marginBottom: 70,
        }}
      />
      <Img
        src={staticFile('texto-verde.png')}
        style={{
          width: 820,
          opacity: interpolate(frame, [18, 34], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [18, 40], [60, 0], {...clamp, easing: suave})}px`,
        }}
      />
    </AbsoluteFill>
  );
};

// Cena 2: número contando
const CenaNumero: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const alvo = 4162;
  const valor = Math.round(
    interpolate(frame, [8, 2.2 * fps], [0, alvo], {...clamp, easing: Easing.out(Easing.cubic)}),
  );
  const chegou = frame >= 2.2 * fps;
  const batida = interpolate(frame, [2.2 * fps, 2.2 * fps + 6, 2.2 * fps + 14], [1, 1.08, 1], clamp);
  return (
    <AbsoluteFill
      style={{backgroundColor: COR.oliva, alignItems: 'center', justifyContent: 'center', padding: 100}}
    >
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 46,
          letterSpacing: 8,
          color: COR.cremeEscuro,
          opacity: interpolate(frame, [0, 12], [0, 1], clamp),
          marginBottom: 20,
        }}
      >
        EM 11 MESES
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 900,
          fontSize: 260,
          lineHeight: 1,
          color: COR.branco,
          scale: String(batida),
          fontVariantNumeric: 'tabular-nums',
          textShadow: chegou ? `0 0 60px rgba(244,237,224,0.35)` : 'none',
        }}
      >
        {valor.toLocaleString('pt-BR')}
      </div>
      <div
        style={{
          height: 14,
          borderRadius: 7,
          backgroundColor: COR.terracota,
          marginTop: 30,
          width: interpolate(frame, [2.2 * fps, 2.2 * fps + 16], [0, 640], {...clamp, easing: suave}),
        }}
      />
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 84,
          color: COR.creme,
          textAlign: 'center',
          marginTop: 50,
          lineHeight: 1.15,
          opacity: interpolate(frame, [1.2 * fps, 1.6 * fps], [0, 1], clamp),
          translate: `0px ${interpolate(frame, [1.2 * fps, 1.8 * fps], [40, 0], {...clamp, easing: suave})}px`,
        }}
      >
        livros doados à<br />Biblioteca BECEI
      </div>
    </AbsoluteFill>
  );
};

// Cena 3: chamada para doar
const CenaChamada: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palavras = ['Doe', 'seus', 'livros.'];
  return (
    <AbsoluteFill
      style={{backgroundColor: COR.creme, alignItems: 'center', justifyContent: 'center', padding: 100}}
    >
      <div style={{display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center'}}>
        {palavras.map((p, i) => {
          const s = spring({frame: frame - i * 5, fps, config: {damping: 13}});
          return (
            <span
              key={p}
              style={{
                fontFamily: SANS,
                fontWeight: 900,
                fontSize: 150,
                color: i === 2 ? COR.terracota : COR.oliva,
                display: 'inline-block',
                scale: String(s),
                translate: `0px ${interpolate(s, [0, 1], [80, 0])}px`,
              }}
            >
              {p}
            </span>
          );
        })}
      </div>
      <div
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontWeight: 700,
          fontSize: 64,
          color: COR.olivaEscuro,
          marginTop: 40,
          opacity: interpolate(frame, [20, 32], [0, 1], clamp),
        }}
      >
        Todo livro tem um destino.
      </div>
      <div
        style={{
          marginTop: 90,
          backgroundColor: COR.oliva,
          color: COR.branco,
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 50,
          padding: '30px 60px',
          borderRadius: 999,
          scale: String(spring({frame: frame - 34, fps, config: {damping: 12}})),
        }}
      >
        Link na bio
      </div>
      <div
        style={{
          fontFamily: SANS,
          fontWeight: 700,
          fontSize: 46,
          color: COR.oliva,
          marginTop: 30,
          opacity: interpolate(frame, [42, 54], [0, 1], clamp),
        }}
      >
        @paginas_solidariasbr
      </div>
    </AbsoluteFill>
  );
};

export const TESTE_DURACAO = 75 + 105 + 105 - 2 * 12;

export const Teste: React.FC = () => (
  <TransitionSeries>
    <TransitionSeries.Sequence durationInFrames={75}>
      <CenaLogo />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={slide({direction: 'from-bottom'})} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={105}>
      <CenaNumero />
    </TransitionSeries.Sequence>
    <TransitionSeries.Transition presentation={fade()} timing={linearTiming({durationInFrames: 12})} />
    <TransitionSeries.Sequence durationInFrames={105}>
      <CenaChamada />
    </TransitionSeries.Sequence>
  </TransitionSeries>
);
