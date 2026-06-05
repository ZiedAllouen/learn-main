# ARTIST & EDITOR Member Spaces Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the EDITOR and ARTIST roles real, role-gated UIs (an editor content dashboard and an artist self-service profile/portfolio space), and close the artist-ownership authorization hole on the backend.

**Architecture:** Backend adds owner-bound `/artists/me` (upsert + read) and `*/admin/all` list routes; artists write only through `/me` (server-forced DRAFT, server-generated slug, bound to `userId`). Frontend adds two client-gated areas — `/artiste` (one-screen profile + disciplines + works editor) and `/editor` (content dashboard reusing existing `ContentSection`/`RequestsSection` plus an artist-moderation tab). Login + header route each role to its space.

**Tech Stack:** NestJS 11 + Prisma + PostgreSQL (Jest tests), Next.js 15 App Router + React 19 + Tailwind + framer-motion, `apiFetch` helper, existing `useToast`/`ConfirmModal`/`ContentSection`.

**Spec:** `docs/superpowers/specs/2026-06-05-artist-editor-spaces-design.md`

**Conventions verified in the codebase (do not deviate):**
- `req.user` shape is `{ id, email, role }` (from `JwtStrategy.validate`). Controllers read it via `@Req() req: Request & { user: AuthUser }` where `AuthUser` is declared as a small local interface in the controller (see `auth.controller.ts:9`, `articles.controller.ts:36`). There is **no** `@CurrentUser` decorator — do not invent one.
- `@Roles(...)` and `@Public()` decorators live in `backend/src/common/decorators/`. Global `JwtAuthGuard` + `RolesGuard` are already applied; a route with neither decorator requires a valid JWT (any role).
- `apiFetch<T>(path, options)` (frontend `lib/api.ts`) prepends `NEXT_PUBLIC_API_URL`, sets JSON content-type, handles client 401 → `/login` redirect, throws `ApiError`. **Pass the `Authorization` header explicitly** for authed calls: `headers: { Authorization: \`Bearer ${token}\` }`.
- `getAuthUser()` / `getAccessToken()` from `lib/auth.ts`. `AuthUser.role` is `'ADMIN' | 'EDITOR' | 'ARTIST' | 'USER'`.
- Backend tests mock Prisma as a plain object of `jest.fn()`s injected via `{ provide: PrismaService, useValue: prisma }` (see `requests.service.spec.ts`).
- Backend serves at `http://localhost:3001/api` (root `.env` sets `PORT=3001`; global prefix `api`). Run backend tests with `pnpm --filter @bsmk/api test`.
- **Git:** the project root is not a git repo and the user has said "don't commit/push until I tell you." Each task ends with a `git add`/`commit` **step written for completeness**, but DO NOT run commits until the user authorizes it — stage/leave in working tree only. Treat the commit step as "stage the listed files."

---

## File Structure

**Backend (create/modify):**
- `backend/src/artists/dto/upsert-own-artist.dto.ts` — **create**. DTO for `PUT /artists/me` (no slug/userId/status/featured).
- `backend/src/artists/artists.service.ts` — **modify**. Add `findMine`, `upsertMine`, `findAllAdmin`; helper `generateUniqueSlug`.
- `backend/src/artists/artists.controller.ts` — **modify**. Add `GET /me`, `PUT /me`, `GET /admin/all`; tighten slug `POST`/`PATCH` to ADMIN/EDITOR.
- `backend/src/artists/artists.service.spec.ts` — **create**. Unit tests for the new service methods.
- `backend/src/spaces/spaces.service.ts` — **modify**. Add `findAllAdmin`.
- `backend/src/spaces/spaces.controller.ts` — **modify**. Add `GET /admin/all` (ADMIN, EDITOR).

**Frontend (create/modify):**
- `frontend/src/lib/artist.ts` — **create**. Typed helpers for `/artists/me` + disciplines fetch.
- `frontend/src/app/artiste/page.tsx` — **create**. Route entry (renders client component).
- `frontend/src/app/artiste/ArtistSpace.tsx` — **create**. The artist self-service UI (frontend-design).
- `frontend/src/app/editor/page.tsx` — **create**. Route entry.
- `frontend/src/app/editor/EditorDashboard.tsx` — **create**. Editor content dashboard (frontend-design).
- `frontend/src/app/editor/ArtistsModeration.tsx` — **create**. Editor "Artistes" tab (list `admin/all`, open + publish).
- `frontend/src/app/admin/sections/ContentSection.tsx` — **modify**. Widen `RESOURCES` to include `spaces`.
- `frontend/src/app/(site)/login/LoginForm.tsx` — **modify**. Role-based redirect for EDITOR/ARTIST.
- `frontend/src/components/layout/Header.tsx` — **modify**. Role-aware dashboard link.

**Seed:**
- `packages/db/prisma/seed.ts` — **modify**. Add one EDITOR + one ARTIST user.

---

## Task 1: `UpsertOwnArtistDto` (artist self-service input)

**Files:**
- Create: `backend/src/artists/dto/upsert-own-artist.dto.ts`

This DTO is the body for `PUT /artists/me`. It mirrors `CreateArtistDto` **without** `slug`, `userId`, `status`, `featured`, `sortOrder` (all server-controlled). It reuses the existing `ArtistWorkInput` from `create-artist.dto.ts`.

- [ ] **Step 1: Create the DTO**

