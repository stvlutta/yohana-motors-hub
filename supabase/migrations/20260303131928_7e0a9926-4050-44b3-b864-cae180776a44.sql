
-- Create storage bucket for vehicle images
INSERT INTO storage.buckets (id, name, public) VALUES ('vehicle-images', 'vehicle-images', true);

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload vehicle images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'vehicle-images');

-- Allow authenticated users to update/delete their uploads
CREATE POLICY "Authenticated users can update vehicle images"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'vehicle-images');

CREATE POLICY "Authenticated users can delete vehicle images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'vehicle-images');

-- Allow public read access
CREATE POLICY "Public can view vehicle images"
ON storage.objects FOR SELECT TO public
USING (bucket_id = 'vehicle-images');

-- Add image_url column to vehicles
ALTER TABLE public.vehicles ADD COLUMN image_url text;
