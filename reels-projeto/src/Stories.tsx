import React from 'react';
import {AbsoluteFill, Img, staticFile} from 'remotion';
import {COR, SANS, SERIF} from './brand';
import {Icone} from './lib';

// Stories da semana 16–22/11: chamam para o vídeo do dia (seg, qua, sex), 1 hora depois do post.
type Props = {
  fundo: string; texto: string; destaque: string; capa: string;
  linha1: string; enfase: string; linha2?: string; apoio: string; giro: number; iconeBranco: boolean;
};

const Story: React.FC<Props> = ({fundo, texto, destaque, capa, linha1, enfase, linha2, apoio, giro, iconeBranco}) => (
  <AbsoluteFill style={{backgroundColor: fundo}}>
    {/* selo */}
    <div style={{position: 'absolute', top: 300, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 16, border: `3px solid ${texto}`, borderRadius: 999, padding: '12px 30px'}}>
        <Icone w={48} branco={iconeBranco} />
        <div style={{fontFamily: SANS, fontWeight: 800, fontSize: 40, letterSpacing: 3, color: texto}}>VÍDEO NOVO NO PERFIL</div>
      </div>
    </div>
    {/* título */}
    <div style={{position: 'absolute', top: 420, left: 90, right: 90, textAlign: 'center', fontFamily: SANS, fontWeight: 900,
      fontSize: 92, lineHeight: 1.08, color: texto}}>
      {linha1}{' '}
      <span style={{whiteSpace: 'nowrap', fontFamily: SERIF, fontStyle: 'italic', fontWeight: 700, color: destaque}}>{enfase}</span>
      {linha2 ? <> {linha2}</> : null}
    </div>
    {/* capa do vídeo */}
    <div style={{position: 'absolute', top: 760, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{width: 430, height: 764, rotate: `${giro}deg`, borderRadius: 28, overflow: 'hidden', border: `12px solid ${COR.branco}`,
        boxShadow: '0 30px 60px #00000040', position: 'relative'}}>
        <Img src={staticFile(capa)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        <div style={{position: 'absolute', left: 34, top: 34, width: 96, height: 96, borderRadius: 999,
          backgroundColor: '#000000AA', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <svg width="44" height="44" viewBox="0 0 10 10"><path d="M3 1.5 L8.5 5 L3 8.5 Z" fill={COR.branco} /></svg>
        </div>
      </div>
    </div>
    {/* apoio */}
    <div style={{position: 'absolute', top: 1600, left: 70, right: 70, textAlign: 'center', fontFamily: SANS, fontWeight: 700,
      fontSize: 46, lineHeight: 1.2, color: texto}}>
      {apoio}
    </div>
  </AbsoluteFill>
);

export const StorySeg: React.FC = () => (
  <Story fundo={COR.oliva} texto={COR.creme} destaque={COR.cremeEscuro} capa="stories/capa-seg.jpg" giro={-4} iconeBranco
    linha1="Chegaram" enfase="61 livros." apoio="Cada um vai ganhar um destino." />
);

export const StoryQua: React.FC = () => (
  <Story fundo={COR.creme} texto={COR.oliva} destaque={COR.terracota} capa="stories/capa-qua.jpg" giro={3} iconeBranco={false}
    linha1="Livro rasgado vai pro" enfase="lixo?" apoio="A resposta está no vídeo de hoje." />
);

export const StorySex: React.FC = () => (
  <Story fundo={COR.olivaEscuro} texto={COR.creme} destaque={COR.cremeEscuro} capa="stories/capa-sex.jpg" giro={-3} iconeBranco
    linha1="Para onde vai o seu" enfase="livro?" apoio="São três caminhos. Vai lá ver." />
);
