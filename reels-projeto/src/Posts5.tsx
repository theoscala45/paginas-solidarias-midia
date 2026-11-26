import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COR, SANS} from './brand';
import {Icone, Livro, T} from './lib';
import {Story} from './Stories';

// Semana 23–29/11: carrosséis "Cantinho da Leitura Páginas Solidárias" (ter) e "A caixa na Graded" (sáb), e os Stories.
const W = 1080;
const H = 1350;
const M = 80;

const Lamina: React.FC<{i: number; fundo: string; children?: React.ReactNode}> = ({i, fundo, children}) => (
  <div style={{position: 'absolute', left: i * W, top: 0, width: W, height: H, backgroundColor: fundo, overflow: 'hidden'}}>
    <div style={{position: 'absolute', left: M, top: M, right: M, bottom: M}}>{children}</div>
  </div>
);

const Foto: React.FC<{src: string; w: number; h: number; r?: number; pos?: string; style?: React.CSSProperties}> = ({src, w, h, r = 36, pos = '50% 50%', style}) => (
  <div style={{width: w, height: h, borderRadius: r, overflow: 'hidden', boxShadow: '0 20px 50px rgba(63,68,36,0.25)', ...style}}>
    <Img src={staticFile(src)} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: pos}} />
  </div>
);

const Botao: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div style={{backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 50, padding: '24px 60px', borderRadius: 999}}>
    {children}
  </div>
);

// ---------- TER · Cantinho da Leitura Páginas Solidárias (4 lâminas) ----------
// Conceito: da porta do hospital até a estante do Cantinho; um livro atravessa da 1ª para a 2ª lâmina.
export const CANT_LAMINAS = 4;
export const CANT: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    <Lamina i={0} fundo={COR.olivaEscuro}>
      <Foto src="fotos/hospital.jpg" w={920} h={460} />
      <T size={84} cor={COR.creme} style={{marginTop: 60}}>Dentro de um hospital,</T>
      <T size={84} cor={COR.creme}>um cantinho</T>
      <T size={112} serif cor={COR.terracota} style={{lineHeight: 1.05}}>só para histórias.</T>
      <T size={44} peso={700} cor={COR.cremeEscuro} style={{position: 'absolute', bottom: 0, left: 0}}>Arrasta →</T>
    </Lamina>

    <Lamina i={1} fundo={COR.creme}>
      <Foto src="fotos/cantinho.jpg" w={920} h={760} />
      <T size={78} style={{marginTop: 46}}>Cantinho da Leitura</T>
      <T size={78}>Páginas Solidárias</T>
      <T size={44} peso={700} cor={COR.olivaEscuro} style={{marginTop: 18}}>no Hospital Infantil Darcy Vargas</T>
    </Lamina>

    <Lamina i={2} fundo={COR.terracota}>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%'}}>
        <T size={50} peso={800} cor={COR.creme} style={{letterSpacing: 4}}>ATÉ AGORA</T>
        <T size={340} cor={COR.creme} style={{lineHeight: 1, letterSpacing: -6, marginTop: 10}}>+200</T>
        <T size={84} cor={COR.branco}>livros infantis</T>
        <T size={84} serif cor={COR.cremeEscuro}>já foram para o Cantinho.</T>
        <div style={{height: 8, width: 260, backgroundColor: COR.creme, borderRadius: 4, marginTop: 50}} />
        <T size={56} serif cor={COR.creme} style={{marginTop: 40}}>Pequenos leitores.<br />Grandes futuros.</T>
      </div>
    </Lamina>

    <Lamina i={3} fundo={COR.creme}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 100}}>
        <Icone w={220} />
        <T size={88} style={{marginTop: 50}}>Tem livro infantil</T>
        <T size={110} serif cor={COR.terracota}>parado aí?</T>
        <T size={48} peso={700} cor={COR.olivaEscuro} style={{marginTop: 36, lineHeight: 1.3}}>Ele pode ganhar<br />um novo leitor.</T>
        <div style={{marginTop: 50}}><Botao>Manda no Direct</Botao></div>
        <T size={44} peso={700} cor={COR.olivaEscuro} style={{marginTop: 26}}>@paginas_solidariasbr</T>
      </div>
    </Lamina>

    <div style={{position: 'absolute', left: W - 125, top: 1090, rotate: '-8deg'}}>
      <Livro w={210} capa={COR.terracota} />
    </div>
    <div style={{position: 'absolute', left: 3 * W - 110, top: 1080, rotate: '9deg'}}>
      <Livro w={200} capa={COR.olivaEscuro} />
    </div>
  </AbsoluteFill>
);

