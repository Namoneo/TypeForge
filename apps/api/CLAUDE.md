# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repo layout

This package (`apps/api`) is the NestJS 11 backend for the TypeForge monorepo
(`apps/web` is the Angular 19 frontend, `libs/shared` holds shared DTOs/types,
`packages/cli` is a standalone scaffolding tool). The repo uses npm workspaces;
install once from the repo root.

Run dev commands from `apps/api`. Repo-root scripts (`npm run dev`, `npm run
build`, `npm test`) fan out to all workspaces.

## Common commands

```bash
# Dev server with watch (http://localhost:3000, Swagger at /api/docs)
npm run dev

# Lint (auto-fix) — type-checked rules require a working tsconfig project
npm run lint

# Type-check without emit (matches CI)
npx tsc --noEmit

# Unit tests (Jest, picks up *.spec.ts under src/)
npm test
npm test -- path/to/file.spec.ts          # single file
npm test -- -t "test name pattern"         # single test by name

# E2E tests use a separate Jest config under test/
npm run test:e2e

# Prisma — generate client, run dev migration, seed, open Studio
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed          # ts-node prisma/seed.ts; creates admin from ADMIN_EMAIL/ADMIN_PASSWORD
npm run prisma:studio
```

Local infra (Postgres + Redis) comes up via `docker-compose up postgres redis -d`
from the repo root. The seed script and the dev server both expect
`DATABASE_URL` (see `.env.example`).

## Architecture

NestJS module-per-feature layout under `src/`:

- `auth/` — JWT access + refresh tokens with **token-family rotation**. Each
  login bumps `User.refreshTokenVersion`; the refresh JWT embeds that version
  and any replay of an older token invalidates the whole family. Two Passport
  strategies (`JwtStrategy`, `JwtRefreshStrategy`) back the corresponding
  guards. `@Roles()` decorator + `RolesGuard` for admin endpoints.
- `compiler/` — `CompilerService.compile()` runs the TypeScript compiler API
  with a strict `CompilerOptions` preset and returns structured diagnostics.
  `runChallenge()` compiles, then executes inside an **isolated-vm** sandbox
  (2 s timeout, 64 MB cap, 64 KB source limit, 4 KB per test input). Admin
  test inputs are additionally pattern-checked
  (`BLOCKED_TEST_INPUT_PATTERNS`) for `require`/`process`/`__proto__` etc.
  Treat the sandbox limits as load-bearing security — don't relax without
  thinking about untrusted user code.
- `challenges/` — Public controller hides `solutionCode` from responses;
  admin controller exposes it. Successful submissions increment
  `User.xp` and upsert `TrackProgress`.
- `gateway/` — Socket.IO gateway on namespace `/typeforge`. Auth happens in
  `handleConnection` via JWT in `handshake.auth.token` or `Authorization`
  header; failed auth disconnects the socket. `compile` event ↔ `compile:result`.
- `ai-mentor/` — Streams Claude responses over SSE
  (`text/event-stream`, `[DONE]` sentinel). Uses model `claude-opus-4-7`
  with adaptive thinking and ephemeral cache on the system prompt. Service
  no-ops gracefully if `ANTHROPIC_API_KEY` is unset.
- `prisma/` — `PrismaService` extends `PrismaClient` and is exported from a
  global module. Schema in `prisma/schema.prisma` (Postgres). Enums
  `Difficulty` and `Role` are exported from `@prisma/client` — import them
  at runtime, not as `import type`, when they're used in `@IsEnum()`.
- `common/filters/` — `SentryExceptionFilter` is registered globally in
  `main.ts`; Sentry init is gated on `SENTRY_DSN`.
- `mail/` — Nodemailer. Falls back to an Ethereal test account when SMTP
  env vars aren't set, so dev password-reset flows work without config.
- `health/` — `@nestjs/terminus` endpoints; custom `PrismaHealthIndicator`.

Cross-cutting bootstrap (`main.ts`):

- `requireEnv()` fails fast on missing `JWT_SECRET`, `JWT_REFRESH_SECRET`,
  `DATABASE_URL`, `FRONTEND_URL` in production — don't add fallbacks.
- Global `ValidationPipe` with `whitelist: true, forbidNonWhitelisted: true`
  — request DTOs must use `class-validator` decorators or fields get
  stripped/rejected.
- Helmet CSP is configured for Swagger compatibility
  (`crossOriginEmbedderPolicy: false`); changing CSP directives can break
  `/api/docs`.
- Global `ThrottlerGuard` (120 req/min) wired in `app.module.ts`.
- `nestjs-pino` logger with `bufferLogs: true`; production drops to `info`,
  dev uses `pino-pretty`. Auth/cookie headers are redacted.

## Conventions worth knowing

- The TS project is split: `tsconfig.json` for the main project,
  `tsconfig.build.json` excludes specs, `tsconfig.test.json` is used by
  `ts-jest`. Specs and `test/**` files are excluded from the ESLint
  type-checked rules — adding a new test directory means updating the
  `files:` glob in `eslint.config.mjs`.
- ESLint downgrades the `no-unsafe-*` rules to `warn` because Passport
  injects `req.user` as `any` into controllers — don't silence these by
  adding `as any` casts; the warning is the intended signal.
- `_`-prefixed variables/params/caught-errors are the convention for
  "intentionally unused" and are exempted from `no-unused-vars`.
- Prisma JSON columns (`Challenge.testCases`) are cast with `as any` at the
  service boundary — there's no shared type yet; if you add one, update
  both create and update paths.

## Common pitfalls

- **Port 5432 conflict on macOS.** If `prisma migrate` / `prisma:seed` fails
  with `P1010: User "typeforge" was denied access`, a local Postgres
  (commonly Homebrew `postgresql@16`) is shadowing the docker container on
  `localhost:5432`. Both can be "running" — the local one wins for loopback
  connections and has no `typeforge` role. Stop it with
  `brew services stop postgresql@16`, then re-run the migration. Confirm
  with `PGPASSWORD=typeforge psql -h 127.0.0.1 -U typeforge -d typeforge -c '\conninfo'`.

## CI

`.github/workflows/ci.yml` runs from the repo root: `npm ci` at root,
then per-app type-check + lint + tests. The API job spins up a Postgres
service container and runs `prisma migrate deploy` before tests. Keep
`npx tsc --noEmit`, `npm run lint`, and `npm test` green locally — those
are the gates.
