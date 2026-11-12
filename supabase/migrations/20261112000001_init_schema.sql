-- ==============================================================================
-- Sri Lanka Local Services Finder — Migration 001: Core Schema & PostGIS
-- ==============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS postgis WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Profiles (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    preferred_locale TEXT NOT NULL DEFAULT 'en' CHECK (preferred_locale IN ('en', 'si', 'ta')),
    avatar_path TEXT,
    account_status TEXT NOT NULL DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deactivated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Platform User Roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('customer', 'moderator', 'verifier', 'admin', 'super_admin')),
    granted_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- 4. Sri Lankan Administrative Taxonomy
CREATE TABLE IF NOT EXISTS public.provinces (
    id INT PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_si TEXT NOT NULL,
    name_ta TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.districts (
    id INT PRIMARY KEY,
    province_id INT NOT NULL REFERENCES public.provinces(id) ON DELETE RESTRICT,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_si TEXT NOT NULL,
    name_ta TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.localities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_id INT NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
    parent_locality_id UUID REFERENCES public.localities(id) ON DELETE SET NULL,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_si TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    location_point extensions.GEOGRAPHY(Point, 4326),
    is_active BOOLEAN NOT NULL DEFAULT true
);

-- Spatial index on locality centroid
CREATE INDEX IF NOT EXISTS idx_localities_location_point 
ON public.localities USING GIST (location_point);

-- 5. Service Categories & Aliases
CREATE TABLE IF NOT EXISTS public.service_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_id UUID REFERENCES public.service_categories(id) ON DELETE CASCADE,
    slug TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_si TEXT NOT NULL,
    name_ta TEXT NOT NULL,
    description_en TEXT,
    description_si TEXT,
    description_ta TEXT,
    icon TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.service_category_aliases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE CASCADE,
    locale TEXT NOT NULL CHECK (locale IN ('en', 'si', 'ta')),
    alias TEXT NOT NULL,
    normalized_alias TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_category_aliases_normalized 
ON public.service_category_aliases (normalized_alias);

-- 6. Provider Businesses
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id),
    business_type TEXT NOT NULL CHECK (business_type IN ('individual', 'sole_proprietor', 'registered_company')),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted', 'under_review', 'approved', 'rejected', 'suspended', 'archived')),
    public_phone TEXT,
    public_whatsapp TEXT,
    public_email TEXT,
    website_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigram index for business name fuzzy search
CREATE INDEX IF NOT EXISTS idx_businesses_name_trgm 
ON public.businesses USING GIN (name gin_trgm_ops);

-- 7. Business Members (Multi-Tenant Team & Ownership)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    member_role TEXT NOT NULL CHECK (member_role IN ('owner', 'staff')),
    permissions JSONB NOT NULL DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('invited', 'active', 'suspended', 'revoked')),
    invited_by UUID REFERENCES public.profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (business_id, user_id)
);

-- 8. Provider Services (Specific offerings with pricing)
CREATE TABLE IF NOT EXISTS public.provider_services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES public.service_categories(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    pricing_type TEXT NOT NULL DEFAULT 'quote' CHECK (pricing_type IN ('fixed', 'starting_at', 'hourly', 'quote')),
    price_min NUMERIC(12, 2),
    price_max NUMERIC(12, 2),
    currency TEXT NOT NULL DEFAULT 'LKR',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_price_range CHECK (price_min IS NULL OR price_max IS NULL OR price_min <= price_max)
);

-- 9. Provider Service Areas (Coverage areas & operating radius)
CREATE TABLE IF NOT EXISTS public.provider_service_areas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    locality_id UUID REFERENCES public.localities(id) ON DELETE CASCADE,
    coverage_type TEXT NOT NULL DEFAULT 'locality' CHECK (coverage_type IN ('locality', 'radius', 'polygon')),
    radius_km NUMERIC(6, 2),
    location_point extensions.GEOGRAPHY(Point, 4326),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_provider_service_areas_point 
