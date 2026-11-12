# Antigravity — First Project Prompt

Read `AGENTS.md`, `PROJECT_BLUEPRINT.md`, `docs/INFRASTRUCTURE_DECISION.md` and `docs/DEPLOYMENT_RUNBOOK.md` completely before proceeding.

The final hosting decision is:
- Production application: Vultr Cloud Compute in Singapore, Docker Compose + Caddy.
- Database/authentication/geospatial: Supabase PostgreSQL + Auth + PostGIS in Singapore.
- File storage: Vultr Object Storage in Singapore through an S3-compatible `StorageService` adapter.
- CI/CD: GitHub Actions + GitHub Container Registry.
- DNS: Cloudflare, with proxy/WAF enabled only after testing.
- Vercel: optional future paid hosting target, not the production baseline. Never use Hobby for this commercial product.

Do not generate the entire platform in one operation. Do not provision cloud services or spend credits. Do not ask for or invent production credentials.

First inspect the current workspace and report:

1. Existing files, branches, dependencies and project status.
2. Any existing application code or assets that should be preserved.
3. A phased implementation plan mapped to M0–M8 in `PROJECT_BLUEPRINT.md`.
4. The first database migration sequence and the tables that need RLS from day one.
5. The authentication, role and business-membership permission model.
6. The separation between public provider data and private identity/customer data.
7. How Supabase PostGIS will support nearby search.
8. The `StorageService` interface, Vultr bucket strategy, upload confirmation and private download flow.
9. The Docker standalone build, Docker Compose, Caddy, GitHub Actions and Vultr deployment plan.
10. Development, staging and production environment variables; clearly separate public build-time variables from server-only runtime secrets.
11. Backup, restore, monitoring, security and rollback strategy.
12. Risks, dependencies and decisions that genuinely block M0.

Create or update:

- `docs/IMPLEMENTATION_PLAN.md`
- `docs/ARCHITECTURE_DECISIONS.md`
- `docs/SECURITY.md`
- `docs/DATABASE.md`
- `docs/INFRASTRUCTURE_DECISION.md` (do not contradict the approved decisions)
- `docs/DEPLOYMENT_RUNBOOK.md`

Then stop and present the plan for review. Do not start feature implementation yet. Do not create fake providers, fake reviews, real user accounts, real credentials or production records. Do not claim tests or deployments have succeeded unless you ran them and can report the exact output.
