import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, MapPin, Phone, ArrowRight, Fuel, Gauge, Calendar } from "lucide-react";

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null;
  image_url: string | null;
};

const InventoryPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id, name, make, model, year, price, mileage, fuel, transmission, body_type, image_url")
      .eq("is_available", true)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setVehicles(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Car className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Our Inventory
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Browse our available vehicles — Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading vehicles...</p>
            ) : vehicles.length === 0 ? (
              <div className="max-w-3xl mx-auto text-center">
                <div className="bg-card rounded-lg p-10 border border-border shadow-card">
                  <Car className="h-16 w-16 text-primary/20 mx-auto mb-6" />
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                    Visit Our Showroom
                  </h2>
                  <p className="text-muted-foreground mb-2">
                    No vehicles listed online right now. Visit us or call for current stock.
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment">
                      <Button variant="hero" size="lg" className="gap-2">
                        Schedule a Visit <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a href="tel:+254723041684">
                      <Button variant="navy" size="lg" className="gap-2">
                        <Phone className="h-4 w-4" /> Call 0723 041 684
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehicles.map((car) => (
                    <div
                      key={car.id}
                      className="bg-card rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-border group"
                    >
                      <div className="h-56 bg-muted flex items-center justify-center overflow-hidden">
                        {car.image_url ? (
                          <img src={car.image_url} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        ) : (
                          <Car className="h-16 w-16 text-muted-foreground/30" />
                        )}
                      </div>
                      <div className="p-5">
                        <h3 className="font-heading font-bold text-lg text-foreground mb-1">{car.name}</h3>
                        <p className="text-primary font-semibold mb-3">{car.price}</p>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                          {car.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage}</span>}
                          {car.fuel && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>}
                          {car.transmission && <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">{car.transmission}</span>}
                          {car.body_type && <span className="bg-muted px-2 py-0.5 rounded text-muted-foreground">{car.body_type}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-12">
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment">
                      <Button variant="hero" size="lg" className="gap-2">
                        Schedule a Visit <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                    <a href="tel:+254723041684">
                      <Button variant="navy" size="lg" className="gap-2">
                        <Phone className="h-4 w-4" /> Call 0723 041 684
                      </Button>
                    </a>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;
