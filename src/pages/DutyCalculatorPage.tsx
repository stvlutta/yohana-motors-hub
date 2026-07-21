import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calculator, Info, FileText, Coins, Truck, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const components = [
  { icon: Coins, title: "Import Duty (IDF)", desc: "Typically 25% – 35% of CIF (Cost, Insurance, Freight) value depending on vehicle category." },
  { icon: FileText, title: "Excise Duty", desc: "20% – 35% depending on engine size, year of manufacture, and vehicle type (EV / hybrid / fossil)." },
  { icon: Calculator, title: "VAT", desc: "16% charged on the sum of CIF + Import Duty + Excise Duty." },
  { icon: Truck, title: "IDF Fee + RDL", desc: "Import Declaration Fee (3.5%) and Railway Development Levy (2%) on the CIF value." },
];

const DutyCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Import Duty Calculator
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Estimate the total landed cost of importing your vehicle into Kenya — duties, taxes, levies, shipping and clearance.
            </p>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="bg-card border border-border rounded-lg p-6 mb-8">
              <div className="flex items-start gap-3 mb-4">
                <Info className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h2 className="font-heading font-bold text-foreground text-lg mb-1">How to use the calculator</h2>
                  <p className="text-sm text-muted-foreground">
                    Enter the vehicle's make, model, year of manufacture and engine size. The tool below pulls the Current Retail Selling Price (CRSP) from KRA's database, then computes Import Duty, Excise Duty, VAT, IDF and RDL automatically. The figure you see is what KRA will charge at the port of Mombasa.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-6">
                {components.map((c) => (
                  <div key={c.title} className="flex gap-3 p-3 rounded-md bg-muted/40">
                    <c.icon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-foreground text-sm">{c.title}</p>
                      <p className="text-xs text-muted-foreground">{c.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-4 rounded-md border border-primary/30 bg-primary/5 text-sm">
                <p className="font-semibold text-foreground mb-1">Heads up</p>
                <p className="text-muted-foreground">
                  Vehicles must be <strong>8 years old or less</strong> from the year of first registration to qualify for import into Kenya. Add roughly <strong>USD 1,200 – 2,500</strong> for shipping & insurance and <strong>KSh 80,000 – 150,000</strong> for clearing, port handling, IDF processing and registration on top of the calculated duty.
                </p>
              </div>
            </div>

            <div className="bg-card rounded-lg shadow-elevated border border-border overflow-hidden">
              <iframe
                src="https://calculator.co.ke"
                title="Kenya Import Duty Calculator"
                className="w-full h-[800px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-3 mb-8">
              Live data powered by calculator.co.ke • Figures are estimates — final duty is determined by KRA at clearance.
            </p>

            <div className="bg-card border border-border rounded-lg p-6 text-center">
              <h3 className="font-heading font-bold text-foreground text-xl mb-2">Need a precise landed cost?</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Send us the vehicle details or a link to the listing and we'll give you an all-inclusive quote (purchase + shipping + duty + clearance + delivery) within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/appointment?service=Direct%20Import%20Inquiry">
                  <Button variant="hero">Book a Consultation</Button>
                </Link>
                <a href="tel:+254714007122"><Button variant="navy" className="gap-2"><Phone className="h-4 w-4" /> 0714 007 122</Button></a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DutyCalculatorPage;
