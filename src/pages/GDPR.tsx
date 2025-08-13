import React from 'react';
import { Shield, Users, Eye, Download, Trash2, Edit, Lock, Calendar, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const GDPR = () => {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

  const userRights = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Right of Access",
      description: "You have the right to know what personal data we hold about you and how we use it.",
      action: "Request a copy of your data",
      timeframe: "30 days"
    },
    {
      icon: <Edit className="w-6 h-6" />,
      title: "Right of Rectification",
      description: "You can request correction of inaccurate or incomplete personal data.",
      action: "Update your information",
      timeframe: "30 days"
    },
    {
      icon: <Trash2 className="w-6 h-6" />,
      title: "Right of Erasure",
      description: "You can request deletion of your personal data in certain circumstances.",
      action: "Request data deletion",
      timeframe: "30 days"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Right of Portability",
      description: "You can request a copy of your data in a machine-readable format.",
      action: "Export your data",
      timeframe: "30 days"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Right to Object",
      description: "You can object to certain types of data processing.",
      action: "Object to processing",
      timeframe: "30 days"
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Right to Restriction",
      description: "You can request restriction of data processing in certain cases.",
      action: "Request restriction",
      timeframe: "30 days"
    }
  ];

  const dataProcessing = [
    {
      purpose: "Account Management",
      legalBasis: "Contract Performance",
      dataTypes: ["Name", "Email", "Account details"],
      retention: "Until account deletion"
    },
    {
      purpose: "Trading Analysis",
      legalBasis: "Legitimate Interest",
      dataTypes: ["Trading data", "Charts", "Performance metrics"],
      retention: "7 years (regulatory)"
    },
    {
      purpose: "Customer Support",
      legalBasis: "Legitimate Interest",
      dataTypes: ["Support tickets", "Communication history"],
      retention: "3 years"
    },
    {
      purpose: "Service Improvement",
      legalBasis: "Legitimate Interest",
      dataTypes: ["Usage analytics", "Feature interactions"],
      retention: "2 years"
    },
    {
      purpose: "Marketing Communications",
      legalBasis: "Consent",
      dataTypes: ["Email preferences", "Marketing interactions"],
      retention: "Until consent withdrawal"
    },
    {
      purpose: "Legal Compliance",
      legalBasis: "Legal Obligation",
      dataTypes: ["Transaction records", "Compliance data"],
      retention: "As required by law"
    }
  ];

  const dataTransfers = [
    {
      destination: "United States",
      purpose: "Primary service hosting and operations",
      safeguards: "Standard Contractual Clauses",
      adequacy: "Adequacy decision pending"
    },
    {
      destination: "European Union",
      purpose: "Regional data processing and support",
      safeguards: "EU Standard Contractual Clauses",
      adequacy: "Adequate"
    },
    {
      destination: "United Kingdom",
      purpose: "UK-specific services and compliance",
      safeguards: "UK Standard Contractual Clauses",
      adequacy: "Adequate"
    }
  ];

  return (
  <Layout>
    <PageHero 
      title="GDPR Compliance" 
        subtitle="How TradeMaster AI protects your data rights under the General Data Protection Regulation."
      />
      
      {/* GDPR Overview */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Shield className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                GDPR Compliance
              </h2>
              <p className="body-text">
                We are committed to protecting your data rights and ensuring full GDPR compliance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Users className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Your Rights</h3>
                <p className="text-sm text-muted-foreground">
                  Full control over your personal data
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Lock className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Data Protection</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard security measures
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Eye className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear information about data processing
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Your GDPR Rights
            </h2>
            <p className="body-text">
              Under GDPR, you have specific rights regarding your personal data.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {userRights.map((right, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{right.icon}</div>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {right.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {right.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Action:</span>
                      <span className="font-semibold text-foreground">{right.action}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-semibold text-foreground">{right.timeframe}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Processing */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              How We Process Your Data
            </h2>
            <p className="body-text">
              Transparent information about our data processing activities and legal bases.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {dataProcessing.map((processing, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-foreground">
                    {processing.purpose}
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {processing.legalBasis}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2">Data Types:</h4>
                      <div className="flex flex-wrap gap-2">
                        {processing.dataTypes.map((type, typeIndex) => (
                          <Badge key={typeIndex} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Retention Period:</span>
                      <span className="font-semibold text-foreground">{processing.retention}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Transfers */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              International Data Transfers
            </h2>
            <p className="body-text">
              Information about data transfers outside the European Economic Area (EEA).
            </p>
          </div>
          
          <div className="space-y-6">
            {dataTransfers.map((transfer, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {transfer.destination}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {transfer.purpose}
                      </p>
                    </div>
                    <Badge 
                      variant={transfer.adequacy === "Adequate" ? "default" : "outline"}
                      className={transfer.adequacy === "Adequate" ? "bg-green-500/20 text-green-400 border-green-500/30" : ""}
                    >
                      {transfer.adequacy}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Safeguards:</span>
                      <span className="font-semibold text-foreground">{transfer.safeguards}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Data Protection Measures */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Data Protection Measures
              </h2>
              <p className="body-text">
                We implement comprehensive security measures to protect your data.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Technical Measures</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    End-to-end encryption for data in transit and at rest
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Multi-factor authentication for account access
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Regular security audits and penetration testing
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Secure data centers with physical access controls
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Organizational Measures</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Data protection officer and privacy team
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Employee training on data protection
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Incident response and breach notification procedures
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    Regular privacy impact assessments
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Exercise Your Rights
              </h2>
              <p className="body-text">
                Contact our Data Protection Officer to exercise your GDPR rights.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Data Protection Officer</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: dpo@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  Address: 123 Market Street, Suite 100<br />
                  San Francisco, CA 94105
                </p>
                <p className="text-sm text-muted-foreground">
                  For EU-specific data protection inquiries
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Privacy Team</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: privacy@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  For general privacy questions and data requests
                </p>
                <p className="text-sm text-muted-foreground">
                  Response time: Within 30 days
                </p>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Last Updated: {lastUpdated}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Effective Date: {effectiveDate}
                </div>
              </div>
              <Button 
                onClick={() => window.location.href = '/contact'}
                className="professional-button"
              >
                Contact DPO
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default GDPR; 