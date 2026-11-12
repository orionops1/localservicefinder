# Database Architecture & Schema Specification — Sri Lanka Local Services Finder

**Status:** Technical Specification & Migration Baseline  
**Date:** 11 November 2026  
**Reference:** `PROJECT_BLUEPRINT.md`, `AGENTS.md`, `docs/ARCHITECTURE_DECISIONS.md`

---

## 1. Database Architecture & Core Rules

- **Engine:** PostgreSQL 15+ hosted on managed Supabase (Singapore region: `ap-southeast-1`).
- **Extensions:**
  - `postgis` (installed in dedicated `extensions` schema for geospatial distance and polygon operations).
  - `pg_trgm` (for trigram fuzzy search across provider names, category aliases, and service descriptions).
  - `uuid-ossp` or native `gen_random_uuid()` for primary key generation.
- **Time & Localization:**
  - All database timestamps are stored in UTC (`TIMESTAMPTZ DEFAULT NOW()`).
  - Presentation layer formats timestamps in Sri Lanka Standard Time (`Asia/Colombo`, UTC+05:30).
  - Currency values are stored as `NUMERIC(12, 2)` (never floating point) with currency code defaulting to `'LKR'`.
- **Identity & Schema Separation:**
  - `profiles.id` has a 1:1 foreign key relationship with `auth.users(id) ON DELETE CASCADE`.
  - Sensitive internal data (audit logs, private verification evidence) is kept in non-public views/endpoints and shielded by strict Row Level Security (RLS).
  - All migrations are versioned sequentially in `supabase/migrations/` and applied exclusively via the Supabase CLI.

---

## 2. Entity-Relationship Diagram

```mermaid
erDiagram
    USERS ||--o| PROFILES : "1:1 profile"
    USERS ||--o{ USER_ROLES : "assigned roles"
    USERS ||--o{ BUSINESS_MEMBERS : "membership"
    BUSINESSES ||--o{ BUSINESS_MEMBERS : "team"
    BUSINESSES ||--o{ PROVIDER_SERVICES : "offers"
    SERVICE_CATEGORIES ||--o{ PROVIDER_SERVICES : "classifies"
    SERVICE_CATEGORIES ||--o{ SERVICE_CATEGORY_ALIASES : "synonyms"
    BUSINESSES ||--o{ PROVIDER_SERVICE_AREAS : "covers"
    LOCALITIES ||--o{ PROVIDER_SERVICE_AREAS : "target town"
    DISTRICTS ||--o{ LOCALITIES : "contains"
    PROVINCES ||--o{ DISTRICTS : "contains"
    BUSINESSES ||--o{ PROVIDER_MEDIA : "media gallery"
    BUSINESSES ||--o{ VERIFICATION_SUBMISSIONS : "evidence"
    USERS ||--o{ LEADS : "customer enquiry"
    BUSINESSES ||--o{ LEADS : "receives"
    LEADS ||--o{ LEAD_STATUS_EVENTS : "history"
    LEADS ||--o| REVIEWS : "1:1 verified review"
    BUSINESSES ||--o{ REVIEWS : "rated on"
    USERS ||--o{ FAVOURITES : "saves"
    BUSINESSES ||--o{ FAVOURITES : "bookmarked"
    USERS ||--o{ USER_NOTIFICATIONS : "receives"
    ADMIN_AUDIT_LOGS }o--|| USERS : "actor"

    PROFILES {
        uuid id PK
        text display_name
        text phone
        text email
        text preferred_locale
        text account_status
        timestamptz created_at
    }

    BUSINESSES {
        uuid id PK
        uuid owner_id FK
        text business_type
        text name
        text slug UK
        text description
        text status
        text public_phone
        text public_whatsapp
        text public_email
        timestamptz published_at
    }

    BUSINESS_MEMBERS {
        uuid id PK
        uuid business_id FK
        uuid user_id FK
        text member_role
        jsonb permissions
        text status
    }

    SERVICE_CATEGORIES {
        uuid id PK
        uuid parent_id FK
        text slug UK
        text name_en
        text name_si
        text name_ta
        text icon
        int sort_order
        bool is_active
    }

    LOCALITIES {
        uuid id PK
        uuid district_id FK
        text slug UK
        text name_en
        text name_si
        text name_ta
        geography location_point
    }

    LEADS {
        uuid id PK
        uuid customer_id FK
        uuid business_id FK
        uuid provider_service_id FK
        text message
        text status
        timestamptz created_at
    }

    REVIEWS {
        uuid id PK
        uuid lead_id UK FK
        uuid business_id FK
        uuid customer_id FK
        int rating
        text comment
        text status
        timestamptz published_at
    }
```

---

## 3. Comprehensive Table Catalog

### 3.1 Account & Identity Foundation

