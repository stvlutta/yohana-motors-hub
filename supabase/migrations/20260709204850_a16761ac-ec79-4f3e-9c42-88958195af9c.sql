CREATE TABLE public.vlog_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'youtube',
  thumbnail_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT SELECT ON public.vlog_videos TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.vlog_videos TO authenticated;
GRANT ALL ON public.vlog_videos TO service_role;
ALTER TABLE public.vlog_videos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view vlog videos" ON public.vlog_videos FOR SELECT USING (true);
CREATE POLICY "Authenticated can insert vlog videos" ON public.vlog_videos FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update vlog videos" ON public.vlog_videos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete vlog videos" ON public.vlog_videos FOR DELETE TO authenticated USING (true);
CREATE TRIGGER update_vlog_videos_updated_at BEFORE UPDATE ON public.vlog_videos FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();