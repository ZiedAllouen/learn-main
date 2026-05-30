# BSMK / Vitrinart Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the existing NestJS backend run correctly, then extend it with the BSMK/Vitrinart vision (Sectors+colors, Artists/Vitrinart, Media), with seed + tests.

**Architecture:** Keep the NestJS 11 + Prisma 6 + Postgres 17 monorepo. Stage 0 finalizes the Prisma schema + first migration (the spine every service imports). Then independent domain modules are added in parallel, each following the existing `module → controller → service → DTOs` pattern. Redis is removed.

**Tech Stack:** NestJS 11, Prisma 6, PostgreSQL 17, pnpm + Turbo, argon2, class-validator, Jest + ts-jest + supertest.

**Spec:** `docs/superpowers/specs/2026-05-30-bsmk-backend-design.md`

**Conventions (apply to every task):**
- Run all `pnpm` commands from repo root `/home/zal/Desktop/static_oai/learn-main`.
- Generate Prisma client: `pnpm --filter @bsmk/db db:generate`.
- Typecheck backend: `pnpm --filter @bsmk/api typecheck`.
- New modules copy the exact pattern in `backend/src/articles/` (module/controller/service/dto).
- Public reads: `@Public()`. Writes: `@Roles('ADMIN', ...)`. Both decorators already exist in `backend/src/common/decorators/`.
- `req.user` shape is `{ id, email, role }` (from `jwt.strategy.ts`).
- Commit after each task with the given message.

---

## STAGE 0 — Schema + migration (SEQUENTIAL, must finish before Stage 1)

### Task 0.1: Remove Redis

**Files:**
- Modify: `docker-compose.yml`
- Modify: `.env.example:5-6`

- [ ] **Step 1: Remove the redis service from `docker-compose.yml`**

Delete the entire `redis:` service block and the `redis_data:` volume entry. Final file:

```yaml
services:
  postgres:
    image: postgres:17-alpine
    restart: unless-stopped
    environment:
      POSTGRES_USER: bsmk
      POSTGRES_PASSWORD: bsmk_dev
      POSTGRES_DB: bsmk_dev
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U bsmk -d bsmk_dev']
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:
```

- [ ] **Step 2: Remove `REDIS_URL` from `.env.example`**

Delete these two lines:
```
# ── Redis ─────────────────────────────────────────────────────────────────────
REDIS_URL=redis://localhost:6379
```

- [ ] **Step 3: Commit**

```bash
git add docker-compose.yml .env.example
git commit -m "chore: remove unused Redis service and config"
```

---

### Task 0.2: Bring up Postgres and create `.env`

**Files:**
- Create: `.env` (repo root, gitignored)

- [ ] **Step 1: Start Postgres**

Run: `docker compose up -d postgres`
Expected: container starts; `docker compose ps` shows postgres healthy within ~15s.

- [ ] **Step 2: Create `.env` from the example**

Run: `cp .env.example .env`
Expected: `.env` exists. `DATABASE_URL=postgresql://bsmk:bsmk_dev@localhost:5432/bsmk_dev` is already correct for the Docker Postgres. (No commit — `.env` is gitignored.)

- [ ] **Step 3: Verify DB reachable**

Run: `docker compose exec postgres pg_isready -U bsmk -d bsmk_dev`
Expected: `... accepting connections`

---

### Task 0.3a: Add `MediaType` to shared types

**Files:**
- Modify: `packages/types/src/enums.ts`

This lives in Stage 0 (not Task D) so Stage 1 Task C can import it without a cross-task dependency.

- [ ] **Step 1: Append to `packages/types/src/enums.ts`:**

```typescript
export type MediaType = 'VIDEO' | 'PHOTO' | 'EDITO' | 'MAGAZINE' | 'PUBLICATION';
```

- [ ] **Step 2: Commit**

```bash
git add packages/types/src/enums.ts
git commit -m "feat(types): add MediaType union"
```

---

### Task 0.3: Edit the Prisma schema (Sectors, Artists, Media)

**Files:**
- Modify: `packages/db/prisma/schema.prisma`

- [ ] **Step 1: Add the `MediaType` enum** after the `EventType` enum block:

```prisma
enum MediaType {
  VIDEO
  PHOTO
  EDITO
  MAGAZINE
  PUBLICATION
}
```

- [ ] **Step 2: Add the `Sector` model** (place it just above the `Discipline` model, in the Taxonomy section):

```prisma
model Sector {
  id          String       @id @default(cuid())
  slug        String       @unique
  name        String
  color       String
  description String?
  sortOrder   Int          @default(0)

  disciplines Discipline[]

  @@map("sectors")
}
```

- [ ] **Step 3: Extend the `Discipline` model** — add `sectorId`, `sector`, `color`, and the two new join relations. The model becomes:

```prisma
model Discipline {
  id          String  @id @default(cuid())
  slug        String  @unique
  name        String
  description String?
  iconUrl     String?
  coverUrl    String?
  color       String?
  sortOrder   Int     @default(0)
  sectorId    String?

  sector   Sector?             @relation(fields: [sectorId], references: [id])
  articles ArticleDiscipline[]
  spaces   SpaceDiscipline[]
  programs ProgramDiscipline[]
  events   EventDiscipline[]
  artists  ArtistDiscipline[]
  media    MediaDiscipline[]

  @@map("disciplines")
}
```

