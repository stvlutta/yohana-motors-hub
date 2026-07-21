import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
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
import slide11 from "@/assets/hero/handover-11.jpg";
import slide12 from "@/assets/hero/handover-12.jpg";
import slide13 from "@/assets/hero/handover-13.jpg";
import slide14 from "@/assets/hero/handover-14.jpg";
import slide15 from "@/assets/hero/handover-15.jpg";
import slide16 from "@/assets/hero/handover-16.jpg";
import slide17 from "@/assets/hero/handover-17.jpg";

const slides = [
  slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, slide9,
  slide10, slide11, slide12, slide13, slide14, slide15, slide16, slide17,
];

const marqueeBrands = [
  "Toyota", "Mercedes-Benz", "BMW", "Audi", "Lexus", "Land Rover",
  "Porsche", "Volkswagen", "Nissan", "Mazda", "Subaru", "Honda",
];

const HeroSection = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 4500);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative min-h-[60vh] md:min-h-[92vh] flex items-center overflow-hidden bg-secondary">
      {/* Slideshow background */}
      <div className="absolute inset-0">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[1200ms] ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60 md:opacity-70"
            />
            <img
              src={src}
              alt={`Happy Yohana Automotive client ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover md:object-contain object-center ${
                i === index ? "animate-ken-burns" : ""
              }`}
            />

          </div>
        ))}
        {/* Lighter overlay so photos read through; stronger scrim only at bottom for text */}
        <div className="absolute inset-0 gradient-hero opacity-30 md:opacity-60 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-secondary/90 via-secondary/60 to-transparent pointer-events-none md:hidden" />
      </div>

      {/* Floating color blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl animate-blob-drift pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full blur-3xl animate-blob-drift pointer-events-none"
        style={{ background: "hsl(var(--navy) / 0.35)", animationDelay: "2s" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-8 pb-24 md:py-28 mt-auto md:mt-0 self-end md:self-center w-full">
        <div className="max-w-2xl animate-fade-in-up">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.25em] text-xs sm:text-sm mb-2 md:mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Kenya's Trusted Car Dealership
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-heading font-bold text-primary-foreground leading-[1.05] mb-3 md:mb-6 [text-shadow:_0_2px_12px_rgba(0,0,0,0.7)]">
            Drive Your
            <span className="block relative w-fit">
              <span className="text-gradient-red">Dream Car</span>
              <span className="pointer-events-none absolute inset-0 overflow-hidden">
                <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm animate-shimmer-line" />
              </span>
            </span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-primary-foreground/90 mb-5 md:mb-8 max-w-lg font-body [text-shadow:_0_1px_6px_rgba(0,0,0,0.7)]">
            Import directly from Japan, UK & Dubai. Enjoy duty-free options, flexible financing, and a seamless buying experience.
          </p>
          <div className="flex flex-wrap gap-3 md:gap-4">
            <Link to="/inventory">
              <Button variant="hero" size="lg" className="text-sm md:text-base px-6 md:px-8 py-4 md:py-6 group">
                Browse Inventory
                <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/direct-import">
              <Button variant="heroOutline" size="lg" className="text-sm md:text-base px-6 md:px-8 py-4 md:py-6">
                Direct Import
              </Button>
            </Link>
          </div>
        </div>
      </div>


      {/* Brand marquee */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-white/15 bg-navy/40 backdrop-blur-xl">
        <div className="overflow-hidden py-3">
          <div className="flex gap-12 whitespace-nowrap animate-marquee will-change-transform">
            {[...marqueeBrands, ...marqueeBrands].map((b, i) => (
              <span
                key={`${b}-${i}`}
                className="text-primary-foreground/70 font-heading uppercase tracking-[0.25em] text-xs md:text-sm"
              >
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-14 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all ${
              i === index ? "w-8 bg-primary" : "w-1.5 bg-primary-foreground/40"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
