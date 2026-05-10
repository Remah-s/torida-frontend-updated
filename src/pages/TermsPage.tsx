import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui';

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    content: `By accessing and using Torida's platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform. These terms apply to all visitors, users, and others who access or use the Service.`,
  },
  {
    title: '2. Account Registration',
    content: `To use certain features of the Service, you must register for an account. When you register, you must provide accurate and complete information. You are responsible for safeguarding your account password and for any activities or actions under your account. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.`,
  },
  {
    title: '3. User Types',
    content: `Torida supports two types of user accounts:

Buyers (Supermarkets/Hypermarkets): Can browse products, place orders, and manage their business purchases through the platform.

Suppliers: Can list products, manage inventory, process orders, and interact with buyers on the platform. Suppliers must provide valid business registration and tax information.`,
  },
  {
    title: '4. Orders and Payments',
    content: `When you place an order through the Service, you are making an offer to purchase products from suppliers. All orders are subject to acceptance by the supplier and product availability.

Payment terms:
- Cash on Delivery (COD): Payment upon delivery
- Credit/Debit Cards: Processed securely through our payment partners
- Bank Transfer: For approved corporate accounts

Prices displayed on the platform are in Egyptian Pounds (EGP) and include applicable taxes unless otherwise stated.`,
  },
  {
    title: '5. Delivery and Shipping',
    content: `Delivery times are estimates and not guaranteed. Torida facilitates delivery through partner logistics providers but is not responsible for delays caused by factors outside our control.

Delivery fees are calculated based on the delivery location and order value. Free delivery may be available for orders above certain thresholds.

Risk of loss and title for items pass to you upon delivery to the carrier.`,
  },
  {
    title: '6. Returns and Refunds',
    content: `Products may be returned within 7 days of delivery if:
- The product is defective or damaged
- The wrong product was delivered
- The product does not match the description

To initiate a return, contact our support team with your order details and reason for return. Refunds are processed within 5-7 business days after the returned product is received and inspected.`,
  },
  {
    title: '7. Prohibited Activities',
    content: `Users may not:
- Use the platform for any unlawful purpose
- Submit false or misleading information
- Interfere with the platform's operation
- Attempt to gain unauthorized access to any part of the platform
- Use automated systems to access the platform without permission
- Engage in fraudulent activities or misrepresent their identity`,
  },
  {
    title: '8. Intellectual Property',
    content: `The Service and its original content, features, and functionality are owned by Torida and are protected by international copyright, trademark, and other intellectual property laws.

Our trademarks and trade dress may not be used without our prior written consent. User-generated content remains the property of the user, but by posting content, you grant Torida a license to use, display, and distribute that content on the platform.`,
  },
  {
    title: '9. Limitation of Liability',
    content: `In no event shall Torida, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, or goodwill.

Our total liability for any claim arising from or relating to the Service shall not exceed the amount you paid to us in the twelve (12) months preceding the claim.`,
  },
  {
    title: '10. Changes to Terms',
    content: `We reserve the right to modify these terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date.

Your continued use of the Service after any such changes constitutes your acceptance of the new Terms. If you do not agree to the modified Terms, you should discontinue your use of the Service.`,
  },
];

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="h-16 w-16 rounded-2xl bg-primary-light flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-text-primary mb-4">
              Terms of Service
            </h1>
            <p className="text-text-muted">
              Last updated: January 15, 2024
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-text-secondary mb-8">
              Welcome to Torida. These Terms of Service govern your use of our platform and services. 
              Please read these terms carefully before using our platform.
            </p>

            {termsSections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-xl font-semibold text-text-primary mb-3">
                  {section.title}
                </h2>
                <div className="text-text-secondary whitespace-pre-line leading-relaxed">
                  {section.content}
                </div>
              </div>
            ))}

            {/* Contact */}
            <div className="bg-surface-elevated rounded-xl p-6 mt-12">
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Questions about these Terms?
              </h3>
              <p className="text-text-secondary mb-4">
                If you have any questions about these Terms, please contact us.
              </p>
              <Link to="/contact">
                <Button variant="outline">Contact Us</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