- [ ] **Step 4: Add the `artist` back-relation to the `User` model.** In the `User` model's relation list (after `refreshTokens   RefreshToken[]`), add:

```prisma
  artist          Artist?
```

- [ ] **Step 5: Add the Artist models** (place in a new `// ── Artists (Vitrinart) ──` section, e.g. after the `TeamMember`/`Partner` section):

```prisma
model Artist {
  id           String        @id @default(cuid())
  slug         String        @unique
  name         String
  bio          String?
  statement    String?
  photoUrl     String?
  coverUrl     String?
  city         String?
  address      String?
  latitude     Float?
  longitude    Float?
  websiteUrl   String?
  instagramUrl String?
  email        String?
  status       ContentStatus @default(DRAFT)
  featured     Boolean       @default(false)
  userId       String?       @unique
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
  type        String?
  sortOrder   Int      @default(0)

  artist Artist @relation(fields: [artistId], references: [id], onDelete: Cascade)

  @@map("artist_works")
}

model ArtistDiscipline {
  artistId     String
  disciplineId String

  artist     Artist     @relation(fields: [artistId], references: [id], onDelete: Cascade)
  discipline Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)

  @@id([artistId, disciplineId])
  @@map("artist_disciplines")
}
```

- [ ] **Step 6: Add the Media models** (new `// ── Media ──` section):

```prisma
model Media {
  id           String        @id @default(cuid())
  slug         String        @unique
  title        String
  type         MediaType
  description  String?
  url          String?
  thumbnailUrl String?
  imageUrls    String[]
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

  media      Media      @relation(fields: [mediaId], references: [id], onDelete: Cascade)
  discipline Discipline @relation(fields: [disciplineId], references: [id], onDelete: Cascade)

  @@id([mediaId, disciplineId])
  @@map("media_disciplines")
}
```

- [ ] **Step 7: Validate the schema**

Run: `pnpm --filter @bsmk/db exec prisma validate`
Expected: `The schema at packages/db/prisma/schema.prisma is valid 🚀`

---

### Task 0.4: Create the first migration + generate client

**Files:**
- Create: `packages/db/prisma/migrations/*/migration.sql` (generated)

- [ ] **Step 1: Create + apply the migration**

Run: `pnpm --filter @bsmk/db exec prisma migrate dev --name init_plus_vision`
Expected: creates `packages/db/prisma/migrations/<timestamp>_init_plus_vision/`, applies it, and regenerates the client. Output ends with `✔ Generated Prisma Client`.

- [ ] **Step 2: Verify the client + backend typecheck**

Run: `pnpm --filter @bsmk/db typecheck && pnpm --filter @bsmk/api typecheck`
Expected: both pass with no errors (the new models now exist on the generated client; existing services still compile).

- [ ] **Step 3: Commit**

```bash
git add packages/db/prisma/schema.prisma packages/db/prisma/migrations
git commit -m "feat(db): add Sector, Artist, ArtistWork, Media models + first migration"
```

**GATE: Stage 0 must be fully green (typecheck passes) before any Stage 1 task starts.**

---

## STAGE 1 — Parallel modules (5 independent agents, disjoint files)

> Each Stage 1 task is self-contained and touches only its own files. None of them edit `app.module.ts` — wiring happens in Stage 2. All import the already-generated client from Task 0.4.

---

### Task A: `sectors` module

**Files:**
- Create: `backend/src/sectors/sectors.module.ts`
- Create: `backend/src/sectors/sectors.service.ts`
- Create: `backend/src/sectors/sectors.controller.ts`
- Create: `backend/src/sectors/dto/create-sector.dto.ts`
- Create: `backend/src/sectors/dto/update-sector.dto.ts`

- [ ] **Step 1: Create the service**

`backend/src/sectors/sectors.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateSectorDto } from './dto/create-sector.dto';
import type { UpdateSectorDto } from './dto/update-sector.dto';

@Injectable()
export class SectorsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.sector.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { disciplines: { select: { id: true, slug: true, name: true, color: true } } },
    });
  }

  async findOne(slug: string) {
    const sector = await this.prisma.sector.findUnique({
      where: { slug },
      include: { disciplines: true },
    });
    if (!sector) throw new NotFoundException('Sector not found');
    return sector;
  }

  create(dto: CreateSectorDto) {
    return this.prisma.sector.create({ data: dto });
  }

  async update(slug: string, dto: UpdateSectorDto) {
    await this.findOne(slug);
    return this.prisma.sector.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.sector.delete({ where: { slug } });
  }
}
```

- [ ] **Step 2: Create the DTOs**

`backend/src/sectors/dto/create-sector.dto.ts`:
```typescript
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateSectorDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsString()
  color: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}
```

`backend/src/sectors/dto/update-sector.dto.ts`:
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateSectorDto } from './create-sector.dto';

export class UpdateSectorDto extends PartialType(CreateSectorDto) {}
```

- [ ] **Step 3: Create the controller**

`backend/src/sectors/sectors.controller.ts`:
```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { CreateSectorDto } from './dto/create-sector.dto';
import { UpdateSectorDto } from './dto/update-sector.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('sectors')
export class SectorsController {
  constructor(private readonly sectors: SectorsService) {}

