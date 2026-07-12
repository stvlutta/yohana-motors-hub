
-- 0) Update storage policy that depends on public.is_admin so we can drop it later
DROP POLICY IF EXISTS "Admins can view sell photos" ON storage.objects;

-- 1) Recreate the view with security_invoker
DROP VIEW IF EXISTS public.public_sell_listings;
CREATE VIEW public.public_sell_listings
  WITH (security_invoker = true)
AS
  SELECT id, make, model, year, mileage, asking_price, condition, description, photo_urls, created_at
  FROM public.sell_submissions
  WHERE status = 'approved';
GRANT SELECT ON public.public_sell_listings TO anon, authenticated;

-- 2) Private schema helpers
CREATE SCHEMA IF NOT EXISTS app_private;
REVOKE ALL ON SCHEMA app_private FROM PUBLIC;
GRANT USAGE ON SCHEMA app_private TO authenticated, service_role;

CREATE OR REPLACE FUNCTION app_private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION app_private.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT app_private.has_role(auth.uid(), 'admin'::public.app_role) $$;

REVOKE ALL ON FUNCTION app_private.has_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION app_private.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION app_private.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION app_private.is_admin() TO authenticated, service_role;

-- Rewrite RLS policies to use app_private.is_admin()
DROP POLICY IF EXISTS "Admins view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins delete appointments" ON public.appointments;
DROP POLICY IF EXISTS "Admins update appointments" ON public.appointments;
CREATE POLICY "Admins view appointments" ON public.appointments FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins update appointments" ON public.appointments FOR UPDATE TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins delete appointments" ON public.appointments FOR DELETE TO authenticated USING (app_private.is_admin());

DROP POLICY IF EXISTS "Admins view all overseas" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Admins insert overseas" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Admins update overseas" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Admins delete overseas" ON public.overseas_vehicles;
CREATE POLICY "Admins view all overseas" ON public.overseas_vehicles FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins insert overseas" ON public.overseas_vehicles FOR INSERT TO authenticated WITH CHECK (app_private.is_admin());
CREATE POLICY "Admins update overseas" ON public.overseas_vehicles FOR UPDATE TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins delete overseas" ON public.overseas_vehicles FOR DELETE TO authenticated USING (app_private.is_admin());

DROP POLICY IF EXISTS "Admins view sell submissions" ON public.sell_submissions;
DROP POLICY IF EXISTS "Admins update sell submissions" ON public.sell_submissions;
DROP POLICY IF EXISTS "Admins delete sell submissions" ON public.sell_submissions;
CREATE POLICY "Admins view sell submissions" ON public.sell_submissions FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins update sell submissions" ON public.sell_submissions FOR UPDATE TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins delete sell submissions" ON public.sell_submissions FOR DELETE TO authenticated USING (app_private.is_admin());

DROP POLICY IF EXISTS "Admins view all vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins insert vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Admins delete vehicles" ON public.vehicles;
CREATE POLICY "Admins view all vehicles" ON public.vehicles FOR SELECT TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (app_private.is_admin());
CREATE POLICY "Admins update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (app_private.is_admin());

DROP POLICY IF EXISTS "Admins insert vlog" ON public.vlog_videos;
DROP POLICY IF EXISTS "Admins update vlog" ON public.vlog_videos;
DROP POLICY IF EXISTS "Admins delete vlog" ON public.vlog_videos;
CREATE POLICY "Admins insert vlog" ON public.vlog_videos FOR INSERT TO authenticated WITH CHECK (app_private.is_admin());
CREATE POLICY "Admins update vlog" ON public.vlog_videos FOR UPDATE TO authenticated USING (app_private.is_admin());
CREATE POLICY "Admins delete vlog" ON public.vlog_videos FOR DELETE TO authenticated USING (app_private.is_admin());

-- Public read of approved sell submissions through the view
DROP POLICY IF EXISTS "Public can view approved sell submissions" ON public.sell_submissions;
CREATE POLICY "Public can view approved sell submissions"
  ON public.sell_submissions FOR SELECT TO anon, authenticated USING (status = 'approved');

-- Recreate storage policy using app_private helper
CREATE POLICY "Admins can view sell photos" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'sell-photos' AND app_private.is_admin());

-- Drop the now-unreferenced public copies (hides them from API)
DROP FUNCTION IF EXISTS public.is_admin();
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);

-- 3) Reduce discoverability of sensitive tables
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
REVOKE SELECT ON public.user_roles FROM anon, authenticated;
REVOKE SELECT ON public.appointments FROM anon;
REVOKE SELECT ON public.sell_submissions FROM anon;
