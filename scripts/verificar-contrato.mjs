/**
 * Verificador do manifesto do domínio contra o contrato do Nexus.
 *
 * Manifesto que ninguém confere vira promessa: declara rota que não existe,
 * evento com prefixo de outro domínio, dependência que não é domínio. Este
 * script cobra a forma antes que o orquestrador descubra no boot.
 *
 * É genérico de propósito — o mesmo arquivo serve nos 21 repositórios de
 * domínio. Só o baluarte.module.js muda.
 *
 * Rodar: node scripts/verificar-contrato.mjs   (ou npm run verificar)
 * Contrato: docs/NEXUS-CONTRATO.md no Projeto-Baluarte.
 */

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const raiz = join(dirname(fileURLToPath(import.meta.url)), '..');

const CONTRATO_SUPORTADO = '1.1.0';
const PESOS = ['leve', 'pesado'];
const NATUREZAS = ['paginas', 'biblioteca'];

/* Os domínios aprovados (#406 + decisões). `precisa` só aceita nome daqui —
 * é o que impede uma dependência inventada de passar batida. */
const DOMINIOS = [
  'baluarte-core', 'baluarte-shell', 'baluarte-content', 'baluarte-tools',
  'baluarte-arsenal', 'baluarte-elites', 'baluarte-academia', 'baluarte-robotica',
  'baluarte-midia', 'baluarte-audio', 'baluarte-cibersec', 'baluarte-economia',
  'baluarte-jarvis-core', 'baluarte-jarvis-tools', 'baluarte-jarvis-memory',
  'baluarte-profile', 'baluarte-data', 'baluarte-desktop', 'baluarte-infra',
  'baluarte-docs', 'baluarte-geo',
];

const erros = [];
const falhar = (msg) => erros.push(msg);

const pkg = JSON.parse(readFileSync(join(raiz, 'package.json'), 'utf8'));
const { default: m } = await import(join(raiz, 'baluarte.module.js'));

if (!m || typeof m !== 'object') {
  console.error('✗ baluarte.module.js não exporta um objeto por default.');
  process.exit(1);
}

/* Identidade. */
if (!m.nome?.trim()) falhar('nome: ausente');
else if (`baluarte-${m.nome}` !== pkg.name) {
  falhar(`nome: "${m.nome}" não casa com o package.json ("${pkg.name}") — esperado "baluarte-${m.nome}"`);
}
if (!/^\d+\.\d+\.\d+$/.test(m.versao ?? '')) falhar(`versao: "${m.versao}" não é semver`);
/* Major diferente é incompatível; minor a mais é feature que este verificador
 * ainda não sabe cobrar. 1.0.0 e 1.1.0 convivem — é a regra do contrato §3. */
const [majSup, minSup] = CONTRATO_SUPORTADO.split('.').map(Number);
const [majMod, minMod] = String(m.contrato ?? '').split('.').map(Number);
if (majMod !== majSup) {
  falhar(`contrato: major "${m.contrato}" incompatível com ${CONTRATO_SUPORTADO}`);
} else if (minMod > minSup) {
  falhar(`contrato: "${m.contrato}" é mais novo que ${CONTRATO_SUPORTADO} — atualize o verificador`);
}

/* Rotas publicadas: precisam estar completas E carregáveis. */
const vistas = new Set();
const conferirRota = (r, onde, exigirLoad) => {
  const id = r?.path ?? '(sem path)';
  if (!r?.path?.startsWith('/')) falhar(`${onde}: path "${id}" precisa começar com /`);
  if (vistas.has(r?.path)) falhar(`${onde}: rota repetida — ${id}`);
  else vistas.add(r?.path);
  if (!r?.titulo?.trim()) falhar(`${onde} ${id}: sem título`);
  if (!PESOS.includes(r?.peso)) falhar(`${onde} ${id}: peso "${r?.peso}" fora de ${PESOS.join('|')}`);
  if (exigirLoad && typeof r?.load !== 'function') {
    falhar(`${onde} ${id}: load precisa ser () => import(...) — é o que preserva o code-splitting`);
  }
  if (!exigirLoad && !r?.origem?.trim()) falhar(`${onde} ${id}: sem origem no monólito`);
};

if (!Array.isArray(m.rotas)) falhar('rotas: precisa ser array (use [] se ainda não extraiu nada)');
else m.rotas.forEach((r) => conferirRota(r, 'rotas', true));

/* Natureza: quatro domínios (core, data, infra, docs) são consumidos, não
 * navegados. Sem essa distinção, "biblioteca" e "ainda não extraiu nada"
 * ficariam indistinguíveis — e nenhum dos dois poderia ser cobrado. */
