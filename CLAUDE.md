# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev                  # start Next.js dev server
pnpm build                # prisma generate + next build
pnpm --filter web lint    # ESLint (web only)
pnpm prisma:generate      # generate Prisma client (runs automatically on install/build)
pnpm prisma:migrate       # run migrations in dev
```

Type-check with `npx tsc --noEmit` from the root (no dedicated script exists yet).

Before any commit, run:
```bash
pnpm --filter web lint
npx tsc --noEmit
```

## Architecture

Strict layered monorepo — never bypass a layer:

```
apps/web (UI + route handlers) → packages/core (business logic) → packages/db (Prisma client)
```

- Route handlers must only parse input, call a `core` function, and return a response. No Prisma, no logic.
- `packages/core` is the only layer that talks to the DB.
- `packages/ai` (future) must call `core`, not `@db` directly.

### Path aliases

| Alias | Resolves to |
|---|---|
| `@db` | `packages/db/index.ts` |
| `@core/*` | `packages/core/src/*` |
| `@ai/*` | `packages/ai/*` |
| `@/*` | `apps/web/*` (within the web app) |

### Data model — polymorphic Item

Every content type (Job, Note, Todo, Transaction, Bookmark) is stored as a child of a base `Item` record. `Item` holds `type`, `title`, `tags`, `metadata`, and the `userId`. The type-specific record (`Job`, `Note`, etc.) has a 1-to-1 relation back to `Item` via `itemId`.

Creating any content type means creating an `Item` + a nested type record in a single Prisma `create` call. The `item.service.ts` pattern is the reference for this.

### Auth

`better-auth` with a Prisma adapter (`apps/web/lib/auth.ts`). Session helpers live in `apps/web/lib/auth-session.ts`. Route handlers call `getRequiredSession()`, which throws `UnauthorizedError` on missing/invalid sessions.

### Frontend structure

```
apps/web/
  app/           # Next.js pages + API routes
  modules/       # feature modules (items, jobs, notes, todos, search…)
    <feature>/
      api/       # fetch helpers
      components/
      hooks/
      types.ts
  components/    # shared UI components only
  lib/           # auth helpers and global utilities only
```

State is managed with plain `useState` + custom hooks (e.g. `useItems`, `useJobs`). The hooks own fetch/mutation calls; components stay declarative.

### Prisma config

Schema and migrations live in `packages/db/prisma/`. The root `prisma.config.ts` points Prisma CLI at those paths — always run Prisma commands from the repo root.

## Rules

- **Ask before**: DB schema changes, adding/removing dependencies, auth changes.
- **Never**: edit Prisma-generated files, modify lockfiles manually.
- Commit format: `type(scope): description [AI-assisted]`
