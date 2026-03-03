import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CalendarCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const AppointmentPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "", date: "", time: "", service: "", message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.from("appointments").insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service: formData.service,
        appointment_date: formData.date,
        appointment_time: formData.time,
        message: formData.message || null,
      });
      if (error) throw error;
      toast({ title: "Appointment Booked!", description: "We'll confirm via SMS and email shortly." });
      setFormData({ name: "", phone: "", email: "", date: "", time: "", service: "", message: "" });
    } catch (err) {
      console.error(err);
      toast({ title: "Error", description: "Something went wrong. Please call us at 0723 041 684.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <CalendarCheck className="h-12 w-12 text-primary mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Schedule an Appointment
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Book a visit to our showroom at Ridgeways, Kiambu Rd or schedule a consultation with our team.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                <Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                <Input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={formData.service}
                  onChange={(e) => setFormData({...formData, service: e.target.value})}
                  required
                >
                  <option value="">Select Service</option>
                  <option>Vehicle Purchase Consultation</option>
                  <option>Direct Import Inquiry</option>
                  <option>Duty Free Consultation</option>
                  <option>Financing Options</option>
                  <option>Sell Your Car</option>
                  <option>Test Drive</option>
                </select>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} required />
                <Input type="time" value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} required />
              </div>
              <Textarea placeholder="Additional notes..." value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} />
              <Button type="submit" variant="hero" size="lg" className="w-full" disabled={loading}>
                {loading ? "Booking..." : "Book Appointment"}
              </Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default AppointmentPage;
