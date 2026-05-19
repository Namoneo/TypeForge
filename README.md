# TypeForge

> AI-Powered TypeScript Mastery Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Angular](https://img.shields.io/badge/Angular-19-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![NestJS](https://img.shields.io/badge/NestJS-11-e0234e?logo=nestjs&logoColor=white)](https://nestjs.com)

An interactive, full-stack TypeScript learning platform that takes developers from beginner to expert. Think VSCode in the browser + LeetCode-style challenges + an AI mentor + gamification.

---

## Architecture

```
TypeForge/
├── apps/
│   ├── web/          # Angular 19 frontend (standalone, signals, TailwindCSS v4)
│   └── api/          # NestJS 11 backend (JWT auth, WebSockets, REST)
├── libs/
│   └── shared/       # Shared TypeScript types, DTOs, and constants
├── packages/
│   └── cli/          # TypeForge scaffolding CLI (standalone tool)
└── docker-compose.yml
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Angular 19, Standalone components, Signals, TailwindCSS v4, Monaco Editor |
| Backend | NestJS 11, Prisma 5, PostgreSQL, Redis, BullMQ, Socket.IO |
| Auth | JWT access tokens + refresh tokens, bcrypt password hashing |
| Compilation | TypeScript compiler API (`typescript` npm package) — live diagnostics |
| DevOps | Docker Compose, Nginx reverse proxy |

## Features

| Feature | Status |
|---------|--------|
| Interactive TypeScript Playground | ✅ Monaco Editor + TS compiler API |
| Real-time compilation diagnostics | ✅ Server-side `ts.createProgram` |
| JWT auth (register / login / refresh) | ✅ |
| Learning tracks (5 levels) | ✅ Beginner → Enterprise |
| Challenge system (LeetCode-style) | ✅ Submit → compile → run test cases |
| XP & levelling system | ✅ XP on challenge completion |
| WebSocket gateway | ✅ Live compilation via Socket.IO |
| Global leaderboard | ✅ |
| Swagger API docs | ✅ `/api/docs` |
| AI Mentor (explain errors, review code, hints) | ✅ Claude claude-opus-4-7 via `@anthropic-ai/sdk` — streaming SSE |

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
npm install          # installs root deps (concurrently)
```

### 2. Start infrastructure

```bash
docker-compose up postgres redis -d
```

### 3. Configure environment

```bash
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env — set JWT_SECRET, JWT_REFRESH_SECRET
# Optional: set ANTHROPIC_API_KEY to enable the AI Mentor (get one at https://console.anthropic.com)
```

### 4. Set up the database

```bash
cd apps/api
npm install
DATABASE_URL="postgresql://typeforge:typeforge@localhost:5432/typeforge" \
  npx prisma migrate dev --name init
DATABASE_URL="postgresql://typeforge:typeforge@localhost:5432/typeforge" \
  npm run prisma:seed
```

### 5. Run both apps

```bash
# From repo root — runs API + web dev server concurrently
npm run dev

# Or separately:
cd apps/api  && npm run dev        # http://localhost:3000  (API)
cd apps/web  && npm start          # http://localhost:4200  (UI)
```

Open **http://localhost:4200** — create an account and start coding.

---

## API Reference

Swagger UI is available at **http://localhost:3000/api/docs** when the API is running.

Key endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/auth/register` | Create account |
| `POST` | `/api/auth/login` | Login, get tokens |
| `POST` | `/api/auth/refresh` | Refresh access token |
| `GET` | `/api/users/me` | Current user profile |
| `GET` | `/api/users/me/progress` | Learning progress |
| `GET` | `/api/users/leaderboard` | Global leaderboard |
| `GET` | `/api/challenges` | List challenges (filter by track/difficulty) |
| `GET` | `/api/challenges/:id` | Get single challenge |
| `POST` | `/api/challenges/submit` | Submit code, run test cases |
| `POST` | `/api/compiler/compile` | Compile TypeScript, get diagnostics |
| `POST` | `/api/ai-mentor/ask` | AI Mentor — streams SSE (explain errors / review / hint / concept) |

WebSocket namespace: `/typeforge`  
Events: `compile` → `compile:result`, `playground:join` → `playground:joined`

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

## Docker (full stack)

```bash
docker-compose up --build
```

Starts: PostgreSQL, Redis, NestJS API, Angular (served by Nginx)  
App available at **http://localhost:4200**

---

## Development

```bash
# Build everything
npm run build

# Run tests
npm test

# API only
cd apps/api && npm run dev

# Frontend only
cd apps/web && npm start

# Prisma Studio (DB browser)
cd apps/api && npm run prisma:studio
```

---

## Scaffolding CLI

The repo also includes the standalone `typeforge` CLI for bootstrapping new TypeScript projects:

```bash
cd packages/cli && npm install && npm run build
node dist/index.js new my-project --template node
```

---

## Contributing

1. Fork the repo and create a feature branch
2. Make changes and add tests
3. Run `npm run build` and `npm test` from root
4. Open a pull request

## License

MIT
