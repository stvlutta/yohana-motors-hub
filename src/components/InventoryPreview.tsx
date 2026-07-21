import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar, Car, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

type Vehicle = {
  id: string; name: string; year: number; price: string;
  mileage: string | null; fuel: string | null; image_url: string | null;
};

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// GT3 RS-style side-profile silhouette
const GT3RSSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="72"
    height="24"
    viewBox="0 0 120 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Porsche GT3 RS silhouette"
  >
    {/* Main body silhouette */}
    <path
      d="M2 29 C2 26 5 24 8 24 L14 23 C16 22 18 20 22 19 L38 18 C40 18 42 18 44 18 L58 19 C60 19 62 18 64 17 L76 16 C80 16 84 17 87 18 L92 20 C96 22 98 24 99 26 L99 31 C99 32 97 33 95 33 L92 33 C91 30 89 28 86 28 C83 28 81 30 80 33 L38 33 C37 30 35 28 32 28 C29 28 27 30 26 33 L6 33 C4 33 2 32 2 30 Z"
      fill="currentColor"
    />
    {/* Rear wing (RS signature) */}
    <path
      d="M84 16 L84 10 C84 9 85 8 87 8 L105 7 C107 7 108 8 108 10 L108 14 C108 15 107 16 105 16 L100 16 L100 18 L88 18 L88 16 Z"
      fill="currentColor"
    />
    {/* Side intake */}
    <path
      d="M62 22 L72 22 L72 26 L62 26 Z"
      fill="currentColor"
      fillOpacity="0.5"
    />
    {/* Front splitter */}
    <path
      d="M2 30 L0 32 L2 32 Z"
      fill="currentColor"
    />
    {/* Wheels */}
    <circle cx="32" cy="33" r="5.5" fill="currentColor" className="text-primary" />
    <circle cx="86" cy="33" r="5.5" fill="currentColor" className="text-primary" />
    {/* Wheel rims */}
    <circle cx="32" cy="33" r="2.5" fill="currentColor" />
    <circle cx="86" cy="33" r="2.5" fill="currentColor" />
  </svg>
);

const InventoryPreview = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id, name, year, price, mileage, fuel, image_url")
      .eq("is_available", true)
      .then(({ data }) => { if (data) setVehicles(shuffle(data as Vehicle[]).slice(0, 4)); });
  }, []);

  return (
    <section className="pt-20 pb-10 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-6 md:mb-10">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Featured Vehicles
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Our Inventory
          </h2>

          {/* Driving GT3 RS track */}
          <div className="relative w-64 md:w-80 h-8 mt-4 mx-auto flex items-center justify-center overflow-hidden">
            <div className="absolute w-full h-px bg-border/70" />
            <div className="absolute left-0 w-full overflow-hidden h-full flex items-center">
              <div className="animate-drive-car flex items-center gap-1">
                <GT3RSSVG className="text-foreground/90" />
              </div>
            </div>
          </div>
        </div>

        {vehicles.length > 0 && (
          <div className="flex justify-center md:justify-end mb-5 md:mb-6">
            <div className="inline-flex rounded-md border border-border overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid className="h-4 w-4" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-4 w-4" /> List
              </button>
            </div>
          </div>
        )}

        {vehicles.length === 0 ? (
          <p className="text-center text-muted-foreground">No vehicles available right now. Check back soon!</p>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" : "space-y-3 sm:space-y-4"}>
            {vehicles.map((car) => (
              <Link
                to={`/inventory/${car.id}`}
                key={car.id}
                className={`bg-white/60 backdrop-blur-xl rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-white/80 group block ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}`}
              >
                <div className={`bg-muted flex items-center justify-center overflow-hidden shrink-0 ${viewMode === "list" ? "w-full sm:w-56 h-40 sm:h-48" : "h-32 sm:h-48"}`}>
                  {car.image_url ? (
                    <img src={car.image_url} alt={car.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Car className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                <div className={`p-4 sm:p-5 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{car.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-2 sm:mb-3">{formatPrice(car.price)}</p>
                  <div className="flex items-center flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                    {car.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage}</span>}
                    {car.fuel && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        <div className="text-center mt-10">
          <Link to="/inventory">
            <Button variant="navy" size="lg" className="px-10">View All Inventory</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default InventoryPreview;
