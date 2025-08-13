import React from 'react';
import { ArrowRight, Users, Target, Award, Globe, Heart, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const About = () => {
  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "CEO & Co-Founder",
      bio: "Former quantitative analyst at Goldman Sachs with 15+ years in algorithmic trading. PhD in Computer Science from MIT.",
      avatar: "SC",
      expertise: ["AI/ML", "Quantitative Finance", "Leadership"]
    },
    {
      name: "Michael Rodriguez",
      role: "CTO & Co-Founder",
      bio: "Ex-Google engineer with deep expertise in machine learning and scalable systems. Built trading platforms for hedge funds.",
      avatar: "MR",
      expertise: ["Software Engineering", "ML Systems", "Architecture"]
    },
    {
      name: "Emma Thompson",
      role: "Head of Product",
      bio: "Former product manager at Robinhood and Coinbase. Passionate about making advanced trading tools accessible to everyone.",
      avatar: "ET",
      expertise: ["Product Strategy", "UX Design", "Trading"]
    },
    {
      name: "David Kim",
      role: "Head of AI Research",
      bio: "Leading researcher in financial AI with publications in top journals. Previously at DeepMind and Two Sigma.",
      avatar: "DK",
      expertise: ["AI Research", "Financial Modeling", "Neural Networks"]
    }
  ];

  const values = [
    {
      icon: <Target className="w-8 h-8" />,
      title: "Innovation First",
      description: "We push the boundaries of what's possible with AI and trading technology."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Trust & Security",
      description: "Your data and trading success are our top priorities. We never compromise on security."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Community Driven",
      description: "We believe in the power of community and shared knowledge in trading."
    },
    {
      icon: <Heart className="w-8 h-8" />,
      title: "User Success",
      description: "Every feature we build is designed to help traders succeed and grow."
    }
  ];

  const milestones = [
    {
      year: "2024",
      title: "Series A Funding",
      description: "Raised $15M to accelerate product development and team growth."
    },
    {
      year: "2023",
      title: "10,000+ Active Users",
      description: "Reached our first major milestone with traders worldwide."
    },
    {
      year: "2022",
      title: "Platform Launch",
      description: "Successfully launched TradeMaster AI to the public."
    },
    {
      year: "2021",
      title: "Company Founded",
      description: "Started with a vision to democratize AI-powered trading."
    }
  ];

  return (
    <Layout>
      <PageHero 
        title="About TradeMaster AI" 
        subtitle="We're on a mission to democratize AI-powered trading intelligence and help traders worldwide achieve their financial goals."
      />
      
      {/* Mission Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Our Mission
              </h2>
              <p className="body-text mb-6">
                We believe that advanced trading intelligence shouldn't be limited to institutional investors. 
                Our mission is to democratize AI-powered trading tools and make professional-grade insights 
                accessible to traders of all levels.
              </p>
              <p className="body-text mb-8">
                By combining cutting-edge artificial intelligence with intuitive design, we're helping 
                thousands of traders worldwide make more informed decisions and achieve better results.
              </p>
              <Button 
                onClick={() => window.location.href = '/features'}
                className="professional-button"
              >
                Explore Our Platform
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="premium-card p-8 animate-scale-in">
              <div className="text-center">
                <div className="text-primary mb-6">
                  <Globe className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Global Impact
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-sm text-muted-foreground">Active Traders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                    <div className="text-sm text-muted-foreground">Trades Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Our Values
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              The principles that guide everything we do at TradeMaster AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index}
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{value.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {value.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {value.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Team
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              The brilliant minds behind TradeMaster AI, combining decades of experience in trading, AI, and technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card 
                key={index}
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader className="text-center">
                  <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary font-bold text-xl">
                    {member.avatar}
                  </div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {member.name}
                  </CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                    {member.bio}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {member.expertise.map((skill, skillIndex) => (
                      <span 
                        key={skillIndex}
                        className="px-2 py-1 bg-muted/20 rounded-md text-xs text-muted-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Section */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Our Journey
            </h2>
            <p className="body-text">
              Key milestones in our mission to revolutionize trading with AI.
            </p>
              </div>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="text-3xl font-bold text-primary min-w-[80px]">
                      {milestone.year}
              </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {milestone.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {milestone.description}
                      </p>
              </div>
            </div>
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
              <Zap className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Join Our Mission
            </h2>
            <p className="body-text mb-8">
              Be part of the future of trading. Start your journey with TradeMaster AI today.
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
                onClick={() => window.location.href = '/careers'}
                className="accent-button px-8 py-4 text-lg"
              >
                Join Our Team
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;