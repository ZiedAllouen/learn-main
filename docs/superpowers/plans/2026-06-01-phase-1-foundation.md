# BSMK × VetrinArt — Phase 1 Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the static brochure into a working, editable site: wire pages to the API, add a universal `Request` inbox (enrollment + booking), and give admins editing for Requests/Articles/Events/Programmes.

**Architecture:** New NestJS `requests` module (public `POST /requests`, admin `GET`/`PATCH`) backed by one Prisma `Request` table with a flexible `details` JSON field. Frontend pages fetch fresh from the API server-side (`cache: 'no-store'`). Admin dashboard gains a sidebar with four list→form→save screens that call **already-existing** backend CRUD endpoints. Old static data is exported to parked JSON and disconnected.

**Tech Stack:** NestJS 11, Prisma, PostgreSQL, class-validator, Jest (backend); Next.js 15 App Router, React 19, TypeScript (frontend). Package manager: `pnpm`. Run backend tests from `backend/`.

**Design spec:** `docs/superpowers/specs/2026-06-01-phase-1-foundation-design.md`

---

## Important context for the implementer (read first)

- **Backend conventions** (copy these exactly):
  - Global guards in `backend/src/app.module.ts`: `JwtAuthGuard` + `RolesGuard` are applied to ALL routes. To make a route public, add `@Public()` (`backend/src/common/decorators/public.decorator.ts`). To restrict by role, add `@Roles('ADMIN', 'EDITOR')` (`backend/src/common/decorators/roles.decorator.ts`).
  - Pattern reference for a **public POST that saves a message**: `backend/src/contact/` (controller + service + dto). The `Request` module mirrors this for create, plus admin list/get/patch.
  - Pattern reference for **admin list + CRUD with pagination/filter**: `backend/src/events/` (controller + service + 3 DTOs). Copy its shape.
  - Services receive `PrismaService` via constructor injection. List endpoints return `PaginatedResult<unknown>` (`{ data, total, page, pageSize, totalPages }`) from `@bsmk/types`.
  - Modules must be registered in `backend/src/app.module.ts` `imports`.
- **Test conventions:** Service-level unit tests with a hand-mocked Prisma object. Reference: `backend/src/auth/auth.service.spec.ts` and `backend/src/sectors/sectors.service.spec.ts`. Tests live next to the service as `*.service.spec.ts`. Run with `pnpm test` from `backend/`.
- **Frontend fetch helper:** `frontend/src/lib/api.ts` exports `apiFetch<T>(path, options)` and `PaginatedResult<T>`. Per-resource helpers live in `frontend/src/lib/api/` (see `artists.ts`).
  - ⚠️ **Discrepancy to honor:** existing helpers use `next: { revalidate: 300 }` (5-min cache). The Phase 1 spec requires **fresh on each request**. For all helpers you create or edit in this plan, use `{ cache: 'no-store' }` instead of `revalidate`. Do not "fix" the old ones beyond what each task says.
- **Admin auth (frontend):** `frontend/src/lib/auth.ts` exports `getAccessToken()`, `getAuthUser()`, `isAdmin()`, `logout()`. Admin fetches attach `Authorization: Bearer ${token}`. The admin UI lives in `frontend/src/app/admin/AdminDashboard.tsx` (a `'use client'` component).
- **Already-existing admin CRUD endpoints** (verified): `events`, `articles`, `programs`, `spaces`, `artists` controllers all expose `@Roles`-guarded `POST`/`PATCH`/`DELETE`. So admin content tasks are **frontend-only** — no new backend code for Articles/Events/Programmes editing.
- **Pages already wired to API:** home (`page.tsx`), `magazine`, `disciplines`, `vetrinart`. **Pages still on static data:** `agenda`, `programmes`, `espaces` (+ their `[slug]` detail pages). Wiring tasks target only the unwired ones.
- **Commit after each task.** Branch first (repo is on its default branch): `git checkout -b phase-1-foundation`.

---

## File Structure

**Backend (new — the Request module):**
- `backend/src/requests/requests.module.ts` — wires controller + service
- `backend/src/requests/requests.controller.ts` — `POST /requests` (public), `GET /requests` + `GET /requests/:id` + `PATCH /requests/:id` (admin)
- `backend/src/requests/requests.service.ts` — create / list / get / updateStatus
- `backend/src/requests/requests.service.spec.ts` — unit tests
- `backend/src/requests/dto/create-request.dto.ts`
- `backend/src/requests/dto/list-requests.dto.ts`
- `backend/src/requests/dto/update-request.dto.ts`

**Backend (modified):**
- `packages/db/prisma/schema.prisma` — add `Request` model + `RequestType`/`RequestStatus` enums + relations on `User`/`Program`/`Space`
- `backend/src/app.module.ts` — register `RequestsModule`

**Frontend (new):**
- `frontend/src/lib/api/requests.ts` — `submitRequest()` (public) + admin list/get/patch helpers
- `frontend/src/lib/api/programs.ts` — `getPrograms()`, `getProgram(slug)`
- `frontend/src/lib/api/spaces.ts` — `getSpaces()`, `getSpace(slug)`
- `frontend/src/lib/api/events.ts` — `getEvents()`, `getEvent(slug)`
- `frontend/src/components/RequestForm.tsx` — shared submission form (used on programme + espace pages)
- `frontend/src/app/admin/sections/RequestsSection.tsx` — admin Demandes screen
- `frontend/src/app/admin/sections/ContentSection.tsx` — generic list→form→save screen reused for Articles/Events/Programmes
- `frontend/src/data/seed/` — parked JSON exports of the old static data

