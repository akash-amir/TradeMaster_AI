import React from 'react';

interface PageHeroProps {
  title: string;
  subtitle: string;
}

const PageHero: React.FC<PageHeroProps> = ({ title, subtitle }) => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 px-4 overflow-hidden">
      <div className="max-w-8xl mx-auto container-padding text-center flex flex-col justify-center min-h-screen">
        <div className="animate-fade-in space-y-8">
          {/* Main Headline */}
          <div className="space-y-6">
            <h1 className="headline-text text-3xl md:text-5xl lg:text-6xl leading-tight">
              <span className="text-white">{title}</span>
            </h1>
            {/* Subheadline */}
            <p className="subheadline-text max-w-2xl mx-auto text-base md:text-lg">
              {subtitle}
            </p>
          </div>
        </div>
      </div>
      {/* Minimal scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-element">
        <div className="w-px h-10 bg-white/20 rounded-full flex justify-center">
          <div className="w-px h-4 bg-white/40 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default PageHero; 