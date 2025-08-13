import React from 'react';
import { Play, ArrowRight, BarChart3, Brain, TrendingUp, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Demo = () => {
  const demoFeatures = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Watch as our AI analyzes your trades in real-time, providing instant insights and recommendations."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "See how our advanced AI identifies patterns and suggests optimal entry and exit points."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Performance Tracking",
      description: "Monitor your trading performance with detailed analytics and progress tracking."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Learn how our risk management tools help protect your capital and optimize position sizing."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Professional Trader",
      content: "TradeMaster AI transformed my trading approach. The AI insights are incredibly accurate and the interface is intuitive.",
      avatar: "SC"
    },
    {
      name: "Michael Rodriguez",
      role: "Day Trader",
      content: "The real-time analytics and risk management features have significantly improved my win rate. Highly recommended!",
      avatar: "MR"
    },
    {
      name: "Emma Thompson",
      role: "Swing Trader",
      content: "Finally, a trading platform that combines powerful AI with a beautiful, user-friendly interface.",
      avatar: "ET"
    }
  ];

  return (
    <Layout>
      <PageHero 
        title="See TradeMaster AI in Action" 
        subtitle="Watch how our AI-powered platform transforms your trading experience with real-time insights and advanced analytics."
      />
      
      {/* Demo Video Section */}
      <section className="section-spacing">
        <div className="max-w-6xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-primary/30">
                  <Play className="w-8 h-8 text-primary ml-1" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-2">
                  Watch the Demo
                </h3>
                <p className="text-muted-foreground mb-6">
                  See how TradeMaster AI analyzes trades and provides insights
                </p>
                <Button 
                  className="professional-button"
                  onClick={() => window.open('https://youtube.com/watch?v=demo', '_blank')}
                >
                  Play Demo Video
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              What You'll See in the Demo
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Discover the key features that make TradeMaster AI the ultimate trading companion.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {demoFeatures.map((feature, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Demo CTA */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-16 text-center animate-fade-in">
            <div className="text-primary mb-6">
              <Zap className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Try It Yourself
            </h2>
            <p className="body-text mb-8">
              Don't just watch - experience the power of TradeMaster AI with our interactive demo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/demo'}
                className="professional-button px-8 py-4 text-lg"
              >
                Start Interactive Demo
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/features'}
                className="accent-button px-8 py-4 text-lg"
              >
                View All Features
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              What Traders Are Saying
            </h2>
            <p className="body-text">
              Join thousands of satisfied traders who have transformed their trading with TradeMaster AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Experience the Future of Trading?
            </h2>
            <p className="body-text mb-8">
              Start your free trial today and see the difference AI-powered trading can make.
            </p>
            <Button 
              onClick={() => window.location.href = '/demo'}
              className="professional-button px-8 py-4 text-lg"
            >
              Start Free Trial
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Demo;