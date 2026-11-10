import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {COR, SANS} from './brand';
import {Icone, Pata, T} from './lib';

const W = 1080;
const H = 1350;
const M = 80;

// ───────────────────────── TST-P4 · Tem um desses parado aí? (carrossel, 7 lâminas)
// Uma estante corre pela base de todas as lâminas; em cada uma, um livro sai da prateleira.
export const P4_LAMINAS = 7;
const TIPOS = [
  {l1: 'O didático', l2: 'do ano passado.', capa: COR.oliva, rot: '', faixa: 'DIDÁTICO'},
  {l1: 'O romance que', l2: 'você já leu duas vezes.', capa: COR.terracota, rot: '', faixa: 'ROMANCE'},
  {l1: 'O livro de receitas', l2: 'que ninguém abre.', capa: '#8E4426', rot: '', faixa: 'RECEITAS'},
  {l1: 'O infantil que', l2: 'já ficou pequeno.', capa: '#7A8048', rot: '', faixa: 'INFANTIL'},
  {l1: 'O rabiscado,', l2: 'o rasgado.', capa: COR.olivaEscuro, rot: 'rasgado', faixa: 'RABISCADO'},
];
const PRAT_Y = 1210;

const Capa: React.FC<{cor: string; faixa: string; rasgado?: boolean}> = ({cor, faixa, rasgado}) => (
  <div style={{position: 'relative', width: 300, height: 400}}>
    <div style={{position: 'absolute', inset: 0, borderRadius: 14, backgroundColor: cor, boxShadow: '0 22px 40px rgba(63,68,36,0.28)',
      clipPath: rasgado ? 'polygon(0 0, 62% 0, 70% 7%, 78% 1%, 88% 9%, 100% 4%, 100% 100%, 0 100%)' : undefined}}>
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 36, borderRadius: '14px 0 0 14px', backgroundColor: 'rgba(0,0,0,0.18)'}} />
      <div style={{position: 'absolute', left: 64, right: 30, top: 70, height: 16, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.75)'}} />
      <div style={{position: 'absolute', left: 64, right: 90, top: 102, height: 12, borderRadius: 6, backgroundColor: 'rgba(255,255,255,0.45)'}} />
      <div style={{position: 'absolute', left: 36, right: 0, bottom: 60, textAlign: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 34,
        letterSpacing: 3, color: COR.creme}}>{faixa}</div>
      {rasgado && (
        <svg width="300" height="400" style={{position: 'absolute', inset: 0}}>
          <path d="M70 180 C110 150 150 220 190 170 S250 200 270 160" stroke={COR.creme} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.8" />
          <path d="M80 240 C120 270 170 210 230 250" stroke={COR.terracota} strokeWidth="7" fill="none" strokeLinecap="round" opacity="0.9" />
        </svg>
      )}
    </div>
  </div>
);

const Estante: React.FC<{laminas: number; vazios: number[]}> = ({laminas, vazios}) => {
  const livros: React.ReactNode[] = [];
  let x = 0;
  let i = 0;
  const cores = [COR.oliva, COR.cremeEscuro, COR.olivaEscuro, '#8E4426', '#7A8048', '#D8C9A8', COR.terracota];
  while (x < laminas * W) {
    const w = 40 + Math.floor(random(`p4w${i}`) * 46);
    const h = 150 + Math.floor(random(`p4h${i}`) * 110);
    const vazio = vazios.some((c) => Math.abs(x + w / 2 - c) < 90);
    if (!vazio) {
      livros.push(<div key={i} style={{position: 'absolute', left: x, top: PRAT_Y - h, width: w, height: h, borderRadius: 6,
        backgroundColor: cores[Math.floor(random(`p4c${i}`) * cores.length)], boxShadow: 'inset -5px 0 0 rgba(0,0,0,0.08)'}} />);
    }
    x += vazio ? 30 : w + 5;
    i++;
  }
  return (
    <>
      {livros}
      <div style={{position: 'absolute', left: 0, top: PRAT_Y, width: laminas * W, height: 28, backgroundColor: COR.olivaEscuro}} />
      <div style={{position: 'absolute', left: 0, top: PRAT_Y + 28, width: laminas * W, height: H - PRAT_Y - 28, backgroundColor: 'rgba(63,68,36,0.10)'}} />
    </>
  );
};

const Selo: React.FC<{txt: string}> = ({txt}) => (
  <div style={{display: 'inline-block', rotate: '-6deg', backgroundColor: COR.terracota, color: COR.branco, fontFamily: SANS, fontWeight: 900,
    fontSize: 56, padding: '10px 34px', borderRadius: 18, letterSpacing: 2}}>{txt}</div>
);

