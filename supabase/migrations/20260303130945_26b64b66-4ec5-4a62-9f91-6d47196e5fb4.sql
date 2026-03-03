-- Allow authenticated users to update appointments
CREATE POLICY "Authenticated users can update appointments"
ON public.appointments FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);

-- Allow authenticated users to update sell submissions
CREATE POLICY "Authenticated users can update sell submissions"
ON public.sell_submissions FOR UPDATE TO authenticated
USING (true) WITH CHECK (true);