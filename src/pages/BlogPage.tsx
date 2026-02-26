import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Star, Quote } from "lucide-react";

const blogPosts = [
  {
    type: "article",
    title: "Top 10 Cars to Import from Japan in 2026",
    excerpt: "Discover the most popular and reliable Japanese vehicles for the Kenyan market...",
    date: "Feb 20, 2026",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=400&h=250&fit=crop",
  },
  {
    type: "article",
    title: "Understanding Kenya's Import Duty Structure",
    excerpt: "A comprehensive breakdown of all taxes and levies when importing a vehicle...",
    date: "Feb 15, 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=250&fit=crop",
  },
  {
    type: "article",
    title: "How to Qualify for Duty-Free Vehicle Import",
    excerpt: "Everything you need to know about duty exemptions for returning residents...",
    date: "Feb 10, 2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=250&fit=crop",
  },
];

const testimonials = [
  {
    name: "James Mwangi",
    role: "Returning Resident",
    text: "Yohana Automotive made my duty-free import seamless. From Japan to Nairobi in 6 weeks!",
    rating: 5,
  },
  {
    name: "Dr. Sarah Ochieng",
    role: "Vehicle Buyer",
    text: "Incredible service and transparent pricing. Got my Land Cruiser at an unbeatable price.",
    rating: 5,
  },
  {
    name: "Peter Kamau",
    role: "Diplomat",
    text: "They handled all the paperwork for my diplomatic import. Highly professional team.",
    rating: 5,
  },
];

const videoContent = [
  {
    title: "2026 Toyota Prado Walkaround",
    thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop",
  },
  {
    title: "Why Import from Japan?",
    thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop",
  },
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Blog & Reviews
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Stay updated with the latest automotive news, reviews, and customer stories.
            </p>
          </div>
        </section>

        {/* Articles */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <article key={post.title} className="bg-card rounded-lg overflow-hidden shadow-card border border-border group cursor-pointer hover:shadow-elevated transition-all">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-heading font-semibold uppercase">{post.type}</span>
                    <h3 className="font-heading font-bold text-lg text-foreground mt-1 mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Customer Testimonials</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-card rounded-lg p-6 shadow-card border border-border">
                  <Quote className="h-8 w-8 text-primary/20 mb-3" />
                  <p className="text-foreground text-sm mb-4 italic">"{t.text}"</p>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="font-heading font-bold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Video Content */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Video Content</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videoContent.map((v) => (
                <div key={v.title} className="relative rounded-lg overflow-hidden shadow-card group cursor-pointer">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center group-hover:bg-foreground/50 transition-colors">
                    <div className="w-16 h-16 rounded-full gradient-red flex items-center justify-center">
                      <Play className="h-7 w-7 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-bold text-lg text-primary-foreground">{v.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BlogPage;
