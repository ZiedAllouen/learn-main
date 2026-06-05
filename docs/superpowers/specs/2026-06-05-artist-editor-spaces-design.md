# ARTIST & EDITOR Member Spaces — Design

**Date:** 2026-06-05
**Status:** Approved (brainstorming) — pending spec review
**Context:** BSMK × VetrinArt (`learn-main`, Turborepo: NestJS API + Next.js web). Builds on Phase 1.

## Problem

The backend already grants the `EDITOR` and `ARTIST` roles real capabilities, but **neither role has any UI**. After login both fall through to the public homepage with no way to act:

- `EDITOR` can `POST`/`PATCH` articles, events, programmes, spaces, sectors, media, and read/update requests — but sees no dashboard.
- `ARTIST` can `POST`/`PATCH` artist profiles — but has no profile editor, and worse, the write path is unsafe (see below).

Only `ADMIN` has a dashboard (`/admin`). This design closes the gap for both roles.

### The artist ownership hole (must fix)

Artist write endpoints today are keyed by `slug` and **ignore `Artist.userId`**:

- `POST /artists` / `PATCH /artists/:slug` are gated `@Roles('ADMIN','EDITOR','ARTIST')` but never bind or check ownership.
- Result: a logged-in `ARTIST` could create artists with no owner link, or edit **any other artist's** profile by slug. This is an authorization hole, not just a missing UI.

## Goals

1. An `ARTIST` can manage **their own** profile + portfolio (disciplines + works) safely, bound to their user account.
2. An `EDITOR` gets a dedicated content dashboard (separate from `/admin`) covering everything the backend already permits, including moderating/publishing artist profiles.
3. Post-login routing and the header send each role to its space.
4. No new authorization holes; artists cannot self-publish to the public site.

## Non-Goals

- No new content types or Prisma models (all needed models exist).
- No image upload pipeline — image fields stay URL-based (as today).
- No changes to the `USER`/Membre experience (still: browse + submit requests). 
- No SSO / external auth.
- Editing a user's email/name/password from admin (out of scope; only role change exists and stays).

---

## 1. Backend — artist ownership via `/artists/me`

Three additions to the `artists` module. The `req.user` shape is `{ id, email, role }` (set by `JwtStrategy.validate`); controllers already read `req.user.id` (see `articles.controller.ts`).

### `GET /artists/me` — `@Roles('ADMIN','EDITOR','ARTIST')`
Returns the `Artist` where `userId === req.user.id`, including `disciplines` + `works`. Returns `null` (HTTP 200) when the user has no artist record yet — the frontend uses this to switch between "create" and "edit" states.

### `PUT /artists/me` — `@Roles('ADMIN','EDITOR','ARTIST')`
Upsert bound to the logged-in user:

- **No existing record for this `userId`** → create one with `userId = req.user.id`. Slug is **server-generated** from `name` (kebab-case, deduped with a numeric suffix if taken). `status` is forced to `DRAFT`.
- **Existing record** → update that record (found by `userId`, **not** by slug from the body). Slug is **not** changed on update.
- **`status` and `featured` are server-controlled here**: a non-staff caller (`ARTIST`) can never set `status: PUBLISHED` or `featured: true` via `/me`. New/edited artist profiles remain `DRAFT`; only `ADMIN`/`EDITOR` publish (via the slug endpoints / editor UI). If an `ADMIN`/`EDITOR` calls `/me` for their own profile, the same DRAFT-on-self rule applies (staff publish via the admin/editor moderation path, keeping one publish path).
- Body reuses a new `UpsertOwnArtistDto` — the `CreateArtistDto` fields **minus** `slug`, `userId`, `status`, `featured` (those are server-controlled), keeping `disciplineIds` and `works`. The service reuses the existing `disciplines: { deleteMany, create }` and `works: { deleteMany, create }` logic.

### `GET /artists/admin/all` — `@Roles('ADMIN','EDITOR')`
Paginated list including drafts (mirrors `articles/admin/all` / `events/admin/all`). Powers the editor "Artistes" moderation tab. Reuses `ListArtistsDto`; when called via this route, `status` filtering is allowed across all statuses (public `GET /artists` stays forced to `PUBLISHED`).

### Slug endpoints tightened
- `POST /artists`, `PATCH /artists/:slug` → drop `ARTIST` from `@Roles`; now `@Roles('ADMIN','EDITOR')`. Artists write only through `/me`. `DELETE /artists/:slug` stays `@Roles('ADMIN')`.
- These remain the **publish path**: staff use `PATCH /artists/:slug` to set `status: PUBLISHED` / `featured`.

### Service notes
- New `findMine(userId)`, `upsertMine(userId, dto)` methods; `upsertMine` does the slug generation, DRAFT forcing, and ownership binding.
- Slug generation: kebab-case `name`; on unique-constraint collision, append `-2`, `-3`, … until free.

---

## 2. Frontend — ARTIST space (`/artiste`)

Client-gated area (same pattern as `AdminDashboard`: read `getAuthUser()`, redirect out if role not in {ADMIN, EDITOR, ARTIST}). Built with the **frontend-design** skill, BSMK light theme, reusing `apiFetch`, `useToast`, `ConfirmModal`.

On mount: `GET /artists/me`.
- **`null`** → empty "Créez votre profil artiste" state with a single CTA that opens the editor pre-filled with the user's name/email.
- **record** → editor populated.

Three zones on one screen:

1. **Profil** — name, bio, statement, photoUrl, coverUrl, city, address, latitude/longitude (optional, for the cartographie map), websiteUrl, instagramUrl, email, and **disciplines** (multi-select chips sourced from the disciplines list — fetched from `GET /disciplines`). Saved via `PUT /artists/me`.
2. **Portfolio (œuvres)** — add / edit / remove / reorder works (title, description, year, type, imageUrls). Sent in the same `PUT` payload; the service replaces the works set. Reorder via `sortOrder`.
3. **Statut** — banner showing `DRAFT` ("en attente de validation par l'équipe") vs `PUBLISHED` (with a link to preview the public `/vetrinart/[slug]` page). Read-only to the artist.