// ---------- SÁB · A caixa na Graded (4 lâminas) ----------
// Conceito: um endereço que vai se revelando: a pergunta, a caixa, o lugar exato, e o plano B.
export const CAIXA_LAMINAS = 4;
export const CAIXA: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    <Lamina i={0} fundo={COR.oliva}>
      <T size={44} peso={800} cor={COR.cremeEscuro} style={{letterSpacing: 4}}>PONTO DE COLETA</T>
      <T size={120} cor={COR.creme} style={{marginTop: 40}}>Tem livro</T>
      <T size={120} cor={COR.creme}>para doar?</T>
      <T size={120} serif cor={COR.cremeEscuro} style={{lineHeight: 1.05}}>Tem caixa</T>
      <T size={120} serif cor={COR.cremeEscuro} style={{lineHeight: 1.05}}>esperando.</T>
      <T size={44} peso={700} cor={COR.creme} style={{position: 'absolute', bottom: 0, left: 0}}>Arrasta →</T>
    </Lamina>

    <Lamina i={1} fundo={COR.creme}>
      <div style={{display: 'flex', gap: 50, alignItems: 'center', height: '100%'}}>
        <Foto src="fotos/caixa-perto.jpg" w={470} h={1000} pos="50% 40%" />
        <div style={{flex: 1}}>
          <T size={50} peso={800} cor={COR.terracota} style={{letterSpacing: 3}}>ONDE FICA</T>
          <T size={76} style={{marginTop: 24}}>Na Graded,</T>
          <T size={56} peso={800} cor={COR.olivaEscuro} style={{marginTop: 20, lineHeight: 1.2}}>do lado da escada, na garagem.</T>
        </div>
      </div>
    </Lamina>

    <Lamina i={2} fundo={COR.cremeEscuro}>
      <div style={{display: 'flex', gap: 50, alignItems: 'center', height: '100%'}}>
        <div style={{flex: 1}}>
          <T size={86}>É só deixar</T>
          <T size={100} serif cor={COR.terracota}>o livro lá.</T>
          <T size={46} peso={700} cor={COR.olivaEscuro} style={{marginTop: 34, lineHeight: 1.3}}>
            Livro, revista, gibi, apostila: tudo que tem páginas serve.
          </T>
        </div>
        <Foto src="fotos/caixa-frente.jpg" w={420} h={730} />
      </div>
    </Lamina>

    <Lamina i={3} fundo={COR.creme}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 110}}>
        <Icone w={220} />
        <T size={84} style={{marginTop: 50}}>Não passa por lá?</T>
        <T size={104} serif cor={COR.terracota}>A gente resolve.</T>
        <T size={48} peso={700} cor={COR.olivaEscuro} style={{marginTop: 36, lineHeight: 1.3}}>Manda uma mensagem no Direct<br />ou pelo site, no link da bio.</T>
        <div style={{marginTop: 50}}><Botao>Manda no Direct</Botao></div>
      </div>
    </Lamina>

    <div style={{position: 'absolute', left: W - 120, top: 1020, rotate: '-7deg'}}>
      <Livro w={220} capa={COR.terracota} />
    </div>
  </AbsoluteFill>
);

// ---------- Stories (seg, qua, sex) ----------
export const StorySeg3: React.FC = () => (
  <Story fundo={COR.oliva} texto={COR.creme} destaque={COR.cremeEscuro} capa="stories/capa-seg3.jpg" giro={-4} iconeBranco
    linha1="Chegou" enfase="doação!" apoio="Cada livro vai ganhar um destino." />
);
export const StoryQua3: React.FC = () => (
  <Story fundo={COR.creme} texto={COR.oliva} destaque={COR.terracota} capa="stories/capa-qua3.jpg" giro={3} iconeBranco={false}
    linha1="Já viu o acervo" enfase="do Livros & Patinhas?" apoio="Cada compra ajuda um animal." />
);
export const StorySex3: React.FC = () => (
  <Story fundo={COR.olivaEscuro} texto={COR.creme} destaque={COR.cremeEscuro} capa="stories/capa-sex3.jpg" giro={-3} iconeBranco
    linha1="Fim de ano," enfase="estante arrumada." apoio="E o que sobrou vai para quem precisa." />
);

