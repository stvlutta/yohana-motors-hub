import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accessibility, Plane, Building2, Globe2 } from "lucide-react";

const categories = [
  {
    icon: Accessibility,
    title: "Persons with Disabilities",
    description: "Tax exemptions on specially adapted vehicles for qualifying individuals.",
  },
  {
    icon: Plane,
    title: "Returning Residents",
    description: "Duty-free importation for Kenyans returning home after living abroad.",
  },
  {
    icon: Building2,
    title: "Diplomats",
    description: "Full diplomatic duty exemptions for accredited diplomatic personnel.",
  },
  {
    icon: Globe2,
    title: "Expatriates",
    description: "Special import privileges for expatriates working in Kenya.",
  },
];

const DutyFreeSection = () => {
  return (
    <section className="py-20 gradient-navy relative">
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <p className="text-red-brand font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Tax Exemptions
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
            Duty Free Vehicles
          </h2>
          <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
            We specialize in helping eligible individuals import vehicles duty-free into Kenya.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.title}
              className="bg-secondary-foreground/5 backdrop-blur-sm border border-secondary-foreground/10 rounded-lg p-6 text-center hover:bg-secondary-foreground/10 transition-colors"
            >
              <div className="w-14 h-14 rounded-full gradient-red flex items-center justify-center mx-auto mb-4">
                <cat.icon className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="font-heading font-bold text-lg text-secondary-foreground mb-2">{cat.title}</h3>
              <p className="text-secondary-foreground/60 text-sm">{cat.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/duty-free">
            <Button variant="hero" size="lg">Learn More</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default DutyFreeSection;
