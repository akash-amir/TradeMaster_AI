import React from 'react';
import { ArrowRight, Code, Zap, Shield, Database, Globe, Key, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const API = () => {
  const endpoints = [
    {
      method: "POST",
      path: "/api/v1/trades/analyze",
      description: "Analyze a trade with AI insights",
      category: "Trading"
    },
    {
      method: "GET",
      path: "/api/v1/trades/history",
      description: "Retrieve trading history and performance",
      category: "Trading"
    },
    {
      method: "POST",
      path: "/api/v1/charts/upload",
      description: "Upload chart screenshots for analysis",
      category: "Charts"
    },
    {
      method: "GET",
      path: "/api/v1/analytics/performance",
      description: "Get detailed performance analytics",
      category: "Analytics"
    },
    {
      method: "POST",
      path: "/api/v1/strategies/create",
      description: "Create custom trading strategies",
      category: "Strategies"
    },
    {
      method: "GET",
      path: "/api/v1/market/data",
      description: "Retrieve real-time market data",
      category: "Market Data"
    }
  ];

  const features = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Real-time Data",
      description: "Access live market data and trading analytics with sub-second latency."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Authentication",
      description: "Industry-standard OAuth 2.0 and API key authentication for maximum security."
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "High Performance",
      description: "Built on scalable infrastructure with 99.9% uptime and fast response times."
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global CDN",
      description: "Distributed globally for optimal performance regardless of your location."
    }
  ];

  const codeExamples = [
    {
      language: "JavaScript",
      title: "Analyze a Trade",
      code: `const response = await fetch('https://api.trademaster.ai/v1/trades/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'AAPL',
    entry_price: 150.25,
    exit_price: 155.80,
    quantity: 100,
    entry_time: '2024-01-15T10:30:00Z',
    exit_time: '2024-01-15T14:45:00Z'
  })
});

const analysis = await response.json();
console.log(analysis.insights);`
    },
    {
      language: "Python",
      title: "Get Performance Analytics",
      code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
}

response = requests.get(
    'https://api.trademaster.ai/v1/analytics/performance',
    headers=headers,
    params={
        'start_date': '2024-01-01',
        'end_date': '2024-01-31',
        'timeframe': 'daily'
    }
)

analytics = response.json()
print(f"Win Rate: {analytics['win_rate']}%")
print(f"Total P&L: ${analytics['total_pnl']}")`
    }
  ];

  return (
    <Layout>
      <PageHero 
        title="Powerful API for Developers" 
        subtitle="Integrate TradeMaster AI's advanced trading intelligence into your applications with our comprehensive REST API."
      />
      
      {/* API Features */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Built for Developers
            </h2>
            <p className="body-text max-w-2xl mx-auto">
              Access our AI-powered trading insights through a simple, powerful REST API.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card 
                key={index}
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="text-primary mb-4">{feature.icon}</div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              API Endpoints
            </h2>
            <p className="body-text">
              Explore our comprehensive API endpoints for all trading operations.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {endpoints.map((endpoint, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={endpoint.method === 'GET' ? 'default' : 'secondary'}
                        className="font-mono"
                      >
                          {endpoint.method}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {endpoint.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="font-mono text-sm bg-muted/20 p-3 rounded-md mb-3 text-foreground">
                    {endpoint.path}
                  </div>
                  <p className="text-muted-foreground text-sm">
                      {endpoint.description}
                    </p>
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
              Get started quickly with our code examples in multiple languages.
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

      {/* Documentation CTA */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-16 text-center animate-fade-in">
            <div className="text-primary mb-6">
              <BookOpen className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Complete Documentation
            </h2>
              <p className="body-text mb-8">
              Explore our comprehensive API documentation with detailed examples, authentication guides, and best practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.open('https://docs.trademaster.ai', '_blank')}
                className="professional-button px-8 py-4 text-lg"
              >
                View Documentation
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/demo'}
                className="accent-button px-8 py-4 text-lg"
              >
                Get API Key
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Limits */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              API Pricing & Limits
            </h2>
            <p className="body-text">
              Transparent pricing with generous limits for all plan tiers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="premium-card animate-fade-in border-border/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Starter
                </CardTitle>
                <CardDescription>Perfect for development and testing</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-foreground mb-4">$29<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>1,000 API calls/month</li>
                  <li>Basic rate limiting</li>
                  <li>Email support</li>
                  <li>Standard documentation</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="premium-card animate-fade-in border-border/20 ring-2 ring-primary/50">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Professional
                </CardTitle>
                <CardDescription>For production applications</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-foreground mb-4">$79<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>10,000 API calls/month</li>
                  <li>Advanced rate limiting</li>
                  <li>Priority support</li>
                  <li>Webhook support</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card className="premium-card animate-fade-in border-border/20">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl font-bold text-foreground">
                  Enterprise
                </CardTitle>
                <CardDescription>For high-volume applications</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <div className="text-3xl font-bold text-foreground mb-4">$199<span className="text-lg text-muted-foreground">/month</span></div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>Unlimited API calls</li>
                  <li>Custom rate limits</li>
                  <li>Dedicated support</li>
                  <li>SLA guarantees</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding text-center">
          <div className="premium-card p-16 animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Ready to Integrate?
            </h2>
            <p className="body-text mb-8">
              Start building with our API today and bring AI-powered trading intelligence to your applications.
            </p>
            <Button 
              onClick={() => window.location.href = '/demo'}
              className="professional-button px-8 py-4 text-lg"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default API;