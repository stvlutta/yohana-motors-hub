import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, Globe, MapPin, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

type OverseasVehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string | null; source_country: string | null; image_url: string | null;
  price_cif: string | null; price_delivered_nairobi: string | null;
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const OverseasStockPreview = () => {
  const [vehicles, setVehicles] = useState<OverseasVehicle[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    supabase
      .from("overseas_vehicles")
      .select("id, name, make, model, year, price, source_country, image_url, price_cif, price_delivered_nairobi")
      .eq("is_available", true)
      .then(({ data }) => {
        if (data) setVehicles(shuffle(data as OverseasVehicle[]).slice(0, 5));
      });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2 flex items-center justify-center gap-2">
            <Globe className="h-4 w-4" /> Overseas Stock
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Ready to Import
          </h2>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Quality units sourced from Japan, UK, SA & Australia — landed cost quoted within 24 hours.
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-card border border-border rounded-lg p-10 text-center max-w-2xl mx-auto">
            <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground">No overseas stock listed right now. Check back soon or send us a link to a car you'd like sourced.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {vehicles.map((v) => (
              <Link
                to="/overseas-stock"
                key={v.id}
                className="bg-white/60 backdrop-blur-xl rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-white/80 group block"
              >
                <div className="h-40 bg-muted flex items-center justify-center overflow-hidden">
                  {v.image_url ? (
                    <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Car className="h-10 w-10 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-heading font-bold text-base text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{v.name}</h3>
                  <p className="text-xs text-muted-foreground mb-2">{v.year} • {v.make}</p>
                  {v.source_country && (
                    <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.source_country}</p>
                  )}
                  <div className="pt-2 border-t border-border space-y-0.5">
                    {v.price_cif && (
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">CIF</span>
                        <span className="text-primary font-heading font-bold text-sm">{formatPrice(v.price_cif)}</span>
                      </div>
                    )}
                    {v.price_delivered_nairobi && (
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="text-[10px] uppercase tracking-wide text-muted-foreground">Delivered</span>
                        <span className="text-primary font-heading font-bold text-sm">{formatPrice(v.price_delivered_nairobi)}</span>
                      </div>
                    )}
                    {!v.price_cif && !v.price_delivered_nairobi && v.price && (
                      <p className="text-primary font-heading font-bold text-sm">{formatPrice(v.price)}</p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/overseas-stock">
            <Button variant="navy" size="lg" className="px-10">View All Overseas Stock</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default OverseasStockPreview;
