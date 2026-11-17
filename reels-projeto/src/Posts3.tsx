import React from 'react';
import {AbsoluteFill, Img, random, staticFile} from 'remotion';
import {COR, SANS} from './brand';
import {Icone, Livro, T} from './lib';

// TER-17/11 extra · Para onde vão os 198 livros (carrossel, 4 lâminas)
// Conceito: cada livro que chegou na segunda vira uma lombada fina; as 198 lombadas se dividem
// em cinco prateleiras, uma por destino, e dá para "contar" cada livro.
const W = 1080;
const H = 1350;
const M = 80;

const Lamina: React.FC<{i: number; fundo: string; children?: React.ReactNode}> = ({i, fundo, children}) => (
  <div style={{position: 'absolute', left: i * W, top: 0, width: W, height: H, backgroundColor: fundo, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: M, top: M, right: M, bottom: M}}>{children}</div>
  </div>
);

const DESTINOS = [
  {n: 60, nome: 'Livros & Patinhas', sub: 'renda para ONGs e protetores de animais', cor: COR.terracota, escura: '#8E4426'},
  {n: 37, nome: 'Biblioteca BECEI', sub: 'em Paraisópolis', cor: COR.oliva, escura: '#474C27'},
  {n: 67, nome: 'Cantinho da Leitura Páginas Solidárias', sub: 'no Hospital Infantil Darcy Vargas', cor: COR.olivaEscuro, escura: '#2C3018'},
  {n: 29, nome: 'Cultura Inglesa de Paraisópolis', sub: 'projeto totalmente social', cor: '#8A8F5A', escura: '#666B3E'},
  {n: 5, nome: 'Reciclagem', sub: 'com a Tramah Sustentabilidade', cor: '#C9BBA0', escura: '#A89A7E'},
];

// uma lombada fina por livro (10 px + 3 px de espaço: 67 livros = 871 px)
const Prateleira: React.FC<{n: number; cor: string; escura: string; seed: string}> = ({n, cor, escura, seed}) => (
  <div style={{display: 'flex', alignItems: 'flex-end', gap: 3, height: 54, borderBottom: `6px solid ${COR.olivaEscuro}`, paddingBottom: 0}}>
    {Array.from({length: n}).map((_, i) => (
      <div key={i} style={{width: 10, height: 36 + Math.floor(random(`${seed}${i}`) * 18), borderRadius: 3,
        backgroundColor: random(`${seed}c${i}`) > 0.7 ? escura : cor}} />
    ))}
  </div>
);

export const P6_LAMINAS = 4;
export const P6: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    {/* 1 · gancho */}
    <Lamina i={0} fundo={COR.oliva}>
      <T size={40} peso={800} cor={COR.cremeEscuro} style={{letterSpacing: 4}}>SEGUNDA, 16 DE NOVEMBRO</T>
      <T size={380} cor={COR.creme} style={{lineHeight: 1, marginTop: 40, letterSpacing: -8}}>198</T>
      <T size={110} cor={COR.branco} style={{marginTop: 10}}>livros chegaram</T>
      <T size={120} serif cor={COR.cremeEscuro}>num dia só.</T>
      <T size={50} peso={700} cor={COR.creme} style={{marginTop: 70, lineHeight: 1.25}}>
        E cada um já tem destino.<br />Arrasta para ver →
      </T>
    </Lamina>

    {/* 2 · as cinco prateleiras */}
    <Lamina i={1} fundo={COR.creme}>
      <T size={40} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>PARA ONDE VÃO OS 198</T>
      <T size={32} peso={600} cor={COR.oliva} style={{marginTop: 8}}>Cada tracinho é um livro.</T>
      <div style={{marginTop: 30, display: 'flex', flexDirection: 'column', gap: 20}}>
        {DESTINOS.map((d, i) => (
          <div key={d.nome}>
            <div style={{display: 'flex', alignItems: 'baseline', gap: 22}}>
              <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 76, lineHeight: 1, color: d.n === 67 ? COR.terracota : COR.olivaEscuro,
                minWidth: 110, fontVariantNumeric: 'tabular-nums'}}>{d.n}</div>
              <div>
                <T size={44} peso={800} cor={COR.olivaEscuro}>{d.nome}</T>
                <T size={31} peso={600} cor={COR.oliva} style={{marginTop: 2}}>{d.sub}</T>
              </div>
            </div>
            <div style={{marginTop: 10}}>
              <Prateleira n={d.n} cor={d.cor} escura={d.escura} seed={`p${i}`} />
            </div>
          </div>
        ))}
      </div>
    </Lamina>

    {/* 3 · o Cantinho da Leitura */}
    <Lamina i={2} fundo={COR.cremeEscuro}>
      <div style={{width: 920, height: 822, borderRadius: 36, overflow: 'hidden', boxShadow: '0 20px 50px rgba(63,68,36,0.25)'}}>
        <Img src={staticFile('fotos/cantinho.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
      </div>
      <div style={{display: 'flex', alignItems: 'baseline', gap: 24, marginTop: 36}}>
        <T size={130} cor={COR.terracota} style={{lineHeight: 1}}>67</T>
        <T size={70} serif cor={COR.olivaEscuro}>livros</T>
      </div>
      <T size={44} peso={700} cor={COR.olivaEscuro} style={{marginTop: 12, lineHeight: 1.22}}>
        para o Cantinho da Leitura Páginas Solidárias, que a gente criou dentro do Hospital Infantil Darcy Vargas.
      </T>
    </Lamina>

    {/* 4 · chamada */}
    <Lamina i={3} fundo={COR.creme}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 110}}>
        <Icone w={230} />
        <T size={100} style={{marginTop: 60}}>Obrigado</T>
        <T size={110} serif cor={COR.terracota}>a quem doou.</T>
        <T size={50} peso={700} cor={COR.olivaEscuro} style={{marginTop: 50, lineHeight: 1.3}}>
          Tem livro parado aí?<br />Tudo que tem páginas<br />pode virar impacto.
        </T>
        <div style={{marginTop: 56, backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 50,
          padding: '24px 60px', borderRadius: 999}}>
          Manda no Direct
        </div>
        <T size={44} peso={700} cor={COR.olivaEscuro} style={{marginTop: 26}}>@paginas_solidariasbr</T>
      </div>
    </Lamina>

    {/* livros que atravessam as bordas: 1→2 e 3→4 */}
    <div style={{position: 'absolute', left: W - 130, top: 1150, rotate: '-10deg'}}>
      <Livro w={220} capa={COR.terracota} />
    </div>
    <div style={{position: 'absolute', left: 3 * W - 110, top: 150, rotate: '8deg'}}>
      <Livro w={200} capa={COR.olivaEscuro} />
    </div>
  </AbsoluteFill>
);
