import React from 'react';
import { ArrowRight, Search, BookOpen, MessageSquare, Video, FileText, Settings, Shield, Zap, Users, HelpCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const HelpCenter = () => {
  const categories = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Getting Started",
      description: "Learn the basics and set up your account",
      articleCount: 12,
      color: "primary"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Account & Settings",
      description: "Manage your account and preferences",
      articleCount: 8,
      color: "secondary"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Trading Features",
      description: "Master our AI-powered trading tools",
      articleCount: 15,
      color: "primary"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security & Privacy",
      description: "Keep your account and data safe",
      articleCount: 6,
      color: "secondary"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Reports & Analytics",
      description: "Understand your trading performance",
      articleCount: 10,
      color: "primary"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Troubleshooting",
      description: "Solve common issues and errors",
      articleCount: 14,
      color: "secondary"
    }
  ];

  const popularArticles = [
    {
      title: "How to Upload and Analyze Trading Charts",
      category: "Trading Features",
      readTime: "5 min read",
      views: "2.5K"
    },
    {
      title: "Setting Up Your First Trade Entry",
      category: "Getting Started",
      readTime: "3 min read",
      views: "1.8K"
    },
    {
      title: "Understanding AI Trading Insights",
      category: "Trading Features",
      readTime: "7 min read",
      views: "1.2K"
    },
    {
      title: "Connecting Your TradingView Account",
      category: "Account & Settings",
      readTime: "4 min read",
      views: "950"
    },
    {
      title: "Exporting Performance Reports",
      category: "Reports & Analytics",
      readTime: "6 min read",
      views: "780"
    },
    {
      title: "Resetting Your Password",
      category: "Account & Settings",
      readTime: "2 min read",
      views: "650"
    }
  ];

  const supportChannels = [
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      description: "Get instant help from our support team",
      availability: "24/7",
      response: "Instant"
    },
    {
      icon: <Video className="w-6 h-6" />,
      title: "Video Tutorials",
      description: "Step-by-step video guides for all features",
      availability: "Always Available",
      response: "Self-service"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Community Forum",
      description: "Connect with other traders and share tips",
      availability: "24/7",
      response: "Community"
    }
  ];

  const quickActions = [
    {
      title: "Create Account",
      description: "Sign up for a free trial",
              action: () => window.location.href = '/demo'
    },
    {
      title: "Watch Demo",
      description: "See TradeMaster AI in action",
      action: () => window.location.href = '/demo'
    },
    {
      title: "View Pricing",
      description: "Choose the right plan for you",
      action: () => window.location.href = '/pricing'
    },
    {
      title: "Contact Support",
      description: "Get help from our team",
      action: () => window.location.href = '/contact'
    }
  ];

  return (
  <Layout>
    <PageHero 
      title="Help Center" 
        subtitle="Find answers to your questions and learn how to make the most of TradeMaster AI."
      />
      
      {/* Search Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                How Can We Help?
              </h2>
              <p className="body-text">
                Search our knowledge base or browse categories below.
              </p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search for help articles, tutorials, or guides..."
                className="pl-12 pr-4 py-4 text-lg bg-muted/20 border-border/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Quick Actions
            </h2>
            <p className="body-text">
              Get started quickly with these common tasks.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={action.action}
              >
                <CardContent className="p-6 text-center">
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {action.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm">
                    {action.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Browse by Category
            </h2>
            <p className="body-text">
              Find help articles organized by topic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(`/help/category/${category.title.toLowerCase().replace(/\s+/g, '-')}`, '_blank')}
              >
                <CardHeader>
                  <div className={`text-${category.color} mb-4`}>
                    {category.icon}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {category.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {category.description}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      {category.articleCount} articles
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Popular Articles
            </h2>
            <p className="body-text">
              Most viewed help articles and guides.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {popularArticles.map((article, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(`/help/article/${index + 1}`, '_blank')}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <Badge variant="outline" className="text-xs">
                      {article.category}
                    </Badge>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{article.views} views</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 hover:text-primary transition-colors">
                    {article.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {article.readTime}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Support Channels */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Need More Help?
            </h2>
            <p className="body-text">
              Connect with our support team through multiple channels.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {supportChannels.map((channel, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{channel.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {channel.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {channel.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Availability:</span>
                      <span className="font-medium text-foreground">{channel.availability}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response:</span>
                      <span className="font-medium text-foreground">{channel.response}</span>
                    </div>
                  </div>
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
              Quick answers to common questions about TradeMaster AI.
            </p>
          </div>
          
          <div className="space-y-6">
            {[
              {
                question: "How do I get started with TradeMaster AI?",
                answer: "Sign up for a free trial at trademaster.ai/demo. You'll get 14 days of full access to all features with no credit card required."
              },
              {
                question: "What types of charts can I upload for analysis?",
                answer: "We support all major chart formats including PNG, JPG, and screenshots from TradingView, MetaTrader, and other trading platforms."
              },
              {
                question: "How accurate are the AI trading insights?",
                answer: "Our AI models achieve 95% accuracy in pattern recognition and provide reliable insights based on historical data and market analysis."
              },
              {
                question: "Can I export my trading data and reports?",
                answer: "Yes, you can export your trading data, performance reports, and analytics in multiple formats including CSV, PDF, and Excel."
              },
              {
                question: "Is my trading data secure?",
                answer: "Absolutely. We use bank-level encryption and security measures to protect your data. We never share your information with third parties."
              }
            ].map((faq, index) => (
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
            <div className="text-primary mb-6">
              <HelpCircle className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Still Need Help?
            </h2>
            <p className="body-text mb-8">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="professional-button px-8 py-4 text-lg"
              >
                Contact Support
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://docs.trademaster.ai', '_blank')}
                className="accent-button px-8 py-4 text-lg"
              >
                View Documentation
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default HelpCenter; 