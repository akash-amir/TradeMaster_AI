
import React from 'react';
import { Twitter, Linkedin, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: 'Features', href: '/features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Demo', href: '/demo' },
      { name: 'API', href: '/api' }
    ],
    Company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
      { name: 'Contact', href: '/contact' }
    ],
    Support: [
      { name: 'Help Center', href: '/help-center' },
      { name: 'Documentation', href: '/documentation' },
      { name: 'Community', href: '/community' },
      { name: 'Status', href: '/status' }
    ],
    Legal: [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms-of-service' },
      { name: 'Cookie Policy', href: '/cookie-policy' },
      { name: 'GDPR', href: '/gdpr' }
    ]
  };

  const socialLinks = [
    { icon: <Twitter className="w-5 h-5" />, href: '#', label: 'Twitter' },
    { icon: <Linkedin className="w-5 h-5" />, href: '#', label: 'LinkedIn' },
    { icon: <Mail className="w-5 h-5" />, href: 'mailto:hello@trademasterai.com', label: 'Email' },
    { icon: <MessageCircle className="w-5 h-5" />, href: '#', label: 'Discord' }
  ];

  return (
    <footer className="bg-[#111111] border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Logo and description */}
          <div className="col-span-2 md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-4">TradeMaster AI</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              The intelligent trading companion that transforms how you analyze, 
              learn, and evolve your trading strategies.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="text-gray-400 hover:text-primary transition-colors p-2 hover:bg-primary/10 rounded-lg"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-white mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom section */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">  
          <p className="text-gray-400 text-sm">
            © 2024 TradeMaster AI. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 mt-4 md:mt-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-400">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
