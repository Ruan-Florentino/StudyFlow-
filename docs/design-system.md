# Design system — HUB.IA / MyHUB.IA (Fase 2)

Documentação dos **tokens visuais** introduzidos na Fase 2. O app continua **dark-first**; a cor primária de marca permanece **#00E88F** (`--hub-primary`).

## Onde vive o quê

| Artefato | Caminho |
|----------|---------|
| Tokens CSS (cores, sombras, glows, mesh, keyframes) | `src/styles/tokens.css` |
| Tema Tailwind v4 + classes utilitárias | `src/index.css` (`@theme`, `@layer`) |
| Easings / durações / springs (motion/react) | `src/lib/animations/easings.ts` |

## Paleta

### Marca

- `--hub-primary` — #00E88F (CTA, links, energia)
- `--hub-primary-deep` — verde mais fechado (hover/ênfase)
- `--hub-primary-muted` — overlays suaves

### Acentos neon (uso **parcimonioso**)

- `--neon-cyan`, `--neon-purple`, `--neon-pink`, `--neon-amber`

### Superfícies

- `--hub-bg-base` — alinhado ao fundo global atual
- `--hub-bg-elevated` — cards elevados
- `--hub-bg-overlay` — modais / painéis
- `--hub-bg-hover` — estados hover de lista

## Sombras e glow

Definidos em `:root` como `--tok-shadow-*` e `--tok-glow-*`; expostos ao Tailwind como utilitários `shadow-premium-*`, `shadow-glow-*`, `shadow-inner-premium` (ver `@theme` em `index.css`).

## Gradientes

- `--gradient-aurora`, `--gradient-neon`, `--gradient-premium-gold`, `--gradient-card-hover`
- `--mesh-bg-spot-a` / `--mesh-bg-spot-b` — base para **mesh** + blur no layout

## Tailwind (v4)

Novos utilitários expostos via `@theme` em `index.css`, por exemplo:

- Cores: `bg-surface-elevated`, `text-neon-cyan`, `border-primary-deep`, …
- Sombras: `shadow-premium-md`, `shadow-glow-primary`, …
- Animações: `animate-aurora-1`, `animate-breathe-glow`, …

Consulte o bloco `@theme` em `src/index.css` para a lista completa.

## Motion / JS

```ts
import { easings, durations, springs } from '@/src/lib/animations/easings'
import { staggerContainer, staggerItem, fadeUp } from '@/src/lib/animations/variants'
```

Use `easings.smoothOut` e `durations.fast` em `transition` do **motion/react** para consistência “Linear / Apple”.

### Fase 3 (microinterações)

- **`AnimatedButton`**: spring (`springs.snappy`), hover com glow no primário, shimmer via `::before`, `loading` opcional com spinner.
- **`GlassCard`**: entrada com `springs.soft`; se `onClick` existir, lift `-4px` no hover.
- **Skeletons**: classe global `.skeleton-shine` (shimmer escuro + respeito a `prefers-reduced-motion`).

### Fase 4 (luz / glow / neon)

| Artefato | Caminho |
|----------|---------|
| Aurora de fundo (mesh + 3 blobs + `animate-aurora-*`) | `src/components/fx/AuroraBackground.tsx` |
| Selo neon (VIP / destaque) | `src/components/fx/NeonBadge.tsx` |

**Classes utilitárias** (`index.css`): `.glass-premium`, `.neon-text-soft`, `.neon-edge-subtle`.

**Onde está ligado:** `DashboardView` (aurora + badge no banner Premium + pulso leve no 👑 Supremo), `AIHub` (aurora + `neon-text-soft` no título + `glass-premium` nos cards do rodapé).

**Premium landing** (`/premium`) mantém o hero animado existente — evita duplicar duas auroras competindo.

**Acessibilidade:** `AuroraBackground` usa `useReducedMotion()` (mesh estático); no CSS, auroras + `animate-breathe-glow` são desligadas em `prefers-reduced-motion`.

### Fase 5 (transições de rota)

| Artefato | Caminho |
|----------|---------|
| Outlet animado (`AnimatePresence` + `Outlet`) | `src/app/shell/AnimatedPageOutlet.tsx` |
| Variants de página | `pageShell`, `pageShellReduced` em `src/lib/animations/variants.ts` |

- **`mode="wait"`** na troca de rota: a tela anterior termina o exit antes do enter da próxima.
- **Chave:** `pathname` + `search` para respeitar query strings.
- **Scroll:** `#app-main-scroll` ( `<main>` em `AppShell`) volta ao topo a cada troca (`useLayoutEffect`).
- **Direção POP vs PUSH:** não usamos slide horizontal globalmente — o nó que está saindo não recebe o `navigationType` atualizado, o que quebraria o sentido da animação. O shell usa **fade + leve Y + scale** simétrico.
- **`initial={false}`** no `AnimatePresence`: primeira pintura do app sem animação de entrada fantasma.

### Fase 6 (polish + acessibilidade)

- **`::selection`** — fundo `var(--selection-bg)`, texto `var(--selection-fg)` (tokens em `src/styles/tokens.css`).
- **Scroll** — `scroll-behavior: smooth` em `html` apenas quando **não** há `prefers-reduced-motion: reduce`.
- **Scrollbars** — finas, trilho escuro e thumb em gradiente primary (WebKit + `scrollbar-color` no Firefox). Classes **`.no-scrollbar`** seguem sem barra visível.
- **`:focus-visible`** — anel duplo (fundo + verde marca + glow leve) em controles nativos e `[role="button"]` / `tabindex` focáveis.
- **Motion** — auroras, `breathe-glow` e shimmer de skeleton já respeitam reduced motion nos blocos existentes em `index.css`; rotas e `AuroraBackground` usam `useReducedMotion()` no JS.

## Próximas fases (não aplicadas aqui)

- **Fase 3:** variants reutilizáveis, stagger, botões/cards
- **Fase 6:** `prefers-reduced-motion` global + revisão de foco visível

---

*Última atualização: Fase 2 — tokens + documentação base.*
