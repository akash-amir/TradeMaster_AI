import React from 'react';
import { ArrowRight, Users, Heart, Zap, Globe, Award, MapPin, Clock, DollarSign, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Careers = () => {
  const openPositions = [
    {
      id: 1,
      title: "Senior Machine Learning Engineer",
      department: "AI Research",
      location: "San Francisco, CA",
      type: "Full-time",
      salary: "$150K - $200K",
      experience: "5+ years",
      description: "Join our AI team to build cutting-edge machine learning models for trading analysis and prediction.",
      requirements: [
        "PhD in Computer Science, Statistics, or related field",
        "Experience with deep learning frameworks (PyTorch, TensorFlow)",
        "Strong background in financial modeling and quantitative analysis",
        "Experience with large-scale data processing and distributed systems"
      ],
      benefits: ["Competitive salary", "Equity package", "Health insurance", "Flexible work hours"]
    },
    {
      id: 2,
      title: "Full Stack Software Engineer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      salary: "$120K - $160K",
      experience: "3+ years",
      description: "Build scalable web applications and APIs that power our trading platform.",
      requirements: [
        "Strong experience with React, TypeScript, and Node.js",
        "Experience with cloud platforms (AWS, GCP)",
        "Knowledge of database design and optimization",
        "Experience with real-time data processing"
      ],
      benefits: ["Remote work", "Competitive salary", "Health insurance", "Professional development"]
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
      salary: "$130K - $170K",
      experience: "4+ years",
      description: "Lead product strategy and development for our AI-powered trading platform.",
      requirements: [
        "Experience in fintech or trading platforms",
        "Strong analytical and problem-solving skills",
        "Experience with user research and data analysis",
        "Excellent communication and leadership skills"
      ],
      benefits: ["Competitive salary", "Equity package", "Health insurance", "Flexible work hours"]
    },
    {
      id: 4,
      title: "Data Scientist",
      department: "Data Science",
      location: "Remote",
      type: "Full-time",
      salary: "$110K - $150K",
      experience: "3+ years",
      description: "Analyze trading data and develop insights to improve our AI models and platform features.",
      requirements: [
        "MS/PhD in Statistics, Mathematics, or related field",
        "Experience with Python, R, and SQL",
        "Knowledge of statistical modeling and machine learning",
        "Experience with financial data analysis"
      ],
      benefits: ["Remote work", "Competitive salary", "Health insurance", "Professional development"]
    }
  ];

  const benefits = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance, mental health support, and wellness programs."
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Flexible Work",
      description: "Remote work options, flexible hours, and unlimited PTO to maintain work-life balance."
    },
    {
      icon: <Award className="w-8 h-8" />,
      title: "Growth & Learning",
      description: "Professional development budget, conference attendance, and continuous learning opportunities."
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Great Team",
      description: "Work with brilliant minds in AI, finance, and technology who are passionate about innovation."
    }
  ];

  const values = [
    {
      title: "Innovation First",
      description: "We push boundaries and embrace new technologies to solve complex problems."
    },
    {
      title: "User-Centric",
      description: "Everything we build is designed to help our users succeed in their trading journey."
    },
    {
      title: "Collaboration",
      description: "We believe the best solutions come from diverse teams working together."
    },
    {
      title: "Excellence",
      description: "We strive for excellence in everything we do, from code quality to user experience."
    }
  ];

  return (
  <Layout>
    <PageHero 
        title="Join Our Team" 
        subtitle="Help us revolutionize trading with AI. Join a team of passionate innovators building the future of financial technology."
      />
      
      {/* Company Culture */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Why Work With Us
              </h2>
              <p className="body-text mb-6">
                At TradeMaster AI, we're building the future of trading technology. Our team combines 
                deep expertise in artificial intelligence, financial markets, and software engineering 
                to create innovative solutions that help traders worldwide.
              </p>
              <p className="body-text mb-8">
                We believe in fostering a culture of innovation, collaboration, and continuous learning. 
                Join us in our mission to democratize AI-powered trading intelligence.
              </p>
              <Button 
                onClick={() => document.getElementById('positions')?.scrollIntoView({ behavior: 'smooth' })}
                className="professional-button"
              >
                View Open Positions
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <div className="premium-card p-8 animate-scale-in">
              <div className="text-center">
                <div className="text-primary mb-6">
                  <Globe className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Global Team
                </h3>
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50+</div>
                    <div className="text-sm text-muted-foreground">Team Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">15+</div>
                    <div className="text-sm text-muted-foreground">Countries</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">4.9</div>
                    <div className="text-sm text-muted-foreground">Glassdoor Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Retention Rate</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Benefits & Perks
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              We take care of our team with comprehensive benefits and a supportive work environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{benefit.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {benefit.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {benefit.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Open Positions
            </h2>
            <p className="body-text">
              Join our mission to revolutionize trading with AI. Find the perfect role for your skills and passion.
            </p>
          </div>
          
          <div className="space-y-8">
            {openPositions.map((position, index) => (
              <Card 
                key={position.id} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge variant="outline" className="text-xs">
                          {position.department}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {position.type}
                        </Badge>
                      </div>
                      <CardTitle className="text-2xl font-bold text-foreground mb-3">
                        {position.title}
                      </CardTitle>
                      <p className="text-muted-foreground mb-6">
                        {position.description}
                      </p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="w-4 h-4" />
                          {position.location}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          {position.experience}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <DollarSign className="w-4 h-4" />
                          {position.salary}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Briefcase className="w-4 h-4" />
                          {position.type}
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-foreground mb-3">Requirements:</h4>
                        <ul className="space-y-2">
                          {position.requirements.map((req, reqIndex) => (
                            <li key={reqIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-foreground mb-3">Benefits:</h4>
                        <div className="flex flex-wrap gap-2">
                          {position.benefits.map((benefit, benefitIndex) => (
                            <Badge key={benefitIndex} variant="outline" className="text-xs">
                              {benefit}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="lg:flex-shrink-0">
                      <Button 
                        onClick={() => window.open(`/careers/apply/${position.id}`, '_blank')}
                        className="professional-button w-full lg:w-auto"
                      >
                        Apply Now
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Values */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Our Values
            </h2>
            <p className="body-text">
              The principles that guide our work and shape our culture.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20 text-center"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">
                    {value.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Application Process */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-16 text-center animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Join Us?
            </h2>
            <p className="body-text mb-8">
              Don't see the perfect role? We're always looking for talented individuals to join our team. 
              Send us your resume and let's start a conversation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('/careers/apply', '_blank')}
                className="professional-button px-8 py-4 text-lg"
              >
                Apply Now
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="accent-button px-8 py-4 text-lg"
              >
                Contact Us
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default Careers; 