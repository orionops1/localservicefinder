-- ==============================================================================
-- Migration: 20261112000005_review_moderation_policies.sql
-- Description: Review moderation policies and customer review access
-- ==============================================================================

-- 1. Allow admins and moderators to inspect and moderate all reviews
CREATE POLICY "Admins manage all reviews" ON public.reviews
FOR ALL USING (public.is_admin());

-- 2. Allow customers to read their own reviews in any moderation state
CREATE POLICY "Customers view own submitted reviews" ON public.reviews
FOR SELECT USING (customer_id = auth.uid());

-- 3. Providers can view reviews submitted for their business
CREATE POLICY "Providers view business reviews" ON public.reviews
FOR SELECT USING (public.is_business_member(business_id) OR status = 'published');
