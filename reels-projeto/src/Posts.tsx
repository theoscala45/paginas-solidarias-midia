import React from 'react';
import {AbsoluteFill} from 'remotion';
import {COR, SANS} from './brand';
import {Biblioteca, Icone, Livro, Pata, Reciclar, T} from './lib';

// Carrosséis são desenhados como um panorama (N × 1080 de largura) e depois fatiados em lâminas.
// Assim os elementos atravessam a borda de uma lâmina para a outra.
const W = 1080;
const H = 1350;
const M = 80;

const Lamina: React.FC<{i: number; fundo: string; children?: React.ReactNode}> = ({i, fundo, children}) => (
  <div style={{position: 'absolute', left: i * W, top: 0, width: W, height: H, backgroundColor: fundo}}>
    <div style={{position: 'absolute', left: M, top: M, right: M, bottom: M}}>{children}</div>
  </div>
);

const Passo: React.FC<{n: string; cor: string}> = ({n, cor}) => (
  <T size={240} serif cor={cor} style={{lineHeight: 1.05}}>{n}</T>
);

const Lombada: React.FC<{txt: string; w: number; cor: string; tc: string; rot?: number}> = ({txt, w, cor, tc, rot = 0}) => (
  <div style={{width: w, height: 78, borderRadius: 12, backgroundColor: cor, display: 'flex', alignItems: 'center', justifyContent: 'center',
    rotate: `${rot}deg`, boxShadow: '0 5px 0 rgba(0,0,0,0.14)', fontFamily: SANS, fontWeight: 900, fontSize: 44, color: tc, marginTop: 6}}>
    {txt}
  </div>
);