  @Public()
  @Get()
  findAll() {
    return this.sectors.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.sectors.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateSectorDto) {
    return this.sectors.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateSectorDto) {
    return this.sectors.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.sectors.remove(slug);
  }
}
```

- [ ] **Step 4: Create the module**

`backend/src/sectors/sectors.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { SectorsController } from './sectors.controller';

@Module({
  controllers: [SectorsController],
  providers: [SectorsService],
})
export class SectorsModule {}
```

- [ ] **Step 5: Typecheck**

Run: `pnpm --filter @bsmk/api typecheck`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add backend/src/sectors
git commit -m "feat(api): add sectors module with CRUD"
```

---

### Task B: `artists` module (Vitrinart)

**Files:**
- Create: `backend/src/artists/artists.module.ts`
- Create: `backend/src/artists/artists.service.ts`
- Create: `backend/src/artists/artists.controller.ts`
- Create: `backend/src/artists/dto/list-artists.dto.ts`
- Create: `backend/src/artists/dto/create-artist.dto.ts`
- Create: `backend/src/artists/dto/update-artist.dto.ts`

- [ ] **Step 1: Create the list DTO**

`backend/src/artists/dto/list-artists.dto.ts`:
```typescript
import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { ContentStatus } from '@bsmk/types';

export class ListArtistsDto {
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
  @IsString()
  discipline?: string;

  @IsOptional()
  @IsString()
  sector?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}
```

- [ ] **Step 2: Create the create/update DTOs**

`backend/src/artists/dto/create-artist.dto.ts`:
```typescript
import {
  IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsNumber, IsEmail, IsInt,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import type { ContentStatus } from '@bsmk/types';

export class ArtistWorkInput {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsInt()
  year?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsInt()
  sortOrder?: number;
}

export class CreateArtistDto {
  @IsString()
  slug: string;

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
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;

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

`backend/src/artists/dto/update-artist.dto.ts`:
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateArtistDto } from './create-artist.dto';

export class UpdateArtistDto extends PartialType(CreateArtistDto) {}
```

- [ ] **Step 3: Create the service**

`backend/src/artists/artists.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListArtistsDto } from './dto/list-artists.dto';
import type { CreateArtistDto } from './dto/create-artist.dto';
import type { UpdateArtistDto } from './dto/update-artist.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListArtistsDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, discipline, sector, city, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(city && { city }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
      ...(sector && { disciplines: { some: { discipline: { sector: { slug: sector } } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.artist.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { sortOrder: 'asc' }, { name: 'asc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
          works: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.artist.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { slug },
      include: {
        disciplines: { include: { discipline: true } },
        works: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  findMap() {
    return this.prisma.artist.findMany({
      where: { status: 'PUBLISHED', latitude: { not: null }, longitude: { not: null } },
      select: {
        id: true, slug: true, name: true, city: true, address: true,
        latitude: true, longitude: true, photoUrl: true,
      },
    });
  }

  create(dto: CreateArtistDto) {
    const { disciplineIds, works, ...rest } = dto;
    return this.prisma.artist.create({
      data: {
        ...rest,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
          : undefined,
        works: works?.length ? { create: works } : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateArtistDto) {
    const { disciplineIds, works, ...rest } = dto;
    await this.findOne(slug);
    return this.prisma.artist.update({
      where: { slug },
      data: {
        ...rest,
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId) => ({ disciplineId })) },
        }),
        ...(works !== undefined && {
          works: { deleteMany: {}, create: works },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.artist.delete({ where: { slug } });
  }
}
```

- [ ] **Step 4: Create the controller**

`backend/src/artists/artists.controller.ts`:
```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ListArtistsDto } from './dto/list-artists.dto';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

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

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.artists.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
  @Post()
  create(@Body() dto: CreateArtistDto) {
    return this.artists.create(dto);
  }

  @Roles('ADMIN', 'EDITOR', 'ARTIST')
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

> Note: `@Get('map')` is declared BEFORE `@Get(':slug')` so the literal route wins over the param route.

- [ ] **Step 5: Create the module**

`backend/src/artists/artists.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { ArtistsService } from './artists.service';
import { ArtistsController } from './artists.controller';

