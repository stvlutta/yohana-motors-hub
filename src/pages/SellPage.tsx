import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Camera, Upload } from "lucide-react";

const SellPage = () => {
  const [formData, setFormData] = useState({
    name: "", phone: "", email: "",
    make: "", model: "", year: "", mileage: "", price: "",
    condition: "", description: "",
  });
  const [photos, setPhotos] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! We'll review your listing and get back to you within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <section className="py-16 gradient-navy">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-secondary-foreground">
              Sell Your Car With Us
            </h1>
            <p className="text-secondary-foreground/70 mt-4 max-w-2xl mx-auto">
              Upload your vehicle details and photos. Our team will reach out with a valuation.
            </p>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4 max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">Your Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Full Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                  <Input placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
                  <Input type="email" placeholder="Email Address" className="md:col-span-2" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">Vehicle Details</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <Input placeholder="Make (e.g. Toyota)" value={formData.make} onChange={(e) => setFormData({...formData, make: e.target.value})} required />
                  <Input placeholder="Model (e.g. Hilux)" value={formData.model} onChange={(e) => setFormData({...formData, model: e.target.value})} required />
                  <Input placeholder="Year" value={formData.year} onChange={(e) => setFormData({...formData, year: e.target.value})} required />
                  <Input placeholder="Mileage (km)" value={formData.mileage} onChange={(e) => setFormData({...formData, mileage: e.target.value})} required />
                  <Input placeholder="Asking Price (KSh)" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} required />
                  <Input placeholder="Condition (Excellent/Good/Fair)" value={formData.condition} onChange={(e) => setFormData({...formData, condition: e.target.value})} required />
                </div>
                <Textarea placeholder="Additional description..." className="mt-4" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
              </div>

              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-4">Vehicle Photos</h3>
                <label className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-10 cursor-pointer hover:border-primary transition-colors bg-muted">
                  <Camera className="h-10 w-10 text-muted-foreground mb-3" />
                  <p className="text-sm text-muted-foreground font-semibold">Click to upload photos</p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 10MB each</p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setPhotos(Array.from(e.target.files || []))}
                  />
                </label>
                {photos.length > 0 && (
                  <p className="mt-3 text-sm text-primary font-semibold flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    {photos.length} photo(s) selected
                  </p>
                )}
              </div>

              <Button type="submit" variant="hero" size="lg" className="w-full">Submit Your Vehicle</Button>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SellPage;
