# Start Here — Sri Lanka Local Services Finder

## Current architecture decision

**Vercel hosts the application. Supabase provides database, authentication and geospatial search. Vultr is used only for Object Storage if existing credits are confirmed to cover it.**

No Vultr Compute, VPS, Kubernetes, Docker, Docker Compose, Caddy or Nginx is required. Do not follow older documents that describe a Vultr Compute production migration.

## Files to read in order

1. `AGENTS.md` — persistent Antigravity workspace rules.
2. `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md` — authoritative architecture, security, storage design and development gates.
3. `PROJECT_BLUEPRINT.md` — product requirements and feature scope; ignore older hosting/storage sections that conflict with the current architecture directive.
4. `ANTIGRAVITY_FIRST_PROMPT.md` — initial prompt for Antigravity.

## First steps

1. Extract this package into the project repository.
2. Open the repository in Antigravity.
3. Paste the contents of `ANTIGRAVITY_FIRST_PROMPT.md` as the first instruction.
4. Ask Antigravity to inspect the repository and present an M0 plan.
5. Review the plan; proceed with M0 only.

## Cost warning

Vultr Object Storage Standard is currently listed at US$18/month. Do not provision it until the owner verifies that promotional credits cover the subscription. For a small test, Supabase Storage's Free allowance may be sufficient. Vercel Hobby is for personal/non-commercial use; use an appropriate commercial plan before commercial production.