const planejado = Array.isArray(m.planejado) ? m.planejado : [];
if (!NATUREZAS.includes(m.natureza)) {
  falhar(`natureza: "${m.natureza}" fora de ${NATUREZAS.join('|')}`);
} else if (m.natureza === 'biblioteca') {
  if ((m.rotas?.length ?? 0) > 0) falhar('natureza biblioteca não publica rota — rota aqui é erro de contrato');
  if (planejado.length > 0) falhar('natureza biblioteca não tem `planejado` — ela nunca vai publicar tela');
} else if ((m.rotas?.length ?? 0) === 0 && planejado.length === 0) {
  falhar('domínio de páginas sem rota publicada e sem `planejado` — ou publica, ou declara o que vem');
}
planejado.forEach((r) => conferirRota(r, 'planejado', false));

/* Eventos: o prefixo do que se EMITE é sempre o próprio domínio. Sem isso, o
 * barramento vira terra de ninguém e não se sabe de quem cobrar. */
const formato = /^[a-z0-9-]+:[a-z0-9-]+$/;
for (const [tipo, lista] of Object.entries(m.eventos ?? {})) {
  if (!['emite', 'escuta'].includes(tipo)) { falhar(`eventos: chave desconhecida "${tipo}"`); continue; }
  if (!Array.isArray(lista)) { falhar(`eventos.${tipo}: precisa ser array`); continue; }
  for (const ev of lista) {
    if (!formato.test(ev)) falhar(`eventos.${tipo}: "${ev}" fora do formato dominio:coisa-que-aconteceu`);
    else if (tipo === 'emite' && !ev.startsWith(`${m.nome}:`)) {
      falhar(`eventos.emite: "${ev}" não tem o prefixo do domínio ("${m.nome}:")`);
    }
  }
}
if (!m.eventos) falhar('eventos: ausente — declare { emite: [], escuta: [] } mesmo que vazio');

/* Destaques (v1.1.0): o que este domínio expõe na home. A home renderiza sem
 * saber de onde veio — é o que substitui o import cruzado de dataset (D-003). */
const minhasRotas = new Set([
  ...(m.rotas ?? []).map((r) => r?.path),
  ...planejado.map((r) => r?.path),
]);
if (m.destaques !== undefined) {
  if (!Array.isArray(m.destaques)) falhar('destaques: precisa ser array');
  else for (const d of m.destaques) {
    const id = d?.rotulo ?? '(sem rótulo)';
    if (!d?.rotulo?.trim()) falhar('destaques: entrada sem rótulo');
    if (!d?.rota?.startsWith('/')) falhar(`destaques ${id}: rota "${d?.rota}" precisa começar com /`);
    else if (!minhasRotas.has(d.rota)) {
      falhar(`destaques ${id}: rota ${d.rota} não é deste domínio — destaque não é porta dos fundos pro acoplamento`);
    }
    if (d?.total === undefined && d?.itens === undefined) {
      falhar(`destaques ${id}: sem total e sem itens não destaca nada`);
    }
    if (d?.total !== undefined) {
      if (!Number.isInteger(d.total) || d.total < 0) falhar(`destaques ${id}: total "${d.total}" não é inteiro >= 0`);
      /* Regra do projeto: número sem fonte não entra. O contador da home é
       * número declarado, então ele tem que dizer de onde saiu. */
      if (!d?.fonte?.trim()) falhar(`destaques ${id}: total sem fonte declarada`);
    }
    if (d?.itens !== undefined && typeof d.itens !== 'function') {
      falhar(`destaques ${id}: itens precisa ser () => import(...) — é o que tira o peso do boot`);
    }
  }
}

/* Dependências. */
if (!Array.isArray(m.precisa)) falhar('precisa: precisa ser array');
else for (const dep of m.precisa) {
  if (!DOMINIOS.includes(dep)) falhar(`precisa: "${dep}" não é um domínio do Nexus`);
  if (dep === `baluarte-${m.nome}`) falhar('precisa: domínio não depende de si mesmo');
}
if (m.externos !== undefined && !Array.isArray(m.externos)) falhar('externos: precisa ser array');

for (const gancho of ['iniciar', 'parar']) {
  if (m[gancho] !== undefined && typeof m[gancho] !== 'function') falhar(`${gancho}: precisa ser função`);
}

/* Relatório. */
console.log(`${pkg.name} — manifesto (contrato ${m.contrato} · ${m.natureza})`);
console.log(`  rotas publicadas ........... ${m.rotas?.length ?? 0}`);
console.log(`  rotas planejadas ........... ${planejado.length}`);
console.log(`  eventos .................... emite ${m.eventos?.emite?.length ?? 0} · escuta ${m.eventos?.escuta?.length ?? 0}`);
console.log(`  precisa .................... ${m.precisa?.join(', ') || '—'}`);
console.log(`  externos ................... ${m.externos?.join(', ') || '—'}`);
console.log(`  destaques na home .......... ${m.destaques?.length ?? 0}`);

if (erros.length) {
  console.error(`\n✗ ${erros.length} divergência(s) com o contrato:`);
  for (const e of erros) console.error(`  - ${e}`);
  process.exit(1);
}
console.log('\n✓ manifesto conforme o contrato.');
