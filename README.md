# Hono Drizzle API Template

Backend REST API scaffold menggunakan Bun, TypeScript, Hono, Drizzle ORM, dan PostgreSQL.  
Mengadopsi **Clean Architecture** dengan pemisahan layer handler → usecase → repository untuk setiap module fitur.

## Tech Stack

| Layer      | Teknologi                 |
| ---------- | ------------------------- |
| Runtime    | Bun                       |
| Bahasa     | TypeScript (strict)       |
| Framework  | Hono                      |
| ORM        | Drizzle ORM               |
| Database   | PostgreSQL                |
| Validation | Zod + @hono/zod-validator |
| Auth       | JWT (hono/utils/jwt)      |
| Logging    | Pino + AsyncLocalStorage  |
| Rate Limit | hono-rate-limiter         |

## Tree Structure

```txt
.
├── src/
│   ├── config/          # Validasi dan ekspor environment variables yang typed
│   ├── db/
│   │   ├── migrations/  # Output file migration dari drizzle-kit
│   │   ├── schema/      # Definisi tabel Drizzle ORM
│   │   └── seeds/       # Data awal untuk development
│   ├── middlewares/      # Middleware global (auth, admin, cors, logger, rate-limiter, security, error-handler)
│   ├── modules/         # Setiap module fitur dengan arsitektur Clean Architecture
│   │   ├── auth/        # Autentikasi (login, logout, me)
│   │   │   ├── handler/     # HTTP request/response handler
│   │   │   ├── repository/  # Akses database (queries & commands)
│   │   │   ├── schema/      # Validasi Zod
│   │   │   └── usecase/     # Business logic
│   │   └── user/        # Manajemen user CRUD (admin-only)
│   │       ├── handler/
│   │       ├── repository/
│   │       ├── schema/
│   │       └── usecase/
│   ├── routes/          # Registry utama route aplikasi
│   ├── types/           # Shared TypeScript types (Hono env, API response)
│   ├── utils/           # Helper utilities (logger, pagination, request context, response builder)
│   ├── app.ts           # Inisialisasi Hono app dan pemasangan middleware
│   └── index.ts         # Entry point server Bun
├── tests/               # Test suite per modul (mirror struktur src/)
│   ├── config/
│   ├── middlewares/
│   ├── modules/
│   │   ├── auth/
│   │   └── user/
│   └── utils/
├── .env.example         # Contoh environment variables
├── docker-compose.yml   # PostgreSQL lokal untuk development
├── drizzle.config.ts    # Konfigurasi Drizzle Kit
├── package.json
├── tsconfig.json        # TypeScript strict
└── vitest.config.ts     # Konfigurasi Vitest
```

## Arsitektur

Setiap module fitur mengikuti pola **Clean Architecture** dengan dependency injection sederhana:

```
routes → handler → usecase → repository → db
```

- **routes** — mendefinisikan endpoint dan middleware per-module
- **handler** — menangani HTTP request/response, validasi input
- **usecase** — business logic murni, tidak tergantung HTTP
- **repository** — akses database (queries & commands terpisah)
- **index.ts** — wiring dependency injection (manual DI tanpa framework)

Module saat ini:

| Module | Path                | Fungsi                          |
| ------ | ------------------- | ------------------------------- |
| Auth   | `src/modules/auth/` | Login, logout, dan current user |
| User   | `src/modules/user/` | CRUD user (admin-only)          |

## API Endpoints

Prefix: `/api/v1`

### Auth (Public)

| Method | Path           | Auth    | Fungsi                            |
| ------ | -------------- | ------- | --------------------------------- |
| `POST` | `/auth/login`  | ✗       | Login, mengembalikan JWT token    |
| `POST` | `/auth/logout` | ✗       | Logout                            |
| `GET`  | `/auth/me`     | ✓ (JWT) | Ambil data user yang sedang login |

### Users (Admin Only)

