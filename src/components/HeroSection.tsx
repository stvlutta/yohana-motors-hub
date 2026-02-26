import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-showroom.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroImg} alt="Yohana Automotive Showroom" className="w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.3em] text-sm mb-4">
            Kenya's Trusted Car Dealership
          </p>
          <h1 className="text-5xl md:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6">
            Drive Your
            <span className="block text-gradient-red">Dream Car</span>
          </h1>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-lg font-body">
            Import directly from Japan, UK & Dubai. Enjoy duty-free options, flexible financing, and a seamless buying experience.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/inventory">
              <Button variant="hero" size="lg" className="text-base px-8 py-6">
                Browse Inventory
              </Button>
            </Link>
            <Link to="/direct-import">
              <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
                Direct Import
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
