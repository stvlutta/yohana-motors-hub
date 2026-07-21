import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Globe2, Sparkles } from "lucide-react";
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
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-secondary">
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
              className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-60"
            />
            <img
              src={src}
              alt={`Happy Yohana Automotive client ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-contain ${
                i === index ? "animate-ken-burns" : ""
              }`}
            />
          </div>
        ))}
        <div className="absolute inset-0 gradient-hero opacity-75 pointer-events-none" />
      </div>

      {/* Floating color blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full bg-primary/30 blur-3xl animate-blob-drift pointer-events-none" />
      <div
        className="absolute -bottom-32 -right-24 w-[520px] h-[520px] rounded-full blur-3xl animate-blob-drift pointer-events-none"
        style={{ background: "hsl(var(--navy) / 0.35)", animationDelay: "2s" }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 py-24 md:py-28">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full border border-white/30 bg-white/10 backdrop-blur-xl text-primary-foreground text-xs md:text-sm font-body">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="tracking-wide uppercase">Together at every step</span>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] font-heading font-bold text-primary-foreground leading-[1.02] mb-6 drop-shadow-lg">
              Drive Your
              <span className="block relative w-fit">
                <span className="text-gradient-red">Dream Car</span>
                <span className="pointer-events-none absolute inset-0 overflow-hidden">
                  <span className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/50 to-transparent blur-sm animate-shimmer-line" />
                </span>
              </span>
              <span className="block text-primary-foreground/95">Home to Kenya.</span>
            </h1>

            <p className="text-base md:text-lg text-primary-foreground/90 mb-8 max-w-xl font-body drop-shadow">
              Import directly from Japan, UK & Dubai. Duty-free options, flexible
              financing, and a seamless handover — every single time.
            </p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/inventory">
                <Button variant="hero" size="lg" className="text-base px-8 py-6 group">
                  Browse Inventory
                  <ArrowRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/direct-import">
                <Button variant="heroOutline" size="lg" className="text-base px-8 py-6">
                  Direct Import
                </Button>
              </Link>
            </div>

            {/* Stat pills */}
            <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-xl">
              {[
                { k: "500+", v: "Cars Delivered" },
                { k: "3", v: "Import Hubs" },
                { k: "100%", v: "Verified Units" },
              ].map((s, i) => (
                <div
                  key={s.v}
                  className="rounded-2xl border border-white/25 bg-white/10 backdrop-blur-xl px-3 py-3 md:px-4 md:py-4 animate-fade-in-up"
                  style={{ animationDelay: `${0.2 + i * 0.1}s`, opacity: 0 }}
                >
                  <div className="text-xl md:text-2xl font-heading font-bold text-primary-foreground">
                    {s.k}
                  </div>
                  <div className="text-[11px] md:text-xs uppercase tracking-wider text-primary-foreground/75">
                    {s.v}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Floating trust card */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="relative animate-float-slow">
              <div
                className="absolute -inset-1 rounded-3xl blur-2xl opacity-70"
                style={{ background: "linear-gradient(135deg, hsl(var(--primary)/0.5), hsl(var(--navy)/0.5))" }}
              />
              <div className="relative rounded-3xl border border-white/30 bg-white/15 backdrop-blur-2xl p-6 shadow-2xl">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/90 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-heading font-semibold text-primary-foreground">Trusted Import Partner</p>
                    <p className="text-xs text-primary-foreground/70">Registered • Insured • Bonded</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { icon: Globe2, label: "Japan • UK • Dubai sourcing" },
                    { icon: ShieldCheck, label: "Full pre-shipment inspection" },
                    { icon: Sparkles, label: "Duty-free & financing options" },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 rounded-xl border border-white/20 bg-white/10 px-3 py-2.5"
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm text-primary-foreground/90 font-body">{label}</span>
                    </div>
                  ))}
                </div>
                <Link to="/appointments" className="block mt-5">
                  <Button variant="hero" size="sm" className="w-full">
                    Book a Consultation
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
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
