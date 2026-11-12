-- ==============================================================================
-- Sri Lanka Local Services Finder — Migration 002: Row Level Security (RLS)
-- ==============================================================================

-- 1. Enable RLS on all exposed tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.localities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_category_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_service_areas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provider_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_status_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favourites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 2. Helper functions for role and membership verification
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_verifier_or_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid()
      AND role IN ('admin', 'super_admin', 'verifier')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_business_member(biz_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.business_members
    WHERE business_id = biz_id
      AND user_id = auth.uid()
      AND status = 'active'
  );
$$;

-- 3. Public Taxonomy Access (Read-only for all, write for admins)
CREATE POLICY "Public read active provinces" ON public.provinces FOR SELECT USING (true);
CREATE POLICY "Public read active districts" ON public.districts FOR SELECT USING (true);
CREATE POLICY "Public read active localities" ON public.localities FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active categories" ON public.service_categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read category aliases" ON public.service_category_aliases FOR SELECT USING (true);

-- 4. Profiles
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 5. User Roles (Read own, manage by admin only)
CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage user roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- 6. Businesses
-- Public: can read approved businesses
CREATE POLICY "Public read approved businesses" ON public.businesses
FOR SELECT USING (status = 'approved');

-- Business members: can read own business in any status
CREATE POLICY "Members read own business" ON public.businesses
FOR SELECT USING (public.is_business_member(id) OR public.is_admin());

-- Business owners: can update own business
CREATE POLICY "Owners update own business" ON public.businesses
FOR UPDATE USING (public.is_business_member(id) OR public.is_admin());

-- 7. Business Members
CREATE POLICY "Members view colleagues" ON public.business_members
FOR SELECT USING (public.is_business_member(business_id) OR public.is_admin());

-- 8. Provider Services
CREATE POLICY "Public read active provider services" ON public.provider_services
FOR SELECT USING (
  is_active = true 
  AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.status = 'approved')
);

CREATE POLICY "Members manage provider services" ON public.provider_services
FOR ALL USING (public.is_business_member(business_id) OR public.is_admin());

-- 9. Provider Service Areas
CREATE POLICY "Public read active service areas" ON public.provider_service_areas
FOR SELECT USING (
  is_active = true 
  AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.status = 'approved')
);

CREATE POLICY "Members manage service areas" ON public.provider_service_areas
FOR ALL USING (public.is_business_member(business_id) OR public.is_admin());

-- 10. Provider Media
CREATE POLICY "Public read approved media" ON public.provider_media
FOR SELECT USING (
  moderation_status = 'approved'
  AND EXISTS (SELECT 1 FROM public.businesses b WHERE b.id = business_id AND b.status = 'approved')
);

CREATE POLICY "Members manage media" ON public.provider_media
FOR ALL USING (public.is_business_member(business_id) OR public.is_admin());

-- 11. Verification Submissions (Private)
CREATE POLICY "Owner read own verification status" ON public.verification_submissions
FOR SELECT USING (public.is_business_member(business_id) OR public.is_verifier_or_admin());

CREATE POLICY "Owner create verification submission" ON public.verification_submissions
FOR INSERT WITH CHECK (public.is_business_member(business_id) AND auth.uid() = submitted_by);

CREATE POLICY "Verifiers manage verification submissions" ON public.verification_submissions
FOR UPDATE USING (public.is_verifier_or_admin());

-- 12. Leads
CREATE POLICY "Customer can view own leads" ON public.leads
FOR SELECT USING (customer_id = auth.uid());

CREATE POLICY "Provider can view assigned leads" ON public.leads
FOR SELECT USING (public.is_business_member(business_id));

CREATE POLICY "Customer can create lead" ON public.leads
FOR INSERT WITH CHECK (customer_id = auth.uid());

CREATE POLICY "Provider can update assigned lead status" ON public.leads
FOR UPDATE USING (public.is_business_member(business_id));

-- 13. Reviews
CREATE POLICY "Public read published reviews" ON public.reviews
FOR SELECT USING (status = 'published');

CREATE POLICY "Customer create review for completed lead" ON public.reviews
FOR INSERT WITH CHECK (
  customer_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = lead_id 
      AND l.customer_id = auth.uid() 
      AND l.status = 'completed'
  )
);

-- 14. Favourites
CREATE POLICY "Customer manage own favourites" ON public.favourites
FOR ALL USING (customer_id = auth.uid());

-- 15. Admin Audit Logs
CREATE POLICY "Admins read audit logs" ON public.admin_audit_logs
FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins write audit logs" ON public.admin_audit_logs
FOR INSERT WITH CHECK (public.is_admin());
