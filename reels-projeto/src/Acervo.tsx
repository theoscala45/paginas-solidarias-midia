import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SERIF} from './brand';
import {Pata, T, impacto, k, mola, vaiVolta} from './lib';

// QUA-25/11 · O acervo do Livros & Patinhas
// Conceito: a câmera passeia pelas estantes de verdade; um cartão creme fica embaixo o tempo todo, troca de frase
// e no fim cresce até virar o painel com o caminho da compra.
export const ACERVO_DURACAO = 480;

// foto 1200x1600 cobrindo 1080x1920: escala 1.2 (1440x1920), sobra 360 px na horizontal
const Foto: React.FC<{src: string; opacity: number; zoom: number; dx: number; dy?: number}> = ({src, opacity, zoom, dx, dy = 0}) => (
  <AbsoluteFill style={{opacity}}>
    <Img src={staticFile(src)} style={{position: 'absolute', width: 1440, height: 1920, left: -180 + dx, top: dy,
      scale: String(zoom), transformOrigin: '50% 45%'}} />
  </AbsoluteFill>
);

const PASSOS = [
  {n: '1', t: 'Escolha pelo Direct do', d: '@livrosepatinhas'},
  {n: '2', t: 'Enviamos pelo correio,', d: 'em pacote caprichado, normalmente com marca‑páginas e alguns mimos'},
  {n: '3', t: '100% da renda vai para', d: 'ONGs e protetores de animais em situação de abandono'},
];

export const Acervo: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // fotos: sala (0–160), estante (145–275), canto (260–fim)
  const opA = 1 - k(f, [145, 165], [0, 1], vaiVolta);
  const opB = k(f, [145, 165], [0, 1], vaiVolta) * (1 - k(f, [260, 280], [0, 1], vaiVolta));
  const opC = k(f, [260, 280], [0, 1], vaiVolta);

  // cartão persistente: entra, troca de frase, cresce até virar painel
  const entra = mola(f, fps, 36, 18, 140);
  const cresce = k(f, [290, 318], [0, 1], vaiVolta);
  const top = 1190 + (600 - 1190) * cresce;
  const altura = 300 + (1480 - 600 - 300) * cresce;

  const frase = (a: number, b: number) => k(f, [a, a + 12], [0, 1], vaiVolta) * (1 - k(f, [b - 12, b], [0, 1], vaiVolta));

  return (
    <AbsoluteFill style={{backgroundColor: COR.olivaEscuro, overflow: 'hidden'}}>
      <Foto src="fotos/estante-sala.jpg" opacity={opA} zoom={k(f, [0, 165], [1.02, 1.1], Easing.linear)} dx={k(f, [0, 165], [60, 0], Easing.linear)} />
      <Foto src="fotos/estante-a.jpg" opacity={opB} zoom={1.12} dx={k(f, [145, 280], [150, -150], Easing.inOut(Easing.sin))} />
      <Foto src="fotos/estante-canto.jpg" opacity={opC} zoom={k(f, [260, 480], [1.04, 1.12], Easing.linear)} dx={0} dy={k(f, [260, 480], [0, -40], Easing.linear)} />

      {/* faixa escura em cima para o título */}
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(40,44,22,0.92) 0%, rgba(40,44,22,0.75) 26%, rgba(40,44,22,0) 46%)'}} />
      {/* escurece a foto quando vira painel */}
      <AbsoluteFill style={{backgroundColor: COR.olivaEscuro, opacity: 0.45 * cresce}} />

      {/* título fixo */}
      <div style={{position: 'absolute', top: 300, left: 80, right: 120, textAlign: 'center', scale: String(k(f, [0, 16], [1.04, 1], Easing.out(Easing.cubic)))}}>
        <T size={56} peso={800} cor={COR.cremeEscuro}>O acervo do</T>
        <T size={98} serif cor={COR.creme} style={{lineHeight: 1.05, whiteSpace: 'nowrap'}}>Livros & Patinhas</T>
      </div>

      {/* cartão / painel */}
      <div style={{position: 'absolute', left: 80, width: 880, top, height: altura, borderRadius: 40, backgroundColor: COR.creme,
        boxShadow: '0 24px 60px rgba(0,0,0,0.35)', opacity: entra, translate: `0px ${(1 - entra) * 120}px`, overflow: 'hidden'}}>
        <div style={{position: 'absolute', inset: 0, padding: '0 56px', display: 'flex', alignItems: 'center', opacity: frase(40, 156)}}>
          <T size={52} peso={800} cor={COR.olivaEscuro} style={{lineHeight: 1.2}}>
            Todos estes livros foram doados pelo <span style={{fontFamily: SERIF, fontStyle: 'italic', color: COR.terracota}}>Páginas Solidárias.</span>
          </T>
        </div>
        <div style={{position: 'absolute', inset: 0, padding: '0 56px', display: 'flex', alignItems: 'center', opacity: frase(158, 290)}}>
          <T size={52} peso={800} cor={COR.olivaEscuro} style={{lineHeight: 1.2}}>
            E cada um está esperando um <span style={{fontFamily: SERIF, fontStyle: 'italic', color: COR.terracota}}>novo leitor.</span>
          </T>
        </div>

        {/* passos da compra */}
        <div style={{position: 'absolute', top: 70, left: 56, right: 56, opacity: 1 - k(f, [408, 420], [0, 1], vaiVolta)}}>
          <T size={46} peso={800} cor={COR.terracota} style={{letterSpacing: 3, opacity: k(f, [312, 324], [0, 1])}}>COMO COMPRAR</T>
          {PASSOS.map((p, i) => {
            const s = mola(f, fps, 326 + i * 18, 20, 160);
            return (
              <div key={p.n} style={{display: 'flex', gap: 30, alignItems: 'flex-start', marginTop: 46, opacity: s, translate: `${(1 - s) * 40}px 0px`}}>
                <div style={{width: 84, height: 84, flexShrink: 0, borderRadius: 42, backgroundColor: COR.oliva, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  <T size={50} cor={COR.creme}>{p.n}</T>
                </div>
                <div>
                  <T size={44} peso={800} cor={COR.olivaEscuro} style={{lineHeight: 1.2}}>{p.t}</T>
                  <T size={44} peso={700} cor={i === 0 ? COR.terracota : COR.oliva} style={{lineHeight: 1.2}}>{p.d}</T>
                </div>
              </div>
            );
          })}
        </div>

        {/* chamada final */}
        {(() => {
          const s = mola(f, fps, 424, 16, 150);
          const a = impacto(f, 432, 1);
          return (
            <div style={{position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: f < 420 ? 0 : 1}}>
              <div style={{width: 200, height: 200, borderRadius: 100, backgroundColor: COR.terracota, display: 'flex', alignItems: 'center', justifyContent: 'center',
                scale: `${s * a.sx} ${s * a.sy}`}}>
                <Pata size={120} />
              </div>
              <T size={60} peso={800} cor={COR.olivaEscuro} style={{marginTop: 50, opacity: k(f, [432, 444], [0, 1])}}>Chama no Direct do</T>
              <T size={96} serif cor={COR.terracota} style={{opacity: k(f, [438, 450], [0, 1])}}>@livrosepatinhas</T>
            </div>
          );
        })()}
      </div>
    </AbsoluteFill>
  );
};
