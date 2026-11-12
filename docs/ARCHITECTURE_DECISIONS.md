# Architecture Decision Records (ADRs) — Sri Lanka Local Services Finder

**Status:** Approved & Living Documentation  
**Date:** 12 November 2026 (Updated per Authoritative Directive)  
**Reference:** `ANTIGRAVITY_V1_VERCEL_V2_VULTR_PLAN.md`, `PROJECT_BLUEPRINT.md`, `AGENTS.md`

---

## Index of Architecture Decisions

- [ADR-001: Staged Hosting Strategy — V1 Vercel Testing → V2 Vultr Production](#adr-001-staged-hosting-strategy--v1-vercel-testing--v2-vultr-production)
- [ADR-002: Managed Database, Auth & Geospatial — Supabase (Singapore)](#adr-002-managed-database-auth--geospatial--supabase-singapore)
- [ADR-003: Storage Abstraction — Supabase Storage (V1) → Vultr S3 (V2)](#adr-003-storage-abstraction--supabase-storage-v1--vultr-s3-v2)
- [ADR-004: Runtime Portability & Standard Node.js Architecture](#adr-004-runtime-portability--standard-nodejs-architecture)
- [ADR-005: Authorization, RBAC & Business Memberships](#adr-005-authorization-rbac--business-memberships)
- [ADR-006: Separation of Public Discovery and Sensitive Identity/Customer Data](#adr-006-separation-of-public-discovery-and-sensitive-identitycustomer-data)
- [ADR-007: Geospatial Proximity Search with PostGIS](#adr-007-geospatial-proximity-search-with-postgis)
- [ADR-008: Lead Lifecycle State Machine & Review Eligibility](#adr-008-lead-lifecycle-state-machine--review-eligibility)
- [ADR-009: Multilingual Data Model & Localization Strategy](#adr-009-multilingual-data-model--localization-strategy)
- [ADR-010: V2 Containerization, GHCR & Caddy Reverse Proxy](#adr-010-v2-containerization-ghcr--caddy-reverse-proxy)

---

## ADR-001: Staged Hosting Strategy — V1 Vercel Testing → V2 Vultr Production

### Context
To validate the product quickly, we need instant preview deployments, git-based CI, and frictionless testing without prematurely spending developer time or Vultr promotional credits on infrastructure setup. However, the commercial production target remains Vultr Cloud Compute in Singapore to optimize recurring compute costs.

### Decision
Adopt a two-stage hosting lifecycle:
1. **V1 (Build, Preview & Test):** Deploy the Next.js App Router application to **Vercel** via GitHub integration. Use Supabase for database, authentication, and file storage. Docker is **not** used during V1.
2. **V2 (Production Migration):** Migrate the application container to **Vultr Cloud Compute** in Singapore (`sgp`, minimum 2 GB RAM) orchestrated with Docker Compose and Caddy. Supabase remains the managed database/auth provider.

### Consequences
- **Positive:** Immediate velocity for product features, responsive design review, and user journey testing. Preserves Vultr promotional credits until full production launch.
- **Rule:** Vercel is strictly a test/preview host. Core application code must avoid Vercel-proprietary primitives to ensure zero-friction migration in V2.

---

## ADR-002: Managed Database, Auth & Geospatial — Supabase (Singapore)

### Context
The platform requires relational integrity, PostGIS spatial queries, cookie-based SSR authentication, and Row Level Security. Self-hosting PostgreSQL on the application VM adds operational overhead and memory contention.

### Decision
Use Supabase managed services in Singapore (`ap-southeast-1`):
- PostgreSQL 15+ with PostGIS in the `extensions` schema.
- Supabase Auth using `@supabase/ssr` (cookie-based SSR session management).
- Managed Supabase remains constant across both V1 (Vercel) and V2 (Vultr).

### Consequences
- **Positive:** Low latency to Sri Lanka (~40–60ms); consistent database state regardless of web host; zero database migration overhead during V1 → V2 transition.

---

## ADR-003: Storage Abstraction — Supabase Storage (V1) → Vultr S3 (V2)

### Context
V1 requires rapid setup without external S3 credentials. V2 requires cost-effective S3 storage on Vultr Object Storage. Business logic must not depend directly on either provider's SDK.

### Decision
Define a provider-neutral `StorageService` interface in `src/lib/storage/`:
- **V1 Implementation:** `SupabaseStorageService` utilizing `@supabase/supabase-js` storage API (`provider-public` and `private-documents` buckets).
- **V2 Implementation:** `VultrS3StorageService` utilizing `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` against `https://sgp1.vultrobjects.com`.
- **Switch Mechanism:** Controlled via `STORAGE_PROVIDER=supabase` (V1) and `STORAGE_PROVIDER=vultr-s3` (V2).

---

## ADR-004: Runtime Portability & Standard Node.js Architecture

### Context
Code deployed to Vercel must not become trapped in Vercel-specific runtime semantics.

### Decision
- Target standard Node.js runtime for all Server Components, Server Actions, and Route Handlers.
- Prohibit Vercel-proprietary packages (`@vercel/blob`, `@vercel/kv`, `@vercel/postgres`, `@vercel/edge-config`).
- Prohibit Edge Runtime for core business logic.
- Ensure `pnpm build` creates a standard standalone output when `output: "standalone"` is toggled for V2.

---

## ADR-005: Authorization, RBAC & Business Memberships

### Context
Users can hold multiple roles (customer, provider owner, provider staff, verifier, administrator).

### Decision
- Identity is rooted in `auth.users`, mirrored to `public.profiles`.
- System roles are stored in `public.user_roles` (`customer`, `moderator`, `verifier`, `admin`, `super_admin`).
- Provider business access is governed by `public.business_members` (`owner`, `staff` with granular JSONB permissions).
- Double-layer enforcement: Server-side TypeScript checks + PostgreSQL Row Level Security (RLS) on all queries.

---

## ADR-006: Separation of Public Discovery and Sensitive Identity/Customer Data

### Context
Public search must display approved business profiles while safeguarding customer contact information, private verification documents, and audit logs.

### Decision
- Public endpoints query only active approved records and return public-safe fields.
- Verification evidence is isolated in private buckets and restricted tables, accessible only via short-lived (5-minute) presigned URLs after admin role verification.
- Exact customer coordinates and phone numbers are stored only on specific `leads` records.
- Sole-proprietor residential coordinates are never published; only approximate town/coverage is visible.

---

## ADR-007: Geospatial Proximity Search with PostGIS

### Context
Customers search for providers by location hierarchy (district, town) or geographic proximity.

### Decision
- Centroids and operating locations are stored as `GEOGRAPHY(Point, 4326)` with spatial GiST indexes.
- Distance queries execute via PostgreSQL RPC `search_providers_geo` using `ST_DWithin` and `ST_Distance`.
- Manual fallback to administrative hierarchy (Province -> District -> Town) operates without requiring browser location permissions.

---

## ADR-008: Lead Lifecycle State Machine & Review Eligibility

### Context
To prevent fake reviews, customer reviews must be strictly tied to completed service requests.

### Decision
- Lead status follows a strict finite state machine:
  `new` -> `viewed` -> `contacted` -> `quoted` -> `accepted` -> `in_progress` -> `completed`
- Every transition is immutably logged in `lead_status_events`.
- Reviews are permitted **only** by the initiating customer on a `completed` lead, enforced via `UNIQUE(lead_id)`.

---

## ADR-009: Multilingual Data Model & Localization Strategy

### Context
The platform must serve English (`en`), Sinhala (`si`), and Tamil (`ta`).

### Decision
- Database taxonomy tables (`service_categories`, `provinces`, `districts`, `localities`) include translated columns (`name_en`, `name_si`, `name_ta`).
- UI copy is extracted into structured locale dictionary files (`src/i18n/{en,si,ta}.json`).
- User locale preference is persisted in `profiles.preferred_locale` and a `NEXT_LOCALE` cookie.

---

## ADR-010: V2 Containerization, GHCR & Caddy Reverse Proxy

### Context
When migrating to V2 production, reproducible builds and zero-downtime deployment are required.

### Decision
- GitHub Actions builds a multi-stage Docker image on merge to `main`, tags it with the immutable commit SHA, and pushes to GHCR.
- The Vultr VM pulls the exact immutable SHA image and runs it behind Caddy reverse proxy via Docker Compose.
- Caddy provides automatic TLS (Let's Encrypt / ZeroSSL) and security headers.
