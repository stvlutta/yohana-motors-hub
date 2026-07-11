import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Users, Car, Calendar, Gauge } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

type Listing = {
  id: string; make: string; model: string; year: string;
  mileage: string; asking_price: string; photo_urls: string[] | null;
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const CommunityInventoryPreview = () => {
  const [listings, setListings] = useState<Listing[]>([]);

  useEffect(() => {
    supabase.rpc("get_public_sell_listings").then(({ data }) => {
      if (data) setListings(shuffle(data as Listing[]).slice(0, 4));
    });
  }, []);

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2 flex items-center justify-center gap-2">
            <Users className="h-4 w-4" /> Sell on Behalf
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Client Inventory
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Cars listed by our clients — we handle the sale on their behalf. Have one to sell? Upload yours in minutes.
          </p>
        </div>

        {listings.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-10 text-center max-w-2xl mx-auto">
            <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground mb-6">No client cars listed yet. Be the first — upload your vehicle and we'll help you sell it.</p>
            <Link to="/sell"><Button variant="hero" size="lg">Upload Your Car</Button></Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((l) => (
                <Link
                  to="/community-inventory"
                  key={l.id}
                  className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border group block"
                >
                  <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                    {l.photo_urls && l.photo_urls[0] ? (
                      <img src={l.photo_urls[0]} alt={`${l.make} ${l.model}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <Car className="h-12 w-12 text-muted-foreground/30" />
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{l.make} {l.model}</h3>
                    <p className="text-primary font-semibold text-sm mb-3">{formatPrice(l.asking_price)}</p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{l.year}</span>
                      {l.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{l.mileage}</span>}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="text-center mt-10 flex flex-wrap gap-3 justify-center">
              <Link to="/community-inventory"><Button variant="navy" size="lg" className="px-8">View Client Cars</Button></Link>
              <Link to="/sell"><Button variant="hero" size="lg" className="px-8">Upload Your Car</Button></Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default CommunityInventoryPreview;
