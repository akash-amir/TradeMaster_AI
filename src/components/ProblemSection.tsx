
import React from 'react';
import { AlertTriangle, TrendingDown, Brain, Target } from 'lucide-react';

const ProblemSection = () => {
  const problems = [
    {
      icon: <TrendingDown className="w-8 h-8 text-white/30" />,
      title: "Inconsistent Performance",
      description: "Without proper tracking, traders repeat mistakes and struggle to identify what actually works."
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-white/30" />,
      title: "Emotional Decision Making",
      description: "Fear and greed drive poor decisions. Most traders lack awareness of their psychological patterns."
    },
    {
      icon: <Brain className="w-8 h-8 text-white/30" />,
      title: "No Strategic Evolution",
      description: "Static strategies fail in dynamic markets. Traders need adaptive, data-driven approach to improvement."
    },
    {
      icon: <Target className="w-8 h-8 text-white/30" />,
      title: "Lack of Systematic Review",
      description: "Most traders skip the crucial step of analyzing their trades, missing valuable insights for growth."
    }
  ];

  const glowClasses = [
    "problem-glow-blue",
    "problem-glow-teal",
    "problem-glow-green",
    "problem-glow-purple"
  ];

  return (
    <section className="section-spacing relative">
      <div className="max-w-7xl mx-auto container-padding">
        {/* Reduce bottom margin on mobile to avoid large gap before features */}
        <div className="text-center mb-10 md:mb-16 animate-fade-in space-y-6">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
            Why Most Traders <span className="text-white/50">Struggle</span>
          </h2>
          <p className="subheadline-text max-w-3xl mx-auto">
            Without proper systems and insights, even experienced traders face common challenges 
            that limit their potential.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {problems.map((problem, index) => (
            <div 
              key={index}
              className={`glass-effect features-glow ${glowClasses[index % glowClasses.length]} rounded-2xl p-8 text-center premium-hover animate-scale-in group`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="mb-6 flex justify-center opacity-60 group-hover:opacity-80 transition-opacity duration-300">
                {problem.icon}
              </div>
              <h3 className="text-lg font-medium mb-4 text-white group-hover:text-white/90 transition-colors duration-300">
                {problem.title}
              </h3>
              <p className="body-text leading-relaxed text-sm">
                {problem.description}
              </p>
            </div>
          ))}
        </div>

        {/* Reduce top margin before the closing line to tighten vertical rhythm on mobile */}
        <div className="text-center mt-8 md:mt-12">
          <p className="text-2xl md:text-3xl font-medium text-white/70">
            There's a <span className="text-white">better way</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
