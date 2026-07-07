# Hono Drizzle API Template

Backend REST API scaffold menggunakan Bun, TypeScript, Hono, Drizzle ORM, dan PostgreSQL. Project ini disiapkan sebagai template standar untuk memulai backend baru dengan struktur yang modular, strict, dan mudah dikembangkan.

## Tech Stack

| Layer      | Teknologi                 |
| ---------- | ------------------------- |
| Runtime    | Bun                       |
| Bahasa     | TypeScript                |
| Framework  | Hono                      |
| ORM        | Drizzle ORM               |
| Database   | PostgreSQL                |
| Validation | Zod + @hono/zod-validator |
| Logging    | Pino                      |

## Tree Structure

```txt
.
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── db/
│   │   ├── migrations/
│   │   │   └── .gitkeep
│   │   ├── schema/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── cors.ts
│   │   ├── error-handler.ts
│   │   ├── logger.ts
│   │   └── security.ts
│   ├── modules/
│   │   └── example/
│   │       ├── example.handler.ts
│   │       ├── example.routes.ts
│   │       └── example.schema.ts
│   ├── routes/
│   │   └── index.ts
│   ├── types/
│   │   ├── app.ts
│   │   └── common.ts
│   ├── utils/
│   │   ├── logger.ts
│   │   └── response.ts
│   └── index.ts
├── .env.example
├── .gitignore
├── bun.lock
├── drizzle.config.ts
├── package.json
├── prompt-scaffolding-backend.md
├── README.md
└── tsconfig.json
```

## Fungsi Struktur Project

| Path                                     | Fungsi                                                                                                                                                                                   |
| ---------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/index.ts`                           | Entry point aplikasi. Menginisialisasi Hono app, memasang middleware global, mendaftarkan route, memasang error handler, dan menjalankan server Bun.                                     |
| `src/config/env.ts`                      | Tempat validasi dan ekspor konfigurasi environment yang typed. Semua konfigurasi runtime wajib diambil dari sini, bukan langsung dari `process.env`.                                     |
| `src/db/index.ts`                        | Setup koneksi PostgreSQL menggunakan `postgres` dan instance Drizzle ORM yang siap digunakan di seluruh aplikasi.                                                                        |
| `src/db/schema/index.ts`                 | Single entry point untuk semua schema Drizzle. Saat ini berisi placeholder table `users`.                                                                                                |
| `src/db/migrations/`                     | Direktori output file migration yang dibuat oleh `drizzle-kit generate`.                                                                                                                 |
| `src/middlewares/logger.ts`              | Middleware request logger berbasis Pino untuk mencatat method, path, status, response time, dan `requestId`. Middleware ini juga memasang child logger request-scoped ke `c.var.logger`. |
| `src/middlewares/cors.ts`                | Middleware konfigurasi CORS global menggunakan `hono/cors`.                                                                                                                              |
| `src/middlewares/security.ts`            | Middleware security headers menggunakan `hono/secure-headers`.                                                                                                                           |
| `src/middlewares/error-handler.ts`       | Centralized error handler untuk menjaga format response error tetap konsisten. Juga menyediakan `AppError` untuk error aplikasi.                                                         |
| `src/routes/index.ts`                    | Registry utama route aplikasi. Semua module route dipasang di sini dengan prefix `/api/v1`.                                                                                              |
| `src/modules/example/`                   | Contoh struktur module fitur. Digunakan sebagai pola saat menambahkan module baru.                                                                                                       |
| `src/modules/example/example.routes.ts`  | Definisi route untuk example module.                                                                                                                                                     |
| `src/modules/example/example.handler.ts` | Handler route untuk example module. Logic request-response module ditempatkan di sini.                                                                                                   |
| `src/modules/example/example.schema.ts`  | Schema Zod untuk validasi request/response module.                                                                                                                                       |
| `src/types/app.ts`                       | Shared Hono environment types untuk request-scoped variables seperti `logger` dan `requestId`.                                                                                           |
| `src/types/common.ts`                    | Shared TypeScript types seperti `ApiResponse`, `ApiSuccessResponse`, `ApiErrorResponse`, dan `PaginationMeta`.                                                                           |
| `src/utils/logger.ts`                    | Instance Pino logger utama dan helper `createChildLogger` agar logging modular dan reusable.                                                                                             |
| `src/utils/response.ts`                  | Helper response API agar format sukses dan error konsisten.                                                                                                                              |
| `drizzle.config.ts`                      | Konfigurasi Drizzle Kit untuk schema, migration output, dan koneksi database.                                                                                                            |
| `tsconfig.json`                          | Konfigurasi TypeScript strict untuk Bun + Hono, termasuk path alias `@/*`.                                                                                                               |
| `package.json`                           | Metadata project, scripts, dependencies, dan devDependencies.                                                                                                                            |
| `.env.example`                           | Contoh environment variable yang wajib disiapkan sebelum menjalankan aplikasi.                                                                                                           |
| `.gitignore`                             | Daftar file/folder yang tidak perlu masuk version control.                                                                                                                               |

## API Default

| Method | Path               | Fungsi                                           |
| ------ | ------------------ | ------------------------------------------------ |
| `GET`  | `/api/v1/health`   | Health check server dengan status dan timestamp. |
| `GET`  | `/api/v1/examples` | Route contoh untuk menunjukkan pola module.      |

## Response Format

Response sukses menggunakan format berikut:

```json
{
  "success": true,
  "data": {},
  "message": "Optional message",
  "meta": {}
}
```

Response error menggunakan format berikut:

```json
{
  "success": false,
  "message": "Error message",
  "code": "ERROR_CODE",
  "errors": {}
}
```

## Environment Variables

Buat file `.env` berdasarkan `.env.example`.

```env
NODE_ENV=development
PORT=3000
LOG_LEVEL=debug
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

`LOG_LEVEL` bersifat opsional. Jika tidak diisi, default-nya `debug` untuk non-production dan `info` untuk production.

## Scripts

| Script                | Fungsi                                                |
| --------------------- | ----------------------------------------------------- |
| `bun run dev`         | Menjalankan server development dengan watch mode.     |
| `bun run start`       | Menjalankan aplikasi menggunakan Bun.                 |
| `bun run build`       | Build aplikasi ke direktori `dist`.                   |
| `bun run typecheck`   | Menjalankan TypeScript type checking tanpa emit file. |
| `bun run db:generate` | Generate migration Drizzle berdasarkan schema.        |
| `bun run db:migrate`  | Menjalankan migration ke database.                    |
| `bun run db:studio`   | Membuka Drizzle Studio.                               |
| `bun run db:push`     | Push schema langsung ke database.                     |

## Setup

1. Install dependencies.

```bash
bun install
```

2. Buat file `.env`.

```bash
cp .env.example .env
```

3. Sesuaikan nilai `DATABASE_URL`, `PORT`, dan `NODE_ENV`.

4. Generate dan jalankan migration jika database sudah tersedia.

```bash
bun run db:generate
bun run db:migrate
```

5. Jalankan development server.

```bash
bun run dev
```

Server akan berjalan di port yang didefinisikan pada `PORT`.

## Menambahkan Module Baru

Gunakan pola folder berikut untuk setiap fitur baru:

```txt
src/modules/<module-name>/
├── <module-name>.routes.ts
├── <module-name>.handler.ts
└── <module-name>.schema.ts
```

Setelah module dibuat, import dan mount route-nya di `src/routes/index.ts` agar tersedia melalui prefix `/api/v1`.
