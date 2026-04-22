# AGENTS.md

## Overview

Monorepo for **Personal OS**.

```text
apps/web       → Next.js (UI + API routes)
packages/core  → business logic (source of truth)
packages/db    → Prisma + DB client
packages/ai    → AI agents (later)
```

---

## Architecture (strict)

```text
UI / API → core → db
```

❌ Never:

```text
API → Prisma directly
UI → DB
```

---

## Responsibilities

### apps/web

- feature-based frontend structure
- route handlers
- UI
- request/response handling

### packages/core

- business logic
- validation
- reusable services

### packages/db

- Prisma schema + client only
- no business logic

### packages/ai (later)

- agents + prompts
- must call `core`, not DB

---

## Imports

```ts
import { prisma } from "@db";
import { createItem } from "@core/modules/items";
```

❌ Avoid deep relative imports

---

## Route Rules

Route handlers must stay thin:

- parse input
- call core
- return response

❌ No business logic
❌ No Prisma usage

---

## Core Rules

- typed inputs
- validation inside module
- reusable logic
- only layer that talks to DB

```ts
export async function createItem(input) {
  return prisma.item.create({ data: input });
}
```

---

## Frontend Architecture

```text
app/
features/
  items/
    components/
    hooks/
    api/
    utils/
    types.ts
  tasks/
    components/
    hooks/
    api/
    utils/
    types.ts
components/   # shared only
lib/          # global helpers only
```

Rules:

- colocate everything per feature
- avoid global dumping in `lib/`
- keep components local unless reused

---

## Core Module Structure

```text
packages/core/src/modules/items/
  item.service.ts
  item.types.ts
  item.validators.ts
  index.ts
```

---

## DB Rules

- single Prisma client
- no logic in db package
- keep schema simple + extensible

---

## AI Rule (future)

```text
AI → core → db
```

❌ Never bypass core

---

## State Management

- Use **TanStack Query** for server state
- ❌ No direct fetching inside components

---

## Coding Priorities

1. architecture
2. readability
3. type safety
4. extensibility

---

## Definition of Done

- logic is in `core`
- API is thin
- no Prisma in UI
- frontend is feature-based
- imports are clean

---

## Agent Rules

- **Ask before**:
  - DB schema changes
  - dependency changes
  - auth changes

- **Never**:
  - commit secrets
  - edit Prisma generated files
  - modify lockfiles manually

- **Commits**:

  ```
  type(scope): description [AI-assisted]
  ```

- **Validation required**:

  ```
  pnpm check-types
  pnpm lint
  ```

- **Architectural integrity**:
  - If API changes → update frontend accordingly

---

## Execution Strategy

- Prefer incremental changes over large rewrites
- Always keep the system in a working state
- Explain tradeoffs when making structural decisions
