CREATE OR REPLACE VIEW public.public_sell_listings
WITH (security_invoker = false) AS
SELECT id, make, model, year, mileage, asking_price, condition, description, photo_urls, created_at
FROM public.sell_submissions
WHERE status = 'approved';

GRANT SELECT ON public.public_sell_listings TO anon, authenticated;