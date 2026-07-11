DROP VIEW IF EXISTS public.public_sell_listings;

CREATE OR REPLACE FUNCTION public.get_public_sell_listings()
RETURNS TABLE (
  id uuid,
  make text,
  model text,
  year text,
  mileage text,
  asking_price text,
  condition text,
  description text,
  photo_urls text[],
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, make, model, year, mileage, asking_price, condition, description, photo_urls, created_at
  FROM public.sell_submissions
  WHERE status = 'approved'
  ORDER BY created_at DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_public_sell_listings() TO anon, authenticated;