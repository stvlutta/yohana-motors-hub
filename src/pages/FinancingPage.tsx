import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CreditCard, Check, Clock, Percent, Banknote } from "lucide-react";

const financingOptions = [
  {
    icon: Banknote,
    title: "Buy Your Dream Car & Pay Monthly",
    features: [
      "Tenure up to 60 months",
      "Interest rates as low as 12%",
      "Deposit as low as 10%",
      "Available for locally sourced vehicles",
    ],
  },
  {
    icon: CreditCard,
    title: "Direct Import Financing",
    features: [
      "30% deposit required",
      "Pay balance over 48–60 months",
      "Available for any car directly imported",
      "Import from UK, Japan, SA & Australia",
    ],
  },
  {
    icon: Percent,
    title: "Duty-Free Import Financing",
    features: [
      "Up to 50% import financing available",
      "For diplomats, returning residents & PWDs",
      "Flexible repayment terms",
      "Fast approval process",
    ],
  },
];

const FinancingPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <CreditCard className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Car Financing
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Buy your dream car and pay monthly. Flexible financing options tailored to your budget with competitive rates.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {financingOptions.map((option) => (
                <div key={option.title} className="bg-card rounded-lg p-8 shadow-card border border-border hover:shadow-elevated transition-all">
                  <div className="w-14 h-14 rounded-lg gradient-red flex items-center justify-center mb-5">
                    <option.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-4">{option.title}</h3>
                  <ul className="space-y-3">
                    {option.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-foreground">
                        <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-heading font-bold text-foreground mb-4">
              How It Works
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mt-10">
              {[
                { step: "1", title: "Choose Your Car", desc: "Browse our inventory or tell us what you want to import." },
                { step: "2", title: "Apply for Financing", desc: "Submit your application and get approved within 48 hours." },
                { step: "3", title: "Drive Away", desc: "Pay your deposit and start your monthly payments." },
              ].map((s) => (
                <div key={s.step} className="text-center">
                  <div className="w-12 h-12 rounded-full gradient-red text-primary-foreground font-heading font-bold text-lg flex items-center justify-center mx-auto mb-3">
                    {s.step}
                  </div>
                  <h4 className="font-heading font-bold text-foreground mb-2">{s.title}</h4>
                  <p className="text-muted-foreground text-sm">{s.desc}</p>
                </div>
              ))}
            </div>
            <Link to="/appointment" className="mt-10 inline-block">
              <Button variant="hero" size="lg">Apply for Financing</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FinancingPage;
