import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Clock, Activity, Server, Database, Globe, Zap, Shield, RefreshCw, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Status = () => {
  const services = [
    {
      name: "API Services",
      status: "operational",
      description: "REST API and WebSocket connections",
      uptime: "99.98%",
      responseTime: "45ms",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Trading Platform",
      status: "operational",
      description: "Main trading dashboard and features",
      uptime: "99.95%",
      responseTime: "120ms",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "AI Analysis Engine",
      status: "operational",
      description: "Machine learning models and analysis",
      uptime: "99.92%",
      responseTime: "2.1s",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Database",
      status: "operational",
      description: "Data storage and retrieval systems",
      uptime: "99.99%",
      responseTime: "15ms",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "Authentication",
      status: "operational",
      description: "User authentication and security",
      uptime: "99.97%",
      responseTime: "85ms",
      lastIncident: "None in the last 30 days"
    },
    {
      name: "CDN & Edge",
      status: "operational",
      description: "Content delivery and global performance",
      uptime: "99.96%",
      responseTime: "25ms",
      lastIncident: "None in the last 30 days"
    }
  ];

  const metrics = [
    {
      name: "Overall Uptime",
      value: "99.96%",
      trend: "up",
      period: "Last 30 days"
    },
    {
      name: "Average Response Time",
      value: "245ms",
      trend: "down",
      period: "Last 24 hours"
    },
    {
      name: "Active Users",
      value: "12,847",
      trend: "up",
      period: "Current"
    },
    {
      name: "API Requests",
      value: "2.4M",
      trend: "up",
      period: "Last 24 hours"
    }
  ];

  const recentIncidents = [
    {
      date: "January 15, 2024",
      title: "Scheduled Maintenance",
      status: "resolved",
      description: "Routine database maintenance completed successfully. No user impact.",
      duration: "15 minutes"
    },
    {
      date: "January 8, 2024",
      title: "Performance Optimization",
      status: "resolved",
      description: "AI analysis engine performance improvements deployed.",
      duration: "5 minutes"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'degraded':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      case 'outage':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Operational</Badge>;
      case 'degraded':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Degraded</Badge>;
      case 'outage':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/30">Outage</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
  <Layout>
    <PageHero 
      title="System Status" 
        subtitle="Real-time status of TradeMaster AI services and infrastructure."
      />
      
      {/* Overall Status */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-4">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <h2 className="text-3xl font-bold text-foreground">
                  All Systems Operational
                </h2>
              </div>
              <p className="body-text">
                All TradeMaster AI services are running normally.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div 
                  key={index}
                  className="text-center animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-2xl font-bold text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {metric.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {metric.period}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Service Status */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Service Status
            </h2>
            <p className="body-text">
              Detailed status of all TradeMaster AI services and components.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(service.status)}
                      <CardTitle className="text-lg font-semibold text-foreground">
                        {service.name}
                      </CardTitle>
                    </div>
                    {getStatusBadge(service.status)}
                  </div>
                  <CardDescription className="text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Uptime:</span>
                      <span className="font-semibold text-foreground">{service.uptime}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Response Time:</span>
                      <span className="font-semibold text-foreground">{service.responseTime}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Last incident: {service.lastIncident}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Recent Incidents
            </h2>
            <p className="body-text">
              Historical incidents and maintenance events.
            </p>
          </div>
          
          <div className="space-y-6">
            {recentIncidents.map((incident, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {incident.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {incident.date}
                      </p>
                    </div>
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      {incident.status}
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {incident.description}
                  </p>
                  <div className="text-sm text-muted-foreground">
                    Duration: {incident.duration}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
    <section className="section-spacing">
      <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Performance Metrics
            </h2>
            <p className="body-text">
              Real-time performance data and system health indicators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Activity className="w-8 h-8" />,
                title: "CPU Usage",
                value: "23%",
                status: "normal"
              },
              {
                icon: <Database className="w-8 h-8" />,
                title: "Memory Usage",
                value: "67%",
                status: "normal"
              },
              {
                icon: <Server className="w-8 h-8" />,
                title: "Disk Space",
                value: "45%",
                status: "normal"
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Network",
                value: "1.2 Gbps",
                status: "normal"
              }
            ].map((metric, index) => (
              <Card 
                key={index} 
                className="premium-card animate-fade-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-primary mb-4 flex justify-center">
                    {metric.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {metric.title}
                  </CardTitle>
                  <div className="text-2xl font-bold text-foreground mb-2">
                    {metric.value}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {metric.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe to Updates */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="text-center mb-8">
              <div className="text-primary mb-4">
                <Shield className="w-12 h-12 mx-auto" />
              </div>
              <h2 className="text-3xl font-bold mb-4">
                Stay Updated
              </h2>
              <p className="body-text">
                Get notified about service updates, incidents, and maintenance.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">Email Notifications</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Receive status updates via email
                </p>
                <Button variant="outline" className="accent-button w-full">
                  Subscribe
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">RSS Feed</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Subscribe to our RSS feed
                </p>
                <Button variant="outline" className="accent-button w-full">
                  RSS Feed
                </Button>
              </div>
              <div className="text-center">
                <h3 className="font-semibold text-foreground mb-2">API Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Programmatic access to status
                </p>
                <Button variant="outline" className="accent-button w-full">
                  API Endpoint
                </Button>
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
              <Zap className="w-16 h-16 mx-auto" />
            </div>
            <h2 className="text-4xl font-bold mb-6">
              Everything Running Smoothly
            </h2>
            <p className="body-text mb-8">
              Our systems are operating at peak performance. Start trading with confidence.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={() => window.location.href = '/demo'}
                className="professional-button px-8 py-4 text-lg"
              >
                Start Trading
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/contact'}
                className="accent-button px-8 py-4 text-lg"
              >
                Contact Support
              </Button>
            </div>
        </div>
      </div>
    </section>
  </Layout>
);
};

export default Status; 