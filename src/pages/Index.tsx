
import React from 'react';
import AnimatedBackground from '@/components/AnimatedBackground';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import ProblemSection from '@/components/ProblemSection';
import FeaturesSection from '@/components/FeaturesSection';
import DemoSection from '@/components/DemoSection';
import PricingSection from '@/components/PricingSection';
import FAQSection from '@/components/FAQSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="neon-bg" />
      <AnimatedBackground />
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        <ProblemSection />
        <FeaturesSection />
        <DemoSection />
        <PricingSection />
        <FAQSection />
        <FinalCTASection />
        <Footer />
      </div>
    </div>
  );
};

export default Index;
