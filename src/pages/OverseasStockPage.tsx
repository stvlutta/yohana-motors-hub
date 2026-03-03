import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Globe, ArrowRight } from "lucide-react";

const brands = ["Toyota", "Nissan", "Honda", "Mazda", "Subaru", "Mercedes-Benz", "BMW", "Audi", "Range Rover", "Ford", "Suzuki", "Mitsubishi"];

const OverseasStockPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Globe className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Overseas Stock
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Browse thousands of quality vehicles from UK, Japan, South Africa & Australia. Choose your dream car and we'll handle the rest.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-3xl font-heading font-bold text-foreground mb-6 text-center">Popular Brands Available</h2>
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              {brands.map((brand) => (
                <span key={brand} className="bg-muted text-foreground font-heading font-semibold text-sm px-5 py-2.5 rounded-full border border-border">
                  {brand}
                </span>
              ))}
            </div>

            <div className="bg-card rounded-lg p-8 border border-border shadow-card text-center">
              <h3 className="text-2xl font-heading font-bold text-foreground mb-4">How to Order</h3>
              <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
                Found a car on Autotrader UK, BE FORWARD, SBT Japan, or any overseas platform? Send us the link or details and we'll give you a landed cost within 24 hours.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <a href="https://wa.me/254723041684" target="_blank" rel="noopener noreferrer">
                  <Button variant="hero" size="lg" className="gap-2">
                    WhatsApp Us <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
                <Link to="/appointment">
                  <Button variant="navy" size="lg">Book Consultation</Button>
                </Link>
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
