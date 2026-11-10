import {Config} from '@remotion/cli/config';

// O download do navegador próprio do Remotion é bloqueado neste ambiente;
// usamos o chrome-headless-shell já instalado (Playwright).
Config.setBrowserExecutable('/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell');
Config.setChromeMode('headless-shell');
