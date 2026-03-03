import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Ship, Check, Globe, ArrowRight } from "lucide-react";

const sources = [
  { country: "United Kingdom", platforms: "Autotrader UK, eBay Motors, specialist dealers" },
  { country: "Japan", platforms: "Japanese auctions, BE FORWARD, SBT Japan" },
  { country: "South Africa", platforms: "AutoTrader SA, Cars.co.za, specialist dealers" },
  { country: "Australia", platforms: "Carsales, dealer networks, private sellers" },
];

const process = [
  { step: "1", title: "Choose Your Car", desc: "Spotted your dream car online or want us to source it? Send us the details." },
  { step: "2", title: "Inspection & Purchase", desc: "We conduct a thorough inspection and handle the purchase on your behalf." },
  { step: "3", title: "Shipping & Logistics", desc: "We arrange shipping, insurance, and all export documentation." },
  { step: "4", title: "Clearing & Delivery", desc: "We handle port clearing, KRA duties, KEBS & NTSA compliance, and deliver to your location." },
];

const DirectImportPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Ship className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Direct Import
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Spotted your dream car overseas? We shall facilitate everything until your driveway. Save up to 30% on direct import!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-8 text-center">Where We Import From</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {sources.map((s) => (
                <div key={s.country} className="bg-card rounded-lg p-6 border border-border shadow-card">
                  <div className="flex items-center gap-3 mb-3">
                    <Globe className="h-6 w-6 text-primary" />
                    <h3 className="font-heading font-bold text-lg text-foreground">{s.country}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">{s.platforms}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-10 text-center">How It Works</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {process.map((p) => (
                <div key={p.step} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full gradient-red text-primary-foreground font-heading font-bold flex items-center justify-center flex-shrink-0">
                    {p.step}
                  </div>
                  <div>
                    <h4 className="font-heading font-bold text-foreground mb-1">{p.title}</h4>
                    <p className="text-muted-foreground text-sm">{p.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-6 text-center">Why Import With Us?</h2>
            <ul className="space-y-3 max-w-xl mx-auto">
              {[
                "Save up to 30% compared to local dealerships",
                "Full inspection reports before purchase",
                "Direct import financing — 30% deposit, pay balance over 48–60 months",
                "Duty-free importation available for eligible individuals",
                "We handle all documentation with relevant agencies",
                "Facilitation of port clearing, port charges, and delivery",
              ].map((b) => (
                <li key={b} className="flex items-start gap-3 text-foreground">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{b}</span>
                </li>
              ))}
            </ul>
            <div className="text-center mt-10 flex flex-wrap justify-center gap-4">
              <Link to="/appointment">
                <Button variant="hero" size="lg" className="gap-2">
                  Start Your Import <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+254723041684">
                <Button variant="navy" size="lg">Call 0723 041 684</Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DirectImportPage;
