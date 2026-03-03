import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import importImg from "@/assets/import-shipping.jpg";

const benefits = [
  "Direct import from UK, Japan, South Africa & Australia",
  "Save up to 30% compared to local dealerships",
  "Full inspection reports before purchase",
  "We facilitate everything until your driveway",
  "Up to 50% import financing available",
  "Duty-free importation available for eligible individuals",
];

const DirectImportSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative rounded-lg overflow-hidden shadow-elevated">
            <img src={importImg} alt="Direct car import shipping" className="w-full h-[400px] object-cover" />
            <div className="absolute inset-0 gradient-navy opacity-30" />
          </div>
          <div>
            <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
              Direct Import
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Import Your Car Directly
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Spotted your dream car on Autotrader, BE FORWARD, or any overseas platform? We shall facilitate everything until your driveway. Save up to 30% on direct import!
            </p>
            <ul className="space-y-3 mb-8">
              {benefits.map((b) => (
                <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  {b}
                </li>
              ))}
            </ul>
            <Link to="/direct-import">
              <Button variant="hero" size="lg">Start Your Import</Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DirectImportSection;
