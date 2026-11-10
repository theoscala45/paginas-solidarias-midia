import React from 'react';
import {AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS} from './brand';
import {T, k, mola} from './lib';

// TST-R5 · A estante do obrigado
// Conceito: a câmera passeia por uma estante; em cada parada um livro é puxado e mostra um número dos 11 meses.
// O último livro, deitado no fim da prateleira, diz "obrigado", e a câmera se aproxima dele.
export const R5_DURACAO = 600;

const suaveIO = Easing.inOut(Easing.cubic);
const PRATELEIRA_Y = 1320; // topo da tábua
const MUNDO_W = 5600;

type Parada = {x: number; chega: number; sai: number; n: string; t: string; cor: string};
const PARADAS: Parada[] = [
  {x: 1000, chega: 72, sai: 132, n: '1.280', t: 'livros vendidos no Livros & Patinhas', cor: COR.terracota},
  {x: 1900, chega: 164, sai: 234, n: '4.162', t: 'livros doados à Biblioteca BECEI', cor: COR.oliva},
  {x: 2400, chega: 248, sai: 296, n: '2.465 kg', t: 'de papel reciclado com a Tramah', cor: COR.olivaEscuro},
  {x: 3400, chega: 330, sai: 400, n: 'R$ 44.450', t: 'arrecadados e 100% doados', cor: COR.terracota},
  {x: 4200, chega: 428, sai: 476, n: '38', t: 'projetos beneficiados', cor: COR.oliva},
];
const FIM_X = 5050;
const FIM_CHEGA = 506;

// câmera: x do mundo que fica no centro da tela
const camX = (f: number) => {
  const keys: [number, number][] = [[0, 540], [40, 540]];
  PARADAS.forEach((p) => keys.push([p.chega, p.x], [p.sai, p.x]));
  keys.push([FIM_CHEGA, FIM_X]);
  let i = 0;
  while (i < keys.length - 1 && f > keys[i + 1][0]) i++;
  const [f0, x0] = keys[i];
  const [f1, x1] = keys[Math.min(i + 1, keys.length - 1)];
  if (f1 === f0) return x0;
  return x0 + (x1 - x0) * suaveIO(Math.min(1, Math.max(0, (f - f0) / (f1 - f0))));
};

// lombadas comuns (determinísticas)
const CORES = [COR.oliva, COR.cremeEscuro, COR.olivaEscuro, '#8E4426', '#7A8048', '#D8C9A8', COR.terracota];
type Lombada = {x: number; w: number; h: number; cor: string; marco?: number};
const LOMBADAS: Lombada[] = (() => {
  const out: Lombada[] = [];
  let x = 60;
  let i = 0;
  while (x < FIM_X - 260) {
    const marco = PARADAS.findIndex((p) => Math.abs(p.x - (x + 40)) < 45);
    if (marco >= 0 && !out.some((l) => l.marco === marco)) {
      out.push({x: PARADAS[marco].x - 55, w: 110, h: 420, cor: PARADAS[marco].cor, marco});
      x = PARADAS[marco].x + 55 + 6;
      continue;
    }
    const w = 46 + Math.floor(random(`w${i}`) * 54);
    const h = 250 + Math.floor(random(`h${i}`) * 130);
    out.push({x, w, h, cor: CORES[Math.floor(random(`c${i}`) * CORES.length)]});
    x += w + 6;
    i++;
  }
  return out;
})();

