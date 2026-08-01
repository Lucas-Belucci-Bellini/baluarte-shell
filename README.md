# baluarte-shell

Domínio do [Projeto Nexus Baluarte](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte).

**Responsabilidade:** Casca visual: layout, sidebar, header, overlay, tokens, efeitos e as páginas institucionais que moram no shell.

**Estado:** `vazio` — nada foi extraído ainda. Enquanto este domínio não
estiver `estavel`, **a versão que vale é a do Projeto-Baluarte**.

---

## Rotas planejadas

Ainda não publicadas — `baluarte.module.js` declara `rotas: []` porque nada
foi extraído. Cada uma entra junto com a página, uma por vez.

| Rota | Página | Origem no monólito | Peso |
|---|---|---|---|
| `/home` | Home | `—` | leve |
| `/home-3d` | Home 3D | `—` | leve |
| `/home2` | Home (variante) | `—` | leve |
| `/sobre` | Sobre | `—` | leve |
| `/roadmap` | Roadmap | `—` | leve |
| `/projetos` | Projetos | `—` | leve |

> `peso: pesado` = só carrega no app desktop (`window.baluarte.native`);
> na web vira teaser "abre no app". Regra do mega-plano #238.

## O que vem do monólito

Arquivos que este domínio herda na extração:

- `src/layout/shell.js`
- `src/layout/header.js`
- `src/layout/sidebar.js`
- `src/layout/overlay.js`
- `src/styles/variables.css`
- `src/styles/effects.css`
- `src/utils/effects.js`
- `src/utils/boot-intro.js`
- `src/utils/scroll-reveal.js`
- `src/utils/scroll-progress.js`
- `src/utils/immersive.js`
- `src/utils/atmosphere.js`
- `src/utils/card-spotlight.js`
- `src/utils/universe-theme.js`
- `src/utils/hero-webgl.js`
- `src/utils/hero-rays.js`
- `src/utils/hero3d.js`

## Contrato

Implementa o **contrato v1.0.0**
([`docs/NEXUS-CONTRATO.md`](https://github.com/Lucas-Belucci-Bellini/Projeto-Baluarte/blob/main/docs/NEXUS-CONTRATO.md)).
Entrada única: [`baluarte.module.js`](baluarte.module.js) — o orquestrador não
lê mais nada daqui.

- **Precisa:** `baluarte-core`
- **Não importa outro domínio direto.** Só o `core` e o contrato.

`npm run verificar` valida o manifesto contra o contrato — e roda no CI.

## Rodar

```bash
npm install
npm run verificar    # o manifesto bate com o contrato?
```

## Armadilhas já pagas (não repita)

- **Folha de página é importada pelo módulo da página**, não pelo boot. Foi o
  que derrubou o CSS do boot de 398 kB para 194 kB (−46% no gz).
- **Tokens primeiro**: nenhum hex ou px solto em folha de página — sempre
  `variables.css`. Os nomes de token são os mesmos do Project-Vanguard de
  propósito: é isso que faz um componente atravessar os dois.
- A camada de efeitos (`.fx-*`) é porta **vanilla** do react-bits. **Não** usar
  React aqui.

## Regras herdadas

- **JS puro (ES2022)**, sem TypeScript e sem framework. Vite só empacota.
- **Tokens primeiro:** nada de hex ou px solto — sempre `variables.css`.
- **Por feature:** branch própria → commit → PR draft → merge com CI verde.
- **Validar no navegador**, não só no build.
- **Número sem fonte não entra.** O que não foi medido aparece como ausente,
  nunca como zero.
