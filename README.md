# baluarte-shell

> **Shell visual** · domínio do [Projeto Nexus Baluarte](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/PROJETO-NEXUS-BALUARTE.md) · maturidade: **backlog**

Layout, sidebar, header, navegação, temas e a camada de efeitos.

> ⚠️ **Armadilha conhecida** — `variables.css` é o **contrato visual** de todo o ecossistema — os mesmos nomes de token existem no Project Vanguard. Mudar um nome aqui quebra os dois repos. Ver `docs/DESIGN-SYSTEM.md`.

## Por que este repositório existe

O Projeto Baluarte cresceu até o ponto em que tudo se tocava: 98 rotas,
112 arquivos de página e 87 utilitários num repositório só. Mexer em
qualquer coisa significava arrastar o resto junto. A saída é separar por domínio,
reescrever cada um com calma e depois reunir tudo num orquestrador — o
**Nexus Baluarte**.

Este repo é **um** desses domínios. Ele não é um projeto novo: é uma fatia do
Baluarte que ganhou fronteira própria. O plano completo, com as fases e a ordem de
migração, está em [`docs/PROJETO-NEXUS-BALUARTE.md`](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/PROJETO-NEXUS-BALUARTE.md) e a discussão em
[#405](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/issues/405).

## Estado atual

**Vazio de propósito.** A migração ainda não trouxe o código. O que existe aqui é o
contrato: o que este domínio vai receber, de quem ele depende e o que precisa
entregar para ser considerado pronto.

- **Onda:** 1 · **Prioridade:** P0
- **Depende de:** `baluarte-core`
- **É dependência de:** `baluarte-academia`, `baluarte-arsenal`, `baluarte-audio`, `baluarte-cibersec`, `baluarte-content`, `baluarte-economia`, `baluarte-elites`, `baluarte-midia`, `baluarte-robotica`, `baluarte-tools`
- **Inventário:** 30 arquivos mapeados no monólito → [`MIGRACAO.md`](MIGRACAO.md)

## Rotas deste domínio

— (não expõe rota própria)

## Contrato de integração

O contrato legível por máquina está em [`contrato.json`](contrato.json). Em resumo:

| campo | valor |
| --- | --- |
| módulo | `baluarte-shell` |
| versão | `0.0.0` (nada migrado ainda) |
| eventos que emite | `sidebar:toggle-collapse`, `sidebar:toggle-mobile`, `sidebar:close-mobile` |
| eventos que consome | `route:change`, `route:error`, `toast`, `page:pin` |
| modo de integração | módulo ESM registrado no orquestrador |

Os nomes de evento acima **não são invenção**: saíram de um grep no monólito atual,
onde já existem e já são usados. O que ainda é proposta é a *forma* do registro
(`registrarModulo`), marcada como `"status": "proposto"` no contrato — ela só vira
fato quando `baluarte-core` publicar a camada de composição.

## Regras herdadas do ecossistema

- **JavaScript puro (ES2022)** — sem TypeScript, sem framework. Vite só empacota.
- **Tokens primeiro** — nenhum hex ou px solto; tudo sai de `variables.css`
  (`baluarte-shell`). Os nomes de token são os mesmos no Project Vanguard.
- **Por feature** — branch própria → commit → PR (draft) → merge com CI verde.
- **Nada de dado inventado** — número publicado é número medido, com a fonte do lado.
- **Não quebrar o monólito** — enquanto a migração corre, o Projeto Baluarte
  continua no ar. Nenhuma fase pode derrubar o fluxo de uso atual.

## Critérios de aceite

Este domínio só conta como **estável** quando:

- [ ] o código listado em `MIGRACAO.md` está aqui e roda isolado;
- [ ] `contrato.json` reflete a realidade (versão ≠ `0.0.0`, maturidade ≠ `backlog`);
- [ ] o orquestrador consegue carregá-lo sem quebrar o fluxo principal;
- [ ] foi validado no navegador, não só em teste;
- [ ] o monólito já não precisa mais da cópia antiga.


---

Parte do **Projeto Nexus Baluarte** · [monólito de origem](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte) · [plano mestre](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/PROJETO-NEXUS-BALUARTE.md)
