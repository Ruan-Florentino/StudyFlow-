# Guia de Testes

Este projeto utiliza **Vitest** + **React Testing Library** para garantir a qualidade e estabilidade do código.

## Como rodar

- `npm run test`: Inicia o Vitest em modo watch.
- `npm run test:run`: Executa todos os testes uma única vez.
- `npm run test:coverage`: Gera relatório de cobertura de código.
- `npm run test:ui`: Abre a interface visual do Vitest (se disponível).

## Estrutura de Pastas

Seguimos o padrão de testes **co-localizados** (ao lado do código fonte):

```
src/
├── components/
│   ├── UI.tsx
│   ├── UI.test.tsx       # Testes do componente
├── hooks/
│   ├── useSearch.ts
│   ├── useSearch.test.ts # Testes do hook
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── authSlice.test.ts
```

Arquivos de configuração global:
- `vitest.config.ts`: Configuração do Vitest.
- `src/test/setup.ts`: Setup do ambiente JSDOM e mocks globais.
- `src/test/utils.tsx`: Wrappers e utilitários para facilitar o render de componentes.

## Melhores Práticas

1. **Priorize Logic**: Teste primeiro reducers (slices), hooks e funções utilitárias.
2. **Behavior over Implementation**: Em componentes, teste o que o usuário vê e como ele interage, não o estado interno.
3. **Mocks**: Use `vi.mock()` para isolar dependências externas pesadas ou com efeitos colaterais (APIs, Firebase).
4. **Snapshot Testing**: Use com moderação. Prefira assertions explícitas.

## Adicionando Novos Testes

Para testar um componente que usa rotas, utilize o `render` customizado de `@/test/utils`:

```typescript
import { render, screen } from '@/test/utils';
import { MyComponent } from './MyComponent';

render(<MyComponent />);
```
