import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="bg-surface-elevated border-b border-border py-8">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Privacy Policy</h1>
              <p className="text-text-muted text-sm">Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto prose prose-slate">
          <Card className="mb-8">
            <div className="p-6 space-y-6 text-text-secondary">
              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">1. Introduction</h2>
                <p>
                  Torida ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our B2B marketplace platform.
                </p>
                <p>
                  Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">2. Information We Collect</h2>
                <h3 className="font-semibold text-text-primary mt-4 mb-2">Personal Information</h3>
                <p>We may collect personal information that you voluntarily provide to us when you:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Register on the platform</li>
                  <li>Place orders</li>
                  <li>Contact customer support</li>
                  <li>Subscribe to our newsletter</li>
                  <li>Participate in surveys or promotions</li>
                </ul>
                <p className="mt-4">This information may include:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Name and contact information</li>
                  <li>Business details (company name, tax ID, etc.)</li>
                  <li>Payment information</li>
                  <li>Delivery addresses</li>
                  <li>Communication preferences</li>
                </ul>

                <h3 className="font-semibold text-text-primary mt-4 mb-2">Automatically Collected Information</h3>
                <p>When you access our platform, we may automatically collect certain information including:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Device information and identifiers</li>
                  <li>Browser type and version</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and analytics</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">3. How We Use Your Information</h2>
                <p>We use the information we collect for various purposes, including to:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Provide, operate, and maintain our platform</li>
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your account and orders</li>
                  <li>Send promotional communications (with your consent)</li>
                  <li>Improve our services and develop new features</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">4. Information Sharing</h2>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Service Providers:</strong> Third parties who help us operate our platform (payment processors, delivery partners, etc.)</li>
                  <li><strong>Business Partners:</strong> For joint offerings or promotional activities</li>
                  <li><strong>Other Users:</strong> Limited business information shared with transaction partners</li>
                  <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
                </ul>
                <p className="mt-4">
                  We do not sell your personal information to third parties for their marketing purposes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">5. Data Security</h2>
                <p>
                  We implement appropriate technical and organizational security measures to protect your personal information. These include encryption, secure servers, access controls, and regular security assessments.
                </p>
                <p className="mt-4">
                  However, no method of transmission over the Internet is 100% secure. We cannot guarantee absolute security of your data.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">6. Your Rights</h2>
                <p>Depending on your location, you may have the following rights:</p>
                <ul className="list-disc pl-6 space-y-1">
                  <li><strong>Access:</strong> Request a copy of your personal data</li>
                  <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                  <li><strong>Deletion:</strong> Request deletion of your data</li>
                  <li><strong>Portability:</strong> Receive your data in a portable format</li>
                  <li><strong>Objection:</strong> Object to certain processing activities</li>
                  <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at privacy@torida.com.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">7. Data Retention</h2>
                <p>
                  We retain your personal information for as long as necessary to fulfill the purposes for which it was collected, including legal, accounting, or reporting requirements.
                </p>
                <p className="mt-4">
                  When your data is no longer needed, we will securely delete or anonymize it.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">8. International Transfers</h2>
                <p>
                  Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place for such transfers in compliance with applicable data protection laws.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">9. Children's Privacy</h2>
                <p>
                  Our platform is not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">10. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last updated" date.
                </p>
                <p className="mt-4">
                  We encourage you to review this policy periodically for any changes.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-bold text-text-primary mb-4">11. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us:</p>
                <div className="bg-surface rounded-lg p-4 mt-4">
                  <p><strong>Torida Privacy Team</strong></p>
                  <p>Email: privacy@torida.com</p>
                  <p>Address: Smart Village, Cairo, Egypt</p>
                </div>
              </section>
            </div>
          </Card>

          <div className="flex justify-between">
            <Link to="/terms">
              <Button variant="outline">View Terms of Service</Button>
            </Link>
            <Link to="/cookies">
              <Button variant="outline">View Cookie Policy</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
