import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import KeunggulanSection from "./components/KeunggulanSection";
import TemplateSection from "./components/TemplateSection";
import CaraKerjaSection from "./components/CaraKerjaSection";
import DemoSection from "./components/DemoSection";
import FiturSection from "./components/FiturSection";
import TestimoniSection from "./components/TestimoniSection";
import HargaSection from "./components/HargaSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <KeunggulanSection />
      <TemplateSection />
      <CaraKerjaSection />
      <DemoSection />
      <FiturSection />
      <TestimoniSection />
      <HargaSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </>
  );
}
