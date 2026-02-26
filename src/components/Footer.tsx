import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import logo from "@/assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <img src={logo} alt="Yohana Automotive" className="h-16 w-auto mb-4 brightness-0 invert" />
            <p className="text-secondary-foreground/60 text-sm leading-relaxed">
              Kenya's trusted car dealership specializing in direct imports, duty-free vehicles, and premium financing options.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { label: "Inventory", href: "/inventory" },
                { label: "Direct Import", href: "/direct-import" },
                { label: "Duty Free", href: "/duty-free" },
                { label: "Sell Your Car", href: "/sell" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-secondary-foreground/60 hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Services</h4>
            <ul className="space-y-2 text-sm">
              {["Car Financing", "Duty Calculator", "Overseas Stock", "Schedule Appointment"].map((s) => (
                <li key={s}>
                  <span className="text-secondary-foreground/60">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-lg mb-4 text-primary">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3 text-secondary-foreground/60">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                Nairobi, Kenya
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/60">
                <Phone className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                +254 700 000 000
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/60">
                <Mail className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                info@yohanaautomotive.co.ke
              </li>
              <li className="flex items-start gap-3 text-secondary-foreground/60">
                <Clock className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                Mon - Sat: 8AM - 6PM
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-secondary-foreground/10 mt-12 pt-8 text-center text-sm text-secondary-foreground/40">
          © {new Date().getFullYear()} Yohana Automotive. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
