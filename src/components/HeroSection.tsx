import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import slide1 from "@/assets/hero/handover-1.jpg";
import slide2 from "@/assets/hero/handover-2.jpg";
import slide3 from "@/assets/hero/handover-3.jpg";
import slide4 from "@/assets/hero/handover-4.jpg";
import slide5 from "@/assets/hero/handover-5.jpg";
import slide6 from "@/assets/hero/handover-6.jpg";
import slide7 from "@/assets/hero/handover-7.jpg";
import slide8 from "@/assets/hero/handover-8.jpg";
import slide9 from "@/assets/hero/handover-9.jpg";
import slide10 from "@/assets/hero/handover-10.jpg";

const slides = [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9, slide10];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`Happy Yohana Automotive client ${i + 1}`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
        <div className="absolute inset-0 gradient-hero opacity-80" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.3em] text-sm mb-4">
            Together At Every Step
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

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-2 bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
