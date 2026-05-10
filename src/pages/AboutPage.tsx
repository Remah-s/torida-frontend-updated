import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  Truck,
  Award,
} from 'lucide-react';
import { Button, Card } from '@/components/ui';

const stats = [
  { value: '5,000+', label: 'Active Suppliers' },
  { value: '15,000+', label: 'Products Listed' },
  { value: '50,000+', label: 'Orders Delivered' },
  { value: '98%', label: 'Satisfaction Rate' },
];

const features = [
  {
    icon: Truck,
    title: 'Fast Delivery',
    description: 'Get your orders delivered within 24-48 hours across Egypt with real-time tracking.',
  },
  {
    icon: Shield,
    title: 'Verified Suppliers',
    description: 'All suppliers are vetted for quality, reliability, and business legitimacy.',
  },
  {
    icon: TrendingUp,
    title: 'Competitive Prices',
    description: 'Access wholesale prices directly from suppliers. No middlemen, better margins.',
  },
  {
    icon: Award,
    title: 'Quality Guaranteed',
    description: 'Products meet Egyptian food safety standards. Full refund for quality issues.',
  },
];

const milestones = [
  { year: '2020', title: 'Founded in Cairo', description: 'Started with 50 suppliers and 500 products' },
  { year: '2021', title: 'Nationwide Expansion', description: 'Expanded to all major Egyptian cities' },
  { year: '2022', title: 'Series A Funding', description: 'Raised $5M to scale operations' },
  { year: '2023', title: 'Mobile App Launch', description: 'Launched iOS and Android apps' },
  { year: '2024', title: '10,000+ Partners', description: 'Reached milestone of active partners' },
];

const team = [
  { name: 'Ahmed Hassan', role: 'CEO & Co-Founder', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200' },
  { name: 'Sara Mahmoud', role: 'CTO & Co-Founder', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200' },
  { name: 'Mohamed Ali', role: 'Head of Operations', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200' },
];

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Revolutionizing B2B Commerce in Egypt
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Torida is Egypt's leading B2B marketplace connecting supermarkets with verified suppliers.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register">
              <Button size="lg" className="bg-white text-dark hover:bg-gray-100">Join as Buyer</Button>
            </Link>
            <Link to="/register?type=supplier">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Become a Supplier
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-surface py-12 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-text-muted">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">Our Story</h2>
              <div className="space-y-4 text-text-secondary">
                <p>Torida was born from a simple observation: supermarkets in Egypt were struggling to source products efficiently.</p>
                <p>Founded in 2026 in Cairo, we set out to build a platform that would transform how businesses buy and sell wholesale products.</p>
                <p>Today, Torida connects thousands of supermarkets with hundreds of verified suppliers across Egypt.</p>
              </div>
            </div>
            <img src="back1.png" alt="Supermarket" className="rounded-2xl shadow-xl" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">Why Choose Torida?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 text-center hover:shadow-lg transition-shadow">
                <div className="h-14 w-14 rounded-2xl bg-primary-light mx-auto mb-4 flex items-center justify-center">
                  <feature.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-text-muted">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                    {milestone.year}
                  </div>
                  {index < milestones.length - 1 && <div className="w-0.5 flex-1 bg-border mt-2" />}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-text-primary mb-1">{milestone.title}</h3>
                  <p className="text-text-muted text-sm">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-text-primary mb-12 text-center">Leadership Team</h2>
          <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="p-6 text-center">
                <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h3 className="font-semibold text-text-primary">{member.name}</h3>
                <p className="text-sm text-text-muted">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Join Torida?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Whether you're a supermarket looking for better suppliers, or a supplier looking to reach more customers.
          </p>
          <Link to="/register">
            <Button size="lg" className="bg-white text-primary hover:bg-gray-100">Get Started Free</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
