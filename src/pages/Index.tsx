import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import InventoryPreview from "@/components/InventoryPreview";
import DirectImportSection from "@/components/DirectImportSection";
import DutyFreeSection from "@/components/DutyFreeSection";
import OverseasStockSection from "@/components/OverseasStockSection";
import SellYourCarSection from "@/components/SellYourCarSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20">
        <HeroSection />
        <ServicesSection />
        <InventoryPreview />
        <DirectImportSection />
        <DutyFreeSection />
        <OverseasStockSection />
        <SellYourCarSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
