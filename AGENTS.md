# Workspace instructions — Sri Lanka Local Services Finder

Read `PROJECT_BLUEPRINT.md`, `docs/INFRASTRUCTURE_DECISION.md` and `docs/DEPLOYMENT_RUNBOOK.md` before making product, database or deployment changes. These documents are the project source of truth.

## Mission
Build a trustworthy, mobile-first local services discovery and enquiry marketplace for Sri Lanka. The first release is a responsive Next.js web application/PWA. The baseline production host is Vultr Cloud Compute in Singapore, deployed with Docker. Supabase provides managed PostgreSQL, Auth and PostGIS. Vultr Object Storage holds media and private files. Keep the application portable to Vercel Pro or another Node.js host, but do not make Vercel a production dependency.

## Non-negotiable architecture rules

1. Use Next.js App Router, React and TypeScript. Keep strict type checking enabled.
2. Build and run the application as a standard Node.js Docker container. Use Next.js `output: "standalone"` and keep the Dockerfile working.
3. Production deployment uses Vultr Cloud Compute + Docker Compose + Caddy. Do not introduce Kubernetes or microservices in the MVP.
4. Keep database, authentication and business rules independent of the hosting provider. Supabase PostgreSQL is the source of truth; use migrations for every schema change.
5. Use Supabase Auth with the current supported SSR approach (`@supabase/ssr`); do not introduce deprecated auth-helper packages.
6. Enable and test Row Level Security on every exposed table. Never assume hiding a UI element is authorization.
7. Never expose elevated Supabase secret/service-role keys, database connection strings or Vultr keys in browser code or `NEXT_PUBLIC_` variables.
8. Keep public provider listing data separate from private customer, verification and moderation data.
9. Never expose identity evidence, exact residential addresses, private customer contact details, internal moderation notes or audit logs publicly.
10. A provider is not verified merely because a document was uploaded. Verification badges require a recorded human approval for the relevant check.
11. Reviews must be tied to eligible real platform interactions. Never generate fake reviews, ratings or provider activity.
12. Use Zod validation on the server for all external input. Client-side validation is only for user experience.
13. Keep business logic out of React page components. Use feature modules and server-side services.
14. Use PostGIS for proximity search. Do not implement radius filtering by loading every provider into application memory.
15. All media access goes through a provider-neutral `StorageService` interface. Implement Vultr Object Storage through the S3 API adapter; do not call the AWS SDK directly from pages or feature business logic.
16. Never store uploads or durable application state on the VM filesystem. Use Vultr Object Storage for files and PostgreSQL for structured data.
17. Keep identity evidence and backups private. Public-read access is permitted only for a dedicated approved-media bucket after validation/moderation.
18. Use short-lived presigned URLs for private downloads and controlled uploads. Permanent Vultr credentials must never be sent to the browser.
19. Validate uploaded bytes, MIME type, size and dimensions. Do not trust only the file extension or browser-supplied content type.
20. Keep the app compatible with ordinary Node.js/Docker. Avoid Vercel-only services (Blob, KV, Postgres, Cron, Edge Config or Edge Runtime) in core paths. Vercel may be considered later on a commercial plan after a migration test. Never use Vercel Hobby for this commercial product.
21. Use accessible, responsive UI components. Test mobile layouts as part of every UI milestone.
22. Support English, Sinhala and Tamil in the data model. Do not hard-code user-facing text across components.
23. Do not fabricate external credentials, successful API calls, test results or production data.
24. Do not implement payments, instant booking, full chat, live tracking or native mobile apps unless the developer explicitly approves that phase.
25. Never commit secrets, private keys, customer data, production identity documents, `.env.production` or local Supabase dumps.
26. Do not provision, resize, destroy or otherwise spend the user's Vultr credits without explicit instruction. Antigravity may prepare deployment code and a runbook, but the account owner controls cloud provisioning and billing decisions.
27. Use current official documentation for changing platform APIs and libraries. Confirm available Vultr credits, region, exact Object Storage endpoint, billing and product eligibility in the user's account before provisioning.

## Development discipline

- Work one milestone from `PROJECT_BLUEPRINT.md` at a time.
- Start each milestone with a concise file/change/test plan.
- Preserve existing code unless there is a documented reason to replace it.
- Avoid large refactors unrelated to the approved milestone.
- Add tests for business rules, permissions and state transitions.
- Review RLS policies whenever a table or relationship changes.
- Run formatting, lint, type checking and relevant tests before declaring work complete.
- Never silently weaken a test, RLS policy or type to make a build pass.
- Keep `.env.example` limited to placeholders and document each required variable.
- Keep production environment variables in a protected server-side environment file or secret manager. Keep SSH and registry credentials in GitHub Actions Secrets.
- Build Docker images in CI, not on the smallest production VM. Use immutable commit-SHA image tags; do not deploy only a mutable `latest` tag.
- Deploy the same image to staging and production after smoke tests. Keep a documented rollback path.
- Update `docs/IMPLEMENTATION_PLAN.md`, `docs/ARCHITECTURE_DECISIONS.md`, `docs/SECURITY.md`, `docs/DATABASE.md` and deployment docs as implementation evolves.
- Report what is complete, what was tested and what remains incomplete. Do not claim a feature is production-ready without evidence.

## UI principles

- Prioritise mobile-first layouts and clear service search.
- Keep pages concise and scannable.
- Use real category and service imagery only when licensed and available; use clearly labelled neutral placeholders during development.
- Make provider verification labels precise and explain what each check means.
- Do not show fake star ratings, review counts, availability, prices or popularity indicators.
- Provide loading, error, empty and success states for all major flows.
- Ensure keyboard operation, visible focus, semantic structure and readable colour contrast.

## Security and privacy

- Enforce role and ownership checks in server code and database policies.
- Restrict file access by bucket and object path.
- Rate-limit sensitive public endpoints and upload-session creation.
- Avoid writing personal data into application logs, analytics events or error messages.
- Audit sensitive administrator actions.
- Do not publish precise user or provider home locations by default.
- Keep web application ports 80/443 public; restrict SSH to trusted administrator IPs where practical. Never expose database ports, Docker API or secret-bearing admin endpoints.
- Use SSH keys, non-root application containers, TLS, security updates, log rotation and health checks.
- Encrypt database exports before uploading them to the private backup bucket and periodically test restoration.
