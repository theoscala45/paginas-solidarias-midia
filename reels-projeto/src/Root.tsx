import React from 'react';
import {Composition, Still} from 'remotion';
import {Teste, TESTE_DURACAO} from './Teste';
import {R1, R1_DURACAO} from './R1';
import {R2, R2_DURACAO} from './R2';
import {R3, R3_DURACAO} from './R3';
import {R4, R4_DURACAO} from './R4';
import {R5, R5_DURACAO} from './R5';
import {P1, P1_LAMINAS, P2, P3, P3_LAMINAS} from './Posts';
import {P4, P4_LAMINAS, P5} from './Posts2';
import {carregarFontes} from './brand';

carregarFontes();

export const RemotionRoot: React.FC = () => (
  <>
    <Composition id="Teste" component={Teste} durationInFrames={TESTE_DURACAO} fps={30} width={1080} height={1920} />
    <Still id="P4" component={P4} width={1080 * P4_LAMINAS} height={1350} />
    <Still id="P5" component={P5} width={1080} height={1350} />
    <Still id="P1" component={P1} width={1080 * P1_LAMINAS} height={1350} />
    <Still id="P2" component={P2} width={1080} height={1350} />
    <Still id="P3" component={P3} width={1080 * P3_LAMINAS} height={1350} />
    <Composition id="R5" component={R5} durationInFrames={R5_DURACAO} fps={30} width={1080} height={1920} />
    <Composition id="R4" component={R4} durationInFrames={R4_DURACAO} fps={30} width={1080} height={1920} />
    <Composition id="R3" component={R3} durationInFrames={R3_DURACAO} fps={30} width={1080} height={1920} />
    <Composition id="R2" component={R2} durationInFrames={R2_DURACAO} fps={30} width={1080} height={1920} />
    <Composition id="R1" component={R1} durationInFrames={R1_DURACAO} fps={30} width={1080} height={1920} />
  </>
);
