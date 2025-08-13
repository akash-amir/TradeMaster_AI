import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AnimatedBackground from '@/components/AnimatedBackground';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="neon-bg" />
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default Layout; 