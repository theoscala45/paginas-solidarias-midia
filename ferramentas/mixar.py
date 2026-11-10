import json, subprocess, sys
# uso: mixar.py eventos.json video.mp4 saida.mp4
# eventos: {"dur": s, "eventos": [[tempo_s, "arquivo", ganho_db, corte_s_ou_null], ...]}
cfg = json.load(open(sys.argv[1])); video, saida = sys.argv[2], sys.argv[3]
ev = cfg['eventos']; dur = cfg['dur']
args = ['ffmpeg', '-v', 'error', '-y']
for e in ev:
    args += ['-i', f"/home/claude/sfx/{e[1]}"]
parts = []
for i, (t, _, g, corte) in enumerate(ev):
    trim = f"atrim=0:{corte}," if corte else ""
    fade = f"afade=t=out:st={max(0, corte - 0.08)}:d=0.08," if corte else ""
    ms = int(t * 1000)
    parts.append(f"[{i}:a]aformat=sample_rates=48000:channel_layouts=stereo,{trim}{fade}volume={g}dB,adelay={ms}|{ms}[a{i}]")
mix = ''.join(f"[a{i}]" for i in range(len(ev)))
mus = cfg.get('musica')
if mus:
    # música por baixo: entra suave, sai suave e abaixa sozinha quando um efeito toca
    j = len(ev)
    args += ['-i', mus['arquivo']]
    ini = mus.get('inicio', 0)
    parts.append(f"{mix}amix=inputs={len(ev)}:normalize=0,aecho=0.8:0.6:35|70:0.12|0.06,apad=whole_dur={dur},atrim=0:{dur},asplit=2[sfx][chave]")
    parts.append(f"[{j}:a]aformat=sample_rates=48000:channel_layouts=stereo,atrim={ini}:{ini + dur},asetpts=PTS-STARTPTS,"
                 f"afade=t=in:st=0:d=0.4,afade=t=out:st={dur - 1.2}:d=1.2,volume={mus.get('ganho_db', -10)}dB[mus]")
    parts.append("[mus][chave]sidechaincompress=threshold=0.03:ratio=5:attack=4:release=220:makeup=1[musd]")
    parts.append(f"[sfx][musd]amix=inputs=2:normalize=0,loudnorm=I=-16:TP=-3.5:LRA=11,volume=1dB,alimiter=limit=0.56:level=0[m]")
else:
    parts.append(f"{mix}amix=inputs={len(ev)}:normalize=0,aecho=0.8:0.6:35|70:0.12|0.06,apad=whole_dur={dur},atrim=0:{dur},"
                 f"loudnorm=I=-16:TP=-3.5:LRA=11,volume=4dB,alimiter=limit=0.6:level=0[m]")
args += ['-filter_complex', ';'.join(parts), '-map', '[m]', '-ar', '48000', '/tmp/mix.wav']
subprocess.run(args, check=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-i', '/tmp/mix.wav', '-map', '0:v', '-map', '1:a', '-c:v', 'copy',
                '-c:a', 'aac', '-b:a', '192k', '-shortest', saida], check=True)
r = subprocess.run(['ffmpeg', '-hide_banner', '-i', saida, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
print('\n'.join(l for l in r.splitlines()[-12:] if any(k in l for k in ('I:', 'Peak:', 'LRA:'))))
