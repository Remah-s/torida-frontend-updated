import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, HelpCircle } from 'lucide-react';
import { Button, Badge, Card, CardContent, Input, Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui';

const faqCategories = [
  {
    name: 'Getting Started',
    icon: '🚀',
    faqs: [
      {
        question: 'How do I create an account on Torida?',
        answer: 'Creating an account is simple. Click the "Sign Up" button on the homepage, choose your account type (Retailer or Supplier), fill in your business details, and verify your email. You can start using the platform immediately after verification.',
      },
      {
        question: 'What\'s the difference between a Retailer and Supplier account?',
        answer: 'Retailer accounts are for businesses that want to buy products wholesale (supermarkets, grocery stores, etc.). Supplier accounts are for businesses that want to sell products to retailers (distributors, manufacturers, wholesalers). Each type has different features and dashboard views.',
      },
      {
        question: 'Is there a fee to join Torida?',
        answer: 'Basic accounts are free for both retailers and suppliers. We offer premium plans with additional features and lower commission rates. Check our pricing page for detailed information.',
      },
      {
        question: 'How long does the verification process take?',
        answer: 'Retailer accounts are verified instantly upon email confirmation. Supplier accounts require business document verification, which typically takes 1-2 business days.',
      },
    ],
  },
  {
    name: 'Orders & Payments',
    icon: '💳',
    faqs: [
      {
        question: 'What payment methods are accepted?',
        answer: 'We accept bank transfers, credit/debit cards, and cash on delivery (COD) for eligible orders. Corporate accounts can also apply for credit terms with approved suppliers.',
      },
      {
        question: 'How does the escrow payment system work?',
        answer: 'When you place an order, payment is held securely in escrow until you confirm receipt of goods. This protects both buyers and sellers throughout the transaction.',
      },
      {
        question: 'Can I cancel an order?',
        answer: 'Orders can be cancelled before they are processed by the supplier. Once processing begins, cancellation depends on the supplier\'s policy. Contact support for assistance.',
      },
      {
        question: 'When do I receive my refund?',
        answer: 'Refunds are processed within 3-5 business days after approval. The exact timing depends on your payment method and bank processing times.',
      },
    ],
  },
  {
    name: 'Shipping & Delivery',
    icon: '🚚',
    faqs: [
      {
        question: 'What areas do you deliver to?',
        answer: 'We deliver to all 27 governorates across Egypt. Delivery times vary by location, typically 1-3 days for major cities and 3-5 days for remote areas.',
      },
      {
        question: 'How can I track my order?',
        answer: 'Once your order is shipped, you\'ll receive a tracking number via email and SMS. You can track your order in real-time through your dashboard or our mobile app.',
      },
      {
        question: 'What if my order arrives damaged?',
        answer: 'Report any damage within 24 hours of delivery with photos. We\'ll arrange a return or replacement at no cost to you. Our buyer protection covers all qualifying orders.',
      },
      {
        question: 'Can I schedule a specific delivery time?',
        answer: 'Yes, during checkout you can select your preferred delivery date and time slot. Some suppliers also offer scheduled recurring deliveries for regular orders.',
      },
    ],
  },
  {
    name: 'Supplier Features',
    icon: '🏪',
    faqs: [
      {
        question: 'How do I list my products?',
        answer: 'After verification, access your Supplier Dashboard and click "Add Product." Fill in product details, upload images, set pricing tiers, and specify minimum order quantities. Products are reviewed before going live.',
      },
      {
        question: 'What commission does Torida charge?',
        answer: 'Commission ranges from 2-5% depending on your plan. Basic accounts have 5% commission, while premium plans offer rates as low as 2%. There are no listing fees.',
      },
      {
        question: 'How and when do I get paid?',
        answer: 'Payments are released to your bank account after buyer confirmation. For established suppliers with good ratings, faster payout options are available.',
      },
      {
        question: 'Can I set different prices for different quantities?',
        answer: 'Yes, you can create tiered pricing based on order quantity. This allows you to offer better rates for bulk purchases while maintaining margins on smaller orders.',
      },
    ],
  },
  {
    name: 'Account & Security',
    icon: '🔒',
    faqs: [
      {
        question: 'How do I reset my password?',
        answer: 'Click "Forgot Password" on the login page and enter your email. You\'ll receive a reset link valid for 24 hours. For security, you\'ll need to verify your identity.',
      },
      {
        question: 'How do I update my business information?',
        answer: 'Go to Settings > Business Profile in your dashboard. Some changes (like business name or tax ID) require verification. Contact support for major changes.',
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, we use industry-standard encryption and never store your full card details. All transactions are processed through PCI-compliant payment processors.',
      },
      {
        question: 'Can I have multiple users on one account?',
        answer: 'Premium accounts support multiple user logins with different permission levels. This is ideal for businesses with multiple staff managing orders.',
      },
    ],
  },
];

const FAQPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  

  const filteredCategories = faqCategories.map((category) => ({
    ...category,
    faqs: category.faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((category) => category.faqs.length > 0);

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <HelpCircle className="h-4 w-4 mr-1" />
            Help Center
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto mb-8">
            Find answers to common questions about using Torida
          </p>
          
          {/* Search */}
          <div className="max-w-xl mx-auto">
            <Input
              placeholder="Search for answers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="h-5 w-5" />}
              className="bg-white h-12 text-base"
            />
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            {filteredCategories.map((category, catIndex) => (
              <div key={catIndex} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{category.icon}</span>
                  <h2 className="text-xl font-bold">{category.name}</h2>
                </div>
                
                <Card>
                  <CardContent className="p-0">
                    <Accordion type="single" collapsible>
                      {category.faqs.map((faq, faqIndex) => (
                        <AccordionItem key={faqIndex} value={`${catIndex}-${faqIndex}` as const} className="border-b border-border last:border-0">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <span className="text-left font-medium">{faq.question}</span>
                          </AccordionTrigger>
                          <AccordionContent className="px-6 pb-4">
                            <p className="text-text-muted">{faq.answer}</p>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </CardContent>
                </Card>
              </div>
            ))}

            {filteredCategories.length === 0 && (
              <Card className="p-8 text-center">
                <CardContent className="pt-4">
                  <p className="text-text-muted mb-4">No results found for your search.</p>
                  <Button variant="outline" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Still Have Questions?</h2>
          <p className="text-text-muted mb-6 max-w-xl mx-auto">
            Our support team is here to help. Contact us and we'll get back to you within 24 hours.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button rightIcon={<HelpCircle className="h-4 w-4" />}>
                Contact Support
              </Button>
            </Link>
            <Link to="/help">
              <Button variant="outline">Browse Help Center</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
