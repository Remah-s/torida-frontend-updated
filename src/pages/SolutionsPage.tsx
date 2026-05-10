import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Truck,
  BarChart3,
  Users,
  ShoppingCart,
  ArrowRight,
  Check,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

const retailerSolutions = [
  {
    icon: ShoppingCart,
    title: 'Smart Procurement',
    description: 'Streamline your buying process with intelligent product discovery and automated reordering.',
    features: [
      'AI-powered product recommendations',
      'Bulk ordering capabilities',
      'Automated inventory alerts',
      'One-click reordering',
    ],
  },
  {
    icon: Truck,
    title: 'Logistics Solutions',
    description: 'Reliable delivery network with real-time tracking and flexible scheduling.',
    features: [
      'Nationwide delivery coverage',
      'Real-time order tracking',
      'Scheduled deliveries',
      'Multi-supplier consolidation',
    ],
  },
  {
    icon: BarChart3,
    title: 'Business Analytics',
    description: 'Gain insights into your purchasing patterns and optimize your operations.',
    features: [
      'Spending analytics',
      'Supplier performance reports',
      'Cost-saving opportunities',
      'Trend analysis',
    ],
  },
  {
    icon: Users,
    title: 'Supplier Network',
    description: 'Access to verified suppliers across Egypt with competitive pricing.',
    features: [
      '5,000+ verified suppliers',
      'Quality guarantee',
      'Price comparison tools',
      'Direct communication',
    ],
  },
];

const supplierSolutions = [
  {
    icon: Store,
    title: 'Digital Storefront',
    description: 'Create your online presence and showcase your products to thousands of buyers.',
    features: [
      'Customizable storefront',
      'Product catalog management',
      'Brand showcase',
      'Multi-media support',
    ],
  },
  {
    icon: Users,
    title: 'Customer Access',
    description: 'Reach new customers across Egypt without marketing costs.',
    features: [
      'Access to 3,000+ retailers',
      'Lead generation',
      'RFQ management',
      'Customer insights',
    ],
  },
  {
    icon: BarChart3,
    title: 'Sales Analytics',
    description: 'Track your performance and identify growth opportunities.',
    features: [
      'Sales dashboards',
      'Product performance',
      'Market trends',
      'Demand forecasting',
    ],
  },
  {
    icon: Truck,
    title: 'Fulfillment Services',
    description: 'Optional warehousing and logistics support for your operations.',
    features: [
      'Storage solutions',
      'Order fulfillment',
      'Last-mile delivery',
      'Returns handling',
    ],
  },
];

const industries = [
  { name: 'Supermarkets', count: '2,500+' },
  { name: 'Grocery Stores', count: '1,800+' },
  { name: 'Convenience Stores', count: '1,200+' },
  { name: 'Wholesalers', count: '300+' },
  { name: 'Distributors', count: '200+' },
];

const SolutionsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('retailers');

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            Solutions for Your Business
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Tailored Solutions for{' '}
            <span className="text-primary">Every Business</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're a retailer looking to optimize procurement or a supplier 
            seeking new customers, we have the right solution for you.
          </p>
        </div>
      </section>

      {/* Solutions Tabs */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
              <TabsTrigger value="retailers">For Retailers</TabsTrigger>
              <TabsTrigger value="suppliers">For Suppliers</TabsTrigger>
            </TabsList>

            <TabsContent value="retailers">
              <div className="grid md:grid-cols-2 gap-6">
                {retailerSolutions.map((solution, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-primary-light flex-shrink-0 flex items-center justify-center">
                          <solution.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{solution.title}</h3>
                          <p className="text-text-muted text-sm mb-4">{solution.description}</p>
                          <ul className="space-y-2">
                            {solution.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="suppliers">
              <div className="grid md:grid-cols-2 gap-6">
                {supplierSolutions.map((solution, index) => (
                  <Card key={index} className="p-6">
                    <CardContent className="pt-4">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-teal-light flex-shrink-0 flex items-center justify-center">
                          <solution.icon className="h-6 w-6 text-teal" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{solution.title}</h3>
                          <p className="text-text-muted text-sm mb-4">{solution.description}</p>
                          <ul className="space-y-2">
                            {solution.features.map((feature, idx) => (
                              <li key={idx} className="flex items-center gap-2 text-sm">
                                <Check className="h-4 w-4 text-success" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Industries Served */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Industries We Serve
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Trusted by businesses of all sizes across multiple sectors
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {industries.map((industry, index) => (
              <Card key={index} className="px-6 py-4">
                <div className="text-center">
                  <div className="font-semibold">{industry.name}</div>
                  <div className="text-sm text-text-muted">{industry.count} businesses</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              Why Choose Torida?
            </h2>
          </div>
          
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-surface-elevated">
                  <tr>
                    <th className="px-6 py-4 text-left">Feature</th>
                    <th className="px-6 py-4 text-center">Torida</th>
                    <th className="px-6 py-4 text-center">Traditional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {[
                    ['Supplier Verification', true, false],
                    ['Online Ordering', true, false],
                    ['Price Comparison', true, false],
                    ['Delivery Tracking', true, false],
                    ['Buyer Protection', true, false],
                    ['Analytics Dashboard', true, false],
                    ['24/7 Support', true, false],
                  ].map(([feature, torida, traditional], idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4">{feature}</td>
                      <td className="px-6 py-4 text-center">
                        <Check className="h-5 w-5 text-success mx-auto" />
                      </td>
                      <td className="px-6 py-4 text-center text-text-muted">
                        {traditional ? <Check className="h-5 w-5 text-success mx-auto" /> : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-white">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-white/80 mb-6">
                Join thousands of businesses already benefiting from Torida's 
                B2B marketplace solutions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/register">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-gray-100"
                    rightIcon={<ArrowRight className="h-5 w-5" />}
                  >
                    Get Started
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
            <div className="hidden md:block text-center">
              <div className="text-6xl mb-4">🚀</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SolutionsPage;
