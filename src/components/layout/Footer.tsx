import React from 'react';
import { Link } from 'react-router-dom';
import {
  Store,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Send,
  Heart,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui';

// Social icons as simple SVGs
const FacebookIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = React.useState('');
  const [isSubscribed, setIsSubscribed] = React.useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Blog', href: '/blog' },
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Safety Center', href: '/safety' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
    legal: [
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'Returns Policy', href: '/returns' },
    ],
    suppliers: [
      { label: 'Become a Supplier', href: '/register?type=supplier' },
      { label: 'Supplier Guidelines', href: '/supplier-guidelines' },
      { label: 'Supplier Portal', href: '/supplier/dashboard' },
      { label: 'Success Stories', href: '/success-stories' },
    ],
  };

  return (
    <footer className="relative bg-dark mt-auto overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 py-16 relative z-10">
        {/* Newsletter Section */}
        <div className="bg-gradient-to-r from-primary/20 to-teal/20 rounded-2xl p-8 md:p-12 mb-16 backdrop-blur-sm border border-white/10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="h-5 w-5 text-primary" />
                <span className="text-primary font-medium">Newsletter</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Stay Updated with Torida
              </h3>
              <p className="text-gray-400">
                Get the latest deals, new products, and exclusive offers delivered to your inbox.
              </p>
            </div>
            
            <form onSubmit={handleSubscribe} className="relative">
              <div className="flex gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-12 px-6 bg-primary hover:bg-primary-dark"
                  rightIcon={isSubscribed ? undefined : <Send className="h-4 w-4" />}
                >
                  {isSubscribed ? 'Subscribed!' : 'Subscribe'}
                </Button>
              </div>
              {isSubscribed && (
                <p className="absolute -bottom-6 left-0 text-sm text-success flex items-center gap-1 animate-fadeIn">
                  <Sparkles className="h-4 w-4" />
                  Thanks for subscribing!
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-all duration-300 group-hover:scale-105">
                  <Store className="h-7 w-7 text-white" />
                </div>
                <div className="absolute -inset-1 rounded-xl bg-primary/20 blur opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <span className="text-2xl font-bold text-white">Torida</span>
            </Link>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Egypt's premier B2B marketplace connecting supermarkets with trusted suppliers for wholesale products at competitive prices.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a
                href="mailto:support@torida.com"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors duration-200 group"
              >
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Mail className="h-4 w-4" />
                </div>
                <span>support@torida.com</span>
              </a>
              <a
                href="tel:+201001234567"
                className="flex items-center gap-3 text-gray-400 hover:text-primary transition-colors duration-200 group"
              >
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                  <Phone className="h-4 w-4" />
                </div>
                <span>+20 100 123 4567</span>
              </a>
              <div className="flex items-center gap-3 text-gray-400">
                <div className="h-9 w-9 rounded-lg bg-white/5 flex items-center justify-center">
                  <MapPin className="h-4 w-4" />
                </div>
                <span>Cairo, Egypt</span>
              </div>
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              Company
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <li key={link.href} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-primary transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              Support
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link, index) => (
                <li key={link.href} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-primary transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              Legal
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <li key={link.href} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-primary transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Suppliers Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 flex items-center gap-2">
              Suppliers
              <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
            </h4>
            <ul className="space-y-3">
              {footerLinks.suppliers.map((link, index) => (
                <li key={link.href} style={{ animationDelay: `${index * 50}ms` }}>
                  <Link
                    to={link.href}
                    className="text-gray-400 text-sm hover:text-primary transition-all duration-200 flex items-center gap-1 group"
                  >
                    <ArrowRight className="h-3 w-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all duration-200" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400 mr-2">Follow us:</span>
              {[
                { icon: <FacebookIcon />, href: 'https://facebook.com', label: 'Facebook' },
                { icon: <TwitterIcon />, href: 'https://twitter.com', label: 'Twitter' },
                { icon: <InstagramIcon />, href: 'https://instagram.com', label: 'Instagram' },
                { icon: <LinkedinIcon />, href: 'https://linkedin.com', label: 'LinkedIn' },
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white hover:scale-110 transition-all duration-300 shadow-sm hover:shadow-lg hover:shadow-primary/30"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>

            {/* Copyright */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span>© {currentYear} Torida. All rights reserved.</span>
              <span className="hidden md:inline">•</span>
              <span className="flex items-center gap-1">
                Made with <Heart className="h-4 w-4 text-error fill-error animate-pulse" /> in Egypt
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
