import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Search,
  Calendar,
  User,
  ArrowRight,
  Tag,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Input, SimpleSelect } from '@/components/ui';
import api from '@/services/api';

const categories = [
  'All Categories',
  'Industry Insights',
  'Product Updates',
  'Supplier Tips',
  'Retailer Tips',
  'Company News',
];

const popularTags = [
  'Inventory Management',
  'Pricing Strategies',
  'Supplier Relations',
  'Technology',
  'Market Trends',
  'Quality Control',
];

const BlogPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  React.useEffect(() => {
    api.get('/blogs').then((res: any) => {
      setBlogPosts(res.data?.items || []);
    }).catch(console.error);
  }, []);

  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All Categories' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const otherPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <FileText className="h-4 w-4 mr-1" />
            Blog & Insights
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Knowledge Hub
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay informed with industry insights, tips, and updates from the Torida team.
          </p>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-8 bg-surface-elevated border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 max-w-3xl mx-auto">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <SimpleSelect
              value={selectedCategory}
              onChange={setSelectedCategory}
              options={categories.map((c) => ({ value: c, label: c }))}
              className="min-w-[180px]"
            />
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.id}`}>
                  <Card className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="h-48 relative overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <Badge className="absolute top-4 left-4">{post.category}</Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-text-muted text-sm mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-sm text-text-muted">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span>{post.date}</span>
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Posts Grid */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              <div className="space-y-6">
                {otherPosts.map((post) => (
                  <Link key={post.id} to={`/blog/${post.id}`}>
                    <Card className="overflow-hidden group hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
                          <img
                            src={post.image}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <CardContent className="p-4 flex-1">
                          <Badge variant="outline" className="mb-2">{post.category}</Badge>
                          <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                            {post.title}
                          </h3>
                          <p className="text-text-muted text-sm mb-2 line-clamp-2">{post.excerpt}</p>
                          <div className="flex items-center gap-4 text-xs text-text-muted">
                            <span>{post.author}</span>
                            <span>{post.date}</span>
                            <span>{post.readTime}</span>
                          </div>
                        </CardContent>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Popular Tags */}
              <Card className="p-6">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-4">Popular Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {popularTags.map((tag, idx) => (
                      <Badge key={idx} variant="outline" className="cursor-pointer hover:bg-primary-light hover:text-primary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Newsletter */}
              <Card className="p-6 bg-gradient-to-br from-primary to-primary-dark">
                <CardContent className="pt-4 text-white">
                  <h3 className="font-semibold mb-2">Subscribe to Newsletter</h3>
                  <p className="text-sm text-white/80 mb-4">
                    Get the latest articles and insights delivered to your inbox.
                  </p>
                  <Input
                    placeholder="Enter your email"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60 mb-3"
                  />
                  <Button className="w-full bg-white text-primary hover:bg-gray-100">
                    Subscribe
                  </Button>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="p-6">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-4">Categories</h3>
                  <ul className="space-y-2">
                    {categories.slice(1).map((cat, idx) => (
                      <li key={idx}>
                        <button
                          onClick={() => setSelectedCategory(cat)}
                          className="w-full text-left text-sm text-text-muted hover:text-primary transition-colors"
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Want to Contribute?</h2>
          <p className="text-text-muted mb-6">
            We welcome guest posts from industry experts and community members.
          </p>
          <Link to="/contact">
            <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
              Contact Editorial Team
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;
