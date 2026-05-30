# BSMK / Vitrinart — Backend Design

**Date:** 2026-05-30
**Status:** Approved for implementation
**Scope:** Make the existing NestJS backend run correctly (Phase 1), then evolve it to the new BSMK/Vitrinart vision (Phase 2). Integrations and frontend rewire are deferred (Phase 3).

---

## 1. Context — current state

The `learn-main` monorepo already contains a substantially-built backend. This is an **extension + fix** job, not a from-scratch build.

**Already working:**
- NestJS 11, modular (one folder per domain), Prisma 6, Postgres 17.
- Auth: register / login / refresh / logout via argon2 + JWT + DB-stored refresh tokens; global `JwtAuthGuard` + `RolesGuard`; roles `ADMIN | EDITOR | ARTIST | USER`.
- Full Prisma schema: User, RefreshToken, Discipline, AudienceType, ProgramType, Category, Tag, Article (+ joins), Page, TeamMember, Partner, Space (+ join), Program (+ joins), Event (+ join), ContactMessage, NewsletterSubscriber, SiteStat.
- Read + CRUD services/controllers for articles, disciplines, events, programs, spaces, contact, newsletter — with pagination, filtering, `class-validator` DTOs.
- Health check, throttler (100 req/60s), CORS, global `ValidationPipe` (whitelist + transform).
- Monorepo: pnpm workspace + Turbo. Packages: `@bsmk/api` (backend), `@bsmk/db` (Prisma), `@bsmk/types` (shared types), `@bsmk/web` (frontend, currently static).

**Broken / missing (the work):**
1. **No migrations** — `packages/db/prisma/migrations/` does not exist. No migration history.
2. **Prisma client never generated**; no DB container currently running. `tsc` cannot pass until the client is generated.
3. **Seed bug** — admin `passwordHash` in `seed.ts` is **bcrypt**, but `auth.service.ts` verifies with **argon2** → seeded admin cannot log in.
4. **Schema does not match the new vision** — no Sector level (color system), no Artist/Vitrinart model, no Media model, no geo fields for cartographie, no `color`/`sector` on Discipline.
5. **Frontend is 100% static** (`frontend/src/data/*.ts`); nothing calls the API.
6. **Zero tests.**
7. **Redis** present in `docker-compose.yml` + `.env.example` but used nowhere → remove.
8. Disciplines exist in three conflicting versions (seed slugs, frontend labels, the new spec). Reconcile to the new spec as the single source of truth.

---

## 2. Architecture (unchanged)

Keep the stack. Add new domain modules following the identical existing pattern: `module → controller → service → DTOs`. No architectural change.

**Stack after cleanup:** NestJS 11 + Prisma 6 + Postgres 17, pnpm/Turbo monorepo. **Redis removed.**

Design principle: small, single-purpose modules with well-defined interfaces, each independently testable. This is also what makes the parallel-agent execution safe — agents own disjoint files.

---

## 3. Data model changes (`packages/db/prisma/schema.prisma`)

### 3.1 New `Sector` level (color system, point 6 of brief)

Sectors are the top-level rubriques. Each has a **vivid** signature color. Fully editable from the admin (seeded as a starting point, not hard-coded).

```prisma
model Sector {
  id          String       @id @default(cuid())
  slug        String       @unique
  name        String
  color       String       // vivid hex
  description String?
  sortOrder   Int          @default(0)
  disciplines Discipline[]
  @@map("sectors")
}
```

Seeded sectors + colors (from brief point 6; editable later):

| Sector | Color |
|---|---|
| Arts de scène | Bleu |
| Événements, expositions & festivals | Rouge |
| Médias | Violet |
| Sports & loisirs alternatifs | Vert |
| Consulting & accompagnement artistiques | Turquoise |
| Partenaires & communautés | Jaune / Ocre |
| Showroom et recyclage | TBD (pick in admin) |

### 3.2 `Discipline` — add parent sector + pastel color

