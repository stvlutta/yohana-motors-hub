ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS engine_cc integer;
ALTER TABLE public.overseas_vehicles ADD COLUMN IF NOT EXISTS engine_cc integer;