export const R5: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cx = camX(f);
  const zoom = k(f, [FIM_CHEGA + 4, FIM_CHEGA + 34], [1, 1.55], suaveIO);
  // no fim, a tábua sobe para y≈1100 da tela, deixando espaço para o texto em cima e a chamada embaixo
  const ty = k(f, [FIM_CHEGA + 4, FIM_CHEGA + 34], [0, 1100 - PRATELEIRA_Y * 1.55], suaveIO);

  const ativa = PARADAS.findIndex((p) => f >= p.chega - 6 && f < p.sai + 14);

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      {/* mundo */}
      <div style={{position: 'absolute', left: 0, top: 0, width: MUNDO_W, height: 1920, transformOrigin: '0 0',
        transform: `translate(${540 - cx * zoom}px, ${ty}px) scale(${zoom})`}}>
        {/* parede com uma faixa sutil */}
        <div style={{position: 'absolute', left: 0, top: 860, width: MUNDO_W, height: 6, backgroundColor: COR.cremeEscuro, opacity: 1 - k(f, [FIM_CHEGA - 10, FIM_CHEGA + 6], [0, 1])}} />
        {LOMBADAS.map((l, i) => {
          let puxa = 0;
          if (l.marco !== undefined) {
            const p = PARADAS[l.marco];
            puxa = k(f, [p.chega - 4, p.chega + 14], [0, 1], Easing.out(Easing.cubic)) * (1 - k(f, [p.sai, p.sai + 16], [0, 1], suaveIO));
          }
          return (
            <div key={i} style={{position: 'absolute', left: l.x, top: PRATELEIRA_Y - l.h - 130 * puxa, width: l.w, height: l.h,
              backgroundColor: l.cor, borderRadius: 8, boxShadow: puxa > 0 ? `0 ${24 * puxa}px ${40 * puxa}px rgba(63,68,36,${0.3 * puxa})` : 'inset -6px 0 0 rgba(0,0,0,0.08)',
              scale: String(1 + 0.06 * puxa)}}>
              <div style={{position: 'absolute', left: '18%', right: '18%', top: 34, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.35)'}} />
              <div style={{position: 'absolute', left: '18%', right: '18%', bottom: 40, height: 10, borderRadius: 5, backgroundColor: 'rgba(255,255,255,0.35)'}} />
              {l.marco !== undefined && (
                <div style={{position: 'absolute', left: '50%', top: '50%', width: 60, height: 60, translate: '-30px -30px', borderRadius: 30, border: '6px solid rgba(255,255,255,0.7)'}} />
              )}
            </div>
          );
        })}
        {/* o livro deitado do fim, com "obrigado" na lombada */}
        <div style={{position: 'absolute', left: FIM_X - 230, top: PRATELEIRA_Y - 110, width: 460, height: 110, borderRadius: 12,
          backgroundColor: COR.terracota, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 0 rgba(0,0,0,0.12)'}}>
          <span style={{fontFamily: SANS, fontWeight: 900, fontSize: 54, color: COR.creme, letterSpacing: 3}}>OBRIGADO</span>
        </div>
        <div style={{position: 'absolute', left: FIM_X - 200, top: PRATELEIRA_Y - 200, width: 400, height: 90, borderRadius: 12,
          backgroundColor: COR.oliva, boxShadow: '0 6px 0 rgba(0,0,0,0.12)'}} />
        {/* tábua */}
        <div style={{position: 'absolute', left: 0, top: PRATELEIRA_Y, width: MUNDO_W, height: 34, backgroundColor: COR.olivaEscuro, borderRadius: 6}} />
        <div style={{position: 'absolute', left: 0, top: PRATELEIRA_Y + 34, width: MUNDO_W, height: 26, backgroundColor: 'rgba(63,68,36,0.12)'}} />
      </div>

      {/* título do começo: sai antes do primeiro número entrar */}
      {f < 66 && (
        <div style={{position: 'absolute', top: 440, left: 80, right: 120, textAlign: 'center',
          opacity: 1 - k(f, [44, 58], [0, 1], suaveIO), translate: `0px ${-40 * k(f, [44, 58], [0, 1], suaveIO)}px`}}>
          <T size={110}>11 meses</T>
          <T size={120} serif cor={COR.terracota}>na estante</T>
        </div>
      )}

      {/* rótulo da parada: o anterior some por completo antes do próximo aparecer */}
      {ativa >= 0 && (() => {
        const p = PARADAS[ativa];
        const entra = k(f, [p.chega + 4, p.chega + 18], [0, 1], suaveIO);
        const sai = k(f, [p.sai - 2, p.sai + 10], [0, 1], suaveIO);
        const op = entra * (1 - sai);
        if (op <= 0) return null;
        return (
          <div style={{position: 'absolute', top: 430, left: 80, right: 120, textAlign: 'center', opacity: op,
            translate: `0px ${20 * (1 - entra) - 20 * sai}px`}}>
            <T size={Math.min(150, 860 / (p.n.length * 0.66))} cor={p.cor} style={{fontVariantNumeric: 'tabular-nums'}}>{p.n}</T>
            <T size={50} peso={700} cor={COR.olivaEscuro} style={{marginTop: 10}}>{p.t}</T>
          </div>
        );
      })()}

      {/* final */}
      {f >= FIM_CHEGA + 20 && (
        <>
          <div style={{position: 'absolute', top: 400, left: 80, right: 120, textAlign: 'center'}}>
            <T size={150} serif cor={COR.terracota} style={{opacity: k(f, [FIM_CHEGA + 20, FIM_CHEGA + 36], [0, 1]),
              scale: String(0.96 + 0.04 * mola(f, fps, FIM_CHEGA + 20, 20, 120))}}>Obrigado</T>
            <T size={58} peso={700} cor={COR.olivaEscuro} style={{marginTop: 14, opacity: k(f, [FIM_CHEGA + 34, FIM_CHEGA + 48], [0, 1])}}>
              a quem doou, comprou<br />e ajudou nesses 11 meses.
            </T>
          </div>
          <div style={{position: 'absolute', top: 1210, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center',
            opacity: k(f, [FIM_CHEGA + 50, FIM_CHEGA + 62], [0, 1])}}>
            <div style={{backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 50, padding: '22px 54px', borderRadius: 999}}>
              Doe pelo Direct
            </div>
            <T size={42} peso={700} style={{marginTop: 18}}>@paginas_solidariasbr</T>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};