#### `public.profiles`
- **Purpose:** Public and customer profile information linked to Supabase Auth.
- **Columns:**
  - `id` (UUID, PK): References `auth.users(id) ON DELETE CASCADE`.
  - `display_name` (TEXT, NOT NULL): User's chosen public name.
  - `phone` (TEXT): Canonical E.164 phone number.
  - `email` (TEXT): Synced with Auth.
  - `preferred_locale` (TEXT, DEFAULT 'en', CHECK in ('en', 'si', 'ta')): User interface language.
  - `avatar_path` (TEXT): S3 path to avatar in `lsf-public-media`.
  - `account_status` (TEXT, DEFAULT 'active', CHECK in ('active', 'suspended', 'deactivated')).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - `updated_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.user_roles`
- **Purpose:** System-wide operational roles.
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `user_id` (UUID, NOT NULL): References `profiles(id) ON DELETE CASCADE`.
  - `role` (TEXT, NOT NULL, CHECK in ('customer', 'moderator', 'verifier', 'admin', 'super_admin')).
  - `granted_by` (UUID): References `profiles(id)`.
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - **Constraints:** `UNIQUE(user_id, role)`.

#### `public.businesses`
- **Purpose:** Registered service provider business entity (individual tradesperson or company).
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `owner_id` (UUID, NOT NULL): References `profiles(id)`.
  - `business_type` (TEXT, NOT NULL, CHECK in ('individual', 'sole_proprietor', 'registered_company')).
  - `name` (TEXT, NOT NULL): Business / professional name.
  - `slug` (TEXT, NOT NULL, UNIQUE): URL slug for public provider profile.
  - `description` (TEXT): Public overview of services and experience.
  - `status` (TEXT, DEFAULT 'draft', CHECK in ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended', 'archived')).
  - `public_phone` (TEXT): Publicly visible phone contact.
  - `public_whatsapp` (TEXT): Publicly visible WhatsApp contact.
  - `public_email` (TEXT): Publicly visible email contact.
  - `website_url` (TEXT): Optional website link.
  - `published_at` (TIMESTAMPTZ): Timestamp when approved and made public.
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - `updated_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.business_members`
- **Purpose:** Multi-tenant provider organization access control (owners and staff).
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `user_id` (UUID, NOT NULL): References `profiles(id) ON DELETE CASCADE`.
  - `member_role` (TEXT, NOT NULL, CHECK in ('owner', 'staff')).
  - `permissions` (JSONB, DEFAULT '{}'): Granular permissions (e.g., `manage_services`, `manage_leads`, `view_analytics`).
  - `status` (TEXT, DEFAULT 'active', CHECK in ('invited', 'active', 'suspended', 'revoked')).
  - `invited_by` (UUID): References `profiles(id)`.
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - `updated_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - **Constraints:** `UNIQUE(business_id, user_id)`.

---

### 3.2 Taxonomy & Geographic Hierarchy

#### `public.provinces`
- **Columns:** `id` (INT, PK), `slug` (TEXT, UNIQUE), `name_en` (TEXT), `name_si` (TEXT), `name_ta` (TEXT).
- **Seeded:** All 9 Provinces of Sri Lanka (Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa).

#### `public.districts`
- **Columns:** `id` (INT, PK), `province_id` (INT, FK), `slug` (TEXT, UNIQUE), `name_en` (TEXT), `name_si` (TEXT), `name_ta` (TEXT).
- **Seeded:** All 25 Districts of Sri Lanka (Colombo, Gampaha, Kalutara, Kandy, Matale, Nuwara Eliya, Galle, Matara, Hambantota, Jaffna, etc.).

#### `public.localities`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `district_id` (INT, NOT NULL): References `districts(id)`.
  - `parent_locality_id` (UUID): References `localities(id)` for nested neighbourhoods.
  - `slug` (TEXT, NOT NULL, UNIQUE).
  - `name_en` (TEXT, NOT NULL).
  - `name_si` (TEXT).
  - `name_ta` (TEXT).
  - `location_point` (GEOGRAPHY(Point, 4326)): Centroid of town/locality.
  - `is_active` (BOOL, DEFAULT true).

#### `public.service_categories`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `parent_id` (UUID): Self-reference for 2-tier subcategories.
  - `slug` (TEXT, NOT NULL, UNIQUE).
  - `name_en` (TEXT, NOT NULL).
  - `name_si` (TEXT, NOT NULL).
  - `name_ta` (TEXT, NOT NULL).
  - `description_en` (TEXT).
  - `description_si` (TEXT).
  - `description_ta` (TEXT).
  - `icon` (TEXT): Icon identifier.
  - `sort_order` (INT, DEFAULT 0).
  - `is_active` (BOOL, DEFAULT true).

#### `public.service_category_aliases`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `category_id` (UUID, NOT NULL): References `service_categories(id) ON DELETE CASCADE`.
  - `locale` (TEXT, CHECK in ('en', 'si', 'ta')).
  - `alias` (TEXT, NOT NULL): Local phrasing, Singlish, slang, or alternative spelling.
  - `normalized_alias` (TEXT, NOT NULL): Lowercase unaccented string for fast lookup.

---

### 3.3 Provider Services, Coverage & Media

#### `public.provider_services`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `category_id` (UUID, NOT NULL): References `service_categories(id)`.
  - `title` (TEXT, NOT NULL): Specific service offering.
  - `description` (TEXT).
  - `pricing_type` (TEXT, DEFAULT 'quote', CHECK in ('fixed', 'starting_at', 'hourly', 'quote')).
  - `price_min` (NUMERIC(12, 2)).
  - `price_max` (NUMERIC(12, 2)).
  - `currency` (TEXT, DEFAULT 'LKR').
  - `is_active` (BOOL, DEFAULT true).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - **Constraint:** `CHECK (price_min IS NULL OR price_max IS NULL OR price_min <= price_max)`.

#### `public.provider_service_areas`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `locality_id` (UUID): References `localities(id)`.
  - `coverage_type` (TEXT, DEFAULT 'locality', CHECK in ('locality', 'radius', 'polygon')).
  - `radius_km` (NUMERIC(6, 2)): Operating radius from locality center or business base.
  - `location_point` (GEOGRAPHY(Point, 4326)): Operating base coordinates.
  - `is_active` (BOOL, DEFAULT true).

#### `public.provider_media`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `storage_path` (TEXT, NOT NULL): Key inside `lsf-public-media`.
  - `media_type` (TEXT, DEFAULT 'portfolio', CHECK in ('logo', 'cover', 'portfolio')).
  - `alt_text_en` (TEXT).
  - `alt_text_si` (TEXT).
  - `alt_text_ta` (TEXT).
  - `sort_order` (INT, DEFAULT 0).
  - `moderation_status` (TEXT, DEFAULT 'approved', CHECK in ('pending', 'approved', 'rejected')).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

---

### 3.4 Verification, Enquiries & Reviews

#### `public.verification_submissions`
- **Purpose:** Identity and business verification evidence. Accessible only to provider owner and platform verifiers.
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `submitted_by` (UUID, NOT NULL): References `profiles(id)`.
  - `check_type` (TEXT, NOT NULL, CHECK in ('phone_confirmed', 'identity_checked', 'business_details_checked', 'qualification_checked')).
  - `private_storage_path` (TEXT, NOT NULL): Opaque key inside `lsf-private-files`.
  - `status` (TEXT, DEFAULT 'pending', CHECK in ('pending', 'approved', 'rejected', 'expired')).
  - `reviewer_id` (UUID): References `profiles(id)`.
  - `decision_reason` (TEXT): Customer-safe explanation if rejected or internal review notes.
  - `checked_at` (TIMESTAMPTZ).
  - `expires_at` (TIMESTAMPTZ).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.leads`
- **Purpose:** Customer enquiry to a specific provider.
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `customer_id` (UUID, NOT NULL): References `profiles(id)`.
  - `business_id` (UUID, NOT NULL): References `businesses(id)`.
  - `provider_service_id` (UUID): References `provider_services(id)`.
  - `category_id` (UUID, NOT NULL): References `service_categories(id)`.
  - `message` (TEXT, NOT NULL): Scope of requested work.
  - `customer_name_snapshot` (TEXT, NOT NULL).
  - `customer_contact_snapshot` (TEXT, NOT NULL).
  - `location_id` (UUID): References `localities(id)`.
  - `preferred_date` (DATE).
  - `status` (TEXT, DEFAULT 'new', CHECK in ('new', 'viewed', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'declined', 'cancelled', 'disputed', 'spam')).
  - `source` (TEXT, DEFAULT 'platform_enquiry').
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - `updated_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.lead_status_events`
- **Purpose:** Immutable append-only audit trail of every lead transition.
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `lead_id` (UUID, NOT NULL): References `leads(id) ON DELETE CASCADE`.
  - `changed_by` (UUID, NOT NULL): References `profiles(id)`.
  - `from_status` (TEXT, NOT NULL).
  - `to_status` (TEXT, NOT NULL).
  - `note` (TEXT).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.reviews`
- **Purpose:** Authenticated reviews strictly tied to completed leads.
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `lead_id` (UUID, NOT NULL, UNIQUE): References `leads(id) ON DELETE RESTRICT`.
  - `business_id` (UUID, NOT NULL): References `businesses(id)`.
  - `customer_id` (UUID, NOT NULL): References `profiles(id)`.
  - `rating` (INT, NOT NULL, CHECK (rating >= 1 AND rating <= 5)).
  - `quality_rating` (INT, CHECK (quality_rating >= 1 AND quality_rating <= 5)).
  - `punctuality_rating` (INT, CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5)).
  - `communication_rating` (INT, CHECK (communication_rating >= 1 AND communication_rating <= 5)).
  - `comment` (TEXT).
  - `status` (TEXT, DEFAULT 'pending_moderation', CHECK in ('pending_moderation', 'published', 'rejected', 'flagged')).
  - `published_at` (TIMESTAMPTZ).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

---

### 3.5 Operational, Audit & Notifications

#### `public.admin_audit_logs`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `actor_id` (UUID, NOT NULL): References `profiles(id)`.
  - `action` (TEXT, NOT NULL): e.g., `'provider.approve'`, `'verification.decide'`.
  - `target_type` (TEXT, NOT NULL): e.g., `'business'`, `'verification_submission'`.
  - `target_id` (UUID, NOT NULL).
  - `before_data` (JSONB).
  - `after_data` (JSONB).
  - `reason` (TEXT).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.favourites`
- **Columns:**
  - `customer_id` (UUID, NOT NULL): References `profiles(id) ON DELETE CASCADE`.
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).
  - **Constraint:** `PRIMARY KEY (customer_id, business_id)`.