@Module({
  controllers: [ArtistsController],
  providers: [ArtistsService],
})
export class ArtistsModule {}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter @bsmk/api typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/src/artists
git commit -m "feat(api): add artists module (Vitrinart) with works + map endpoint"
```

---

### Task C: `media` module

**Files:**
- Create: `backend/src/media/media.module.ts`
- Create: `backend/src/media/media.service.ts`
- Create: `backend/src/media/media.controller.ts`
- Create: `backend/src/media/dto/list-media.dto.ts`
- Create: `backend/src/media/dto/create-media.dto.ts`
- Create: `backend/src/media/dto/update-media.dto.ts`

- [ ] **Step 1: Create the list DTO**

`backend/src/media/dto/list-media.dto.ts`:
```typescript
import { IsOptional, IsString, IsInt, Min, IsEnum, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import type { ContentStatus, MediaType } from '@bsmk/types';

export class ListMediaDto {
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
  @IsEnum(['VIDEO', 'PHOTO', 'EDITO', 'MAGAZINE', 'PUBLICATION'] satisfies MediaType[])
  type?: MediaType;

  @IsOptional()
  @IsString()
  discipline?: string;

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  featured?: boolean;
}
```

- [ ] **Step 2: Create the create/update DTOs**

`backend/src/media/dto/create-media.dto.ts`:
```typescript
import {
  IsString, IsOptional, IsEnum, IsBoolean, IsArray, IsDateString,
} from 'class-validator';
import type { ContentStatus, MediaType } from '@bsmk/types';

export class CreateMediaDto {
  @IsString()
  slug: string;

  @IsString()
  title: string;

  @IsEnum(['VIDEO', 'PHOTO', 'EDITO', 'MAGAZINE', 'PUBLICATION'] satisfies MediaType[])
  type: MediaType;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() url?: string;
  @IsOptional() @IsString() thumbnailUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imageUrls?: string[];

  @IsOptional()
  @IsEnum(['DRAFT', 'PUBLISHED', 'ARCHIVED'] satisfies ContentStatus[])
  status?: ContentStatus;

  @IsOptional() @IsBoolean() featured?: boolean;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  disciplineIds?: string[];
}
```

`backend/src/media/dto/update-media.dto.ts`:
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateMediaDto } from './create-media.dto';

export class UpdateMediaDto extends PartialType(CreateMediaDto) {}
```

- [ ] **Step 3: Create the service**

`backend/src/media/media.service.ts`:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { ListMediaDto } from './dto/list-media.dto';
import type { CreateMediaDto } from './dto/create-media.dto';
import type { UpdateMediaDto } from './dto/update-media.dto';
import type { PaginatedResult } from '@bsmk/types';

@Injectable()
export class MediaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(dto: ListMediaDto): Promise<PaginatedResult<unknown>> {
    const { page, pageSize, type, discipline, status, featured } = dto;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(status ? { status } : { status: 'PUBLISHED' as const }),
      ...(featured !== undefined && { featured }),
      ...(type && { type }),
      ...(discipline && { disciplines: { some: { discipline: { slug: discipline } } } }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.media.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: [{ featured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          disciplines: { include: { discipline: { select: { id: true, slug: true, name: true, color: true } } } },
        },
      }),
      this.prisma.media.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async findOne(slug: string) {
    const media = await this.prisma.media.findUnique({
      where: { slug },
      include: { disciplines: { include: { discipline: true } } },
    });
    if (!media) throw new NotFoundException('Media not found');
    return media;
  }

  create(dto: CreateMediaDto) {
    const { disciplineIds, publishedAt, ...rest } = dto;
    return this.prisma.media.create({
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        disciplines: disciplineIds?.length
          ? { create: disciplineIds.map((disciplineId) => ({ disciplineId })) }
          : undefined,
      },
    });
  }

  async update(slug: string, dto: UpdateMediaDto) {
    const { disciplineIds, publishedAt, ...rest } = dto;
    await this.findOne(slug);
    return this.prisma.media.update({
      where: { slug },
      data: {
        ...rest,
        publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        ...(disciplineIds !== undefined && {
          disciplines: { deleteMany: {}, create: disciplineIds.map((disciplineId) => ({ disciplineId })) },
        }),
      },
    });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.media.delete({ where: { slug } });
  }
}
```

- [ ] **Step 4: Create the controller**

`backend/src/media/media.controller.ts`:
```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { MediaService } from './media.service';
import { ListMediaDto } from './dto/list-media.dto';
import { CreateMediaDto } from './dto/create-media.dto';
import { UpdateMediaDto } from './dto/update-media.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('media')
export class MediaController {
  constructor(private readonly media: MediaService) {}

  @Public()
  @Get()
  findAll(@Query() dto: ListMediaDto) {
    return this.media.findAll(dto);
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.media.findOne(slug);
  }

  @Roles('ADMIN', 'EDITOR')
  @Post()
  create(@Body() dto: CreateMediaDto) {
    return this.media.create(dto);
  }

  @Roles('ADMIN', 'EDITOR')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateMediaDto) {
    return this.media.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.media.remove(slug);
  }
}
```

- [ ] **Step 5: Create the module**

`backend/src/media/media.module.ts`:
```typescript
import { Module } from '@nestjs/common';
import { MediaService } from './media.service';
import { MediaController } from './media.controller';

@Module({
  controllers: [MediaController],
  providers: [MediaService],
})
export class MediaModule {}
```

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter @bsmk/api typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/src/media
git commit -m "feat(api): add media module with type filtering"
```

---

### Task D: Extend disciplines (sector/color + admin CRUD) + rewrite seed

**Files:**
- Modify: `backend/src/disciplines/disciplines.service.ts`
- Modify: `backend/src/disciplines/disciplines.controller.ts`
- Create: `backend/src/disciplines/dto/create-discipline.dto.ts`
- Create: `backend/src/disciplines/dto/update-discipline.dto.ts`
- Modify: `packages/db/prisma/seed.ts`

> `MediaType` is added in Stage 0 (Task 0.3a), not here.

- [ ] **Step 1: Replace `disciplines.service.ts`** with sector/color in responses + CRUD:

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateDisciplineDto } from './dto/create-discipline.dto';
import type { UpdateDisciplineDto } from './dto/update-discipline.dto';

