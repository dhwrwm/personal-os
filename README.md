# Personal OS

A unified platform to manage:

- Job applications
- Notes
- Todos
- Bookmarks

## Stack

- Next.js
- Supabase (Postgres)
- Prisma
- n8n (automation)
- OpenAI (planned)

## Vision

AI-powered personal intelligence system.


## 📁 Project Structure

```
personal-os/
├── apps/
│   └── web/                # Next.js app (frontend + API routes)
│
├── packages/
│   ├── db/                 # Prisma schema + database client
│   ├── core/               # Shared business logic (services, utils)
│   └── ai/                 # AI-related modules (future scope)
│
├── .env.example            # Environment variables template
├── package.json            # Root dependencies & scripts
├── turbo.json              # Turborepo config (optional for scaling)
└── README.md               # Project documentation
```

---

### 🧠 Notes

* `apps/web` → Your main product (Next.js fullstack app)
* `packages/db` → Centralized DB layer (Prisma, migrations)
* `packages/core` → Reusable logic across apps (clean architecture move)
* `packages/ai` → Keep isolated so you can scale AI independently later
* `turbo.json` → Add when you want fast builds & monorepo scaling

