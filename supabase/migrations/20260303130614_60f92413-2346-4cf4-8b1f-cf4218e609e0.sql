-- Drop the restrictive SELECT policy that only shows available vehicles
DROP POLICY IF EXISTS "Anyone can view available vehicles" ON public.vehicles;

-- Authenticated users can see ALL vehicles (including sold)
CREATE POLICY "Authenticated users can view all vehicles"
ON public.vehicles FOR SELECT TO authenticated
USING (true);

-- Public users can only see available vehicles
CREATE POLICY "Public can view available vehicles"
ON public.vehicles FOR SELECT TO anon
USING (is_available = true);