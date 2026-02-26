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
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            What We Offer
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Our Services
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Link
              key={service.title}
              to={service.href}
              className="group bg-card rounded-lg p-8 shadow-card hover:shadow-elevated transition-all duration-300 hover:-translate-y-1 border border-border"
            >
              <div className="w-14 h-14 rounded-lg gradient-red flex items-center justify-center mb-5">
                <service.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-heading font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
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
