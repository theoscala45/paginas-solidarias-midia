import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS} from './brand';
import {Icone, T, encaixe, impacto, k, mola, tremor} from './lib';

// TST-R2 · 11 meses em números
// Conceito: um único número nunca sai de cena; ele rola de um valor para o próximo.
// Depois, uma rajada de três cortes vira a lista final, que fica parada para leitura.
export const R2_DURACAO = 405;

const fmt = (n: number) => Math.round(n).toLocaleString('pt-BR');

const Troca: React.FC<{f: number; itens: {de: number; texto: React.ReactNode}[]; altura: number}> = ({f, itens, altura}) => (
  <div style={{position: 'relative', height: altura, overflow: 'hidden', width: '100%'}}>
    {itens.map((it, i) => {
      const prox = itens[i + 1]?.de ?? 1e6;
      if (f < it.de - 14 || f > prox + 14) return null;
      const y = k(f, [it.de - 12, it.de], [altura, 0], encaixe) + k(f, [prox - 2, prox + 10], [0, -altura], Easing.in(Easing.cubic));
      return (
        <div key={i} style={{position: 'absolute', inset: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', translate: `0px ${y}px`}}>
          {it.texto}
        </div>
      );
    })}
  </div>
);

const HITS = [
  {f: 170, n: '38', u: 'projetos', fundo: COR.creme, cor: COR.oliva},
  {f: 182, n: '4.162', u: 'livros', fundo: COR.terracota, cor: COR.creme},
  {f: 194, n: '2.465', u: 'kg', fundo: COR.olivaEscuro, cor: COR.creme},
];

const LINHAS = [
  {n: '38', t: 'projetos beneficiados'},
  {n: '4.162', t: 'livros doados à Biblioteca BECEI'},
  {n: '2.465 kg', t: 'de papel reciclado'},
];

export const R2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // valor do contador
  const valor =
    f < 40 ? 11 : f < 100 ? k(f, [40, 70], [11, 1280], Easing.out(Easing.cubic)) : k(f, [100, 132], [1280, 44450], Easing.out(Easing.cubic));
  const txt = fmt(valor);
  const tam = Math.min(330, 900 / (txt.length * 0.66));
  const imp = f >= 132 ? impacto(f, 132, 0.8) : f >= 70 ? impacto(f, 70, 0.8) : impacto(f, 10, 0.6);
  const sublinha = f < 100 ? k(f, [70, 84], [0, 1], encaixe) : k(f, [132, 146], [0, 1], encaixe);
  const rs = k(f, [100, 112], [0, 1], encaixe);
  const carimbo = mola(f, fps, 140, 8, 220);
  const tr = tremor(f, 141, 14, 'r2');

  const fase1 = f < 170;
  const rajada = f >= 170 && f < 206;
  const lista = f >= 206;

  // a rajada vira a lista
  const vira = k(f, [206, 226], [0, 1], Easing.out(Easing.cubic));

  // a lista se recolhe no agradecimento
  const recolhe = k(f, [292, 310], [0, 1], Easing.in(Easing.cubic));

  return (
    <AbsoluteFill style={{backgroundColor: COR.oliva, overflow: 'hidden', translate: `${tr.x}px ${tr.y}px`}}>
      {fase1 && (
        <>
          <div style={{position: 'absolute', top: 430, left: 80, right: 120, textAlign: 'center', opacity: k(f, [36, 46], [1, 0])}}>
            <T size={58} peso={800} cor={COR.cremeEscuro} style={{letterSpacing: 1}}>
              O QUE LIVRO USADO<br />FEZ EM
            </T>
          </div>
          <div style={{position: 'absolute', top: 560, left: 80, right: 120, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{height: 110, display: 'flex', alignItems: 'flex-end', opacity: rs, translate: `${(1 - rs) * -200}px 0px`}}>
              <T size={96} cor={COR.creme}>R$</T>
            </div>
            <div style={{fontFamily: SANS, fontWeight: 900, fontSize: tam, lineHeight: 1, color: COR.branco, fontVariantNumeric: 'tabular-nums',
              scale: `${imp.sx} ${imp.sy}`, transformOrigin: '50% 100%', textShadow: '0 0 70px rgba(244,237,224,0.25)'}}>
              {txt}
            </div>
            <div style={{height: 16, borderRadius: 8, backgroundColor: COR.terracota, marginTop: 26, width: 620 * sublinha}} />
            <div style={{marginTop: 30, width: '100%'}}>
              <Troca f={f} altura={130} itens={[
                {de: 0, texto: <T size={112} serif cor={COR.creme}>meses</T>},
                {de: 46, texto: <T size={96} serif cor={COR.creme}>livros vendidos</T>},
                {de: 104, texto: <T size={104} serif cor={COR.creme}>arrecadados</T>},
              ]} />
            </div>
            <T size={50} peso={700} cor={COR.cremeEscuro} style={{marginTop: 14, opacity: k(f, [56, 66], [0, 1]) * k(f, [98, 104], [1, 0])}}>
              no Livros & Patinhas
            </T>
          </div>
          {f >= 140 && (
            <div style={{position: 'absolute', top: 1260, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
              <div style={{backgroundColor: COR.terracota, color: COR.branco, fontFamily: SANS, fontWeight: 900, fontSize: 84, padding: '22px 54px',
                borderRadius: 24, rotate: `${-4 * carimbo}deg`, scale: String(k(carimbo, [0, 1], [2.2, 1], (t) => t))}}>
                100% doados
              </div>
            </div>
          )}
        </>
      )}

      {rajada &&
        HITS.map((h, i) =>
          f >= h.f && f < (HITS[i + 1]?.f ?? 206) ? (
            <AbsoluteFill key={h.n} style={{backgroundColor: h.fundo, alignItems: 'center', justifyContent: 'center'}}>
              <div style={{textAlign: 'center', scale: String(k(f, [h.f, h.f + 5], [1.25, 1], encaixe))}}>
                <T size={300} cor={h.cor}>{h.n}</T>
                <T size={120} serif cor={i === 0 ? COR.terracota : COR.creme}>{h.u}</T>
              </div>
            </AbsoluteFill>
          ) : null,
        )}

      {lista && (
        <>
          <div style={{position: 'absolute', top: 360, left: 80, right: 120, textAlign: 'center', opacity: k(f, [214, 226], [0, 1]) * (1 - recolhe)}}>
            <T size={56} peso={800} cor={COR.cremeEscuro}>R$ 44.450 doados e também</T>
          </div>
          {LINHAS.map((l, i) => {
            const y0 = 960 + (i - 1) * 60; // de onde vem (centro, como na rajada)
            const y1 = 560 + i * 250;
            const y = y0 + (y1 - y0) * vira;
            const s = 1 + (0.42 - 1) * vira;
            const yFinal = y + (900 - y) * recolhe;
            return (
              <div key={l.n} style={{position: 'absolute', left: 80, right: 120, top: yFinal - 110, height: 220, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                opacity: 1 - recolhe, scale: String(1 - 0.6 * recolhe)}}>
                <T size={300 * s + 0 * vira} cor={i === 1 ? COR.terracota : COR.branco} style={{fontSize: 300 * (1 - vira) + 128 * vira}}>{l.n}</T>
                <T size={46} peso={700} cor={COR.creme} style={{opacity: k(f, [222, 232], [0, 1]), marginTop: 6}}>{l.t}</T>
              </div>
            );
          })}
        </>
      )}

      {f >= 300 && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div style={{position: 'absolute', top: 520, textAlign: 'center', left: 80, right: 120}}>
            <T size={80} peso={800} cor={COR.creme} style={{scale: String(mola(f, fps, 302, 14))}}>Obrigado a</T>
            <T size={120} serif cor={COR.branco} style={{scale: String(mola(f, fps, 308, 14))}}>quem doou.</T>
          </div>
          <div style={{position: 'absolute', top: 960, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: k(f, [330, 342], [0, 1]), translate: `0px ${k(f, [330, 346], [40, 0])}px`}}>
            <T size={60} peso={800} cor={COR.creme}>Tem livro parado?</T>
            <div style={{marginTop: 26, backgroundColor: COR.creme, color: COR.oliva, fontFamily: SANS, fontWeight: 800, fontSize: 50, padding: '24px 54px', borderRadius: 999}}>
              Doe pelo Direct
            </div>
          </div>
          <div style={{position: 'absolute', top: 1230, opacity: k(f, [344, 356], [0, 1])}}>
            <Icone w={150} branco />
          </div>
          <T size={36} peso={500} cor={COR.cremeEscuro} style={{position: 'absolute', top: 1430, opacity: k(f, [350, 362], [0, 1])}}>
            Dados de dez/2025 a 9/11/2026
          </T>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
