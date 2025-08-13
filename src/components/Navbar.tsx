
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: '#features', label: 'Features' },
    { href: '#demo', label: 'Demo' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#faq', label: 'FAQ' },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 glass-effect">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl font-semibold text-white tracking-tight">TradeMaster AI</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/60 hover:text-white transition-colors duration-300 text-sm font-normal"
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button 
              onClick={() => window.location.href = '/dashboard'}
              className="professional-button px-6 py-2 text-sm rounded-full"
            >
              Get Started
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white/60 hover:text-white transition-colors duration-300"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-6 pt-4 pb-6 space-y-3 glass-effect rounded-xl mt-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="text-white/60 hover:text-white block px-4 py-3 text-base font-normal transition-colors duration-300"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <div className="pt-4">
                <Button 
                  onClick={() => window.location.href = '/dashboard'}
                  className="w-full professional-button py-3 rounded-full"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
