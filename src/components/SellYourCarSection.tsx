import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Camera, FileText, Handshake } from "lucide-react";

const steps = [
  { icon: Camera, title: "Upload Photos", description: "Take clear photos of your vehicle from all angles." },
  { icon: FileText, title: "Share Details", description: "Fill in your car's make, model, year, mileage & condition." },
  { icon: Handshake, title: "Get Offers", description: "We'll match you with buyers and handle the sale." },
];

const SellYourCarSection = () => {
  return (
    <section className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <p className="text-primary font-heading font-semibold uppercase tracking-[0.2em] text-sm mb-2">
            Sell With Us
          </p>
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground">
            Looking to Sell Your Car?
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            List your vehicle with Yohana Automotive and reach thousands of verified buyers across Kenya.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mb-10">
          {steps.map((step, i) => (
            <div key={step.title} className="text-center">
              <div className="w-16 h-16 rounded-full gradient-navy flex items-center justify-center mx-auto mb-4 relative">
                <step.icon className="h-7 w-7 text-secondary-foreground" />
                <span className="absolute -top-1 -right-1 w-6 h-6 gradient-red rounded-full text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading font-bold text-lg text-foreground mb-2">{step.title}</h3>
              <p className="text-muted-foreground text-sm">{step.description}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/sell">
            <Button variant="hero" size="lg" className="px-10">Sell Your Car Now</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default SellYourCarSection;
