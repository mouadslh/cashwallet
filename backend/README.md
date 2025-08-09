# Cash Wallet Backend

Tech: Node.js, Express, MongoDB (with in-memory fallback), JWT auth

## Setup

1. Copy `.env.example` to `.env` and edit as needed
2. Run the server

```bash
cd backend
npm install
npm run dev
```

Seeding demo data: `npm run seed`.

## API

Base URL: `/api`

- Auth: `POST /auth/signup`, `POST /auth/login`, `GET /auth/me`
- Transactions: `GET /transactions`, `POST /transactions`, `GET /transactions/:id`, `PUT /transactions/:id`, `DELETE /transactions/:id`
- Stats: `GET /stats/overview`, `GET /stats/line-balance`, `GET /stats/monthly`
- Budgets: `GET /budgets`, `POST /budgets`, `DELETE /budgets/:category`
