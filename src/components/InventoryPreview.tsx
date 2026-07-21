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
    width="96"
    height="32"
    viewBox="0 0 160 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Porsche GT3 RS silhouette"
  >
    {/* Front splitter / lip */}
    <path
      d="M2 42 L0 44 L6 44 L8 42 Z"
      fill="currentColor"
    />
    {/* Main body — low nose, long hood, rounded cabin, wide rear haunches */}
    <path
      d="M6 42 C6 38 10 36 16 35 L30 34 C34 33 38 33 42 32 L58 31 C62 30 66 30 70 30 L92 29 C98 29 104 30 110 32 L124 36 C130 38 134 40 135 42 L135 46 C135 48 133 49 130 49 L122 49 C120 45 116 42 111 42 C106 42 102 45 100 49 L54 49 C52 45 48 42 43 42 C38 42 34 45 32 49 L10 49 C8 49 6 48 6 46 Z"
      fill="currentColor"
    />
    {/* Roof / windshield / rear window line */}
    <path
      d="M30 35 L40 22 C42 20 46 19 52 19 L74 19 C80 19 84 20 88 22 L104 30"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
    />
    {/* Huge swan-neck rear wing (RS signature) */}
    <path
      d="M112 30 L112 16 C112 14 114 13 116 13 L142 12 C145 12 146 13 146 15 L146 22 C146 24 145 25 142 25 L134 25 L134 28 L118 28 L118 25 L112 25 Z"
      fill="currentColor"
    />
    {/* Wing endplates */}
    <path
      d="M112 25 L110 32 M146 22 L148 29"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    {/* Side intake behind the door */}
    <path
      d="M82 36 L96 35 L96 41 L84 42 Z"
      fill="currentColor"
      fillOpacity="0.45"
    />
    {/* Rear diffuser */}
    <path
      d="M130 46 L144 48 L144 44 Z"
      fill="currentColor"
    />
    {/* Wheels with center-lock style hub */}
    <circle cx="43" cy="49" r="8" fill="currentColor" className="text-primary" />
    <circle cx="111" cy="49" r="8" fill="currentColor" className="text-primary" />
    <circle cx="43" cy="49" r="4" fill="currentColor" />
    <circle cx="111" cy="49" r="4" fill="currentColor" />
    {/* Center-lock nut detail */}
    <circle cx="43" cy="49" r="1.5" fill="currentColor" className="text-primary" />
    <circle cx="111" cy="49" r="1.5" fill="currentColor" className="text-primary" />
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