@Injectable()
export class DisciplinesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.discipline.findMany({
      orderBy: { sortOrder: 'asc' },
      include: { sector: { select: { id: true, slug: true, name: true, color: true } } },
    });
  }

  async findOne(slug: string) {
    const discipline = await this.prisma.discipline.findUnique({
      where: { slug },
      include: { sector: true },
    });
    if (!discipline) throw new NotFoundException('Discipline not found');
    return discipline;
  }

  create(dto: CreateDisciplineDto) {
    return this.prisma.discipline.create({ data: dto });
  }

  async update(slug: string, dto: UpdateDisciplineDto) {
    await this.findOne(slug);
    return this.prisma.discipline.update({ where: { slug }, data: dto });
  }

  async remove(slug: string) {
    await this.findOne(slug);
    await this.prisma.discipline.delete({ where: { slug } });
  }
}
```

- [ ] **Step 2: Create discipline DTOs**

`backend/src/disciplines/dto/create-discipline.dto.ts`:
```typescript
import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateDisciplineDto {
  @IsString()
  slug: string;

  @IsString()
  name: string;

  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() iconUrl?: string;
  @IsOptional() @IsString() coverUrl?: string;
  @IsOptional() @IsString() color?: string;
  @IsOptional() @IsString() sectorId?: string;
  @IsOptional() @IsInt() sortOrder?: number;
}
```

`backend/src/disciplines/dto/update-discipline.dto.ts`:
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateDisciplineDto } from './create-discipline.dto';

export class UpdateDisciplineDto extends PartialType(CreateDisciplineDto) {}
```

- [ ] **Step 3: Replace `disciplines.controller.ts`** to add CRUD (note: remove the class-level `@Public()` and put it per-route, since writes must be protected):

```typescript
import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { DisciplinesService } from './disciplines.service';
import { CreateDisciplineDto } from './dto/create-discipline.dto';
import { UpdateDisciplineDto } from './dto/update-discipline.dto';
import { Public } from '../common/decorators/public.decorator';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('disciplines')
export class DisciplinesController {
  constructor(private readonly disciplines: DisciplinesService) {}

  @Public()
  @Get()
  findAll() {
    return this.disciplines.findAll();
  }

  @Public()
  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.disciplines.findOne(slug);
  }

  @Roles('ADMIN')
  @Post()
  create(@Body() dto: CreateDisciplineDto) {
    return this.disciplines.create(dto);
  }

  @Roles('ADMIN')
  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() dto: UpdateDisciplineDto) {
    return this.disciplines.update(slug, dto);
  }

  @Roles('ADMIN')
  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.disciplines.remove(slug);
  }
}
```

- [ ] **Step 4: Rewrite `packages/db/prisma/seed.ts`** — argon2 admin + new sectors/disciplines + sample artists/media:

