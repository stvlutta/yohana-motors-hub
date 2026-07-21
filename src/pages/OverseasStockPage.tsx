import { useEffect, useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Globe, ArrowRight, Car, MapPin, Search, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/utils";

const brands = ["Toyota", "Nissan", "Honda", "Mazda", "Subaru", "Mercedes-Benz", "BMW", "Audi", "Range Rover", "Ford", "Suzuki", "Mitsubishi"];

type OverseasVehicle = {
  id: string; name: string; make: string; model: string; year: number;
  price: string; source_country: string | null; image_url: string | null;
  fuel: string | null; transmission: string | null; mileage: string | null;
  source_url: string | null;
  price_cif: string | null; price_delivered_nairobi: string | null;
};

const PAGE_SIZE = 12;

const OverseasStockPage = () => {
  const [vehicles, setVehicles] = useState<OverseasVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [countryFilter, setCountryFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    supabase.from("overseas_vehicles").select("*").eq("is_available", true).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setVehicles(data as OverseasVehicle[]); setLoading(false); });
  }, []);

  const makes = useMemo(() => {
    const s = new Map<string, string>();
    vehicles.forEach(v => { const m = (v.make || "").trim(); if (m) s.set(m.toLowerCase(), m); });
    return [...s.values()].sort();
  }, [vehicles]);

  const countries = useMemo(() => {
    const s = new Map<string, string>();
    vehicles.forEach(v => { const c = (v.source_country || "").trim(); if (c) s.set(c.toLowerCase(), c); });
    return [...s.values()].sort();
  }, [vehicles]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return vehicles.filter(v => {
      if (q && !`${v.name} ${v.make} ${v.model}`.toLowerCase().includes(q)) return false;
      if (makeFilter && (v.make || "").toLowerCase() !== makeFilter.toLowerCase()) return false;
      if (countryFilter && (v.source_country || "").toLowerCase() !== countryFilter.toLowerCase()) return false;
      return true;
    });
  }, [vehicles, search, makeFilter, countryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  useEffect(() => { setCurrentPage(1); }, [search, makeFilter, countryFilter]);

  const hasActive = search || makeFilter || countryFilter;
  const clear = () => { setSearch(""); setMakeFilter(""); setCountryFilter(""); };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <section className="py-10 md:py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Overseas Stock / Ready to Import
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Browse quality vehicles ready for import from UK, Japan, South Africa & Australia — landed cost quoted within 24 hours.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-heading font-bold text-foreground mb-6">Available Overseas Vehicles</h2>

            {!loading && vehicles.length > 0 && (
              <div className="mb-6 sticky top-24 z-30 md:static bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border md:border-b-0 -mx-4 px-4 md:mx-0 md:px-0 py-3 md:py-0">
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search overseas stock..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                  </div>
                  <select
                    value={makeFilter}
                    onChange={(e) => setMakeFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Makes</option>
                    {makes.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                  <select
                    value={countryFilter}
                    onChange={(e) => setCountryFilter(e.target.value)}
                    className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">All Countries</option>
                    {countries.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {hasActive && (
                    <Button variant="ghost" size="sm" onClick={clear} className="gap-1 text-muted-foreground shrink-0">
                      <X className="h-4 w-4" /> Clear
                    </Button>
                  )}
                </div>
              </div>
            )}

            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading...</p>
            ) : vehicles.length === 0 ? (
              <div className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg p-12 text-center">
                <Car className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
                <p className="text-muted-foreground">No overseas vehicles listed at the moment. Contact us with the link to a car you've found abroad and we'll source it for you.</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Car className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">No overseas vehicles match your filters.</p>
                <Button variant="ghost" size="sm" onClick={clear} className="mt-2">Clear filters</Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-8">
                  {paginated.map((v) => (
                    <Link key={v.id} to={`/inventory/${v.id}`} className="bg-white/60 backdrop-blur-xl border border-white/80 rounded-lg overflow-hidden hover:shadow-elevated hover:border-primary/40 transition-all group">
                      <div className="aspect-video bg-muted overflow-hidden">
                        {v.image_url ? (
                          <img
                            src={v.image_url}
                            alt={v.name}
                            loading="lazy"
                            decoding="async"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Car className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground/40" /></div>
                        )}
                      </div>
                      <div className="p-3 sm:p-5">
                        <h3 className="font-heading font-bold text-sm sm:text-base text-foreground line-clamp-1">{v.name}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{v.year} • {v.make} {v.model}</p>
                        {v.source_country && (
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-1 flex items-center gap-1"><MapPin className="h-3 w-3" /> {v.source_country}</p>
                        )}
                        <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-1.5 pt-2 sm:pt-3 border-t border-border">
                          {v.price_cif ? (
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">CIF</span>
                              <span className="text-primary font-heading font-bold text-xs sm:text-base">{formatPrice(v.price_cif)}</span>
                            </div>
                          ) : null}
                          {v.price_delivered_nairobi ? (
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="text-[10px] sm:text-xs uppercase tracking-wide text-muted-foreground">Delivered</span>
                              <span className="text-primary font-heading font-bold text-xs sm:text-base">{formatPrice(v.price_delivered_nairobi)}</span>
                            </div>
                          ) : null}
                          {!v.price_cif && !v.price_delivered_nairobi && v.price ? (
                            <p className="text-primary font-heading font-bold text-sm sm:text-lg">{formatPrice(v.price)}</p>
                          ) : null}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mb-8 flex-wrap">
                    <Button variant="outline" size="sm" disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {(() => {
                        const pages: (number | "…")[] = [];
                        for (let i = 1; i <= totalPages; i++) {
                          if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) pages.push(i);
                          else if (pages[pages.length - 1] !== "…") pages.push("…");
                        }
                        return pages.map((page, idx) =>
                          page === "…" ? (
                            <span key={`e-${idx}`} className="px-1 text-muted-foreground text-sm">…</span>
                          ) : (
                            <button key={page} type="button"
                              onClick={() => { setCurrentPage(page); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                              className={`min-w-[2.25rem] h-9 px-2 rounded-md text-sm font-medium transition-colors ${currentPage === page ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}
                              aria-current={currentPage === page ? "page" : undefined}>
                              {page}
                            </button>
                          )
                        );
                      })()}
                    </div>
                    <Button variant="outline" size="sm" disabled={currentPage === totalPages}
                      onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); }}>
                      Next
                    </Button>
                  </div>
                )}

                <p className="text-center text-sm text-muted-foreground mb-8">
                  Showing {paginated.length} of {filtered.length} vehicle{filtered.length !== 1 ? "s" : ""} — page {currentPage} of {totalPages}
                </p>
              </>
            )}

            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4 text-center">Popular Brands We Source</h2>
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                {brands.map((brand) => (
                  <span key={brand} className="bg-muted text-foreground font-heading font-semibold text-sm px-5 py-2.5 rounded-full border border-border">
                    {brand}
                  </span>
                ))}
              </div>

              <div className="bg-white/60 backdrop-blur-xl rounded-lg p-8 border border-white/80 shadow-card text-center">
                <h3 className="text-2xl font-heading font-bold text-foreground mb-4">How to Order</h3>
                <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                  Have a specific car in mind from the UK, Japan, South Africa, or Australia? Send us the details and we'll give you a landed cost within 24 hours.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a href="https://wa.me/254714007122" target="_blank" rel="noopener noreferrer">
                    <Button variant="hero" size="lg" className="gap-2">
                      WhatsApp Us <ArrowRight className="h-4 w-4" />
                    </Button>
                  </a>
                  <Link to="/appointment?service=Direct%20Import%20Inquiry">
                    <Button variant="navy" size="lg">Book Consultation</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default OverseasStockPage;
