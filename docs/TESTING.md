# Testing Strategy & Quality Gates — Sri Lanka Local Services Finder

**Status:** Living Documentation & Test Strategy  
**Date:** 12 November 2026  
**Reference:** `ANTIGRAVITY_V1_VERCEL_V2_VULTR_PLAN.md`, `PROJECT_BLUEPRINT.md`

---

## 1. Testing Philosophy & Standards

To ensure trust, reliability, and security in the marketplace, testing is integrated into every milestone:
1. **Server-Side Security First:** We test Row Level Security (RLS) policies and server-side authorization boundaries, ensuring client UI cannot bypass access control.
2. **Deterministic & Fast:** Unit and integration tests run quickly in local environments and CI pipelines without requiring long-running external mock servers.
3. **Traceable Journeys:** Playwright tests cover core end-to-end paths (search -> enquiry -> lead update -> completed lead review).
4. **No Flaky Tests:** No arbitrary timeouts or sleep statements; use deterministic event waits.

---

## 2. Test Commands Matrix

| Test Suite | Command | Purpose | When to Run |
|---|---|---|---|
| **Linting** | `pnpm lint` | Enforce code style, formatting, and import hygiene | Pre-commit / CI |
| **Type Checking** | `pnpm typecheck` | Enforce strict TypeScript types and zero `any` leaks | Pre-commit / CI |
| **Unit Tests** | `pnpm test` | Test schemas, utilities, state machines, and helpers | Active development |
| **RLS / DB Integration** | `pnpm test:integration` | Test Supabase RLS policies and database constraints | M1+ milestone completion |
| **End-to-End (E2E)** | `pnpm test:e2e` | Playwright tests for customer, provider, and admin journeys | M2+ release gates |
| **Production Build** | `pnpm build` | Validate Next.js production compilation | Milestone completion / CI |

---

## 3. Scope by Test Tier

### 3.1 Unit Testing
- **Validation Schemas:** Zod schemas for user profiles, provider onboarding, enquiry requests, and review submissions.
- **State Machine Transitions:** Validate permitted lead state transitions (`new` -> `viewed` -> `contacted` -> `quoted` -> `accepted` -> `in_progress` -> `completed`) and reject invalid transitions.
- **Utility Functions:** Phone number normalizer (Sri Lankan local / E.164 formats), price range checks, and distance formatters.

### 3.2 Integration Testing
- **Supabase Row Level Security (RLS):**
  - Verify anonymous users can only read approved businesses.
  - Verify customers cannot read other customers' leads or personal details.
  - Verify provider owners cannot access or update businesses they do not belong to.
  - Verify verifiers and admins can read private verification evidence.
- **Storage Adapter Contract:**
  - Verify `StorageService` interface works identically across `SupabaseStorageService` and `VultrS3StorageService`.
  - Validate presigned URL generation, expiry timestamps, and metadata recording.
- **PostGIS Proximity Queries:**
  - Verify `search_providers_geo` returns providers within specified radii (e.g., 5 km, 15 km) and filters inactive providers.

### 3.3 End-to-End Testing (Playwright)
1. **Customer Journey:** Search plumber in Galle -> filter by rating -> view profile -> submit enquiry -> track lead status in customer account.
2. **Provider Journey:** Register via wizard -> complete profile -> upload photos -> view incoming enquiry -> advance lead status to `completed`.
3. **Admin Journey:** Access admin portal -> review pending provider application -> inspect verification documents -> approve provider -> verify public listing appears.
4. **Security Boundary:** Non-admin attempts to access `/admin` -> redirected / HTTP 403 Forbidden.

---

## 4. Test Verification Log

| Date | Milestone | Tests Run | Result | Notes |
|---|---|---|---|---|
| 12 Nov 2026 | Pre-M0 | Tooling verification | Pass | Node `v26.3.0`, pnpm `12.11.2`, git `2.54.0` verified. |
| 12 Nov 2026 | M0 | Health probe & Env Parser | Pass | 2 files, 4 tests passed in 330ms. Build succeeded. |
| 12 Nov 2026 | M1 & M2 | Taxonomy & Search Discovery | Pass | 4 files, 17 tests passed in 331ms. 10/10 routes compiled. |
| 12 Nov 2026 | M3 | Storage Subsystem & Provider Portal | Pass | 6 files, 34 tests passed in 662ms. 19/19 routes compiled. |
| 12 Nov 2026 | M4 | Enquiries, Lead FSM & Customer Accounts | Pass | 7 files, 40 tests passed in 651ms. 25/25 routes compiled. |
