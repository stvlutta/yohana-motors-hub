import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Phone } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 gradient-hero relative">
      <div className="container mx-auto px-4 relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground mb-4">
          Ready to Find Your Next Car?
        </h2>
        <p className="text-primary-foreground/70 text-lg max-w-xl mx-auto mb-8">
          Schedule an appointment with our team or call us today. We're here to help you every step of the way.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link to="/appointment">
            <Button variant="hero" size="lg" className="text-base px-8 py-6 gap-2">
              <CalendarCheck className="h-5 w-5" />
              Schedule Appointment
            </Button>
          </Link>
          <a href="tel:+254723041684">
            <Button variant="heroOutline" size="lg" className="text-base px-8 py-6 gap-2">
              <Phone className="h-5 w-5" />
              Call Us Now
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
