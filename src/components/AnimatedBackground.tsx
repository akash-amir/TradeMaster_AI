import React from 'react';

const AnimatedBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Main gradient background - black to dark grey */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black" />
      
      {/* Radial gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-radial from-gray-900/20 via-transparent to-transparent" />
      
      {/* Subtle light effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/[0.02] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-white/[0.015] rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s', animationDelay: '4s' }} />
      
      {/* Floating light orbs */}
      <div className="absolute top-1/3 left-1/6 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl floating-element" />
      <div className="absolute bottom-1/3 right-1/6 w-24 h-24 bg-white/[0.008] rounded-full blur-2xl floating-element" style={{ animationDelay: '3s' }} />
      <div className="absolute top-2/3 left-2/3 w-20 h-20 bg-white/[0.005] rounded-full blur-xl floating-element" style={{ animationDelay: '6s' }} />
      
      {/* Subtle grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '100px 100px'
        }}
      />
      
      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
    </div>
  );
};

export default AnimatedBackground;