import React from 'react';
import { ArrowRight, BarChart3, Camera, Brain, TrendingUp, FileText, Zap, Shield, Users, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Features = () => {
  const features = [
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Trade Entry Tracking",
      description: "Comprehensive tracking of all your trades with detailed entry and exit points, lot sizes, and timestamps. Monitor your trading performance with precision."
    },
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Screenshot Upload & Chart Analysis",
      description: "Upload trading charts and screenshots for AI-powered technical analysis and pattern recognition. Get instant insights from your visual data."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Feedback & Strategy Suggestions",
      description: "Get intelligent feedback on your trading decisions and personalized strategy recommendations based on your trading patterns and market conditions."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "TradingView Integration",
      description: "Seamless integration with TradingView for advanced charting and real-time market data. Sync your analysis across platforms effortlessly."
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Performance Insights & Reports",
      description: "Detailed performance analytics, profit/loss tracking, and comprehensive trading reports. Understand your strengths and areas for improvement."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Analytics",
      description: "Live trading analytics and real-time performance monitoring for immediate insights. Stay ahead of market movements with instant data."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management Tools",
      description: "Advanced risk management features including position sizing, stop-loss optimization, and portfolio diversification analysis."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community & Sharing",
      description: "Share strategies with the trading community, learn from peers, and access a library of proven trading methodologies."
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "Goal Setting & Tracking",
      description: "Set trading goals and track your progress with AI-powered insights and milestone celebrations to keep you motivated."
    }
  ];

  const stats = [
    { number: "10,000+", label: "Active Traders" },
    { number: "500K+", label: "Trades Analyzed" },
    { number: "95%", label: "Accuracy Rate" },
    { number: "24/7", label: "AI Support" }
  ];

  return (
    <Layout>
      <PageHero 
        title="Powerful Features for Smarter Trading" 
        subtitle="Discover the advanced capabilities that make TradeMaster AI the ultimate trading companion for professional traders."
      />
      
      {/* Stats Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              From trade tracking to AI-powered insights, we've built the complete toolkit for modern traders.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
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

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="body-text mb-8">
              Join thousands of traders who have already elevated their trading game with TradeMaster AI.
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

export default Features;