import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Accessibility, Plane, Building2, Globe2 } from "lucide-react";

const categories = [
  {
    icon: Accessibility,
    title: "People Living with Disability",
    description: "We assist you in importing cars specially modified to meet your mobility needs while handling the full tax exemption paperwork and customs process on your behalf.",
  },
  {
    icon: Plane,
    title: "Returning Residents",
    description: "Planning a move back to Kenya after a long stay overseas? We can assist you with utilizing your returning residence duty-exempt vehicle status — fast, easy, and affordable.",
  },
  {
    icon: Building2,
    title: "Diplomatic Staff",
    description: "Are you a diplomat, diplomatic staff, foreign aid staff, or working for a multinational? Yohana Automotive will handle your duty-free vehicle importation fast and affordably.",
  },
  {
    icon: Globe2,
    title: "Expatriates & NGOs",
    description: "Special duty-free import privileges for expatriates and NGO personnel working in Kenya. Up to 50% import financing available.",
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
            Are you eligible for tax-exempt car importation in Kenya? Let Yohana Automotive handle it for you — fast, easy, and affordable with up to 50% import financing available!
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
