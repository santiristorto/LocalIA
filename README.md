# LocalIA

Empleado IA para comercios sobre WhatsApp. Monorepo oficial del proyecto.

> **Estado:** Sprint 1B — autenticación (Sprint 1A) + onboarding del comercio.
> Un usuario se registra, inicia sesión, configura su comercio una sola vez
> y entra a la app. Toda decisión de producto/arquitectura vive en `docs/`
> (los diez documentos de diseño ya aprobados) y es la única fuente de
> verdad del proyecto.

---

## Stack

- **Frontend** (`apps/web`): React 19, Vite, TypeScript, Tailwind CSS, React Router, TanStack Query.
- **Backend** (`apps/api`): Express, TypeScript, Prisma, Supabase (Postgres + Auth + Storage), Zod, Pino.
- **Infraestructura:** Docker, Docker Compose (desarrollo), GitHub Actions, Husky + lint-staged.
- **Monorepo:** pnpm workspaces + Turborepo.

## Estructura

```
localia/
├── apps/
│   ├── web/          # React 19 + Vite — portal del comercio
│   └── api/           # Express + TypeScript — backend
├── packages/
│   ├── config/         # ESLint, Prettier y tsconfig compartidos
│   ├── types/           # Esquemas Zod y tipos compartidos entre web y api
│   └── ui/               # Sistema de diseño compartido (vacío hasta el Sprint 3)
├── docker-compose.yml   # Entorno de desarrollo (api, redis, mailhog)
└── .github/workflows/   # CI: lint + typecheck + build
```

## Requisitos

- Node.js ≥ 20
- pnpm ≥ 9 (`corepack enable && corepack prepare pnpm@latest --activate`)
- Docker (para `docker-compose.yml` y para `supabase start`)
- [Supabase CLI](https://supabase.com/docs/guides/cli) (Postgres/Auth/Storage local — no se levantan con Docker Compose propio, ver Backend Architecture Specification)

## Arranque en 5 pasos

```bash
# 1. Instalar dependencias
pnpm install

# 2. Copiar variables de entorno de ejemplo
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env

# 3. Levantar Supabase local (Postgres/Auth/Storage)
supabase start

# 4. Levantar Redis/Mailhog de desarrollo
docker compose up -d redis mailhog

# 5. Correr api + web en paralelo
pnpm dev
```

- API: http://localhost:4000/api/v1/health
- Web: http://localhost:5173

## Scripts principales

| Comando                | Qué hace                                       |
| ---------------------- | ---------------------------------------------- |
| `pnpm dev`             | Corre `api` y `web` en paralelo con hot-reload |
| `pnpm build`           | Build de producción de todas las apps          |
| `pnpm lint`            | ESLint en todo el monorepo                     |
| `pnpm typecheck`       | `tsc --noEmit` en todo el monorepo             |
| `pnpm format`          | Aplica Prettier                                |
| `pnpm format:check`    | Verifica formato sin modificar archivos        |
| `pnpm prisma:generate` | Genera el cliente de Prisma (`apps/api`)       |
| `pnpm prisma:migrate`  | Corre migraciones de desarrollo (`apps/api`)   |

## Convenciones

- Cada módulo de `apps/api/src/modules/` sigue el patrón `routes → controller → service → repository` definido en el Backend Architecture Specification.
- Cada feature de `apps/web/src/features/` sigue el patrón de organización por dominio del Frontend Architecture Specification.
- Todo commit pasa por Husky + lint-staged (ESLint + Prettier sobre los archivos modificados de cada app, con su propio `eslint.config.cjs`).
- La API está versionada desde el día uno: todas las rutas de negocio cuelgan de `/api/v1`.
- `apps/api/src/app.ts` no importa el composition root real (`core/container.ts`) — recibe los routers por parámetro. Solo `server.ts` (producción) y `test-utils/build-test-app.ts` (tests) lo instancian.

## Estado de este sprint (Sprint 1B)

- **Auth (Sprint 1A):** registro, login, recuperación/restablecimiento de contraseña, rutas protegidas, `GET /api/v1/me`.
- **Onboarding del comercio (Sprint 1B):** un usuario autenticado sin comercio es redirigido a `/onboarding`; completa nombre, rubro, descripción, contacto, ubicación, horarios, logo y colores de marca; se guarda en `tenants`/`tenant_users` con RLS; no se le vuelve a mostrar el formulario una vez completado.
- Todavía no hay Menú, Employee IA, WhatsApp, Pedidos, Reservas ni Dashboard real — eso empieza en los próximos sprints según el `LocalIA — MVP Definitivo y Plan de Sprints`.

### ⚠️ Limitación conocida del entorno de desarrollo de Claude (no del código)

El cliente de Prisma (`prisma generate`) necesita descargar un binario desde `binaries.prisma.sh`, un dominio no accesible en el sandbox donde se generó este proyecto. Por eso, en ese entorno puntual, `pnpm dev`/`pnpm build`/`pnpm typecheck` de `apps/api` fallan **únicamente** en los 3 archivos que usan `@prisma/client` (`core/database/prisma-client.ts`, `core/database/with-user-context.ts`, `modules/tenants/tenants.repository.ts`). Con acceso normal a internet, este paso soluciona todo:

```bash
pnpm --filter @localia/api prisma:generate
```

Los tests **no** dependen de esto — usan un repositorio falso (`test-utils/fake-tenants-repository.ts`) y pasan sin necesidad de Prisma ni de una base de datos real.

## Documentación

Los diez documentos de diseño aprobados (Arquitectura, PRD, UX/UI, AI Agent Specification, Database Specification, Backend/Frontend Architecture, API Specification, DevOps & Deployment, Auditoría Pre-Desarrollo, MVP Definitivo y Plan de Sprints) son la única fuente de verdad de este proyecto y no se redefinen sin una razón crítica documentada.
