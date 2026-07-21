import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import InventoryPreview from "@/components/InventoryPreview";
import OverseasStockPreview from "@/components/OverseasStockPreview";
import CommunityInventoryPreview from "@/components/CommunityInventoryPreview";
import DirectImportSection from "@/components/DirectImportSection";
import DutyFreeSection from "@/components/DutyFreeSection";
import SellYourCarSection from "@/components/SellYourCarSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16 md:pt-24">
        <HeroSection />
        <ServicesSection />
        <InventoryPreview />
        <OverseasStockPreview />
        <CommunityInventoryPreview />
        <DirectImportSection />
        <DutyFreeSection />
        <SellYourCarSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
