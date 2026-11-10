import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const COR = {
  oliva: '#606637',
  olivaEscuro: '#3F4424',
  creme: '#F4EDE0',
  cremeEscuro: '#E6DCC8',
  terracota: '#B65A34',
  branco: '#FFFFFF',
};

export const SANS = 'Montserrat';
export const SERIF = 'Playfair Display';

const fontes = [
  {family: SANS, file: 'montserrat-latin-500-normal.woff2', weight: '500'},
  {family: SANS, file: 'montserrat-latin-700-normal.woff2', weight: '700'},
  {family: SANS, file: 'montserrat-latin-800-normal.woff2', weight: '800'},
  {family: SANS, file: 'montserrat-latin-900-normal.woff2', weight: '900'},
  {family: SERIF, file: 'playfair-display-latin-700-normal.woff2', weight: '700'},
  {family: SERIF, file: 'playfair-display-latin-700-italic.woff2', weight: '700', style: 'italic'},
];

export const carregarFontes = () =>
  Promise.all(
    fontes.map((f) =>
      loadFont({
        family: f.family,
        url: staticFile(`fonts/${f.file}`),
        weight: f.weight,
        style: f.style ?? 'normal',
      }),
    ),
  );
