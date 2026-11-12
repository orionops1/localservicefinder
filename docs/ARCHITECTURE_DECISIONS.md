# Architecture Decision Records (ADRs) — Sri Lanka Local Services Finder

**Status:** Authoritative Living Architecture Documentation  
**Date:** 12 November 2026 (Updated per `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md`)  
**Reference:** `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md`, `PROJECT_BLUEPRINT.md`, `AGENTS.md`

---

## Index of Architecture Decisions

- [ADR-001: Application Hosting — Vercel App Router Baseline](#adr-001-application-hosting--vercel-app-router-baseline)
- [ADR-002: Managed Database, Auth & Geospatial — Supabase (Singapore)](#adr-002-managed-database-auth--geospatial--supabase-singapore)
- [ADR-003: File Storage Strategy — Vultr Object Storage with Supabase Fallback](#adr-003-file-storage-strategy--vultr-object-storage-with-supabase-fallback)
- [ADR-004: Direct Presigned Storage Upload Pipeline](#adr-004-direct-presigned-storage-upload-pipeline)
- [ADR-005: Authorization, RBAC & Multi-Tenant Business Memberships](#adr-005-authorization-rbac--multi-tenant-business-memberships)
- [ADR-006: Data Separation & Privacy (Public Commercial vs. Private Verification)](#adr-006-data-separation--privacy-public-commercial-vs-private-verification)
- [ADR-007: Geospatial Proximity Search with PostGIS](#adr-007-geospatial-proximity-search-with-postgis)
- [ADR-008: Lead Lifecycle State Machine & Review Eligibility](#adr-008-lead-lifecycle-state-machine--review-eligibility)
- [ADR-009: Multilingual Data Model & Localization Strategy (EN/SI/TA)](#adr-009-multilingual-data-model--localization-strategy-ensita)
- [ADR-010: Git-Integrated Deployment Workflow on Vercel](#adr-010-git-integrated-deployment-workflow-on-vercel)

---

## ADR-001: Application Hosting — Vercel App Router Baseline

### Context
Previous documents proposed deploying on Vultr Cloud Compute via Docker Compose and Caddy. The project owner has approved a simpler, serverless-first hosting model to eliminate server maintenance, OS patching, and container orchestration overhead.

### Decision
Deploy the Next.js App Router application exclusively to **Vercel** for all environments (development previews and commercial production).
- No Vultr Cloud Compute instances or VPS.
- No Docker, Docker Compose, Caddy, Nginx, or Kubernetes.
- No self-hosted database or Redis instances.

### Consequences
- **Positive:** Instant preview deployments on pull requests, automatic global CDN edge caching, zero server operations overhead.
- **Rule:** Vercel Hobby is permitted only for non-commercial development. When real customers begin using the platform, upgrade to an appropriate Vercel commercial plan (e.g. Pro at ~$20/mo).

---

## ADR-002: Managed Database, Auth & Geospatial — Supabase (Singapore)

### Context
The platform requires a reliable relational database, PostGIS spatial queries, cookie-based SSR authentication, and Row Level Security (RLS).

### Decision
Use **Supabase** in the Singapore region (`ap-southeast-1`):
- PostgreSQL 15+ with `postgis` enabled in `extensions` schema.
- Supabase Auth using `@supabase/ssr` (cookie-based session management).
- Row Level Security (RLS) enabled on all exposed tables.

### Consequences
- **Positive:** Low latency to Sri Lanka (~40–60ms); managed backups and connection pooling; strict data isolation at the PostgreSQL layer.

---

## ADR-003: File Storage Strategy — Vultr Object Storage with Supabase Fallback

### Context
Application assets include public photos (business logos, portfolio samples) and private verification documents (NICs, business registrations). The owner has promotional credits on Vultr.

### Decision
Implement a provider-neutral `StorageProvider` interface:
```ts
export interface StorageProvider {
  createUploadUrl(input: CreateUploadUrlInput): Promise<UploadUrlResult>;
  createDownloadUrl(input: CreateDownloadUrlInput): Promise<DownloadUrlResult>;
  deleteObject(input: DeleteObjectInput): Promise<void>;
  getObjectMetadata(input: GetObjectMetadataInput): Promise<ObjectMetadata | null>;
}
```
- **Primary:** `VultrS3StorageProvider` connecting to Vultr S3-compatible Object Storage in Singapore (`https://sgp1.vultrobjects.com`), activated **only** when the owner confirms promotional credits cover the Standard $18/mo subscription.
- **Fallback:** `SupabaseStorageProvider` connecting to Supabase Storage if Vultr credits are not confirmed or until volume justifies the dedicated subscription.
- Selection is controlled strictly via server-side environment variable `STORAGE_PROVIDER=vultr` or `STORAGE_PROVIDER=supabase`.

---

## ADR-004: Direct Presigned Storage Upload Pipeline

### Context
Vercel serverless functions have execution timeouts and payload size limits (4.5 MB request body limit). Uploading large images directly to Vercel functions would risk failures and unnecessary bandwidth consumption.

### Decision
1. Client requests an upload ticket from a Next.js server route (`/api/v1/provider/media` or `/api/v1/provider/verifications`).
2. Server validates auth, user permissions, MIME allowlist, and size limits.
3. Server generates a random UUID object key and a short-lived (5-minute) presigned PUT URL.
4. Browser uploads binary bytes **directly** to the object store over HTTPS.
5. Client calls completion route; server checks object existence via `HeadObject` and persists metadata into Supabase.

---

## ADR-005: Authorization, RBAC & Multi-Tenant Business Memberships

### Context
Users may be customers, provider owners, invited staff members, or platform operators.

### Decision
- Identity is rooted in `auth.users`, linked 1:1 to `public.profiles`.
- System roles are stored in `public.user_roles` (`customer`, `moderator`, `verifier`, `admin`).
- Provider business access is managed in `public.business_members` (`owner`, `staff` with granular JSONB permissions).
- Double-layer enforcement: TypeScript server checks + PostgreSQL Row Level Security (RLS).

---

## ADR-006: Data Separation & Privacy (Public Commercial vs. Private Verification)

### Context
National Identity Cards (NICs), passports, private residential coordinates, and customer enquiry messages must be shielded from unauthorized disclosure, complying with the Sri Lanka Personal Data Protection Act No. 9 of 2022.

### Decision
- Public search surfaces only approved provider listings, business descriptions, services, and coverage localities.
- Verification evidence is isolated in private buckets (`lsf-private-files`), accessible strictly via 5-minute presigned GET URLs after administrator role validation.
- Customer phone numbers and message text in `leads` are accessible only to the customer and assigned provider.
- Individual tradespersons' home addresses and exact GPS coordinates are never published; only locality names and approximate distance are surfaced.

---

## ADR-007: Geospatial Proximity Search with PostGIS

### Context
Customers search for providers by administrative area (district, town) or geographic distance.

### Decision
- Centroids and operating bases are stored as `GEOGRAPHY(Point, 4326)` with spatial GiST indexes.
- Distance queries execute via PostgreSQL RPC `search_providers_geo` using `ST_DWithin` and `ST_Distance`.
- Administrative hierarchy (Province -> District -> Town) operates without requiring browser location permissions.

---

## ADR-008: Lead Lifecycle State Machine & Review Eligibility

### Context
Marketplace trust depends on authentic reviews tied to real transactions.

### Decision
- Lead status follows a strict finite state machine:
  `new` -> `viewed` -> `contacted` -> `quoted` -> `accepted` -> `in_progress` -> `completed`
- Every transition is immutably logged in `lead_status_events`.
- Reviews are permitted **only** by the initiating customer on a `completed` lead, enforced by `UNIQUE(lead_id)`.

---

## ADR-009: Multilingual Data Model & Localization Strategy (EN/SI/TA)

### Context
Sri Lanka has three official/working languages: English, Sinhala, and Tamil.

### Decision
- Database taxonomy tables (`service_categories`, `provinces`, `districts`, `localities`) include translated columns (`name_en`, `name_si`, `name_ta`).
- UI copy is managed via structured locale files.
- User preference is stored in `profiles.preferred_locale` and a cookie.

---

## ADR-010: Git-Integrated Deployment Workflow on Vercel

### Context
Predictable CI/CD without maintaining self-hosted build runners.

### Decision
- GitHub repository connects directly to Vercel.
- Pull requests automatically generate Vercel Preview deployments.
- Merges to `main` deploy to Vercel Production.
- Pre-merge checks enforce `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build`.
