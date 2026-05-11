import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Truck,
  Shield,
  Clock,
  TrendingUp,
  Star,
  CheckCircle,
  Play,
  ChevronRight,
  Sparkles,
  Zap,
  Loader2,
} from 'lucide-react';
import { Button, Card, Badge, AnimatedSection, StaggerContainer, Counter, ProductCard, CategoryCard } from '@/components/ui';
import { categoryService, productService } from '@/services';
import type { Category, Product } from '@/types';
import backgroundVideo from '@/assets/images/Back.mp4';

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your orders delivered within 24-48 hours across Egypt with real-time tracking.',
    color: 'bg-blue-500',
  },
  {
    icon: Shield,
    title: 'Quality Guaranteed',
    description: 'All products verified for quality and authenticity with buyer protection.',
    color: 'bg-green-500',
  },
  {
    icon: Clock,
    title: 'Save Time',
    description: 'Order from multiple suppliers in one place with streamlined checkout.',
    color: 'bg-purple-500',
  },
  {
    icon: TrendingUp,
    title: 'Best Prices',
    description: 'Competitive wholesale prices from verified suppliers with bulk discounts.',
    color: 'bg-orange-500',
  },
];

const stats = [
  { value: 5000, suffix: '+', label: 'Active Suppliers' },
  { value: 15000, suffix: '+', label: 'Products Listed' },
  { value: 50000, suffix: '+', label: 'Orders Delivered' },
  { value: 98, suffix: '%', label: 'Customer Satisfaction' },
];

const testimonials = [
  {
    name: 'Ahmed Hassan',
    role: 'Supermarket Owner',
    content: 'Torida transformed my procurement process. I save hours every week and get better prices.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    rating: 5,
  },
  {
    name: 'Sarah Mohamed',
    role: 'Restaurant Chain Manager',
    content: 'The quality verification gives us peace of mind. Best B2B platform in Egypt.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    rating: 5,
  },
  {
    name: 'Karim El-Sayed',
    role: 'Food Distributor',
    content: 'As a supplier, Torida helped me reach thousands of new customers easily.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    rating: 5,
  },
];

// Placeholder images for categories
const getCategoryImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=300',
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=300',
    'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=300',
    'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=300',
    'https://images.unsplash.com/photo-1621939514649-280e2ee25f60?w=300',
  ];
  return images[index % images.length];
};

// Placeholder images for products
const getProductImage = (index: number): string => {
  const images = [
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400',
    'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400',
    'https://images.unsplash.com/photo-1546173159-315724a31696?w=400',
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
  ];
  return images[index % images.length];
};

