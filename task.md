# Codebase Improvement Tasks

| #   | Issue                                                             | Priority    | Status |
| --- | ----------------------------------------------------------------- | ----------- | ------ |
| 1   | Fix duplicate db schema path (`models/` vs `schema/`)             | 🔴 Critical | Done   |
| 2   | Add graceful shutdown (SIGTERM/SIGINT handler)                    | 🔴 Critical | Done   |
| 3   | Add unit & integration tests                                      | 🔴 Critical | Todo   |
| 4   | Add authentication/authorization example (JWT)                    | 🟡 High     | Todo   |
| 5   | Make example module realistic (CRUD with DB)                      | 🟡 High     | Todo   |
| 6   | Add example for POST/PUT/PATCH/DELETE with body & path params     | 🟡 High     | Todo   |
| 7   | Add API versioning (`/api/v1/`)                                   | 🟡 High     | Todo   |
| 8   | Add seed script for development data                              | 🟡 High     | Todo   |
| 9   | Implement dependency injection mechanism (e.g. factory functions) | 🟡 High     | Todo   |
| 10  | Add rate limiting middleware                                      | 🟡 High     | Todo   |
| 11  | Add pagination example using `PaginationMeta`                     | 🟢 Medium   | Todo   |
| 12  | Fix `tsconfig.json` `types` mismatch (`bun-types` → `@types/bun`) | 🟢 Medium   | Todo   |
| 13  | Remove `ignoreDeprecations: "6.0"` and resolve deprecated options | 🟢 Medium   | Todo   |
| 14  | Remove unused `exampleResponseSchema.ts` or integrate it          | 🔵 Low      | Todo   |
