import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Star, Quote, X } from "lucide-react";

type Post = { type: string; title: string; excerpt: string; date: string; image: string; body: string };

const blogPosts: Post[] = [
  {
    type: "article",
    title: "Top 10 Cars to Import from Japan in 2026",
    excerpt: "Discover the most popular and reliable Japanese vehicles for the Kenyan market...",
    date: "Feb 20, 2026",
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0571?w=800&h=400&fit=crop",
    body: `Japan remains the #1 source of quality used vehicles for Kenyan buyers — and for good reason. Strict Shaken inspections, low mileage, well-maintained service histories and competitive prices give Japanese imports a clear edge.\n\nFor 2026 our top picks are: Toyota Land Cruiser Prado, Toyota Hilux Surf, Mazda CX-5, Subaru Forester, Toyota Vitz, Honda Fit, Nissan X-Trail, Toyota Harrier, Mazda Demio, and the Suzuki Escudo. Each balances reliability, parts availability in Kenya and resale value.\n\nWhen ordering from Japan via Yohana Automotive we handle auction sheet verification, pre-shipment inspection (QISJ), shipping to Mombasa, KRA clearance, NTSA registration and delivery to your door — typically in 6–8 weeks.`,
  },
  {
    type: "article",
    title: "Understanding Kenya's Import Duty Structure",
    excerpt: "A comprehensive breakdown of all taxes and levies when importing a vehicle...",
    date: "Feb 15, 2026",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop",
    body: `Importing a car into Kenya attracts five main charges, all calculated on the CIF (Cost + Insurance + Freight) value as determined by KRA's CRSP database:\n\n• Import Duty: 25–35% of CIF\n• Excise Duty: 20–35% based on engine size, age and fuel type\n• VAT: 16% on (CIF + Import Duty + Excise)\n• IDF Fee: 3.5% of CIF\n• Railway Development Levy: 2% of CIF\n\nOn top of these, budget for shipping (USD 1,200–2,500), port clearance, IDF processing and NTSA registration (~KSh 80,000–150,000 combined). The vehicle must also be 8 years old or less from its first registration date.\n\nUse our calculator page to get an instant estimate, or send us the listing and we'll quote the full landed cost within 24 hours.`,
  },
  {
    type: "article",
    title: "How to Qualify for Duty-Free Vehicle Import",
    excerpt: "Everything you need to know about duty exemptions for returning residents...",
    date: "Feb 10, 2026",
    image: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=400&fit=crop",
    body: `Kenya allows duty-free vehicle imports for four key groups:\n\n1. Returning Residents — Kenyans who lived abroad continuously for 2+ years and are returning permanently. The vehicle must have been owned and registered in your name for at least 12 months before shipping.\n\n2. Diplomats & Accredited Missions — full duty exemption through PRO1B procedures coordinated with the Ministry of Foreign Affairs.\n\n3. Expatriates on Work Permits — eligible for personal effects exemption, including one vehicle, under specific KRA guidelines.\n\n4. Persons With Disabilities (PWDs) — registered PWDs can import one specially adapted vehicle duty-free once every four years through NCPWD.\n\nYohana Automotive handles the documentation, KRA liaison and NTSA registration end-to-end. Book a consultation and we'll confirm your eligibility within one working day.`,
  },
];

const testimonials = [
  { name: "James Mwangi", role: "Returning Resident", text: "Yohana Automotive made my duty-free import seamless. From Japan to Nairobi in 6 weeks!", rating: 5 },
  { name: "Dr. Sarah Ochieng", role: "Vehicle Buyer", text: "Incredible service and transparent pricing. Got my Land Cruiser at an unbeatable price.", rating: 5 },
  { name: "Peter Kamau", role: "Diplomat", text: "They handled all the paperwork for my diplomatic import. Highly professional team.", rating: 5 },
];

const videoContent = [
  { title: "2026 Toyota Prado Walkaround", thumbnail: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&h=250&fit=crop", url: "https://www.instagram.com/yohanautomotive/" },
  { title: "Why Import from Japan?", thumbnail: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=400&h=250&fit=crop", url: "https://www.instagram.com/yohanautomotive/" },
];

const BlogPage = () => {
  const [openPost, setOpenPost] = useState<Post | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">Blog & Reviews</h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Stay updated with the latest automotive news, reviews, and customer stories.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Latest Articles</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {blogPosts.map((post) => (
                <button
                  type="button"
                  key={post.title}
                  onClick={() => setOpenPost(post)}
                  className="text-left bg-card rounded-lg overflow-hidden shadow-card border border-border group cursor-pointer hover:shadow-elevated hover:border-primary/40 transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5">
                    <span className="text-xs text-primary font-heading font-semibold uppercase">{post.type}</span>
                    <h3 className="font-heading font-bold text-lg text-foreground mt-1 mb-2">{post.title}</h3>
                    <p className="text-muted-foreground text-sm mb-3">{post.excerpt}</p>
                    <span className="text-xs text-muted-foreground">{post.date}</span>
                    <p className="text-xs text-primary font-semibold mt-3">Read article →</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

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

        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8">Video Content</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {videoContent.map((v) => (
                <a key={v.title} href={v.url} target="_blank" rel="noopener noreferrer" className="relative rounded-lg overflow-hidden shadow-card group cursor-pointer block">
                  <img src={v.thumbnail} alt={v.title} className="w-full h-64 object-cover" />
                  <div className="absolute inset-0 bg-foreground/40 flex items-center justify-center group-hover:bg-foreground/50 transition-colors">
                    <div className="w-16 h-16 rounded-full gradient-red flex items-center justify-center">
                      <Play className="h-7 w-7 text-primary-foreground ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="font-heading font-bold text-lg text-primary-foreground">{v.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {openPost && (
        <div className="fixed inset-0 z-50 bg-foreground/70 flex items-start justify-center overflow-y-auto p-4" onClick={() => setOpenPost(null)}>
          <div className="bg-card max-w-3xl w-full rounded-lg shadow-elevated my-8 overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative h-64">
              <img src={openPost.image} alt={openPost.title} className="w-full h-full object-cover" />
              <button onClick={() => setOpenPost(null)} className="absolute top-3 right-3 bg-background/80 hover:bg-background rounded-full p-2">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 md:p-8">
              <span className="text-xs text-primary font-heading font-semibold uppercase">{openPost.type} • {openPost.date}</span>
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mt-2 mb-4">{openPost.title}</h2>
              <div className="text-foreground/80 whitespace-pre-line leading-relaxed">{openPost.body}</div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BlogPage;