**Frontend (modified):**
- `frontend/src/app/(site)/agenda/page.tsx` + `agenda/[slug]/page.tsx` — fetch from API
- `frontend/src/app/(site)/programmes/page.tsx` + `programmes/[slug]/page.tsx` — fetch from API; add `RequestForm`
- `frontend/src/app/(site)/espaces/page.tsx` + `espaces/[slug]/page.tsx` — fetch from API; add `RequestForm`
- `frontend/src/app/admin/AdminDashboard.tsx` — add sidebar + mount the new sections

---

# PART A — Backend: the Request system

## Task 1: Add the `Request` model to the Prisma schema

**Files:**
- Modify: `packages/db/prisma/schema.prisma`

- [ ] **Step 1: Add the two enums** near the other enums (after `MediaType`):

```prisma
enum RequestType {
  ENROLLMENT
  BOOKING
  PROJECT
  PARTNERSHIP
  OPPORTUNITY
}

enum RequestStatus {
  NEW
  REVIEWING
  ACCEPTED
  DECLINED
}
```

- [ ] **Step 2: Add the `Request` model** at the end of the file (before the final newline):

```prisma
model Request {
  id        String        @id @default(cuid())
  type      RequestType
  status    RequestStatus @default(NEW)
  name      String
  email     String
  phone     String?
  message   String?
  details   Json?
  adminNote String?
  programId String?
  spaceId   String?
  userId    String?
  createdAt DateTime      @default(now())
  updatedAt DateTime      @updatedAt

  program Program? @relation(fields: [programId], references: [id])
  space   Space?   @relation(fields: [spaceId], references: [id])
  user    User?    @relation(fields: [userId], references: [id])

  @@index([type, status])
  @@map("requests")
}
```

- [ ] **Step 3: Add back-relations** on the three related models. In `model User { ... }` add to the relations block:

```prisma
  requests Request[]
```

In `model Program { ... }` add to its relations block:

```prisma
  requests Request[]
```

In `model Space { ... }` add to its relations block:

```prisma
  requests Request[]
```

- [ ] **Step 4: Validate the schema**

Run: `cd packages/db && pnpm exec prisma validate`
Expected: `The schema at prisma/schema.prisma is valid 🚀`

- [ ] **Step 5: Generate the client + create the migration**

Run: `cd packages/db && pnpm exec prisma migrate dev --name add_request_model`
Expected: migration created under `packages/db/prisma/migrations/`, client regenerated, no errors.
(If no database is reachable, instead run `pnpm exec prisma generate` and note that the migration must be created once a DB is available. Do not skip generate — the backend needs the regenerated client types.)

- [ ] **Step 6: Commit**

```bash
git add packages/db/prisma/schema.prisma packages/db/prisma/migrations
git commit -m "feat(db): add Request model with type/status enums"
```

---

## Task 2: Create the Request DTOs

**Files:**
- Create: `backend/src/requests/dto/create-request.dto.ts`
- Create: `backend/src/requests/dto/list-requests.dto.ts`
- Create: `backend/src/requests/dto/update-request.dto.ts`

- [ ] **Step 1: Create `create-request.dto.ts`**

```typescript
import { IsString, IsOptional, IsEnum, IsEmail, IsObject, MaxLength } from 'class-validator';

const REQUEST_TYPES = ['ENROLLMENT', 'BOOKING', 'PROJECT', 'PARTNERSHIP', 'OPPORTUNITY'] as const;
type RequestType = (typeof REQUEST_TYPES)[number];

export class CreateRequestDto {
  @IsEnum(REQUEST_TYPES)
  type: RequestType;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  message?: string;

  @IsOptional()
  @IsObject()
  details?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  programId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  spaceId?: string;
}
```

> **Security note (this is a PUBLIC unauthenticated endpoint):** the `@MaxLength` caps above match the existing `contact` DTO convention (`backend/src/contact/dto/create-contact.dto.ts`) and prevent oversized payloads. Do not omit them.

- [ ] **Step 2: Create `list-requests.dto.ts`**

```typescript
import { IsOptional, IsInt, Min, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

const REQUEST_TYPES = ['ENROLLMENT', 'BOOKING', 'PROJECT', 'PARTNERSHIP', 'OPPORTUNITY'] as const;
const REQUEST_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED'] as const;

export class ListRequestsDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  page: number = 1;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Type(() => Number)
  pageSize: number = 20;

  @IsOptional()
  @IsEnum(REQUEST_TYPES)
  type?: (typeof REQUEST_TYPES)[number];

  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: (typeof REQUEST_STATUSES)[number];
}
```

- [ ] **Step 3: Create `update-request.dto.ts`**

```typescript
import { IsOptional, IsString, IsEnum } from 'class-validator';

const REQUEST_STATUSES = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED'] as const;

export class UpdateRequestDto {
  @IsOptional()
  @IsEnum(REQUEST_STATUSES)
  status?: (typeof REQUEST_STATUSES)[number];

  @IsOptional()
  @IsString()
  adminNote?: string;
}
```

- [ ] **Step 4: Commit**

```bash
git add backend/src/requests/dto
git commit -m "feat(requests): add request DTOs"
```

---

## Task 3: Write the failing service test

**Files:**
- Create: `backend/src/requests/requests.service.spec.ts`

- [ ] **Step 1: Write the test** (mirrors the mocked-Prisma pattern in `auth.service.spec.ts`)

