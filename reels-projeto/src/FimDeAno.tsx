import React from 'react';
import {AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {COR, SANS} from './brand';
import {Icone, T, impacto, k, mola, tremor, vaiVolta} from './lib';

// SEX-27/11 · Fim de ano, estante arrumada (pedido de doação)
// Conceito: o calendário de 2026 vira de novembro para dezembro e se transforma na prateleira; os livros caem
// tortos e se arrumam; os que sobram saem da estante e viajam, cada um, para um destino da lista.
export const FIM_DURACAO = 500;

const CX = 520;
const PRAT_Y = 1110; // linha da prateleira
const N = 14;
const SOBRAM = [1, 4, 7, 10, 13]; // livros que saem da estante

const LIVROS = Array.from({length: N}).map((_, i) => {
  const w = 44 + Math.floor(random(`w${i}`) * 26);
  const h = 170 + Math.floor(random(`h${i}`) * 90);
  return {w, h, rot: (random(`r${i}`) - 0.5) * 50, cai: 96 + i * 3, arruma: 140 + i * 2,
    cor: [COR.oliva, COR.olivaEscuro, COR.cremeEscuro, '#8A8F5A'][Math.floor(random(`c${i}`) * 4)]};
});
const LARG = LIVROS.reduce((a, l) => a + l.w + 8, 0) - 8;
const X0 = CX - LARG / 2;
const XS = LIVROS.reduce<number[]>((acc, l, i) => {
  acc.push(i === 0 ? X0 : acc[i - 1] + LIVROS[i - 1].w + 8);
  return acc;
}, []);

const DESTINOS = [
  {t: 'Livros & Patinhas', d: 'renda para ONGs e protetores de animais'},
  {t: 'Bibliotecas públicas', d: ''},
  {t: 'Hospitais', d: 'como o Cantinho da Leitura'},
  {t: 'Biblioteca BECEI', d: 'em Paraisópolis'},
  {t: 'Reciclagem', d: 'com a Tramah'},
];
const LISTA_Y0 = 540;
const LISTA_DY = 170;
const VIAGEM = 272; // início das viagens

export const FimDeAno: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  // calendário -> prateleira (transformação do contêiner)
  const mv = k(f, [72, 100], [0, 1], vaiVolta);
  const cw = 560 + (880 - 560) * mv;
  const ch = 600 + (24 - 600) * mv;
  const ccy = 720 + (PRAT_Y + 12 - 720) * mv;
  const somePrat = k(f, [256, 268], [0, 1], vaiVolta);

  const fala = (a: number, b: number) => k(f, [a, a + 12], [0, 1], vaiVolta) * (1 - k(f, [b - 10, b], [0, 1], vaiVolta));
  const tr = tremor(f, 118, 5, 'fim');
  const saiLista = k(f, [392, 404], [0, 1], vaiVolta);

  return (
    <AbsoluteFill style={{backgroundColor: COR.creme, overflow: 'hidden'}}>
      <AbsoluteFill style={{translate: `${tr.x}px ${tr.y}px`}}>
        {/* frases de cima */}
        <div style={{position: 'absolute', top: 1330, left: 80, right: 120, textAlign: 'center', opacity: f < 60 ? 1 : 1 - k(f, [60, 70], [0, 1])}}>
          <T size={84}>O ano está</T>
          <T size={96} serif cor={COR.terracota}>acabando.</T>
        </div>
        <div style={{position: 'absolute', top: 420, left: 80, right: 120, textAlign: 'center', opacity: fala(142, 182)}}>
          <T size={92}>Hora de arrumar</T>
          <T size={104} serif cor={COR.terracota}>a estante.</T>
        </div>
        <div style={{position: 'absolute', top: 420, left: 80, right: 120, textAlign: 'center', opacity: fala(186, 258)}}>
          <T size={92}>E os livros que</T>
          <T size={104} serif cor={COR.terracota}>sobraram?</T>
        </div>
        <div style={{position: 'absolute', top: 380, left: 80, right: 120, textAlign: 'center', opacity: fala(262, 404)}}>
          <T size={60} peso={800} cor={COR.olivaEscuro}>A gente encaminha para:</T>
        </div>

        {/* calendário / prateleira */}
        <div style={{position: 'absolute', left: CX - cw / 2, top: ccy - ch / 2, width: cw, height: ch, borderRadius: 40 - 32 * mv,
          backgroundColor: mv < 0.6 ? COR.branco : COR.olivaEscuro, boxShadow: '0 20px 50px rgba(63,68,36,0.18)', overflow: 'hidden',
          opacity: 1 - somePrat}}>
          <div style={{opacity: 1 - k(f, [72, 82], [0, 1])}}>
            <div style={{height: 150, backgroundColor: COR.terracota, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <div style={{position: 'absolute', scale: `1 ${1 - k(f, [30, 38], [0, 1], Easing.in(Easing.quad))}`}}><T size={70} cor={COR.creme}>NOVEMBRO</T></div>
              <div style={{position: 'absolute', scale: `1 ${k(f, [38, 46], [0, 1], Easing.out(Easing.quad))}`}}><T size={70} cor={COR.creme}>DEZEMBRO</T></div>
            </div>
            <div style={{height: 450, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative'}}>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 176, color: COR.olivaEscuro, lineHeight: 1}}>2026</div>
            </div>
          </div>
        </div>

        {/* livros */}
        {LIVROS.map((l, i) => {
          const sobra = SOBRAM.indexOf(i);
          const cai = k(f, [l.cai - 14, l.cai], [0, 1], Easing.in(Easing.quad));
          if (f < l.cai - 14) return null;
          const arr = mola(f, fps, l.arruma, 20, 150);
          const rot = l.rot * (1 - arr);
          const imp = impacto(f, l.cai, 0.6);
          let x = XS[i];
          let y = PRAT_Y - l.h - (1 - cai) * 220;
          let esc = 1;
          let op = 1;
          let cor = l.cor;
          if (sobra < 0) {
            op = 1 - somePrat;
          } else {
            cor = COR.terracota;
            // sobe
            const sobe = k(f, [196 + sobra * 4, 222 + sobra * 4], [0, 1], vaiVolta);
            y -= 170 * sobe;
            // viaja até a linha da lista
            const ini = VIAGEM + sobra * 6;
            const v = k(f, [ini, ini + 26], [0, 1], vaiVolta);
            const alvoX = 120 - l.w / 2;
            const alvoY = LISTA_Y0 + sobra * LISTA_DY + 96 - l.h; // base do livro alinhada à linha (escala a partir da base)
            x = x + (alvoX - x) * v;
            y = y + (alvoY - y) * v;
            esc = 1 + (0.5 - 1) * v;
            op = 1 - saiLista;
          }
          return (
            <div key={i} style={{position: 'absolute', left: x, top: y, width: l.w, height: l.h, borderRadius: 6, backgroundColor: cor, opacity: op,
              rotate: `${rot}deg`, scale: `${esc * imp.sx} ${esc * imp.sy}`, transformOrigin: '50% 100%',
              boxShadow: 'inset -9px 0 0 rgba(0,0,0,0.13)'}}>
              <div style={{position: 'absolute', left: 8, right: 14, top: 22, height: 6, borderRadius: 3, backgroundColor: COR.creme, opacity: 0.7}} />
            </div>
          );
        })}

        {/* lista de destinos */}
        {DESTINOS.map((d, i) => {
          const chega = VIAGEM + i * 6 + 26;
          const s = k(f, [chega - 2, chega + 10], [0, 1], vaiVolta);
          return (
            <div key={d.t} style={{position: 'absolute', left: 180, right: 60, top: LISTA_Y0 + i * LISTA_DY + 18, opacity: s * (1 - saiLista),
              translate: `${(1 - s) * 30}px 0px`}}>
              <T size={44} peso={800} cor={COR.olivaEscuro} style={{whiteSpace: 'nowrap'}}>{d.t}</T>
              {d.d ? <T size={32} peso={600} cor={COR.oliva} style={{marginTop: 4}}>{d.d}</T> : null}
            </div>
          );
        })}

        {/* chamada */}
        <div style={{position: 'absolute', top: 470, left: 80, right: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
          <div style={{scale: String(mola(f, fps, 408, 16, 140)), opacity: f < 406 ? 0 : 1}}><Icone w={220} /></div>
          <T size={92} style={{marginTop: 40, opacity: k(f, [414, 426], [0, 1])}}>Doe para</T>
          <T size={110} serif cor={COR.terracota} style={{opacity: k(f, [420, 432], [0, 1])}}>quem precisa.</T>
          <T size={48} peso={700} cor={COR.olivaEscuro} style={{marginTop: 34, lineHeight: 1.3, opacity: k(f, [430, 442], [0, 1])}}>
            Tudo que tem páginas<br />pode virar impacto.
          </T>
        </div>
        <div style={{position: 'absolute', top: 1230, left: 0, right: 40, display: 'flex', justifyContent: 'center'}}>
          {(() => {
            const s = mola(f, fps, 446, 18, 170);
            const a = impacto(f, 454, 1);
            return (
              <div style={{backgroundColor: COR.oliva, borderRadius: 999, padding: '26px 64px', opacity: s, scale: `${s * a.sx} ${s * a.sy}`}}>
                <T size={58} peso={800} cor={COR.creme}>Manda no Direct</T>
              </div>
            );
          })()}
        </div>
        <div style={{position: 'absolute', top: 1386, left: 80, right: 120, textAlign: 'center', opacity: k(f, [460, 472], [0, 1])}}>
          <T size={40} peso={700} cor={COR.olivaEscuro}>ou pelo site, no link da bio</T>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
