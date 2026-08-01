# baluarte-shell — contexto pro agente

Domínio **Shell visual** do [Projeto Nexus Baluarte](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/PROJETO-NEXUS-BALUARTE.md).
Layout, sidebar, header, navegação, temas e a camada de efeitos.

## Antes de mexer

Este repositório está **vazio de propósito** — a migração do monólito ainda não
aconteceu. Leia, nesta ordem:

1. [`README.md`](README.md) — o que é este domínio e o que ele deve entregar
2. [`MIGRACAO.md`](MIGRACAO.md) — os 30 arquivos que vêm do monólito
3. [`contrato.json`](contrato.json) — o contrato de integração
4. [plano mestre](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/PROJETO-NEXUS-BALUARTE.md) — as fases e a ordem da migração

O código de origem vive em
[`Lucas-Belucci-Bellini/Projeto-Baluarte`](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte),
que **continua no ar** durante toda a migração.

## Fronteira deste domínio

- **Depende de:** `baluarte-core`
- **É dependência de:** `baluarte-academia`, `baluarte-arsenal`, `baluarte-audio`, `baluarte-cibersec`, `baluarte-content`, `baluarte-economia`, `baluarte-elites`, `baluarte-midia`, `baluarte-robotica`, `baluarte-tools`
- **Emite:** `sidebar:toggle-collapse`, `sidebar:toggle-mobile`, `sidebar:close-mobile`
- **Consome:** `route:change`, `route:error`, `toast`, `page:pin`

Import que atravessa essa fronteira é dívida: ou vira dependência declarada no
`contrato.json`, ou o código está no repo errado.

## Regras

- **JS puro (ES2022)**. Sem TypeScript, sem framework — Vite só empacota.
- **Tokens primeiro**: nada de hex ou px solto; tudo vem de `variables.css`.
- **Por feature**: branch própria → commit → PR (draft) → merge com CI verde.
- **Dado nunca é inventado**: publica-se o que foi medido, com a fonte do lado.
- **Não quebrar o monólito**: ele segue sendo o sistema em produção.
- `variables.css` é o **contrato visual** de todo o ecossistema — os mesmos nomes de token existem no Project Vanguard. Mudar um nome aqui quebra os dois repos. Ver `docs/DESIGN-SYSTEM.md`.

## Ao terminar uma fatia

Atualize `contrato.json` (`versao`, `maturidade`) e marque o que saiu no
`README.md`. O contrato é a única fonte de verdade sobre o estado deste domínio —
o orquestrador vai ler dali, não do texto.
