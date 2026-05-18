# TypeForge

> A modern TypeScript project scaffolding CLI — early development, v0.1.0

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

TypeForge is a TypeScript project scaffolding tool. It provides a structured starting point for new TypeScript projects with sensible defaults and a clean build setup.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage](#usage)
- [Development](#development)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Vision & Roadmap](#vision--roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Prerequisites

- [Node.js](https://nodejs.org/) 18 or later
- [npm](https://www.npmjs.com/) 9 or later

## Installation

```bash
# Clone the repository
git clone https://github.com/namoneo/typeforge.git
cd typeforge

# Install dependencies
npm install
```

## Quick Start

```bash
# Build the project
npm run build

# Run the CLI
node dist/index.js
# → Hello from TypeForge, World!
```

## Usage

Import TypeForge utilities in your TypeScript project:

```typescript
import { greet } from 'typeforge';

console.log(greet('Alice'));
// → Hello from TypeForge, Alice!
```

## Development

```bash
# Watch mode — recompiles on file changes
npm run dev

# Run tests
npm test

# Lint source files
npm run lint

# Auto-format source files
npm run format
```

## Scripts

| Script | Description |
|--------|-------------|
| `build` | Compile TypeScript to `dist/` |
| `dev` | Watch mode compilation |
| `test` | Run Jest test suite |
| `lint` | ESLint on `src/**/*.ts` |
| `format` | Prettier on `src/**/*.ts` |

## Project Structure

```
TypeForge/
├── src/
│   └── index.ts        # Main entry point
├── dist/               # Compiled output (git-ignored)
├── tsconfig.json       # TypeScript compiler config
├── package.json
└── README.md
```

**TypeScript config highlights:**
- Target: `ES2022`
- Module: `NodeNext`
- Strict mode enabled
- Source maps and declaration files emitted

---

## Vision & Roadmap

The long-term vision for TypeForge is to become an **AI-powered TypeScript mastery platform** — an interactive environment that guides developers from beginner to expert-level TypeScript. Think of it as:

- **VSCode in the browser** — a familiar, powerful editing experience via Monaco Editor
- **Interactive playground** — live TypeScript execution, AST analysis, and hover types
- **AI mentor** — senior-level guidance, error analysis, and code review
- **Visual compiler explorer** — see how types transform and resolve
- **Gamified learning platform** — XP, streaks, levels, achievements, and structured progression

### Planned Learning Tracks

| Track | Topics |
|-------|--------|
| Beginner | Variables, functions, interfaces, unions, enums |
| Intermediate | Generics, overloads, utility types, mapped types |
| Advanced | Conditional types, template literals, recursion, variance |
| Expert | Type-level programming, compiler internals, DSL creation |
| Enterprise | Angular, NestJS, Prisma, Zod, monorepos, API contracts |

### Planned Tech Stack

**Frontend:** Angular (standalone), Signals, TailwindCSS v4, Monaco Editor, Shiki  
**Backend:** NestJS, PostgreSQL, Prisma, Redis, BullMQ, WebSocket, JWT auth  
**Infra:** Nx or Turborepo monorepo

> This section describes future plans. Current code reflects the scaffolding foundation only.

---

## Contributing

Contributions are welcome! To get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes and add tests where appropriate
4. Run `npm run lint && npm test` to verify
5. Open a pull request with a clear description

Please keep pull requests focused — one feature or fix per PR.

## License

[MIT](LICENSE)
