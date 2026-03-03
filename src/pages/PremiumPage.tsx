import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Car, Crown, Star, Phone, ArrowRight } from "lucide-react";

const services = [
  {
    icon: Shield,
    title: "Armoured Vehicles",
    description:
      "Certified ballistic protection for VIPs, diplomats, and corporate executives. We source and deliver armoured SUVs, sedans, and specialty vehicles from trusted global manufacturers.",
    features: ["B4–B7 ballistic ratings", "Run-flat tyres & blast protection", "Discreet factory-level integration", "After-sales armour maintenance"],
  },
  {
    icon: Car,
    title: "Luxury Car Hire",
    description:
      "Experience world-class vehicles for weddings, corporate events, airport transfers, or weekend getaways. Chauffeur-driven or self-drive options available.",
    features: ["Range Rover, Mercedes S-Class, BMW 7 Series", "Chauffeur & self-drive options", "Airport meet-and-greet service", "Flexible daily, weekly & monthly rates"],
  },
  {
    icon: Crown,
    title: "VIP Concierge Services",
    description:
      "End-to-end lifestyle management for discerning clients. From sourcing rare vehicles worldwide to coordinating logistics, insurance, and registration — we handle it all.",
    features: ["Global vehicle sourcing", "Door-to-door delivery anywhere in Kenya", "Insurance & registration handling", "Dedicated relationship manager"],
  },
];

const PremiumPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="py-20 gradient-navy relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_70%)]" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Premium Division</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-heading font-bold text-secondary-foreground leading-tight">
              Luxury & Protection,{" "}
              <span className="text-primary">Redefined</span>
            </h1>
            <p className="text-secondary-foreground/70 mt-6 max-w-2xl mx-auto text-lg">
              Yohana Automotive's Premium Division delivers armoured vehicles,
              luxury rentals, and white-glove concierge services for clients who
              demand excellence.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to="/appointment">
                <Button variant="hero" size="lg">
                  Book a Consultation
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <a href="tel:+254723041684">
                <Button variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  <Phone className="mr-2 h-5 w-5" />
                  Call Us
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground">
                Our Premium Services
              </h2>
              <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
                Tailored automotive solutions for high-net-worth individuals,
                corporations, and diplomatic missions.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.title}
                  className="group bg-card border border-border rounded-xl p-8 hover:border-primary/40 hover:shadow-elevated transition-all duration-300"
                >
                  <div className="w-14 h-14 rounded-lg gradient-red flex items-center justify-center mb-6">
                    <service.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-3">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Star className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-secondary-foreground mb-4">
              Ready to Experience Premium?
            </h2>
            <p className="text-secondary-foreground/70 max-w-lg mx-auto mb-8">
              Contact our Premium Division team for a private consultation.
              Discretion and excellence guaranteed.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointment">
                <Button variant="hero" size="lg">Schedule Private Viewing</Button>
              </Link>
              <a
                href="https://wa.me/254723041684?text=Hello%20Yohana%20Premium%20Division!%20I%27d%20like%20to%20inquire%20about%20your%20premium%20services."
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="border-secondary-foreground/30 text-secondary-foreground hover:bg-secondary-foreground/10">
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default PremiumPage;
