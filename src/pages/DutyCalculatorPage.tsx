import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calculator } from "lucide-react";

const DutyCalculatorPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Import Duty Calculator
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Calculate the total cost of importing your vehicle to Kenya including duties, taxes, and levies.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card rounded-lg shadow-elevated border border-border overflow-hidden">
              <iframe
                src="https://calculator.co.ke"
                title="Kenya Import Duty Calculator"
                className="w-full h-[800px] border-0"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
            <p className="text-center text-xs text-muted-foreground mt-4">
              Powered by calculator.co.ke
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DutyCalculatorPage;
