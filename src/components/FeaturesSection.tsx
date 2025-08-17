
import React from 'react';
import { BookOpen, Brain, BarChart3, Target, Lightbulb, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <BookOpen className="w-8 h-8 text-white/40" />,
      title: "Smart Trade Journal",
      description: "Log trades with intelligent auto-categorization and pattern recognition for comprehensive tracking."
    },
    {
      icon: <Brain className="w-8 h-8 text-white/40" />,
      title: "AI Strategy Analysis",
      description: "Advanced algorithms analyze your strategies and suggest optimizations based on market conditions."
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-white/40" />,
      title: "Performance Analytics",
      description: "Deep dive into your trading metrics with interactive charts and trend analysis."
    },
    {
      icon: <Target className="w-8 h-8 text-white/40" />,
      title: "Goal Tracking",
      description: "Set and monitor trading goals with milestone tracking and progress visualization."
    },
    {
      icon: <Lightbulb className="w-8 h-8 text-white/40" />,
      title: "Insight Generation",
      description: "Receive personalized insights and recommendations to improve your trading approach."
    },
    {
      icon: <Shield className="w-8 h-8 text-white/40" />,
      title: "Risk Assessment",
      description: "Comprehensive risk analysis with position sizing recommendations and exposure warnings."
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Trigger animation earlier on small screens so content doesn't appear hidden
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      id="features" className="section-spacing"
    >
      <div className="max-w-7xl mx-auto container-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          className="text-center mb-20 animate-fade-in space-y-6"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
            }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold leading-tight text-white"
          >
            Features Built for <span className="bg-gradient-to-r from-[#00C896] via-[#00BFFF] to-[#00FFAA] bg-clip-text text-transparent">Excellence</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="subheadline-text max-w-3xl mx-auto text-[#E0E0E0]"
          >
            Every feature designed to help you become a consistently profitable trader through intelligent analysis.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.10 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
              }}
              className="group premium-card features-glow rounded-xl sm:rounded-2xl p-4 sm:p-5 premium-hover animate-scale-in relative overflow-hidden"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-4 p-2 rounded-xl w-fit group-hover:bg-[#00C896]/10 transition-colors duration-300 bg-[#00BFFF]/10">
                {React.cloneElement(feature.icon, { className: 'w-6 h-6', style: { color: index % 2 === 0 ? '#00C896' : '#00BFFF' } })}
              </div>
              <h3 className="text-base font-medium mb-2 text-white group-hover:text-[#00C896] transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="body-text leading-relaxed text-xs text-[#E0E0E0]">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FeaturesSection;