export const P4: React.FC = () => {
  const centros = TIPOS.map((_, i) => (i + 1) * W + W / 2);
  return (
    <AbsoluteFill style={{backgroundColor: COR.creme}}>
      {/* fundos */}
      {Array.from({length: P4_LAMINAS}).map((_, i) => (
        <div key={i} style={{position: 'absolute', left: i * W, top: 0, width: W, height: H,
          backgroundColor: i === 0 || i === P4_LAMINAS - 1 ? COR.oliva : i % 2 ? COR.creme : COR.cremeEscuro}} />
      ))}
      <Estante laminas={P4_LAMINAS} vazios={centros} />

      {/* lâmina 1 */}
      <div style={{position: 'absolute', left: M, top: M + 90, width: W - 2 * M}}>
        <T size={120} cor={COR.branco}>Tem um</T>
        <T size={120} cor={COR.branco}>desses</T>
        <T size={150} serif cor={COR.terracota}>parado aí?</T>
        <T size={50} peso={700} cor={COR.creme} style={{marginTop: 40}}>Arrasta e confere →</T>
      </div>

      {/* lâminas 2 a 6 */}
      {TIPOS.map((t, i) => {
        const x0 = (i + 1) * W;
        return (
          <React.Fragment key={t.faixa}>
            <div style={{position: 'absolute', left: x0 + M, top: M + 20, width: W - 2 * M}}>
              <T size={40} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>{`${i + 1} DE 5`}</T>
              <T size={84} style={{marginTop: 24}}>{t.l1}</T>
              <T size={96} serif cor={COR.terracota}>{t.l2}</T>
            </div>
            <div style={{position: 'absolute', left: x0 + W / 2 - 150, top: PRAT_Y - 470, rotate: i % 2 ? '5deg' : '-5deg'}}>
              <Capa cor={t.capa} faixa={t.faixa} rasgado={t.rot === 'rasgado'} />
            </div>
            <div style={{position: 'absolute', left: x0 + W - M - 300, top: PRAT_Y - 560, width: 300, textAlign: 'right'}}>
              <Selo txt={t.rot === 'rasgado' ? 'TAMBÉM SERVE' : 'SERVE'} />
            </div>
            {t.rot === 'rasgado' && (
              <T size={40} peso={700} cor={COR.olivaEscuro} style={{position: 'absolute', left: x0 + M, top: PRAT_Y - 660, width: 420, lineHeight: 1.25}}>
                Vai para a reciclagem responsável com a Tramah.
              </T>
            )}
          </React.Fragment>
        );
      })}

      {/* lâmina 7 */}
      <div style={{position: 'absolute', left: 6 * W + M, top: M + 60, width: W - 2 * M, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
        <T size={100} cor={COR.branco}>Separou algum?</T>
        <T size={110} serif cor={COR.terracota}>Manda no Direct.</T>
        <T size={50} peso={700} cor={COR.creme} style={{marginTop: 40, lineHeight: 1.3}}>E conta aqui nos comentários<br />qual desses você tem aí.</T>
        <div style={{marginTop: 50}}><Icone w={170} branco /></div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── TST-P5 · Comprar um livro também ajuda um animal (imagem única)
const AZUL = '#1F4E7A';
export const P5: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    <div style={{position: 'absolute', left: M, right: M, top: M + 10}}>
      <T size={40} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>VENDA SOLIDÁRIA</T>
      <T size={80} style={{marginTop: 26}}>Comprar um livro</T>
      <T size={80}>também ajuda</T>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <T size={112} serif cor={COR.terracota}>um animal.</T>
        <div style={{width: 130, height: 130, borderRadius: 65, backgroundColor: COR.terracota, display: 'flex', alignItems: 'center',
          justifyContent: 'center', rotate: '-8deg', boxShadow: '0 14px 26px rgba(182,90,52,0.3)', flexShrink: 0}}>
          <Pata size={90} />
        </div>
      </div>
    </div>
    <div style={{position: 'absolute', left: M, right: M, top: 540, borderRadius: 36, backgroundColor: AZUL, padding: '44px 50px',
      display: 'flex', flexDirection: 'column', gap: 24}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 28}}>
        <Img src={staticFile('livros-patinhas.jpg')} style={{width: 140, height: 140, borderRadius: 70, flexShrink: 0}} />
        <div>
          <T size={54} cor={COR.branco}>@livrosepatinhas</T>
          <T size={36} peso={600} cor="#CFE0F0" style={{lineHeight: 1.25}}>a frente de vendas do<br />Páginas Solidárias</T>
        </div>
      </div>
      <T size={42} peso={600} cor={COR.branco} style={{lineHeight: 1.32}}>
        Os livros doados em bom estado são vendidos lá, e a renda vai para ONGs que cuidam de animais.
      </T>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 18}}>
        <T size={84} cor={COR.branco}>1.280</T>
        <T size={38} peso={700} cor="#CFE0F0">livros vendidos</T>
      </div>
      <T size={34} peso={500} cor="#CFE0F0" style={{marginTop: -18}}>de dez/2025 a 9/11/2026</T>
    </div>
    <div style={{position: 'absolute', left: M, right: M, bottom: M - 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <div style={{backgroundColor: AZUL, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 44, padding: '18px 44px', borderRadius: 999}}>
        Siga @livrosepatinhas
      </div>
      <Icone w={110} />
    </div>
  </AbsoluteFill>
);