```typescript
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RequestsService', () => {
  let service: RequestsService;
  let prisma: {
    request: {
      create: jest.Mock;
      findMany: jest.Mock;
      count: jest.Mock;
      findUnique: jest.Mock;
      update: jest.Mock;
    };
    $transaction: jest.Mock;
  };

  beforeEach(async () => {
    prisma = {
      request: {
        create: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
      },
      $transaction: jest.fn(),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [RequestsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(RequestsService);
  });

  it('creates a request with NEW status and a confirmation payload', async () => {
    prisma.request.create.mockResolvedValue({ id: 'r1' });
    const result = await service.create(
      { type: 'BOOKING', name: 'Amel', email: 'a@b.tn', spaceId: 's1' },
      'user1',
    );
    expect(prisma.request.create).toHaveBeenCalledWith({
      data: { type: 'BOOKING', name: 'Amel', email: 'a@b.tn', spaceId: 's1', userId: 'user1' },
    });
    expect(result).toEqual({ id: 'r1', message: 'Request received' });
  });

  it('lists requests paginated with optional filters', async () => {
    prisma.$transaction.mockResolvedValue([[{ id: 'r1' }], 1]);
    const result = await service.findAll({ page: 1, pageSize: 20, type: 'BOOKING' });
    expect(result).toEqual({ data: [{ id: 'r1' }], total: 1, page: 1, pageSize: 20, totalPages: 1 });
  });

  it('throws NotFound when updating a missing request', async () => {
    prisma.request.findUnique.mockResolvedValue(null);
    await expect(service.update('missing', { status: 'ACCEPTED' }))
      .rejects.toBeInstanceOf(NotFoundException);
  });

  it('updates status and adminNote of an existing request', async () => {
    prisma.request.findUnique.mockResolvedValue({ id: 'r1' });
    prisma.request.update.mockResolvedValue({ id: 'r1', status: 'ACCEPTED' });
    const result = await service.update('r1', { status: 'ACCEPTED', adminNote: 'ok' });
    expect(prisma.request.update).toHaveBeenCalledWith({
      where: { id: 'r1' },
      data: { status: 'ACCEPTED', adminNote: 'ok' },
    });
    expect(result).toEqual({ id: 'r1', status: 'ACCEPTED' });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `cd backend && pnpm test -- requests.service`
Expected: FAIL — `Cannot find module './requests.service'` (service not created yet).

- [ ] **Step 3: Commit the failing test**

```bash
git add backend/src/requests/requests.service.spec.ts
git commit -m "test(requests): add failing service tests"
```

---

## Task 4: Implement the Request service

**Files:**
- Create: `backend/src/requests/requests.service.ts`

- [ ] **Step 1: Write the service**

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateRequestDto } from './dto/create-request.dto';
import type { ListRequestsDto } from './dto/list-requests.dto';
import type { UpdateRequestDto } from './dto/update-request.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class RequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRequestDto, userId?: string) {
    const created = await this.prisma.request.create({
      data: { ...dto, userId },
    });
    return { id: created.id, message: 'Request received' };
  }

  async findAll(dto: ListRequestsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, type, status } = dto;
    const skip = (page - 1) * pageSize;
    const where = {
      ...(type && { type }),
      ...(status && { status }),
    };
    const [data, total] = await this.prisma.$transaction([
      this.prisma.request.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          program: { select: { id: true, slug: true, title: true } },
          space: { select: { id: true, slug: true, name: true } },
        },
      }),
      this.prisma.request.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(id: string) {
    const request = await this.prisma.request.findUnique({
      where: { id },
      include: { program: true, space: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async update(id: string, dto: UpdateRequestDto) {
    const existing = await this.prisma.request.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException('Request not found');
    return this.prisma.request.update({ where: { id }, data: { ...dto } });
  }
}
```

> Note: the `create` test expects `prisma.request.create` to be called with exactly `{ data: { ...dto, userId } }`. The spread keeps the DTO fields (`type`, `name`, `email`, `spaceId`) and appends `userId`. `details`/`programId` are simply absent in that test's DTO, so they won't appear — matching the assertion.

- [ ] **Step 2: Run the test to verify it passes**

Run: `cd backend && pnpm test -- requests.service`
Expected: PASS — 4 passing tests.

- [ ] **Step 3: Commit**

```bash
git add backend/src/requests/requests.service.ts
git commit -m "feat(requests): implement requests service"
```

---

## Task 5: Implement the controller + module and register it

**Files:**
- Create: `backend/src/requests/requests.controller.ts`
- Create: `backend/src/requests/requests.module.ts`
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Write the controller** (public create like `contact`, admin read/update like `events`)

```typescript
import { Body, Controller, Get, Param, Patch, Post, Query, Req } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { ListRequestsDto } from './dto/list-requests.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import type { Request as ExpressRequest } from 'express';

interface MaybeAuthUser { id?: string }

@Controller('requests')
export class RequestsController {
  constructor(private readonly requests: RequestsService) {}

  @Public()
  @Post()
  create(
    @Body() dto: CreateRequestDto,
    @Req() req: ExpressRequest & { user?: MaybeAuthUser },
  ) {
    return this.requests.create(dto, req.user?.id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get()
  findAll(@Query() dto: ListRequestsDto) {
    return this.requests.findAll(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.requests.findOne(id);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateRequestDto) {
    return this.requests.update(id, dto);
  }
}
```

- [ ] **Step 2: Write the module**

```typescript
import { Module } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { RequestsController } from './requests.controller';

@Module({
  controllers: [RequestsController],
  providers: [RequestsService],
})
export class RequestsModule {}
```

