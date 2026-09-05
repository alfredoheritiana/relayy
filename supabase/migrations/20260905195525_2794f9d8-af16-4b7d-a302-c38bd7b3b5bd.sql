CREATE OR REPLACE FUNCTION private.enforce_lead_status_only_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL THEN
    RETURN NEW;
  END IF;

  IF NEW.status IS DISTINCT FROM OLD.status THEN
    NEW.updated_at := now();
  END IF;

  IF (to_jsonb(NEW) - 'status' - 'updated_at') IS DISTINCT FROM (to_jsonb(OLD) - 'status' - 'updated_at') THEN
    RAISE EXCEPTION 'only the status column can be updated from the application';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS leads_status_only_update ON public.leads;
CREATE TRIGGER leads_status_only_update
BEFORE UPDATE ON public.leads
FOR EACH ROW EXECUTE FUNCTION private.enforce_lead_status_only_update();