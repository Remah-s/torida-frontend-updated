import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, ArrowLeft, Settings, Check } from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const cookieTypes = [
  {
    name: 'Essential Cookies',
    description: 'These cookies are necessary for the website to function properly. They enable basic functions like page navigation and access to secure areas. The website cannot function properly without these cookies.',
    required: true,
    examples: ['Session management', 'Security tokens', 'Shopping cart contents'],
  },
  {
    name: 'Functional Cookies',
    description: 'These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. If you do not allow these cookies, some or all of these services may not work properly.',
    required: false,
    examples: ['Language preference', 'Display settings', 'Region selection'],
  },
  {
    name: 'Analytics Cookies',
    description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and services.',
    required: false,
    examples: ['Page views', 'Time on site', 'Navigation paths'],
  },
  {
    name: 'Marketing Cookies',
    description: 'These cookies are used to track visitors across websites. The intention is to display ads that are relevant and engaging for the individual user.',
    required: false,
    examples: ['Ad targeting', 'Conversion tracking', 'Retargeting pixels'],
  },
];

const CookiesPage: React.FC = () => {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: true,
    marketing: false,
  });

  const handleSavePreferences = () => {
    // In a real app, this would save to localStorage or a cookie
    alert('Cookie preferences saved!');
  };

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
            <Cookie className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">Cookie Policy</h1>
              <p className="text-text-muted text-sm">Last updated: January 1, 2024</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          {/* Introduction */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">What Are Cookies?</h2>
              <p className="text-text-secondary mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. They are widely used to make websites work more efficiently and provide information to website owners.
              </p>
              <p className="text-text-secondary">
                At Torida, we use cookies and similar technologies to provide you with a better experience, understand how you use our platform, and improve our services.
              </p>
            </CardContent>
          </Card>

          {/* Cookie Types */}
          <h2 className="text-xl font-bold mb-4">Types of Cookies We Use</h2>
          <div className="space-y-4 mb-8">
            {cookieTypes.map((type, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{type.name}</h3>
                        {type.required && (
                          <Badge variant="info" className="text-xs">Required</Badge>
                        )}
                      </div>
                    </div>
                    {!type.required && (
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[index === 0 ? 'essential' : index === 1 ? 'functional' : index === 2 ? 'analytics' : 'marketing']}
                          onChange={(e) => {
                            const key = index === 0 ? 'essential' : index === 1 ? 'functional' : index === 2 ? 'analytics' : 'marketing';
                            setPreferences({ ...preferences, [key]: e.target.checked });
                          }}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    )}
                    {type.required && (
                      <div className="flex items-center gap-2 text-success">
                        <Check className="h-5 w-5" />
                        <span className="text-sm">Always active</span>
                      </div>
                    )}
                  </div>
                  <p className="text-text-secondary text-sm mb-4">{type.description}</p>
                  <div>
                    <p className="text-xs font-medium text-text-muted mb-2">Examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {type.examples.map((example, idx) => (
                        <span key={idx} className="text-xs bg-surface px-2 py-1 rounded">
                          {example}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* How to Manage Cookies */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Managing Cookies</h2>
              <p className="text-text-secondary mb-4">
                You can control and manage cookies in various ways. Please note that removing or blocking cookies can negatively impact your user experience and some features may no longer function properly.
              </p>
              
              <h3 className="font-semibold mt-4 mb-2">Browser Settings</h3>
              <p className="text-text-secondary text-sm mb-4">
                Most browsers allow you to manage cookie settings. You can set your browser to refuse cookies or delete certain cookies. Here's how to manage cookies in popular browsers:
              </p>
              <ul className="list-disc pl-6 text-sm text-text-secondary space-y-1 mb-4">
                <li>Chrome: Settings → Privacy and security → Cookies</li>
                <li>Firefox: Options → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Cookies and site permissions</li>
              </ul>

              <h3 className="font-semibold mt-4 mb-2">Third-Party Opt-Out</h3>
              <p className="text-text-secondary text-sm">
                Some third-party cookies can be managed through opt-out programs like the Digital Advertising Alliance or Network Advertising Initiative.
              </p>
            </CardContent>
          </Card>

          {/* Save Preferences */}
          <Card className="bg-gradient-to-r from-primary to-primary-dark mb-8">
            <CardContent className="p-6 text-white">
              <h2 className="text-xl font-bold mb-4">Your Cookie Preferences</h2>
              <p className="text-white/80 mb-6">
                You can update your cookie preferences at any time. Your choices will be saved and applied across all your visits to our platform.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  onClick={handleSavePreferences}
                  className="bg-white text-primary hover:bg-gray-100"
                  leftIcon={<Settings className="h-4 w-4" />}
                >
                  Save Preferences
                </Button>
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => setPreferences({ essential: true, functional: true, analytics: false, marketing: false })}
                >
                  Accept Essential Only
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Questions?</h2>
              <p className="text-text-secondary mb-4">
                If you have any questions about our use of cookies, please contact us at:
              </p>
              <div className="bg-surface rounded-lg p-4">
                <p><strong>Email:</strong> privacy@torida.com</p>
                <p><strong>Address:</strong> Smart Village, Cairo, Egypt</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer Links */}
          <div className="flex justify-between mt-8">
            <Link to="/privacy">
              <Button variant="outline">View Privacy Policy</Button>
            </Link>
            <Link to="/terms">
              <Button variant="outline">View Terms of Service</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookiesPage;
