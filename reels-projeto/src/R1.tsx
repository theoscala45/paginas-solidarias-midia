import React from 'react';
import {AbsoluteFill, Easing, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS} from './brand';
import {
  Biblioteca, Icone, Livro, MetadeLivro, Pata, Reciclar, T,
  encaixe, impacto, k, mola, suave, tremor, vaiVolta,
} from './lib';

// TST-R1 · Um livro, três destinos
// Conceito: um único livro atravessa o vídeo, passa pela triagem e se divide nos três destinos;
// no fim, os três se reúnem e viram o ícone da marca.
export const R1_DURACAO = 450;

type Key = {f: number; x: number; y: number; z: number; ease?: (t: number) => number};
const KEYS: Key[] = [
  {f: 0, x: 540, y: 900, z: 1},
  {f: 96, x: 540, y: 900, z: 1},
  {f: 116, x: 230, y: 900, z: 1.7, ease: Easing.inOut(Easing.sin)},
  {f: 166, x: 230, y: 900, z: 1.7},
  {f: 182, x: 540, y: 900, z: 1.7, ease: Easing.inOut(Easing.exp)},
  {f: 240, x: 540, y: 900, z: 1.7},
  {f: 258, x: 850, y: 900, z: 1.7, ease: Easing.inOut(Easing.sin)},
  {f: 300, x: 850, y: 900, z: 1.7},
  {f: 320, x: 540, y: 960, z: 1, ease: vaiVolta},
];

const camera = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 1 && f > KEYS[i + 1].f) i++;
  const a = KEYS[i];
  const b = KEYS[Math.min(i + 1, KEYS.length - 1)];
  if (a === b || f <= a.f) return a;
  const t = (b.ease ?? suave)(Math.min(1, (f - a.f) / (b.f - a.f)));
  return {
    x: a.x + (b.x - a.x) * t,
    y: a.y + (b.y - a.y) * t,
    z: Math.exp(Math.log(a.z) + (Math.log(b.z) - Math.log(a.z)) * t),
  };
};

const FOCO_Y = 860;
const XS = [230, 540, 850];
const CORES = [COR.terracota, COR.oliva, COR.olivaEscuro];
const LOMBADAS = ['#8E4426', '#454A27', '#2C3018'];

