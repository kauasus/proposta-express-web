# Proposta Express Web (React + Vite + TypeScript)

Frontend completo do micro-SaaS **Proposta Express**, construído com arquitetura escalável e tipagem estrita.

## Stack

- React 19 + Vite 5+
- TypeScript (strict)
- React Router DOM v6
- Zustand (persist com localStorage)
- React Hook Form + Zod
- Axios com interceptors
- Tailwind CSS v3 + componentes estilo shadcn/ui
- Sonner para notificações
- @react-pdf/renderer para preview de proposta em PDF
- react-input-mask para máscaras BR (telefone, CPF/CNPJ, CEP)

## Scripts

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## Configuração de ambiente

1. Copie `.env.example` para `.env`
2. Ajuste a URL da API conforme necessário

```bash
cp .env.example .env
```

## Estrutura de pastas

```txt
src/
  @types/
  api/
    services/
  components/
    ui/
    shared/
    pdf/
  hooks/
  layouts/
  pages/
  routes/
  store/
  utils/
  validators/
```

## Fluxos implementados

- Autenticação (login, registro, sessão persistida)
- Dashboard com métricas
- CRUD de clientes com validação e máscaras BR
- CRUD de propostas + envio
- Cálculo em tempo real com `useWatch`
- Preview de PDF ao vivo no editor
- Página pública `/v/:token` com tracking de visualização e aceite
- Skeleton screens, empty states e feedback com Sonner

## Endpoints mockados (temporário)

### Auth
- POST `/auth/register`
- POST `/auth/login`
- GET `/auth/me`

### Customer
- GET `/customer`
- POST `/customer`
- PUT `/customer/:id`
- DELETE `/customer/:id`

### Proposals
- GET `/proposals`
- GET `/proposals/:id`
- POST `/proposals`
- PUT `/proposals/:id`
- DELETE `/proposals/:id`
- POST `/proposals/:id/send`
- GET `/proposals/public/:publicToken`

### Tracking
- POST `/tracking/:publicToken/view`
- POST `/tracking/:publicToken/accept`

> Os mocks estão implementados localmente com persistência em `localStorage`.
