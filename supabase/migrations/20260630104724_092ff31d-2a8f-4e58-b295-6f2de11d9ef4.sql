
CREATE POLICY "Anyone can upload sell photos" ON storage.objects FOR INSERT TO anon, authenticated WITH CHECK (bucket_id = 'sell-photos');
CREATE POLICY "Authenticated can view sell photos" ON storage.objects FOR SELECT TO authenticated USING (bucket_id = 'sell-photos');
CREATE POLICY "Anon can view sell photos" ON storage.objects FOR SELECT TO anon USING (bucket_id = 'sell-photos');
