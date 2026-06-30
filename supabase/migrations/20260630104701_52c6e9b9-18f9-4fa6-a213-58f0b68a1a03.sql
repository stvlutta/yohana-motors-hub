
ALTER TABLE public.sell_submissions ADD COLUMN IF NOT EXISTS photo_urls text[] NOT NULL DEFAULT '{}'::text[];

CREATE TABLE IF NOT EXISTS public.overseas_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  make text NOT NULL,
  model text NOT NULL,
  year integer NOT NULL,
  price text NOT NULL,
  source_country text,
  mileage text,
  fuel text,
  transmission text,
  body_type text,
  description text,
  source_url text,
  image_url text,
  image_urls text[] NOT NULL DEFAULT '{}'::text[],
  is_available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.overseas_vehicles TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.overseas_vehicles TO authenticated;
GRANT ALL ON public.overseas_vehicles TO service_role;

ALTER TABLE public.overseas_vehicles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view available overseas vehicles" ON public.overseas_vehicles FOR SELECT TO anon USING (is_available = true);
CREATE POLICY "Authenticated can view all overseas vehicles" ON public.overseas_vehicles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert overseas vehicles" ON public.overseas_vehicles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update overseas vehicles" ON public.overseas_vehicles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete overseas vehicles" ON public.overseas_vehicles FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_overseas_vehicles_updated_at BEFORE UPDATE ON public.overseas_vehicles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
