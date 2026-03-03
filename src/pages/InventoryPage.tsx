import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Car, MapPin, Phone, ArrowRight, Fuel, Gauge, Calendar, Search, X, SlidersHorizontal } from "lucide-react";

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null;
  image_url: string | null;
};

const priceToNumber = (p: string) => {
  const num = p.replace(/[^0-9]/g, "");
  return num ? parseInt(num) : 0;
};

const PRICE_RANGES = [
  { label: "All Prices", min: 0, max: Infinity },
  { label: "Under KSh 3M", min: 0, max: 3_000_000 },
  { label: "KSh 3M – 6M", min: 3_000_000, max: 6_000_000 },
  { label: "KSh 6M – 10M", min: 6_000_000, max: 10_000_000 },
  { label: "Over KSh 10M", min: 10_000_000, max: Infinity },
];

const InventoryPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [bodyFilter, setBodyFilter] = useState("");
  const [priceRange, setPriceRange] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

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

  // Derive unique filter options from data
  const makes = useMemo(() => [...new Set(vehicles.map(v => v.make))].sort(), [vehicles]);
  const fuels = useMemo(() => [...new Set(vehicles.map(v => v.fuel).filter(Boolean))].sort(), [vehicles]);
  const bodyTypes = useMemo(() => [...new Set(vehicles.map(v => v.body_type).filter(Boolean))].sort(), [vehicles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const range = PRICE_RANGES[priceRange];
    return vehicles.filter(v => {
      if (q && !v.name.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
      if (makeFilter && v.make !== makeFilter) return false;
      if (fuelFilter && v.fuel !== fuelFilter) return false;
      if (bodyFilter && v.body_type !== bodyFilter) return false;
      const price = priceToNumber(v.price);
      if (price < range.min || price > range.max) return false;
      return true;
    });
  }, [vehicles, search, makeFilter, fuelFilter, bodyFilter, priceRange]);

  const hasActiveFilters = search || makeFilter || fuelFilter || bodyFilter || priceRange !== 0;

  const clearFilters = () => {
    setSearch(""); setMakeFilter(""); setFuelFilter(""); setBodyFilter(""); setPriceRange(0);
  };

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
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Visit Our Showroom</h2>
                  <p className="text-muted-foreground mb-2">No vehicles listed online right now. Visit us or call for current stock.</p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment"><Button variant="hero" size="lg" className="gap-2">Schedule a Visit <ArrowRight className="h-4 w-4" /></Button></Link>
                    <a href="tel:+254723041684"><Button variant="navy" size="lg" className="gap-2"><Phone className="h-4 w-4" /> Call 0723 041 684</Button></a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Filter Bar */}
                <div className="mb-8 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search vehicles..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => setShowFilters(!showFilters)}
                      className="gap-2 shrink-0"
                    >
                      <SlidersHorizontal className="h-4 w-4" />
                      Filters
                      {hasActiveFilters && (
                        <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {[makeFilter, fuelFilter, bodyFilter, priceRange !== 0].filter(Boolean).length}
                        </span>
                      )}
                    </Button>
                    {hasActiveFilters && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground shrink-0">
                        <X className="h-4 w-4" /> Clear
                      </Button>
                    )}
                  </div>

                  {showFilters && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-card border border-border rounded-lg">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Make</label>
                        <select
                          value={makeFilter}
                          onChange={(e) => setMakeFilter(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">All Makes</option>
                          {makes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Fuel Type</label>
                        <select
                          value={fuelFilter}
                          onChange={(e) => setFuelFilter(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">All Fuels</option>
                          {fuels.map(f => <option key={f} value={f!}>{f}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Body Type</label>
                        <select
                          value={bodyFilter}
                          onChange={(e) => setBodyFilter(e.target.value)}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">All Types</option>
                          {bodyTypes.map(b => <option key={b} value={b!}>{b}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Price Range</label>
                        <select
                          value={priceRange}
                          onChange={(e) => setPriceRange(Number(e.target.value))}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          {PRICE_RANGES.map((r, i) => <option key={i} value={i}>{r.label}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {/* Results */}
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                    <p className="text-muted-foreground">No vehicles match your filters.</p>
                    <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-2">Clear filters</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filtered.map((car) => (
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
                )}

                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground mb-1">
                    Showing {filtered.length} of {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment"><Button variant="hero" size="lg" className="gap-2">Schedule a Visit <ArrowRight className="h-4 w-4" /></Button></Link>
                    <a href="tel:+254723041684"><Button variant="navy" size="lg" className="gap-2"><Phone className="h-4 w-4" /> Call 0723 041 684</Button></a>
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
