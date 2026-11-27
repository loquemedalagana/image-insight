# image-insight

[![CI](https://github.com/loquemedalagana/image-insight/actions/workflows/ci.yml/badge.svg?branch=develop)](https://github.com/loquemedalagana/image-insight/actions/workflows/ci.yml)

[한국어](README.md) | English

<p align="center"><img src="docs/cat.png" width="200" alt="Pixel art of a brown tabby cat" /></p>

A full-stack personal project on Next.js 15 that extracts image information and EXIF from local JPG files, serves it through a GraphQL API, and shows it in a gallery with a category filter.

| Item | Details |
| --- | --- |
| Role | Solo developer. I wrote the schema, API, metadata extraction logic, UI, tests and Docker setup myself |
| Period | 2025-01 to 2025-02 development (82 commits, written without AI tools) / 2026-11 maintenance: test recovery, CI, dependency and security updates, schema cleanup (with Claude Code) |
| Core stack | TypeScript, Next.js 15 (App Router), React 19, Apollo Server and Client (GraphQL), graphql-codegen, sharp, exifr, Jest, Docker |
| Status | Local prototype. Not deployed, no operations, no authentication. Storage is an in-memory mockDB |

| Gallery | Category filter (gray-tabby) |
| --- | --- |
| ![Gallery](docs/screenshot-gallery.jpg) | ![Category filter (gray-tabby)](docs/screenshot-filter.jpg) |

---

## Implemented

- **Metadata extraction**: walks the JPG files under `public/samples` recursively, reads size and format with sharp and EXIF (camera, lens, exposure, capture time, resolution and so on) with exifr, and merges them into one record. The folder name becomes the category.
- **GraphQL API** (`/api/graphql`)
  - Query: `metadata` (filter by category and file name), `metadataById`, `getCategoryList`, `getCategoryById`
  - Mutation: `addMetadata`, `addCategory`, `deleteMetadataById`
  - Every Query and Mutation field in the schema has a resolver, and a test checks this.
  - `addMetadata` only accepts file paths inside the sample folder.
- **DB init endpoint** (`/api/init-db`): loads the extracted metadata into the store
- **Gallery page**: queries with Apollo Client in a server component, category filter driven by the URL query, masonry list
- **Tests and CI**: 19 Jest tests (GraphQL API, schema and resolver match, path validation, DB init, extraction pipeline, EXIF parsing). GitHub Actions runs lint and tests
- **Docker/Compose** development environment

## Planned (not implemented)

These items have no code, or only a skeleton.

- Using MongoDB as the real store (only adapter code exists; see the tech stack section)
- NeRF preprocessing (it used to exist only as schema definitions without resolvers; removed from the schema in 2026-11)
- EXIF-based calibration (`calibrationUtils.ts` is a skeleton)
- RAW formats such as CR3 (WebAssembly)
- Face recognition (face-api.js), in-browser image classification (TensorFlow.js)
- Cloud storage (Backblaze B2 or Wasabi)
- Person relationship data (Neo4j)
- WebGPU/WebGL image preprocessing
- Upload UI, thumbnails, pagination

---

## Tech stack

Based on `package.json` and the actual imports.

| Area | Technology | Notes |
| --- | --- | --- |
| Language | TypeScript 5 | strict mode |
| Framework | Next.js 15.5 (App Router), React 19 | API served by Route Handlers |
| API | Apollo Server 5, `@as-integrations/next`, GraphQL 16 | `/api/graphql` |
| Client | Apollo Client 3 | queried from a server component |
| Type generation | graphql-codegen | schema → `src/__generated__/graphql.ts` |
| Image processing | sharp 0.35, exifr 7 | size and format, EXIF |
| Storage | in-memory mockDB (the default, and the only store actually used) | reset on server restart |
| Storage (incomplete) | mongodb 6 driver | see below |
| Styling | Tailwind CSS 3 | |
| Testing | Jest 29 + ts-jest (ESM mode) | |
| Environment | Docker (node:22), Docker Compose, GitHub Actions (Node 22) | |

**MongoDB adapter status**: [`src/lib/mongoDB.ts`](src/lib/mongoDB.ts) and [`src/lib/databaseManager.ts`](src/lib/databaseManager.ts) contain a branch that uses MongoDB when `USE_MONGO_DB=true`. However, the code checks whether a connection exists before it ever tries to connect, so the connection never starts and everything falls back to mockDB. The GraphQL resolvers also call mockDB directly instead of going through `databaseManager`. For these reasons MongoDB is listed as incomplete, not supported.

---

## Architecture

```mermaid
flowchart LR
    B[Browser] --> P["page.tsx<br/>server component"]
    P -->|"1. GET"| I["/api/init-db"]
    P -->|"2. Apollo Client query"| G["/api/graphql<br/>Apollo Server"]
    G --> R[resolvers]
    R --> M[("mockDB<br/>in memory")]
    I --> DM[databaseManager]
    DM --> M
    DM -.->|"not connected yet"| MG[("MongoDB")]

    subgraph EX["Metadata extraction pipeline"]
        direction LR
        W["walkDirAsync<br/>async generator"] --> E[extractPhotoMetadata]
        E --> S["sharp<br/>size, format"]
        E --> X["exifr<br/>EXIF"]
    end

    I --> EX
    G -->|"once at server start"| EX
    F[("public/samples<br/>sample images")] --> W

    classDef client fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a
    classDef api fill:#dcfce7,stroke:#16a34a,color:#14532d
    classDef store fill:#fef3c7,stroke:#d97706,color:#78350f
    classDef pipe fill:#f3e8ff,stroke:#9333ea,color:#581c87
    classDef planned fill:#f3f4f6,stroke:#9ca3af,color:#4b5563,stroke-dasharray:4 3

    class B,P client
    class I,G,R,DM api
    class M,F store
    class W,E,S,X pipe
    class MG planned
```

1. When the page renders, it first calls `/api/init-db`, which loads the metadata of the sample folder into the store.
2. It then queries the category list and the metadata with Apollo Client. The filter passes the `categoryName` URL query straight through as `searchCondition`.
3. The resolvers read from mockDB and return the records that match.

---

## Getting started

### 0. Clone

```bash
git clone https://github.com/loquemedalagana/image-insight.git
cd image-insight
```

The sample images are regular files in the repository, so a plain clone is enough. Git LFS is not needed. The tests do not read the sample folder; they use small test-only images in `tests/fixtures`.

The samples are 50 cat photos I took myself (about 16MB). The folders `together`, `gray-tabby` and `brown-tabby` become the categories. For publishing, the long edge was reduced to 2000px, and camera and lens serial numbers and XMP were removed. Camera and lens model, exposure, capture date and the copyright notice were kept.

### 1. Run locally

Node.js 22 is recommended (`.nvmrc`). It runs on 20.9 or later.

```bash
npm ci
npm run dev
```

The gallery is at `http://localhost:3000` and the GraphQL endpoint is at `http://localhost:3000/api/graphql`. The page calls its own API at `http://localhost:3000`. Set `NEXT_PUBLIC_BASE_URL` only when you run it on a different port or host.

### 2. Run with Docker

```bash
docker compose up --build
```

Without Compose:

```bash
docker build -t image-insight .
docker run -p 3000:3000 image-insight
```

### 3. Tests, lint, codegen

```bash
npm test          # 19 Jest tests (uses tests/fixtures)
npm run lint      # ESLint
npm run codegen   # types.graphql → src/__generated__/graphql.ts
npm run build     # production build
```

---

## Design notes

**1. GraphQL: schema-first design and checks**

- **Schema first, with codegen**: [`types.graphql`](src/graphql/schema/types.graphql) is the single source. [`codegen.yml`](codegen.yml) generates the server types and client documents into [`src/__generated__/graphql.ts`](src/__generated__/graphql.ts). The resolvers, mockDB and UI components share the same `Metadata` and `Category` types, so a schema change shows up at compile time wherever it matters.
- **A test keeps the schema and resolvers in sync**: [`schema-resolvers.test.ts`](tests/api/schema-resolvers.test.ts) parses the schema, collects the Query and Mutation field names, and compares them with the keys of [`resolvers`](src/graphql/resolvers/index.ts). A field without a resolver just returns `null` and is easy to miss, so changing only one side now fails the test.
- **Input path validation**: the file path passed to `addMetadata` goes through [`resolveSamplePath`](src/utils/fileUtils.ts), which rejects paths outside the sample folder (`../`, absolute paths elsewhere, missing files). [`graphql.test.ts`](tests/api/graphql.test.ts) covers the accepted and rejected cases.

The next two are one-line Apollo Server settings in [`server.ts`](src/app/api/graphql/server.ts).

- **Introspection by environment**: schema introspection is allowed only when `NODE_ENV` is not `production`. This states Apollo Server's default behavior explicitly (it used to be always on). It is off under `next start`, and on in the dev server and in Docker, which runs in development mode.
- **csrfPrevention**: Apollo Server's default (on), stated explicitly. There is no cookie-based authentication, so the CSRF risk is low today; the setting is there for when authentication is added.

**2. Directory traversal with async generators**
`getAllImagesAsync` in [`fileUtils.ts`](src/utils/fileUtils.ts) and `walkDirAsync` in [`extractMetadataFromLocal.ts`](src/lib/extractMetadataFromLocal.ts) recurse into subfolders with `yield*` and emit one file at a time. Files are processed one by one with `for await` instead of building the full path list first, and a file that fails is logged and skipped.

**3. Handling files without EXIF**
[`processExif.ts`](src/lib/processExif.ts) returns a `{ message }` object instead of throwing when a file has no EXIF or parsing fails. When EXIF exists, each field gets a default so the response shape stays the same. For a file without EXIF, [`metadataUtils.ts`](src/utils/metadataUtils.ts) stores `exif` as `null`, which matches the nullable `exif` in the schema. Both cases are covered with fixture images in [`processExif.test.ts`](tests/lib/processExif.test.ts) and [`graphql.test.ts`](tests/api/graphql.test.ts).

**4. Docker to pin the Node version**
At the time, my local machine ran Node 22 and the assumed target environment ran Node 18, so the [`Dockerfile`](Dockerfile) and [`docker-compose.yml`](docker-compose.yml) pin the runtime. The image was moved to `node:22` in the 2026-11 dependency update. Source is mounted as a volume, and `node_modules` stays inside the container.

---

## Limitations and next steps

- This repository has no deployment or operations. It has only run locally and in the Docker dev environment.
- There is no authentication or authorization. The `addMetadata` path is limited to the sample folder, but anyone can call the mutations, so authentication has to come before any public exposure.
- There is no query depth or complexity limit.
- There is no DataLoader (N+1 prevention).
- There is no structured logging or monitoring, only `console.log`.
- Storage is an in-memory mockDB, so data is lost on restart. The MongoDB adapter is incomplete.
- Resolvers call mockDB directly, so there are two data paths: the resolvers and the `databaseManager` abstraction.
- Tests focus on server-side logic. There are no component tests or E2E tests.
- There is no pagination. The GraphQL schema has no paging arguments, and the page reads `page` and `limit` from the URL but does not pass them to the API.
- The 2000px samples are served as is. There are no thumbnails.
- `npm audit` still reports transitive dependency warnings from a development tool (the graphql-codegen 5 line). The major upgrade changes the shape of the generated types, so it is on hold. One item can only be resolved by moving to Next.js 16.

If I pick this up again, the order would be: (1) route the resolvers through `databaseManager` and fix the MongoDB connection flow, (2) thumbnails and pagination, (3) authentication.

---

## Development log

| When | What | Tools |
| --- | --- | --- |
| 2025-01 to 2025-02 | All design and implementation. 82 commits | Solo, no AI tools |
| 2026-11 | Maintenance (table below) | Claude Code |

The 2026-11 maintenance work:

| Step | What was done |
| --- | --- |
| [PR #1](https://github.com/loquemedalagana/image-insight/pull/1) | Recovered the broken tests (4 of 9 failing → all passing), fixed the lint config, added CI, rewrote the README, replaced the sample images |
| [PR #2](https://github.com/loquemedalagana/image-insight/pull/2) | Dependency and security updates (Next.js 15.5, Apollo Server 5, sharp 0.35), move to Node 22, removal of unused dependencies |
| [PR #3](https://github.com/loquemedalagana/image-insight/pull/3) | README screenshots |
| [PR #4](https://github.com/loquemedalagana/image-insight/pull/4) | Removed schema items without resolvers, implemented `getCategoryById`, added the schema and resolver match test, environment-based introspection, path validation for `addMetadata`, a fix for the error on files without EXIF |

In this maintenance work, the split between me and the AI tool was as follows.

**Decisions I made**

- Scope: no new features; only make sure nothing breaks when someone clones the repository and runs the tests
- Keeping tests independent of the sample folder and Git LFS with separate fixtures
- Dropping Git LFS once the samples were small, and storing them as regular files (so a plain clone shows the gallery)
- Separating implemented and planned items in the README, and removing technologies that are not in the code from the stack
- Unifying the repository, package and Docker names as `image-insight`
- Recording the original code and the AI-assisted work separately
- Reviewing the retrospective (`retrospect.md`) and the handling of sample images myself instead of letting them be changed automatically
- Removing photos of people from the samples and using only cat photos, removing device serial numbers and keeping the copyright notice
- Staying on Next.js 15 and applying security patches only, and putting the breaking major upgrade (codegen 8) on hold
- Removing schema items without resolvers, and enforcing the match with a test so it cannot drift again

**Work done by Claude Code** (reviewed before merging)

- Diagnosing the test failures: no `jest` global in ESM mode, sharp failing on samples that were still Git LFS pointer files at the time, and a failure-case test that never reached its spy because of module state
- Generating synthetic fixture images with sharp ([`tests/fixtures/generate.mjs`](tests/fixtures/generate.mjs)) and pointing the tests at them
- Fixing the ESLint config error and cleaning up `any` types (no behavior change), and fixing the `searchParams` type for Next.js 15
- Writing the GitHub Actions workflow
- Drafting the README, and confirming that the MongoDB code never actually runs
- Running the EXIF privacy check on the sample images and summarizing the result, then resizing the samples and removing serial numbers
- Fixing the first GraphQL response being empty right after server start
- Updating dependencies and reducing `npm audit` findings (80 → 30), and checking for unused dependencies
- Cleaning up the schema, writing `getCategoryById` and the schema and resolver match test, and proposing and implementing path validation for `addMetadata`

The original retrospective from 2025 is in [`retrospect.md`](retrospect.md) (Korean).