#### `public.user_notifications`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `user_id` (UUID, NOT NULL): References `profiles(id) ON DELETE CASCADE`.
  - `type` (TEXT, NOT NULL).
  - `title` (TEXT, NOT NULL).
  - `body` (TEXT, NOT NULL).
  - `payload` (JSONB, DEFAULT '{}').
  - `read_at` (TIMESTAMPTZ).
  - `created_at` (TIMESTAMPTZ, DEFAULT NOW()).

#### `public.contact_events`
- **Columns:**
  - `id` (UUID, PK, DEFAULT gen_random_uuid()).
  - `business_id` (UUID, NOT NULL): References `businesses(id) ON DELETE CASCADE`.
  - `channel` (TEXT, CHECK in ('phone_call', 'whatsapp_click', 'website_click')).
  - `event_day` (DATE, NOT NULL, DEFAULT CURRENT_DATE).
  - `count` (INT, DEFAULT 1).
  - **Constraint:** `UNIQUE (business_id, channel, event_day)`.

---

## 4. PostGIS Proximity Search Architecture

Nearby search utilizes the PostGIS extension within PostgreSQL.

### Spatial Storage & Indexing
```sql
CREATE EXTENSION IF NOT EXISTS postgis SCHEMA extensions;

CREATE INDEX idx_localities_location_point 
ON public.localities USING GIST (location_point);

CREATE INDEX idx_provider_service_areas_point 
ON public.provider_service_areas USING GIST (location_point);
```

