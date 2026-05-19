# TypeForge

> AI-Powered TypeScript Mastery Platform

[![CI](https://github.com/namoneo/typeforge/actions/workflows/ci.yml/badge.svg)](https://github.com/namoneo/typeforge/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-19-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs&logoColor=white)](https://nestjs.com)

An interactive, full-stack TypeScript learning platform — Monaco editor in the browser, LeetCode-style challenges, an AI mentor powered by Claude, and a gamified XP/levelling system.

---

## Features

| Feature | Status |
|---------|--------|
| Interactive TypeScript playground | ✅ Monaco Editor + live diagnostics |
| Real-time compilation | ✅ Server-side `ts.createProgram` via Socket.IO |
| Sandboxed code execution | ✅ `isolated-vm` V8 isolates — no host access |
| JWT auth (register / login / refresh) | ✅ Access + refresh token family tracking |
| Password reset via email | ✅ Signed token, 1-hour expiry, nodemailer |
| RBAC (admin / user roles) | ✅ `RolesGuard` + `@Roles()` decorator |
| Learning tracks (5 levels) | ✅ Beginner → Enterprise |
| Challenge system (LeetCode-style) | ✅ Submit → compile → run test cases in isolate |
| XP & levelling system | ✅ XP on challenge completion, live WS push |
| Admin challenge management | ✅ Full CRUD, draft/publish workflow |
| Global leaderboard | ✅ |
| AI Mentor | ✅ Claude Opus 4 via `@anthropic-ai/sdk` — streaming SSE |
| Rate limiting | ✅ `@nestjs/throttler` (per-endpoint limits) |
| Health check | ✅ `GET /api/health` — Prisma `SELECT 1` probe |
| Structured logging | ✅ `nestjs-pino` (JSON in prod, pretty in dev) |
| Error tracking | ✅ Sentry — 5xx only, DSN injected at runtime |
| Security headers | ✅ `helmet` with strict CSP |
| Swagger UI | ✅ `GET /api/docs` |

---

## Architecture

```
TypeForge/
├── apps/
│   ├── web/          # Angular 19 — standalone components, signals, TailwindCSS v4
│   └── api/          # NestJS 11 — JWT, WebSockets, REST, isolated-vm sandbox
├── libs/
│   └── shared/       # Shared TypeScript types and DTOs
├── packages/
│   └── cli/          # typeforge scaffolding CLI (standalone)
├── docker-compose.yml          # dev stack (postgres + redis)
└── docker-compose.prod.yml     # production stack (with migration service)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, standalone components, signals, TailwindCSS v4, Monaco Editor |
| Backend | NestJS 11, Prisma 6, PostgreSQL, Redis, BullMQ, Socket.IO |
| Auth | JWT access + refresh tokens, bcrypt, refresh token family tracking |
| Sandbox | `isolated-vm` — V8 isolates for user code; no `require`, no `process` |
| AI Mentor | Claude Opus 4 (`@anthropic-ai/sdk`) — streaming SSE |
| Logging | `nestjs-pino` — structured JSON (prod) / pretty-print (dev) |
| Monitoring | Sentry (`@sentry/node`, `@sentry/angular`) — 5xx errors only |
| DevOps | Docker Compose, Nginx, GitHub Actions CI |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://docker.com/) (for PostgreSQL + Redis)

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/namoneo/typeforge.git
cd typeforge
npm install
```

### 2. Start infrastructure

```bash
docker-compose up postgres redis -d
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` — required fields:

```env
DATABASE_URL="postgresql://typeforge:typeforge@localhost:5432/typeforge"
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-too-in-production"
FRONTEND_URL="http://localhost:4200"

# Optional — AI Mentor (get a key at https://console.anthropic.com)
ANTHROPIC_API_KEY=

# Optional — password reset emails (omit to log links to console in dev)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="TypeForge <noreply@typeforge.dev>"

# Optional — error tracking
SENTRY_DSN=
```

### 4. Set up the database

```bash
cd apps/api
npm install
npx prisma migrate deploy
npm run prisma:seed
```

### 5. Run both apps

```bash
# From repo root — starts API + web dev server concurrently
npm run dev

# Or individually:
cd apps/api && npm run dev     # http://localhost:3000
cd apps/web && npm start       # http://localhost:4200
```

Open **http://localhost:4200**, create an account, and start coding.

---

## API Reference

Swagger UI: **http://localhost:3000/api/docs**

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `POST` | `/api/auth/register` | — | Create account |
| `POST` | `/api/auth/login` | — | Login, receive tokens |
| `POST` | `/api/auth/refresh` | Cookie | Rotate refresh token |
| `POST` | `/api/auth/logout` | JWT | Clear tokens |
| `POST` | `/api/auth/forgot-password` | — | Send password reset email |
| `POST` | `/api/auth/reset-password` | — | Set new password via token |
| `GET` | `/api/users/me` | JWT | Current user profile |
| `GET` | `/api/users/me/progress` | JWT | Learning progress |
| `GET` | `/api/users/leaderboard` | JWT | Global leaderboard |
| `GET` | `/api/challenges` | JWT | List challenges (filter by track/difficulty) |
| `GET` | `/api/challenges/:id` | JWT | Get challenge (no solution code) |
| `POST` | `/api/challenges/submit` | JWT | Submit code, run test cases in isolate |
| `POST` | `/api/compiler/compile` | JWT | Compile TypeScript, get diagnostics |
| `POST` | `/api/ai-mentor/ask` | JWT | AI Mentor — streams SSE |
| `GET` | `/api/admin/challenges` | JWT + ADMIN | List all challenges including drafts |
| `GET` | `/api/admin/challenges/:id` | JWT + ADMIN | Get challenge with solution code |
| `POST` | `/api/challenges` | JWT + ADMIN | Create challenge |
| `PATCH` | `/api/challenges/:id` | JWT + ADMIN | Update challenge |
| `DELETE` | `/api/challenges/:id` | JWT + ADMIN | Delete challenge |
| `GET` | `/api/health` | — | Health check (Prisma probe) |

WebSocket namespace: `/typeforge`  
Events: `compile` → `compile:result` · `playground:join` → `playground:joined` · `xp:gained` (push)

---

## Learning Tracks

| Track | Topics | Difficulty |
|-------|--------|-----------|
| 🌱 Beginner | Variables, functions, interfaces, unions, enums | Easy |
| ⚡ Intermediate | Generics, overloads, utility types, mapped types | Medium |
| 🔥 Advanced | Conditional types, template literals, recursion, variance | Hard |
| 💎 Expert | Type-level programming, compiler internals, DSL creation | Expert |
| 🏢 Enterprise | Angular, NestJS, Prisma, Zod, tRPC, monorepos | Advanced |

---

## Production Deployment

```bash
# Copy and fill in all required env vars
cp apps/api/.env.example .env.prod

# Build and start (runs DB migration automatically before API starts)
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

The production compose file:
- Runs `prisma migrate deploy` as a one-shot service before the API starts
- Injects `SENTRY_DSN` into the Angular `index.html` at container start via `envsubst`
- Sets resource limits and `restart: always` on all services

Required production env vars (the API will refuse to start without them):

```
DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL
```

---

## Development

```bash
npm run build          # build everything
npm test               # run all tests
cd apps/api && npm run dev          # API dev server with watch
cd apps/web && npm start            # Angular dev server
cd apps/api && npm run prisma:studio   # DB browser at localhost:5555
cd apps/api && npx prisma migrate dev --name <name>   # create a new migration
```

---

## Scaffolding CLI

The standalone `typeforge` CLI bootstraps new TypeScript projects:

```bash
cd packages/cli && npm install && npm run build
node dist/index.js new my-project --template node
```

---

## Contributing

1. Fork and create a feature branch
2. Make changes and add tests
3. Run `npm run build && npm test` from root
4. Open a pull request

## License

MIT