Save = one `PUT /artists/me` with profile + disciplineIds + works. Success/error via toast. The artist cannot publish or feature from here.

---

## 3. Frontend — EDITOR space (`/editor`)

A **separate** dashboard from `/admin` (decision: distinct space, `/admin` stays strictly ADMIN). Client-gated to {ADMIN, EDITOR}. Content-only — no Users tab, no role management, no delete buttons. Built with frontend-design, but **reuses the existing `ContentSection` component** (already used by admin for articles/events/programmes) and the requests inbox, since the backend already permits EDITOR on all of these.

Tabs:
- **Articles · Événements · Programmes** — via existing `ContentSection` + `RESOURCES` config as-is.
- **Espaces** — requires extending `RESOURCES` (currently typed `Record<'articles'|'events'|'programmes', ResourceConfig>`) with a `spaces` entry, and adding a `GET /spaces/admin/all` route (spaces has public list + write endpoints but no admin/all list today — to be added alongside the artist admin/all route). If the spaces admin-list work proves larger than expected during planning, Espaces drops to a follow-up and the editor ships with Articles/Événements/Programmes/Demandes/Artistes.
- **Demandes** — reuse `RequestsSection` (backend allows EDITOR on requests).
- **Artistes** — uses `GET /artists/admin/all`; lists pending (DRAFT) + published artist profiles, lets an editor open one and publish/edit it via `PATCH /artists/:slug`. This is the moderation counterpart to the artist's DRAFT-only `/me` saves.

Delete buttons are hidden in the editor space (backend blocks deletes for EDITOR; hiding avoids offering a dead action).

---

## 4. Routing & navigation

- **Login redirect** (`LoginForm.tsx`): `ADMIN → /admin`, `EDITOR → /editor`, `ARTIST → /artiste`, else `/`.
- **Header** (`Header.tsx`): the current ADMIN-only link becomes role-aware:
  - `ADMIN` → "Admin" → `/admin`
  - `EDITOR` → "Éditeur" → `/editor`
  - `ARTIST` → "Mon espace" → `/artiste`
  - others → no dashboard link.
  Applies to both desktop and mobile nav.
- Each gated page redirects to `/` when the role doesn't match (same pattern as `AdminDashboard` lines 130–134).
- `apiFetch`'s existing client-side 401 → `/login` redirect covers expired sessions in both new spaces.

---

## 5. Error handling

- `PUT /artists/me`: validation errors (class-validator) → 400 with field messages; surfaced as an error toast. Slug-collision is handled server-side (retry suffix), never bubbles to the user.
- `GET /artists/me` returning `null` is a normal state, not an error.
- All new spaces reuse `apiFetch` (8s timeout, 401 → login, `ApiError` with `isUnreachable`/`isNotFound`).
- Editor publish (`PATCH /artists/:slug`) failures → error toast, optimistic update rolled back (same pattern as `changeRole` in `AdminDashboard`).

---

## 6. Testing

- **Backend (TDD, Jest — matches the repo's test setup; see `auth.service.spec.ts`, `requests.service.spec.ts`. No `artists.service.spec.ts` exists yet — create one):**
  - `upsertMine` creates with `userId` bound + `DRAFT` forced when none exists.
  - `upsertMine` updates the caller's own record (by userId), never another's, and ignores `status`/`featured`/`slug` from the body.
  - slug generation dedupes on collision.
  - `findMine` returns `null` when no record.
  - `GET /artists/admin/all` returns drafts; public `GET /artists` still forces PUBLISHED.
  - role guard: `ARTIST` rejected (403) on `POST /artists` and `PATCH /artists/:slug` after the tightening.
- **Frontend:** manual verification via the `run`/`verify` flow — artist create→draft→staff publish→public page; editor tabs load and save; routing per role.

---

## 7. Build order

1. Backend: DTO + service (`findMine`/`upsertMine`) + controller routes + guard tightening, TDD. Migration not needed (`userId` column already exists).
2. Frontend ARTIST `/artiste` space (frontend-design).
3. Frontend EDITOR `/editor` space (frontend-design, reusing ContentSection/RequestsSection + new Artistes moderation tab).
4. Routing + header role-awareness.
5. Verify end-to-end; seed an ARTIST and an EDITOR user for testing.

## Files touched (estimate)

**Backend:** `artists.controller.ts`, `artists.service.ts`, new `dto/upsert-own-artist.dto.ts`, new `artists.service.spec.ts`. New `GET /artists/admin/all` + `GET /spaces/admin/all` (mirror existing `*/admin/all` routes). Possibly extend `ListArtistsDto` usage for `admin/all`.
**Frontend:** new `app/artiste/*` (page + client), new `app/editor/*` (page + client), extend `admin/sections/ContentSection` `RESOURCES` (add spaces), reuse `RequestsSection`, new editor "Artistes" moderation section, edit `LoginForm.tsx`, `Header.tsx`. New `lib` helper for `/artists/me` calls.
**Seed:** add one ARTIST + one EDITOR user to `packages/db/prisma/seed.ts`.

## Open risks / notes

- The artist space reuses URL-based image fields — no upload UI. Acceptable for v1 (matches current content model).
- `Artist.userId` is `@unique` → one artist profile per user, which matches the `/me` upsert model exactly.
- Keep public `GET /artists` and `GET /artists/:slug` forced to PUBLISHED so DRAFT profiles never leak (same discipline as the Phase 1 `status=ALL` fix).
