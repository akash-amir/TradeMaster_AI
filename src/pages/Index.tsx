
import React from 'react';
// Eager: critical above-the-fold
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import PricingSection from '@/components/PricingSection';
import FinalCTASection from '@/components/FinalCTASection';
import Footer from '@/components/Footer';
// Lazy: below-the-fold and heavy visuals
const AnimatedBackground = React.lazy(() => import('@/components/AnimatedBackground'));
const ProblemSection = React.lazy(() => import('@/components/ProblemSection'));
const DemoSection = React.lazy(() => import('@/components/DemoSection'));
const FAQSection = React.lazy(() => import('@/components/FAQSection'));
// Keep lazy variants for desktop/tablet to maintain performance
const FinalCTASectionLazy = React.lazy(() => import('@/components/FinalCTASection'));
const FooterLazy = React.lazy(() => import('@/components/Footer'));

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);
  React.useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mql.matches);
    update();
    mql.addEventListener?.('change', update);
    return () => mql.removeEventListener?.('change', update);
  }, []);
  return isMobile;
}

const Index = () => {
  // Lazy-load below-the-fold sections to improve first paint, especially on mobile
  // Keep Navbar and Hero eager for better perceived performance
  // Note: imports at top should use React.lazy
  const isMobile = useIsMobile();
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Defer heavy background effects on mobile */}
      <div className="hidden md:block neon-bg" />
      <div className="hidden md:block">
        <React.Suspense fallback={null}>
          <AnimatedBackground />
        </React.Suspense>
      </div>
      <div className="relative z-10">
        <Navbar />
        <HeroSection />
        {/* Below-the-fold sections lazily loaded with light fallbacks */}
        <React.Suspense fallback={<div className="section-spacing" />}> <ProblemSection /> </React.Suspense>
        {/* FeaturesSection is critical and now loaded eagerly to avoid any lazy-load visibility issues */}
        <FeaturesSection />
        <React.Suspense fallback={<div className="section-spacing" />}> <DemoSection /> </React.Suspense>
        {/* PricingSection is also critical for conversions; load eagerly to avoid lazy issues */}
        <PricingSection />
        <React.Suspense fallback={<div className="section-spacing" />}> <FAQSection /> </React.Suspense>
        {/* Regressive lazy loading: eager on mobile for reliability, lazy on larger screens for performance */}
        {isMobile ? (
          <FinalCTASection />
        ) : (
          <React.Suspense fallback={<div className="section-spacing" />}> <FinalCTASectionLazy /> </React.Suspense>
        )}
        {isMobile ? (
          <Footer />
        ) : (
          <React.Suspense fallback={null}> <FooterLazy /> </React.Suspense>
        )}
      </div>
    </div>
  );
};

export default Index;
