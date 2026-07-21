import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Car, ArrowLeft, Phone, Calendar, Gauge, Fuel, MapPin, ArrowRight } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null;
  description: string | null; image_url: string | null; image_urls: string[] | null;
  is_available: boolean;
};

const VehicleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("vehicles").select("*").eq("id", id).maybeSingle();
      if (data) { setVehicle(data as Vehicle); setLoading(false); return; }
      const { data: ov } = await supabase.from("overseas_vehicles").select("*").eq("id", id).maybeSingle();
      setVehicle((ov as Vehicle | null) ?? null);
      setLoading(false);
    })();
  }, [id]);

  const images: string[] = (() => {
    if (!vehicle) return [];
    const list = [...(vehicle.image_urls || [])];
    if (vehicle.image_url && !list.includes(vehicle.image_url)) list.unshift(vehicle.image_url);
    return list;
  })();

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <div className="container mx-auto px-4 py-8">
          <Link to="/inventory" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="h-4 w-4" /> Back to inventory
          </Link>

          {loading ? (
            <p className="text-center text-muted-foreground py-12">Loading...</p>
          ) : !vehicle ? (
            <div className="text-center py-16">
              <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Vehicle not found.</p>
              <Link to="/inventory"><Button variant="hero" className="mt-4">Browse inventory</Button></Link>
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-10">
              {/* Gallery */}
              <div>
                <div className="aspect-[4/3] bg-muted rounded-lg overflow-hidden border border-border flex items-center justify-center">
                  {images[activeImage] ? (
                    <img src={images[activeImage]} alt={vehicle.name} className="w-full h-full object-cover" />
                  ) : (
                    <Car className="h-20 w-20 text-muted-foreground/30" />
                  )}
                </div>
                {images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {images.map((src, i) => (
                      <button
                        key={src}
                        onClick={() => setActiveImage(i)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${i === activeImage ? "border-primary" : "border-border opacity-70 hover:opacity-100"}`}
                      >
                        <img src={src} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                {!vehicle.is_available && (
                  <span className="inline-block bg-muted text-muted-foreground text-xs font-semibold px-3 py-1 rounded-full mb-3">SOLD</span>
                )}
                <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">{vehicle.name}</h1>
                <p className="text-2xl text-primary font-bold mb-6">{formatPrice(vehicle.price)}</p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="h-3 w-3" /> Year</p>
                    <p className="font-semibold text-foreground mt-1">{vehicle.year}</p>
                  </div>
                  {vehicle.mileage && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Gauge className="h-3 w-3" /> Mileage</p>
                      <p className="font-semibold text-foreground mt-1">{vehicle.mileage}</p>
                    </div>
                  )}
                  {vehicle.fuel && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1"><Fuel className="h-3 w-3" /> Fuel</p>
                      <p className="font-semibold text-foreground mt-1">{vehicle.fuel}</p>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Transmission</p>
                      <p className="font-semibold text-foreground mt-1">{vehicle.transmission}</p>
                    </div>
                  )}
                  {vehicle.body_type && (
                    <div className="bg-card border border-border rounded-lg p-3">
                      <p className="text-xs text-muted-foreground">Body Type</p>
                      <p className="font-semibold text-foreground mt-1">{vehicle.body_type}</p>
                    </div>
                  )}
                  <div className="bg-card border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">Make / Model</p>
                    <p className="font-semibold text-foreground mt-1">{vehicle.make} {vehicle.model}</p>
                  </div>
                </div>

                {vehicle.description && (
                  <div className="mb-6">
                    <h2 className="font-heading font-semibold text-foreground mb-2">Description</h2>
                    <p className="text-muted-foreground whitespace-pre-line">{vehicle.description}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-muted-foreground text-sm mb-5">
                  <MapPin className="h-4 w-4 text-primary" />
                  Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link to="/appointment"><Button variant="hero" size="lg" className="gap-2">Schedule a Viewing <ArrowRight className="h-4 w-4" /></Button></Link>
                  <a href="tel:+254714007122"><Button variant="navy" size="lg" className="gap-2"><Phone className="h-4 w-4" /> Call 0714 007 122</Button></a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VehicleDetailPage;
