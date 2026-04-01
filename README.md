# Personal OS

A unified platform to manage:

- Job applications
- Transactions
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

## 📁 Initial Structure

personal-os/
├── apps/
│ └── web/ # Next.js app
│
├── packages/
│ ├── db/ # Prisma schema + client
│ ├── core/ # business logic
│ └── ai/ # (later)
│
├── .env.example
├── package.json
├── turbo.json (optional later)
└── README.md
