import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Fuel, Gauge, Calendar, Car } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

type Vehicle = {
  id: string; name: string; year: number; price: string;
  mileage: string | null; fuel: string | null; image_url: string | null;
};

const InventoryPreview = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id, name, year, price, mileage, fuel, image_url")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .limit(4)
      .then(({ data }) => { if (data) setVehicles(data); });
  }, []);

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Featured Vehicles
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Our Inventory
          </h2>
        </div>
        {vehicles.length === 0 ? (
          <p className="text-center text-muted-foreground">No vehicles available right now. Check back soon!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {vehicles.map((car) => (
              <div
                key={car.id}
                className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border group"
              >
                <div className="h-48 bg-muted flex items-center justify-center overflow-hidden">
                  {car.image_url ? (
                    <img src={car.image_url} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <Car className="h-12 w-12 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-bold text-lg text-foreground mb-1">{car.name}</h3>
                  <p className="text-primary font-semibold text-sm mb-3">{car.price}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                    {car.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage}</span>}
                    {car.fuel && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>}
                  </div>
                </div>
              </div>
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
