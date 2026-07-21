import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Car, LayoutGrid, List, ArrowRight } from "lucide-react";
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
        {/* Header */}
        <div className="relative flex flex-col items-center gap-2 overflow-hidden py-4 text-center mb-8 md:mb-12">
          <span className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-xs">
            Curated Selection
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground tracking-tight">
            Our Inventory
          </h2>

          {/* Driving car track */}
          <div className="relative w-56 md:w-72 h-6 mt-3 flex items-center justify-center">
            <div className="absolute w-full h-px bg-border/70" />
            <div className="absolute left-0 w-full overflow-hidden h-full flex items-center">
              <div className="animate-drive-car flex items-center gap-1">
                <svg width="32" height="16" viewBox="0 0 24 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-foreground/80">
                  <path d="M1 8C1 8 2 4 6 3C10 2 14 2 18 3C22 4 23 8 23 8V10H1V8Z" fill="currentColor" />
                  <circle cx="5" cy="10" r="2" className="fill-primary" />
                  <circle cx="19" cy="10" r="2" className="fill-primary" />
                </svg>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          {vehicles.length > 0 && (
            <div className="mt-6 md:mt-8 flex items-center bg-muted/60 dark:bg-white/5 p-1.5 rounded-2xl w-fit border border-border/40">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-card text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="Grid view"
                aria-pressed={viewMode === "grid"}
              >
                <LayoutGrid className="h-3.5 w-3.5" /> Grid
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  viewMode === "list"
                    ? "bg-card text-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                aria-label="List view"
                aria-pressed={viewMode === "list"}
              >
                <List className="h-3.5 w-3.5" /> List
              </button>
            </div>
          )}
        </div>

        {vehicles.length === 0 ? (
          <p className="text-center text-muted-foreground">No vehicles available right now. Check back soon!</p>
        ) : (
          <div className={viewMode === "grid" ? "grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6" : "space-y-3 sm:space-y-4"}>
            {vehicles.map((car) => (
              <Link
                to={`/inventory/${car.id}`}
                key={car.id}
                className={`group bg-card/80 dark:bg-white/5 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-border/60 dark:border-white/10 shadow-card hover:shadow-elevated transition-all duration-500 hover:-translate-y-2 block ${
                  viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                }`}
              >
                <div className={`relative bg-muted flex items-center justify-center overflow-hidden shrink-0 ${
                  viewMode === "list" ? "w-full sm:w-56 h-40 sm:h-52" : "aspect-[4/3]"
                }`}>
                  {car.image_url ? (
                    <img
                      src={car.image_url}
                      alt={car.name}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Car className="h-12 w-12 text-muted-foreground/30" />
                  )}
                  <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 bg-primary px-3 py-1 sm:px-4 sm:py-1.5 rounded-lg shadow-lg">
                    <span className="text-xs sm:text-sm font-bold text-primary-foreground font-heading">
                      {formatPrice(car.price)}
                    </span>
                  </div>
                </div>
                <div className={`p-4 sm:p-6 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <h3 className="font-heading font-bold text-base sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">
                    {car.name}
                  </h3>
                  <p className="text-[10px] sm:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-3 sm:mb-4">
                    {car.year} {car.fuel ? `• ${car.fuel}` : ""}
                  </p>
                  <div className="flex items-center justify-between py-3 sm:py-4 border-y border-border/40 dark:border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Year</span>
                      <span className="text-xs font-bold text-foreground">{car.year}</span>
                    </div>
                    <div className="h-5 sm:h-6 w-px bg-border/60 dark:border-white/10" />
                    <div className="flex flex-col text-center">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Mileage</span>
                      <span className="text-xs font-bold text-foreground truncate max-w-[4.5rem] sm:max-w-[5rem]">{car.mileage || "N/A"}</span>
                    </div>
                    <div className="h-5 sm:h-6 w-px bg-border/60 dark:border-white/10" />
                    <div className="flex flex-col text-right">
                      <span className="text-[9px] text-muted-foreground uppercase font-bold">Fuel</span>
                      <span className="text-xs font-bold text-foreground">{car.fuel || "N/A"}</span>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4">
                    <span className="w-full inline-flex items-center justify-center py-2.5 sm:py-3 bg-secondary text-secondary-foreground text-[10px] sm:text-xs font-heading font-bold uppercase tracking-widest rounded-xl group-hover:bg-primary group-hover:text-primary-foreground transition-colors shadow-lg shadow-secondary/10">
                      View Details
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        <div className="flex flex-col items-center gap-4 mt-10 sm:mt-14">
          <Link to="/inventory">
            <Button
              variant="outline"
              size="lg"
              className="group px-8 sm:px-10 py-5 sm:py-6 rounded-2xl border-2 border-foreground/20 bg-background text-foreground font-heading font-bold uppercase text-xs tracking-widest hover:bg-foreground hover:text-background transition-all duration-300"
            >
              View All Inventory
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
            </Button>
          </Link>
          <p className="text-[10px] sm:text-xs text-muted-foreground font-medium">
            Premium vehicles imported directly from Japan, UK & Dubai.
          </p>
        </div>
      </div>
    </section>
  );
};

export default InventoryPreview;
