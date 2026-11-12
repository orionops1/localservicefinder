# SUPERSEDED — Do not follow this plan

This earlier V1/V2 plan is no longer authoritative. It proposed moving the application to Vultr Compute with Docker Compose and Caddy.

The owner has since selected a simpler, lower-cost architecture:

- Vercel hosts the application in both testing and production stages.
- Supabase provides PostgreSQL, PostGIS and authentication.
- Vultr is used only for S3-compatible Object Storage when promotional credit eligibility is confirmed.
- No Vultr Compute, Kubernetes, Docker, Docker Compose, Caddy or Nginx is required.

Read and follow `ANTIGRAVITY_ARCHITECTURE_VERCEL_VULTR_STORAGE_ONLY.md` instead. It supersedes this document and all earlier hosting/deployment instructions.
