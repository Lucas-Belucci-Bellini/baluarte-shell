/**
 * Registro de destaques da home (contrato v1.1.0 §1.2, decisão D-003).
 *
 * A home mostra contadores e prateleiras de arsenal, elites, crônicas e
 * universos. Antes ela importava os quatro datasets direto — o que quebrava a
 * regra do Nexus (um domínio não importa outro) e, como a home é eager,
 * carregava 122 kB de dado no boot da web só pra contar arrays e pintar 12
 * cards por prateleira.
 *
 * Agora o fluxo é o inverso: o orquestrador junta os `destaques` declarados
 * pelos domínios e entrega aqui pelo `iniciar(ctx)`. O shell renderiza sem
 * saber de onde veio — e não conhece nenhum domínio.
 *
 * Vazio é estado válido: sem orquestrador (rodando o shell sozinho) a home
 * aparece sem contador e sem prateleira, em vez de quebrar.
 */

/** @typedef {{rotulo:string, rota:string, total?:number, fonte?:string, itens?:() => Promise<any>}} Destaque */

/** @type {Destaque[]} */
let registro = [];

/** Chamado pelo `iniciar(ctx)` do módulo. Substitui o registro inteiro. */
export function definirDestaques(lista) {
  registro = Array.isArray(lista) ? lista.filter(Boolean) : [];
}

/** Destaques que têm número — viram os contadores do bento. */
export function contadores() {
  return registro
    .filter((d) => Number.isInteger(d?.total))
    .map((d) => ({ total: d.total, rotulo: d.rotulo, rota: d.rota }));
}

/** Destaques que têm itens — viram as prateleiras. */
export function prateleiras() {
  return registro.filter((d) => typeof d?.itens === 'function');
}

/**
 * Carrega os itens de uma prateleira. É aqui que o `() => import(...)` roda —
 * fora do caminho crítico do boot, que é o ponto da D-003.
 *
 * Falha de um domínio não derruba a home: devolve vazio e segue.
 */
export async function carregarItens(destaque) {
  try {
    const mod = await destaque.itens();
    const fn = mod?.itensDaHome ?? mod?.default;
    const itens = typeof fn === 'function' ? await fn() : fn;
    return Array.isArray(itens) ? itens : [];
  } catch (err) {
    console.warn(`[destaques] "${destaque?.rotulo}" não carregou:`, err);
    return [];
  }
}
