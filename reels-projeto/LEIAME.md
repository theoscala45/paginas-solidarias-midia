# Projeto Remotion dos Reels do Páginas Solidárias

- `src/`: composições (R1–R5 de teste, posts P1–P5), biblioteca comum (`lib.tsx`) e marca (`brand.ts`).
- `public/`: logos com fundo transparente e fontes (Montserrat e Playfair Display, licença OFL).
- `som/`: roteiros de som de cada Reel (tempo de cada efeito e música), usados por `ferramentas/mixar.py`.

Para usar numa sessão nova: copie esta pasta para `/home/claude/reels`, rode `npm install`
e `npm install @remotion/fonts @remotion/transitions` (mesma versão do `remotion`), e confira o navegador em `remotion.config.ts`.

Os efeitos e músicas da Mixkit **não** ficam aqui (a licença não permite redistribuir os arquivos).
Eles ficam em `/home/claude/sfx/` e `/home/claude/musica/biblioteca/` na sessão; se sumirem, peça de novo ao Theo.
As músicas originais aprovadas ficam em `musica-original/`.
