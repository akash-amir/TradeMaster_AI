
import React from 'react';
import { Check, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const PricingSection = () => {
  const plans = [
    {
      name: "Starter",
      price: "29",
      period: "month",
      description: "Perfect for individual traders getting started",
      features: [
        "Up to 100 trades per month",
        "Basic AI insights",
        "Performance analytics",
        "Mobile app access",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Professional",
      price: "79",
      period: "month",
      description: "For serious traders who want advanced features",
      features: [
        "Unlimited trades",
        "Advanced AI analysis",
        "Custom strategy builder",
        "Real-time coaching",
        "Priority support",
        "API integrations",
        "Advanced risk management"
      ],
      popular: true
    },
    {
      name: "Elite",
      price: "149",
      period: "month",
      description: "For professional prop firm traders",
      features: [
        "Everything in Professional",
        "Multi-account management",
        "Team collaboration",
        "Custom AI models",
        "White-label options",
        "Dedicated account manager",
        "24/7 phone support"
      ],
      popular: false
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      // Trigger animation earlier on small screens so content doesn't appear hidden
      viewport={{ once: true, amount: 0.2 }}
      id="pricing" className="py-16 bg-gradient-to-b from-dark to-dark-lighter"
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          className="text-center mb-10 animate-fade-in"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
            }}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
          >
            Choose Your <span className="gradient-text">Trading Edge</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="text-base text-gray-300 max-w-2xl mx-auto mb-6"
          >
            Start with our free trial, then choose the plan that matches your trading ambitions. 
            All plans include our core AI features.
          </motion.p>
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="inline-flex items-center px-5 py-2 bg-primary/10 border border-primary/30 rounded-full text-primary font-medium mb-6 text-sm"
          >
            <Star className="w-4 h-4 mr-2" />
            Early Bird: 50% off first 3 months
          </motion.div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.10 } }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto"
        >
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 40 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
              }}
              className={`relative bg-dark-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 border transition-all duration-300 animate-scale-in ${
                plan.popular 
                  ? 'border-primary glow-effect sm:transform sm:scale-105' 
                  : 'border-gray-800 hover:border-primary/50'
              } overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-dark px-5 py-1.5 rounded-full text-xs font-bold">
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-gray-400 mb-4 text-sm">{plan.description}</p>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2 text-base">/{plan.period}</span>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center text-sm">
                    <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button 
                onClick={() => window.location.href = '/dashboard'}
                className={`w-full py-2 text-sm font-semibold ${
                  plan.popular
                    ? 'bg-primary hover:bg-primary-dark text-dark glow-effect'
                    : 'bg-transparent border border-primary text-primary hover:bg-primary hover:text-dark'
                }`}
              >
                {plan.popular ? (
                  <>
                    <Zap className="mr-2 w-4 h-4" />
                    Get Started Now
                  </>
                ) : (
                  'Choose Plan'
                )}
              </Button>
              {/* Shine/gloss animation overlay */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: ['-100%', '120%'] }}
                transition={{ duration: 1.2, delay: 0.5 + index * 0.1, ease: 'easeInOut' }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ background: 'linear-gradient(120deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.18) 60%, rgba(255,255,255,0.08) 100%)', filter: 'blur(2px)', opacity: 0.7 }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Money back guarantee */}
        <div className="text-center mt-10 animate-fade-in">
          <div className="inline-flex items-center px-5 py-2 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 font-medium text-sm">
            <Check className="w-4 h-4 mr-2" />
            30-day money-back guarantee
          </div>
          <p className="text-gray-400 mt-3 text-sm">
            Try TradeMaster AI risk-free. If you're not completely satisfied, get a full refund.
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default PricingSection;
