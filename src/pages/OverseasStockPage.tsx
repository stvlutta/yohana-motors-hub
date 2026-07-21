import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, ArrowRight, Car, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

const brands = ["Toyota", "Nissan", "Honda", "Mazda", "Subaru", "Mercedes-Benz", "BMW", "Audi", "Range Rover", "Ford", "Suzuki", "Mitsubishi"];

type OverseasVehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; source_country: string | null; image_url: string | null;
  fuel: string | null; transmission: string | null; mileage: string | null;
  source_url: string | null;
  price_cif: string | null; price_delivered_nairobi: string | null;
};

const OverseasStockPage = () => {
  const [vehicles, setVehicles] = useState<OverseasVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("overseas_vehicles").select("*").eq("is_available", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setVehicles(data as OverseasVehicle[]); setLoading(false); });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <section className="py-10 md:py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Overseas Stock / Ready to Import
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Browse quality vehicles ready for import from UK, Japan, South Africa & Australia — landed cost quoted within 24 hours.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Available Overseas Vehicles</h2>
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading...</p>
            ) : vehicles.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg p-12 text-center">
                <Car className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No overseas vehicles listed at the moment. Contact us with the link to a car you've found abroad and we'll source it for you.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {vehicles.map((v) => (
                  <Link key={v.id} to={`/inventory/${v.id}`} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg overflow-hidden hover:shadow-elevated hover:border-primary/40 transition-all group">
                    <div className="aspect-video bg-muted overflow-hidden">
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Car className="h-12 w-12 text-muted-foreground/40" /></div>
                      )}
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-foreground">{v.name}</h3>
                      <p className="text-sm text-muted-foreground">{v.year} • {v.make} {v.model}</p>
                      {v.source_country && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.source_country}</p>
                      )}
                      <div className="mt-3 space-y-1.5 pt-3 border-t border-border">
                        {v.price_cif ? (
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">CIF</span>
                            <span className="text-primary font-heading font-bold">{formatPrice(v.price_cif)}</span>
                          </div>
                        ) : null}
                        {v.price_delivered_nairobi ? (
                          <div className="flex items-baseline justify-between gap-2">
                            <span className="text-xs uppercase tracking-wide text-muted-foreground">Delivered to Nairobi</span>
                            <span className="text-primary font-heading font-bold">{formatPrice(v.price_delivered_nairobi)}</span>
                          </div>
                        ) : null}
                        {!v.price_cif && !v.price_delivered_nairobi && v.price ? (
                          <p className="text-primary font-heading font-bold text-lg">{formatPrice(v.price)}</p>
                        ) : null}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">Popular Brands We Source</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {brands.map((brand) => (
                  <span key={brand} className="bg-muted text-foreground font-heading font-semibold text-sm px-5 py-2.5 rounded-full border border-border">
                    {brand}
                  </span>
                ))}
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-lg p-8 border border-white/80 shadow-card text-center">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">How to Order</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Have a specific car in mind from the UK, Japan, South Africa, or Australia? Send us the details and we'll give you a landed cost within 24 hours.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://wa.me/254714007122" target="_blank" rel="noopener noreferrer">
                    <Button variant="hero" size="lg" className="gap-2">
                      WhatsApp Us <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/appointment?service=Direct%20Import%20Inquiry">
                    <Button variant="navy" size="lg">Book Consultation</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OverseasStockPage;
