import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, X, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Badge, Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

const retailerPlans = [
  {
    name: 'Starter',
    description: 'Perfect for small supermarkets starting their digital journey',
    price: 0,
    period: 'forever',
    features: [
      { text: 'Browse all products', included: true },
      { text: 'Up to 50 orders/month', included: true },
      { text: 'Basic search & filters', included: true },
      { text: 'Email support', included: true },
      { text: 'Mobile app access', included: true },
      { text: 'Advanced analytics', included: false },
      { text: 'Priority delivery', included: false },
      { text: 'Dedicated account manager', included: false },
    ],
    cta: 'Get Started Free',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'For growing businesses that need more power',
    price: 499,
    period: 'month',
    features: [
      { text: 'Everything in Starter', included: true },
      { text: 'Unlimited orders', included: true },
      { text: 'Advanced analytics & reports', included: true },
      { text: 'Priority customer support', included: true },
      { text: 'Bulk order discounts', included: true },
      { text: 'Priority delivery', included: true },
      { text: 'Custom catalogs', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large chains and wholesale operations',
    price: 1499,
    period: 'month',
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Custom catalogs & pricing', included: true },
      { text: 'API access & integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Multi-location management', included: true },
      { text: 'Custom reports', included: true },
      { text: 'SLA guarantee', included: true },
      { text: 'White-label options', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const supplierPlans = [
  {
    name: 'Basic',
    description: 'Start selling on Torida with essential tools',
    price: 0,
    period: 'forever',
    commission: '5%',
    features: [
      { text: 'List up to 50 products', included: true },
      { text: 'Basic storefront', included: true },
      { text: 'Order management', included: true },
      { text: 'Email support', included: true },
      { text: 'Basic analytics', included: true },
      { text: 'Promoted listings', included: false },
      { text: 'Advanced analytics', included: false },
      { text: 'API access', included: false },
    ],
    cta: 'Start Selling',
    popular: false,
  },
  {
    name: 'Growth',
    description: 'Scale your business with advanced features',
    price: 999,
    period: 'month',
    commission: '3%',
    features: [
      { text: 'Unlimited products', included: true },
      { text: 'Custom storefront design', included: true },
      { text: 'Promoted listings', included: true },
      { text: 'Advanced analytics', included: true },
      { text: 'Priority support', included: true },
      { text: 'Bulk upload tools', included: true },
      { text: 'API access', included: false },
      { text: 'Dedicated manager', included: false },
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Premium',
    description: 'For large suppliers with custom needs',
    price: 2999,
    period: 'month',
    commission: '2%',
    features: [
      { text: 'Everything in Growth', included: true },
      { text: 'API access & integrations', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: 'Custom pricing rules', included: true },
      { text: 'Multi-user accounts', included: true },
      { text: 'Priority in search results', included: true },
      { text: 'Custom reports', included: true },
      { text: 'White-label options', included: true },
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

const faqs = [
  {
    question: 'Can I change my plan later?',
    answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, bank transfers, and mobile wallets including Vodafone Cash and Fawry.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'Yes, Professional and Growth plans come with a 14-day free trial. No credit card required.',
  },
  {
    question: 'Do you offer annual billing discounts?',
    answer: 'Yes, save 20% when you choose annual billing on any paid plan.',
  },
];

const PricingPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('retailers');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');

  const getPrice = (price: number) => {
    if (price === 0) return 'Free';
    if (billingCycle === 'annual') {
      return `E£${Math.round(price * 0.8).toLocaleString()}`;
    }
    return `E£${price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <div className="bg-gradient-to-br from-dark via-dark-light to-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">Simple Pricing</Badge>
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
            Choose the Perfect Plan for Your Business
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Whether you're a retailer looking to source products or a supplier wanting to reach more customers, we have a plan that fits.
          </p>
          
          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-4 bg-white/10 rounded-full p-1">
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'monthly' ? 'bg-white text-dark' : 'text-white'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                billingCycle === 'annual' ? 'bg-white text-dark' : 'text-white'
              }`}
            >
              Annual (Save 20%)
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Tabs */}
      <div className="container mx-auto px-4 -mt-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-12">
            <TabsTrigger value="retailers">For Retailers</TabsTrigger>
            <TabsTrigger value="suppliers">For Suppliers</TabsTrigger>
          </TabsList>

          <TabsContent value="retailers">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {retailerPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-text-muted mb-4">{plan.description}</p>
                    <div className="mb-6">
                      <span className="text-4xl font-bold text-primary">{getPrice(plan.price)}</span>
                      {plan.price > 0 && (
                        <span className="text-text-muted">
                          /{billingCycle === 'annual' ? 'month (billed annually)' : plan.period}
                        </span>
                      )}
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-success flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-text-muted'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register">
                      <Button
                        variant={plan.popular ? 'default' : 'outline'}
                        className="w-full"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="suppliers">
            <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {supplierPlans.map((plan) => (
                <Card
                  key={plan.name}
                  className={`relative overflow-hidden ${
                    plan.popular ? 'ring-2 ring-primary shadow-xl scale-105' : ''
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 bg-primary text-white px-4 py-1 text-sm font-medium">
                      Most Popular
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                    <p className="text-sm text-text-muted mb-4">{plan.description}</p>
                    <div className="mb-2">
                      <span className="text-4xl font-bold text-primary">{getPrice(plan.price)}</span>
                      {plan.price > 0 && (
                        <span className="text-text-muted">
                          /{billingCycle === 'annual' ? 'month (billed annually)' : plan.period}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-success mb-6">
                      {plan.commission} commission on sales
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          {feature.included ? (
                            <Check className="h-5 w-5 text-success flex-shrink-0" />
                          ) : (
                            <X className="h-5 w-5 text-gray-300 flex-shrink-0" />
                          )}
                          <span className={feature.included ? '' : 'text-text-muted'}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <Link to="/register">
                      <Button
                        variant={plan.popular ? 'default' : 'outline'}
                        className="w-full"
                        rightIcon={<ArrowRight className="h-4 w-4" />}
                      >
                        {plan.cta}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Features Comparison */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">All Plans Include</h2>
          <p className="text-text-muted">Everything you need to succeed on Torida</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: '🔒', title: 'Secure Payments', desc: 'Protected transactions with escrow' },
            { icon: '🚚', title: 'Fast Delivery', desc: 'Nationwide delivery network' },
            { icon: '📱', title: 'Mobile App', desc: 'Manage on the go' },
            { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
          ].map((feature, idx) => (
            <div key={idx} className="text-center p-6 bg-surface-elevated rounded-xl">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-text-muted">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-surface-elevated py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="max-w-2xl mx-auto space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-text-muted">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-gradient-to-r from-primary to-primary-dark">
          <CardContent className="p-8 text-center text-white">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
            <p className="opacity-80 mb-6">
              Our team is here to help you choose the right plan for your business.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="border-white text-white hover:bg-white hover:text-primary">
                Contact Sales
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;
