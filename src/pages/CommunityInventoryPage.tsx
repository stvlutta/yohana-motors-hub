import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Users, Car, Calendar, Gauge, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

type Listing = {
  id: string; make: string; model: string; year: string;
  mileage: string; asking_price: string; condition: string;
  description: string | null; photo_urls: string[] | null;
};

const CommunityInventoryPage = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (supabase.from as unknown as (n: string) => { select: (c: string) => { order: (col: string, opts: { ascending: boolean }) => Promise<{ data: Listing[] | null }> } })("public_sell_listings")
      .select("id, make, model, year, mileage, asking_price, condition, description, photo_urls")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setListings(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <section className="py-10 md:py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Client Inventory
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Vehicles listed by fellow Kenyans — we handle the sale on their behalf. Interested? Contact us and we'll connect you with the seller.
            </p>
            <div className="mt-6">
              <Link to="/sell"><Button variant="hero" size="lg" className="gap-2"><Upload className="h-4 w-4" /> Upload Your Car</Button></Link>
            </div>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading...</p>
            ) : listings.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg p-12 text-center max-w-2xl mx-auto">
                <Car className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground mb-6">No client cars listed yet. Be the first!</p>
                <Link to="/sell"><Button variant="hero" size="lg">Upload Your Car</Button></Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {listings.map((l) => (
                  <div key={l.id} className="bg-white/60 backdrop-blur-xl rounded-lg overflow-hidden shadow-card border border-white/80">
                    <div className="h-56 bg-muted flex items-center justify-center overflow-hidden">
                      {l.photo_urls && l.photo_urls[0] ? (
                        <img src={l.photo_urls[0]} alt={`${l.make} ${l.model}`} className="w-full h-full object-cover" />
                      ) : (
                        <Car className="h-16 w-16 text-muted-foreground/30" />
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-lg text-foreground mb-1">{l.make} {l.model}</h3>
                      <p className="text-primary font-semibold mb-3">{formatPrice(l.asking_price)}</p>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{l.year}</span>
                        {l.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{l.mileage} km</span>}
                        {l.condition && <span className="bg-muted px-2 py-0.5 rounded">{l.condition}</span>}
                      </div>
                      {l.description && <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{l.description}</p>}
                      <a href="https://wa.me/254714007122" target="_blank" rel="noopener noreferrer">
                        <Button variant="hero" size="sm" className="w-full">Enquire via WhatsApp</Button>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityInventoryPage;
