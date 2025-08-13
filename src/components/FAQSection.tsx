
import React from 'react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { motion } from 'framer-motion';

const FAQSection = () => {
  const faqs = [
    {
      question: "What trading platforms does TradeMaster AI support?",
      answer: "TradeMaster AI integrates with major trading platforms including MetaTrader 4/5, TradingView, Interactive Brokers, and many prop firm platforms. We also offer manual trade logging for any platform."
    },
    {
      question: "How does the AI analysis work?",
      answer: "Our AI algorithms analyze your trading patterns, market conditions, and performance metrics to identify trends, weaknesses, and opportunities. The system learns from thousands of successful traders to provide personalized insights."
    },
    {
      question: "Is my trading data secure?",
      answer: "Absolutely. We use bank-level encryption and never store your actual trading credentials. All data is encrypted in transit and at rest, and we're SOC 2 compliant for maximum security."
    },
    {
      question: "Can I use TradeMaster AI for prop firm trading?",
      answer: "Yes! Many prop firm traders use TradeMaster AI to track their performance and meet their funding requirements. Our Elite plan includes multi-account management perfect for prop traders."
    },
    {
      question: "Do you offer a free trial?",
      answer: "Yes, we offer a 14-day free trial with full access to all features. No credit card required to start your trial."
    },
    {
      question: "What markets can I track?",
      answer: "TradeMaster AI supports all major markets including Forex, Cryptocurrencies, Stocks, Indices, Commodities, and Options. The AI adapts its analysis based on the specific market characteristics."
    },
    {
      question: "How quickly will I see improvements in my trading?",
      answer: "Most users see meaningful insights within the first week of logging trades. Significant performance improvements typically occur within 30-60 days of consistent use and following our AI recommendations."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your data remains accessible during your billing period."
    }
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      id="faq" className="section-spacing"
    >
      <div className="max-w-5xl mx-auto container-padding">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } }
          }}
          className="text-center mb-12 animate-fade-in space-y-4"
        >
          <motion.h2
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } }
            }}
            className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight text-white"
          >
            Frequently Asked <span className="gradient-text">Questions</span>
          </motion.h2>
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
            }}
            className="text-base md:text-lg text-[#E0E0E0]"
          >
            Everything you need to know about TradeMaster AI
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.7 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.10 } }
          }}
          className="animate-fade-in"
        >
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 40 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } }
                }}
              >
                <AccordionItem 
                  value={`item-${index}`}
                  className="premium-card rounded-2xl px-4 data-[state=open]:premium-hover transition-all duration-300 overflow-hidden"
                >
                  <AccordionTrigger className="text-left text-base md:text-lg font-medium text-white hover:text-white/90 py-4 transition-colors duration-300">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="body-text pb-4 text-sm">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>

        <div className="text-center mt-10 animate-fade-in space-y-2">
          <p className="text-base text-white/70">Still have questions?</p>
          <a 
            href="mailto:support@trademasterai.com"
            className="text-white hover:text-white/80 font-medium text-base transition-colors duration-300"
          >
            Contact our support team
          </a>
        </div>
      </div>
    </motion.section>
  );
};

export default FAQSection;
