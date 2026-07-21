import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar, Car, LayoutGrid, List } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";
import drivingCar from "@/assets/driving-car.webp";

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

// Realistic driving car image with overlaid headlight/taillight effects
const DrivingCarImage = () => (
  <div className="relative w-40 md:w-56 h-14 md:h-20 shrink-0">
    <img
      src={drivingCar}
      alt="Porsche 911 GT3 RS driving beneath the heading"
      width={224}
      height={96}
      className="w-full h-full object-contain drop-shadow-xl"
      loading="lazy"
      decoding="async"
    />
    {/* Headlight flash overlay */}
    <div className="absolute top-[42%] -left-10 w-14 h-8 md:w-20 md:h-10 bg-gradient-to-l from-white/80 via-white/30 to-transparent rounded-full blur-md animate-flash-beams opacity-0 pointer-events-none" />
    {/* Taillight glow */}
    <div className="absolute top-[45%] -right-1 w-4 h-3 md:w-5 md:h-4 bg-red-500 rounded-full blur-[3px] animate-pulse opacity-80 pointer-events-none" />
  </div>
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
          <div className="relative w-72 md:w-[28rem] h-16 md:h-20 mt-4 mx-auto flex items-center justify-center overflow-hidden">
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
                <DrivingCarImage />
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
