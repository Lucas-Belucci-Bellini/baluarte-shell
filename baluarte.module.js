/**
 * Entrada única do domínio shell — contrato v1.1.0.
 *
 * O orquestrador do Nexus não lê mais nada deste repositório além deste
 * arquivo. Tudo que o domínio publica (rotas, eventos, dependências) passa
 * por aqui — é o que impede a unificação de virar dependência invisível.
 *
 * Especificação: docs/NEXUS-CONTRATO.md no Projeto-Baluarte.
 */

import { definirDestaques } from './src/destaques.js';

export default {
  nome: 'shell',
  versao: '0.2.0',
  contrato: '1.1.0',
  natureza: 'paginas',

  /* Primeiro domínio a publicar rota de verdade: as páginas já moram aqui e
   * carregam. `load` é sempre import() dinâmico — é o que preserva o
   * code-splitting que o site já tem. */
  rotas: [
    { path: '/home', titulo: 'Home', icone: 'home', peso: 'leve', load: () => import('./src/paginas/home.js') },
    { path: '/home-3d', titulo: 'Home 3D', icone: 'home', peso: 'leve', load: () => import('./src/paginas/home.js') },
    { path: '/home2', titulo: 'Home (variante)', icone: 'home', peso: 'leve', load: () => import('./src/paginas/home.js') },
    { path: '/sobre', titulo: 'Sobre', icone: 'info', peso: 'leve', load: () => import('./src/paginas/sobre.js') },
    { path: '/roadmap', titulo: 'Roadmap', icone: 'map', peso: 'leve', load: () => import('./src/paginas/roadmap.js') },
    { path: '/projetos', titulo: 'Projetos', icone: 'folder', peso: 'leve', load: () => import('./src/paginas/projetos.js') },
  ],

  eventos: {
    emite: [],
    escuta: [],
  },

  precisa: ['baluarte-core', 'baluarte-data'],

  /**
   * O orquestrador entrega aqui os `destaques` declarados por TODOS os
   * domínios (contrato §1.2). A home renderiza a partir deles sem conhecer
   * ninguém — é o que substituiu o import cruzado de dataset (D-003).
   *
   * Sem orquestrador (shell rodando sozinho), a lista chega vazia e a home
   * aparece sem contador e sem prateleira, em vez de quebrar.
   */
  async iniciar(ctx) {
    definirDestaques(ctx?.destaques ?? []);
  },

  /** Desmonta: solte listener, timer e worker. O que sobra vaza entre rotas. */
  async parar() {
    definirDestaques([]);
  },
};