// ───────────────────────── TST-P1 · Como doar em 3 passos (carrossel, 5 lâminas)
export const P1_LAMINAS = 5;
export const P1: React.FC = () => {
  const linhaY = 1220;
  return (
    <AbsoluteFill style={{backgroundColor: COR.creme}}>
      <Lamina i={0} fundo={COR.creme}>
        <T size={40} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>GUIA RÁPIDO</T>
        <T size={120} style={{marginTop: 40}}>Doar um livro</T>
        <T size={130} serif cor={COR.terracota}>é mais fácil</T>
        <T size={120}>do que</T>
        <T size={120}>parece.</T>
        <T size={48} peso={700} cor={COR.olivaEscuro} style={{marginTop: 50}}>3 passos. Arraste para o lado →</T>
      </Lamina>
      <Lamina i={1} fundo={COR.oliva}>
        <Passo n="1" cor={COR.creme} />
        <T size={100} cor={COR.branco} style={{marginTop: 10}}>Junte os livros.</T>
        <T size={50} peso={600} cor={COR.creme} style={{marginTop: 30, lineHeight: 1.3}}>
          Qualquer tipo serve: romance, didático, infantil. Até os rabiscados e os rasgados.
        </T>
        <div style={{position: 'absolute', right: 0, top: 690, display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
          <Lombada txt="Romance" w={480} cor={COR.cremeEscuro} tc={COR.oliva} rot={-2} />
          <Lombada txt="Didático" w={560} cor={COR.terracota} tc={COR.creme} rot={1.5} />
          <Lombada txt="Infantil" w={440} cor={COR.olivaEscuro} tc={COR.creme} rot={-1} />
        </div>
      </Lamina>
      <Lamina i={2} fundo={COR.creme}>
        <Passo n="2" cor={COR.terracota} />
        <T size={100} style={{marginTop: 10}}>Mande uma mensagem.</T>
        <T size={50} peso={600} cor={COR.olivaEscuro} style={{marginTop: 30, lineHeight: 1.3}}>
          No Direct do @paginas_solidariasbr ou pelo site, no link da bio.
        </T>
        <div style={{position: 'absolute', left: 0, right: 0, top: 720, backgroundColor: COR.branco, border: `5px solid ${COR.oliva}`, borderRadius: 50,
          padding: '40px 50px', boxShadow: '0 20px 50px rgba(63,68,36,0.15)'}}>
          <span style={{fontFamily: SANS, fontWeight: 700, fontSize: 56, color: COR.olivaEscuro}}>Oi! Tenho livros para doar.</span>
        </div>
      </Lamina>
      <Lamina i={3} fundo={COR.olivaEscuro}>
        <T size={200} serif cor={COR.terracota} style={{lineHeight: 1.05}}>3</T>
        <T size={92} cor={COR.branco} style={{marginTop: 0}}>A gente cuida do resto.</T>
        <T size={46} peso={600} cor={COR.creme} style={{marginTop: 20, lineHeight: 1.3}}>Cada livro passa pela triagem e ganha um destino:</T>
        <div style={{marginTop: 36, display: 'flex', flexDirection: 'column', gap: 22}}>
          {[
            {ic: <Pata size={64} />, cor: COR.terracota, t: 'Venda', d: 'no Livros & Patinhas, para ajudar ONGs de animais'},
            {ic: <Biblioteca size={64} />, cor: COR.oliva, t: 'Doação', d: 'para a Biblioteca BECEI, em Paraisópolis'},
            {ic: <Reciclar size={64} />, cor: '#5B6136', t: 'Reciclagem', d: 'responsável, com a Tramah'},
          ].map((r) => (
            <div key={r.t} style={{display: 'flex', alignItems: 'center', gap: 26}}>
              <div style={{width: 100, height: 100, borderRadius: 50, backgroundColor: r.cor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0}}>{r.ic}</div>
              <div>
                <T size={54} cor={COR.branco}>{r.t}</T>
                <T size={40} peso={600} cor={COR.creme} style={{lineHeight: 1.25}}>{r.d}</T>
              </div>
            </div>
          ))}
        </div>
      </Lamina>
      <Lamina i={4} fundo={COR.creme}>
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 70}}>
          <Icone w={250} />
          <T size={130} serif cor={COR.terracota} style={{marginTop: 50}}>Salve este post</T>
          <T size={70} style={{marginTop: 10}}>para quando arrumar a estante.</T>
          <div style={{marginTop: 50, backgroundColor: COR.oliva, color: COR.branco, fontFamily: SANS, fontWeight: 800, fontSize: 48, padding: '22px 50px', borderRadius: 999}}>
            @paginas_solidariasbr
          </div>
        </div>
      </Lamina>

      {/* o caminho: uma linha que atravessa todas as lâminas, com um ponto por passo */}
      <div style={{position: 'absolute', left: 560, top: linhaY, width: 4 * W - 300, height: 12, borderRadius: 6, backgroundColor: COR.terracota}} />
      {[1, 2, 3].map((p) => (
        <div key={p} style={{position: 'absolute', left: p * W + 160 - 34, top: linhaY - 28, width: 68, height: 68, borderRadius: 34, backgroundColor: COR.terracota,
          border: `8px solid ${COR.creme}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SANS, fontWeight: 900, fontSize: 30, color: COR.creme}}>
          {p}
        </div>
      ))}
      {/* livro que atravessa da lâmina 1 para a 2 */}
      <div style={{position: 'absolute', left: W - 150, top: 860, rotate: '-8deg'}}>
        <Livro w={240} capa={COR.terracota} />
      </div>
      {/* ponta da linha chegando na última lâmina */}
      <div style={{position: 'absolute', left: 4 * W + 260 - 40, top: linhaY - 34, width: 80, height: 80, borderRadius: 40, backgroundColor: COR.oliva, border: `8px solid ${COR.creme}`}} />
    </AbsoluteFill>
  );
};

// ───────────────────────── TST-P2 · 100% doado (imagem única)
export const P2: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.oliva}}>
    <div style={{position: 'absolute', left: M, right: M, top: M, bottom: M, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'}}>
      <T size={38} peso={800} cor={COR.cremeEscuro} style={{letterSpacing: 5, marginTop: 10}}>PRESTAÇÃO DE CONTAS · 11 MESES</T>
      <T size={104} cor={COR.creme} style={{marginTop: 50}}>Cada real</T>
      <T size={124} serif cor={COR.branco}>foi doado.</T>
      <div style={{marginTop: 60, display: 'flex', alignItems: 'flex-start', gap: 14}}>
        <T size={76} cor={COR.creme} style={{marginTop: 26}}>R$</T>
        <div style={{fontFamily: SANS, fontWeight: 900, fontSize: 190, lineHeight: 1, color: COR.branco, textShadow: '0 0 60px rgba(244,237,224,0.25)'}}>44.450</div>
      </div>
      <div style={{width: 600, height: 16, borderRadius: 8, backgroundColor: COR.terracota, marginTop: 20}} />
      <div style={{marginTop: 40, display: 'flex', alignItems: 'center', gap: 30}}>
        <div style={{rotate: '-6deg', borderRadius: 22, padding: '8px 26px', backgroundColor: COR.terracota, fontFamily: SANS, fontWeight: 900, fontSize: 64,
          color: COR.branco, boxShadow: '0 12px 30px rgba(0,0,0,0.2)'}}>100%</div>
        <T size={46} peso={700} cor={COR.creme} style={{textAlign: 'left', lineHeight: 1.2}}>arrecadado e<br />repassado a ONGs</T>
      </div>
      <div style={{marginTop: 70, display: 'flex', gap: 60}}>
        {[
          {n: '1.280', t: 'livros vendidos'},
          {n: '38', t: 'projetos beneficiados'},
        ].map((x) => (
          <div key={x.n} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <T size={96} cor={COR.branco}>{x.n}</T>
            <T size={40} peso={600} cor={COR.creme}>{x.t}</T>
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <T size={32} peso={500} cor={COR.cremeEscuro}>Dados de dez/2025 a 9/11/2026</T>
        <Icone w={110} branco />
      </div>
    </div>
  </AbsoluteFill>
);

// ───────────────────────── TST-P3 · Verdade ou mito? (carrossel, 6 lâminas)
const AFIRMACOES = [
  {frase: 'Só aceitam livro em bom estado.', resp: 'MITO', expl: 'Aceitamos qualquer livro. Os rasgados e rabiscados seguem para reciclagem responsável com a Tramah.'},
  {frase: 'O dinheiro das vendas fica com o projeto.', resp: 'MITO', expl: '100% é repassado a ONGs. Em 11 meses, foram R$ 44.450 doados.'},
  {frase: 'Os livros doados vão para Paraisópolis.', resp: 'VERDADE', expl: '4.162 livros já foram para a Biblioteca BECEI, em Paraisópolis.'},
  {frase: 'O Livros & Patinhas é outro projeto.', resp: 'MITO', expl: 'É a frente de vendas do Páginas Solidárias. Cada livro vendido ajuda ONGs que cuidam de animais.'},
];
export const P3_LAMINAS = 6;
const Carimbo: React.FC<{resp: string}> = ({resp}) => {
  const cor = resp === 'MITO' ? COR.terracota : COR.oliva;
  return (
    <div style={{display: 'inline-block', rotate: resp === 'MITO' ? '-7deg' : '5deg', border: `10px solid ${cor}`, borderRadius: 24, padding: '8px 40px',
      fontFamily: SANS, fontWeight: 900, fontSize: 120, letterSpacing: 6, color: cor, backgroundColor: '#FFFFFF66'}}>
      {resp}
    </div>
  );
};
export const P3: React.FC = () => (
  <AbsoluteFill style={{backgroundColor: COR.creme}}>
    <Lamina i={0} fundo={COR.oliva}>
      <div style={{paddingTop: 120}}>
        <T size={150} cor={COR.branco}>Verdade</T>
        <T size={110} peso={700} cor={COR.creme}>ou</T>
        <T size={200} serif cor={COR.terracota} style={{lineHeight: 1}}>mito?</T>
        <T size={52} peso={700} cor={COR.creme} style={{marginTop: 60, lineHeight: 1.3}}>4 coisas que a gente ouve sobre doar livros. Quantas você acerta?</T>
      </div>
    </Lamina>
    {AFIRMACOES.map((a, i) => (
      <Lamina key={a.frase} i={i + 1} fundo={i % 2 === 0 ? COR.creme : COR.cremeEscuro}>
        <T size={40} peso={800} cor={COR.terracota} style={{letterSpacing: 4}}>{`${i + 1} DE 4`}</T>
        <T size={200} serif cor={COR.terracota} style={{lineHeight: 0.6, marginTop: 50}}>“</T>
        <T size={96} style={{marginTop: -10, lineHeight: 1.12}}>{a.frase}</T>
        <div style={{marginTop: 60}}><Carimbo resp={a.resp} /></div>
        <T size={48} peso={600} cor={COR.olivaEscuro} style={{marginTop: 50, lineHeight: 1.32}}>{a.expl}</T>
      </Lamina>
    ))}
    <Lamina i={5} fundo={COR.oliva}>
      <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 110}}>
        <T size={120} cor={COR.branco}>Quantas você</T>
        <T size={150} serif cor={COR.terracota}>acertou?</T>
        <T size={56} peso={700} cor={COR.creme} style={{marginTop: 30}}>Conta aqui nos comentários.</T>
        <T size={52} peso={800} cor={COR.creme} style={{marginTop: 80}}>Tem livro para doar?</T>
        <div style={{marginTop: 24, backgroundColor: COR.creme, color: COR.oliva, fontFamily: SANS, fontWeight: 800, fontSize: 48, padding: '22px 52px', borderRadius: 999}}>
          Manda no Direct
        </div>
        <div style={{marginTop: 70}}><Icone w={150} branco /></div>
      </div>
    </Lamina>
    {/* fita de lombadas que corre pela base de todas as lâminas */}
    <div style={{position: 'absolute', left: 0, top: H - 92, width: 6 * W, height: 92, display: 'flex', alignItems: 'flex-end', gap: 6, overflow: 'hidden'}}>
      {Array.from({length: 90}).map((_, j) => {
        const cores = [COR.terracota, COR.olivaEscuro, COR.cremeEscuro, COR.oliva, '#8E4426'];
        const larg = 40 + ((j * 37) % 5) * 12;
        const alt = 56 + ((j * 53) % 4) * 10;
        return <div key={j} style={{width: larg, height: alt, backgroundColor: cores[(j * 7) % 5], borderRadius: '6px 6px 0 0', flexShrink: 0, border: '3px solid #00000014'}} />;
      })}
    </div>
  </AbsoluteFill>
);
