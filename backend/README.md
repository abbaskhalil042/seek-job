# Seek Job — Backend API

Job Portal Platform with **Resume Parsing** and **Analytics**.
Express + TypeScript + MongoDB (Mongoose), clean layered architecture.

## Architecture

Request flow: **routes → middlewares → controllers → services → repositories → models**

```
src/
├── config/        env (zod-validated), db connection, winston logger
├── constants/      enums (roles, job/application statuses, etc.)
├── types/          shared TS types + Express Request augmentation
├── utils/          ApiError, ApiResponse, asyncHandler, jwt, pagination, slug
├── models/         Mongoose schemas: User, Job, Application, Resume
├── repositories/   BaseRepository + per-model repos (only layer touching Mongoose)
├── services/       business logic: auth, user, job, application, resume,
│                   analytics, llm (provider-agnostic), textExtraction, heuristicParser
├── controllers/    thin HTTP adapters (validate → call service → send response)
├── routes/         route definitions + guards
├── middlewares/    auth (JWT + RBAC), validate (zod), upload (multer),
│                   error handler, rate limiter
├── validators/     zod request schemas
├── seed/           demo data seeder
├── app.ts          express app assembly
└── server.ts       bootstrap (db connect, listen, graceful shutdown)
```

## Quick start

```bash
cp .env.example .env          # adjust values if needed
npm install
npm run seed                  # optional: demo users + jobs
npm run dev                   # http://localhost:5050/api/v1
```

Requires a running MongoDB (`MONGODB_URI`, default `mongodb://127.0.0.1:27017/seek-job`).

### Scripts
| script | description |
|--------|-------------|
| `npm run dev`   | hot-reload dev server (tsx) |
| `npm run build` | compile to `dist/` |
| `npm start`     | run compiled build |
| `npm run seed`  | reset + seed demo data |

### Seeded accounts
| role | email | password |
|------|-------|----------|
| Admin    | admin@seekjob.dev    | Admin@12345 |
| Employer | employer@seekjob.dev | Employer@12345 |
| Seeker   | seeker@seekjob.dev   | Seeker@12345 |

## Resume parsing & matching — free LLM (optional)

The platform parses resumes and scores candidate↔job matches via a
**provider-agnostic LLM service** (`src/services/llm.service.ts`).

**It works with no API key out of the box** — when `LLM_API_KEY` is empty it
transparently falls back to a deterministic heuristic parser + skill-overlap
matcher. Check `GET /api/v1/health` → `llmEnabled`.

To enable a real (free-tier) LLM later, set in `.env` and restart — no code change:

```bash
# Option A — Google Gemini (free tier)   https://aistudio.google.com/apikey
LLM_PROVIDER=gemini
LLM_API_KEY=your_key
LLM_MODEL=gemini-2.0-flash

# Option B — Groq (free, very fast)       https://console.groq.com/keys
LLM_PROVIDER=groq
LLM_API_KEY=your_key
LLM_MODEL=llama-3.3-70b-versatile

# Option C — OpenRouter (free models)     https://openrouter.ai/keys
LLM_PROVIDER=openrouter
LLM_API_KEY=your_key
LLM_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

Existing resumes can be re-parsed with `POST /api/v1/resumes/:id/reparse`.

## API reference (`/api/v1`)

### Auth
| method | path | access | body |
|--------|------|--------|------|
| POST | `/auth/register` | public | name, email, password, role?, companyName? |
| POST | `/auth/login` | public | email, password |
| POST | `/auth/refresh` | public | refreshToken? (or cookie) |
| POST | `/auth/logout` | auth | — |
| GET  | `/auth/me` | auth | — |

### Users
| method | path | access |
|--------|------|--------|
| GET   | `/users/me` | auth |
| PATCH | `/users/me` | auth (updates seeker/employer profile) |
| DELETE| `/users/me` | auth (deactivate) |
| GET   | `/users/:id` | auth |

### Jobs
| method | path | access |
|--------|------|--------|
| GET   | `/jobs` | public — filters: `q, jobType, workMode, experienceLevel, location, skills, minSalary, page, limit, sort` |
| GET   | `/jobs/skills` | public |
| GET   | `/jobs/slug/:slug` | public |
| GET   | `/jobs/:id` | public |
| GET   | `/jobs/me/list` | employer/admin |
| POST  | `/jobs` | employer/admin |
| PATCH | `/jobs/:id` | owner/admin |
| PATCH | `/jobs/:id/status` | owner/admin |
| DELETE| `/jobs/:id` | owner/admin |
| GET   | `/jobs/:jobId/applications` | owner/admin |

### Resumes (job seekers)
| method | path |
|--------|------|
| POST   | `/resumes` (multipart, field `resume`; pdf/docx/doc/txt) |
| GET    | `/resumes` |
| GET    | `/resumes/:id` |
| POST   | `/resumes/:id/reparse` |
| PATCH  | `/resumes/:id/primary` |
| DELETE | `/resumes/:id` |

### Applications
| method | path | access |
|--------|------|--------|
| POST  | `/applications` | seeker (auto-computes matchScore) |
| GET   | `/applications/me` | seeker |
| GET   | `/applications/:id` | seeker owner / employer / admin |
| PATCH | `/applications/:id/status` | employer/admin |
| PATCH | `/applications/:id/withdraw` | seeker owner |

### Analytics
| method | path | access |
|--------|------|--------|
| GET | `/analytics/employer` | employer/admin |
| GET | `/analytics/seeker` | seeker/admin |
| GET | `/analytics/admin` | admin |

## Conventions

- **Responses**: `{ success, message, data, meta? }`; errors `{ success:false, message, details? }`.
- **Auth**: JWT access token (Bearer header) + rotating refresh token (httpOnly cookie or body).
- **Security**: helmet, CORS allowlist, rate limiting (stricter on auth), bcrypt(12), zod validation.
- **Pagination**: `?page&limit&sort`, returned under `meta.pagination`.
