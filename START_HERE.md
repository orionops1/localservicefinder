# Start Here — Antigravity Workspace

This is the finalized, cost-first infrastructure and product blueprint for the Sri Lanka Local Services Finder.

## Approved hosting decision

- Production app: Vultr Cloud Compute, Singapore, Docker Compose + Caddy.
- Database/Auth/geo: Supabase PostgreSQL + Auth + PostGIS, Singapore.
- Files: Vultr Object Storage, Singapore, S3-compatible `StorageService` adapter.
- CI/CD: GitHub Actions + GitHub Container Registry.
- DNS: Cloudflare DNS; enable proxy only after testing.
- Vercel: optional future paid migration target, not required for MVP.

## Files to read first

1. `AGENTS.md` — persistent engineering and security rules.
2. `PROJECT_BLUEPRINT.md` — product scope, modules, data model, APIs and M0–M8 milestones.
3. `docs/INFRASTRUCTURE_DECISION.md` — approved infrastructure and cost guardrails.
4. `docs/DEPLOYMENT_RUNBOOK.md` — production deployment, security, backup and rollback.
5. `ANTIGRAVITY_FIRST_PROMPT.md` — paste this into Antigravity for the first planning task.

## First development session

1. Create a private GitHub repository and put this folder's contents at its root.
2. Open the repository in Antigravity.
3. Paste the complete contents of `ANTIGRAVITY_FIRST_PROMPT.md` as the first instruction.
4. Ask Antigravity to inspect and create its implementation plan, then stop for review.
5. Approve M0 only after reviewing the plan.

## Important account-owner actions

- Check Vultr credit balance, expiration and eligible products before provisioning anything.
- Create service accounts and enter real secrets directly into provider dashboards or the protected server environment.
- Do not paste production secrets into Antigravity chat or commit them to GitHub.
- Do not launch a public pilot on Supabase Free. Upgrade production to a paid plan with backups before real customers rely on it.

The Dockerfile, Compose and Caddy files in this package are starter templates. Antigravity must validate them against the actual generated Next.js project, current Node.js LTS, health endpoint and chosen GitHub workflow before production use.
