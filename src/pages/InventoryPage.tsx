import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Car, MapPin, Phone, ArrowRight } from "lucide-react";

const InventoryPage = () => {
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
              Browse our showroom collection at Ridgeways, Kiambu Rd — Adjacent to Ciata City Mall.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl text-center">
            <div className="bg-card rounded-lg p-10 border border-border shadow-card">
              <Car className="h-16 w-16 text-primary/20 mx-auto mb-6" />
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">
                Visit Our Showroom
              </h2>
              <p className="text-muted-foreground mb-2">
                Our full inventory is available at our showroom. Visit us or contact us for current stock availability.
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
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;
