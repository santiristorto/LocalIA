# LocalIA API — Dockerfile multi-stage (DevOps & Deployment Specification §1.1)
# Sprint 0: build funcional mínimo. Sin optimizaciones de tamaño de imagen
# todavía más allá de multi-stage — se revisan en el Sprint 15 (hardening).

FROM node:22-slim AS base
RUN corepack enable
WORKDIR /repo

FROM base AS deps
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./
COPY apps/api/package.json apps/api/package.json
COPY packages/config/package.json packages/config/package.json
COPY packages/types/package.json packages/types/package.json
RUN pnpm install --frozen-lockfile --filter @localia/api...

FROM deps AS build
COPY . .
RUN pnpm --filter @localia/api prisma:generate
RUN pnpm --filter @localia/api build

FROM node:22-slim AS runtime
RUN corepack enable
WORKDIR /repo
ENV NODE_ENV=production
COPY --from=build /repo/apps/api/dist ./apps/api/dist
COPY --from=build /repo/apps/api/package.json ./apps/api/package.json
COPY --from=build /repo/apps/api/prisma ./apps/api/prisma
COPY --from=build /repo/node_modules ./node_modules
COPY --from=build /repo/apps/api/node_modules ./apps/api/node_modules
WORKDIR /repo/apps/api
EXPOSE 4000
CMD ["node", "dist/server.js"]
