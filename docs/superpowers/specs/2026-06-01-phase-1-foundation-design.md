# BSMK × VetrinArt — Phase 1 Design

**Date:** 2026-06-01
**Status:** Approved (design), pending implementation plan
**Stack (already decided):** Next.js 15 / React 19 (frontend), NestJS 11 / Prisma / PostgreSQL (backend), JWT auth, Turborepo monorepo.

---

## 1. Background & Goal

The spec describes BSMK × VetrinArt as a **hybrid cultural ecosystem**, not a brochure site: a physical centre (studios, formations, spaces, events) plus a digital platform/network for artists (VetrinArt). The site is the connective tissue between the two, organized around five actions — *Créer · Se former · S'entraîner · Diffuser · Se connecter* — and built on **cross-cutting taxonomies** (Discipline / Public / Format / Lieu) so artists, programmes, spaces, events, and media all link to each other.

The current codebase is a well-structured **static/editorial MVP**: most pages exist, the Prisma data model implements the cross-taxonomy correctly, and a NestJS API exists. But it has three gaps that Phase 1 closes:

1. The frontend reads **hardcoded files** in `frontend/src/data/*.ts`, not the API — so content is not editable without a code deploy.
2. The admin dashboard manages **users only** — there is no content editing and no request inbox.
3. Every "transactional" action (réserver, s'inscrire, proposer un projet) is a **fake `mailto`/contact-form link** — no real data is captured.

**Phase 1 goal:** turn the static brochure into a working, editable site with a real request inbox.

When Phase 1 is done:
- A visitor browses **live content from the database** and can **submit a real request** (enrollment or booking).
- Staff can **log in and edit** the magazine, agenda, and programmes — no developer needed.
- Staff can **review incoming requests** in the admin and change their status.

This is the sound, "finish it properly" first slice. It deliberately defers Phase 2 (artist member space, opportunities, richer media) and Phase 3 (payments, marketplace, interactive map, radio) — several of which the spec itself already labels "Phase 2."

---

## 2. Scope

### In scope (Phase 1)
- A universal **`Request`** system (enrollment + booking now; project/partnership/opportunity types reserved for later).
- Real submission **forms** on programme and espace pages, replacing the fake links.
- **Wiring the frontend to the API** for database-backed pages (home, magazine, agenda, programmes, espaces, disciplines, vetrinart, and their detail pages).
- **Admin editing** for: Requests (Demandes), Articles (magazine), Events (agenda), Programmes.

### Out of scope (later phases)
- Public/artist **accounts and login-gated areas** (the `Request` model keeps a nullable `userId` hook so this is cheap to add later).
- **Email notifications** on submit (the design saves to DB only; emails are a later "react when a request is saved" addition that won't touch the form or model).
- Admin editing for **espaces, disciplines, team, media, artists** — these change rarely and stay in code for now.
- **Payments / ticketing, marketplace, interactive map, podcasts/radio streaming.**

---

## 3. Key Decisions (made during brainstorming)

| # | Decision | Choice | Why |
|---|----------|--------|-----|
| 1 | Account required to submit a request? | **No account** (nullable `userId` kept for later) | Lowest friction; matches spec's "inscription simplifiée". |
| 2 | What happens on submit? | **Save to DB only** (no emails yet) | Unblocks shipping; emails add cleanly later. |
| 3 | Admin editing scope | **Requests + Articles + Events + Programmes** | These change weekly; the rest change rarely. |
| 4 | How pages fetch data | **Server-side fetch, fresh on each request** | Always up-to-date, simple, predictable; caching can be added per-page later. |
| 5 | Request model shape | **One table + flexible `details` JSON** | Directly delivers "both, same system"; trivial to extend; form validates shape on the way in. |
| 6 | Fake data | **Exported to JSON and parked, NOT consumed** | Kept as a reference snapshot in case it's needed later (e.g. manual DB seeding); the API/DB is the single source of truth; no fallback logic. |

---

## 4. The `Request` System (core of Phase 1)

One new Prisma model. Every incoming request is one row, regardless of type.

### Fields
- `id` (cuid), `createdAt`
- `type` — enum `RequestType`: `ENROLLMENT`, `BOOKING`, `PROJECT`, `PARTNERSHIP`, `OPPORTUNITY` (only `ENROLLMENT` and `BOOKING` are used in Phase 1; the rest are reserved)
- `status` — enum `RequestStatus`: `NEW`, `REVIEWING`, `ACCEPTED`, `DECLINED` (default `NEW`)
- `name` (required), `email` (required), `phone` (optional)
- `message` (optional free text from the requester)
- `programId` (optional FK → Program; set for enrollments)
- `spaceId` (optional FK → Space; set for bookings)
- `userId` (optional FK → User; always empty in Phase 1, the hook for accounts later)
- `details` (JSON; type-specific answers such as a booking's preferred date — validated by the form, not the DB)
- `adminNote` (optional; private staff note during review)
- `updatedAt`

### Flow
1. Visitor on a **programme** page clicks "S'inscrire" → short form → saved as `Request` with `type=ENROLLMENT` and that `programId`.
2. Visitor on an **espace** page clicks "Réserver" → form → saved as `type=BOOKING` with that `spaceId`.
3. Staff open admin **"Demandes"** → list (filter by type/status) → open one → change status, write `adminNote`.

Adding "proposer un projet" later = reuse the same form/table with `type=PROJECT`. No new table, no migration of existing data.

### Backend
- New NestJS module `requests`: `RequestsModule`, `RequestsController`, `RequestsService`, DTOs.
- **Public** endpoint: `POST /requests` (create) — open, no auth, rate-limited via the existing `@nestjs/throttler`.
- **Admin** endpoints: `GET /requests` (list, filter by type/status, paginated), `GET /requests/:id`, `PATCH /requests/:id` (status + adminNote) — protected by the existing JWT auth + `RolesGuard` (ADMIN/EDITOR).

---

## 5. Wiring the Frontend to the API

### Approach
- Pages fetch from the **API** on the server, fresh on each request. The API + database is the **only** source the site uses.
- Build/extend a small, consistent **API helper layer** in `frontend/src/lib/api/` (already started for artists/media/sectors) so every page fetches the same clean way.
- **Pages wired in Phase 1:** home, magazine (articles) + detail, agenda (events) + detail, programmes + detail, espaces + detail, disciplines + detail, vetrinart (artists) + detail.

### Fake data handling
- Current `frontend/src/data/*.ts` content is **exported to `.json`** under `frontend/src/data/seed/` (or similar) and **parked** — not imported by any page, not a fallback. Kept purely as a reference snapshot for possible later use (e.g. manual DB seeding).
- If the API returns nothing, pages show an honest **empty state** ("no events yet") rather than serving stale fake content.

### Safety
- Wire **page by page**. A page is only switched to the API once it renders correctly from it. No broken half-states.
- **First build task:** verify which backend endpoints already exist and return the shape each page needs; add anything missing. Report findings before wiring.

---

## 6. Admin Editing

Extend the existing admin (currently users-only) with a sidebar and four screens, all following the same **list → form → save** pattern for consistency:

- **Demandes** — list incoming requests, filter by type/status, open one, change status, write a private note.
- **Magazine (Articles)** — list, create, edit, delete; set DRAFT/PUBLISHED.
- **Agenda (Events)** — list, create, edit, delete.
- **Programmes** — list, create, edit, delete.

All admin screens are protected by the existing JWT auth + `RolesGuard` (ADMIN, plus EDITOR where appropriate). Espaces, disciplines, team, media, artists remain code-managed in Phase 1.

---

## 7. Verification

Evidence before claims — every "done" comes with something observable:

- **Backend tests:** each new piece (the `Request` create/list/update endpoints, admin content endpoints) gets a Jest test following the backend's existing test pattern. Run and pass.
- **Manual end-to-end of the real flow:** submit a request on a programme page → confirm it appears in admin "Demandes" → change status → confirm it persists. Same for creating an article in admin and seeing it live on the site.
- **No regressions:** after wiring each page, open it and confirm it looks identical to before, now served from the API.

---

## 8. Risks & Notes

- **Empty database:** the API can only serve content once the DB has data. Loading the parked JSON / writing a seed is likely needed early so wired pages aren't empty during development. (The existing `packages/db/prisma/seed.ts` is the place for this.)
- **Endpoint coverage unknown:** backend modules exist but may not return exactly what each page needs. The first build task is an endpoint audit; the plan must allow for adding/adjusting endpoints.
- **Two-source drift is avoided** by design: JSON is parked and disconnected, so there is no "current content in two places" problem — the DB is the single source of truth.

---

## 9. Phasing (context only — Phase 1 is what this spec covers)

- **Phase 1 (this spec):** wiring + admin editing (Requests/Articles/Events/Programmes) + universal Request system.
- **Phase 2:** artist member space (ARTIST login, own profile/portfolio/projects), opportunities/appels à candidatures (reuse Request pattern), richer media (podcasts, video series).
- **Phase 3:** online payment / ticketing (Stripe), marketplace, interactive cartography, radio streaming.
