# Deployment Runbook — Vercel Application

This runbook replaces the former Vultr Compute/Docker deployment runbook. The application is deployed to Vercel. Vultr is used only for Object Storage when the owner confirms credit eligibility.

## 1. Environments

| Environment | Application | Database/Auth | Storage |
|---|---|---|---|
| Local development | Local Next.js dev server | Supabase development project | Supabase Storage or Vultr test bucket |
| Preview | Vercel Preview | Isolated development/staging Supabase project | Non-production bucket and credentials |
| Production | Vercel production deployment | Supabase paid production project | Production Vultr bucket if credit/cost approved; otherwise approved Supabase Storage |

Never point Preview at production data or production storage credentials.

## 2. Repository and GitHub

1. Keep the repository private during development if appropriate.
2. Use feature branches and pull requests.
3. Require lint, typecheck, tests and production build to pass before merging.
4. Connect the repository to Vercel.
5. Configure Preview and Production branches deliberately; normally PRs create Preview deployments and reviewed merges to `main` deploy to Production.

## 3. Vercel configuration

1. Import the GitHub repository into Vercel.
2. Select the correct Next.js framework preset and build settings.
3. Configure separate Development, Preview and Production environment variables.
4. Add only public Supabase URL/anon key to browser-exposed variables.
5. Keep service-role and Vultr S3 secrets server-only.
6. Set spend/usage alerts and review billing before commercial launch.
7. Use Vercel Hobby only for personal/non-commercial development/testing consistent with current terms. Upgrade to an appropriate commercial plan before the commercial application is operated as a business.

## 4. Supabase setup

1. Create a development project in an appropriate region; test latency from Sri Lanka.
2. Enable required extensions, including PostGIS.
3. Apply checked-in SQL migrations.
4. Configure Auth callback URLs for local, Preview and production domains.
5. Enable RLS on exposed tables and test policies.
6. Use test seed data only in development.
7. Before real customers rely on the service, select a paid production plan and verify backups, quotas and recovery procedures.

## 5. Vultr Object Storage setup (optional until credits are confirmed)

1. Check Vultr promotional credit balance, expiry and product eligibility.
2. Confirm Object Storage subscription charges are eligible for those credits and that the balance can cover the expected period. Standard tier is currently listed at US$18/month; confirm the live account price.
3. If not covered and not approved for paid usage, do not provision it. Use Supabase Storage until a later cost review.
4. When approved, create separate public-media and private-files buckets in Singapore if available.
5. Copy the exact endpoint and S3 credentials from the Vultr console into Vercel server-only environment variables.
6. Configure exact CORS origins for local development, Preview and production. Do not use wildcard origins with credentials.
7. Test presigned upload, metadata verification, public media delivery, private download authorization and deletion.
8. Keep public and private objects separate. Do not upload identity documents to public buckets.

## 6. Release validation

- [ ] Vercel build succeeds.
- [ ] Lint, typecheck and automated tests pass.
- [ ] Auth callbacks work on the deployment domain.
- [ ] RLS prevents cross-customer and cross-provider access.
- [ ] Provider media upload enforces allowed types and size.
- [ ] Private verification files are not publicly accessible.
- [ ] Object metadata and ownership are recorded in Supabase.
- [ ] No server secrets are exposed in browser bundles or logs.
- [ ] Spend alerts and usage dashboards are configured.
- [ ] Backup and restore path is documented before commercial launch.

## 7. Rollback

Use Vercel deployment history to promote a previously verified deployment. Database changes must use backward-compatible migrations where possible; do not assume reverting application code reverses a database migration. Keep storage object keys stable and avoid destructive bucket migrations during an application rollback.