Disciplines use the **nude / beige / vert-gris pastel** family (the "skin tone" / PDF mood), and belong to a sector.

```prisma
model Discipline {
  // existing: id, slug, name, description, iconUrl, coverUrl, sortOrder
  // existing join relations: articles, spaces, programs, events
  sectorId String?
  sector   Sector? @relation(fields: [sectorId], references: [id])
  color    String? // nude/pastel hex
  // + new join relations: artists (ArtistDiscipline), media (MediaDiscipline)
}
```

**Médias appears at BOTH levels intentionally** (confirmed): a `Sector` "Médias" (violet, top-menu browsing) AND a `Discipline` "Médias" (a tag for artists/programs/events). Two separate rows in two separate tables.

Disciplines seeded (new vision, replaces old set). Includes the **Médias discipline** containing Vidéo, Photographie, Édition, Journalisme culturel, Création de contenu multimédia (brief point 5). Exact discipline-to-sector mapping + pastel hexes finalized during seed authoring.

### 3.3 New `Artist` model (Vitrinart — brief point 3)

Covers: annuaire d'artistes, répertoire des designers, cartographie culturelle & artisanale (geo fields).

```prisma
model Artist {
  id           String        @id @default(cuid())
  slug         String        @unique
  name         String
  bio          String?
  statement    String?       // démarche artistique
  photoUrl     String?
  coverUrl     String?
  city         String?
  address      String?       // for cartographie
  latitude     Float?        // for cartographie
  longitude    Float?        // for cartographie
  websiteUrl   String?
  instagramUrl String?
  email        String?
  status       ContentStatus @default(DRAFT)
  featured     Boolean       @default(false)
  userId       String?       @unique // optional link to a USER with ARTIST role
  sortOrder    Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  user        User?              @relation(fields: [userId], references: [id])
  disciplines ArtistDiscipline[]
  works       ArtistWork[]
  @@map("artists")
}

model ArtistWork {
  id          String   @id @default(cuid())
  artistId    String
  title       String
  description String?
  imageUrls   String[]
  year        Int?
  type        String?  // produit / objet / stand / exposant — free text
  sortOrder   Int      @default(0)
  artist      Artist   @relation(fields: [artistId], references: [id], onDelete: Cascade)
  @@map("artist_works")
}

model ArtistDiscipline {
  artistId     String
  disciplineId String
  artist       Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  discipline   Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)
  @@id([artistId, disciplineId])
  @@map("artist_disciplines")
}
```

`ArtistWork` covers "Maison d'objets et de design / produits / exposants / stands". Managed via nested writes under the artists module (no standalone controller).

`User` gets a back-relation: `artist Artist?`.

### 3.4 New `Media` model (brief points 3 & 5)

```prisma
enum MediaType {
  VIDEO
  PHOTO
  EDITO
  MAGAZINE
  PUBLICATION
}

model Media {
  id           String        @id @default(cuid())
  slug         String        @unique
  title        String
  type         MediaType
  description  String?
  url          String?       // video/podcast embed or external link
  thumbnailUrl String?
  imageUrls    String[]      // photo galleries
  status       ContentStatus @default(DRAFT)
  featured     Boolean       @default(false)
  publishedAt  DateTime?
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  disciplines MediaDiscipline[]
  @@map("media")
}

model MediaDiscipline {
  mediaId      String
  disciplineId String
  media        Media      @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  discipline   Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)
  @@id([mediaId, disciplineId])
  @@map("media_disciplines")
}
```

### 3.5 Bug fixes (Phase 1)

- **Seed argon2**: hash the admin password with argon2 (matching `auth.service.ts`) using a known dev password (`changeme123`). Document it in the seed output.
- **First migration**: `prisma migrate dev --name init_plus_vision` creates `migrations/` and regenerates the client.

---

## 4. Modules & endpoints

Each new module follows the existing pattern (module + controller + service + DTOs). Public reads use `@Public()`; writes use `@Roles(...)`.

