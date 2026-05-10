import React from 'react';
import { Link } from 'react-router-dom';
import {
  Quote,
  Star,
  TrendingUp,
  Users,
  ShoppingCart,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const testimonials = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    role: 'Owner',
    business: 'Cairo Supermarket Chain',
    business_type: 'retailer',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    quote: 'Torida has completely transformed how we source products. We\'ve reduced our procurement costs by 30% and found suppliers we never knew existed. The platform is intuitive and the support team is incredibly helpful.',
    stats: { savings: '30%', orders: '150+', rating: 4.9 },
    featured: true,
  },
  {
    id: 2,
    name: 'Fatima Mahmoud',
    role: 'CEO',
    business: 'Nile Valley Organics',
    business_type: 'supplier',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    quote: 'As a supplier, Torida opened doors to customers across Egypt. Our sales have grown 200% in the first year. The analytics dashboard helps us understand market trends and customer preferences.',
    stats: { growth: '200%', customers: '500+', rating: 4.8 },
    featured: true,
  },
  {
    id: 3,
    name: 'Mohamed Ali',
    role: 'Procurement Manager',
    business: 'Delta Mart',
    business_type: 'retailer',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
    quote: 'The verification system gives us confidence in every supplier we work with. We\'ve never had quality issues since switching to Torida. The buyer protection is a game-changer.',
    stats: { orders: '300+', suppliers: '25+', rating: 4.7 },
    featured: true,
  },
  {
    id: 4,
    name: 'Sara Ibrahim',
    role: 'Operations Director',
    business: 'Alexandria Foods Co.',
    business_type: 'supplier',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
    quote: 'The RFQ feature helps us win new business without spending on marketing. We\'ve connected with major supermarket chains that are now our long-term partners.',
    stats: { partners: '40+', revenue: '+150%', rating: 4.9 },
    featured: false,
  },
  {
    id: 5,
    name: 'Khaled Omar',
    role: 'Store Manager',
    business: 'Giza Grocery Network',
    business_type: 'retailer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    quote: 'Managing orders from multiple suppliers used to be a nightmare. Torida\'s unified dashboard makes everything simple. We save hours every week.',
    stats: { time_saved: '10hrs/week', orders: '200+', rating: 4.8 },
    featured: false,
  },
  {
    id: 6,
    name: 'Layla Mostafa',
    role: 'Founder',
    business: 'Green Valley Products',
    business_type: 'supplier',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
    quote: 'Starting as a small supplier, I never thought I could reach supermarkets across Egypt. Torida made it possible. Now we ship to 15 governorates.',
    stats: { governorates: '15', products: '120+', rating: 4.7 },
    featured: false,
  },
];

const stats = [
  { value: '5,000+', label: 'Active Businesses' },
  { value: 'E£500M+', label: 'Transactions Processed' },
  { value: '98%', label: 'Customer Satisfaction' },
  { value: '27', label: 'Governorates Covered' },
];

const SuccessStoriesPage: React.FC = () => {
  const featuredTestimonials = testimonials.filter((t) => t.featured);
  const otherTestimonials = testimonials.filter((t) => !t.featured);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <Star className="h-4 w-4 mr-1" />
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Real Businesses,{' '}
            <span className="text-primary">Real Growth</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover how businesses across Egypt are transforming their procurement 
            and sales with Torida's B2B marketplace platform.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Featured Stories
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Hear directly from our most successful partners
            </p>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            {featuredTestimonials.map((testimonial) => (
              <Card
                key={testimonial.id}
                className={`relative overflow-hidden ${
                  testimonial.business_type === 'supplier' ? 'ring-2 ring-teal' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{testimonial.name}</h3>
                      <p className="text-sm text-text-muted">{testimonial.role}</p>
                      <p className="text-sm font-medium text-primary">{testimonial.business}</p>
                    </div>
                  </div>
                  
                  <Badge
                    variant={testimonial.business_type === 'supplier' ? 'info' : 'success'}
                    className="mb-4"
                  >
                    {testimonial.business_type === 'supplier' ? 'Supplier' : 'Retailer'}
                  </Badge>
                  
                  <Quote className="h-8 w-8 text-primary/20 mb-2" />
                  <p className="text-text-secondary italic mb-4">{testimonial.quote}</p>
                  
                  <div className="flex justify-between items-center pt-4 border-t border-border">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(testimonial.stats.rating)
                              ? 'fill-warning text-warning'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    {Object.entries(testimonial.stats).slice(0, 2).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-sm font-bold text-primary">{value}</div>
                        <div className="text-xs text-text-muted capitalize">{key.replace('_', ' ')}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* More Stories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              More Success Stories
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {otherTestimonials.map((testimonial) => (
              <Card key={testimonial.id} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-text-muted">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary italic mb-4">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={testimonial.business_type === 'supplier' ? 'info' : 'success'} className="text-xs">
                      {testimonial.business_type === 'supplier' ? 'Supplier' : 'Retailer'}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-warning text-warning" />
                      <span className="text-xs">{testimonial.stats.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Industry Stats */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                Join the Growing Torida Community
              </h2>
              <p className="text-text-secondary mb-8">
                Businesses on Torida are experiencing unprecedented growth. 
                Whether you're a retailer looking to optimize procurement or a 
                supplier seeking new customers, we have the tools and network 
                to help you succeed.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-success-light flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <div className="font-semibold">Average Growth</div>
                    <div className="text-sm text-text-muted">+40% in first year</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary-light flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">New Connections</div>
                    <div className="text-sm text-text-muted">Average 50+ new partners per year</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-lg bg-teal-light flex items-center justify-center">
                    <ShoppingCart className="h-6 w-6 text-teal" />
                  </div>
                  <div>
                    <div className="font-semibold">Order Volume</div>
                    <div className="text-sm text-text-muted">3x increase in average order value</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'Retailers', count: '3,000+' },
                { value: 'Suppliers', count: '2,000+' },
                { value: 'Products', count: '15,000+' },
                { value: 'Daily Orders', count: '1,000+' },
              ].map((item, idx) => (
                <div key={idx} className="p-6 bg-surface rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary">{item.count}</div>
                  <div className="text-sm text-text-muted">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Write Your Own Success Story
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of businesses already growing with Torida. 
            Start your journey today and become our next success story.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Get Started Free
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SuccessStoriesPage;
