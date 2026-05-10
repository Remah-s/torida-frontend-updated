import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  TrendingUp,
  Users,
  Shield,
  Truck,
  BarChart3,
  CreditCard,
  HeadphonesIcon,
  ArrowRight,
  Check,
  Play,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const benefits = [
  {
    icon: Store,
    title: 'Expand Your Reach',
    description: 'Access thousands of verified supermarkets and retailers across Egypt. Grow your customer base without the marketing costs.',
  },
  {
    icon: TrendingUp,
    title: 'Increase Sales',
    description: 'Our platform helps you reach new markets and boost your sales. Average suppliers see 40% growth in the first year.',
  },
  {
    icon: BarChart3,
    title: 'Smart Analytics',
    description: 'Get detailed insights into your sales, customer behavior, and market trends. Make data-driven decisions.',
  },
  {
    icon: Shield,
    title: 'Secure Payments',
    description: 'Get paid reliably with our secure payment system. Protected transactions with guaranteed payouts.',
  },
  {
    icon: Truck,
    title: 'Logistics Support',
    description: 'Optional fulfillment services to handle storage, packing, and delivery. Focus on your business, we handle the rest.',
  },
  {
    icon: HeadphonesIcon,
    title: 'Dedicated Support',
    description: '24/7 support team to help you succeed. Get assistance with onboarding, optimization, and any issues.',
  },
];

const stats = [
  { value: '5,000+', label: 'Active Buyers' },
  { value: 'E£50M+', label: 'Monthly Transactions' },
  { value: '98%', label: 'Payment Success Rate' },
  { value: '24/7', label: 'Support Available' },
];

const steps = [
  {
    step: 1,
    title: 'Create Your Account',
    description: 'Sign up with your business details and verify your company information.',
  },
  {
    step: 2,
    title: 'Set Up Your Store',
    description: 'Customize your storefront, upload your product catalog, and set pricing.',
  },
  {
    step: 3,
    title: 'Start Selling',
    description: 'Begin receiving orders from verified retailers across Egypt.',
  },
];

const testimonials = [
  {
    name: 'Ahmed Hassan',
    business: 'Delta Foods Co.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    quote: 'Torida transformed our business. We went from selling locally to reaching supermarkets across 15 governorates in just 6 months.',
    growth: '+180%',
  },
  {
    name: 'Fatima Mahmoud',
    business: 'Nile Valley Organics',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    quote: 'The platform\'s analytics helped us understand our market better. Our sales have tripled since joining Torida.',
    growth: '+200%',
  },
  {
    name: 'Mohamed Ali',
    business: 'Cairo Grains Trading',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    quote: 'Best decision we made for our business. The support team is incredible and the tools are easy to use.',
    growth: '+150%',
  },
];

const SellPage: React.FC = () => {
  // Video state removed

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="mb-4 bg-primary-light text-primary">For Suppliers</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Grow Your Business with{' '}
                <span className="text-primary">Torida</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
                Join Egypt's leading B2B marketplace. Connect with thousands of verified retailers, 
                increase your sales, and expand your reach across the country.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Start Selling Today
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-dark"
                  onClick={() => {}}
                  leftIcon={<Play className="h-5 w-5" />}
                >
                  Watch Demo
                </Button>
              </div>
              <p className="text-sm text-gray-400 mt-4">
                Free to join • No hidden fees • Cancel anytime
              </p>
            </div>
            
            <div className="hidden lg:block relative">
              <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-3xl" />
              <img
                src="https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=600"
                alt="Supplier warehouse"
                className="relative rounded-2xl shadow-2xl"
              />
            </div>
          </div>
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

      {/* Benefits Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Why Sell on Torida?
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Everything you need to grow your wholesale business and reach more customers
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-text-muted">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Get started in minutes and start growing your business
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 mb-8 last:mb-0">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg">
                    {step.step}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-16 bg-border ml-6 mt-2" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                  <p className="text-text-muted">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Success Stories
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              See how other suppliers have grown their business on Torida
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-text-muted">{testimonial.business}</p>
                    </div>
                    <Badge variant="success" className="ml-auto">
                      {testimonial.growth} Growth
                    </Badge>
                  </div>
                  <p className="text-text-secondary italic">"{testimonial.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-text-secondary mb-8">
              Start for free and scale as you grow. No hidden fees.
            </p>
            
            <Card className="p-8 text-left">
              <CardContent className="pt-4">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-surface rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">Free</div>
                    <div className="text-sm text-text-muted mb-2">Basic Plan</div>
                    <div className="text-lg font-semibold">5% Commission</div>
                  </div>
                  <div className="text-center p-4 bg-primary-light rounded-lg border-2 border-primary">
                    <div className="text-2xl font-bold text-primary mb-1">E£999/mo</div>
                    <div className="text-sm text-text-muted mb-2">Growth Plan</div>
                    <div className="text-lg font-semibold">3% Commission</div>
                  </div>
                  <div className="text-center p-4 bg-surface rounded-lg">
                    <div className="text-2xl font-bold text-primary mb-1">E£2,999/mo</div>
                    <div className="text-sm text-text-muted mb-2">Premium Plan</div>
                    <div className="text-lg font-semibold">2% Commission</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Link to="/pricing">
                    <Button variant="outline" rightIcon={<ArrowRight className="h-4 w-4" />}>
                      View Full Pricing Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Selling?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of suppliers already growing their business on Torida. 
            Set up your store in minutes and start reaching new customers today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Create Your Store
              </Button>
            </Link>
            <Link to="/contact">
              <Button
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SellPage;
