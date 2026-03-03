import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Accessibility, Plane, Building2, Globe2, Check, ArrowRight } from "lucide-react";

const categories = [
  {
    icon: Accessibility,
    title: "People Living with Disability",
    description: "We assist you in importing cars specially modified to meet your mobility needs — all while handling the full tax exemption paperwork and customs process on your behalf.",
    benefits: [
      "Full support with documentation",
      "Direct coordination with government agencies",
      "Financing available for all imports",
      "Quick, transparent, and reliable services",
    ],
  },
  {
    icon: Building2,
    title: "Diplomatic Staff",
    description: "Are you an expatriate, diplomat, diplomatic staff, foreign aid staff, or working for a multinational that allows you to own a vehicle duty free in Kenya?",
    benefits: [
      "Sourcing and importation of desired vehicle",
      "Handling of all documentation with relevant agencies",
      "Facilitation of port clearing and delivery",
      "Up to 50% import financing available",
    ],
  },
  {
    icon: Plane,
    title: "Returning Residents",
    description: "Are you planning a move back to Kenya after a long stay overseas? We can assist you with utilizing your returning residence duty-exempt vehicle status — fast, easy, and affordable.",
    benefits: [
      "Sourcing and importation of desired vehicle",
      "Handling of all documentation with relevant agencies",
      "Facilitation of port clearing, charges, and delivery",
      "Vehicle sourced from UK, Japan, SA & Australia",
    ],
  },
  {
    icon: Globe2,
    title: "Expatriates & NGOs",
    description: "Special duty-free import privileges for expatriates and NGO personnel working in Kenya. Let us handle the process for you.",
    benefits: [
      "Comprehensive import advisory",
      "Full documentation support",
      "Up to 50% import financing available",
      "End-to-end facilitation",
    ],
  },
];

const DutyFreePage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Duty Free Vehicles
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Are you eligible for tax-exempt car importation in Kenya? Let Yohana Automotive handle it for you — fast, easy, and affordable with up to 50% import financing available!
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="space-y-12">
              {categories.map((cat, i) => (
                <div key={cat.title} className={`grid lg:grid-cols-2 gap-8 items-center ${i % 2 === 1 ? "lg:flex-row-reverse" : ""}`}>
                  <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-full gradient-red flex items-center justify-center">
                        <cat.icon className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <h3 className="text-2xl font-heading font-bold text-foreground">{cat.title}</h3>
                    </div>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{cat.description}</p>
                    <h4 className="text-primary font-heading font-bold mb-3">Here's how we help:</h4>
                    <ul className="space-y-2">
                      {cat.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm text-foreground">
                          <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={`bg-muted rounded-lg p-8 text-center ${i % 2 === 1 ? "lg:order-1" : ""}`}>
                    <cat.icon className="h-20 w-20 text-primary mx-auto mb-4 opacity-20" />
                    <p className="text-primary font-heading font-bold text-lg">{cat.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-heading font-bold text-secondary-foreground mb-4">
              Ready to Import Duty Free?
            </h2>
            <p className="text-secondary-foreground/70 mb-8 max-w-lg mx-auto">
              Contact us today for a free consultation. We'll guide you through the entire process.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/appointment">
                <Button variant="hero" size="lg" className="gap-2">
                  Book Consultation <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="tel:+254733994501">
                <Button variant="heroOutline" size="lg">Call 0733 994 501</Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DutyFreePage;
