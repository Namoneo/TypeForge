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
| AI Mentor | ✅ Claude Opus 4 — Anthropic API or Claude CLI (local dev) |
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
| AI Mentor | Claude Opus 4 — `@anthropic-ai/sdk` or Claude CLI (dev) — streaming SSE |
| Logging | `nestjs-pino` — structured JSON (prod) / pretty-print (dev) |
| Monitoring | Sentry (`@sentry/node`, `@sentry/angular`) — 5xx errors only |
| DevOps | Docker Compose, Nginx, GitHub Actions CI |

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Docker](https://docker.com/) (for PostgreSQL + Redis)

---

## Quick Start

### Option A — one command (recommended)

```bash
git clone https://github.com/namoneo/typeforge.git
cd typeforge
chmod +x run.sh
./run.sh
```

`run.sh` starts Docker (Postgres + Redis), applies migrations, seeds the database if empty, and runs the API + web dev servers.

| Service | URL |
|---------|-----|
| Web | http://localhost:4200 |
| API | http://localhost:3000 |
| Swagger | http://localhost:3000/api/docs |

**Seeded admin login** (after `./run.sh seed` or first `./run.sh`):

| Email | Password |
|-------|------------|
| `admin@typeforge.dev` | `Admin1234!` |

Re-seed anytime (wipes and reloads challenges):

```bash
./run.sh seed
```

Stop Docker services:

```bash
./run.sh down
```

### Option B — manual setup

#### 1. Clone & install

```bash
git clone https://github.com/namoneo/typeforge.git
cd typeforge
npm install
```

#### 2. Start infrastructure

```bash
docker compose up postgres redis -d
```

#### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
```

Edit `apps/api/.env` — required fields:

```env
DATABASE_URL="postgresql://typeforge:typeforge@localhost:5432/typeforge"
JWT_SECRET="change-me-in-production"
JWT_REFRESH_SECRET="change-me-too-in-production"
FRONTEND_URL="http://localhost:4200"
PORT=3000

# AI Mentor — pick one (see "AI Mentor" section below)
ANTHROPIC_API_KEY=
# AI_MENTOR_PROVIDER=cli

# Optional — password reset emails (omit to log links to console in dev)
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
SMTP_FROM="TypeForge <noreply@typeforge.dev>"

# Optional — error tracking
SENTRY_DSN=
```

#### 4. Set up the database

```bash
cd apps/api
npx prisma migrate deploy
npm run prisma:seed
```

#### 5. Run both apps

```bash
# From repo root — starts API + web dev server concurrently
npm run dev

# Or individually:
cd apps/api && npm run dev     # http://localhost:3000
cd apps/web && npm start       # http://localhost:4200
```

Open **http://localhost:4200**, log in with the seeded admin account (or register), and start coding.

---

## AI Mentor

The mentor streams answers over SSE at `POST /api/ai-mentor/ask` (JWT required).

### Production / default: Anthropic API

Set an API key from [console.anthropic.com](https://console.anthropic.com):

```env
ANTHROPIC_API_KEY=sk-ant-...
```

### Local dev only: Claude CLI

Use your global [Claude Code CLI](https://code.claude.com) login instead of an API key:

```bash
brew install anthropics/tap/claude   # if needed
claude auth login
```

```env
AI_MENTOR_PROVIDER=cli
# Leave ANTHROPIC_API_KEY empty to use subscription billing via CLI
# CLAUDE_CLI_PATH=claude
# CLAUDE_CLI_MODEL=
```

`AI_MENTOR_PROVIDER=cli` is **ignored in production** — deploys always use the Anthropic API.

---

## Troubleshooting

### No challenges after seed

Challenges require a running API **and** a logged-in user. Verify:

```bash
curl http://localhost:3000/api/health   # should return JSON, not HTML
```

If port 3000 serves another app, either stop it or run TypeForge on another port:

```env
# apps/api/.env
PORT=3001
```

Update `apps/web/proxy.conf.json` to match, then restart `npm run dev`.

### `P1010` / database auth errors on migrate or seed

A local Postgres (often Homebrew) may be bound to `localhost:5432` and shadow the Docker container. Stop it (`brew services stop postgresql@16`) and use `postgresql://typeforge:typeforge@localhost:5432/typeforge`.

### `EADDRINUSE` on port 3000

Another process is using the API port. Find it with `lsof -nP -iTCP:3000 -sTCP:LISTEN`, stop it, or set `PORT=3001` as above.

### AI Mentor loops or repeats

Restart the dev servers after pulling latest — a fixed Angular `effect()` was re-triggering hint requests when streaming finished.

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
DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, FRONTEND_URL, ANTHROPIC_API_KEY
```

---

## Where to Host

TypeForge is a **full-stack** app (Angular + NestJS + PostgreSQL + Redis + WebSockets + `isolated-vm`). There is no single free tier that runs everything with one click, but these options work well:

### Best for production / demos — Docker VM

Use the included `docker-compose.prod.yml` on a small VPS:

| Provider | Notes |
|----------|--------|
| [Oracle Cloud Always Free](https://www.oracle.com/cloud/free/) | ARM VM — enough for Postgres + API + web; best **always-free** option |
| [Hetzner](https://www.hetzner.com/cloud) | Cheap paid VPS (~€4/mo) — reliable for always-on demos |
| [DigitalOcean](https://www.digitalocean.com/) | Simple Docker droplets |

```bash
cp apps/api/.env.example .env.prod
# fill in secrets, then:
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

This is the most reliable path because `isolated-vm`, WebSockets, and long-running Node processes work in a normal Linux container.

### Managed split (less ops)

Deploy components separately:

| Component | Suggested hosts |
|-----------|-----------------|
| **PostgreSQL** | [Neon](https://neon.tech), [Supabase](https://supabase.com) |
| **Redis** | [Upstash](https://upstash.com) |
| **API** (NestJS) | [Render](https://render.com), [Railway](https://railway.app), [Fly.io](https://fly.io) |
| **Web** (Angular static) | [Cloudflare Pages](https://pages.cloudflare.dev), [Netlify](https://netlify.com), [Vercel](https://vercel.com) |

Set `DATABASE_URL`, `REDIS_URL`, `FRONTEND_URL`, and JWT secrets on the API service. Build the Angular app with the production API URL and deploy the `dist/` output to a static host.

### Poor fit

| Platform | Why |
|----------|-----|
| **Vercel / Netlify alone** | Good for the static frontend only — not for NestJS + WebSockets + `isolated-vm` |
| **GitHub Pages** | Static only; no API or database |

### Cost notes

- **AI Mentor** requires `ANTHROPIC_API_KEY` in production (CLI mode is dev-only).
- Free tiers on Render/Railway may **sleep** after inactivity (cold starts). Paid hobby tiers (~$5–7/mo per service) avoid that.

---

## Development

```bash
./run.sh                              # docker + migrate + seed + dev servers
./run.sh seed                         # re-run seed (wipes challenges)
./run.sh down                         # stop docker services
npm run build                         # build everything
npm test                              # run all tests
cd apps/api && npm run dev            # API dev server with watch
cd apps/web && npm start              # Angular dev server
cd apps/api && npm run prisma:studio  # DB browser at localhost:5555
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