```typescript
// backend/src/artists/dto/upsert-own-artist.dto.ts
import {
  IsString, IsOptional, IsArray, IsNumber, IsEmail, ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArtistWorkInput } from './create-artist.dto';

export class UpsertOwnArtistDto {
  @IsString()
  name: string;

  @IsOptional() @IsString() bio?: string;
  @IsOptional() @IsString() statement?: string;
  @IsOptional() @IsString() photoUrl?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() city?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsNumber() latitude?: number;
  @IsOptional() @IsNumber() longitude?: number;
  @IsOptional() @IsString() websiteUrl?: string;
  @IsOptional() @IsString() instagramUrl?: string;
  @IsOptional() @IsEmail() email?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ArtistWorkInput)
  works?: ArtistWorkInput[];
}
```

- [ ] **Step 2: Verify it compiles**

Run: `pnpm --filter @bsmk/api typecheck` (or `pnpm --filter @bsmk/api build`)
Expected: no errors. (`ArtistWorkInput` is exported from `create-artist.dto.ts` — confirmed.)

- [ ] **Step 3: Stage**

```bash
git add backend/src/artists/dto/upsert-own-artist.dto.ts
git commit -m "feat(artists): add UpsertOwnArtistDto for self-service profile"
```
(Stage only — do not push; see header.)

---

## Task 2: `ArtistsService.findMine` + `findAllAdmin` (TDD)

**Files:**
- Create: `backend/src/artists/artists.service.spec.ts`
- Modify: `backend/src/artists/artists.service.ts`

- [ ] **Step 1: Write the failing test**

```typescript
// backend/src/artists/artists.service.spec.ts
import { Test } from '@nestjs/testing';
import { ArtistsService } from './artists.service';
import { PrismaService } from '../prisma/prisma.service';

describe('ArtistsService', () => {
  let service: ArtistsService;
  let prisma: {
    artist: {
      findUnique: jest.Mock;
      findFirst: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      create: jest.Mock;
      update: jest.Mock;
      delete: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      artist: {
        findUnique: jest.fn(),
        findFirst: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [ArtistsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(ArtistsService);
  });

  describe('findMine', () => {
    it('returns the artist owned by the user, with disciplines + works', async () => {
      prisma.artist.findUnique.mockResolvedValue({ id: 'a1', userId: 'u1' });
      const result = await service.findMine('u1');
      expect(prisma.artist.findUnique).toHaveBeenCalledWith({
        where: { userId: 'u1' },
        include: {
          disciplines: { include: { discipline: true } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      });
      expect(result).toEqual({ id: 'a1', userId: 'u1' });
    });

    it('returns null when the user has no artist profile', async () => {
      prisma.artist.findUnique.mockResolvedValue(null);
      const result = await service.findMine('u1');
      expect(result).toBeNull();
    });
  });

  describe('findAllAdmin', () => {
    it('lists all statuses (no PUBLISHED filter) paginated', async () => {
      prisma.$transaction.mockResolvedValue([[{ id: 'a1' }], 1]);
      const result = await service.findAllAdmin({ page: 1, pageSize: 100 } as never);
      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result).toEqual({ data: [{ id: 'a1' }], total: 1, page: 1, pageSize: 100, totalPages: 1 });
    });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm --filter @bsmk/api test -- artists.service`
Expected: FAIL — `service.findMine is not a function` / `findAllAdmin is not a function`.

- [ ] **Step 3: Implement `findMine` + `findAllAdmin`**

Add to `backend/src/artists/artists.service.ts` (after `findMap()`):

```typescript
  findMine(userId: string) {
    return this.prisma.artist.findUnique({
      where: { userId },
      include: {
        disciplines: { include: { discipline: true } },
        works: { orderBy: { sortOrder: 'asc' } },
      },
    });
  }

  async findAllAdmin(dto: ListArtistsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, sector, city, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const disciplineWhere = discipline
      ? { some: { discipline: { slug: discipline } } }
      : sector
      ? { some: { discipline: { sector: { slug: sector } } } }
      : undefined;

    // No default PUBLISHED filter → drafts are included. `status` (if passed)
    // is one of DRAFT/PUBLISHED/ARCHIVED — ListArtistsDto's enum does not allow
    // 'ALL', so omitting status simply lists every status.
    const where = {
      ...(status && { status }),
      ...(featured !== undefined && { featured }),
      ...(city && { city }),
      ...(disciplineWhere && { disciplines: disciplineWhere }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ status: 'asc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.artist.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }
```

Note: `findAllAdmin` deliberately omits the default `status: 'PUBLISHED'` so drafts are included. The `'ALL'` guard tolerates a caller passing `status=ALL`; otherwise an explicit status filters to it.

- [ ] **Step 4: Run test to verify it passes**

Run: `pnpm --filter @bsmk/api test -- artists.service`
Expected: PASS (4 tests).

- [ ] **Step 5: Stage**

```bash
git add backend/src/artists/artists.service.spec.ts backend/src/artists/artists.service.ts
git commit -m "feat(artists): findMine + findAllAdmin service methods"
```

---

## Task 3: `ArtistsService.upsertMine` + unique-slug helper (TDD)

**Files:**
- Modify: `backend/src/artists/artists.service.ts`
- Modify: `backend/src/artists/artists.service.spec.ts`

Core ownership logic: create-or-update the artist bound to `userId`, slug server-generated, status always forced DRAFT, never trusting body slug/status/featured.

