import React from 'react';
import { ArrowRight, Users, MessageSquare, Globe, Heart, Award, Star, ExternalLink, Calendar, TrendingUp, Shield, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Community = () => {
  const platforms = [
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Discord Server",
      description: "Join our active Discord community for real-time discussions, trading tips, and support.",
      members: "5,000+",
      status: "Active",
      link: "https://discord.gg/trademaster-ai",
      features: ["Live trading discussions", "AI strategy sharing", "Expert Q&A", "Trading challenges"]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Community Forum",
      description: "Share strategies, ask questions, and connect with traders worldwide.",
      members: "2,500+",
      status: "Active",
      link: "https://community.trademaster.ai",
      features: ["Strategy discussions", "Technical analysis", "Platform feedback", "Success stories"]
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Trading Groups",
      description: "Join specialized trading groups based on your strategy and experience level.",
      members: "1,200+",
      status: "Active",
      link: "https://groups.trademaster.ai",
      features: ["Day trading group", "Swing trading group", "Options trading", "Crypto trading"]
    }
  ];

  const events = [
    {
      title: "Weekly Trading Masterclass",
      date: "Every Tuesday, 8 PM EST",
      type: "Live Webinar",
      attendees: "500+",
      description: "Learn advanced trading strategies and AI insights from our expert team."
    },
    {
      title: "Monthly Strategy Showcase",
      date: "First Friday of each month",
      type: "Community Event",
      attendees: "200+",
      description: "Community members share their most successful trading strategies and insights."
    },
    {
      title: "AI Trading Workshop",
      date: "Monthly",
      type: "Interactive Workshop",
      attendees: "150+",
      description: "Deep dive into AI-powered trading techniques and platform features."
    }
  ];

  const achievements = [
    {
      icon: <Star className="w-6 h-6" />,
      title: "Top Contributor",
      description: "Recognized for valuable contributions to the community",
      criteria: "50+ helpful posts"
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Strategy Master",
      description: "Shared strategies that helped other traders succeed",
      criteria: "10+ successful strategies"
    },
    {
      icon: <Heart className="w-6 h-6" />,
      title: "Community Helper",
      description: "Consistently helps new traders and answers questions",
      criteria: "100+ helpful responses"
    },
    {
      icon: <Award className="w-6 h-6" />,
      title: "Trading Champion",
      description: "Demonstrated exceptional trading performance",
      criteria: "Consistent profitable trades"
    }
  ];

  const stats = [
    { number: "8,500+", label: "Community Members" },
    { number: "15,000+", label: "Posts & Discussions" },
    { number: "500+", label: "Trading Strategies Shared" },
    { number: "95%", label: "Member Satisfaction" }
  ];

  return (
  <Layout>
    <PageHero 
        title="Join Our Community" 
        subtitle="Connect with thousands of traders worldwide. Share strategies, learn from experts, and grow together."
      />
      
      {/* Community Stats */}
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

      {/* Community Platforms */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Where to Connect
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Join our community across multiple platforms and connect with traders worldwide.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {platforms.map((platform, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{platform.icon}</div>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {platform.title}
                    </CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {platform.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {platform.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Members:</span>
                      <span className="font-semibold text-foreground">{platform.members}</span>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="font-semibold text-foreground text-sm">Features:</h4>
                      <ul className="space-y-1">
                        {platform.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <Button 
                      onClick={() => window.open(platform.link, '_blank')}
                      className="w-full professional-button"
                    >
                      Join Community
                      <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Events */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Upcoming Events
            </h2>
            <p className="body-text">
              Join our live events and workshops to enhance your trading skills.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {events.map((event, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {event.attendees} attendees
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-3">
                    {event.title}
                  </CardTitle>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {event.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {event.date}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Achievements */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Community Achievements
            </h2>
            <p className="body-text">
              Earn recognition for your contributions to the trading community.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((achievement, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="text-primary mb-4 flex justify-center">
                    {achievement.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {achievement.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mb-3">
                    {achievement.description}
                  </CardDescription>
                  <Badge variant="outline" className="text-xs">
                    {achievement.criteria}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community Guidelines */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Shield className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Community Guidelines
              </h2>
              <p className="body-text">
                Help us maintain a positive and supportive trading community.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Do's</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Share helpful trading insights and strategies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Be respectful and supportive of other traders
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Ask questions and seek advice from the community
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                    Report any suspicious or inappropriate content
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Don'ts</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Share financial advice without proper disclaimers
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Spam or promote unrelated products/services
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Harass or bully other community members
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    Share personal information of others
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <div className="text-primary mb-6">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join?
            </h2>
            <p className="body-text mb-8">
              Connect with thousands of traders and start your journey to trading success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://discord.gg/trademaster-ai', '_blank')}
                className="professional-button px-8 py-4 text-lg"
              >
                Join Discord
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://community.trademaster.ai', '_blank')}
                className="accent-button px-8 py-4 text-lg"
              >
                Visit Forum
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default Community; 