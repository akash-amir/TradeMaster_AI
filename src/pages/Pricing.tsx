import React from 'react';
import { Check, ArrowRight, Star, Zap, Crown, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Pricing = () => {
  const plans = [
    {
      name: "Starter",
      price: "$29",
      period: "/month",
      description: "Perfect for individual traders getting started",
      icon: <Users className="w-6 h-6" />,
      features: [
        "Up to 100 trades per month",
        "Basic AI analysis",
        "TradingView integration",
        "Email support",
        "Basic performance reports",
        "Mobile app access"
      ],
      popular: false,
      cta: "Start Free Trial"
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Advanced features for serious traders",
      icon: <Zap className="w-6 h-6" />,
      features: [
        "Unlimited trades",
        "Advanced AI insights",
        "Priority support",
        "Custom strategies",
        "Advanced analytics",
        "API access",
        "Community access",
        "Risk management tools"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "Complete solution for trading teams",
      icon: <Crown className="w-6 h-6" />,
      features: [
        "Everything in Professional",
        "Team collaboration",
        "White-label solutions",
        "Dedicated account manager",
        "Custom integrations",
        "Advanced reporting",
        "Training & onboarding",
        "SLA guarantees"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  const faqs = [
    {
      question: "Can I change my plan anytime?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
    },
    {
      question: "Is there a free trial?",
      answer: "Yes, all plans come with a 14-day free trial. No credit card required to start."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans."
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time with no cancellation fees."
    }
  ];

  return (
    <Layout>
      <PageHero 
        title="Simple, Transparent Pricing" 
        subtitle="Choose the plan that fits your trading needs. All plans include our core AI features."
      />
      
      {/* Pricing Cards */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`premium-card premium-hover animate-scale-in border-border/20 relative ${
                  plan.popular ? 'ring-2 ring-primary/50 scale-105' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                      <Star className="w-4 h-4" />
                      Most Popular
                    </div>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <div className="text-primary mb-4 flex justify-center">
                    {plan.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-6">
                    <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full mt-8 ${
                      plan.popular 
                        ? 'professional-button' 
                        : 'accent-button'
                    }`}
                    onClick={() => {
                      if (plan.name === 'Enterprise') {
                        window.location.href = '/contact';
                      } else {
                        window.location.href = '/demo';
                      }
                    }}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Frequently Asked Questions
            </h2>
            <p className="body-text">
              Everything you need to know about our pricing and plans.
            </p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="body-text mb-8">
              Join thousands of traders who trust TradeMaster AI for their trading success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/demo'}
                className="professional-button px-8 py-4 text-lg"
              >
                Start Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="accent-button px-8 py-4 text-lg"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Pricing;