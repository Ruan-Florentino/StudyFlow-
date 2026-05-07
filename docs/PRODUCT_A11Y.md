# Produto — acessibilidade (além do focus-visible)

Complementa o trabalho já feito em **focus-visible** nas views críticas. Checklist para **WCAG 2.1** nível **AA** onde for razoável sem reescrever o app inteiro.

---

## Passo 1 — Baseline

- [ ] Confirmar **contraste** de texto primário/secundário sobre `liquid-glass` (ferramenta: axe DevTools ou WebAIM).  
- [ ] **Tamanho mínimo** de alvo clicável 44×44px em fluxos críticos (já parcialmente coberto).  
- [ ] Não usar **cor como única** indicação de estado (acerto/erro: ícone ou texto também).  
- [ ] **Zoom 200%**: layout principal ainda usável (scroll ok, sem conteúdo cortado).  
- [ ] Listar **5 bugs** encontrados e priorizar P0/P1.  
- [ ] Repetir após mudanças grandes de tema.

---

## Passo 2 — Teclado

- [ ] **Command palette**: abrir/fechar, mover seleção, Enter — tudo sem mouse.  
- [ ] **Modais / drawers**: foco preso, **Esc** fecha, foco retorna ao gatilho.  
- [ ] **Bottom nav** e **menus**: ordem de tab lógica.  
- [ ] Formulários longos (redação, gerador): **atalhos** não conflitam com leitor de tela.  
- [ ] Documentar **atalhos** na tela de ajuda ou Suporte se existirem.  
- [ ] Regressão após novo overlay.

---

## Passo 3 — Nome e papel (acessíveis)

- [ ] Botões só com ícone: **`aria-label`** descritivo (pt-BR).  
- [ ] **Imagens** informativas: `alt`; decorativas: `alt=""`.  
- [ ] **Inputs**: `<label>` associado ou `aria-labelledby`.  
- [ ] **Landmarks**: `main`, `nav` onde couber sem quebrar layout.  
- [ ] Toasts: **`role="status"`** ou **`alert`** conforme severidade (evitar spam).  
- [ ] Revisar **1 fluxo** por sprint.

---

## Passo 4 — Motion

- [ ] Respeitar **`prefers-reduced-motion`** em animações longas ou parallax (reduzir ou desligar).  
- [ ] Evitar **flash** brusco ao trocar tema (se houver tema claro no futuro).  
- [ ] Autoplay de vídeo/áudio: não surpreender (controles visíveis).  
- [ ] Testar com **reduced motion** ligado no SO.  
- [ ] Registrar componentes que ainda ignoram a media query.  
- [ ] Planejar refino por fases (não big bang).

---

## Passo 5 — Leitor de tela (amostra)

- [ ] **NVDA** (Windows) ou **VoiceOver** (macOS): fluxo **Login → Dashboard → Questões**.  
- [ ] Anotar **10 fricções** (foco perdido, nome genérico “button”).  
- [ ] Corrigir **3** por release até zerar P0.  
- [ ] Repetir para **Mentoria** (mensagens dinâmicas anunciadas?).  
- [ ] Repetir para **checkout Premium** se aplicável.  
- [ ] Guardar gravação ou notas no drive do time.

---

## Passo 6 — DoD em PR que mexe em UI

- [ ] Novo componente interativo: **teclado + label** verificados.  
- [ ] Nenhum `tabIndex={0}` desnecessário em `div` clicável (preferir `button`).  
- [ ] Contraste verificado se novas cores (tokens apenas).  
- [ ] Se animação nova: checar **reduced-motion**.  
- [ ] Link para este doc se PR for só a11y.  
- [ ] Smoke com leitor em **1** tela alterada antes de merge.

---

## Ligação

- Copy: [`GLOSSARY.md`](GLOSSARY.md)  
- Estados: [`PRODUCT_UX_STATES.md`](PRODUCT_UX_STATES.md)  
- Credibilidade: [`PRODUCT_DATA_TRUST.md`](PRODUCT_DATA_TRUST.md)
