import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { Button, Card } from '@/components/ui';
import { cn } from '@/utils';

const categories = [
  { icon: '🛒', name: 'Ordering & Purchasing', count: 12 },
  { icon: '🚚', name: 'Shipping & Delivery', count: 8 },
  { icon: '💳', name: 'Payments & Billing', count: 10 },
  { icon: '👤', name: 'Account & Profile', count: 6 },
  { icon: '📦', name: 'Products & Suppliers', count: 9 },
  { icon: '⚙️', name: 'Settings & Preferences', count: 5 },
];

const popularQuestions = [
  {
    question: 'How do I place my first order?',
    answer: 'Simply create an account, browse products from our catalog, add items to your cart, and proceed to checkout. You can choose from various payment methods including cash on delivery.',
  },
  {
    question: 'What is the minimum order quantity?',
    answer: 'Minimum order quantities vary by product and supplier. Each product listing shows the minimum order requirement. Most products have minimums between 5-20 units.',
  },
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery takes 2-3 business days for most locations in Egypt. Express delivery options are available in select areas. You can track your order in real-time from your dashboard.',
  },
  {
    question: 'What payment methods are accepted?',
    answer: 'We accept cash on delivery (COD), credit/debit cards (Visa, Mastercard, Meeza), and bank transfers. Corporate accounts can also apply for credit terms.',
  },
  {
    question: 'How do I become a supplier on Torida?',
    answer: 'Register as a supplier, complete your business verification, and start listing your products. Our team will review your application within 2-3 business days.',
  },
  {
    question: 'Can I return products?',
    answer: 'Yes, you can request returns within 7 days of delivery for quality issues or incorrect products. Contact our support team to initiate a return request.',
  },
];

const HelpPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const filteredQuestions = searchQuery
    ? popularQuestions.filter(q =>
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : popularQuestions;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            How can we help you?
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team
          </p>

          {/* Search */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-text-muted" />
            <input
              type="search"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 rounded-2xl border border-border bg-surface text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Categories */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {categories.map((category, index) => (
            <Card key={index} className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer">
              <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0 text-2xl">
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-text-primary">{category.name}</h3>
                <p className="text-sm text-text-muted">{category.count} articles</p>
              </div>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl font-semibold text-text-primary mb-6 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {filteredQuestions.map((faq, index) => (
              <Card key={index} className="overflow-hidden">
                <button
                  onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                  className="w-full p-4 text-left flex items-center justify-between"
                >
                  <span className="font-medium text-text-primary">{faq.question}</span>
                  <ChevronDown
                    className={cn(
                      'h-5 w-5 text-text-muted transition-transform',
                      openQuestion === index ? 'rotate-180' : ''
                    )}
                  />
                </button>
                {openQuestion === index && (
                  <div className="px-4 pb-4">
                    <p className="text-text-secondary">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {filteredQuestions.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="h-12 w-12 text-text-muted mx-auto mb-4" />
              <p className="text-text-secondary">No questions found matching your search</p>
            </div>
          )}
        </div>

        {/* Contact CTA */}
        <Card className="mt-12 p-8 text-center">
          <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Still need help?
          </h2>
          <p className="text-text-secondary mb-6">
            Our support team is available to assist you
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button leftIcon={<MessageCircle className="h-4 w-4" />}>
                Contact Support
              </Button>
            </Link>
            <a href="tel:+201234567890">
              <Button variant="outline">
                Call Us
              </Button>
            </a>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HelpPage;