### Proximity Query Function (`search_providers_geo`)
```sql
CREATE OR REPLACE FUNCTION search_providers_geo(
    search_lat DOUBLE PRECISION,
    search_lng DOUBLE PRECISION,
    radius_meters DOUBLE PRECISION,
    target_category_id UUID DEFAULT NULL
)
RETURNS TABLE (
    business_id UUID,
    business_name TEXT,
    business_slug TEXT,
    distance_meters DOUBLE PRECISION
)
LANGUAGE sql
STABLE
AS $$
    SELECT DISTINCT
        b.id AS business_id,
        b.name AS business_name,
        b.slug AS business_slug,
        ST_Distance(
            psa.location_point, 
            ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography
        ) AS distance_meters
    FROM public.businesses b
    JOIN public.provider_service_areas psa ON psa.business_id = b.id
    JOIN public.provider_services ps ON ps.business_id = b.id
    WHERE b.status = 'approved'
      AND psa.is_active = true
      AND ps.is_active = true
      AND (target_category_id IS NULL OR ps.category_id = target_category_id)
      AND ST_DWithin(
          psa.location_point,
          ST_SetSRID(ST_MakePoint(search_lng, search_lat), 4326)::geography,
          radius_meters
      )
    ORDER BY distance_meters ASC;
$$;
```

---

## 5. First Database Migration Sequence (M1)

The initial migration establishes foundational security, user profiles, and multi-tenant business structures with RLS enabled immediately:

1. **`20261111000001_init_extensions.sql`:**
   - Enables `postgis` in `extensions` schema.
   - Enables `pg_trgm` in `public` or `extensions`.
2. **`20261111000002_create_profiles_and_roles.sql`:**
   - Creates `profiles`, `user_roles`.
   - Attaches `auth.users` trigger to auto-create profile on signup.
   - Sets up initial RLS policies for `profiles` and `user_roles`.
3. **`20261111000003_create_businesses_and_members.sql`:**
   - Creates `businesses`, `business_members`.
   - Sets up RLS policies ensuring only active owners and authorized staff can modify business settings.
   - Sets up public-safe view allowing anonymous users to read approved businesses only.
