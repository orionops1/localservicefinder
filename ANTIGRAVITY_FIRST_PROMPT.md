# First Antigravity Prompt — Sri Lanka Local Services Finder

Read these files before making changes:

1. `AGENTS.md`
2. `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md`
3. `PROJECT_BLUEPRINT.md`
4. `START_HERE.md`

The architecture directive is authoritative for all hosting, deployment and storage decisions. Older plan documents mentioning Vultr Compute, Docker Compose, Caddy or Kubernetes are superseded. Do not follow them.

## Approved architecture

- Host the Next.js application on Vercel.
- Use Supabase PostgreSQL, PostGIS and Supabase Auth.
- Use Vultr Object Storage only for file/media storage if the owner confirms the existing promotional credits cover it. Otherwise, use Supabase Storage until Vultr is economical.
- Connect GitHub to Vercel for automatic deployments.
- Do not provision Vultr Compute, Kubernetes, Docker, Docker Compose, Caddy, Nginx, Redis or self-hosted databases.
- Do not introduce Vercel Blob or other paid services without approval.

## Your task now

Do not start generating the entire product immediately. First inspect the current repository, branch, dependencies, existing components, configuration, and Git status. Preserve any existing work.

Then produce an M0 implementation plan covering:

1. Current repository assessment and any risks.
2. Next.js/TypeScript setup and minimal UI foundation.
3. Supabase development project connection and safe environment-variable setup.
4. GitHub-to-Vercel Preview deployment.
5. Build, lint, typecheck and test commands.
6. A recommended first commit sequence.
7. Any required owner actions, clearly separated from work you can perform in the repository.

After presenting the plan, implement M0 only when the repository is ready. Finish with a working local application and a Vercel Preview deployment if authorized credentials/integrations are available. Do not claim a deployment succeeded unless you verify it.

## Hard constraints

- Do not buy, upgrade or provision cloud services.
- Do not consume Vultr credits without explicit owner approval.
- Do not request or invent secrets. Provide an `.env.example` with placeholders.
- Do not create real customers, providers or reviews; use clearly labelled fictional seed data only.
- Do not skip RLS, authorization, validation or testing in later milestones.
- Do not create empty boilerplate folders just to make the project look complete.
- Do not proceed to M1 until M0 checks pass and the owner can review the result.
