
-- Role system
DO $$ BEGIN CREATE TYPE public.app_role AS ENUM ('admin','user'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users read own roles" ON public.user_roles;
CREATE POLICY "users read own roles" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT public.has_role(auth.uid(), 'admin'::public.app_role) $$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, service_role;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;

-- Seed known admin
INSERT INTO public.user_roles (user_id, role) VALUES ('fba6dbfc-12c3-40de-a171-aea7f89c18e6','admin') ON CONFLICT DO NOTHING;

-- Replace public sell listings function with a view (definer semantics)
DROP FUNCTION IF EXISTS public.get_public_sell_listings();
DROP VIEW IF EXISTS public.public_sell_listings;
CREATE VIEW public.public_sell_listings
WITH (security_invoker = off) AS
SELECT id, make, model, year, mileage, asking_price, condition, description, photo_urls, created_at
FROM public.sell_submissions
WHERE status = 'approved';
GRANT SELECT ON public.public_sell_listings TO anon, authenticated;

-- Tighten vehicle policies to admin-only for writes and admin-only for full read
DROP POLICY IF EXISTS "Authenticated users can view all vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Only authenticated users can manage vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Only authenticated users can update vehicles" ON public.vehicles;
DROP POLICY IF EXISTS "Authenticated users can delete vehicles" ON public.vehicles;
CREATE POLICY "Admins view all vehicles" ON public.vehicles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert vehicles" ON public.vehicles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update vehicles" ON public.vehicles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete vehicles" ON public.vehicles FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can view all overseas vehicles" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Authenticated can insert overseas vehicles" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Authenticated can update overseas vehicles" ON public.overseas_vehicles;
DROP POLICY IF EXISTS "Authenticated can delete overseas vehicles" ON public.overseas_vehicles;
CREATE POLICY "Admins view all overseas" ON public.overseas_vehicles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins insert overseas" ON public.overseas_vehicles FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update overseas" ON public.overseas_vehicles FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete overseas" ON public.overseas_vehicles FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Authenticated can insert vlog videos" ON public.vlog_videos;
DROP POLICY IF EXISTS "Authenticated can update vlog videos" ON public.vlog_videos;
DROP POLICY IF EXISTS "Authenticated can delete vlog videos" ON public.vlog_videos;
CREATE POLICY "Admins insert vlog" ON public.vlog_videos FOR INSERT TO authenticated WITH CHECK (public.is_admin());
CREATE POLICY "Admins update vlog" ON public.vlog_videos FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete vlog" ON public.vlog_videos FOR DELETE TO authenticated USING (public.is_admin());

DROP POLICY IF EXISTS "Only authenticated users can view appointments" ON public.appointments;
DROP POLICY IF EXISTS "Authenticated users can update appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Admins view appointments" ON public.appointments FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update appointments" ON public.appointments FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete appointments" ON public.appointments FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Public can create appointments" ON public.appointments FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 200 AND char_length(phone) BETWEEN 3 AND 50 AND char_length(service) BETWEEN 1 AND 200);

DROP POLICY IF EXISTS "Only authenticated users can view sell submissions" ON public.sell_submissions;
DROP POLICY IF EXISTS "Authenticated users can update sell submissions" ON public.sell_submissions;
DROP POLICY IF EXISTS "Anyone can create sell submissions" ON public.sell_submissions;
CREATE POLICY "Admins view sell submissions" ON public.sell_submissions FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins update sell submissions" ON public.sell_submissions FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "Admins delete sell submissions" ON public.sell_submissions FOR DELETE TO authenticated USING (public.is_admin());
CREATE POLICY "Public can create sell submissions" ON public.sell_submissions FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(name) BETWEEN 1 AND 200 AND char_length(email) BETWEEN 3 AND 200 AND char_length(phone) BETWEEN 3 AND 50 AND char_length(make) BETWEEN 1 AND 100 AND char_length(model) BETWEEN 1 AND 100);

-- Revoke anon read on PII tables (they only need INSERT)
REVOKE SELECT ON public.sell_submissions FROM anon;
REVOKE SELECT ON public.appointments FROM anon;

-- Storage: drop overly-broad listing policies (public bucket direct URLs still work without SELECT on storage.objects)
DROP POLICY IF EXISTS "Public can view vehicle images" ON storage.objects;
DROP POLICY IF EXISTS "Anon can view sell photos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated can view sell photos" ON storage.objects;
DROP POLICY IF EXISTS "Anyone can upload sell photos" ON storage.objects;

CREATE POLICY "Admins can view sell photos" ON storage.objects
  FOR SELECT TO authenticated USING (bucket_id = 'sell-photos' AND public.is_admin());

CREATE POLICY "Public can upload sell photos" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'sell-photos');
