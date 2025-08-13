import React from 'react';
import { Cookie, Settings, Shield, Eye, Calendar, ArrowRight, Info, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const CookiePolicy = () => {
  const lastUpdated = "January 15, 2024";
  const effectiveDate = "January 15, 2024";

  const cookieTypes = [
    {
      name: "Essential Cookies",
      description: "Required for basic website functionality",
      purpose: "These cookies are necessary for the website to function properly and cannot be disabled.",
      examples: ["Authentication", "Security", "Session management"],
      duration: "Session to 1 year",
      canDisable: false
    },
    {
      name: "Analytics Cookies",
      description: "Help us understand how visitors use our site",
      purpose: "These cookies collect information about how you use our website to help us improve our services.",
      examples: ["Page views", "User behavior", "Performance metrics"],
      duration: "2 years",
      canDisable: true
    },
    {
      name: "Functional Cookies",
      description: "Remember your preferences and settings",
      purpose: "These cookies enable enhanced functionality and personalization.",
      examples: ["Language preferences", "Theme settings", "Form data"],
      duration: "1 year",
      canDisable: true
    },
    {
      name: "Marketing Cookies",
      description: "Used for advertising and marketing purposes",
      purpose: "These cookies are used to deliver relevant advertisements and track marketing campaign performance.",
      examples: ["Ad targeting", "Campaign tracking", "Social media integration"],
      duration: "2 years",
      canDisable: true
    }
  ];

  const thirdPartyCookies = [
    {
      provider: "Google Analytics",
      purpose: "Website analytics and performance monitoring",
      dataCollected: ["Page views", "User behavior", "Traffic sources"],
      privacyPolicy: "https://policies.google.com/privacy"
    },
    {
      provider: "Stripe",
      purpose: "Payment processing and security",
      dataCollected: ["Payment information", "Transaction data"],
      privacyPolicy: "https://stripe.com/privacy"
    },
    {
      provider: "Intercom",
      purpose: "Customer support and communication",
      dataCollected: ["Chat interactions", "Support requests"],
      privacyPolicy: "https://www.intercom.com/legal/privacy"
    }
  ];

  return (
  <Layout>
    <PageHero 
      title="Cookie Policy" 
        subtitle="How we use cookies and similar technologies on TradeMaster AI."
      />
      
      {/* Cookie Overview */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Cookie className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Cookie Policy
              </h2>
              <p className="body-text">
                We use cookies and similar technologies to enhance your experience on TradeMaster AI.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Settings className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Control</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your cookie preferences
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Shield className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Transparency</h3>
                <p className="text-sm text-muted-foreground">
                  Clear information about cookie use
                </p>
              </div>
              <div className="text-center">
                <div className="text-primary mb-2">
                  <Eye className="w-6 h-6 mx-auto" />
                </div>
                <h3 className="font-semibold text-foreground mb-1">Privacy</h3>
                <p className="text-sm text-muted-foreground">
                  Your privacy is our priority
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Are Cookies */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                What Are Cookies?
              </h2>
              <p className="body-text">
                Cookies are small text files that are stored on your device when you visit our website.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">How They Work</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Stored on your device when you visit our site
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Help us remember your preferences and settings
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Improve website performance and user experience
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Provide analytics and insights about site usage
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Types of Cookies</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Session cookies (temporary, deleted when you close browser)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Persistent cookies (remain until manually deleted)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    First-party cookies (set by our website)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Third-party cookies (set by external services)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Types of Cookies We Use
            </h2>
            <p className="body-text">
              Detailed information about the cookies we use and their purposes.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {cookieTypes.map((cookie, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {cookie.name}
                    </CardTitle>
                    <Badge variant={cookie.canDisable ? "outline" : "secondary"}>
                      {cookie.canDisable ? "Optional" : "Required"}
                    </Badge>
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {cookie.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2">Purpose:</h4>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {cookie.purpose}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground text-sm mb-2">Examples:</h4>
                      <ul className="space-y-1">
                        {cookie.examples.map((example, exampleIndex) => (
                          <li key={exampleIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="w-1 h-1 bg-primary rounded-full"></span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-semibold text-foreground">{cookie.duration}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Third-Party Cookies */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Third-Party Cookies
            </h2>
            <p className="body-text">
              We work with trusted third-party services that may set cookies on our website.
            </p>
          </div>
          
          <div className="space-y-6">
            {thirdPartyCookies.map((service, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {service.provider}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.purpose}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => window.open(service.privacyPolicy, '_blank')}
                      className="accent-button"
                    >
                      Privacy Policy
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm mb-2">Data Collected:</h4>
                    <ul className="space-y-1">
                      {service.dataCollected.map((data, dataIndex) => (
                        <li key={dataIndex} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="w-1 h-1 bg-primary rounded-full"></span>
                          {data}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cookie Management */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Settings className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Managing Your Cookie Preferences
              </h2>
              <p className="body-text">
                You have control over which cookies are stored on your device.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Browser Settings</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Most browsers allow you to block or delete cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    You can set preferences for different types of cookies
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Check your browser's help section for specific instructions
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Cookie Consent</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    We show a cookie banner when you first visit
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    You can change your preferences at any time
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                    Essential cookies cannot be disabled for site functionality
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <Button 
                variant="outline"
                className="accent-button"
              >
                Manage Cookie Preferences
                <Settings className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Updates and Contact */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Questions About Cookies?
              </h2>
              <p className="body-text">
                If you have questions about our cookie policy, please contact us.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-foreground mb-3">Privacy Team</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: privacy@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground">
                  For questions about data collection and privacy
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-3">Technical Support</h3>
                <p className="text-sm text-muted-foreground mb-2">
                  Email: support@trademaster.ai
                </p>
                <p className="text-sm text-muted-foreground">
                  For technical issues with cookie management
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

export default CookiePolicy; 