# Antigravity Workspace Instructions — Sri Lanka Local Services Finder

## Source of truth
Read `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md` before changing infrastructure, deployment, storage or environment configuration. It is the authoritative current architecture and supersedes older documents that refer to moving the application to Vultr Compute, Docker Compose, Caddy or Kubernetes.

Read `PROJECT_BLUEPRINT.md` for product scope and functional requirements, but ignore any hosting/deployment/storage passages that conflict with the current architecture directive.

## Approved architecture
- Next.js + React + TypeScript application hosted on Vercel.
- Supabase PostgreSQL, PostGIS and Supabase Auth.
- Vultr Object Storage only for binary files if the owner confirms promotional credits cover the subscription; otherwise use Supabase Storage until the switch is justified.
- GitHub connected to Vercel for deployments.
- Keep file storage behind a provider-neutral `StorageProvider` interface.

## Explicitly prohibited for the current plan
- Do not provision Vultr Compute or any VPS/server.
- Do not create or recommend Kubernetes clusters.
- Do not add Docker, Docker Compose, Caddy, Nginx, Redis, self-hosted PostgreSQL or microservices as MVP requirements.
- Do not add Vercel Blob or another paid storage product without owner approval.

## Engineering rules
- Inspect the repository and current Git state before edits. Preserve working code.
- Use strict TypeScript, server-side validation (Zod), reviewed SQL migrations, Supabase RLS and tests.
- Use current supported Supabase SSR packages (`@supabase/ssr` and `@supabase/supabase-js`); do not use deprecated auth helpers.
- Keep secrets server-only. Never put service-role or Vultr access/secret keys in `NEXT_PUBLIC_*` variables.
- Never write user uploads to the Vercel function filesystem.
- Large files upload directly from the browser to object storage using short-lived, narrowly scoped presigned URLs created by an authenticated server route.
- Keep public approved media separate from private identity/qualification documents. Private downloads require server authorization and short-lived URLs.
- Store file metadata and ownership in Supabase, not binary files.
- Avoid Vercel-only products in core business logic. Core app must remain portable to standard Node.js hosting, but do not build Docker deployment now.
- Use separate Development, Preview and Production environment variables.
- Never fabricate providers, ratings, reviews, addresses, verification results or business data.

## Delivery approach
Build one milestone at a time according to the acceptance gates in the architecture directive. Start by inspecting the repository and proposing M0. Do not generate the whole application in one pass. Do not provision paid resources, change account plans, or consume credits without owner approval. Report actual test/deployment results accurately.
