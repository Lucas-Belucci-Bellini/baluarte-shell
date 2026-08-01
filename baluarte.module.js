/**
 * Entrada única do domínio — contrato v1.0.0.
 *
 * O orquestrador do Nexus não lê mais nada deste repositório além deste
 * arquivo. Tudo que o domínio publica (rotas, eventos, dependências) passa
 * por aqui — é o que impede a unificação de virar dependência invisível.
 *
 * Especificação: docs/NEXUS-CONTRATO.md no Projeto-Baluarte.
 */

export default {
  nome: 'shell',
  versao: '0.1.0',
  contrato: '1.0.0',
  natureza: 'paginas',

  /* Vazio de propósito: nada foi extraído ainda. Declarar rota cujo load
   * aponta pra arquivo inexistente seria o orquestrador prometendo tela
   * que quebra ao abrir. Cada entrada chega junto com a página dela. */
  rotas: [],

  /* O que VAI ser publicado. Existe pra que o mapa do Nexus e este
   * repositório não contem histórias diferentes enquanto o domínio
   * está vazio. */
  planejado: [
    { path: '/home', titulo: 'Home', peso: 'leve', origem: 'src/pages/' },
    { path: '/home-3d', titulo: 'Home 3D', peso: 'leve', origem: 'src/pages/' },
    { path: '/home2', titulo: 'Home (variante)', peso: 'leve', origem: 'src/pages/' },
    { path: '/sobre', titulo: 'Sobre', peso: 'leve', origem: 'src/pages/' },
    { path: '/roadmap', titulo: 'Roadmap', peso: 'leve', origem: 'src/pages/' },
    { path: '/projetos', titulo: 'Projetos', peso: 'leve', origem: 'src/pages/' },
  ],

  /* Declarar é obrigatório: evento não declarado é acoplamento escondido. */
  eventos: {
    emite: [],
    escuta: [],
  },

  precisa: ['baluarte-core'],

  /** Sobe quando o módulo entra. `ctx` traz router, bus, appState, storage. */
  async iniciar(_ctx) {},

  /** Desmonta: solte listener, timer e worker. O que sobra vaza entre rotas. */
  async parar() {},
};