- [ ] **Step 3: Register the module** in `backend/src/app.module.ts`. Add the import near the other module imports:

```typescript
import { RequestsModule } from './requests/requests.module';
```

And add `RequestsModule` to the `imports: [...]` array (after `UsersModule`).

- [ ] **Step 4: Typecheck the backend**

Run: `cd backend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 5: Run the full backend test suite**

Run: `cd backend && pnpm test`
Expected: all suites pass (auth, sectors, requests).

- [ ] **Step 6: Commit**

```bash
git add backend/src/requests backend/src/app.module.ts
git commit -m "feat(requests): add controller + module, register in app"
```

---

# PART B — Frontend: request forms on public pages

## Task 6: Add the frontend request API helper

**Files:**
- Create: `frontend/src/lib/api/requests.ts`

- [ ] **Step 1: Write the helper** (public submit uses `apiFetch`; no caching since it's a POST)

```typescript
import { apiFetch, type PaginatedResult } from '@/lib/api'

export type RequestType = 'ENROLLMENT' | 'BOOKING' | 'PROJECT' | 'PARTNERSHIP' | 'OPPORTUNITY'
export type RequestStatus = 'NEW' | 'REVIEWING' | 'ACCEPTED' | 'DECLINED'

export interface SubmitRequestInput {
  type: RequestType
  name: string
  email: string
  phone?: string
  message?: string
  details?: Record<string, unknown>
  programId?: string
  spaceId?: string
}

export interface RequestRecord {
  id: string
  type: RequestType
  status: RequestStatus
  name: string
  email: string
  phone: string | null
  message: string | null
  adminNote: string | null
  createdAt: string
  program: { id: string; slug: string; title: string } | null
  space: { id: string; slug: string; name: string } | null
}