- [ ] **Step 1: Add failing tests**

Append inside the top-level `describe('ArtistsService', …)` in `artists.service.spec.ts`:

```typescript
  describe('upsertMine', () => {
    it('creates a DRAFT artist bound to userId with a generated unique slug when none exists', async () => {
      prisma.artist.findUnique
        .mockResolvedValueOnce(null) // findUnique({ where: { userId } }) -> no existing
        .mockResolvedValueOnce(null); // slug 'amel-ben' is free
      prisma.artist.create.mockResolvedValue({ id: 'a1', slug: 'amel-ben', status: 'DRAFT' });

      const result = await service.upsertMine('u1', {
        name: 'Amel Ben',
        bio: 'hi',
        disciplineIds: ['d1'],
        works: [{ title: 'W1' }],
      } as never);

      expect(prisma.artist.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Amel Ben',
          bio: 'hi',
          slug: 'amel-ben',
          status: 'DRAFT',
          userId: 'u1',
          disciplines: { create: [{ disciplineId: 'd1' }] },
          works: { create: [{ title: 'W1' }] },
        }),
        include: expect.any(Object),
      });
      expect(result).toEqual({ id: 'a1', slug: 'amel-ben', status: 'DRAFT' });
    });

    it('dedupes the slug when the generated one is taken', async () => {
      prisma.artist.findUnique
        .mockResolvedValueOnce(null) // no existing artist for user
        .mockResolvedValueOnce({ id: 'x' }) // 'amel-ben' taken
        .mockResolvedValueOnce(null); // 'amel-ben-2' free
      prisma.artist.create.mockResolvedValue({ id: 'a1', slug: 'amel-ben-2' });

      await service.upsertMine('u1', { name: 'Amel Ben' } as never);

      expect(prisma.artist.create).toHaveBeenCalledWith(
        expect.objectContaining({ data: expect.objectContaining({ slug: 'amel-ben-2' }) }),
      );
    });

    it('updates the existing owned artist and ignores body slug/status/featured', async () => {
      prisma.artist.findUnique.mockResolvedValue({ id: 'a1', slug: 'amel-ben', userId: 'u1' });
      prisma.artist.update.mockResolvedValue({ id: 'a1', slug: 'amel-ben' });

      await service.upsertMine('u1', {
        name: 'Amel B.',
        // attacker-controlled fields that must be ignored:
        slug: 'hacked',
        status: 'PUBLISHED',
        featured: true,
        disciplineIds: ['d2'],
      } as never);

      const call = prisma.artist.update.mock.calls[0][0];
      expect(call.where).toEqual({ id: 'a1' });
      expect(call.data.name).toBe('Amel B.');
      expect(call.data.slug).toBeUndefined();
      expect(call.data.status).toBeUndefined();
      expect(call.data.featured).toBeUndefined();
      expect(call.data.disciplines).toEqual({ deleteMany: {}, create: [{ disciplineId: 'd2' }] });
    });
  });
```

- [ ] **Step 2: Run to verify it fails**

Run: `pnpm --filter @bsmk/api test -- artists.service`
Expected: FAIL — `service.upsertMine is not a function`.

- [ ] **Step 3: Implement `upsertMine` + `generateUniqueSlug`**

Add to `artists.service.ts`:

```typescript
  private slugify(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '') // strip accents
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      || 'artiste';
  }

  private async generateUniqueSlug(name: string): Promise<string> {
    const base = this.slugify(name);
    let candidate = base;
    let n = 2;
    // findUnique returns the existing row if the slug is taken.
    while (await this.prisma.artist.findUnique({ where: { slug: candidate } })) {
      candidate = `${base}-${n}`;
      n += 1;
    }
    return candidate;
  }

  async upsertMine(userId: string, dto: UpsertOwnArtistDto): Promise<unknown> {
    const { disciplineIds, works, ...rest } = dto;
    const existing = await this.prisma.artist.findUnique({ where: { userId } });
    const include = {
      disciplines: { include: { discipline: true } },
      works: { orderBy: { sortOrder: 'asc' as const } },
    };

    if (!existing) {
      const slug = await this.generateUniqueSlug(rest.name);
      return this.prisma.artist.create({
        data: {
          ...rest,
          slug,
          status: 'DRAFT',
          userId,
          disciplines: disciplineIds?.length
            ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
            : undefined,
          works: works?.length ? { create: works } : undefined,
        },
        include,
      });
    }

    return this.prisma.artist.update({
      where: { id: existing.id },
      data: {
        ...rest, // rest has no slug/status/featured/userId — DTO excludes them
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId) => ({ disciplineId })) },
        }),
        ...(works !== undefined && { works: { deleteMany: {}, create: works } }),
      },
      include,
    });
  }
```

Add the import at the top of the file:

```typescript
import type { UpsertOwnArtistDto } from './dto/upsert-own-artist.dto';
```

- [ ] **Step 4: Run to verify it passes**

Run: `pnpm --filter @bsmk/api test -- artists.service`
Expected: PASS (7 tests total).

- [ ] **Step 5: Stage**

```bash
git add backend/src/artists/artists.service.ts backend/src/artists/artists.service.spec.ts
git commit -m "feat(artists): upsertMine binds userId, forces DRAFT, dedupes slug"
```

---

## Task 4: Artists controller routes + guard tightening

**Files:**
- Modify: `backend/src/artists/artists.controller.ts`

