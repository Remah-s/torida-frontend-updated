import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  HelpCircle,
} from 'lucide-react';
import { Button, Card, Input } from '@/components/ui';

const contactInfo = [
  {
    icon: Phone,
    title: 'Phone',
    details: ['+20 2 1234 5678', '+20 100 123 4567'],
  },
  {
    icon: Mail,
    title: 'Email',
    details: ['support@torida.com', 'sales@torida.com'],
  },
  {
    icon: MapPin,
    title: 'Address',
    details: ['Smart Village, Building 5', 'Cairo, Egypt'],
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: ['Sunday - Thursday', '9:00 AM - 6:00 PM'],
  },
];

const faqQuick = [
  { question: 'How do I place an order?', answer: 'Simply browse products, add to cart, and proceed to checkout.' },
  { question: 'What payment methods are accepted?', answer: 'We accept cash on delivery, credit cards, and bank transfers.' },
  { question: 'How long does delivery take?', answer: 'Standard delivery is 2-3 business days across Egypt.' },
];

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mb-6">
          <Send className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-2xl font-bold text-text-primary mb-2">Message Sent!</h2>
        <p className="text-text-secondary mb-6 text-center max-w-md">
          Thank you for contacting us. Our team will get back to you within 24 hours.
        </p>
        <Button onClick={() => setSubmitted(false)}>Send Another Message</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-text-primary mb-4">
            Get in Touch
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Have a question or need assistance? We're here to help. 
            Fill out the form below or contact us directly.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-text-primary mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number"
                    placeholder="+20 xxx xxx xxxx"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <div>
                    <label className="block text-sm font-medium text-text-primary mb-2">
                      Subject
                    </label>
                    <select
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    >
                      <option value="">Select a subject</option>
                      <option value="support">Customer Support</option>
                      <option value="sales">Sales Inquiry</option>
                      <option value="partnership">Partnership</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>
                <Button type="submit" isLoading={isLoading} className="w-full sm:w-auto" leftIcon={<Send className="h-4 w-4" />}>
                  Send Message
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            {contactInfo.map((info, index) => (
              <Card key={index} className="p-4">
                <div className="flex items-start gap-4">
                  <div className="h-12 w-12 rounded-xl bg-primary-light flex items-center justify-center shrink-0">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary mb-1">{info.title}</h3>
                    {info.details.map((detail, i) => (
                      <p key={i} className="text-sm text-text-secondary">{detail}</p>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            {/* Quick FAQ */}
            <Card className="p-4">
              <h3 className="font-semibold text-text-primary mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Quick Answers
              </h3>
              <div className="space-y-3">
                {faqQuick.map((faq, index) => (
                  <details key={index} className="group">
                    <summary className="text-sm text-text-primary cursor-pointer list-none flex items-center justify-between">
                      {faq.question}
                      <span className="text-primary text-lg">+</span>
                    </summary>
                    <p className="text-sm text-text-muted mt-2 pl-2">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Map Placeholder */}
        <Card className="mt-12 h-64 overflow-hidden">
          <div className="w-full h-full bg-surface-elevated flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-text-muted mx-auto mb-2" />
              <p className="text-text-muted">Map integration coming soon</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ContactPage;
