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

// Sleek premium grand-tourer side profile with animated light beams
const DrivingCarSVG = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="140"
    height="48"
    viewBox="0 0 220 76"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-label="Premium sports car driving beneath the heading"
  >
    {/* Headlight beam cones — flash at the end of the drive */}
    <path
      d="M6 40 L-70 28 L-70 56 Z"
      fill="url(#headlightBeam)"
      className="animate-flash-beams"
      opacity="0"
    />
    {/* Tail light glow */}
    <ellipse cx="206" cy="44" rx="6" ry="3" fill="#ef4444" className="animate-pulse opacity-80" />

    {/* Lower aero lip / front splitter */}
    <path d="M4 52 L0 54 L10 54 L12 52 Z" fill="currentColor" />

    {/* Main body — long hood, fastback cabin, muscular rear haunches */}
    <path
      d="M8 52 C8 46 14 44 22 43 L42 41 C48 40 54 40 60 39 L96 38 C104 38 112 39 120 41 L150 46 C162 48 170 50 174 52 L174 58 C174 61 171 62 166 62 L156 62 C153 56 147 52 140 52 C133 52 127 56 124 62 L68 62 C65 56 59 52 52 52 C45 52 39 56 36 62 L14 62 C10 62 8 60 8 57 Z"
      fill="currentColor"
    />

    {/* Greenhouse / windows */}
    <path
      d="M40 42 L52 24 C56 20 64 18 74 18 L108 18 C118 18 126 20 132 24 L150 38 L146 44 L40 42 Z"
      fill="currentColor"
      fillOpacity="0.25"
    />
    {/* Window divider / B-pillar */}
    <path d="M96 18 L96 40" stroke="currentColor" strokeWidth="2" strokeOpacity="0.6" />
    {/* Side mirror */}
    <path d="M42 36 L36 32 L44 32 Z" fill="currentColor" />

    {/* Headlight */}
    <path d="M8 46 L14 44 L14 50 L8 50 Z" fill="#f8fafc" className="animate-flash-headlight" />
    {/* Taillight */}
    <path d="M198 46 L210 48 L210 44 L198 42 Z" fill="#ef4444" />

    {/* Side intake / character line */}
    <path d="M128 48 L154 45 L154 52 L132 54 Z" fill="currentColor" fillOpacity="0.35" />
    {/* Aerodynamic side skirt */}
    <path d="M42 58 L170 56 L170 60 L42 62 Z" fill="currentColor" fillOpacity="0.5" />

    {/* Rear diffuser */}
    <path d="M176 56 L210 58 L214 54 L178 54 Z" fill="currentColor" />

    {/* Wheels — large alloys with spokes */}
    <circle cx="52" cy="62" r="11" fill="#1f2937" />
    <circle cx="140" cy="62" r="11" fill="#1f2937" />
    <circle cx="52" cy="62" r="6" fill="currentColor" className="text-primary" />
    <circle cx="140" cy="62" r="6" fill="currentColor" className="text-primary" />
    {/* Spokes */}
    <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="52" y1="62" x2="52" y2="54" />
      <line x1="52" y1="62" x2="58" y2="66" />
      <line x1="52" y1="62" x2="46" y2="66" />
      <line x1="140" y1="62" x2="140" y2="54" />
      <line x1="140" y1="62" x2="146" y2="66" />
      <line x1="140" y1="62" x2="134" y2="66" />
    </g>

    <defs>
      <linearGradient id="headlightBeam" x1="-70" y1="28" x2="6" y2="56" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#f8fafc" stopOpacity="0" />
        <stop offset="0.5" stopColor="#f8fafc" stopOpacity="0.35" />
        <stop offset="1" stopColor="#f8fafc" stopOpacity="0.75" />
      </linearGradient>
    </defs>
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

          {/* Driving car track with light flash at the finish */}
          <div className="relative w-72 md:w-96 h-12 mt-4 mx-auto flex items-center justify-center overflow-hidden">
            {/* Road surface */}
            <div className="absolute w-full h-1.5 bg-border/70 rounded-full" />
            {/* Moving dashed lane markings */}
            <div className="absolute w-[200%] h-px top-1/2 -translate-y-1/2 flex gap-6 animate-road-stripes">
              {[...Array(8)].map((_, i) => (
                <span key={i} className="w-8 h-px bg-primary/60" />
              ))}
            </div>
            <div className="absolute left-0 w-full overflow-hidden h-full flex items-center">
              <div className="animate-drive-car flex items-center">
                <DrivingCarSVG className="text-foreground/90 drop-shadow-lg" />
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
