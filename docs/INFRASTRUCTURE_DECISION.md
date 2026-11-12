# Infrastructure Decision — Vercel + Supabase + Optional Vultr Object Storage

**Status: Approved. This replaces all earlier Vultr-first application-hosting plans.**

## Decision

- **Application:** Next.js hosted on Vercel.
- **Database:** Supabase PostgreSQL.
- **Geospatial search:** PostGIS on Supabase.
- **Authentication:** Supabase Auth.
- **File storage:** Vultr Object Storage only, if the owner's promotional credits are confirmed to cover the subscription; otherwise use Supabase Storage until a switch is economical.
- **Source control/deployment:** GitHub connected to Vercel.

Vultr is not the app host. No Vultr Compute, VM, VPS, Kubernetes, Docker, Docker Compose, Caddy or Nginx is part of the approved plan.

## Cost notes checked 12 November 2026

- Vultr Object Storage Standard is listed at US$18/month and includes 1,000 GB storage, 1,000 GB outbound transfer and unlimited inbound transfer. Confirm credit eligibility, regional availability, taxes and overages in the account before provisioning.
- Supabase Free includes 1 GB file storage, 500 MB database, 5 GB egress, and may pause after a week of low activity.
- Supabase Pro starts at US$25/month and currently includes 100 GB file storage and 250 GB egress.
- Vercel Hobby is for personal/non-commercial usage. Use an appropriate commercial plan for commercial production. Vercel Pro is listed at US$20/month and includes US$20 usage credit; verify current billing details before upgrading.

## Storage implementation

Use an S3-compatible `StorageProvider` adapter. Store binaries in Vultr only when credit coverage is confirmed. Keep object metadata, ownership and moderation state in Supabase. Separate public approved media from private verification documents. Use server-generated, short-lived presigned URLs; never expose object-store credentials to the browser.

The storage implementation must be replaceable with Supabase Storage without changing customer/provider business workflows. Do not run two paid storage systems in parallel.

## Growth / future changes

Revisit hosting only when actual traffic, Vercel usage or product requirements justify a change. Any future self-hosting discussion must include a documented cost comparison and operational burden. Kubernetes is not on the roadmap unless an extraordinary future requirement makes it necessary.

## Official references

- https://vercel.com/pricing
- https://vercel.com/docs/plans/hobby
- https://vercel.com/docs/plans/pro-plan
- https://supabase.com/pricing
- https://supabase.com/docs/guides/storage/pricing
- https://supabase.com/docs/guides/platform/free-project-pausing
- https://docs.vultr.com/product-overviews/object-storage
- https://docs.vultr.com/support/platform/billing/how-is-object-storage-billed