export async function submitRequest(input: SubmitRequestInput): Promise<{ id: string; message: string }> {
  return apiFetch('/requests', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function listRequests(
  token: string,
  params: { page?: number; type?: RequestType; status?: RequestStatus } = {},
): Promise<PaginatedResult<RequestRecord>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.type) q.set('type', params.type)
  if (params.status) q.set('status', params.status)
  const qs = q.toString()
  return apiFetch(`/requests${qs ? `?${qs}` : ''}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  })
}

export async function updateRequest(
  token: string,
  id: string,
  patch: { status?: RequestStatus; adminNote?: string },
): Promise<RequestRecord> {
  return apiFetch(`/requests/${id}`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(patch),
  })
}
```

- [ ] **Step 2: Typecheck the frontend**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/lib/api/requests.ts
git commit -m "feat(web): add requests API helper"
```

---

## Task 7: Build the shared RequestForm component

**Files:**
- Create: `frontend/src/components/RequestForm.tsx`

- [ ] **Step 1: Write the component** (a `'use client'` form; programme pages pass `type="ENROLLMENT"` + `programId`, espace pages pass `type="BOOKING"` + `spaceId`)

```tsx
'use client'

import { useState } from 'react'
import { submitRequest, type RequestType } from '@/lib/api/requests'

interface RequestFormProps {
  type: RequestType
  programId?: string
  spaceId?: string
  submitLabel: string
}

export function RequestForm({ type, programId, spaceId, submitLabel }: RequestFormProps) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setState('sending')
    try {
      await submitRequest({ type, programId, spaceId, name, email, phone, message })
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') {
    return (
      <p className="rounded-lg bg-bsmk-olive/10 p-4 text-bsmk-black">
        Merci ! Votre demande a bien été reçue. Notre équipe vous répondra sous 48h.
      </p>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <input
        required value={name} onChange={(e) => setName(e.target.value)}
        placeholder="Nom complet"
        className="w-full rounded-lg border border-bsmk-black/15 px-4 py-2"
      />
      <input
        required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full rounded-lg border border-bsmk-black/15 px-4 py-2"
      />
      <input
        value={phone} onChange={(e) => setPhone(e.target.value)}
        placeholder="Téléphone (optionnel)"
        className="w-full rounded-lg border border-bsmk-black/15 px-4 py-2"
      />
      <textarea
        value={message} onChange={(e) => setMessage(e.target.value)}
        placeholder="Votre message (optionnel)" rows={4}
        className="w-full rounded-lg border border-bsmk-black/15 px-4 py-2"
      />
      {state === 'error' && (
        <p className="text-sm text-red-600">Une erreur est survenue. Réessayez.</p>
      )}
      <button
        type="submit" disabled={state === 'sending'}
        className="rounded-lg bg-bsmk-black px-6 py-2 text-white disabled:opacity-50"
      >
        {state === 'sending' ? 'Envoi…' : submitLabel}
      </button>
    </form>
  )
}
```

> Note on styling: the classes above (`bsmk-olive`, `bsmk-black`) follow the Tailwind tokens already used in the espaces page. If the implementer finds different token names while editing, match the page's existing classes — visual polish is not the point of this task; a working, on-brand form is.

- [ ] **Step 2: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/src/components/RequestForm.tsx
git commit -m "feat(web): add shared RequestForm component"
```

---

# PART C — Frontend: wire unwired pages to the API

> Each wiring task follows the same safe pattern: add the API helper → switch the page to it → verify it renders → only then is the static import unused. The static `@/data/*` files stay until Task 12 (export to JSON).

## Task 8: Wire the Programmes pages + add enrollment form

**Files:**
- Create: `frontend/src/lib/api/programs.ts`
- Modify: `frontend/src/app/(site)/programmes/page.tsx`
- Modify: `frontend/src/app/(site)/programmes/[slug]/page.tsx`

- [ ] **Step 1: Create the programs helper.** First confirm the field shape the API returns:

Run: `grep -A30 "async findOne" backend/src/programs/programs.service.ts`
Then write `frontend/src/lib/api/programs.ts` modeled on `frontend/src/lib/api/artists.ts`, but with `{ cache: 'no-store' }` instead of `revalidate`. Minimum surface:

```typescript
import { apiFetch, type PaginatedResult } from '@/lib/api'

export interface Program {
  id: string
  slug: string
  title: string
  description: string | null
  coverUrl: string | null
  modality: string
  duration: string | null
  priceIndicative: string | null
  featured: boolean
  status: string
  // include the relation fields findOne returns (disciplines, audiences, programType)
}

export async function getPrograms(params: { page?: number; pageSize?: number; discipline?: string } = {}): Promise<PaginatedResult<Program>> {
  const q = new URLSearchParams()
  if (params.page) q.set('page', String(params.page))
  if (params.pageSize) q.set('pageSize', String(params.pageSize))
  if (params.discipline) q.set('discipline', params.discipline)
  const qs = q.toString()
  return apiFetch(`/programs${qs ? `?${qs}` : ''}`, { cache: 'no-store' })
}

export async function getProgram(slug: string): Promise<Program> {
  return apiFetch(`/programs/${slug}`, { cache: 'no-store' })
}
```

> Fill in the `Program` interface to match exactly what `programs.service.ts` `findOne`/`findAll` return (relations included). Use `frontend/src/data/programs.ts` as a cross-reference for which fields the page reads.

- [ ] **Step 2: Switch the list page.** In `frontend/src/app/(site)/programmes/page.tsx`, remove the `import { ... } from '@/data/programs'`, make the component `async`, and fetch:

```tsx
const { data: programs } = await getPrograms({ pageSize: 100 })
```

Map over `programs` where the page previously mapped over the static array. Keep all existing JSX/markup. Add an empty state when `programs.length === 0`:

```tsx
{programs.length === 0 && <p>Aucun programme pour le moment.</p>}
```

- [ ] **Step 3: Switch the detail page + add the form.** In `programmes/[slug]/page.tsx`, fetch with `getProgram(slug)` instead of finding in the static array. Replace the fake CTA (the `/contact?sujet=...` link) with the form:

```tsx
import { RequestForm } from '@/components/RequestForm'
// ...inside the CTA section:
<RequestForm type="ENROLLMENT" programId={program.id} submitLabel="S'inscrire à ce programme" />
```

Handle not-found with Next's `notFound()` if `getProgram` throws (wrap in try/catch and call `notFound()` in catch).

- [ ] **Step 4: Verify it renders.** Start the API + web (`pnpm dev` from repo root) with a seeded DB, open `http://localhost:3000/programmes` and a detail page.
Expected: programmes list from the DB; detail page shows the enrollment form. (If DB is empty, expect the empty state — that is correct behavior, not a failure.)

- [ ] **Step 5: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/api/programs.ts "frontend/src/app/(site)/programmes"
git commit -m "feat(web): wire programmes pages to API + enrollment form"
```

---

## Task 9: Wire the Espaces pages + add booking form

**Files:**
- Create: `frontend/src/lib/api/spaces.ts`
- Modify: `frontend/src/app/(site)/espaces/page.tsx`
- Modify: `frontend/src/app/(site)/espaces/[slug]/page.tsx`

- [ ] **Step 1: Create the spaces helper.** Confirm shape first:

Run: `grep -A25 "async findOne" backend/src/spaces/spaces.service.ts`
Write `frontend/src/lib/api/spaces.ts` modeled on `programs.ts` above, with `{ cache: 'no-store' }`. Surface: `getSpaces(params)` → `PaginatedResult<Space>` on `/spaces`, and `getSpace(slug)` on `/spaces/:slug`. The `Space` interface fields (cross-reference `frontend/src/data/spaces.ts`): `id, slug, name, description, address, floor, surfaceSqm, capacity, equipment (string[]), imageUrls (string[]), status` + `disciplines` relation.

- [ ] **Step 2: Switch the list page.** In `espaces/page.tsx`, remove `@/data/spaces` import, make `async`, fetch `const { data: spaces } = await getSpaces({ pageSize: 100 })`, map over `spaces`, add empty state `Aucun espace pour le moment.`

- [ ] **Step 3: Switch the detail page + add form.** In `espaces/[slug]/page.tsx`, fetch `getSpace(slug)`. Replace the existing `/contact?sujet=Réservation...` CTA link with:

```tsx
import { RequestForm } from '@/components/RequestForm'
// ...in the reservation CTA block:
<RequestForm type="BOOKING" spaceId={space.id} submitLabel={`Réserver ${space.name}`} />
```

Use `notFound()` if `getSpace` throws.

- [ ] **Step 4: Verify it renders.** Open `http://localhost:3000/espaces` and a detail page; confirm the booking form appears.

- [ ] **Step 5: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/api/spaces.ts "frontend/src/app/(site)/espaces"
git commit -m "feat(web): wire espaces pages to API + booking form"
```

---

## Task 10: Wire the Agenda (events) pages

**Files:**
- Create: `frontend/src/lib/api/events.ts`
- Modify: `frontend/src/app/(site)/agenda/page.tsx`
- Modify: `frontend/src/app/(site)/agenda/[slug]/page.tsx`

- [ ] **Step 1: Create the events helper.** The backend `events.service.ts` `findAll` is already known (read earlier): returns `PaginatedResult` with `disciplines` included, supports `eventType`, `discipline`, `from`, `to`, `status`. Write `frontend/src/lib/api/events.ts` with `{ cache: 'no-store' }`:

```typescript
import { apiFetch, type PaginatedResult } from '@/lib/api'

export interface ApiEvent {
  id: string
  slug: string
  title: string
  description: string | null
  eventType: string
  startDate: string
  endDate: string | null
  location: string | null
  coverUrl: string | null
  ticketUrl: string | null
  status: string
  disciplines: { discipline: { id: string; slug: string; name: string } }[]
}

export async function getEvents(params: { eventType?: string; from?: string; to?: string; pageSize?: number } = {}): Promise<PaginatedResult<ApiEvent>> {
  const q = new URLSearchParams()
  if (params.eventType) q.set('eventType', params.eventType)
  if (params.from) q.set('from', params.from)
  if (params.to) q.set('to', params.to)
  q.set('pageSize', String(params.pageSize ?? 100))
  return apiFetch(`/events?${q.toString()}`, { cache: 'no-store' })
}

export async function getEvent(slug: string): Promise<ApiEvent> {
  return apiFetch(`/events/${slug}`, { cache: 'no-store' })
}
```

> ⚠️ The static `data/events.ts` has a `free`/`price` field the DB model does NOT have. The agenda page currently filters on `free`. Since the schema has no `free` column, **drop the `free` filter** when wiring (remove the "free" filter UI/logic). Note this removal in the commit message. (Adding paid/free to events is a Phase 3 ticketing concern.)

- [ ] **Step 2: Switch the list page.** In `agenda/page.tsx`, remove `@/data/events` import, make `async`, fetch `const { data: events } = await getEvents()`. Keep the date-grouping helpers. Map `disciplineSlugs` usages to `e.disciplines.map(d => d.discipline.slug)`. Remove `free` filtering. Add empty state `Aucun événement à venir.`

- [ ] **Step 3: Switch the detail page.** In `agenda/[slug]/page.tsx`, fetch `getEvent(slug)`; `notFound()` on throw. Replace any `disciplineSlugs` access with the relation shape.

- [ ] **Step 4: Verify it renders.** Open `http://localhost:3000/agenda` and a detail page.

- [ ] **Step 5: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/src/lib/api/events.ts "frontend/src/app/(site)/agenda"
git commit -m "feat(web): wire agenda pages to API (drop static-only free filter)"
```

---

# PART D — Admin editing

## Task 11: Add the admin Requests (Demandes) section

**Files:**
- Create: `frontend/src/app/admin/sections/RequestsSection.tsx`
- Modify: `frontend/src/app/admin/AdminDashboard.tsx`

- [ ] **Step 1: Write `RequestsSection.tsx`** (`'use client'`; uses the helper from Task 6 and `getAccessToken` from `@/lib/auth`)

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAccessToken } from '@/lib/auth'
import { listRequests, updateRequest, type RequestRecord, type RequestStatus } from '@/lib/api/requests'

const STATUSES: RequestStatus[] = ['NEW', 'REVIEWING', 'ACCEPTED', 'DECLINED']

export function RequestsSection() {
  const [items, setItems] = useState<RequestRecord[]>([])
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')
  const token = getAccessToken()

  const load = useCallback(async () => {
    if (!token) return
    const res = await listRequests(token, statusFilter ? { status: statusFilter } : {})
    setItems(res.data)
  }, [token, statusFilter])

  useEffect(() => { void load() }, [load])

  async function changeStatus(id: string, status: RequestStatus) {
    if (!token) return
    await updateRequest(token, id, { status })
    await load()
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-semibold">Demandes</h2>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | '')}
          className="rounded border px-2 py-1"
        >
          <option value="">Tous les statuts</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-bsmk-black/50">
            <th className="py-2">Type</th><th>Nom</th><th>Email</th><th>Objet</th><th>Statut</th>
          </tr>
        </thead>
        <tbody>
          {items.map((r) => (
            <tr key={r.id} className="border-t">
              <td className="py-2">{r.type}</td>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.program?.title ?? r.space?.name ?? '—'}</td>
              <td>
                <select
                  value={r.status}
                  onChange={(e) => changeStatus(r.id, e.target.value as RequestStatus)}
                  className="rounded border px-2 py-1"
                >
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr><td colSpan={5} className="py-6 text-center text-bsmk-black/40">Aucune demande.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 2: Mount it in the dashboard.** In `frontend/src/app/admin/AdminDashboard.tsx`, add a simple section switcher. Add at the top of the component a state `const [section, setSection] = useState<'users' | 'requests'>('users')`, render a small nav with two buttons ("Utilisateurs", "Demandes"), and conditionally render the existing users UI when `section === 'users'` and `<RequestsSection />` when `section === 'requests'`. Import it:

```tsx
import { RequestsSection } from './sections/RequestsSection'
```

> Keep the existing users code intact — just wrap it so it shows only in the `users` section. Do not delete the user-management functionality.

- [ ] **Step 3: Typecheck**

Run: `cd frontend && pnpm typecheck`
Expected: no errors.

- [ ] **Step 4: Verify end-to-end (the key manual test).** With API + web running and an ADMIN account: submit a booking on an espace page → log into `/admin` → open "Demandes" → confirm the request is listed → change its status to ACCEPTED → reload → confirm it persisted.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/admin
git commit -m "feat(admin): add Demandes section for reviewing requests"
```

---

## Task 12: Add the admin content editing section (Articles / Events / Programmes)

**Files:**
- Create: `frontend/src/app/admin/sections/ContentSection.tsx`
- Modify: `frontend/src/app/admin/AdminDashboard.tsx`

The backend CRUD endpoints already exist (`@Roles`-guarded `POST`/`PATCH`/`DELETE` on `/articles`, `/events`, `/programs`). This is a generic list→edit→save UI parameterized per resource.

- [ ] **Step 1: Write `ContentSection.tsx`** — a generic editor configured by a resource descriptor. Keep it focused: list rows, an inline "edit" form for the editable text fields, create, and delete. Configuration object:

```tsx
'use client'

import { useEffect, useState, useCallback } from 'react'
import { getAccessToken } from '@/lib/auth'
import { apiFetch } from '@/lib/api'

type Field = { name: string; label: string; type?: 'text' | 'textarea' | 'date' }

export interface ResourceConfig {
  path: string            // e.g. '/articles'
  idField: 'slug'         // these resources are addressed by slug
  titleField: string      // 'title'
  fields: Field[]         // editable fields shown in the form
}

export const RESOURCES: Record<'articles' | 'events' | 'programmes', ResourceConfig> = {
  articles: {
    path: '/articles', idField: 'slug', titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'excerpt', label: 'Extrait', type: 'textarea' },
      { name: 'status', label: 'Statut (DRAFT/PUBLISHED/ARCHIVED)' },
    ],
  },
  events: {
    path: '/events', idField: 'slug', titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'eventType', label: 'Type (CONCERT/EXHIBITION/...)' },
      { name: 'startDate', label: 'Date de début', type: 'date' },
      { name: 'location', label: 'Lieu' },
      { name: 'status', label: 'Statut (DRAFT/PUBLISHED/ARCHIVED)' },
    ],
  },
  programmes: {
    path: '/programs', idField: 'slug', titleField: 'title',
    fields: [
      { name: 'slug', label: 'Slug' },
      { name: 'title', label: 'Titre' },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'duration', label: 'Durée' },
      { name: 'priceIndicative', label: 'Prix indicatif' },
      { name: 'status', label: 'Statut (DRAFT/PUBLISHED/FULL/ARCHIVED)' },
    ],
  },
}

export function ContentSection({ config }: { config: ResourceConfig }) {
  const [rows, setRows] = useState<Record<string, unknown>[]>([])
  const [editing, setEditing] = useState<Record<string, string> | null>(null)
  const token = getAccessToken()

  const load = useCallback(async () => {
    const res = await apiFetch<{ data: Record<string, unknown>[] }>(
      `${config.path}?pageSize=100&status=`, { cache: 'no-store' },
    ).catch(() => ({ data: [] as Record<string, unknown>[] }))
    setRows(res.data)
  }, [config.path])

  useEffect(() => { void load() }, [load])

  function startEdit(row?: Record<string, unknown>) {
    const blank: Record<string, string> = {}
    for (const f of config.fields) blank[f.name] = row ? String(row[f.name] ?? '') : ''
    setEditing(blank)
  }

  async function save() {
    if (!token || !editing) return
    const isNew = !rows.some((r) => r[config.idField] === editing[config.idField])
    const url = isNew ? config.path : `${config.path}/${editing[config.idField]}`
    await apiFetch(url, {
      method: isNew ? 'POST' : 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(editing),
    })
    setEditing(null)
    await load()
  }

  async function remove(slug: string) {
    if (!token || !confirm('Supprimer ?')) return
    await apiFetch(`${config.path}/${slug}`, {
      method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
    })
    await load()
  }

  return (
    <div className="space-y-4">
      <button onClick={() => startEdit()} className="rounded bg-bsmk-black px-4 py-2 text-white">
        + Nouveau
      </button>
      {editing && (
        <div className="space-y-2 rounded border p-4">
          {config.fields.map((f) => (
            <label key={f.name} className="block text-sm">
              {f.label}
              {f.type === 'textarea' ? (
                <textarea
                  value={editing[f.name]} rows={3}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              ) : (
                <input
                  type={f.type === 'date' ? 'datetime-local' : 'text'}
                  value={editing[f.name]}
                  onChange={(e) => setEditing({ ...editing, [f.name]: e.target.value })}
                  className="mt-1 w-full rounded border px-2 py-1"
                />
              )}
            </label>
          ))}
          <div className="flex gap-2">
            <button onClick={save} className="rounded bg-bsmk-olive px-4 py-2 text-white">Enregistrer</button>
            <button onClick={() => setEditing(null)} className="rounded border px-4 py-2">Annuler</button>
          </div>
        </div>
      )}
      <table className="w-full text-sm">
        <tbody>
          {rows.map((r) => (
            <tr key={String(r[config.idField])} className="border-t">
              <td className="py-2">{String(r[config.titleField])}</td>
              <td className="text-right">
                <button onClick={() => startEdit(r)} className="mr-2 underline">Éditer</button>
                <button onClick={() => remove(String(r[config.idField]))} className="text-red-600 underline">Suppr.</button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr><td className="py-6 text-center text-bsmk-black/40">Rien pour le moment.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
```

> Scope note: this editor handles the common text fields (the ones staff change most). Relations (disciplines, audiences), `body` JSON, and cover-image upload are NOT in Phase 1 — those keep their existing values on PATCH because we only send the fields in the form. Creating a brand-new article still needs `authorId` server-side; if the articles `create` requires it and rejects, note it and restrict Articles to edit-only for now (events + programmes create fine). Verify in Step 3.

- [ ] **Step 2: Mount in the dashboard.** Extend the `section` state union in `AdminDashboard.tsx` to `'users' | 'requests' | 'articles' | 'events' | 'programmes'`, add nav buttons, and render `<ContentSection config={RESOURCES.articles} />` etc. Import:

```tsx
import { ContentSection, RESOURCES } from './sections/ContentSection'
```

- [ ] **Step 3: Verify each resource.** With API + web + ADMIN login: open Agenda admin section → create an event → confirm it appears on the public `/agenda` → edit its title → confirm the change is live → delete it. Repeat the create→see-live check for Programmes. For Articles, confirm edit works; if create fails due to required `authorId`, hide/disable "+ Nouveau" for Articles and note it.

- [ ] **Step 4: Typecheck + full build**

Run: `cd frontend && pnpm typecheck && pnpm build`
Expected: typecheck clean; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/app/admin
git commit -m "feat(admin): add content editing for articles/events/programmes"
```

---

# PART E — Park the old static data

## Task 13: Export static data to parked JSON and confirm pages no longer import it

**Files:**
- Create: `frontend/src/data/seed/*.json`
- Modify: (only if any wired page still imports `@/data/*`)

- [ ] **Step 1: Find any remaining static-data imports on wired pages**

Run: `grep -rn "@/data/" "frontend/src/app/(site)/agenda" "frontend/src/app/(site)/programmes" "frontend/src/app/(site)/espaces"`
Expected: no matches. If any remain, remove them (they were superseded in Tasks 8–10).

- [ ] **Step 2: Export each static array to JSON.** For each of `articles, artists, disciplines, events, programs, spaces, team`, create `frontend/src/data/seed/<name>.json` containing the data array as JSON. These are **parked reference snapshots — not imported anywhere.** (Quickest method: a one-off node script that imports each `data/*.ts` export and `JSON.stringify`s it, or hand-convert. The arrays are plain object literals.)

- [ ] **Step 3: Add a README in the seed folder** `frontend/src/data/seed/README.md`:

```markdown
# Parked seed data

Frozen snapshots of the original hardcoded site content (pre-API).
NOT imported by the app. The API + database is the single source of truth.
Kept only as a reference / for manual database seeding if ever needed.
```

- [ ] **Step 4: Confirm nothing imports the seed JSON and the app still builds**

Run: `grep -rn "data/seed" frontend/src/app frontend/src/components ; cd frontend && pnpm build`
Expected: no source imports of `data/seed`; build succeeds.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/data/seed
git commit -m "chore(web): park original static data as JSON reference"
```

---

## Task 14: Final verification pass

- [ ] **Step 1: Backend tests green**

Run: `cd backend && pnpm test`
Expected: all suites pass.

- [ ] **Step 2: Frontend typecheck + build green**

Run: `cd frontend && pnpm typecheck && pnpm build`
Expected: both succeed.

- [ ] **Step 3: Manual smoke of the full Phase-1 loop** (API + web running, seeded DB, ADMIN account):
  1. Visit `/programmes`, `/espaces`, `/agenda` → content loads from API.
  2. Submit an enrollment on a programme and a booking on an espace.
  3. In `/admin` → Demandes → both appear → change one to ACCEPTED → persists on reload.
  4. In `/admin` → Agenda → create an event → appears on public `/agenda`.

- [ ] **Step 4: Final commit / branch ready for review**

```bash
git add -A
git commit -m "chore: phase 1 foundation complete" --allow-empty
```

---

## Self-Review (completed by plan author)

**Spec coverage:**
- Universal Request system (one table + `details` JSON, types reserved) → Tasks 1–5. ✓
- No-account submit, nullable `userId` hook → Task 1 (`userId String?`), Task 5 (`req.user?.id`). ✓
- Save-only, no email → service has no email call. ✓
- Real forms replacing fake links → Tasks 7–9. ✓
- Wire frontend→API, fresh per request (`cache: 'no-store'`) → Tasks 6,8,9,10; discrepancy with existing `revalidate:300` flagged. ✓
- Pages wired: programmes, espaces, agenda (home/magazine/disciplines/vetrinart already wired — noted, not re-done). ✓
- Admin editing for Requests/Articles/Events/Programmes → Tasks 11–12; backend endpoints confirmed pre-existing. ✓
- Espaces/disciplines/team stay in code → not given editors. ✓
- Fake data parked as JSON, not consumed, no fallback → Task 13. ✓
- Verification via tests + manual flow → Tasks 3, 11(Step4), 12(Step3), 14. ✓

**Placeholder scan:** No TBD/TODO. Two intentional "verify-then-decide" branches (Articles create `authorId`; exact relation fields) are framed as explicit verification steps with a defined fallback, not open-ended placeholders.

**Type consistency:** `RequestType`/`RequestStatus` string unions match the Prisma enums and the DTO `as const` arrays. `submitRequest`/`listRequests`/`updateRequest` signatures used in Tasks 11 match their definitions in Task 6. `RESOURCES` keys (`articles|events|programmes`) match the dashboard section union in Task 12.

**Known assumption:** a reachable PostgreSQL DB with seeded content is needed for the manual "renders from API" steps. Task 1 Step 5 covers the migrate/generate split if no DB is present; seeding existing content (via `packages/db/prisma/seed.ts`) may be a useful precursor but is out of this plan's stated scope.
