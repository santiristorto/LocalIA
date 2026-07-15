# LocalIA

Empleado IA para comercios sobre WhatsApp. Monorepo oficial del proyecto.

> **Estado:** Sprint 0 — estructura base. Sin funcionalidad de negocio todavía.
> Toda decisión de producto/arquitectura vive en `docs/` (los diez documentos
> de diseño ya aprobados) y es la única fuente de verdad del proyecto.

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

- Cada módulo de `apps/api/src/modules/` sigue el patrón `routes → controller → service → repository` definido en el Backend Architecture Specification. En el Sprint 0 solo existe `health`, sin `service`/`repository` porque no toca base de datos.
- Cada feature de `apps/web/src/features/` (a partir del Sprint 3) sigue el patrón de organización por dominio del Frontend Architecture Specification.
- Todo commit pasa por Husky + lint-staged (ESLint + Prettier sobre los archivos modificados).
- La API está versionada desde el día uno: todas las rutas de negocio cuelgan de `/api/v1`.

## Estado de este sprint (Sprint 0)

Lo único que existe es infraestructura: manejo de errores, logging estructurado con `correlationId`, envelope de respuesta estándar, y el endpoint `GET /api/v1/health`. No hay autenticación, no hay modelos de negocio en Prisma, no hay integración de WhatsApp ni de IA — eso empieza en el Sprint 1 en adelante, según el `LocalIA — MVP Definitivo y Plan de Sprints`.

## Documentación

Los diez documentos de diseño aprobados (Arquitectura, PRD, UX/UI, AI Agent Specification, Database Specification, Backend/Frontend Architecture, API Specification, DevOps & Deployment, Auditoría Pre-Desarrollo, MVP Definitivo y Plan de Sprints) son la única fuente de verdad de este proyecto y no se redefinen sin una razón crítica documentada.