```typescript
import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const SECTORS = [
  { slug: 'arts-de-scene', name: 'Arts de scène', color: '#2D5F99' },
  { slug: 'evenements-expositions-festivals', name: 'Événements, expositions & festivals', color: '#C0392B' },
  { slug: 'medias', name: 'Médias', color: '#7A2E73' },
  { slug: 'sports-loisirs-alternatifs', name: 'Sports & loisirs alternatifs', color: '#5C8A3A' },
  { slug: 'consulting-accompagnement', name: 'Consulting & accompagnement artistiques', color: '#147070' },
  { slug: 'partenaires-communautes', name: 'Partenaires & communautés', color: '#C99A2E' },
  { slug: 'showroom-recyclage', name: 'Showroom et recyclage', color: '#8A8F7A' },
];

// Disciplines use a nude/pastel palette and map to a sector by slug.
const DISCIPLINES = [
  { slug: 'musique-production', name: 'Musique & Production', color: '#D8C3A5', sector: 'arts-de-scene' },
  { slug: 'danse-mouvement', name: 'Danse & Mouvement', color: '#E0D2BE', sector: 'arts-de-scene' },
  { slug: 'theatre-arts-vivants', name: 'Théâtre & Arts vivants', color: '#CDBBA0', sector: 'arts-de-scene' },
  { slug: 'arts-visuels', name: 'Street Art & Arts Visuels', color: '#C9C2B0', sector: 'evenements-expositions-festivals' },
  { slug: 'cinema-audiovisuel', name: 'Cinéma & Audiovisuel', color: '#BFB39A', sector: 'medias' },
  { slug: 'medias', name: 'Médias', color: '#B7AE9C', sector: 'medias' },
  { slug: 'arts-numeriques-gaming', name: 'Arts Numériques & Gaming', color: '#C7BEAA', sector: 'medias' },
  { slug: 'mode-design', name: 'Mode & Design', color: '#D2C0A8', sector: 'showroom-recyclage' },
  { slug: 'sport-culture-urbaine', name: 'Sport & Culture Urbaine', color: '#C6CBB6', sector: 'sports-loisirs-alternatifs' },
];

async function main() {
  // Sectors
  for (const [i, s] of SECTORS.entries()) {
    await prisma.sector.upsert({
      where: { slug: s.slug },
      update: { name: s.name, color: s.color, sortOrder: i },
      create: { ...s, sortOrder: i },
    });
  }

  // Disciplines (linked to sectors)
  for (const [i, d] of DISCIPLINES.entries()) {
    const sector = await prisma.sector.findUnique({ where: { slug: d.sector } });
    await prisma.discipline.upsert({
      where: { slug: d.slug },
      update: { name: d.name, color: d.color, sectorId: sector?.id, sortOrder: i },
      create: { slug: d.slug, name: d.name, color: d.color, sectorId: sector?.id, sortOrder: i },
    });
  }

  // Audience types
  for (const a of [
    { slug: 'jeunes', name: 'Jeunes (12-25 ans)' },
    { slug: 'adultes', name: 'Adultes' },
    { slug: 'professionnels', name: 'Professionnels' },
    { slug: 'tout-public', name: 'Tout public' },
  ]) {
    await prisma.audienceType.upsert({ where: { slug: a.slug }, update: {}, create: a });
  }

  // Program types
  for (const p of [
    { slug: 'formation', name: 'Formation' },
    { slug: 'residency', name: 'Résidence artistique' },
    { slug: 'workshop', name: 'Atelier' },
    { slug: 'mentoring', name: 'Mentorat' },
  ]) {
    await prisma.programType.upsert({ where: { slug: p.slug }, update: {}, create: p });
  }

  // Admin user — argon2 hash of "changeme123". CHANGE THIS PASSWORD AFTER FIRST LOGIN.
  const passwordHash = await argon2.hash('changeme123');
  await prisma.user.upsert({
    where: { email: 'admin@bsmk.tn' },
    update: { passwordHash },
    create: {
      email: 'admin@bsmk.tn',
      passwordHash,
      role: 'ADMIN',
      firstName: 'Admin',
      lastName: 'BSMK',
    },
  });

  // Sample artists (Vitrinart) — linked to disciplines, with works + geo
  const artVisuels = await prisma.discipline.findUnique({ where: { slug: 'arts-visuels' } });
  const modeDesign = await prisma.discipline.findUnique({ where: { slug: 'mode-design' } });

  const sampleArtists = [
    {
      slug: 'amira-ben-salah', name: 'Amira Ben Salah', city: 'Tunis',
      bio: 'Artiste muraliste tunisoise.', status: 'PUBLISHED' as const, featured: true,
      latitude: 36.8065, longitude: 10.1815, disciplineId: artVisuels?.id,
      works: [{ title: 'Fresque Medina', type: 'mural', year: 2024 }],
    },
    {
      slug: 'karim-designer', name: 'Karim Designer', city: 'Sfax',
      bio: 'Designer objet et mobilier.', status: 'PUBLISHED' as const, featured: false,
      latitude: 34.7406, longitude: 10.7603, disciplineId: modeDesign?.id,
      works: [{ title: 'Collection Sahel', type: 'produit', year: 2025 }],
    },
  ];

  for (const [i, a] of sampleArtists.entries()) {
    const { disciplineId, works, ...rest } = a;
    await prisma.artist.upsert({
      where: { slug: a.slug },
      update: {},
      create: {
        ...rest,
        sortOrder: i,
        disciplines: disciplineId ? { create: [{ disciplineId }] } : undefined,
        works: { create: works },
      },
    });
  }

  // Sample media
  const sampleMedia = [
    { slug: 'video-presentation-bsmk', title: 'Présentation BSMK', type: 'VIDEO' as const, status: 'PUBLISHED' as const, featured: true, url: 'https://example.com/video', disciplineSlug: 'medias' },
    { slug: 'galerie-vernissage-2025', title: 'Vernissage 2025', type: 'PHOTO' as const, status: 'PUBLISHED' as const, featured: false, disciplineSlug: 'arts-visuels' },
  ];

  for (const m of sampleMedia) {
    const { disciplineSlug, ...rest } = m;
    const disc = await prisma.discipline.findUnique({ where: { slug: disciplineSlug } });
    await prisma.media.upsert({
      where: { slug: m.slug },
      update: {},
      create: {
        ...rest,
        publishedAt: new Date('2025-01-01'),
        disciplines: disc ? { create: [{ disciplineId: disc.id }] } : undefined,
      },
    });
  }

  // Site stats
  for (const s of [
    { key: 'artists_count', value: '150' },
    { key: 'programs_count', value: '24' },
    { key: 'spaces_count', value: '10' },
    { key: 'events_per_year', value: '80' },
  ]) {
    await prisma.siteStat.upsert({ where: { key: s.key }, update: { value: s.value }, create: s });
  }

  console.log('✓ Seed complete — admin@bsmk.tn / changeme123 (CHANGE THIS)');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

> The seed `import * as argon2` requires argon2 resolvable from `packages/db`. It is a backend dep; if `ts-node` cannot resolve it from the db package, add `"argon2": "^0.44.0"` to `packages/db/package.json` devDependencies and run `pnpm install` (do this in Step 5 if the run fails).

- [ ] **Step 5: Run the seed against the live DB**

Run: `pnpm --filter @bsmk/db db:seed`
Expected: `✓ Seed complete — admin@bsmk.tn / changeme123 (CHANGE THIS)`. If it errors on `Cannot find module 'argon2'`, add argon2 to `packages/db/package.json`, `pnpm install`, and re-run.

- [ ] **Step 6: Typecheck**

Run: `pnpm --filter @bsmk/api typecheck && pnpm --filter @bsmk/db typecheck`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add backend/src/disciplines packages/db/prisma/seed.ts packages/db/package.json
git commit -m "feat: disciplines sector/color + CRUD, rewritten seed (argon2, new vision)"
```

