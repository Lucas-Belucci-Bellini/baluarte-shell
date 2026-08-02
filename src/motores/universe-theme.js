/**
 * Motor de Universos — skin completo do site por universo das Crônicas.
 *
 * Cada universo redefine um KIT de design tokens (cor + glow, fundos/superfícies,
 * texto, tipografia e formas) aplicado como CSS custom properties no <html>,
 * mais um `data-universe` que liga a atmosfera (theme-universos.css).
 *
 * Os fundos/superfícies/textos são DERIVADOS da cor primária (mistura com preto/
 * branco), então adicionar um universo custa só { primary, secondary, font, radius }.
 * Nenhuma função do site é tocada — é uma camada 100% visual. `baluarte` = padrão.
 */

import { storage } from 'baluarte-core';
import { applyTheme, getThemeId } from 'baluarte-core';

const KEY = 'ui:universe';

/* ===== util de cor ===== */
function hexToRgb(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(String(hex).trim());
  const n = m ? parseInt(m[1], 16) : 0xd4a24e;
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}
const rgba = (c, a) => `rgba(${c.r}, ${c.g}, ${c.b}, ${a})`;
const mix = (a, b, t) => ({
  r: Math.round(a.r * (1 - t) + b.r * t),
  g: Math.round(a.g * (1 - t) + b.g * t),
  b: Math.round(a.b * (1 - t) + b.b * t)
});
const toHex = (c) => '#' + [c.r, c.g, c.b].map((x) => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0')).join('');

const BLACK = { r: 8, g: 8, b: 11 };
const WHITE = { r: 236, g: 243, b: 255 };
const MUTED = { r: 130, g: 142, b: 160 };
const MUTED_DK = { r: 84, g: 96, b: 116 };

const FONTS = {
  inter: "'Inter', system-ui, sans-serif",
  oswald: "'Oswald', 'Inter', sans-serif",
  cinzel: "'Cinzel', 'Times New Roman', serif",
  mono: "'JetBrains Mono', 'Fira Code', monospace",
  titillium: "'Titillium Web', 'Inter', sans-serif",
  rajdhani: "'Rajdhani', 'Oswald', sans-serif"
};

/* Perf (v0.4.0 #323): as fontes de universo NÃO vão no boot (só as 3 do tema
   Ouro estão no index.html). Aqui carregamos a família sob demanda, uma vez,
   quando um skin de universo que a usa é aplicado. */
const FONT_HREF = {
  inter: 'Inter:wght@300;400;500;600;700',
  oswald: 'Oswald:wght@500;700',
  cinzel: 'Cinzel:wght@500;700',
  mono: 'JetBrains+Mono:wght@400;500;700',
  titillium: 'Titillium+Web:wght@400;600;700',
  rajdhani: 'Rajdhani:wght@500;600;700'
};
const loadedFonts = new Set();
function ensureFont(font) {
  if (!font || !FONT_HREF[font] || loadedFonts.has(font) || typeof document === 'undefined') return;
  loadedFonts.add(font);
  const l = document.createElement('link');
  l.rel = 'stylesheet';
  l.href = `https://fonts.googleapis.com/css2?family=${FONT_HREF[font]}&display=swap`;
  document.head.appendChild(l);
}
const RADII = {
  sharp: { xs: '0', sm: '0', md: '1px', lg: '2px', xl: '3px' },
  mid: { xs: '1px', sm: '2px', md: '3px', lg: '4px', xl: '6px' },
  soft: null /* mantém o padrão do CSS */
};

/** Variantes de cor/glow a partir da primária e secundária. */
function colorVars(primary, secondary) {
  const p = hexToRgb(primary), s = hexToRgb(secondary);
  return {
    '--color-cyan': primary,
    '--color-cyan-soft': rgba(p, 0.15),
    '--color-cyan-edge': rgba(p, 0.4),
    '--color-magenta': secondary,
    '--color-magenta-soft': rgba(s, 0.15),
    '--color-magenta-edge': rgba(s, 0.4),
    '--shadow-glow-cyan': `0 0 16px ${rgba(p, 0.4)}, 0 0 32px ${rgba(p, 0.15)}`,
    '--shadow-glow-cyan-strong': `0 0 24px ${rgba(p, 0.6)}, 0 0 48px ${rgba(p, 0.3)}`,
    '--shadow-glow-magenta': `0 0 16px ${rgba(s, 0.4)}, 0 0 32px ${rgba(s, 0.15)}`,
    '--shadow-glow-magenta-strong': `0 0 24px ${rgba(s, 0.6)}, 0 0 48px ${rgba(s, 0.3)}`
  };
}

/** Kit completo de tokens, com fundos/textos derivados da cor primária. */
function deriveVars(primary, secondary, { font, radius } = {}) {
  const p = hexToRgb(primary);
  const v = {
    ...colorVars(primary, secondary),
    '--color-bg': toHex(mix(BLACK, p, 0.05)),
    '--color-bg-elevated': toHex(mix(BLACK, p, 0.10)),
    '--color-surface': toHex(mix(BLACK, p, 0.15)),
    '--color-surface-2': toHex(mix(BLACK, p, 0.20)),
    '--color-surface-3': toHex(mix(BLACK, p, 0.26)),
    '--color-text-primary': toHex(mix(WHITE, p, 0.08)),
    '--color-text-secondary': toHex(mix(MUTED, p, 0.28)),
    '--color-text-muted': toHex(mix(MUTED_DK, p, 0.22))
  };
  if (font && FONTS[font]) v['--font-display'] = FONTS[font];
  const r = radius && RADII[radius];
  if (r) {
    v['--radius-xs'] = r.xs; v['--radius-sm'] = r.sm; v['--radius-md'] = r.md;
    v['--radius-lg'] = r.lg; v['--radius-xl'] = r.xl;
  }
  return v;
}

/* ===== Configuração por universo (primary/label vêm de universos.js) =====
 * primary opcional sobrescreve a cor base quando um tom afinado fica melhor. */
const SKIN = {
  // Identidades inspiradas nas franquias (paleta/tipografia/atmosfera autênticas).
  doom:            { label: 'DOOM', primary: '#e01510', secondary: '#ff7a18', font: 'oswald', radius: 'sharp' },     // vermelho-sangue + Argent
  'warhammer-40k': { label: 'Warhammer 40.000', primary: '#d8a32a', secondary: '#8c1f1f', font: 'cinzel', radius: 'sharp' },     // dourado imperial gótico
  halo:            { label: 'Halo', primary: '#56a8e6', secondary: '#74c043', font: 'titillium', radius: 'soft' },   // azul UNSC + verde Chief
  transformers:    { label: 'Transformers', primary: '#2474d8', secondary: '#d4242e', font: 'rajdhani', radius: 'mid' },     // azul/vermelho Autobot
  'pacific-rim':   { label: 'Pacific Rim', primary: '#1f8fd6', secondary: '#ff9d00', font: 'rajdhani', radius: 'mid' },     // azul Jaeger + âmbar
  'solo-leveling': { label: 'Solo Leveling', primary: '#7b3ff2', secondary: '#3fc7ff', font: 'cinzel', radius: 'mid' },       // roxo Monarca + azul sombra
  vanadis:         { secondary: '#c81e1e', font: 'cinzel', radius: 'mid' },
  arifureta:       { secondary: '#ffc83d', font: 'cinzel', radius: 'mid' },
  horror:          { label: 'Horror Cósmico', primary: '#a64dff', secondary: '#6bff8f', font: 'inter', radius: 'soft' },
  endfield:        { label: 'Arknights · Endfield', primary: '#3fd0d0', secondary: '#ffa726', font: 'titillium', radius: 'mid' },    // ciano Arknights
  'cronicas-zulu': { secondary: '#ffcc33', font: 'cinzel', radius: 'sharp' },
  gundam:          { label: 'Mobile Suit Gundam', primary: '#3a6fe0', secondary: '#ff4d4d', font: 'rajdhani', radius: 'mid' },     // mecha Federação
  evangelion:      { label: 'Neon Genesis Evangelion', primary: '#7b4fd4', secondary: '#7cff52', font: 'rajdhani', radius: 'sharp' },   // roxo NERV + verde
  'mass-effect':   { label: 'Mass Effect', primary: '#3d8bff', secondary: '#ff7b29', font: 'titillium', radius: 'soft' },
  cyberpunk:       { label: 'Cyberpunk · Night City', primary: '#ff0a78', secondary: '#d4a24e', font: 'mono', radius: 'sharp' },       // neon magenta/ciano
  monsterverse:    { label: 'Monsterverse · Titãs', primary: '#5ad84a', secondary: '#ff8a3c', font: 'oswald', radius: 'mid' },       // verde-atômico + calor
  titanfall:       { label: 'Titanfall', primary: '#ff7a1a', secondary: '#38b6ff', font: 'rajdhani', radius: 'mid' },     // laranja Militia + azul
  'god-of-war':    { label: 'God of War', primary: '#c0392b', secondary: '#d4af37', font: 'cinzel', radius: 'sharp' },     // vermelho-sangue + dourado grego
  'devil-may-cry': { label: 'Devil May Cry', primary: '#d11f2d', secondary: '#2a6cff', font: 'oswald', radius: 'sharp' },     // Dante vermelho / Vergil azul
  fate:            { label: 'Fate', primary: '#2e6fd0', secondary: '#d4af37', font: 'cinzel', radius: 'mid' }        // azul Saber + dourado
};

/* Mapa id → skin. O label mora AQUI, não no dataset de universos do content:
 * o shell é dono do que aparece no seletor de skin, e depender do content pra
 * isso obrigaria a casca a importar outro domínio — o que o contrato proíbe.
 * O custo declarado é duplicação do nome (D-004): se o content renomear um
 * universo, o rótulo do skin não segue sozinho. */
export const UNIVERSE_THEMES = {};
for (const [id, cfg] of Object.entries(SKIN)) {
  UNIVERSE_THEMES[id] = {
    label: cfg.label,
    primary: cfg.primary,
    secondary: cfg.secondary,
    font: cfg.font,
    radius: cfg.radius
  };
}

/** Lista para o seletor: Baluarte (padrão) + todos os skins. */
export const UNIVERSE_SKINS = [
  { id: 'baluarte', label: 'Baluarte', primary: '#d4a24e', secondary: '#e8c07a' },
  ...Object.entries(UNIVERSE_THEMES).map(([id, s]) => ({ id, label: s.label, primary: s.primary, secondary: s.secondary }))
];

let appliedKeys = [];

/** Aplica um universo ao <html>. `baluarte`/desconhecido devolve o tema de acento. */
export function applyUniverse(id) {
  const root = document.documentElement;
  appliedKeys.forEach((k) => root.style.removeProperty(k));
  appliedKeys = [];

  const skin = UNIVERSE_THEMES[id];
  if (!skin) {
    delete root.dataset.universe;
    applyTheme(getThemeId());
    return 'baluarte';
  }

  ensureFont(skin.font);   // carrega a fonte do universo sob demanda (fora do boot)
  const vars = deriveVars(skin.primary, skin.secondary, { font: skin.font, radius: skin.radius });
  Object.entries(vars).forEach(([k, v]) => { root.style.setProperty(k, v); appliedKeys.push(k); });
  root.dataset.universe = id;
  return id;
}

export function getUniverseId() { return storage.get(KEY) || 'baluarte'; }

export function setUniverse(id) {
  const applied = applyUniverse(id);
  storage.set(KEY, applied);
  return applied;
}

export function initUniverse() {
  applyUniverse(getUniverseId());
}
