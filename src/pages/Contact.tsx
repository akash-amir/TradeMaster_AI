import React from 'react';
import { ArrowRight, Mail, Phone, MapPin, Clock, MessageSquare, Send, Globe, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Contact = () => {
  const contactMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get help with your account, technical issues, or general questions.",
      contact: "support@trademaster.ai",
      response: "Response within 24 hours"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time for immediate assistance.",
      contact: "Available 24/7",
      response: "Instant response"
    },
    {
      icon: <Phone className="w-8 h-8" />,
      title: "Phone Support",
      description: "Speak directly with our team for urgent matters or complex issues.",
      contact: "+1 (555) 123-4567",
      response: "Mon-Fri, 9AM-6PM EST"
    }
  ];

  const offices = [
    {
      city: "San Francisco",
      country: "United States",
      address: "123 Market Street, Suite 100",
      zip: "San Francisco, CA 94105",
      type: "Headquarters"
    },
    {
      city: "New York",
      country: "United States",
      address: "456 Broadway, Floor 15",
      zip: "New York, NY 10013",
      type: "Sales Office"
    },
    {
      city: "London",
      country: "United Kingdom",
      address: "789 Oxford Street, Level 8",
      zip: "London, W1D 1BS",
      type: "European Hub"
    }
  ];

  const faqs = [
    {
      question: "How do I get started with TradeMaster AI?",
              answer: "Sign up for a free trial at trademaster.ai/demo. You'll get 14 days of full access to all features with no credit card required."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Yes, you can cancel your subscription at any time from your account settings. No cancellation fees apply."
    },
    {
      question: "Do you offer enterprise solutions?",
      answer: "Yes, we offer custom enterprise solutions for trading teams and institutions. Contact our sales team for details."
    }
  ];

  return (
    <Layout>
      <PageHero 
        title="Get in Touch" 
        subtitle="Have questions about TradeMaster AI? Our team is here to help you succeed with AI-powered trading."
      />
      
      {/* Contact Methods */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              How Can We Help?
            </h2>
            <p className="body-text">
              Choose the best way to reach our support team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{method.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {method.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="font-semibold text-foreground">
                      {method.contact}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {method.response}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Send Us a Message
              </h2>
              <p className="body-text">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    placeholder="Enter your first name"
                    className="bg-muted/20 border-border/20"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Enter your last name"
                    className="bg-muted/20 border-border/20"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Enter your email address"
                  className="bg-muted/20 border-border/20"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select>
                  <SelectTrigger className="bg-muted/20 border-border/20">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="sales">Sales Inquiry</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  placeholder="Tell us how we can help you..."
                  rows={6}
                  className="bg-muted/20 border-border/20"
                />
              </div>
              
              <Button 
                type="submit" 
                className="professional-button w-full"
              >
                Send Message
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Our Offices
            </h2>
            <p className="body-text">
              Visit us at one of our global locations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {offices.map((office, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">
                        {office.city}
                      </h3>
                      <p className="text-primary font-medium text-sm">
                        {office.type}
                      </p>
                    </div>
                    <div className="text-primary">
                      <Globe className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <div className="text-sm text-muted-foreground">
                        <div>{office.address}</div>
                        <div>{office.zip}</div>
                        <div>{office.country}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        Mon-Fri, 9AM-6PM Local Time
                      </span>
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

      {/* Support Stats */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="premium-card p-16 text-center animate-fade-in">
            <div className="text-primary mb-6">
              <Users className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Customer Support Excellence
            </h2>
            <p className="body-text mb-8">
              We're committed to providing the best support experience for our traders.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                <div className="text-sm text-muted-foreground">Support Available</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">&lt;2h</div>
                <div className="text-sm text-muted-foreground">Avg Response Time</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">98%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-sm text-muted-foreground">Support Team</div>
              </div>
            </div>
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
                onClick={() => window.location.href = '/demo'}
                className="accent-button px-8 py-4 text-lg"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;