import React from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  CreditCard,
  Truck,
  RefreshCw,
  Clock,
  HeadphonesIcon,
  CheckCircle,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const protections = [
  {
    icon: Shield,
    title: 'Verified Suppliers',
    description: 'All suppliers on our platform are vetted and verified. We check business licenses, product quality, and track record before they can sell.',
  },
  {
    icon: CreditCard,
    title: 'Secure Payments',
    description: 'Your payments are protected with our escrow system. Funds are only released to suppliers after you confirm receipt of goods.',
  },
  {
    icon: Truck,
    title: 'Guaranteed Delivery',
    description: 'Track your orders in real-time. If your order doesn\'t arrive, we\'ll refund you in full - no questions asked.',
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: 'Not satisfied with your order? Return it within 7 days for a full refund. We make the process simple and hassle-free.',
  },
  {
    icon: Clock,
    title: 'On-Time Delivery',
    description: 'Suppliers commit to delivery timelines. Late deliveries automatically qualify you for compensation.',
  },
  {
    icon: HeadphonesIcon,
    title: '24/7 Support',
    description: 'Our dedicated support team is always available to help resolve any issues between you and suppliers.',
  },
];

const guaranteeStats = [
  { value: 'E£10M+', label: 'Buyer Protection Fund' },
  { value: '99.5%', label: 'Successful Deliveries' },
  { value: '< 24hrs', label: 'Average Resolution Time' },
  { value: '100%', label: 'Refund Guarantee' },
];

const faqs = [
  {
    question: 'What happens if my order doesn\'t arrive?',
    answer: 'If your order doesn\'t arrive within the promised timeframe, you can request a full refund through our dispute resolution system. We\'ll investigate and process your refund within 3-5 business days.',
  },
  {
    question: 'How does the escrow payment system work?',
    answer: 'When you place an order, your payment is held securely in escrow. Funds are only released to the supplier after you confirm receipt and satisfaction with the goods. This ensures you\'re protected throughout the transaction.',
  },
  {
    question: 'What if the product quality doesn\'t match the description?',
    answer: 'You can file a dispute within 7 days of delivery. Our team will review the case, and if the product doesn\'t match the description, you\'ll receive a full refund and we\'ll arrange a free return.',
  },
  {
    question: 'Is there a limit to the protection coverage?',
    answer: 'Our buyer protection covers all orders placed through Torida, regardless of value. There\'s no upper limit on claim amounts for verified transactions.',
  },
];

const BuyerProtectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-primary-light text-primary">
              <Shield className="h-4 w-4 mr-1" />
              Buyer Protection
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
              Shop with Confidence,{' '}
              <span className="text-primary">Protected Every Step</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Your business is protected from order to delivery. We guarantee your transactions 
              and ensure you get what you pay for.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/products">
                <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                  Start Shopping
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-dark"
                >
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-surface py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {guaranteeStats.map((stat, index) => (
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

      {/* Protection Features */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              How We Protect You
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Multiple layers of protection ensure safe and secure transactions every time
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {protections.map((protection, index) => (
              <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                <CardContent className="pt-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary-light flex items-center justify-center mb-4">
                    <protection.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{protection.title}</h3>
                  <p className="text-sm text-text-muted">{protection.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">
              How It Works
            </h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Our protection is automatic - no extra steps required
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-4 gap-6">
              {[
                { step: 1, title: 'Place Order', desc: 'Browse products and place your order' },
                { step: 2, title: 'Payment Secured', desc: 'Payment held in escrow until delivery' },
                { step: 3, title: 'Receive Goods', desc: 'Inspect and confirm your order' },
                { step: 4, title: 'Funds Released', desc: 'Payment released to supplier' },
              ].map((item, index) => (
                <div key={index} className="relative">
                  <div className="text-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-lg mx-auto mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                  {index < 3 && (
                    <ArrowRight className="hidden md:block absolute top-6 -right-3 h-6 w-6 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Card */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-primary to-primary-dark overflow-hidden">
            <CardContent className="p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-white">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">
                    100% Money-Back Guarantee
                  </h2>
                  <p className="opacity-90 mb-6">
                    If you're not completely satisfied with your purchase, we'll refund your money. 
                    No questions asked, no hassle. That's our promise to you.
                  </p>
                  <ul className="space-y-2">
                    {['Full refund within 7 days', 'Free return shipping', 'Quick processing within 3-5 days'].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="text-center">
                  <div className="inline-block p-8 bg-white/10 rounded-2xl">
                    <Shield className="h-24 w-24 text-white mx-auto mb-4" />
                    <div className="text-white text-xl font-bold">Protected Buyer</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <h3 className="font-semibold mb-2">{faq.question}</h3>
                    <p className="text-text-muted">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-text-primary mb-4">
            Ready to Shop Safely?
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto mb-8">
            Join thousands of retailers who trust Torida for their wholesale needs. 
            Your protection is our priority.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/products">
              <Button size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Browse Products
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                Contact Support
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BuyerProtectionPage;
