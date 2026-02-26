import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import overseasImg from "@/assets/overseas-stock.jpg";

const OverseasStockSection = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
              Overseas Stock
            </p>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6">
              Browse Cars in Japan, UK & Dubai
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Access thousands of quality vehicles from international auctions and dealers. Choose your dream car and we'll handle the rest — inspection, purchase, shipping, and clearance.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {["Toyota", "Nissan", "Honda", "Mazda", "Subaru", "Mercedes", "BMW"].map((brand) => (
                <span key={brand} className="bg-muted text-foreground font-heading font-semibold text-sm px-4 py-2 rounded-full border border-border">
                  {brand}
                </span>
              ))}
            </div>
            <Link to="/overseas-stock">
              <Button variant="navy" size="lg">View Overseas Stock</Button>
            </Link>
          </div>
          <div className="relative rounded-lg overflow-hidden shadow-elevated">
            <img src={overseasImg} alt="Overseas car stock" className="w-full h-[400px] object-cover" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverseasStockSection;
