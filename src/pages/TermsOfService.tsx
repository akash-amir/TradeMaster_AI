import React from 'react';
import { FileText, Scale, Shield, Users, Calendar, ArrowRight, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const TermsOfService = () => {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

  const sections = [
    {
      title: "Acceptance of Terms",
      content: [
        "By accessing or using TradeMaster AI, you agree to be bound by these Terms of Service.",
        "If you do not agree to these terms, you must not use our services.",
        "We may modify these terms at any time, and your continued use constitutes acceptance of the updated terms.",
        "These terms apply to all users of our platform, including individual traders and institutional clients."
      ]
    },
    {
      title: "Description of Services",
      content: [
        "TradeMaster AI provides AI-powered trading analysis and strategy tracking tools.",
        "Our services include trade entry tracking, chart analysis, performance insights, and AI feedback.",
        "We offer both free and premium subscription plans with varying features and limitations.",
        "Services are provided 'as is' and may be subject to availability and technical limitations."
      ]
    },
    {
      title: "User Accounts and Registration",
      content: [
        "You must create an account to access our services, providing accurate and complete information.",
        "You are responsible for maintaining the security of your account credentials.",
        "You must be at least 18 years old to use our services.",
        "You may not share your account with others or use another person's account.",
        "We reserve the right to suspend or terminate accounts that violate these terms."
      ]
    },
    {
      title: "Acceptable Use",
      content: [
        "You may use our services only for lawful purposes and in accordance with these terms.",
        "You must not use our services to engage in illegal trading activities or market manipulation.",
        "You may not attempt to reverse engineer, hack, or interfere with our platform.",
        "You must not upload malicious content or attempt to compromise system security.",
        "You are responsible for all trading decisions and their outcomes."
      ]
    },
    {
      title: "Financial Disclaimer",
      content: [
        "TradeMaster AI provides analysis tools and insights, not financial advice.",
        "All trading decisions are your responsibility, and we are not liable for trading losses.",
        "Past performance does not guarantee future results.",
        "You should consult with qualified financial advisors before making investment decisions.",
        "We do not guarantee the accuracy or completeness of our analysis or insights."
      ]
    },
    {
      title: "Subscription and Payment",
      content: [
        "Premium features require a paid subscription with recurring billing.",
        "Subscription fees are charged in advance and are non-refundable except as required by law.",
        "You may cancel your subscription at any time through your account settings.",
        "We reserve the right to change pricing with 30 days' notice to existing subscribers.",
        "Failed payments may result in service suspension or account termination."
      ]
    },
    {
      title: "Intellectual Property",
      content: [
        "All content, features, and functionality of TradeMaster AI are owned by us or our licensors.",
        "You retain ownership of your trading data and content you upload.",
        "You grant us a license to use your data to provide and improve our services.",
        "You may not copy, modify, or distribute our proprietary content without permission.",
        "Our AI models and algorithms are protected by intellectual property laws."
      ]
    },
    {
      title: "Privacy and Data",
      content: [
        "Your privacy is important to us. Please review our Privacy Policy for details.",
        "We collect and process your data in accordance with applicable privacy laws.",
        "You control your data and can request access, correction, or deletion.",
        "We implement security measures to protect your information.",
        "Data may be stored and processed in countries other than your residence."
      ]
    },
    {
      title: "Limitation of Liability",
      content: [
        "To the maximum extent permitted by law, we are not liable for indirect, incidental, or consequential damages.",
        "Our total liability is limited to the amount you paid for our services in the 12 months preceding the claim.",
        "We are not liable for trading losses, missed opportunities, or financial damages.",
        "Some jurisdictions do not allow liability limitations, so these may not apply to you.",
        "We disclaim all warranties except those required by applicable law."
      ]
    },
    {
      title: "Termination",
      content: [
        "You may terminate your account at any time by contacting us or using account settings.",
        "We may terminate or suspend your account for violations of these terms.",
        "Upon termination, your access to services will cease immediately.",
        "We may retain certain data as required by law or for legitimate business purposes.",
        "Provisions that survive termination include intellectual property, liability limitations, and dispute resolution."
      ]
    },
    {
      title: "Governing Law and Disputes",
      content: [
        "These terms are governed by the laws of the State of California, United States.",
        "Disputes will be resolved through binding arbitration in San Francisco, California.",
        "You waive your right to a jury trial or class action lawsuit.",
        "Small claims court cases are exempt from mandatory arbitration.",
        "If any provision is found unenforceable, the remaining provisions remain in effect."
      ]
    }
  ];

  return (
  <Layout>
    <PageHero 
      title="Terms of Service" 
      subtitle="The terms and conditions governing your use of TradeMaster AI."
    />
    
      {/* Terms Overview */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Terms of Service
              </h2>
              <p className="body-text">
                Please read these terms carefully before using TradeMaster AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Scale className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Legal Agreement</h3>
                <p className="text-sm text-muted-foreground">
                  Binding terms for using our platform
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Shield className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Clear understanding of your obligations
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Users className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Our Obligations</h3>
                <p className="text-sm text-muted-foreground">
                  What we promise to deliver
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimers */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="premium-card animate-fade-in border-border/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-yellow-500" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Financial Disclaimer
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  TradeMaster AI provides analysis tools and insights, not financial advice. All trading decisions are your responsibility, and we are not liable for trading losses.
                </p>
              </CardContent>
            </Card>
            
            <Card className="premium-card animate-fade-in border-border/20">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500" />
                  <CardTitle className="text-lg font-semibold text-foreground">
                    Data Protection
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  We implement industry-standard security measures to protect your data. Your privacy is protected by our comprehensive Privacy Policy.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Terms Details */}
    <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Terms of Service Details
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
                Questions About These Terms?
              </h2>
              <p className="body-text">
                If you have any questions about these Terms of Service, please contact us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Legal Department</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: legal@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Address: 123 Market Street, Suite 100<br />
                  San Francisco, CA 94105
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Customer Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  For general questions: support@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  For billing issues: billing@trademaster.ai
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
  </Layout>
);
};

export default TermsOfService; 