import React from 'react';
import { ArrowRight, Calendar, Clock, User, Tag, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import PageHero from '@/components/PageHero';

const Blog = () => {
  const featuredPosts = [
    {
      id: 1,
      title: "The Future of AI-Powered Trading: What's Next in 2024",
      excerpt: "Explore the latest developments in artificial intelligence and how they're revolutionizing the trading landscape. From advanced pattern recognition to predictive analytics, discover what's shaping the future of trading.",
      author: "Dr. Sarah Chen",
      date: "January 15, 2024",
      readTime: "8 min read",
      category: "AI & Technology",
      image: "/placeholder.svg",
      featured: true
    },
    {
      id: 2,
      title: "Risk Management Strategies for Modern Traders",
      excerpt: "Learn essential risk management techniques that can protect your capital and improve your trading performance. From position sizing to portfolio diversification, master the art of risk control.",
      author: "Michael Rodriguez",
      date: "January 12, 2024",
      readTime: "6 min read",
      category: "Risk Management",
      image: "/placeholder.svg",
      featured: true
    }
  ];

  const recentPosts = [
    {
      id: 3,
      title: "Understanding Market Psychology: The Key to Trading Success",
      excerpt: "Dive deep into market psychology and learn how understanding crowd behavior can give you an edge in trading. Discover the psychological patterns that drive market movements.",
      author: "Emma Thompson",
      date: "January 10, 2024",
      readTime: "7 min read",
      category: "Psychology",
      image: "/placeholder.svg"
    },
    {
      id: 4,
      title: "Technical Analysis vs. Fundamental Analysis: Which Approach Wins?",
      excerpt: "Compare the two major approaches to market analysis and understand when to use each method. Learn how combining both can create a more robust trading strategy.",
      author: "David Kim",
      date: "January 8, 2024",
      readTime: "9 min read",
      category: "Analysis",
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Building a Profitable Trading Routine: A Step-by-Step Guide",
      excerpt: "Create a structured trading routine that maximizes your chances of success. From pre-market preparation to post-trade analysis, develop habits that lead to consistent profits.",
      author: "Dr. Sarah Chen",
      date: "January 5, 2024",
      readTime: "10 min read",
      category: "Strategy",
      image: "/placeholder.svg"
    },
    {
      id: 6,
      title: "The Impact of Machine Learning on Trading Performance",
      excerpt: "Discover how machine learning algorithms are transforming trading performance and what this means for individual traders. Learn about the latest ML techniques being used in the markets.",
      author: "Michael Rodriguez",
      date: "January 3, 2024",
      readTime: "8 min read",
      category: "AI & Technology",
      image: "/placeholder.svg"
    },
    {
      id: 7,
      title: "Cryptocurrency Trading: Opportunities and Risks in 2024",
      excerpt: "Navigate the volatile world of cryptocurrency trading with insights into the latest trends, opportunities, and risk management strategies for digital assets.",
      author: "Emma Thompson",
      date: "December 30, 2023",
      readTime: "11 min read",
      category: "Cryptocurrency",
      image: "/placeholder.svg"
    },
    {
      id: 8,
      title: "Options Trading Strategies for Beginners",
      excerpt: "Master the basics of options trading with this comprehensive guide. Learn about calls, puts, and basic strategies that can enhance your trading portfolio.",
      author: "David Kim",
      date: "December 28, 2023",
      readTime: "12 min read",
      category: "Options",
      image: "/placeholder.svg"
    }
  ];

  const categories = [
    { name: "All", count: 8 },
    { name: "AI & Technology", count: 2 },
    { name: "Strategy", count: 1 },
    { name: "Risk Management", count: 1 },
    { name: "Psychology", count: 1 },
    { name: "Analysis", count: 1 },
    { name: "Cryptocurrency", count: 1 },
    { name: "Options", count: 1 }
  ];

  return (
    <Layout>
      <PageHero 
        title="Trading Insights & Analysis" 
        subtitle="Stay ahead of the markets with expert analysis, trading strategies, and insights from our team of professionals."
      />
      
      {/* Featured Posts */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Featured Articles
            </h2>
            <p className="body-text">
              In-depth analysis and insights from our expert team.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {featuredPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Tag className="w-8 h-8 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Featured Article</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.category}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground mb-3 line-clamp-2">
                      {post.title}
                    </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3">
                      {post.excerpt}
                    </CardDescription>
                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {post.author}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {post.date}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      className="accent-button w-full"
                      onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                    >
                      Read Article
                      <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="premium-card p-8 animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input 
                  placeholder="Search articles..." 
                  className="pl-10 bg-muted/20 border-border/20"
                />
                  </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Filter by:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.slice(0, 4).map((category, index) => (
                  <Badge 
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    className="cursor-pointer hover:bg-primary/20"
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Latest Articles
            </h2>
            <p className="body-text">
              Stay updated with the latest insights and strategies.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.map((post, index) => (
              <Card 
                key={post.id} 
                className="premium-card premium-hover animate-scale-in border-border/20"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-t-lg flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Tag className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground">Article</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <Badge variant="outline" className="text-xs mb-3">
                      {post.category}
                    </Badge>
                    <CardTitle className="text-lg font-semibold text-foreground mb-3 line-clamp-2">
                    {post.title}
                  </CardTitle>
                    <CardDescription className="text-muted-foreground mb-4 line-clamp-3 text-sm">
                      {post.excerpt}
                  </CardDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {post.author}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="accent-button w-full"
                      onClick={() => window.open(`/blog/${post.id}`, '_blank')}
                    >
                      Read More
                      <ArrowRight className="ml-2 w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="section-spacing">
        <div className="max-w-4xl mx-auto container-padding">
          <div className="premium-card p-16 text-center animate-fade-in">
            <h2 className="text-4xl font-bold mb-6">
              Stay Updated
            </h2>
            <p className="body-text mb-8">
              Get the latest trading insights and strategies delivered to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                placeholder="Enter your email"
                className="bg-muted/20 border-border/20"
              />
              <Button className="professional-button">
                Subscribe
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-spacing">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">
              Browse by Category
            </h2>
            <p className="body-text">
              Find content that matches your interests and trading style.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <Card 
                key={index} 
                className="premium-card premium-hover animate-fade-in border-border/20 cursor-pointer"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => window.open(`/blog/category/${category.name.toLowerCase()}`, '_blank')}
              >
                <CardContent className="p-6 text-center">
                  <CardTitle className="text-lg font-semibold text-foreground mb-2">
                    {category.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {category.count} articles
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Blog;