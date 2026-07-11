# Athena

PWA de estudos com banco de 12k+ questões, simulados e estatísticas.

## Stack
- Vite + React + TypeScript
- Tailwind CSS
- Vite PWA (Workbox)

## Desenvolvimento
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Gerar ícones
```bash
npm run icons:generate
```

## Deploy
Configurado pra Vercel via `vercel.json`. Push pra main = deploy automático.

## Ambientes e variáveis
Congelamento lógico (staging vs produção, quem acessa o quê): [`docs/ENVIRONMENT.md`](docs/ENVIRONMENT.md). Variáveis de exemplo: [`.env.example`](.env.example).

## Migrations backend
Ordem, pré-requisitos e comandos (`npx backend db push` ou SQL Editor): [`docs/backend_MIGRATIONS.md`](docs/backend_MIGRATIONS.md).

## Segredos e rotação
Runbook após vazamento ou revisão de produção: [`docs/SECRETS_ROTATION.md`](docs/SECRETS_ROTATION.md).

## Release
Antes de merge/deploy: [`docs/RELEASE_CHECKLIST.md`](docs/RELEASE_CHECKLIST.md).

## Observabilidade e incidentes
Logs e detecção: [`docs/OBSERVABILITY.md`](docs/OBSERVABILITY.md).  
Resposta a incidentes (severidade, checklist): [`docs/INCIDENT_RESPONSE.md`](docs/INCIDENT_RESPONSE.md).

## Produto (foco e clareza)
Checklist estratégico: [`docs/PRODUCT_FOCUS.md`](docs/PRODUCT_FOCUS.md).  
Glossário de copy: [`docs/GLOSSARY.md`](docs/GLOSSARY.md).  
Estados de UI (loading/erro/vazio): [`docs/PRODUCT_UX_STATES.md`](docs/PRODUCT_UX_STATES.md).  
Credibilidade de dados (XP, ligas): [`docs/PRODUCT_DATA_TRUST.md`](docs/PRODUCT_DATA_TRUST.md).  
Acessibilidade: [`docs/PRODUCT_A11Y.md`](docs/PRODUCT_A11Y.md).
