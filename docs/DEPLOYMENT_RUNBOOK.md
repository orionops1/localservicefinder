# Deployment Runbook — Staged (V1 Vercel → V2 Vultr)

**Status:** Authoritative Operational Runbook  
**Date:** 12 November 2026 (Updated per Authoritative Directive)  
**Reference:** `ANTIGRAVITY_V1_VERCEL_V2_VULTR_PLAN.md`, `docs/INFRASTRUCTURE_DECISION.md`

---

# PART 1: V1 Vercel Test Deployment (Current Focus)

V1 is deployed to Vercel for rapid feedback, PR previews, and end-to-end testing of customer and provider journeys.

## 1.1 Prerequisites
1. Private GitHub repository with the project code pushed to `main`.
2. Supabase development/testing project created in Singapore (`ap-southeast-1`).
3. Vercel account with project linked to the GitHub repository.

## 1.2 Supabase Setup (V1)
1. **Apply Migrations:** Run `supabase db push` against the development project.
2. **Storage Buckets:** Create two buckets in Supabase Storage:
   - `provider-public`: Public read enabled; unauthorized write disabled.
   - `private-documents`: Private by default; accessible only via signed URLs.
3. **Auth Configuration:**
   - Add Vercel project URLs (`https://<project>.vercel.app/**` and custom test domain) to Supabase Auth Redirect URLs.
   - Configure allowed auth providers and email templates.

## 1.3 Vercel Environment Configuration
In the Vercel Dashboard (Project Settings → Environment Variables), configure:

```env
# Public client variables (exposed to browser)
NEXT_PUBLIC_APP_URL=https://<your-project>.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://<your-project>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=ey...

# Server-only runtime secrets (never NEXT_PUBLIC_)
SUPABASE_SERVICE_ROLE_KEY=ey...

# Storage configuration
STORAGE_PROVIDER=supabase
SUPABASE_STORAGE_PUBLIC_BUCKET=provider-public
SUPABASE_STORAGE_PRIVATE_BUCKET=private-documents
```

## 1.4 Verification & Release Gate (V1)
- [ ] Vercel build succeeds without TypeScript or lint warnings.
- [ ] `/api/health` returns HTTP 200 with sanitized JSON status.
- [ ] Sign-up, email confirmation, and login work via Supabase Auth SSR.
- [ ] Public search displays seeded provider listings.
- [ ] Customer enquiry flow creates leads in `new` state.
- [ ] Provider dashboard loads leads and permits valid status changes.
- [ ] Private verification evidence cannot be downloaded anonymously.
- [ ] `noindex` header or meta tag is active on non-production test deployments.

---

# PART 2: V2 Vultr Production Migration (Future Phase)

V2 migration begins **only** after V1 test acceptance and explicit owner authorization.

## 2.1 Pre-Migration Account Checks
- [ ] Check Vultr promotional credit balance, expiration, and eligible products.
- [ ] Confirm Singapore region availability for Cloud Compute and Object Storage (`https://sgp1.vultrobjects.com`).
- [ ] Verify Supabase production plan is upgraded to Pro ($25/mo) with daily automated backups.

## 2.2 Vultr Resource Provisioning
1. **Compute:** Shared CPU Cloud Compute instance (minimum 2 GB RAM, Singapore `sgp`, Ubuntu LTS). Add owner's SSH public key.
2. **Object Storage:** Create Singapore Object Storage subscription. Create three buckets:
   - `lsf-public-media` (approved media)
   - `lsf-private-files` (verification documents)
   - `lsf-backups` (encrypted database dumps)
3. **Firewall:** Restrict ingress to TCP 80 and 443 publicly. Restrict SSH (port 22) to admin IPs.

## 2.3 Server Preparation
```bash
# SSH into Vultr VM
ssh deploy@<vultr-ip>

# Update packages and install Docker + Compose plugin
sudo apt update && sudo apt upgrade -y
sudo apt install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch="$(dpkg --print-architecture)" signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  "$(. /etc/os-release && echo "$VERSION_CODENAME")" stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Setup deployment directory
sudo mkdir -p /opt/local-services-finder
sudo chown -R $USER:$USER /opt/local-services-finder
cd /opt/local-services-finder
```

## 2.4 V2 Docker & Caddy Configuration Files
Place `compose.production.yaml` and `Caddyfile` in `/opt/local-services-finder/`:

### `compose.production.yaml`
```yaml
services:
  app:
    image: ghcr.io/${REPO_OWNER}/local-services-finder:${IMAGE_TAG}
    restart: unless-stopped
    env_file:
      - .env.production
    networks:
      - internal_net
    expose:
      - "3000"
    healthcheck:
      test: ["CMD", "curl", "-f", "http://127.0.0.1:3000/api/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  caddy:
    image: caddy:2-alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    networks:
      - internal_net
    depends_on:
      - app

networks:
  internal_net:
    driver: bridge

volumes:
  caddy_data:
  caddy_config:
```

### `Caddyfile`
```caddy
{$SITE_ADDRESS:localhost} {
    encode zstd gzip

    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"
        X-Content-Type-Options "nosniff"
        X-Frame-Options "SAMEORIGIN"
        Referrer-Policy "strict-origin-when-cross-origin"
        Permissions-Policy "camera=(), microphone=(), payment=()"
        -Server
    }

    reverse_proxy app:3000 {
        header_up Host {host}
        header_up X-Real-IP {remote_host}
        header_up X-Forwarded-For {remote_host}
        header_up X-Forwarded-Proto {scheme}
    }
}
```

## 2.5 Storage Migration (Supabase Storage → Vultr Object Storage)
1. Run the one-off migration script to copy assets from Supabase buckets to Vultr buckets.
2. Verify checksums and counts.
3. Update server environment variable on Vultr VM:
   ```env
   STORAGE_PROVIDER=vultr-s3
   VULTR_S3_ENDPOINT=https://sgp1.vultrobjects.com
   VULTR_S3_REGION=us-east-1
   VULTR_S3_ACCESS_KEY=...
   VULTR_S3_SECRET_KEY=...
   VULTR_PUBLIC_MEDIA_BUCKET=lsf-public-media
   VULTR_PRIVATE_FILES_BUCKET=lsf-private-files
   ```
4. Restart the app container: `docker compose up -d app`.

## 2.6 Rollback Procedure
If issues are identified post-migration:
1. Revert DNS in Cloudflare back to Vercel CNAME/A records.
2. Re-point `STORAGE_PROVIDER` back to `supabase`.
3. Investigate logs in `/opt/local-services-finder` (`docker compose logs app`).
