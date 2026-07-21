import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Car, MapPin, Phone, ArrowRight, Fuel, Gauge, Calendar, Search, X, SlidersHorizontal, LayoutGrid, List, Eye } from "lucide-react";
import { formatPrice } from "@/lib/utils";

type Vehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; mileage: string | null; fuel: string | null;
  transmission: string | null; body_type: string | null; engine_cc: number | null;
  image_url: string | null;
};

const parseNumber = (s: string | null | undefined) => {
  if (!s) return 0;
  const num = String(s).replace(/[^0-9]/g, "");
  return num ? parseInt(num) : 0;
};

// Canonical list of car brands available worldwide (no specific models)
const WORLD_CAR_MAKES = [
  "Acura","Alfa Romeo","Aston Martin","Audi","Bentley","BMW","Bugatti","BYD","Cadillac",
  "Chery","Chevrolet","Chrysler","Citroën","Dacia","Daihatsu","Dodge","DS Automobiles",
  "Ferrari","Fiat","Ford","Genesis","GMC","Great Wall","Haval","Honda","Hummer","Hyundai",
  "Infiniti","Isuzu","Jaguar","Jeep","Kia","Lamborghini","Land Rover","Lexus","Lincoln",
  "Lotus","Mahindra","Maserati","Maybach","Mazda","McLaren","Mercedes-Benz","MG","Mini",
  "Mitsubishi","Nissan","Opel","Peugeot","Polestar","Porsche","Proton","RAM",
  "Renault","Rolls-Royce","Rover","Saab","SEAT","Škoda","Smart","Ssangyong","Subaru",
  "Suzuki","Tata","Tesla","Toyota","Vauxhall","Volkswagen","Volvo",
];

const makeAliases: Record<string, string> = {
  "benz": "Mercedes-Benz",
  "mercedes": "Mercedes-Benz",
  "mercedes benz": "Mercedes-Benz",
  "mercedes-benz": "Mercedes-Benz",
  "vw": "Volkswagen",
  "volks wagon": "Volkswagen",
  "volkswagen": "Volkswagen",
  "landcruiser": "Toyota",
  "land cruiser": "Toyota",
  "toyota landcruiser": "Toyota",
  "toyota land cruiser": "Toyota",
};

const normalizeMake = (value: string | null | undefined) => {
  const raw = (value || "").trim();
  if (!raw) return "";
  const cleaned = raw
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  if (makeAliases[cleaned]) return makeAliases[cleaned];

  const matchedMake = WORLD_CAR_MAKES.find((make) => {
    const normalizedBrand = make
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim();

    return cleaned === normalizedBrand || cleaned.startsWith(`${normalizedBrand} `);
  });

  return matchedMake || "";
};

const CURRENT_YEAR = new Date().getFullYear();

const InventoryPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [search, setSearch] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [modelFilter, setModelFilter] = useState("");
  const [fuelFilter, setFuelFilter] = useState("");
  const [bodyFilter, setBodyFilter] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [mileageMax, setMileageMax] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const [ccMin, setCcMin] = useState("");
  const [ccMax, setCcMax] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [quickView, setQuickView] = useState<Vehicle | null>(null);
  const PAGE_SIZE = 12;

  useEffect(() => {
    supabase
      .from("vehicles")
      .select("id, name, make, model, year, price, mileage, fuel, transmission, body_type, engine_cc, image_url")
      .eq("is_available", true)
      .then(({ data }) => {
        if (data) {
          // Randomize order every load so the featured set differs each visit
          const arr = [...data];
          for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setVehicles(arr);
        }
        setLoading(false);
      });
  }, []);

  // Derive unique filter options from data (case-insensitive dedupe)
  // Full worldwide brand list only, with vehicle make aliases normalized for filtering
  const makes = useMemo(() => {
    const seen = new Map<string, string>();
    WORLD_CAR_MAKES.forEach(m => seen.set(m.toLowerCase(), m));
    return [...seen.values()].sort((a, b) => a.localeCompare(b));
  }, []);
  const fuels = useMemo(() => [...new Set(vehicles.map(v => v.fuel).filter(Boolean))].sort(), [vehicles]);
  const bodyTypes = useMemo(() => [...new Set(vehicles.map(v => v.body_type).filter(Boolean))].sort(), [vehicles]);
  const modelsForMake = useMemo(() => {
    if (!makeFilter) return [];
    const map = new Map<string, string>();
    vehicles.filter(v => normalizeMake(v.make) === makeFilter).forEach(v => {
      const raw = (v.model || "").trim();
      if (!raw) return;
      const key = raw.toLowerCase();
      if (!map.has(key)) map.set(key, raw);
    });
    return [...map.values()].sort();
  }, [vehicles, makeFilter]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const bMin = budgetMin ? parseNumber(budgetMin) : 0;
    const bMax = budgetMax ? parseNumber(budgetMax) : Infinity;
    const mMax = mileageMax ? parseNumber(mileageMax) : Infinity;
    const aMax = ageMax ? parseInt(ageMax) : Infinity;
    const cMin = ccMin ? parseInt(ccMin) : 0;
    const cMax = ccMax ? parseInt(ccMax) : Infinity;
    return vehicles.filter(v => {
      if (q && !v.name.toLowerCase().includes(q) && !v.make.toLowerCase().includes(q) && !v.model.toLowerCase().includes(q)) return false;
      if (makeFilter && normalizeMake(v.make) !== makeFilter) return false;
      if (modelFilter && (v.model || "").trim().toLowerCase() !== modelFilter.toLowerCase()) return false;
      if (fuelFilter && v.fuel !== fuelFilter) return false;
      if (bodyFilter && v.body_type !== bodyFilter) return false;
      const price = parseNumber(v.price);
      if (price < bMin || price > bMax) return false;
      if (mileageMax) {
        const m = parseNumber(v.mileage);
        if (m > mMax) return false;
      }
      if (ageMax) {
        const age = CURRENT_YEAR - v.year;
        if (age > aMax) return false;
      }
      if (ccMin || ccMax) {
        const cc = v.engine_cc || 0;
        if (cc < cMin || cc > cMax) return false;
      }
      return true;
    });
  }, [vehicles, search, makeFilter, modelFilter, fuelFilter, bodyFilter, budgetMin, budgetMax, mileageMax, ageMax, ccMin, ccMax]);

  const activeCount = [makeFilter, modelFilter, fuelFilter, bodyFilter, budgetMin, budgetMax, mileageMax, ageMax, ccMin, ccMax].filter(Boolean).length;
  const hasActiveFilters = search || activeCount > 0;

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, makeFilter, modelFilter, fuelFilter, bodyFilter, budgetMin, budgetMax, mileageMax, ageMax, ccMin, ccMax]);

  const clearFilters = () => {
    setSearch(""); setMakeFilter(""); setModelFilter(""); setFuelFilter(""); setBodyFilter("");
    setBudgetMin(""); setBudgetMax(""); setMileageMax(""); setAgeMax(""); setCcMin(""); setCcMax("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-24">
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
                <div className="bg-white/60 backdrop-blur-xl rounded-lg p-10 border border-white/80 shadow-card">
                  <Car className="h-16 w-16 text-primary/20 mx-auto mb-6" />
                  <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Visit Our Showroom</h2>
                  <p className="text-muted-foreground mb-2">No vehicles listed online right now. Visit us or call for current stock.</p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-6">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment"><Button variant="hero" size="lg" className="gap-2">Schedule a Visit <ArrowRight className="h-4 w-4" /></Button></Link>
                    <a href="tel:+254714007122"><Button variant="navy" size="lg" className="gap-2"><Phone className="h-4 w-4" /> Call 0714 007 122</Button></a>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Filter Bar */}
                <div className="mb-8 space-y-4">
                  {/* Sticky mobile header so search/filter controls stay reachable while scrolling */}
                  <div className="sticky top-24 z-30 md:static bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border md:border-b-0 -mx-4 px-4 md:mx-0 md:px-0 py-3 md:py-0">
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
                        {activeCount > 0 && (
                          <span className="ml-1 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {activeCount}
                          </span>
                        )}
                      </Button>
                      <div className="flex items-center border border-input rounded-md overflow-hidden shrink-0">
                        <button
                          type="button"
                          onClick={() => setViewMode("grid")}
                          className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                          aria-label="Grid view"
                          title="Grid view"
                        >
                          <LayoutGrid className="h-4 w-4" /> Grid
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewMode("list")}
                          className={`px-3 py-2 flex items-center gap-1.5 text-sm transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:bg-muted"}`}
                          aria-label="List view"
                          title="List view"
                        >
                          <List className="h-4 w-4" /> List
                        </button>
                      </div>
                      {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground shrink-0">
                          <X className="h-4 w-4" /> Clear
                        </Button>
                      )}
                    </div>
                  </div>


                  {showFilters && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Make</label>
                        <select
                          value={makeFilter}
                          onChange={(e) => { setMakeFilter(e.target.value); setModelFilter(""); }}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="">All Makes</option>
                          {makes.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Model</label>
                        <select
                          value={modelFilter}
                          onChange={(e) => setModelFilter(e.target.value)}
                          disabled={!makeFilter}
                          className="w-full h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                        >
                          <option value="">{makeFilter ? "All Models" : "Select make first"}</option>
                          {modelsForMake.map(m => <option key={m} value={m}>{m}</option>)}
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
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Age (years)</label>
                        <Input type="number" min="0" placeholder="e.g. 5" value={ageMax} onChange={(e) => setAgeMax(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Max Mileage (km)</label>
                        <Input type="number" min="0" placeholder="e.g. 100000" value={mileageMax} onChange={(e) => setMileageMax(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Engine Min (CC)</label>
                        <Input type="number" min="0" placeholder="e.g. 1500" value={ccMin} onChange={(e) => setCcMin(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Engine Max (CC)</label>
                        <Input type="number" min="0" placeholder="e.g. 3000" value={ccMax} onChange={(e) => setCcMax(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget Min (KSh)</label>
                        <Input type="number" min="0" placeholder="e.g. 2000000" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Budget Max (KSh)</label>
                        <Input type="number" min="0" placeholder="e.g. 8000000" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} />
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
                  <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" : "space-y-3 sm:space-y-4"}>
                    {paginated.map((car) => (
                      <Link
                        to={`/inventory/${car.id}`}
                        key={car.id}
                        className={`bg-white/60 backdrop-blur-xl rounded-lg overflow-hidden shadow-card hover:shadow-elevated transition-all duration-300 border border-white/80 group block ${viewMode === "list" ? "flex flex-col sm:flex-row" : ""}`}
                      >
                        <div className={`bg-muted flex items-center justify-center overflow-hidden shrink-0 ${viewMode === "list" ? "w-full sm:w-56 h-44 sm:h-48" : "h-44 sm:h-56"}`}>
                          {car.image_url ? (
                            <img src={car.image_url} alt={car.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          ) : (
                            <Car className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground/30" />
                          )}
                        </div>
                        <div className="p-4 sm:p-5 flex flex-col justify-between flex-1">
                          <div>
                            <h3 className="font-heading font-bold text-base sm:text-lg text-foreground mb-1 group-hover:text-primary transition-colors line-clamp-1">{car.name}</h3>
                            <p className="text-primary font-semibold text-sm sm:text-base mb-2 sm:mb-3">{formatPrice(car.price)}</p>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{car.year}</span>
                              {car.mileage && <span className="flex items-center gap-1"><Gauge className="h-3 w-3" />{car.mileage}</span>}
                              {car.fuel && <span className="flex items-center gap-1"><Fuel className="h-3 w-3" />{car.fuel}</span>}
                              {car.transmission && <span className="bg-muted px-1.5 sm:px-2 py-0.5 rounded text-muted-foreground">{car.transmission}</span>}
                              {car.body_type && <span className="bg-muted px-1.5 sm:px-2 py-0.5 rounded text-muted-foreground">{car.body_type}</span>}
                              {car.engine_cc && <span className="bg-muted px-1.5 sm:px-2 py-0.5 rounded text-muted-foreground">{car.engine_cc} CC</span>}
                            </div>
                          </div>
                          <div className={`flex items-center gap-4 mt-3 ${viewMode === "list" ? "sm:mt-0" : ""}`}>
                            {viewMode === "list" && (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-primary group-hover:underline">
                                View Details <ArrowRight className="h-4 w-4" />
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setQuickView(car); }}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline focus:outline-none"
                              aria-label={`Quick view ${car.name}`}
                            >
                              <Eye className="h-4 w-4" /> Quick View
                            </button>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`min-w-[2.25rem] h-9 px-2 rounded-md text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                          aria-label={`Page ${page}`}
                          aria-current={currentPage === page ? "page" : undefined}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}

                <div className="text-center mt-12">
                  <p className="text-sm text-muted-foreground mb-1">
                    Showing {paginated.length} of {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} — page {currentPage} of {totalPages}
                  </p>
                  <div className="flex items-center justify-center gap-2 text-muted-foreground text-sm mb-4">
                    <MapPin className="h-4 w-4 text-primary" />
                    Ridgeways, Kiambu Rd, Adjacent to Ciata City Mall, Nairobi
                  </div>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Link to="/appointment"><Button variant="hero" size="lg" className="gap-2">Schedule a Visit <ArrowRight className="h-4 w-4" /></Button></Link>
                    <a href="tel:+254714007122"><Button variant="navy" size="lg" className="gap-2"><Phone className="h-4 w-4" /> Call 0714 007 122</Button></a>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Dialog open={!!quickView} onOpenChange={(open) => !open && setQuickView(null)}>
        {quickView && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden border-white/80 bg-white/95 backdrop-blur-xl">
            <div className="grid md:grid-cols-2">
              <div className="h-56 md:h-auto bg-muted flex items-center justify-center overflow-hidden">
                {quickView.image_url ? (
                  <img src={quickView.image_url} alt={quickView.name} className="w-full h-full object-cover" />
                ) : (
                  <Car className="h-16 w-16 text-muted-foreground/30" />
                )}
              </div>
              <div className="p-6 flex flex-col">
                <DialogHeader className="text-left mb-4">
                  <DialogTitle className="font-heading text-xl sm:text-2xl text-foreground">{quickView.name}</DialogTitle>
                  <DialogDescription className="sr-only">Quick view of {quickView.name}</DialogDescription>
                  <p className="text-primary font-bold text-lg mt-1">{formatPrice(quickView.price)}</p>
                </DialogHeader>
                <div className="grid grid-cols-2 gap-3 text-sm mb-6">
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Year</span>
                    <span className="font-semibold text-foreground flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {quickView.year}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Mileage</span>
                    <span className="font-semibold text-foreground flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {quickView.mileage || "N/A"}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Fuel</span>
                    <span className="font-semibold text-foreground flex items-center gap-1"><Fuel className="h-3.5 w-3.5" /> {quickView.fuel || "N/A"}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Transmission</span>
                    <span className="font-semibold text-foreground">{quickView.transmission || "N/A"}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Body Type</span>
                    <span className="font-semibold text-foreground">{quickView.body_type || "N/A"}</span>
                  </div>
                  <div className="bg-muted/50 rounded-md p-3">
                    <span className="block text-muted-foreground text-xs">Engine</span>
                    <span className="font-semibold text-foreground">{quickView.engine_cc ? `${quickView.engine_cc} CC` : "N/A"}</span>
                  </div>
                </div>
                <div className="mt-auto flex flex-col sm:flex-row gap-3">
                  <Link to={`/inventory/${quickView.id}`} className="flex-1">
                    <Button className="w-full gap-2" variant="hero">
                      View Details <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link to="/appointment" className="flex-1">
                    <Button variant="navy" className="w-full gap-2">
                      <Phone className="h-4 w-4" /> Book Test Drive
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default InventoryPage;
