import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {Biblioteca, Icone, Livro, Pata, Reciclar, T} from './lib';

// TER-17/11 · Como doar em 3 passos, versão com suspense (carrossel, 5 lâminas)
// Conceito: a história de um livro esquecido na estante. Cada lâmina termina com uma pergunta
// que só a próxima responde; o livro atravessa da primeira para a segunda lâmina.
const W = 1080;
const H = 1350;
const M = 80;

const Lamina: React.FC<{i: number; fundo: string; children?: React.ReactNode}> = ({i, fundo, children}) => (
  <div style={{position: 'absolute', left: i * W, top: 0, width: W, height: H, background: fundo, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: M, top: M, right: M, bottom: M}}>{children}</div>
  </div>
);

const Gancho: React.FC<{children: React.ReactNode; cor: string}> = ({children, cor}) => (
  <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, fontSize: 64,
    lineHeight: 1.15, color: cor}}>
    {children}
  </div>
);

const Kicker: React.FC<{children: React.ReactNode; cor: string}> = ({children, cor}) => (
  <T size={40} peso={800} cor={cor} style={{letterSpacing: 4}}>{children}</T>
);

const Bolha: React.FC<{lado: 'esq' | 'dir'; fundo: string; children: React.ReactNode}> = ({lado, fundo, children}) => (
  <div style={{display: 'flex', justifyContent: lado === 'dir' ? 'flex-end' : 'flex-start'}}>
    <div style={{backgroundColor: fundo, borderRadius: 44, padding: '30px 44px', maxWidth: 840,
      borderBottomRightRadius: lado === 'dir' ? 10 : 44, borderBottomLeftRadius: lado === 'esq' ? 10 : 44,
      boxShadow: '0 14px 36px rgba(63,68,36,0.14)'}}>
      {children}
    </div>
  </div>
);