---

### Task E: Test toolchain + tests

**Files:**
- Modify: `backend/package.json` (add jest config + devDeps)
- Create: `backend/test/jest-e2e.json`
- Create: `backend/src/auth/auth.service.spec.ts`
- Create: `backend/src/sectors/sectors.service.spec.ts`
- Create: `backend/test/app.e2e-spec.ts`

> **Dependency note:** This task references `SectorsService` from Task A. If executed before Task A merges, write only the auth spec + e2e in this task and add the sectors spec after Task A lands. The toolchain setup (Steps 1-3) has no dependency and can run anytime after Stage 0.

- [ ] **Step 1: Install the test toolchain**

Run: `pnpm --filter @bsmk/api add -D jest@^29 ts-jest@^29 @types/jest@^29 supertest@^7 @types/supertest@^6`
Expected: packages added to `backend/package.json` devDependencies; lockfile updated.

- [ ] **Step 2: Add the Jest config to `backend/package.json`.** Add this top-level `"jest"` key (sibling of `"scripts"`):

```json
  "jest": {
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": "src",
    "testRegex": ".*\\.spec\\.ts$",
    "transform": { "^.+\\.(t|j)s$": "ts-jest" },
    "collectCoverageFrom": ["**/*.(t|j)s"],
    "coverageDirectory": "../coverage",
    "testEnvironment": "node",
    "moduleNameMapper": {
      "^@bsmk/db$": "<rootDir>/../../packages/db/src/index.ts",
      "^@bsmk/types$": "<rootDir>/../../packages/types/src/index.ts"
    }
  }
```

Also update the test scripts in `"scripts"`:
```json
    "test": "jest",
    "test:e2e": "jest --config ./test/jest-e2e.json"
```

- [ ] **Step 3: Create the e2e Jest config**

`backend/test/jest-e2e.json`:
```json
{
  "moduleFileExtensions": ["js", "json", "ts"],
  "rootDir": ".",
  "testEnvironment": "node",
  "testRegex": ".e2e-spec.ts$",
  "transform": { "^.+\\.(t|j)s$": "ts-jest" },
  "moduleNameMapper": {
    "^@bsmk/db$": "<rootDir>/../../packages/db/src/index.ts",
    "^@bsmk/types$": "<rootDir>/../../packages/types/src/index.ts",
    "^src/(.*)$": "<rootDir>/../src/$1"
  }
}
```

- [ ] **Step 4: Write the auth service unit test (mocked Prisma)**

`backend/src/auth/auth.service.spec.ts`:
```typescript
import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException, ConflictException } from '@nestjs/common';
import * as argon2 from 'argon2';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: {
    user: { findUnique: jest.Mock; create: jest.Mock };
    refreshToken: { create: jest.Mock };
  };

  beforeEach(async () => {
    prisma = {
      user: { findUnique: jest.fn(), create: jest.fn() },
      refreshToken: { create: jest.fn().mockResolvedValue({}) },
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('signed.jwt') } },
      ],
    }).compile();
    service = moduleRef.get(AuthService);
  });

  it('rejects login with unknown email', async () => {
    prisma.user.findUnique.mockResolvedValue(null);
    await expect(service.login({ email: 'x@y.z', password: 'pw' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('rejects login with wrong password', async () => {
    const hash = await argon2.hash('correct-password');
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'x@y.z', role: 'USER', passwordHash: hash });
    await expect(service.login({ email: 'x@y.z', password: 'wrong-password' }))
      .rejects.toBeInstanceOf(UnauthorizedException);
  });

  it('issues tokens on valid login', async () => {
    const hash = await argon2.hash('correct-password');
    prisma.user.findUnique.mockResolvedValue({ id: '1', email: 'x@y.z', role: 'USER', passwordHash: hash });
    const result = await service.login({ email: 'x@y.z', password: 'correct-password' });
    expect(result.accessToken).toBe('signed.jwt');
    expect(typeof result.refreshToken).toBe('string');
  });

  it('rejects register when email exists', async () => {
    prisma.user.findUnique.mockResolvedValue({ id: '1' });
    await expect(service.register({ email: 'x@y.z', password: 'password8' }))
      .rejects.toBeInstanceOf(ConflictException);
  });
});
```

- [ ] **Step 5: Run the auth test to verify it passes**

Run: `pnpm --filter @bsmk/api test -- auth.service`
Expected: 4 passing tests.

- [ ] **Step 6: Write the sectors service unit test** (only after Task A has merged)

`backend/src/sectors/sectors.service.spec.ts`:
```typescript
import { Test } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { SectorsService } from './sectors.service';
import { PrismaService } from '../prisma/prisma.service';

describe('SectorsService', () => {
  let service: SectorsService;
  let prisma: { sector: { findMany: jest.Mock; findUnique: jest.Mock } };

  beforeEach(async () => {
    prisma = { sector: { findMany: jest.fn(), findUnique: jest.fn() } };
    const moduleRef = await Test.createTestingModule({
      providers: [SectorsService, { provide: PrismaService, useValue: prisma }],
    }).compile();
    service = moduleRef.get(SectorsService);
  });

  it('returns all sectors ordered by sortOrder', async () => {
    prisma.sector.findMany.mockResolvedValue([{ slug: 'a' }]);
    const result = await service.findAll();
    expect(result).toEqual([{ slug: 'a' }]);
    expect(prisma.sector.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { sortOrder: 'asc' } }),
    );
  });

  it('throws NotFound for missing slug', async () => {
    prisma.sector.findUnique.mockResolvedValue(null);
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });
});
```

