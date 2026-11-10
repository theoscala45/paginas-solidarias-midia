"""Gera a página de aprovação semanal da Danny.
uso: python3 pagina_aprovacao.py semana.json saida/index.html
semana.json: {"titulo": "...", "eyebrow": "...", "intro": "...",
  "pecas": [{"cod": "SEG-01", "versao": 1, "titulo": "...", "funcao": "...", "formato": "Reel · 15 s",
             "dia": "Segunda", "hora": "19h", "ideia": "...", "tipo": "video|carrossel|imagem",
             "midia": ["midia/SEG-01.mp4"], "capa": "midia/capa-SEG-01.jpg", "alts": ["..."],
             "dica": "...", "legenda": "...", "pendencias": ["..."]}]}
Os arquivos de mídia são copiados à parte para saida/midia/.
"""
import html, json, os, sys
AQUI = os.path.dirname(os.path.abspath(__file__))
cfg = json.load(open(sys.argv[1])); saida = sys.argv[2]
head = open(os.path.join(AQUI, 'modelo/head.html')).read()
head = head.replace('<title>Aprovação do lote 2</title>', f"<title>{html.escape(cfg['titulo'])}</title>")
script = open(os.path.join(AQUI, 'modelo/script.html')).read()
e = html.escape
linhas, fichas = [], []
for p in cfg['pecas']:
    cod = p['cod']; cid = cod.lower()
    linhas.append(f"<tr><td class=\"cod\">{e(cod)}</td><td>{e(p['titulo'])}</td><td>{e(p['formato'])}</td><td>{e(p['dia'])}</td><td>{e(p['hora'])}</td></tr>")
    if p['tipo'] == 'video':
        midia = f"<video src=\"{p['midia'][0]}\" poster=\"{p.get('capa', '')}\" controls loop playsinline preload=\"metadata\"></video>"
    elif p['tipo'] == 'carrossel':
        imgs = ''.join(f"<img src=\"{m}\" alt=\"{e(a)}\">" for m, a in zip(p['midia'], p.get('alts', [''] * len(p['midia']))))
        midia = f"<div class=\"carrossel\" aria-label=\"Lâminas do carrossel {e(cod)}\">{imgs}</div>"
    else:
        midia = f"<img class=\"unica\" src=\"{p['midia'][0]}\" alt=\"{e(p.get('alts', [''])[0])}\">"
    pend = ''
    if p.get('pendencias'):
        pend = '<div><div class="rotulo">Para conferir</div><ul class="pend">' + ''.join(f'<li>{e(x)}</li>' for x in p['pendencias']) + '</ul></div>'
    fichas.append(f'''
  <article class="peca" id="{cid}">
    <div class="midia">{midia}<p class="dica">{e(p.get('dica', ''))}</p></div>
    <div class="info">
      <div class="cabeca"><span class="cod">{e(cod)} · v{p.get('versao', 1)}</span><h2>{e(p['titulo'])}</h2></div>
      <div class="chips"><span class="chip forte">{e(p['funcao'])}</span><span class="chip">{e(p['formato'])}</span><span class="chip">{e(p['dia'])} · {e(p['hora'])}</span></div>
      <p class="ideia">{e(p['ideia'])}</p>
      <div><div class="rotulo">Legenda</div><div class="legenda" id="leg-{cid}">{e(p['legenda'])}</div></div>
      <div class="acoes"><button class="copiar" data-alvo="leg-{cid}" type="button">Copiar legenda</button><span class="ok" aria-live="polite"></span></div>
      {pend}
    </div>
  </article>''')
corpo = f'''<body>
<main>
  <header class="topo">
    <div class="eyebrow">{e(cfg.get('eyebrow', ''))}</div>
    <h1>{e(cfg['titulo'])}</h1>
    <p class="intro">{e(cfg.get('intro', ''))}</p>
    <section class="como" aria-labelledby="como-aprovar">
      <h2 id="como-aprovar">Como aprovar</h2>
      <ol>
        <li>Assista ou passe as imagens de cada peça e leia a legenda ao lado. Os Reels têm som: aumente o volume.</li>
        <li>No chat, responda com o código: <code>OK final {e(cfg['pecas'][0]['cod'])}</code> para aprovar como está, ou <code>Ajustar {e(cfg['pecas'][0]['cod'])}:</code> seguido do que mudar.</li>
        <li>Só o que tiver <code>OK final</code> vai para a fila do Buffer, no dia e horário combinados.</li>
      </ol>
    </section>
  </header>
  <section aria-labelledby="agenda-titulo">
    <div class="rotulo" id="agenda-titulo">Calendário da semana (horário de São Paulo)</div>
    <div class="agenda-wrap"><table class="agenda">
      <thead><tr><th>Código</th><th>Peça</th><th>Formato</th><th>Dia</th><th>Horário</th></tr></thead>
      <tbody>{''.join(linhas)}</tbody>
    </table></div>
  </section>
{''.join(fichas)}
  <footer>Feito em código, nas cores e fontes da marca. Para mudar algo, diga o código da peça e o que mudar; cada ajuste vira uma nova versão (v2, v3).</footer>
</main>
{script}
</body>
</html>
'''
os.makedirs(os.path.dirname(saida) or '.', exist_ok=True)
open(saida, 'w').write(head + corpo)
print('ok', saida)
