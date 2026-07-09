import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { Play, Youtube, Instagram, Music2, Film } from "lucide-react";

type Video = {
  id: string;
  title: string;
  url: string;
  platform: string;
  thumbnail_url: string | null;
  description: string | null;
};

const platformIcon = (p: string) => {
  const key = p.toLowerCase();
  if (key.includes("you")) return <Youtube className="h-4 w-4" />;
  if (key.includes("insta")) return <Instagram className="h-4 w-4" />;
  if (key.includes("tik")) return <Music2 className="h-4 w-4" />;
  return <Film className="h-4 w-4" />;
};

const platformLabel = (p: string) => {
  const key = p.toLowerCase();
  if (key.includes("you")) return "YouTube";
  if (key.includes("insta")) return "Instagram";
  if (key.includes("tik")) return "TikTok";
  return p;
};

// Best-effort YouTube thumbnail auto-fill
const autoThumb = (url: string, platform: string): string | null => {
  if (!platform.toLowerCase().includes("you")) return null;
  const m = url.match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{6,})/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
};

const VlogPage = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("vlog_videos" as never)
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setVideos(data as Video[]);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Film className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">VLOG</h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Reels, walkarounds and stories from our Instagram, YouTube and TikTok.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading videos...</p>
            ) : videos.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center max-w-xl mx-auto">
                <Film className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No videos yet. Check back soon.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((v) => {
                  const thumb = v.thumbnail_url || autoThumb(v.url, v.platform);
                  return (
                    <a
                      key={v.id}
                      href={v.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-card rounded-lg overflow-hidden shadow-card border border-border hover:shadow-elevated hover:border-primary/40 transition-all"
                    >
                      <div className="relative aspect-video bg-muted overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Film className="h-10 w-10 text-muted-foreground/40" /></div>
                        )}
                        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center opacity-90 group-hover:bg-foreground/40 transition-colors">
                          <div className="w-14 h-14 rounded-full gradient-red flex items-center justify-center">
                            <Play className="h-6 w-6 text-primary-foreground ml-1" />
                          </div>
                        </div>
                        <span className="absolute top-2 right-2 bg-background/90 text-foreground text-xs font-semibold px-2 py-1 rounded flex items-center gap-1">
                          {platformIcon(v.platform)} {platformLabel(v.platform)}
                        </span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-heading font-bold text-foreground line-clamp-2">{v.title}</h3>
                        {v.description && <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{v.description}</p>}
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default VlogPage;
