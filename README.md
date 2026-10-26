# Recorder Backend API

NestJS API for reading users and products from Supabase. Swagger documentation
is available at `/docs`.

## API endpoints

| Method | Path | Description |
| --- | --- | --- |
| `GET` | `/users` | Get all users |
| `GET` | `/products` | Get all products |
| `GET` | `/products/name/:name` | Get products matching the exact name |

The name endpoint returns an array because product names are not necessarily
unique.

## Configuration

Use Node.js 22 or newer.

Copy `.env.example` to `.env` and set:

- `DATABASE_URL` — the PostgreSQL connection string from Supabase. Keep it
  secret; configure it as a Vercel environment variable for deployment. For
  Vercel/serverless deployments, use the Supabase pooler connection string
  rather than a direct database connection string.
- `PORT` — optional; defaults to `3000` for local development.

The API uses a PostgreSQL connection directly, so a Supabase API or service
role key is not needed. The database role in the connection string must have
permission to read the `users` and `products` tables.

## Run locally

```sh
npm install
npm run start:dev
```

## Vercel

Set `DATABASE_URL` in the Vercel project's environment variables, then deploy.
The Vercel function serves the same endpoints and Swagger UI as the local
NestJS server.

```sh
npm run build
```