ON public.provider_service_areas USING GIST (location_point);

-- 10. Provider Media (Approved public gallery & portfolio)
CREATE TABLE IF NOT EXISTS public.provider_media (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    storage_path TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'portfolio' CHECK (media_type IN ('logo', 'cover', 'portfolio')),
    alt_text_en TEXT,
    alt_text_si TEXT,
    alt_text_ta TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    moderation_status TEXT NOT NULL DEFAULT 'pending' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Verification Submissions (Private identity evidence)
CREATE TABLE IF NOT EXISTS public.verification_submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    submitted_by UUID NOT NULL REFERENCES public.profiles(id),
    check_type TEXT NOT NULL CHECK (check_type IN ('phone_confirmed', 'identity_checked', 'business_details_checked', 'qualification_checked')),
    private_storage_path TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'expired')),
    reviewer_id UUID REFERENCES public.profiles(id),
    decision_reason TEXT,
    checked_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Leads / Enquiries
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    business_id UUID NOT NULL REFERENCES public.businesses(id),
    provider_service_id UUID REFERENCES public.provider_services(id),
    category_id UUID NOT NULL REFERENCES public.service_categories(id),
    message TEXT NOT NULL,
    customer_name_snapshot TEXT NOT NULL,
    customer_contact_snapshot TEXT NOT NULL,
    location_id UUID REFERENCES public.localities(id),
    preferred_date DATE,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'viewed', 'contacted', 'quoted', 'accepted', 'in_progress', 'completed', 'declined', 'cancelled', 'disputed', 'spam')),
    source TEXT NOT NULL DEFAULT 'platform_enquiry',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Lead Status Transition Audit
CREATE TABLE IF NOT EXISTS public.lead_status_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    changed_by UUID NOT NULL REFERENCES public.profiles(id),
    from_status TEXT NOT NULL,
    to_status TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 13. Reviews (Tied strictly to completed leads)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL UNIQUE REFERENCES public.leads(id) ON DELETE RESTRICT,
    business_id UUID NOT NULL REFERENCES public.businesses(id),
    customer_id UUID NOT NULL REFERENCES public.profiles(id),
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    quality_rating INT CHECK (quality_rating >= 1 AND quality_rating <= 5),
    punctuality_rating INT CHECK (punctuality_rating >= 1 AND punctuality_rating <= 5),
    communication_rating INT CHECK (communication_rating >= 1 AND communication_rating <= 5),
    comment TEXT,
    status TEXT NOT NULL DEFAULT 'pending_moderation' CHECK (status IN ('pending_moderation', 'published', 'rejected', 'flagged')),
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 14. Customer Favourites
CREATE TABLE IF NOT EXISTS public.favourites (
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (customer_id, business_id)
);

-- 15. Admin Audit Logs
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID NOT NULL REFERENCES public.profiles(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id UUID NOT NULL,
    before_data JSONB,
    after_data JSONB,
    reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 16. PostGIS Search Stored Procedure
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
        extensions.ST_Distance(
            psa.location_point, 
            extensions.ST_SetSRID(extensions.ST_MakePoint(search_lng, search_lat), 4326)::extensions.GEOGRAPHY
        ) AS distance_meters
    FROM public.businesses b
    JOIN public.provider_service_areas psa ON psa.business_id = b.id
    JOIN public.provider_services ps ON ps.business_id = b.id
    WHERE b.status = 'approved'
      AND psa.is_active = true
      AND ps.is_active = true
      AND (target_category_id IS NULL OR ps.category_id = target_category_id)
      AND extensions.ST_DWithin(
          psa.location_point,
          extensions.ST_SetSRID(extensions.ST_MakePoint(search_lng, search_lat), 4326)::extensions.GEOGRAPHY,
          radius_meters
      )
    ORDER BY distance_meters ASC;
$$;
