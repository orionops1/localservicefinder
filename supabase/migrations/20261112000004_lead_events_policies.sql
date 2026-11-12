-- ==============================================================================
-- Migration: 20261112000004_lead_events_policies.sql
-- Description: RLS policies and audit trigger for lead status events
-- ==============================================================================

-- 1. Read policy for lead status events
CREATE POLICY "Members or customer can view lead status events" ON public.lead_status_events
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = lead_id 
      AND (l.customer_id = auth.uid() OR public.is_business_member(l.business_id) OR public.is_admin())
  )
);

-- 2. Insert policy for lead status events
CREATE POLICY "Members or customer can insert lead status events" ON public.lead_status_events
FOR INSERT WITH CHECK (
  changed_by = auth.uid() 
  AND EXISTS (
    SELECT 1 FROM public.leads l 
    WHERE l.id = lead_id 
      AND (l.customer_id = auth.uid() OR public.is_business_member(l.business_id) OR public.is_admin())
  )
);

-- 3. Automatic lead status transition audit trigger
CREATE OR REPLACE FUNCTION public.handle_lead_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF (OLD.status IS DISTINCT FROM NEW.status) THEN
    INSERT INTO public.lead_status_events (lead_id, changed_by, from_status, to_status, note)
    VALUES (
      NEW.id, 
      COALESCE(auth.uid(), NEW.customer_id), 
      OLD.status, 
      NEW.status, 
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_on_lead_status_changed ON public.leads;
CREATE TRIGGER tr_on_lead_status_changed
  AFTER UPDATE OF status ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_lead_status_change();
