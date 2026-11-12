# Commercial Pilot Launch Readiness Checklist

**Product:** Sri Lanka Local Services Finder (`LocalServices.lk`)  
**Target Milestone:** M6 (Reviews, Notifications & Pilot Readiness)  
**Date:** November 2026

---

## 1. Hosting & Infrastructure Verification

- [x] **Vercel Hosting:** Next.js App Router deployed with strict TypeScript and server-side Zod validation.
- [x] **Database Host:** Supabase PostgreSQL located in Singapore (`ap-southeast-1`), with PostGIS enabled in `extensions` schema.
- [x] **Object Storage:** Provider-neutral `StorageProvider` interface implemented with `VultrS3StorageProvider` (Singapore `sgp1`) and `SupabaseStorageProvider` fallback.
- [x] **Direct Browser Uploads:** Large files bypass Vercel function payload limits by uploading directly to presigned PUT URLs.
- [x] **Zero VPS / Compute:** Zero Docker, zero Caddy, zero self-hosted servers provisioned for MVP, maintaining lowest operating overhead.
- [ ] **Custom Domain & TLS:** Point production DNS CNAME / A records to Vercel and verify automatic Let's Encrypt SSL issuance.

---

## 2. Security, RLS & Access Control

- [x] **Row Level Security (RLS):** Enabled and enforced on all 16 database tables (`businesses`, `leads`, `lead_status_events`, `reviews`, `verification_submissions`, `favourites`, etc.).
- [x] **Server-Side Authorization:** Admin endpoints (`/admin/*` and `/api/v1/admin/*`) require administrative role verification; never rely on client-side state.
- [x] **Private Document Security:** Verification documents (NIC, BR certificates) stored in private bucket with short-lived (5-min) presigned GET URLs for reviewer examination only.
- [x] **Secrets Hygiene:** All sensitive API keys (`SUPABASE_SERVICE_ROLE_KEY`, `VULTR_S3_SECRET_KEY`) strictly server-only; never prefixed with `NEXT_PUBLIC_`.
- [x] **Verified Review Protection:** Customer reviews permitted strictly for completed leads (`UNIQUE(lead_id)`), preventing fake or competitor-manipulated reviews.

---

## 3. Performance, SEO & PWA Standards

- [x] **Search Engine Optimization:** `sitemap.ts` and `robots.ts` configured for automatic Google and Bing indexing.
- [x] **Progressive Web App (PWA):** `manifest.ts` configured with mobile icons and standalone display mode for smartphone users in Sri Lanka.
- [x] **Responsive Mobile First:** Touch-friendly tap targets (minimum 44x44px) on dial buttons, WhatsApp links, and category filters.
- [x] **WCAG 2.2 AA Accessibility:** High contrast text colors, accessible form labels, keyboard navigable modals, and unescaped entity hygiene.

---

## 4. Spend Control & Billing Guardrails

- [ ] **Vercel Spend Alerts:** Configure email alerts at 50%, 75%, and 90% of included bandwidth and serverless function executions.
- [ ] **Supabase Quota Monitors:** Set alerts for database storage, egress, and active connection limits.
- [ ] **Vultr Credit Validation:** Confirm promotional credits cover the $18/month subscription prior to enabling `STORAGE_PROVIDER=vultr`; fallback to Supabase Storage if unconfirmed.

---

## 5. Backup & Disaster Recovery Rehearsal

- [ ] **Automated Daily Backups:** Verify Supabase automated point-in-time recovery (PITR) or daily snapshot backup schedule.
- [ ] **Manual Dump Verification:** Run `pg_dump` test from Supabase to verify schema and seed consistency.
- [ ] **Rollback Procedure:** Test reverting git deployment commit via Vercel dashboard instant rollback feature.

---

## 6. Sri Lankan Regulatory Compliance

- [x] **Personal Data Protection Act (PDPA No. 9 of 2022):** Documented lawful processing grounds, customer enquiry consent, and data subject access/erasure pathways.
- [x] **Multilingual Taxonomy:** Category names, district names, and town taxonomy provided in English, Sinhala (සිංහල), and Tamil (தமிழ்).
- [x] **Telecom Number Format:** Sri Lankan mobile prefixes (070, 071, 072, 074, 075, 076, 077, 078) and E.164 (+94) international formats supported.