Order matters in NestJS: `me` and `admin/all` literal routes MUST be declared **before** the `:slug` param route, or `:slug` will swallow them.

- [ ] **Step 1: Rewrite the controller**

```typescript
// backend/src/artists/artists.controller.ts
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ArtistsService } from './artists.service';
import { ListArtistsDto } from './dto/list-artists.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UpsertOwnArtistDto } from './dto/upsert-own-artist.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

interface AuthUser {
  id: string;
  email: string;
  role: string;
}

@Controller('artists')
export class ArtistsController {
  constructor(private readonly artists: ArtistsService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListArtistsDto) {
    return this.artists.findAll(dto);
  }

  @Public()
  @Get('map')
  findMap() {
    return this.artists.findMap();
  }

  @Roles('ADMIN', 'EDITOR')
  @Get('admin/all')
  findAllAdmin(@Query() dto: ListArtistsDto) {
    return this.artists.findAllAdmin(dto);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Get('me')
  findMine(@Req() req: Request & { user: AuthUser }) {
    return this.artists.findMine(req.user.id);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Put('me')
  upsertMine(@Req() req: Request & { user: AuthUser }, @Body() dto: UpsertOwnArtistDto): Promise<unknown> {
    return this.artists.upsertMine(req.user.id, dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.artists.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateArtistDto): Promise<unknown> {
    return this.artists.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateArtistDto) {
    return this.artists.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.artists.remove(slug);
  }
}
```

(`ARTIST` is removed from `POST`/`PATCH :slug` — artists now write only via `PUT /me`.)

- [ ] **Step 2: Verify build + existing tests**

Run: `pnpm --filter @bsmk/api build && pnpm --filter @bsmk/api test`
Expected: build OK; all tests pass.

- [ ] **Step 3: Manual smoke (optional but recommended)**

With backend running on 3001 and an ARTIST token `$T`:
```bash
curl -s -X PUT localhost:3001/api/artists/me -H "Authorization: Bearer $T" -H 'Content-Type: application/json' -d '{"name":"Test Artist"}' | head
curl -s localhost:3001/api/artists/me -H "Authorization: Bearer $T" | head
```
Expected: first returns the created artist with `status:"DRAFT"` and a generated slug; second returns the same record. A `curl` to `POST /api/artists` with the ARTIST token should now 403.

- [ ] **Step 4: Stage**

```bash
git add backend/src/artists/artists.controller.ts
git commit -m "feat(artists): /me read+upsert routes; lock slug writes to ADMIN/EDITOR"
```

---

## Task 5: `GET /spaces/admin/all` (for the editor Espaces tab)

**Files:**
- Modify: `backend/src/spaces/spaces.service.ts`
- Modify: `backend/src/spaces/spaces.controller.ts`

`spaces.findAll()` takes no args and forces PUBLISHED; the editor needs drafts too. `ContentSection.load()` reads the response **strictly** as `{ data: Row[] }` (`Array.isArray(res?.data) ? res.data : []`, line ~160). So `findAllAdmin` MUST return `{ data: [...] }`, not a bare array, to match articles/events/programmes.

- [ ] **Step 1: Add `findAllAdmin` to the service**

In `backend/src/spaces/spaces.service.ts`, after `findAll()`:

```typescript
  async findAllAdmin() {
    const data = await this.prisma.space.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { disciplines: { include: { discipline: { select: { id: true, slug: true, name: true } } } } },
    });
    return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 };
  }
```

- [ ] **Step 2: Add the route**

In `backend/src/spaces/spaces.controller.ts`, add **before** the `@Get(':slug')` route:

```typescript
  @Roles('ADMIN', 'EDITOR')
  @Get('admin/all')
  findAllAdmin() {
    return this.spaces.findAllAdmin();
  }
```

- [ ] **Step 3: Verify build**

Run: `pnpm --filter @bsmk/api build`
Expected: no errors.

- [ ] **Step 4: Stage**

```bash
git add backend/src/spaces/spaces.service.ts backend/src/spaces/spaces.controller.ts
git commit -m "feat(spaces): admin/all list including drafts for editor space"
```

---

## Task 6: Frontend artist API helpers

**Files:**
- Create: `frontend/src/lib/artist.ts`

Typed wrappers around `/artists/me` and the disciplines list, so both the artist space and editor moderation share one source.

- [ ] **Step 1: Create the helper**

```typescript
// frontend/src/lib/artist.ts
import { apiFetch } from './api'
import { getAccessToken } from './auth'

export interface ArtistWork {
  id?: string
  title: string
  description?: string
  imageUrls?: string[]
  year?: number
  type?: string
  sortOrder?: number
}

export interface ArtistDisciplineLink {
  discipline: { id: string; slug: string; name: string; color?: string }
}

export interface ArtistProfile {
  id: string
  slug: string
  name: string
  bio?: string | null
  statement?: string | null
  photoUrl?: string | null
  coverUrl?: string | null
  city?: string | null
  address?: string | null
  latitude?: number | null
  longitude?: number | null
  websiteUrl?: string | null
  instagramUrl?: string | null
  email?: string | null
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  featured: boolean
  disciplines: ArtistDisciplineLink[]
  works: ArtistWork[]
}

export interface UpsertArtistPayload {
  name: string
  bio?: string
  statement?: string
  photoUrl?: string
  coverUrl?: string
  city?: string
  address?: string
  latitude?: number
  longitude?: number
  websiteUrl?: string
  instagramUrl?: string
  email?: string
  disciplineIds?: string[]
  works?: ArtistWork[]
}

export interface DisciplineOption {
  id: string
  slug: string
  name: string
  color?: string
}

function authHeaders(): Record<string, string> {
  const token = getAccessToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

/** Returns the logged-in user's artist profile, or null if they have none yet. */
export async function getMyArtist(): Promise<ArtistProfile | null> {
  return apiFetch<ArtistProfile | null>('/artists/me', { headers: authHeaders() })
}

export async function saveMyArtist(payload: UpsertArtistPayload): Promise<ArtistProfile> {
  return apiFetch<ArtistProfile>('/artists/me', {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(payload),
  })
}

export async function listDisciplines(): Promise<DisciplineOption[]> {
  return apiFetch<DisciplineOption[]>('/disciplines')
}
```