| Method   | Path         | Auth            | Fungsi                 |
| -------- | ------------ | --------------- | ---------------------- |
| `GET`    | `/users`     | ✓ (JWT + Admin) | List user (pagination) |
| `GET`    | `/users/:id` | ✓ (JWT + Admin) | Detail user            |
| `POST`   | `/users`     | ✓ (JWT + Admin) | Buat user baru         |
| `PUT`    | `/users/:id` | ✓ (JWT + Admin) | Update user            |
| `DELETE` | `/users/:id` | ✓ (JWT + Admin) | Hapus user             |

### Health

| Method | Path      | Fungsi                                  |
| ------ | --------- | --------------------------------------- |
| `GET`  | `/health` | Health check server (tanpa autentikasi) |

## Response Format

Sukses (200/201):

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "errors": {}
}
```

### Error Codes

| HTTP Status | Code                    |
| ----------- | ----------------------- |
| 400         | `BAD_REQUEST`           |
| 401         | `UNAUTHORIZED`          |
| 403         | `FORBIDDEN`             |
| 404         | `NOT_FOUND`             |
| 409         | `CONFLICT`              |
| 422         | `UNPROCESSABLE_ENTITY`  |
| 429         | `TOO_MANY_REQUESTS`     |
| 500         | `INTERNAL_SERVER_ERROR` |

## Environment Variables

Buat file `.env` berdasarkan `.env.example`:

```env
APP_NAME=codebase-hono

# App
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# Auth
JWT_SECRET=change-me-to-a-random-secret
```

`LOG_LEVEL` bersifat opsional. Default: `debug` untuk development, `info` untuk production.

## Scripts

| Script                | Fungsi                                           |
| --------------------- | ------------------------------------------------ |
| `bun run dev`         | Menjalankan server development dengan watch mode |
| `bun run start`       | Menjalankan aplikasi menggunakan Bun             |
| `bun run build`       | Build aplikasi ke direktori `dist`               |
| `bun run typecheck`   | TypeScript type checking tanpa emit file         |
| `bun run test`        | Menjalankan seluruh test suite                   |
| `bun run test:watch`  | Menjalankan test dalam watch mode                |
| `bun run db:generate` | Generate migration Drizzle berdasarkan schema    |
| `bun run db:migrate`  | Menjalankan migration ke database                |
| `bun run db:studio`   | Membuka Drizzle Studio                           |
| `bun run db:push`     | Push schema langsung ke database                 |
| `bun run db:seed`     | Seed data awal (admin + user contoh)             |

## Setup Lokal

1. Install dependencies.

```bash
bun install
```

2. Jalankan PostgreSQL via Docker (opsional).

```bash
docker compose up -d
```

3. Buat file `.env`.

```bash
cp .env.example .env
```

4. Sesuaikan nilai `DATABASE_URL`, `PORT`, `NODE_ENV`, dan `JWT_SECRET`.

5. Generate dan jalankan migration.

```bash
bun run db:generate
bun run db:migrate
```

6. (Opsional) Seed data awal.

```bash
bun run db:seed
```

7. Jalankan development server.

```bash
bun run dev
```

Server akan berjalan di `http://localhost:3000`.

## Middleware Global

Semua middleware dipasang di `src/app.ts` dalam urutan berikut:

1. **Logger** — request-scoped Pino logger dengan `requestId` dan `AsyncLocalStorage`
2. **Rate Limiter** — 100 request per 15 menit per IP (dilewati untuk `/health`)
3. **CORS** — izin semua origin
4. **Security Headers** — secure headers via `hono/secure-headers`
5. **Error Handler** — centralized error handler untuk semua error yang tidak tertangani
6. **404 Handler** — response konsisten untuk route yang tidak ditemukan

## Menambahkan Module Baru

1. Buat folder `src/modules/<nama-module>/` dengan struktur berikut:

```
src/modules/<nama-module>/
├── handler/
│   ├── index.ts
│   └── <action>.ts
├── repository/
│   ├── index.ts
│   ├── queries.ts
│   └── commands.ts
├── schema/
│   └── <nama-module>Schema.ts
├── usecase/
│   ├── index.ts
│   └── <action>.ts
├── <nama-module>.routes.ts
└── index.ts
```

2. Ikuti pola dependency injection yang sudah ada (repository → usecase → handler → routes).

3. Mount module di `src/routes/index.ts`.