export const P1D_LAMINAS = 5;
export const P1D: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.olivaEscuro}}>
    {/* 1 · o livro esquecido, sob um foco de luz */}
    <Lamina i={0} fundo={`radial-gradient(circle at 92% 82%, rgba(244,237,224,0.22) 0, rgba(244,237,224,0.06) 26%, rgba(0,0,0,0) 46%), ${COR.olivaEscuro}`}>
      <Kicker cor={COR.cremeEscuro}>UMA HISTÓRIA EM 3 PASSOS</Kicker>
      <T size={118} cor={COR.creme} style={{marginTop: 70}}>Tem um livro</T>
      <T size={118} cor={COR.creme}>na sua casa</T>
      <T size={140} serif cor={COR.terracota} style={{lineHeight: 1}}>esperando.</T>
      <T size={50} peso={600} cor={COR.cremeEscuro} style={{marginTop: 50, lineHeight: 1.3, maxWidth: 900}}>
        Há meses. Talvez anos.<br />Ninguém abre. Ninguém lê.
      </T>
      <Gancho cor={COR.creme}>O que vai ser dele?<br /><span style={{fontFamily: SANS, fontStyle: 'normal', fontWeight: 700, fontSize: 44, color: COR.cremeEscuro}}>Arrasta →</span></Gancho>
    </Lamina>

    {/* 2 · passo 1 */}
    <Lamina i={1} fundo={COR.oliva}>
      <Kicker cor={COR.cremeEscuro}>PASSO 1</Kicker>
      <T size={110} cor={COR.branco} style={{marginTop: 40}}>Tire ele</T>
      <T size={110} cor={COR.branco}>da estante.</T>
      <T size={50} peso={600} cor={COR.creme} style={{marginTop: 40, lineHeight: 1.3, maxWidth: 760}}>
        E os outros também: livro, revista, gibi, apostila. Até os rabiscados. Até os rasgados.
      </T>
      {/* a estante com o espaço vazio de onde o livro saiu */}
      <div style={{position: 'absolute', left: 60, right: 0, top: 700, height: 250, display: 'flex', alignItems: 'flex-end', gap: 8,
        borderBottom: `14px solid ${COR.olivaEscuro}`}}>
        {[[70, 210, COR.cremeEscuro], [56, 180, COR.terracota], [84, 230, COR.olivaEscuro], [0, 0, ''], [64, 200, COR.creme], [76, 170, '#8A8F5A'], [58, 220, COR.cremeEscuro], [90, 190, COR.terracota], [66, 205, COR.olivaEscuro]].map(([w, h, c], i) =>
          c ? <div key={i} style={{width: w as number, height: h as number, borderRadius: 8, backgroundColor: c as string, boxShadow: 'inset -8px 0 0 rgba(0,0,0,0.12)'}} />
            : <div key={i} style={{width: 92, height: 236, borderRadius: 8, border: `5px dashed ${COR.creme}`, opacity: 0.7}} />,
        )}
      </div>
      <Gancho cor={COR.creme}>Mas para onde eles vão?</Gancho>
    </Lamina>

    {/* 3 · passo 2: a mensagem e a resposta que está chegando */}
    <Lamina i={2} fundo={COR.creme}>
      <Kicker cor={COR.terracota}>PASSO 2</Kicker>
      <T size={110} style={{marginTop: 40}}>Mande uma</T>
      <T size={110}>mensagem.</T>
      <T size={48} peso={600} cor={COR.olivaEscuro} style={{marginTop: 30, lineHeight: 1.3}}>No Direct ou pelo site,<br />no link da bio.</T>
      <div style={{marginTop: 60, display: 'flex', flexDirection: 'column', gap: 26}}>
        <Bolha lado="dir" fundo={COR.oliva}>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 50, color: COR.branco}}>Oi! Tenho livros para doar.</span>
        </Bolha>
        <Bolha lado="esq" fundo={COR.branco}>
          <div style={{display: 'flex', gap: 18, alignItems: 'center', height: 60}}>
            {[1, 0.6, 0.3].map((o) => (
              <div key={o} style={{width: 26, height: 26, borderRadius: 13, backgroundColor: COR.oliva, opacity: o}} />
            ))}
          </div>
        </Bolha>
      </div>
      <Gancho cor={COR.terracota}>A resposta chega rápido.<br />E aí vem a melhor parte.</Gancho>
    </Lamina>

    {/* 4 · passo 3: o destino */}
    <Lamina i={3} fundo={COR.olivaEscuro}>
      <Kicker cor={COR.cremeEscuro}>PASSO 3</Kicker>
      <T size={110} cor={COR.branco} style={{marginTop: 40}}>O destino.</T>
      <T size={46} peso={600} cor={COR.creme} style={{marginTop: 24, lineHeight: 1.3}}>A gente faz a triagem, e cada livro segue um caminho:</T>
      <div style={{marginTop: 40, display: 'flex', flexDirection: 'column', gap: 26}}>
        {[
          {ic: <Pata size={64} />, cor: COR.terracota, t: 'Venda', d: 'no Livros & Patinhas: a renda vai para ONGs e protetores de animais em situação de abandono'},
          {ic: <Biblioteca size={64} />, cor: COR.oliva, t: 'Doação', d: 'para bibliotecas públicas e a Biblioteca BECEI, em Paraisópolis'},
          {ic: <Reciclar size={64} />, cor: '#5B6136', t: 'Reciclagem', d: 'responsável, com a Tramah'},
        ].map((r) => (
          <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 26}}>
            <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: r.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{r.ic}</div>
            <div>
              <T size={54} cor={COR.branco}>{r.t}</T>
              <T size={38} peso={600} cor={COR.creme} style={{lineHeight: 1.25}}>{r.d}</T>
            </div>
          </div>
        ))}
      </div>
      <Gancho cor={COR.terracota}>E o livro esquecido?</Gancho>
    </Lamina>

    {/* 5 · o final */}
    <Lamina i={4} fundo={COR.creme}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 60}}>
        <Icone w={220} />
        <T size={96} style={{marginTop: 50}}>Ganha uma</T>
        <T size={120} serif cor={COR.terracota}>nova história.</T>
        <T size={48} peso={700} cor={COR.olivaEscuro} style={{marginTop: 40, lineHeight: 1.3}}>
          Tudo que tem páginas<br />pode virar impacto.
        </T>
        <div style={{marginTop: 50, backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 50,
          padding: '24px 60px', borderRadius: 999}}>
          Manda no Direct
        </div>
        <T size={40} peso={600} cor={COR.oliva} style={{marginTop: 30}}>Salve este post para o dia<br />de arrumar a estante.</T>
      </div>
    </Lamina>

    {/* o livro esquecido: sob o foco na lâmina 1, atravessando para a 2 */}
    <div style={{position: 'absolute', left: W - 175, top: 820, rotate: '-6deg'}}>
      <Livro w={250} capa={COR.terracota} />
    </div>
  </AbsoluteFill>
);
