/**
 * Barril do `baluarte-shell` — a superfície pública da casca visual.
 *
 * Isto é o que os outros domínios podem importar quando declaram
 * `precisa: ['baluarte-shell']`. Nada fora daqui é público, mesmo estando no
 * repositório: quem importar `./src/motores/hero3d.js` direto fura o contrato
 * e quebra quando o arquivo mudar de lugar.
 *
 * A divisão é proposital:
 *
 * - **motores visuais** são públicos — herói WebGL, efeitos, atmosfera e o
 *   tema de universos aparecem em página de outros domínios (o `/perfil` usa
 *   os três primeiros). Sem expor, cada domínio recriaria o seu, e o site
 *   deixaria de ter uma linguagem visual só;
 * - **layout e páginas são privados** — quem monta shell, sidebar e header é o
 *   orquestrador, não um domínio. Um domínio que monte a própria casca vira
 *   um segundo site dentro do site.
 *
 * As folhas de estilo saem por subcaminho (`baluarte-shell/estilos/*.css`),
 * declarado no `exports` do package.json.
 */

/* --- Efeitos (porta vanilla do react-bits — NÃO usar React) --------------- */
export { attachSpotlight, attachTilt, shiny, decryptText, decryptTitles } from './motores/effects.js';

/* --- Heróis e fundos ----------------------------------------------------- */
export { createHeroWebGL, heroSkinColors } from './motores/hero-webgl.js';
export { createHeroField } from './motores/hero3d.js';
export { buildImmersiveHero } from './motores/immersive.js';
export { mountSpline } from './motores/spline-embed.js';

/* --- Ambiente e movimento ------------------------------------------------ */
export { mountAtmosphere } from './motores/atmosphere.js';
export { mountCardSpotlight } from './motores/card-spotlight.js';
export { revealScan } from './motores/scroll-reveal.js';
export { mountScrollProgress } from './motores/scroll-progress.js';

/* `playBootIntro` NÃO entra no barril de propósito: ele importa a própria
 * folha de estilo, e import de CSS derruba qualquer consumidor que carregue
 * este barril fora do Vite — inclusive os testes dos outros domínios. Quem
 * toca a intro é o orquestrador, no boot, onde o Vite está presente:
 * `import { playBootIntro } from 'baluarte-shell/src/motores/boot-intro.js'`. */

/* --- Tema de universos (skin do site inteiro) ---------------------------- */
export {
  UNIVERSE_THEMES, UNIVERSE_SKINS,
  applyUniverse, getUniverseId, setUniverse, initUniverse,
} from './motores/universe-theme.js';

/* --- Destaques da home (contrato §1.2) ----------------------------------- */
/* Público porque o ORQUESTRADOR alimenta o registro pelo `iniciar(ctx)`.
 * Domínio nenhum deveria chamar isto — quem tem destaque, declara no próprio
 * manifesto. */
export { definirDestaques } from './destaques.js';

/** Versão do contrato implementado. O orquestrador recusa major diferente. */
export const CONTRATO = '1.1.0';
