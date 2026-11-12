-- ==============================================================================
-- Migration: 20261112000003_provider_portal_policies.sql
-- Description: Provider portal insert policies and automatic owner membership trigger
-- ==============================================================================

-- 1. Allow authenticated users to create a new business owned by themselves
CREATE POLICY "Authenticated users can create business" ON public.businesses
FOR INSERT WITH CHECK (auth.uid() = owner_id);

-- 2. Allow owners and admins to add and manage business members
CREATE POLICY "Owners can add business members" ON public.business_members
FOR INSERT WITH CHECK (public.is_business_member(business_id) OR public.is_admin());

CREATE POLICY "Owners can update business members" ON public.business_members
FOR UPDATE USING (public.is_business_member(business_id) OR public.is_admin());

CREATE POLICY "Owners can remove business members" ON public.business_members
FOR DELETE USING (public.is_business_member(business_id) OR public.is_admin());

-- 3. Automatic business owner membership trigger
CREATE OR REPLACE FUNCTION public.handle_new_business_owner()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.business_members (business_id, user_id, member_role, status)
  VALUES (NEW.id, NEW.owner_id, 'owner', 'active')
  ON CONFLICT (business_id, user_id) DO UPDATE SET member_role = 'owner', status = 'active';
  
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_on_business_created_owner ON public.businesses;
CREATE TRIGGER tr_on_business_created_owner
  AFTER INSERT ON public.businesses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_business_owner();
