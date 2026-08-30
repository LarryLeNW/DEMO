# AIHUB Backend (NestJS)

Authentication & authorization API for the AIHUB storefront/admin.

- **Stack:** NestJS 12 (ESM), TypeORM 1.x + MySQL 8 (`mysql2`), Passport JWT, class-validator, Swagger
- **Auth:** email + password (bcrypt), short-lived access token + rotating refresh token, `@Public()` / `@Roles()` decorators with global guards
- **Roles:** `admin`, `seller`, `customer`

## Setup

```bash
cd backend
cp .env.example .env      # fill JWT_* secrets (>= 32 chars) – dev values are already in .env
npm install
npm run start:dev         # http://localhost:4000/api  – Swagger: http://localhost:4000/docs
```

Database: `aihub` on `localhost:3306`, user `root`, empty password (see `.env`).
With `DB_SYNCHRONIZE=true` (development only) TypeORM creates/updates tables from the entities on start.
On first start an admin account is seeded from `ADMIN_EMAIL` / `ADMIN_PASSWORD` if that email does not exist yet.

## Scripts

| Script                 | What it does                                   |
| ---------------------- | ---------------------------------------------- |
| `npm run start:dev`    | Dev server with watch                          |
| `npm run build`        | Compile to `dist/`                             |
| `npm run start:prod`   | Run compiled build                             |
| `npm run lint`         | oxlint                                         |
| `npm test`             | Unit tests (vitest)                            |
| `npm run test:e2e`     | End-to-end auth flow (needs the MySQL from `.env`) |

## Endpoints (`/api`)

| Method | Path                | Auth              | Description                                   |
| ------ | ------------------- | ----------------- | --------------------------------------------- |
| GET    | `/health`           | public            | Liveness probe                                |
| POST   | `/auth/register`    | public            | Create a `customer` account, returns tokens   |
| POST   | `/auth/login`       | public            | Returns `{ user, tokens }`                    |
| POST   | `/auth/refresh`     | body refreshToken | Rotates the token pair; old refresh token dies|
| POST   | `/auth/logout`      | bearer            | Revokes the refresh token                     |
| GET    | `/auth/me`          | bearer            | Current profile                               |
| PATCH  | `/auth/password`    | bearer            | Change password (revokes refresh tokens)      |
| GET    | `/users`            | admin             | Paginated list (`page`, `limit`, `search`, `role`) |
| GET    | `/users/:id`        | admin             | User detail                                   |
| PATCH  | `/users/:id/role`   | admin             | Change role                                   |
| PATCH  | `/users/:id/status` | admin             | Lock / unlock (`isActive`)                    |

Token response shape:

```json
{
  "accessToken": "…",
  "refreshToken": "…",
  "tokenType": "Bearer",
  "expiresIn": "15m"
}
```

Send `Authorization: Bearer <accessToken>` on protected routes. When it expires, call
`POST /auth/refresh` with `{ "refreshToken": "…" }` and store the new pair.

## Project layout

```
src/
  main.ts                    bootstrap: prefix, CORS, Swagger
  app.module.ts              global ValidationPipe / serializer / guards
  config/env.validation.ts   typed + validated environment variables
  database/                  TypeORM (MySQL) module
  common/
    decorators/              @Public(), @Roles(), @CurrentUser()
    guards/                  JwtAuthGuard (global), RolesGuard (global), JwtRefreshGuard
    enums/role.enum.ts
  users/                     User entity, admin endpoints, admin seed
  auth/                      register/login/refresh/logout, JWT strategies
```

## Adding a protected route

```ts
@Controller('orders')
export class OrdersController {
  @Get()                       // any signed-in user
  list(@CurrentUser() user: User) {}

  @Roles(Role.Admin, Role.Seller)
  @Post()                      // only these roles
  create() {}

  @Public()
  @Get('public')               // no token required
  publicList() {}
}
```

## Production notes

- Set `NODE_ENV=production`, `DB_SYNCHRONIZE=false` and manage schema with TypeORM migrations.
- Use long random `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`; Swagger is disabled in production.
- Remove `ADMIN_PASSWORD` from the environment after the first boot.