| Module | Endpoints | Auth |
|---|---|---|
| **sectors** (new) | `GET /api/sectors`, `GET /api/sectors/:slug`; `POST/PATCH/DELETE` | read public; write ADMIN/EDITOR |
| **artists** (new) | `GET /api/artists` (paginated; filter discipline/sector/city/featured), `GET /api/artists/:slug`, `GET /api/artists/map` (geo subset for cartographie); `POST/PATCH/DELETE` (with nested `works`) | read public; write ADMIN/EDITOR/ARTIST |
| **media** (new) | `GET /api/media` (paginated; filter type/discipline/featured), `GET /api/media/:slug`; `POST/PATCH/DELETE` | read public; write ADMIN/EDITOR |
| **disciplines** (extend) | existing reads now include `sector` + `color`; add `POST/PATCH/DELETE` | read public; write ADMIN |

`app.module.ts` registers the new modules. (Integrator owns this file to avoid merge conflicts.)

---

## 5. Execution plan — parallel agents ("max parallel")

**Hard constraint:** the Prisma client is the spine. Every service imports it. The schema/migration/generate step MUST complete before any module agent runs.

### Stage 0 — Sequential (integrator, must finish first)
1. Bring up Docker Postgres; remove Redis from `docker-compose.yml` and `REDIS_URL` from `.env.example`.
2. Edit `schema.prisma`: add Sector, Artist, ArtistWork, ArtistDiscipline, Media, MediaDiscipline, MediaType enum, geo fields; add `sectorId`/`sector`/`color` to Discipline; add back-relations on User and Discipline.
3. `prisma migrate dev --name init_plus_vision` → first migration + regenerated client.
4. `pnpm --filter @bsmk/db typecheck` green.

### Stage 1 — Parallel (5 agents, disjoint files, after Stage 0 green)
- **Agent A** — `sectors` module (controller/service/DTOs + CRUD).
- **Agent B** — `artists` module + `ArtistWork` nested writes + `GET /artists/map`.
- **Agent C** — `media` module + MediaType filtering.
- **Agent D** — extend `disciplines` (sector/color in responses + admin CRUD) **and** rewrite `seed.ts` (argon2 admin + all new sectors/disciplines + a few sample artists/works/media).
- **Agent E** — Jest tests for auth + existing modules (articles/events/programs/spaces/contact/newsletter): service unit tests (mocked Prisma) + a few e2e against a test DB.

### Stage 2 — Sequential (integrator)
Register modules in `app.module.ts`; run `pnpm typecheck && pnpm test`; boot the API; smoke-test endpoints; fix seam issues.

---

## 6. Testing strategy

Jest (already configured). Service unit tests with mocked Prisma; a small set of e2e tests hitting real endpoints against a test DB. Cover the auth flow end-to-end and at least one full CRUD cycle per new module.

---

## 7. Out of scope — deferred to Phase 3

Recorded here so nothing is lost; **not** built in this session.

**Integrations (env-configured, no code):**
- Cloudflare R2 file/media uploads + presigned URLs.
- Resend email (contact notifications, newsletter confirmation).
- Cloudflare Turnstile anti-spam on contact + newsletter.

**Frontend (separate sessions, frontend-design skill):**
- Rewire `frontend/src/data/*.ts` to call the API.
- **Login page** "personnalisé adapté à l'identité visuelle" (the API auth is done; this is page design).
- **Logo** revision — keep current; study an Arabic "ك" version; ensure originality (avoid Maison de l'Image / koufi lookalike for copyright safety). Schema already stores asset URLs generically.
- **Label renames** (nav/page copy, not DB):
  - Créer et collaborer → keep
  - Se former → keep
  - **S'entraîner → Produire OR Créer** (TBD — validate per objective)
  - Diffusion → **Médiation**
  - Consulter → keep
- Apply the sector color system in the UI (vivid sector colors for nav/identification; pastel discipline shades).

**Brand TBDs (pick later in admin/frontend, non-blocking):**
- Showroom et recyclage sector color.
- Final discipline→sector mapping + exact pastel hex values.