const Legenda: React.FC<{
  f: number; entra: number; sai: number; saiTipo: 'slide' | 'corte' | 'queda';
  icone: React.ReactNode; titulo: string; sub: string; texto: string;
}> = ({f, entra, sai, saiTipo, icone, titulo, sub, texto}) => {
  const {fps} = useVideoConfig();
  if (f < entra || f >= sai + 12) return null;
  if (saiTipo === 'corte' && f >= sai) return null;
  const s = mola(f, fps, entra, 13);
  const saida =
    saiTipo === 'slide'
      ? {translate: `${k(f, [sai, sai + 10], [0, -1100], Easing.in(Easing.cubic))}px 0px`}
      : saiTipo === 'queda'
        ? {translate: `0px ${k(f, [sai, sai + 12], [0, 500], Easing.in(Easing.cubic))}px`, opacity: k(f, [sai, sai + 12], [1, 0])}
        : {};
  return (
    <div style={{position: 'absolute', top: 1190, left: 80, right: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', ...saida}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 26, scale: String(s)}}>
        {icone}
        <T size={108}>{titulo}</T>
      </div>
      <T size={54} peso={700} cor={COR.olivaEscuro} style={{marginTop: 14, opacity: k(f, [entra + 6, entra + 14], [0, 1]), textAlign: 'center'}}>
        {sub}
      </T>
      <T size={46} serif cor={COR.olivaEscuro} style={{marginTop: 18, textAlign: 'center', opacity: k(f, [entra + 14, entra + 24], [0, 1]), translate: `0px ${k(f, [entra + 14, entra + 26], [24, 0])}px`}}>
        {texto}
      </T>
    </div>
  );
};

const Bolinha: React.FC<{cor: string; children: React.ReactNode}> = ({cor, children}) => (
  <div style={{width: 120, height: 120, borderRadius: 60, backgroundColor: cor, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </div>
);

export const R1: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const cam = camera(f);

  // queda do livro e pouso
  const POUSO = 22;
  const quedaY = k(f, [4, POUSO], [-300, 900], Easing.in(Easing.quad));
  const pouso = impacto(f, POUSO, 1.2);
  const estica = f < POUSO ? k(f, [4, POUSO], [1, 1.12]) : 1;
  const tr = tremor(f, POUSO, 12, 'r1');

  // triagem: o livro é "examinado"
  const inspeciona = k(f, [38, 46], [0, -9], encaixe) + k(f, [46, 54], [0, 18], encaixe) + k(f, [54, 62], [0, -9], encaixe);
  const lupa = k(f, [36, 44], [1, 1.07]) * k(f, [58, 66], [1, 1 / 1.07]);

  // divisão em três (18 quadros)
  const DIV = 74;
  const div = k(f, [DIV, DIV + 18], [0, 1], Easing.out(Easing.back(1.4)));

  // rasgo da reciclagem
  const RASGO = 268;
  const rasgo = k(f, [RASGO, RASGO + 10], [0, 1], encaixe);

  // reunião final
  const REUNE = 348;
  const reune = k(f, [REUNE, REUNE + 24], [0, 1], Easing.in(Easing.cubic));
  const ICONE = REUNE + 24;
  const iconeS = mola(f, fps, ICONE, 9, 160);
  const iconeImp = impacto(f, ICONE + 3, 0.8);

  const mundo = {
    position: 'absolute' as const,
    left: 0, top: 0, width: 1080, height: 1920,
    transformOrigin: '0 0',
    transform: `translate(${540 - cam.x * cam.z + tr.x}px, ${FOCO_Y - cam.y * cam.z + tr.y}px) scale(${cam.z})`,
  };

  const livroEm = (i: number) => {
    const alvoX = XS[i];
    const x = i === 1 ? 540 : 540 + (alvoX - 540) * div;
    const arco = i === 1 ? 0 : -110 * Math.sin(Math.PI * div);
    let xr = x, yr = 900 + arco, s = 1, rot = 0;
    if (f >= REUNE) {
      const ang = (i - 1) * 0.9;
      xr = x + (540 - x) * reune;
      yr = 900 + (720 - 900) * reune - 260 * Math.sin(Math.PI * reune) * Math.cos(ang);
      s = 1 - reune;
      rot = (i - 1) * 140 * reune;
    }
    return {x: xr, y: yr, s, rot};
  };

  const mostrarTres = f >= DIV;
  const rotulosMundo = k(f, [312, 322], [0, 1]) * (1 - k(f, [REUNE, REUNE + 8], [0, 1]));

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      {/* título do gancho (tela) */}
      <div
        style={{
          position: 'absolute', top: 440, left: 80, right: 120, textAlign: 'center',
          translate: `0px ${k(f, [74, 92], [0, -900], Easing.in(Easing.cubic))}px`,
          scale: String(k(f, [30, 46], [1, 0.86])),
          opacity: k(f, [80, 92], [1, 0]),
        }}
      >
        <T size={104}>Para onde vai</T>
        <div style={{display: 'flex', justifyContent: 'center', gap: 24, alignItems: 'baseline'}}>
          <T size={104}>o seu</T>
          <T size={128} serif cor={COR.terracota}>livro?</T>
        </div>
      </div>

      {/* mundo com câmera */}
      <div style={mundo}>
        {/* sombra no chão */}
        {f < REUNE && (
          <div style={{position: 'absolute', left: 340, top: 1080, width: 400, height: 40, borderRadius: '50%', backgroundColor: '#00000014', opacity: mostrarTres ? 1 - div : k(f, [8, POUSO], [0, 1])}} />
        )}
        {!mostrarTres && (
          <div style={{position: 'absolute', left: 540 - 110, top: quedaY - 145, width: 220, height: 290,
            transformOrigin: '50% 100%', scale: `${pouso.sx} ${pouso.sy * estica * lupa}`, rotate: `${inspeciona}deg`}}>
            <Livro w={220} capa={COR.terracota} />
          </div>
        )}
        {mostrarTres && f < REUNE + 24 &&
          [0, 1, 2].map((i) => {
            const p = livroEm(i);
            const cor = i === 1 ? COR.terracota : CORES[i];
            const corFinal = k(f, [DIV + 10, DIV + 20], [0, 1]) > 0.5 ? CORES[i] : cor;
            if (i === 2 && f >= RASGO) {
              return (
                <div key={i} style={{position: 'absolute', left: p.x - 110, top: p.y - 145, width: 220, height: 290, scale: String(p.s), rotate: `${p.rot}deg`}}>
                  <div style={{position: 'absolute', left: 0, top: 0, translate: `${-34 * rasgo}px ${10 * rasgo}px`, rotate: `${-10 * rasgo}deg`}}>
                    <MetadeLivro w={220} lado="esq" />
                  </div>
                  <div style={{position: 'absolute', left: 0, top: 0, translate: `${34 * rasgo}px ${-6 * rasgo}px`, rotate: `${9 * rasgo}deg`}}>
                    <MetadeLivro w={220} lado="dir" />
                  </div>
                </div>
              );
            }
            const foco = (i === 0 && f >= 110 && f < 166) || (i === 1 && f >= 174 && f < 240) || (i === 2 && f >= 252 && f < 300);
            return (
              <div key={i} style={{position: 'absolute', left: p.x - 110, top: p.y - 145, width: 220, height: 290, scale: String(p.s), rotate: `${p.rot}deg`,
                filter: foco ? 'drop-shadow(0 18px 30px rgba(96,102,55,0.35))' : 'none'}}>
                <Livro w={220} capa={corFinal} lombada={LOMBADAS[i]} />
              </div>
            );
          })}
        {/* rótulos no mundo, na pausa */}
        {rotulosMundo > 0 &&
          ['venda', 'doação', 'reciclagem'].map((r, i) => (
            <div key={r} style={{position: 'absolute', left: XS[i] - 160, width: 320, top: 1090, textAlign: 'center', opacity: rotulosMundo}}>
              <T size={46} peso={800} cor={CORES[i]}>{r}</T>
            </div>
          ))}
      </div>

      {/* triagem */}
      {f >= 30 && f < DIV + 10 && (
        <div style={{position: 'absolute', top: 1240, left: 80, right: 120, textAlign: 'center',
          opacity: k(f, [30, 40], [0, 1]) * k(f, [DIV, DIV + 8], [1, 0]),
          translate: `0px ${k(f, [30, 44], [40, 0])}px`}}>
          <T size={66} peso={800}>Primeiro, a</T>
          <T size={96} serif cor={COR.terracota}>triagem.</T>
        </div>
      )}

      <Legenda f={f} entra={112} sai={160} saiTipo="slide"
        icone={<Bolinha cor={COR.terracota}><Pata size={78} /></Bolinha>}
        titulo="Vendido" sub="no Livros & Patinhas" texto="A renda vai para ONGs que cuidam de animais." />
      <Legenda f={f} entra={176} sai={242} saiTipo="corte"
        icone={<Bolinha cor={COR.oliva}><Biblioteca size={78} /></Bolinha>}
        titulo="Doado" sub="à Biblioteca BECEI" texto="Livros que ganham novos leitores em Paraisópolis." />
      <Legenda f={f} entra={258} sai={300} saiTipo="queda"
        icone={<Bolinha cor={COR.olivaEscuro}><Reciclar size={78} /></Bolinha>}
        titulo="Reciclado" sub="com a Tramah" texto="Rasgado ou rabiscado? Vira reciclagem responsável." />

      {/* pausa: frase de apoio */}
      {f >= 318 && f < REUNE + 6 && (
        <div style={{position: 'absolute', top: 440, left: 80, right: 120, textAlign: 'center', opacity: k(f, [318, 326], [0, 1]) * k(f, [REUNE, REUNE + 6], [1, 0])}}>
          <T size={72} peso={800}>Nenhum livro</T>
          <T size={92} serif cor={COR.terracota}>fica parado.</T>
        </div>
      )}

      {/* final: ícone + frase + chamada */}
      {f >= ICONE - 2 && (
        <AbsoluteFill style={{alignItems: 'center'}}>
          <div style={{position: 'absolute', top: 560, scale: `${iconeS * iconeImp.sx} ${iconeS * iconeImp.sy}`}}>
            <Icone w={340} />
          </div>
          <div style={{position: 'absolute', top: 960, left: 80, right: 120, textAlign: 'center'}}>
            <T size={100} style={{scale: String(mola(f, fps, ICONE + 8, 13)), display: 'inline-block'}}>Todo livro</T>
            <T size={112} serif cor={COR.terracota} style={{scale: String(mola(f, fps, ICONE + 14, 13))}}>tem um destino.</T>
          </div>
          <div style={{position: 'absolute', top: 1290, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={{backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 50, padding: '26px 56px', borderRadius: 999,
              scale: String(mola(f, fps, ICONE + 26, 12))}}>
              Doe pelo Direct
            </div>
            <T size={42} peso={700} style={{marginTop: 22, opacity: k(f, [ICONE + 34, ICONE + 44], [0, 1])}}>@paginas_solidariasbr</T>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

