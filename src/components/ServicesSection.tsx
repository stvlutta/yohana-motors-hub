import { Ship, Calculator, FileCheck, CreditCard, Car, Globe } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    icon: Ship,
    title: "Direct Import",
    description: "Import vehicles directly from Japan, UK, Dubai & more at competitive prices.",
    href: "/direct-import",
  },
  {
    icon: CreditCard,
    title: "Car Financing",
    description: "Flexible financing options tailored to your budget with competitive rates.",
    href: "/financing",
  },
  {
    icon: FileCheck,
    title: "Duty Free",
    description: "Special duty exemptions for diplomats, disabled persons, returning residents & expatriates.",
    href: "/duty-free",
  },
  {
    icon: Calculator,
    title: "Duty Calculator",
    description: "Calculate your import duty costs instantly with our integrated calculator.",
    href: "/calculator",
  },
  {
    icon: Car,
    title: "Sell Your Car",
    description: "List your vehicle with us and reach thousands of potential buyers.",
    href: "/sell",
  },
  {
    icon: Globe,
    title: "Overseas Stock",
    description: "Browse our extensive catalogue of vehicles available overseas ready for import.",
    href: "/overseas-stock",
  },
];

const ServicesSection = () => {
  return (
    <section className="py-12 md:py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-xs md:text-sm mb-2">
            What We Offer
          </p>
          <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground">
            Our Services
          </h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 auto-rows-fr">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group flex flex-col h-full bg-white/60 backdrop-blur-xl rounded-xl p-4 sm:p-5 md:p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-white/80"
            >
              <div className="w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-lg gradient-red flex items-center justify-center mb-3 md:mb-5 shrink-0">
                <service.icon className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary-foreground" />
              </div>
              <h3 className="text-sm sm:text-base md:text-xl font-heading font-bold text-foreground mb-1.5 md:mb-2 leading-tight group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-xs sm:text-[13px] md:text-sm leading-snug md:leading-relaxed line-clamp-3 md:line-clamp-none">
                {service.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