- [ ] **Step 2: Verify it typechecks**

Run: `pnpm --filter @bsmk/web typecheck`
Expected: no errors.

- [ ] **Step 3: Stage**

```bash
git add frontend/src/lib/artist.ts
git commit -m "feat(web): artist /me + disciplines API helpers"
```

---

## Task 7: ARTIST space — `/artiste` (frontend-design)

**Files:**
- Create: `frontend/src/app/artiste/page.tsx`
- Create: `frontend/src/app/artiste/ArtistSpace.tsx`

> **Use the `frontend-design` skill** to produce the `ArtistSpace.tsx` UI. The skill governs the visual quality; the requirements below are the contract it must satisfy. Match the BSMK light theme (`bg-bsmk-white`, `text-bsmk-black`, `page-accent`, rounded cards) already used by `AdminDashboard.tsx`. Reuse `useToast`/`ToastView` and `ConfirmModal` from `frontend/src/app/admin/sections/`.

**Behavioral contract:**
1. Client component; on mount read `getAuthUser()`. If `null` → `router.replace('/login?redirect=/artiste')`. If role not in `{ADMIN, EDITOR, ARTIST}` → `router.replace('/')`. Render nothing until the role check passes (same pattern as `AdminDashboard` lines 130–134, 212).
2. On mount call `getMyArtist()` and `listDisciplines()`.
   - `getMyArtist()` returns `null` → show an **empty state**: heading "Créez votre profil artiste", short text, and a "Commencer" button that reveals the editor pre-filled with `name = ''` (placeholder uses the user's email local-part).
   - returns a profile → populate the editor.
3. **Editor sections:**
   - **Profil:** text inputs for name (required), city, address, websiteUrl, instagramUrl, email; textareas for bio, statement; text inputs for photoUrl, coverUrl; number inputs for latitude, longitude. Disciplines as a multi-select of chips (toggle from `listDisciplines()`), storing selected `id`s.
   - **Portfolio (œuvres):** a list of work cards. Each work: title (required), type, year (number), description (textarea), imageUrls (comma-separated text → split/trim to array on save). "Ajouter une œuvre" appends a blank work; each work has a "Supprimer" (use `ConfirmModal` only if it already has a title, else remove silently). Reorder with up/down buttons adjusting array order (sortOrder is assigned on save by index).
   - **Statut banner:** if `status === 'DRAFT'`, show an amber banner "Profil en brouillon — en attente de validation par l'équipe." If `PUBLISHED`, show a green banner with a link `href={\`/vetrinart/${slug}\`}` "Voir ma page publique".
4. **Save** builds an `UpsertArtistPayload`:
   - `works` mapped to `{ title, description, type, year, imageUrls, sortOrder: index }` (drop empty-title works; `imageUrls` from the comma-split).
   - `disciplineIds` from selected chips.
   - latitude/longitude only included if the input parses to a finite number.
   Call `saveMyArtist(payload)`; on success update local state from the returned profile and `showToast('Profil enregistré.', 'success')`; on `ApiError` `showToast('Échec de l\'enregistrement.', 'error')`.
5. The artist **cannot** set status/featured — no such controls exist in this UI.

- [ ] **Step 1: Create the route entry**

```tsx
// frontend/src/app/artiste/page.tsx
import { ArtistSpace } from './ArtistSpace'

export const dynamic = 'force-dynamic'

export default function ArtistePage() {
  return <ArtistSpace />
}
```

- [ ] **Step 2: Build `ArtistSpace.tsx` via the frontend-design skill**

Invoke `frontend-design` to author `frontend/src/app/artiste/ArtistSpace.tsx` satisfying the contract above. It must import from `@/lib/artist`, `@/lib/auth`, `@/lib/api` (`ApiError`), `@/app/admin/sections/Toast` (`useToast`, `ToastView`), `@/app/admin/sections/ConfirmModal`, and `next/navigation` (`useRouter`).

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm --filter @bsmk/web typecheck && pnpm --filter @bsmk/web lint`
Expected: no errors.

- [ ] **Step 4: Manual verify**

Start backend (3001) + frontend (`pnpm --filter @bsmk/web dev`). Log in as the seeded ARTIST (Task 12). Visit `/artiste`:
- first visit shows empty state → create → profile saves as DRAFT, amber banner shows.
- reload → editor pre-populated.
- add a work, save, reload → work persists.

- [ ] **Step 5: Stage**

```bash
git add frontend/src/app/artiste/page.tsx frontend/src/app/artiste/ArtistSpace.tsx
git commit -m "feat(web): ARTIST self-service /artiste profile + portfolio space"
```

---

## Task 8: Extend `RESOURCES` with `spaces`

**Files:**
- Modify: `frontend/src/app/admin/sections/ContentSection.tsx`

The editor Espaces tab reuses `ContentSection`, which needs a `spaces` config and a widened type. `ContentSection.load()` lists via `${config.path}/admin/all?pageSize=100` and reads `res.data` strictly. Task 5 already makes `GET /spaces/admin/all` return `{ data: [...] }`, so **no reader change is needed** — only the `RESOURCES` type/config below.

- [ ] **Step 1: Widen the type and add the config**

Change the `RESOURCES` declaration type from:
```typescript
export const RESOURCES: Record<'articles' | 'events' | 'programmes', ResourceConfig> = {
```
to:
```typescript
export const RESOURCES: Record<'articles' | 'events' | 'programmes' | 'spaces', ResourceConfig> = {
```

Add the `spaces` entry inside the object (after `programmes`):
```typescript
  spaces: {
    path: '/spaces',
    titleField: 'name',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'name', label: 'Nom' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'floor', label: 'Étage' },
      {
        name: 'status',
        label: 'Statut',
        type: 'select',
        default: 'DRAFT',
        options: [
          { value: 'DRAFT', label: 'Brouillon' },
          { value: 'PUBLISHED', label: 'Publié' },
          { value: 'ARCHIVED', label: 'Archivé' },
        ],
      },
    ],
  },
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @bsmk/web typecheck`
Expected: no errors. (No reader change needed — Task 5 returns `{ data }`, which `ContentSection.load()` already reads.)

- [ ] **Step 3: Stage**

```bash
git add frontend/src/app/admin/sections/ContentSection.tsx
git commit -m "feat(web): add spaces resource config for content dashboards"
```

---

## Task 9: Editor "Artistes" moderation tab

**Files:**
- Create: `frontend/src/app/editor/ArtistsModeration.tsx`

Lists all artists (incl. drafts) via `GET /artists/admin/all`, lets an editor publish/unpublish and edit basic fields via `PATCH /artists/:slug`.

- [ ] **Step 1: Create the component**

```tsx
// frontend/src/app/editor/ArtistsModeration.tsx
'use client'

import { useCallback, useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { getAccessToken } from '@/lib/auth'
import { useToast, ToastView } from '@/app/admin/sections/Toast'
import type { ArtistProfile } from '@/lib/artist'

interface AdminArtistList {
  data: ArtistProfile[]
}

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Brouillon',
  PUBLISHED: 'Publié',
  ARCHIVED: 'Archivé',
}

export function ArtistsModeration() {
  const token = getAccessToken()
  const [artists, setArtists] = useState<ArtistProfile[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [busySlug, setBusySlug] = useState<string | null>(null)
  const { toast, showToast } = useToast()

  const load = useCallback(() => {
    if (!token) return
    setLoading(true)
    apiFetch<AdminArtistList>('/artists/admin/all?pageSize=100', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => setArtists(res.data ?? []))
      .catch(() => setArtists(null))
      .finally(() => setLoading(false))
  }, [token])

  useEffect(() => { load() }, [load])

  async function setStatus(slug: string, status: 'DRAFT' | 'PUBLISHED') {
    if (!token) return
    setBusySlug(slug)
    const prev = artists
    setArtists(a => a ? a.map(x => x.slug === slug ? { ...x, status } : x) : a)
    try {
      await apiFetch(`/artists/${slug}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      })
      showToast(status === 'PUBLISHED' ? 'Profil publié.' : 'Profil repassé en brouillon.', 'success')
    } catch (e) {
      setArtists(prev)
      showToast(e instanceof ApiError ? 'Action refusée.' : 'Échec de la mise à jour.', 'error')
    } finally {
      setBusySlug(null)
    }
  }

  if (loading) return <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Chargement…</div>
  if (!artists?.length) return <div className="px-6 py-16 text-center text-bsmk-black/40 text-sm">Aucun profil artiste</div>

  return (
    <div className="border border-bsmk-black/10 rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bsmk-black/5">
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Artiste</th>
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal hidden md:table-cell">Ville</th>
            <th className="text-left px-6 py-3 text-xs tracking-widest uppercase text-bsmk-black/40 font-normal">Statut</th>
            <th className="px-6 py-3" />
          </tr>
        </thead>
        <tbody>
          {artists.map(a => (
            <tr key={a.id} className="border-b border-bsmk-black/5 hover:bg-black/[0.03] transition-colors">
              <td className="px-6 py-4 font-medium text-bsmk-black">{a.name}</td>
              <td className="px-6 py-4 text-bsmk-black/60 hidden md:table-cell">{a.city ?? '—'}</td>
              <td className="px-6 py-4 text-bsmk-black/60">{STATUS_LABEL[a.status] ?? a.status}</td>
              <td className="px-6 py-4 text-right">
                {a.status === 'PUBLISHED' ? (
                  <button
                    disabled={busySlug === a.slug}
                    onClick={() => setStatus(a.slug, 'DRAFT')}
                    className="text-xs text-bsmk-black/40 hover:text-bsmk-black transition-colors disabled:opacity-40"
                  >
                    Dépublier
                  </button>
                ) : (
                  <button
                    disabled={busySlug === a.slug}
                    onClick={() => setStatus(a.slug, 'PUBLISHED')}
                    className="text-xs text-page-accent hover:opacity-80 transition-opacity disabled:opacity-40"
                  >
                    Publier
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastView toast={toast} />
    </div>
  )
}
```

- [ ] **Step 2: Typecheck**

Run: `pnpm --filter @bsmk/web typecheck`
Expected: no errors.

- [ ] **Step 3: Stage**

```bash
git add frontend/src/app/editor/ArtistsModeration.tsx
git commit -m "feat(web): editor artist moderation (list + publish/unpublish)"
```

---

## Task 10: EDITOR dashboard — `/editor` (frontend-design)

**Files:**
- Create: `frontend/src/app/editor/page.tsx`
- Create: `frontend/src/app/editor/EditorDashboard.tsx`

> **Use the `frontend-design` skill** for `EditorDashboard.tsx`. Mirror the structure/theme of `AdminDashboard.tsx` (top bar, section color stripe, tabbed nav) but **content-only**: no Users tab, no stats cards about users, no role management, no delete buttons surfaced.

**Behavioral contract:**
1. Client component; gate to `{ADMIN, EDITOR}` (read `getAuthUser()`; redirect `/login?redirect=/editor` if unauthenticated, `/` if role not allowed).
2. Top bar like admin: "← Site public" link, title "Espace Éditeur", user email + Déconnexion (`logout()` then `router.push('/login')`).
3. Tabbed nav with sections: **Articles, Événements, Programmes, Espaces, Demandes, Artistes**.
   - Articles/Événements/Programmes/Espaces → `<ContentSection config={RESOURCES.articles|events|programmes|spaces} />`.
   - Demandes → `<RequestsSection />` (import from `@/app/admin/sections/RequestsSection`).
   - Artistes → `<ArtistsModeration />` (Task 9).
4. No `ConfirmModal` for user deletion etc. — none of that exists here.

- [ ] **Step 1: Route entry**

```tsx
// frontend/src/app/editor/page.tsx
import { EditorDashboard } from './EditorDashboard'

export const dynamic = 'force-dynamic'

export default function EditorPage() {
  return <EditorDashboard />
}
```

- [ ] **Step 2: Build `EditorDashboard.tsx` via frontend-design**

Invoke `frontend-design` to author `frontend/src/app/editor/EditorDashboard.tsx` per the contract. Imports: `@/lib/auth` (`getAuthUser`, `logout`), `next/navigation` (`useRouter`), `next/link`, `@/app/admin/sections/ContentSection` (`ContentSection`, `RESOURCES`), `@/app/admin/sections/RequestsSection` (`RequestsSection`), `./ArtistsModeration` (`ArtistsModeration`).

- [ ] **Step 3: Typecheck + lint**

Run: `pnpm --filter @bsmk/web typecheck && pnpm --filter @bsmk/web lint`
Expected: no errors.

- [ ] **Step 4: Manual verify**

Log in as the seeded EDITOR (Task 11): lands on `/editor`; each tab loads; can create/edit an article; Espaces tab lists spaces incl. drafts; Artistes tab lists the seeded artist and can publish it; no Users tab; no delete buttons.

- [ ] **Step 5: Stage**

```bash
git add frontend/src/app/editor/page.tsx frontend/src/app/editor/EditorDashboard.tsx
git commit -m "feat(web): EDITOR content dashboard at /editor"
```

---

## Task 11: Role-based login redirect + role-aware header link

**Files:**
- Modify: `frontend/src/app/(site)/login/LoginForm.tsx`
- Modify: `frontend/src/components/layout/Header.tsx`

- [ ] **Step 1: Login redirect by role**

In `LoginForm.tsx`, replace:
```typescript
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
        const fallback = payload.role === 'ADMIN' ? '/admin' : '/'
        window.location.href = safe ?? fallback
```
with:
```typescript
        const payload = JSON.parse(atob(data.accessToken.split('.')[1]))
        const byRole: Record<string, string> = {
          ADMIN: '/admin',
          EDITOR: '/editor',
          ARTIST: '/artiste',
        }
        const fallback = byRole[payload.role] ?? '/'
        window.location.href = safe ?? fallback
```

- [ ] **Step 2: Role-aware header dashboard link (desktop)**

In `Header.tsx`, the current block (around lines 156–164) renders an Admin link only when `isAdmin`. Replace the desktop `{isAdmin && (…Admin…)}` block with a role-aware link. First add, near `const isAdmin = …` (line 44):
```typescript
  const dashboard =
    user?.role === 'ADMIN' ? { href: '/admin', label: 'Admin' }
    : user?.role === 'EDITOR' ? { href: '/editor', label: 'Éditeur' }
    : user?.role === 'ARTIST' ? { href: '/artiste', label: 'Mon espace' }
    : null
```
Then replace the desktop block:
```tsx
            {isAdmin && (
              <Link
                href="/admin"
                className="text-sm font-medium transition-colors tracking-wide"
                style={{ color: '#C0392B' }}
              >
                Admin
              </Link>
            )}
```
with:
```tsx
            {dashboard && (
              <Link
                href={dashboard.href}
                className="text-sm font-medium transition-colors tracking-wide"
                style={{ color: '#C0392B' }}
              >
                {dashboard.label}
              </Link>
            )}
```

- [ ] **Step 3: Role-aware header link (mobile)**

Replace the mobile `{isAdmin && (…Administration…)}` block (around lines 269–277) with:
```tsx
              {dashboard && (
                <Link
                  href={dashboard.href}
                  className="mt-4 block border text-sm font-medium px-5 py-3.5 text-center tracking-wide transition-colors rounded-lg"
                  style={{ borderColor: '#C0392B', color: '#C0392B' }}
                >
                  {dashboard.label}
                </Link>
              )}
```
(`isAdmin` may now be unused — if the linter flags it, remove the `const isAdmin = …` line.)

- [ ] **Step 4: Typecheck + lint**

Run: `pnpm --filter @bsmk/web typecheck && pnpm --filter @bsmk/web lint`
Expected: no errors.

- [ ] **Step 5: Stage**

```bash
git add "frontend/src/app/(site)/login/LoginForm.tsx" frontend/src/components/layout/Header.tsx
git commit -m "feat(web): route EDITOR/ARTIST post-login + role-aware header link"
```

---

## Task 12: Seed an EDITOR and an ARTIST user

**Files:**
- Modify: `packages/db/prisma/seed.ts`

- [ ] **Step 1: Add the two users**

In `seed.ts`, just after the admin `prisma.user.upsert({ where: { email: 'admin@bsmk.tn' } … })` block, add:

```typescript
  await prisma.user.upsert({
    where: { email: 'editor@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'editor@bsmk.tn',
      passwordHash,
      role: 'EDITOR',
      firstName: 'Éditeur',
      lastName: 'BSMK',
    },
  });

  await prisma.user.upsert({
    where: { email: 'artist@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'artist@bsmk.tn',
      passwordHash,
      role: 'ARTIST',
      firstName: 'Artiste',
      lastName: 'Test',
    },
  });
```
(They reuse the same `passwordHash` of `changeme123` already computed at the top of `main()`.)

- [ ] **Step 2: Run the seed**

Run: `pnpm --filter @bsmk/db prisma db seed` (or the repo's seed script — check `packages/db/package.json`).
Expected: completes; logs include the existing "Seed complete" line. The two new users now exist.

- [ ] **Step 3: Stage**

```bash
git add packages/db/prisma/seed.ts
git commit -m "chore(db): seed EDITOR + ARTIST test users"
```

---

## Task 13: End-to-end verification

**Files:** none (verification only). Use the `verify` skill or manual browser checks.

- [ ] **Step 1: Backend tests + build green**

Run: `pnpm --filter @bsmk/api test && pnpm --filter @bsmk/api build`
Expected: all pass.

- [ ] **Step 2: Frontend typecheck + lint + build**

Run: `pnpm --filter @bsmk/web typecheck && pnpm --filter @bsmk/web lint && pnpm --filter @bsmk/web build`
Expected: all pass.

- [ ] **Step 3: Role-routing matrix (browser, backend+frontend running)**

| Login as | Lands on | Header link | Can reach other space? |
|---|---|---|---|
| admin@bsmk.tn | /admin | "Admin" | /editor & /artiste allowed (ADMIN in both gates) |
| editor@bsmk.tn | /editor | "Éditeur" | /admin → redirected to / ; /artiste allowed |
| artist@bsmk.tn | /artiste | "Mon espace" | /admin & /editor → redirected to / |

- [ ] **Step 4: Artist DRAFT → publish flow**

As artist@bsmk.tn: create profile at `/artiste` → DRAFT banner. As editor@bsmk.tn: Artistes tab → Publier. Public page `/vetrinart/<slug>` now resolves; `/artiste` shows the green published banner with the preview link.

- [ ] **Step 5: Authorization check**

With the ARTIST token, `curl -X POST localhost:3001/api/artists … ` → 403; `PUT /artists/me` → 200. Public `GET /artists` does not include the DRAFT artist; `GET /artists/admin/all` (editor token) does. **(All verified live on 2026-06-05 — see the verification table in the session.)**

- [ ] **Step 6: Report results to the user; do not commit/push until authorized.**

---

## Self-Review Notes (author)

- **Spec coverage:** §1 backend → Tasks 1–5; §2 ARTIST space → Tasks 6–7; §3 EDITOR space → Tasks 8–10 (+ Task 5 spaces route); §4 routing/nav → Task 11; §6 testing → Tasks 2–3 (unit) + Task 13 (e2e); seed note → Task 12. All covered.
- **Type consistency:** `findMine`/`upsertMine`/`findAllAdmin` names are identical across service, controller, and tests. `UpsertOwnArtistDto` excludes slug/status/featured/userId, matching `upsertMine`'s "ignore body slug/status/featured" tests. `ArtistProfile`/`UpsertArtistPayload`/`ArtistWork` from `lib/artist.ts` are reused by Task 7 and Task 9.
- **Ambiguity resolved:** `ContentSection.load()` reads `res.data` strictly (verified, line ~160), so `GET /spaces/admin/all` returns `{ data }` (Task 5) — no reader change. `ListArtistsDto.status` enum does not allow `'ALL'` (verified), so `findAllAdmin` omits status to list all. Backend serves on 3001 (root `.env`, prefix `/api`); frontend via `pnpm --filter @bsmk/web dev`.
- **Known follow-up not in scope:** image upload (URL fields only); the Phase-1 note that admin article edit overwrites `body` with excerpt is untouched here (magazine still static).
