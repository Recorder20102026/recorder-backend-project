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

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY` — keep this secret; configure it as a Vercel
  environment variable for deployment.
- `PORT` — optional; defaults to `3000` for local development.

The API selects only the columns in the provided schema. Configure Supabase
RLS and credentials according to your deployment's access requirements.

## Run locally

```sh
npm install
npm run start:dev
```

## Vercel

Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Vercel project's
environment variables, then deploy. The Vercel function serves the same
endpoints and Swagger UI as the local NestJS server.

```sh
npm run build
```