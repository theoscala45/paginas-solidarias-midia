import React from 'react';
import {Easing, Img, interpolate, random, spring, staticFile} from 'remotion';
import {COR, SANS, SERIF} from './brand';

export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const suave = Easing.bezier(0.16, 1, 0.3, 1);
export const encaixe = Easing.out(Easing.exp);
export const vaiVolta = Easing.inOut(Easing.cubic);

/** Interpolação com clamp e easing opcional. */
export const k = (
  f: number,
  input: number[],
  output: number[],
  easing: (t: number) => number = suave,
) => interpolate(f, input, output, {...clamp, easing});

/** Achatamento no pouso: retorna escalas X e Y a partir do quadro do impacto. */
export const impacto = (f: number, tHit: number, forca = 1) => {
  if (f < tHit) return {sx: 1, sy: 1};
  const d = f - tHit;
  const amort = Math.exp(-d / 5);
  const osc = Math.cos(d * 0.9);
  return {sx: 1 + 0.09 * forca * amort * osc, sy: 1 - 0.11 * forca * amort * osc};
};

/** Tremor determinístico que começa no quadro do impacto. */
export const tremor = (f: number, tHit: number, amp = 10, seed = 't') => {
  if (f < tHit) return {x: 0, y: 0};
  const d = f - tHit;
  const a = amp * Math.exp(-d / 4);
  return {
    x: (random(`${seed}x${d}`) - 0.5) * 2 * a,
    y: (random(`${seed}y${d}`) - 0.5) * 2 * a,
  };
};

/** Mola padronizada a partir de um quadro. */
export const mola = (f: number, fps: number, inicio: number, damping = 12, stiffness = 140) =>
  spring({frame: f - inicio, fps, config: {damping, stiffness}});

/** Livro fechado, de frente, desenhado em SVG. */
export const Livro: React.FC<{
  w?: number;
  capa?: string;
  lombada?: string;
  detalhe?: string;
  style?: React.CSSProperties;
}> = ({w = 220, capa = COR.terracota, lombada = '#8E4426', detalhe = COR.creme, style}) => {
  const h = w * 1.32;
  return (
    <svg width={w} height={h} viewBox="0 0 200 264" style={{overflow: 'visible', ...style}}>
      <rect x="10" y="10" width="186" height="250" rx="10" fill="#00000022" />
      <rect x="0" y="0" width="186" height="250" rx="10" fill={capa} />
      <rect x="0" y="0" width="30" height="250" rx="8" fill={lombada} />
      <rect x="180" y="6" width="10" height="238" rx="3" fill={COR.creme} />
      <rect x="54" y="62" width="104" height="14" rx="7" fill={detalhe} opacity="0.9" />
      <rect x="54" y="90" width="72" height="10" rx="5" fill={detalhe} opacity="0.6" />
      <path
        d="M106 188 c-14 -10 -26 -18 -26 -30 a12 12 0 0 1 26 -6 a12 12 0 0 1 26 6 c0 12 -12 20 -26 30z"
        fill={detalhe}
        opacity="0.85"
      />
    </svg>
  );
};

/** Metade de um livro (para o rasgo da reciclagem). */
export const MetadeLivro: React.FC<{w?: number; lado: 'esq' | 'dir'; capa?: string}> = ({
  w = 220,
  lado,
  capa = COR.olivaEscuro,
}) => (
  <div
    style={{
      width: w,
      height: w * 1.32,
      clipPath:
        lado === 'esq'
          ? 'polygon(0 0, 52% 0, 46% 18%, 55% 34%, 44% 52%, 54% 70%, 45% 86%, 50% 100%, 0 100%)'
          : 'polygon(52% 0, 100% 0, 100% 100%, 50% 100%, 45% 86%, 54% 70%, 44% 52%, 55% 34%, 46% 18%)',
    }}
  >
    <Livro w={w} capa={capa} lombada="#2C3018" />
  </div>
);

export const Pata: React.FC<{size?: number; cor?: string}> = ({size = 90, cor = COR.creme}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <ellipse cx="50" cy="66" rx="22" ry="19" fill={cor} />
    <ellipse cx="24" cy="42" rx="9" ry="12" fill={cor} />
    <ellipse cx="40" cy="26" rx="9" ry="12" fill={cor} />
    <ellipse cx="60" cy="26" rx="9" ry="12" fill={cor} />
    <ellipse cx="76" cy="42" rx="9" ry="12" fill={cor} />
  </svg>
);

export const Biblioteca: React.FC<{size?: number; cor?: string}> = ({size = 90, cor = COR.creme}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M10 36 L50 12 L90 36 Z" fill={cor} />
    <rect x="16" y="40" width="68" height="6" fill={cor} />
    {[22, 40, 58, 76].map((x) => (
      <rect key={x} x={x - 4} y="50" width="9" height="30" fill={cor} />
    ))}
    <rect x="10" y="82" width="80" height="8" fill={cor} />
  </svg>
);

export const Reciclar: React.FC<{size?: number; cor?: string}> = ({size = 90, cor = COR.creme}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" fill="none" stroke={cor} strokeWidth="9" strokeLinecap="round">
    <path d="M30 30 A28 28 0 0 1 76 40" />
    <path d="M78 58 A28 28 0 0 1 40 80" />
    <path d="M24 70 A28 28 0 0 1 26 38" />
    <path d="M66 30 L78 40 L84 26" />
    <path d="M52 86 L38 80 L44 66" />
    <path d="M14 46 L26 36 L36 48" />
  </svg>
);

export const AviaoPapel: React.FC<{size?: number; cor?: string}> = ({size = 80, cor = COR.branco}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <path d="M8 46 L92 10 L66 90 L48 60 Z" fill={cor} />
    <path d="M48 60 L92 10 L40 52 Z" fill="#00000030" />
  </svg>
);

/** Logo (ícone e nome separados). */
export const Icone: React.FC<{w: number; branco?: boolean; style?: React.CSSProperties}> = ({w, branco, style}) => (
  <Img
    src={staticFile(branco ? 'icone-branco.png' : 'icone-verde.png')}
    style={{width: w, ...style}}
  />
);

export const Nome: React.FC<{w: number; branco?: boolean; style?: React.CSSProperties}> = ({w, branco, style}) => (
  <Img
    src={staticFile(branco ? 'texto-branco.png' : 'texto-verde.png')}
    style={{width: w, ...style}}
  />
);

export const T: React.FC<{
  size: number;
  cor?: string;
  peso?: number;
  serif?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({size, cor = COR.oliva, peso = 900, serif, style, children}) => (
  <div
    style={{
      fontFamily: serif ? SERIF : SANS,
      fontStyle: serif ? 'italic' : 'normal',
      fontWeight: serif ? 700 : peso,
      fontSize: size,
      color: cor,
      lineHeight: 1.08,
      ...style,
    }}
  >
    {children}
  </div>
);
