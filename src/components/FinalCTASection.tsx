
import React from 'react';
import { ArrowRight, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion } from 'framer-motion';

const FinalCTASection = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      className="py-16 bg-gradient-to-br from-dark via-dark-lighter to-dark relative overflow-hidden"
      transition={{ duration: 0.8, ease: 'easeOut' }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-neon/10"></div>
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-r from-primary/20 to-neon/20 animate-float"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-r from-neon/20 to-primary/20 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          className="animate-fade-in"
        >
          {/* Badge */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="inline-flex items-center px-6 py-3 rounded-full border border-primary/30 bg-primary/10 text-primary text-lg font-medium mb-8"
          >
            <Star className="w-5 h-5 mr-2" />
            Join 500+ Professional Traders
          </motion.div>

          {/* Main headline */}
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
            }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight"
          >
            Ready to Master <br />
            <span className="gradient-text">Your Trading?</span>
          </motion.h2>

          {/* Subheadline */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Stop trading on gut feelings. Start making data-driven decisions with AI-powered insights 
            that transform your trading performance.
          </motion.p>

          {/* Email capture form */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="max-w-md mx-auto mb-8"
          >
            <div className="flex gap-3">
              <Input 
                type="email" 
                placeholder="Enter your email address"
                className="bg-dark-card border-gray-600 text-white placeholder-gray-400 focus:border-primary h-14 text-lg"
              />
              <Button 
                onClick={() => window.location.href = '/dashboard'}
                size="lg" 
                className="bg-primary hover:bg-primary-dark text-dark font-semibold px-8 h-14 glow-effect group animate-glow"
              >
                <Zap className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                Start Free Trial
              </Button>
            </div>
            <p className="text-sm text-gray-400 mt-3">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </motion.div>

          {/* Social proof */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="flex flex-col md:flex-row gap-8 justify-center items-center mb-12"
          >
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 bg-primary rounded-full border-2 border-dark flex items-center justify-center text-dark font-bold">
                    {i}
                  </div>
                ))}
              </div>
              <span className="text-gray-400 ml-2">500+ active traders</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="flex items-center gap-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-5 h-5 text-[#00C896] fill-current" />
                ))}
              </div>
              <span className="text-gray-400">4.9/5 average rating</span>
            </div>
            <div className="hidden md:block w-px h-6 bg-gray-600"></div>
            <div className="text-gray-400">
              <span className="text-primary font-bold">95%</span> see improvement in 30 days
            </div>
          </motion.div>

          {/* Final CTA */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
          >
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            size="lg" 
              className="bg-gradient-to-r from-primary to-neon hover:from-primary-dark hover:to-primary text-dark font-bold text-base px-8 py-4 rounded-2xl glow-effect group animate-glow"
          >
            Transform Your Trading Now
            <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="mt-12 pt-8 border-t border-gray-800"
          >
            <p className="text-gray-400 mb-4">Trusted by traders worldwide</p>
            <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-3 sm:gap-8 text-gray-500">
              <span className="font-semibold">SOC 2 Compliant</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold">Bank-level Security</span>
              <span className="hidden sm:inline">•</span>
              <span className="font-semibold">30-day Guarantee</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default FinalCTASection;
