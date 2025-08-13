import React from 'react';
import { ArrowRight, BookOpen, Code, Zap, Database, Globe, Terminal, Download, ExternalLink, Search, FileText, Settings, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Documentation = () => {
  const sections = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "Getting Started",
      description: "Quick start guides and tutorials",
      articles: [
        "Introduction to TradeMaster AI",
        "Setting Up Your First Project",
        "Authentication & API Keys",
        "Basic API Usage"
      ]
    },
    {
      icon: <Code className="w-8 h-8" />,
      title: "API Reference",
      description: "Complete API documentation",
      articles: [
        "REST API Overview",
        "Authentication",
        "Endpoints Reference",
        "Rate Limits & Quotas"
      ]
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "SDKs & Libraries",
      description: "Official SDKs and client libraries",
      articles: [
        "JavaScript/TypeScript SDK",
        "Python SDK",
        "Node.js SDK",
        "Mobile SDKs"
      ]
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Data Models",
      description: "Understanding data structures",
      articles: [
        "Trade Data Models",
        "Analytics Models",
        "Webhook Payloads",
        "Error Responses"
      ]
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Integrations",
      description: "Third-party platform integrations",
      articles: [
        "TradingView Integration",
        "MetaTrader Integration",
        "Webhook Setup",
        "Custom Integrations"
      ]
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Security",
      description: "Security best practices",
      articles: [
        "API Security",
        "Data Encryption",
        "Access Control",
        "Compliance"
      ]
    }
  ];

  const quickStart = [
    {
      step: "01",
      title: "Get Your API Key",
      description: "Sign up for an account and generate your API key from the dashboard.",
      code: "curl -X POST https://api.trademaster.ai/v1/auth/key"
    },
    {
      step: "02",
      title: "Make Your First Request",
      description: "Test the API with a simple request to analyze a trade.",
      code: `curl -X POST https://api.trademaster.ai/v1/trades/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"symbol": "AAPL", "entry_price": 150.25}'`
    },
    {
      step: "03",
      title: "Explore the SDKs",
      description: "Use our official SDKs for easier integration with your preferred language.",
      code: "npm install @trademaster/ai-sdk"
    }
  ];

  const codeExamples = [
    {
      language: "JavaScript",
      title: "Analyze Trade with JavaScript",
      code: `import { TradeMasterAPI } from '@trademaster/ai-sdk';

const client = new TradeMasterAPI('your-api-key');

const analysis = await client.trades.analyze({
  symbol: 'AAPL',
  entry_price: 150.25,
  exit_price: 155.80,
  quantity: 100,
  entry_time: '2024-01-15T10:30:00Z',
  exit_time: '2024-01-15T14:45:00Z'
});

console.log('Analysis:', analysis.insights);`
    },
    {
      language: "Python",
      title: "Get Performance Analytics",
      code: `import trademaster

client = trademaster.Client(api_key='your-api-key')

analytics = client.analytics.get_performance(
    start_date='2024-01-01',
    end_date='2024-01-31',
    timeframe='daily'
)

print(f"Win Rate: {analytics.win_rate}%")
print(f"Total P&L: ${analytics.total_pnl}")`
    }
  ];

  const resources = [
    {
      icon: <Download className="w-6 h-6" />,
      title: "SDK Downloads",
      description: "Download our official SDKs and libraries",
      link: "https://github.com/trademaster-ai/sdks"
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: "API Playground",
      description: "Test API endpoints in your browser",
      link: "https://playground.trademaster.ai"
    },
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Postman Collection",
      description: "Import our Postman collection for testing",
      link: "https://trademaster.ai/postman"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Status Page",
      description: "Check API status and uptime",
      link: "https://status.trademaster.ai"
    }
  ];

  return (
  <Layout>
    <PageHero 
        title="Developer Documentation" 
        subtitle="Everything you need to integrate TradeMaster AI into your applications and build powerful trading tools."
      />
      
      {/* Search Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                Find What You Need
              </h2>
              <p className="body-text">
                Search our comprehensive documentation or browse by category.
              </p>
            </div>
            
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Search documentation, APIs, or code examples..."
                className="pl-12 pr-4 py-4 text-lg bg-muted/20 border-border/20"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Quick Start Guide
            </h2>
            <p className="body-text">
              Get up and running with TradeMaster AI in minutes.
            </p>
          </div>
          
          <div className="space-y-8">
            {quickStart.map((step, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-3">
                        {step.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <pre className="bg-muted/20 p-4 rounded-md overflow-x-auto text-sm text-foreground">
                        <code>{step.code}</code>
                      </pre>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Documentation Sections
            </h2>
            <p className="body-text">
              Explore our comprehensive documentation organized by topic.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sections.map((section, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{section.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed mb-4">
                    {section.description}
                  </CardDescription>
                  <ul className="space-y-2">
                    {section.articles.map((article, articleIndex) => (
                      <li key={articleIndex} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                        {article}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Code Examples
            </h2>
            <p className="body-text">
              Get started quickly with these code examples in multiple languages.
            </p>
          </div>
          
          <div className="space-y-8">
            {codeExamples.map((example, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Code className="w-6 h-6 text-primary" />
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {example.title}
                    </CardTitle>
                    <Badge variant="outline" className="ml-auto">
                      {example.language}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted/20 p-4 rounded-md overflow-x-auto text-sm text-foreground">
                    <code>{example.code}</code>
                  </pre>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Resources */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Developer Resources
            </h2>
            <p className="body-text">
              Additional tools and resources to help you build with TradeMaster AI.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resources.map((resource, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-scale-in border-border/20 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(resource.link, '_blank')}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {resource.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {resource.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground text-sm mb-4">
                    {resource.description}
                  </CardDescription>
                  <ExternalLink className="w-4 h-4 text-muted-foreground mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Status */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">
                API Status
              </h2>
              <p className="body-text">
                Check the current status of our API services.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-foreground">API</div>
                <div className="text-sm text-muted-foreground">Operational</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-foreground">Webhooks</div>
                <div className="text-sm text-muted-foreground">Operational</div>
              </div>
              <div className="text-center">
                <div className="w-4 h-4 bg-green-500 rounded-full mx-auto mb-2"></div>
                <div className="font-semibold text-foreground">Dashboard</div>
                <div className="text-sm text-muted-foreground">Operational</div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <Button 
                variant="outline"
                onClick={() => window.open('https://status.trademaster.ai', '_blank')}
                className="accent-button"
              >
                View Detailed Status
                <ExternalLink className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <div className="text-primary mb-6">
              <Code className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Ready to Build?
            </h2>
            <p className="body-text mb-8">
              Start integrating TradeMaster AI into your applications today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/demo'}
                className="professional-button px-8 py-4 text-lg"
              >
                Get API Key
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.open('https://github.com/trademaster-ai', '_blank')}
                className="accent-button px-8 py-4 text-lg"
              >
                View on GitHub
                <ExternalLink className="ml-2 w-5 h-5" />
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default Documentation; 