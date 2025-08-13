import React from 'react';
import { Shield, Eye, Lock, Users, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const PrivacyPolicy = () => {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal Information: We collect information you provide directly to us, such as when you create an account, including your name, email address, and trading preferences.",
        "Trading Data: We collect information about your trading activities, including trade entries, exits, charts, and performance metrics.",
        "Usage Information: We automatically collect information about how you use our services, including access times, pages viewed, and features used.",
        "Device Information: We collect information about the devices you use to access our services, including IP addresses, browser types, and operating systems."
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "Provide and improve our AI-powered trading analysis services",
        "Personalize your experience and deliver relevant insights",
        "Process transactions and manage your account",
        "Send you important updates about our services",
        "Analyze usage patterns to improve our platform",
        "Comply with legal obligations and protect our rights"
      ]
    },
    {
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information to third parties.",
        "We may share your information with service providers who help us operate our platform.",
        "We may disclose information if required by law or to protect our rights and safety.",
        "We may share aggregated, anonymized data for research and analytics purposes."
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement industry-standard security measures to protect your information.",
        "All data is encrypted in transit and at rest using bank-level encryption.",
        "We regularly monitor our systems for security vulnerabilities.",
        "We limit access to your personal information to authorized personnel only."
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access: You can request access to the personal information we hold about you.",
        "Correction: You can request corrections to inaccurate or incomplete information.",
        "Deletion: You can request deletion of your personal information, subject to legal requirements.",
        "Portability: You can request a copy of your data in a machine-readable format.",
        "Objection: You can object to certain processing of your personal information."
      ]
    },
    {
      title: "Data Retention",
      content: [
        "We retain your personal information for as long as necessary to provide our services.",
        "Trading data is retained for analysis and regulatory compliance purposes.",
        "Account information is retained until you request deletion or close your account.",
        "We may retain certain information for legal, regulatory, or business purposes."
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "We use cookies and similar technologies to enhance your experience.",
        "Essential cookies are required for basic platform functionality.",
        "Analytics cookies help us understand how you use our services.",
        "You can control cookie preferences through your browser settings."
      ]
    },
    {
      title: "International Transfers",
      content: [
        "Your information may be transferred to and processed in countries other than your own.",
        "We ensure appropriate safeguards are in place for international data transfers.",
        "We comply with applicable data protection laws and regulations.",
        "For EU users, we ensure GDPR compliance for all data processing activities."
      ]
    }
  ];

  return (
  <Layout>
    <PageHero 
      title="Privacy Policy" 
      subtitle="How we collect, use, and protect your personal information."
    />
    
      {/* Policy Overview */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Shield className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Your Privacy Matters
              </h2>
              <p className="body-text">
                We are committed to protecting your privacy and being transparent about how we handle your data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Eye className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear information about data collection and use
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Lock className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Security</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption and security measures
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Users className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Control</h3>
                <p className="text-sm text-muted-foreground">
                  You control your data and privacy settings
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Policy Details */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Privacy Policy Details
            </h2>
            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Last Updated: {lastUpdated}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Effective Date: {effectiveDate}
              </div>
            </div>
          </div>
          
          <div className="space-y-8">
            {sections.map((section, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {section.content.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-muted-foreground leading-relaxed">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Information */}
    <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Contact Us
              </h2>
              <p className="body-text">
                Have questions about our privacy practices? We're here to help.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Privacy Officer</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: privacy@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Address: 123 Market Street, Suite 100<br />
                  San Francisco, CA 94105
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Data Protection</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For EU residents: dpo@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  For California residents: privacy@trademaster.ai
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="professional-button"
              >
                Contact Support
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Updates and Changes */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Policy Updates
              </h2>
              <p className="body-text">
                We may update this privacy policy from time to time to reflect changes in our practices or applicable laws.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-muted-foreground">
                  We will notify you of any material changes to this policy by email or through our platform.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-muted-foreground">
                  The effective date at the top of this policy indicates when it was last updated.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                <p className="text-muted-foreground">
                  Your continued use of our services after changes become effective constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default PrivacyPolicy; 