// ---------- SÁB · Qual livro marcou a sua infância? (foto única) ----------
// Conceito: uma pilha torta de livros coloridos "conversa" com quem lê por um balão; pergunta aberta para comentários.
export const INFANCIA: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    <div style={{position: 'absolute', left: M, top: M, right: M}}>
      <T size={42} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>PERGUNTA DE SÁBADO</T>
      <T size={110} style={{marginTop: 34}}>Qual livro</T>
      <T size={110}>marcou a sua</T>
      <T size={140} serif cor={COR.terracota} style={{lineHeight: 1}}>infância?</T>
    </div>
    {/* pilha de livros */}
    {[
      {x: 640, y: 1110, w: 300, c: COR.oliva, r: -2},
      {x: 660, y: 994, w: 270, c: COR.terracota, r: 3},
      {x: 650, y: 880, w: 250, c: COR.olivaEscuro, r: -4},
      {x: 690, y: 768, w: 220, c: '#8A8F5A', r: 5},
    ].map((l, i) => (
      <div key={i} style={{position: 'absolute', left: l.x, top: l.y, width: l.w, height: 120, rotate: `${l.r}deg`, borderRadius: 14,
        backgroundColor: l.c, boxShadow: 'inset 0 -14px 0 rgba(0,0,0,0.12), 0 10px 24px rgba(63,68,36,0.18)'}}>
        <div style={{position: 'absolute', left: 26, right: 60, top: 40, height: 12, borderRadius: 6, backgroundColor: COR.creme, opacity: 0.8}} />
        <div style={{position: 'absolute', left: 26, right: 120, top: 66, height: 9, borderRadius: 5, backgroundColor: COR.creme, opacity: 0.5}} />
      </div>
    ))}
    {/* balão */}
    <div style={{position: 'absolute', left: M, top: 760, width: 520, backgroundColor: COR.branco, borderRadius: 44, padding: '40px 44px',
      boxShadow: '0 18px 44px rgba(63,68,36,0.14)'}}>
      <T size={54} peso={800} cor={COR.olivaEscuro} style={{lineHeight: 1.15}}>Conta aqui nos comentários!</T>
      <svg width="80" height="60" viewBox="0 0 80 60" style={{position: 'absolute', right: 60, bottom: -48}}>
        <path d="M0 0 L80 0 L70 60 Z" fill={COR.branco} />
      </svg>
    </div>
    <div style={{position: 'absolute', left: M, top: 1090, width: 520}}>
      <T size={38} peso={600} cor={COR.oliva} style={{lineHeight: 1.3}}>E se ele estiver parado na estante, pode marcar a infância de outra criança.</T>
    </div>
  </AbsoluteFill>
);

// ---------- Story extra · 174 livros para a Biblioteca BECEI (26/11) ----------
export const StoryBecei: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.oliva}}>
    <div style={{position: 'absolute', top: 280, left: 90, right: 90, textAlign: 'center'}}>
      <T size={44} peso={800} cor={COR.cremeEscuro} style={{letterSpacing: 4}}>ENTREGA DE HOJE</T>
      <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 132, lineHeight: 1, color: COR.creme, marginTop: 16, whiteSpace: 'nowrap'}}>174 livros</div>
      <T size={54} peso={800} cor={COR.creme} style={{marginTop: 14}}>para a Biblioteca BECEI,</T>
      <T size={54} peso={800} cor={COR.creme}>em Paraisópolis</T>
    </div>
    <div style={{position: 'absolute', top: 700, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{width: 560, height: 764, rotate: '-3deg', borderRadius: 28, overflow: 'hidden', border: `12px solid ${COR.branco}`, boxShadow: '0 30px 60px #00000040'}}>
        <Img src={staticFile('fotos/becei-story.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover', objectPosition: '50% 60%'}} />
      </div>
    </div>
    <div style={{position: 'absolute', top: 1530, left: 80, right: 80, textAlign: 'center'}}>
      <T size={60} serif cor={COR.creme}>Acabaram de chegar à</T>
      <T size={54} peso={800} cor={COR.cremeEscuro} style={{marginTop: 6}}>@biblioteca_becei</T>
    </div>
  </AbsoluteFill>
);