const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [categoriesData, productsData] = await Promise.all([
          categoryService.getCategories(true).catch((err) => {
            console.error('Failed to load categories:', err);
            return [];
          }),
          productService.getProducts({ per_page: 4, is_active: 'true' }).catch((err) => {
            console.error('Failed to load products:', err);
            return { items: [], pagination: null };
          }),
        ]);

        // Defensive: ensure categoriesData is always an array
        const safeCategories = Array.isArray(categoriesData) ? categoriesData : [];
        setCategories(safeCategories.slice(0, 6));

        // Defensive: ensure productsData.items is always an array
        const safeItems = Array.isArray(productsData?.items) ? productsData.items : [];
        setFeaturedProducts(safeItems.slice(0, 4));
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setCategories([]);
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero min-h-[90vh] flex items-center">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-floatSlow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-teal/10 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl animate-pulse" />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <AnimatedSection animation="fadeInDown" delay={100}>
                <Badge className="mb-6 bg-primary/20 text-primary-light border border-primary/30 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Egypt's #1 B2B Marketplace
                </Badge>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={200}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                  Connect with Trusted{' '}
                  <span className="relative">
                    <span className="text-primary">Suppliers</span>
                    <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                      <path d="M2 8C50 2 150 2 198 8" stroke="#FF7000" strokeWidth="4" strokeLinecap="round" className="animate-scaleIn" style={{ animationDelay: '0.5s' }} />
                    </svg>
                  </span>
                  {' '}for Your Business
                </h1>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={300}>
                <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
                  Streamline your procurement process. Browse thousands of products from verified suppliers and get the best wholesale prices.
                </p>
              </AnimatedSection>
              
              <AnimatedSection animation="fadeInUp" delay={400}>
                <div className="flex flex-wrap gap-4 mb-8">
                  <Link to="/products">
                    <Button 
                      size="lg" 
                      rightIcon={<ArrowRight className="h-5 w-5" />}
                      className="group"
                    >
                      Browse Products
                      <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 rounded-xl" />
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-white/30 text-white hover:bg-white hover:text-dark backdrop-blur-sm"
                      leftIcon={<Play className="h-5 w-5" />}
                    >
                      Watch Demo
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fadeInUp" delay={500}>
                <div className="flex items-center gap-6 text-sm text-gray-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Free to join</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Verified suppliers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Secure payments</span>
                  </div>
                </div>
              </AnimatedSection>
            </div>
            
            <div className="hidden lg:block">
              <AnimatedSection animation="fadeInRight" delay={300}>
                <div className="relative">
                  {/* Decorative elements */}
                  <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-teal/20 rounded-3xl blur-2xl animate-pulseGlow" />
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/30 rounded-full blur-xl animate-float" />
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-teal/30 rounded-full blur-xl animate-float" style={{ animationDelay: '1s' }} />
                  
                  {/* Main Image */}
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10">
                    <video 
                      src={backgroundVideo}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-[500px] object-cover transform hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounceSoft">
          <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/50 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface py-16 border-y border-border relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-teal/5" />
        <div className="container mx-auto px-4 relative z-10">
          <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-8" staggerDelay={100}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-5xl font-bold text-primary mb-2 transition-transform duration-300 group-hover:scale-110">
                  <Counter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-text-secondary font-medium">{stat.label}</div>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-surface-elevated relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeInUp" className="text-center mb-16">
            <Badge className="mb-4 bg-primary-light text-primary">Why Torida</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Why Choose Torida?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              We make B2B procurement simple, efficient, and cost-effective
            </p>
          </AnimatedSection>
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100}>
            {features.map((feature, index) => (
              <div key={index} className="group">
                <Card variant="interactive" className="p-8 h-full text-center">
                  <div className={`h-16 w-16 rounded-2xl ${feature.color} mx-auto mb-6 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3 group-hover:text-primary transition-colors duration-200">{feature.title}</h3>
                  <p className="text-text-muted leading-relaxed">{feature.description}</p>
                </Card>
              </div>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeInUp" className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-teal-light/20 text-teal">Browse</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Shop by Category
              </h2>
              <p className="text-text-secondary text-lg">
                Browse our wide range of product categories
              </p>
            </div>
            <Link to="/categories" className="mt-4 md:mt-0">
              <Button variant="ghost" rightIcon={<ChevronRight className="h-4 w-4" />} className="group">
                View All Categories
                <span className="ml-1 transform group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </Link>
          </AnimatedSection>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4" staggerDelay={80}>
              {categories.map((category, index) => (
                <Link key={category.id} to={`/categories/${category.id}`}>
                  <CategoryCard
                    image={getCategoryImage(index)}
                    name={category.category_name}
                    count={category.product_count || 0}
                  />
                </Link>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-20 bg-surface-elevated relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,112,0,0.05),transparent_50%)]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="fadeInUp" className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <Badge className="mb-4 bg-primary-light text-primary">Featured</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                Featured Products
              </h2>
              <p className="text-text-secondary text-lg">
                Top picks from our verified suppliers
              </p>
            </div>
            <Link to="/products" className="mt-4 md:mt-0">
              <Button variant="ghost" rightIcon={<ChevronRight className="h-4 w-4" />}>
                View All Products
              </Button>
            </Link>
          </AnimatedSection>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-muted">No products available yet.</p>
            </div>
          ) : (
            <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" staggerDelay={100}>
              {featuredProducts.map((product, index) => (
                <Link key={product.id} to={`/products/${product.id}`}>
                  <ProductCard
                    image={product.images?.[0]?.image_url || getProductImage(index)}
                    name={product.product_name}
                    price={product.price}
                    category={product.category?.category_name || 'General'}
                    rating={product.average_rating || 0}
                    reviewCount={product.review_count || 0}
                    supplier={product.seller?.full_name || 'Unknown Supplier'}
                  />
                </Link>
              ))}
            </StaggerContainer>
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeInUp" className="text-center mb-16">
            <Badge className="mb-4 bg-warning-light text-warning">Testimonials</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
              What Our Customers Say
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto text-lg">
              Join thousands of satisfied businesses across Egypt
            </p>
          </AnimatedSection>

          <StaggerContainer className="grid md:grid-cols-3 gap-6" staggerDelay={150}>
            {testimonials.map((testimonial, index) => (
              <Card key={index} variant="hover" className="p-6 relative">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-text-secondary mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.name}</p>
                    <p className="text-sm text-text-muted">{testimonial.role}</p>
                  </div>
                </div>
                
                {/* Decorative Quote */}
                <svg className="absolute top-4 right-4 w-8 h-8 text-primary/10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
              </Card>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary-dark to-teal" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.2)_100%)]" />
        
        {/* Animated shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/20 rounded-full animate-float" />
        <div className="absolute bottom-10 right-10 w-32 h-32 border-2 border-white/10 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-lg rotate-45 animate-floatSlow" />
        
        <div className="container mx-auto px-4 relative z-10">
          <AnimatedSection animation="scaleIn" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Grow Your Business?
            </h2>
            <p className="text-white/80 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Join thousands of supermarkets and suppliers already using Torida to streamline their procurement process.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/register">
                <Button
                  size="xl"
                  className="bg-white text-primary hover:bg-gray-100 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                  rightIcon={<ArrowRight className="h-5 w-5" />}
                >
                  Get Started Free
                </Button>
              </Link>
              <Link to="/contact">
                <Button
                  variant="outline"
                  size="xl"
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Suppliers Section */}
      <section className="py-20 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <AnimatedSection animation="fadeInUp" className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Trusted by Leading Suppliers
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Join the growing network of suppliers reaching thousands of supermarkets across Egypt
            </p>
          </AnimatedSection>

          <AnimatedSection animation="fadeIn" delay={200}>
            <div className="flex items-center justify-center gap-8 md:gap-16 flex-wrap">
              {['Cairo Foods', 'Delta Trading', 'Nile Valley', 'Alexandria Exports', 'Giza Grains'].map((name, index) => (
                <div 
                  key={name} 
                  className="text-xl md:text-2xl font-bold text-text-muted/40 hover:text-primary transition-colors duration-300 cursor-pointer"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {name}
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
