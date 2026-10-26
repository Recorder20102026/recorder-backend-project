# Recorder Backend API

NestJS API for reading users and products from a PostgreSQL database. Swagger
documentation is available at `/api-docs`.

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
  secret; configure it as an environment variable for deployment. For
  serverless deployments such as Vercel, use the Supabase pooler connection
  string.
- `PORT` — optional locally (defaults to `3000`). Render sets this
  automatically; do not hard-code it in Render settings.

The API connects directly to PostgreSQL, so a Supabase API or service-role
key is not needed. The database role in the connection string must have
permission to read the `users` and `products` tables.

## Run locally

```sh
npm install
npm run start:dev
```

Open Swagger at `http://localhost:3000/api-docs`.

## Vercel

Set `DATABASE_URL` in the Vercel project's environment variables, then deploy.
The Swagger UI is available at `https://<your-vercel-domain>/api-docs`.

```sh
npm run build
```

## Render

Create a Render Web Service from this repository. The included `render.yaml`
sets the build command to `npm ci && npm run build`, the start command to
`npm run start:prod`, and prompts you to set `DATABASE_URL` as a secret
environment variable. Render supplies `PORT` automatically.

After deployment, Swagger UI is available at
`https://<your-render-service>.onrender.com/api-docs`.