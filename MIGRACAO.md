# Inventário de migração — baluarte-shell

> Gerado em 2026-08-01 a partir de `Lucas-Belucci-Bellini/Projeto-Baluarte`.
> **30 arquivos** em 27 grupos.

Esta lista não é um chute: cada padrão abaixo foi expandido contra a árvore real do
monólito por `gerar-nexus.py` (em `baluarte-docs`), que aborta se um padrão não casar
com nada. Se um arquivo sumiu do monólito, a próxima geração falha em vez de mentir.

O que a lista **não** garante: que o recorte por domínio esteja perfeito. Alguns
arquivos servem a dois domínios e a fronteira final só aparece quando a extração
acontecer de verdade. Divergiu? Corrija na tabela do gerador, não à mão aqui.

## Ordem de trabalho

1. Extrair os arquivos abaixo do monólito preservando o histórico (`git filter-repo`
   ou `git subtree`), não copiar e colar.
2. Ajustar os imports que atravessam a fronteira do domínio — cada um deles é uma
   dependência que precisa aparecer no `contrato.json`.
3. Fazer o domínio rodar isolado.
4. Registrar no orquestrador e validar no navegador.
5. Só então remover a cópia antiga do monólito.

## Arquivos mapeados

### `src/layout/*.js`

- `src/layout/header.js`
- `src/layout/overlay.js`
- `src/layout/shell.js`
- `src/layout/sidebar.js`

### `src/styles/variables.css`

- `src/styles/variables.css`

### `src/styles/reset.css`

- `src/styles/reset.css`

### `src/styles/base.css`

- `src/styles/base.css`

### `src/styles/layout.css`

- `src/styles/layout.css`

### `src/styles/components.css`

- `src/styles/components.css`

### `src/styles/animations.css`

- `src/styles/animations.css`

### `src/styles/effects.css`

- `src/styles/effects.css`

### `src/styles/overlay.css`

- `src/styles/overlay.css`

### `src/styles/reveal.css`

- `src/styles/reveal.css`

### `src/styles/scroll-progress.css`

- `src/styles/scroll-progress.css`

### `src/styles/atmosphere.css`

- `src/styles/atmosphere.css`

### `src/styles/immersive.css`

- `src/styles/immersive.css`

### `src/styles/boot-intro.css`

- `src/styles/boot-intro.css`

### `src/utils/effects.js`

- `src/utils/effects.js`

### `src/utils/scroll-reveal.js`

- `src/utils/scroll-reveal.js`

### `src/utils/scroll-progress.js`

- `src/utils/scroll-progress.js`

### `src/utils/card-spotlight.js`

- `src/utils/card-spotlight.js`

### `src/utils/hero-webgl.js`

- `src/utils/hero-webgl.js`

### `src/utils/hero-rays.js`

- `src/utils/hero-rays.js`

### `src/utils/hero3d.js`

- `src/utils/hero3d.js`

### `src/utils/atmosphere.js`

- `src/utils/atmosphere.js`

### `src/utils/immersive.js`

- `src/utils/immersive.js`

### `src/utils/boot-intro.js`

- `src/utils/boot-intro.js`

### `src/utils/universe-theme.js`

- `src/utils/universe-theme.js`

### `src/pages/home.js`

- `src/pages/home.js`

### `src/styles/home-v2.css`

- `src/styles/home-v2.css`

## Dependências declaradas

- `baluarte-core`

## Domínios que dependem deste

- `baluarte-academia`
- `baluarte-arsenal`
- `baluarte-audio`
- `baluarte-cibersec`
- `baluarte-content`
- `baluarte-economia`
- `baluarte-elites`
- `baluarte-midia`
- `baluarte-robotica`
- `baluarte-tools`
