CREATE POLICY "Authenticated users can delete vehicles"
ON public.vehicles FOR DELETE TO authenticated
USING (true);