import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import SellPage from "./pages/SellPage";
import AppointmentPage from "./pages/AppointmentPage";
import DutyCalculatorPage from "./pages/DutyCalculatorPage";
import BlogPage from "./pages/BlogPage";
import FinancingPage from "./pages/FinancingPage";
import DirectImportPage from "./pages/DirectImportPage";
import DutyFreePage from "./pages/DutyFreePage";
import OverseasStockPage from "./pages/OverseasStockPage";
import InventoryPage from "./pages/InventoryPage";
import NotFound from "./pages/NotFound";
import WhatsAppButton from "./components/WhatsAppButton";
import AIChatbot from "./components/AIChatbot";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/direct-import" element={<DirectImportPage />} />
          <Route path="/duty-free" element={<DutyFreePage />} />
          <Route path="/financing" element={<FinancingPage />} />
          <Route path="/overseas-stock" element={<OverseasStockPage />} />
          <Route path="/sell" element={<SellPage />} />
          <Route path="/appointment" element={<AppointmentPage />} />
          <Route path="/calculator" element={<DutyCalculatorPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <WhatsAppButton />
        <AIChatbot />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