- [ ] **Step 7: Write the e2e smoke test**

`backend/test/app.e2e-spec.ts`:
```typescript
import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('App (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /api/health → 200 ok', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => { expect(res.body.status).toBe('ok'); });
  });

  it('GET /api/sectors → 200 array (public)', () => {
    return request(app.getHttpServer())
      .get('/api/sectors')
      .expect(200)
      .expect((res) => { expect(Array.isArray(res.body)).toBe(true); });
  });

  it('POST /api/sectors without auth → 401', () => {
    return request(app.getHttpServer())
      .post('/api/sectors')
      .send({ slug: 'x', name: 'X', color: '#000' })
      .expect(401);
  });
});
```

- [ ] **Step 8: Run the e2e tests** (requires DB up from Task 0.2 + seed from Task D; the sectors route requires Task A merged + registered in Stage 2 — if app.module isn't wired yet, run only after Stage 2)

Run: `pnpm --filter @bsmk/api test:e2e`
Expected: health + sectors tests pass.

- [ ] **Step 9: Commit**

```bash
git add backend/package.json backend/test backend/src/auth/auth.service.spec.ts backend/src/sectors/sectors.service.spec.ts pnpm-lock.yaml
git commit -m "test: add Jest toolchain + auth/sectors unit tests + e2e smoke tests"
```

---

## STAGE 2 — Integration (SEQUENTIAL, integrator only)

### Task 2.1: Register new modules in `app.module.ts`

**Files:**
- Modify: `backend/src/app.module.ts`

- [ ] **Step 1: Add imports + register the three new modules.** Add to the import list:

```typescript
import { SectorsModule } from './sectors/sectors.module';
import { ArtistsModule } from './artists/artists.module';
import { MediaModule } from './media/media.module';
```

And add `SectorsModule, ArtistsModule, MediaModule` to the `imports: [...]` array (after `NewsletterModule`).

- [ ] **Step 2: Full typecheck**

Run: `pnpm --filter @bsmk/api typecheck`
Expected: PASS.

- [ ] **Step 3: Commit**

```bash
git add backend/src/app.module.ts
git commit -m "feat(api): register sectors, artists, media modules"
```

---

### Task 2.2: Full verification

- [ ] **Step 1: Run all unit tests**

Run: `pnpm --filter @bsmk/api test`
Expected: all suites pass (auth + sectors).

- [ ] **Step 2: Run e2e tests**

Run: `pnpm --filter @bsmk/api test:e2e`
Expected: health + sectors public/auth tests pass.

- [ ] **Step 3: Boot the API and smoke-test live endpoints**

Run (in one shell): `pnpm --filter @bsmk/api dev` — wait for `🚀 API running at http://localhost:3001/api`.
Then in another shell:
```bash
curl -s http://localhost:3001/api/health
curl -s http://localhost:3001/api/sectors | head -c 400
curl -s "http://localhost:3001/api/artists?pageSize=5" | head -c 400
curl -s http://localhost:3001/api/artists/map | head -c 400
curl -s "http://localhost:3001/api/media?type=VIDEO" | head -c 400
curl -s http://localhost:3001/api/disciplines | head -c 400
```
Expected: health returns ok; sectors returns 7 seeded sectors with colors; artists returns the 2 seeded artists (paginated shape); map returns geo points; media returns the seeded VIDEO; disciplines include `sector` + `color`. Stop the dev server (Ctrl-C) when done.

- [ ] **Step 4: Verify auth login works (the seed bug fix)**

```bash
curl -s -X POST http://localhost:3001/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@bsmk.tn","password":"changeme123"}'
```
Expected: JSON with `accessToken` + `refreshToken` (proves the argon2 seed fix works).

- [ ] **Step 5: Final commit (if any fixes were needed)**

```bash
git add -A
git commit -m "fix: integration adjustments for sectors/artists/media"
```

---

## Self-Review Notes

- **Spec coverage:** Sector+color (Task 0.3, A, D-seed) ✓; Discipline sector/pastel (0.3, D) ✓; Artist/Vitrinart + works + geo/cartographie (0.3, B) ✓; Media + 5 types, Médias at both levels (0.3, C, D-seed) ✓; argon2 seed fix (D) ✓; first migration (0.4) ✓; Redis removal (0.1) ✓; tests from zero (E) ✓. Deferred items (R2/Resend/Turnstile, frontend, login/logo design, label renames) intentionally excluded per spec §7.
- **Type consistency:** `MediaType` union is added in **Stage 0 (Task 0.3a)** so all Stage 1 tasks (incl. Task C's DTOs) can import it with no cross-task dependency. All service method names (`findAll/findOne/findMap/create/update/remove`) consistent across controller/service pairs. `ContentStatus` enum values used in DTOs match `@bsmk/types`.
- **Known sequencing (the only intra-Stage-1 dependency):** Task E Steps 6 & 8 reference `SectorsService` (Task A) and the registered sectors route (Stage 2) — both called out inline in Task E. Everything else in Stage 1 is fully independent.
