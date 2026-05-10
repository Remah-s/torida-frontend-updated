import React from 'react';
import { Link } from 'react-router-dom';
import {
  Megaphone,
  Target,
  
  Users,
  DollarSign,
  Zap,
  Check,
  ArrowRight,
  TrendingUp,
  Eye,
  MousePointer,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const adTypes = [
  {
    icon: Eye,
    title: 'Banner Ads',
    description: 'Display your brand prominently on our homepage and category pages',
    features: ['High visibility placements', 'Custom sizes available', 'A/B testing support'],
    cta: 'Start from E£5,000/month',
  },
  {
    icon: Target,
    title: 'Sponsored Products',
    description: 'Promote your products in search results and product listings',
    features: ['Keyword targeting', 'Category targeting', 'Performance-based pricing'],
    cta: 'Pay per click from E£0.50',
  },
  {
    icon: Megaphone,
    title: 'Featured Supplier',
    description: 'Get featured as a top supplier on our suppliers page',
    features: ['Premium placement', 'Verified badge', 'Detailed profile showcase'],
    cta: 'E£10,000/month',
  },
  {
    icon: Zap,
    title: 'Flash Deals',
    description: 'Run time-limited promotional campaigns for your products',
    features: ['24-48 hour deals', 'Email blast to buyers', 'Social media promotion'],
    cta: 'E£3,000 per campaign',
  },
];

const targeting = [
  { title: 'Geographic', desc: 'Target buyers by governorate or city', icon: '📍' },
  { title: 'Category', desc: 'Show ads to buyers browsing specific categories', icon: '📁' },
  { title: 'Behavioral', desc: 'Target based on purchase history and browsing', icon: '🎯' },
  { title: 'Time-based', desc: 'Schedule ads for optimal times', icon: '⏰' },
];

const stats = [
  { value: '2M+', label: 'Monthly Impressions' },
  { value: '150K+', label: 'Active Buyers' },
  { value: '3.5%', label: 'Average CTR' },
  { value: '25%', label: 'Conversion Rate' },
];

const caseStudies = [
  {
    company: 'Delta Foods Co.',
    result: '+300% Product Views',
    quote: 'Sponsored products helped us reach buyers we never could before. ROI was incredible.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
  },
  {
    company: 'Nile Valley Organics',
    result: '+500% New Customers',
    quote: 'The featured supplier program gave us credibility and massive exposure.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
  },
];

const AdvertisingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <Badge className="mb-4 bg-primary-light text-primary">
                <Megaphone className="h-4 w-4 mr-1" />
                Advertising Platform
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                Reach More Buyers,{' '}
                <span className="text-primary">Grow Your Sales</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                Connect with thousands of verified retailers actively looking for products. 
                Our advertising platform puts your brand in front of the right audience.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/contact">
                  <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Start Advertising
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-dark"
                >
                  Get Media Kit
                </Button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-6 text-center">
                    <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-300">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ad Types */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Advertising Options
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Choose the right format to reach your target audience effectively
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {adTypes.map((ad, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                    <ad.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{ad.title}</h3>
                  <p className="text-sm text-text-muted mb-4">{ad.description}</p>
                  <ul className="space-y-2 mb-4">
                    {ad.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-success" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    {ad.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Targeting Options */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Advanced Targeting
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Reach the right buyers at the right time with precision targeting
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {targeting.map((item, index) => (
              <div key={index} className="text-center p-6 bg-surface-elevated rounded-xl">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">
                Track Your Performance
              </h2>
              <p className="text-text-secondary mb-8">
                Get detailed insights into your campaign performance with our comprehensive 
                analytics dashboard. Track impressions, clicks, conversions, and ROI in real-time.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: Eye, text: 'Real-time impression tracking' },
                  { icon: MousePointer, text: 'Click-through rate analysis' },
                  { icon: TrendingUp, text: 'Conversion tracking' },
                  { icon: DollarSign, text: 'ROI calculation' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-primary" />
                    </div>
                    <span className="font-medium">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold">Campaign Dashboard</h3>
                <Badge variant="success">Live</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">125K</div>
                  <div className="text-sm text-text-muted">Impressions</div>
                </div>
                <div className="p-4 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">4.2%</div>
                  <div className="text-sm text-text-muted">CTR</div>
                </div>
                <div className="p-4 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">525</div>
                  <div className="text-sm text-text-muted">Clicks</div>
                </div>
                <div className="p-4 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-primary">32%</div>
                  <div className="text-sm text-text-muted">Conversion</div>
                </div>
              </div>
              <div className="h-32 bg-surface rounded-lg flex items-end justify-around p-4">
                {[40, 65, 45, 80, 60, 90, 75].map((height, idx) => (
                  <div
                    key={idx}
                    className="w-8 bg-primary rounded-t"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Success Stories
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              See how other suppliers have grown their business with Torida advertising
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {caseStudies.map((study, index) => (
              <Card key={index} className="p-6">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={study.image}
                      alt={study.company}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-semibold">{study.company}</h4>
                      <Badge variant="success">{study.result}</Badge>
                    </div>
                  </div>
                  <p className="text-text-secondary italic">"{study.quote}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Amplify Your Reach?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Get started with Torida advertising today. Our team will help you create 
            campaigns that deliver real results.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
                rightIcon={<ArrowRight className="h-5 w-5" />}
              >
                Contact Advertising Team
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdvertisingPage;
