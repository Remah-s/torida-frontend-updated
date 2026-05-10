import React from 'react';

import {
  Newspaper,
  Calendar,
  Download,
  ExternalLink,
  Play,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge, Card, CardContent } from '@/components/ui';

const pressReleases = [
  {
    id: 1,
    title: 'Torida Raises $10M Series A to Expand B2B Commerce Platform',
    date: 'January 15, 2024',
    excerpt: 'Funding led by Global Ventures to accelerate growth across Egypt and MENA region, bringing total funding to $15M.',
    category: 'Funding',
    featured: true,
  },
  {
    id: 2,
    title: 'Torida Partners with Egyptian Ministry of Trade to Digitize Supply Chain',
    date: 'December 8, 2023',
    excerpt: 'Strategic partnership aims to help 10,000 traditional retailers digitize their procurement process.',
    category: 'Partnership',
    featured: false,
  },
  {
    id: 3,
    title: 'Torida Launches AI-Powered Product Recommendations',
    date: 'November 20, 2023',
    excerpt: 'New feature helps retailers discover products tailored to their business needs and customer preferences.',
    category: 'Product',
    featured: false,
  },
  {
    id: 4,
    title: 'Torida Expands to Alexandria with New Office',
    date: 'October 5, 2023',
    excerpt: 'Expansion strengthens presence in Egypt\'s second-largest city and improves support for Northern region customers.',
    category: 'Expansion',
    featured: false,
  },
];

const mediaCoverage = [
  {
    id: 1,
    outlet: 'TechCrunch',
    title: 'Egypt\'s Torida is digitizing B2B commerce for traditional retailers',
    date: 'January 16, 2024',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
    url: '#',
  },
  {
    id: 2,
    outlet: 'Forbes Middle East',
    title: 'How Torida is Transforming Egypt\'s Retail Supply Chain',
    date: 'December 12, 2023',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
    url: '#',
  },
  {
    id: 3,
    outlet: 'Wamda',
    title: 'Torida\'s $10M Series A: What It Means for Egyptian Startups',
    date: 'January 18, 2024',
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400',
    url: '#',
  },
];

const mediaKit = {
  logos: [
    { name: 'Primary Logo', format: 'PNG, SVG' },
    { name: 'Dark Background', format: 'PNG, SVG' },
    { name: 'Icon Only', format: 'PNG, SVG' },
  ],
  stats: [
    { label: 'Active Users', value: '5,000+' },
    { label: 'Products', value: '15,000+' },
    { label: 'Governorates', value: '27' },
    { label: 'Team Size', value: '120+' },
  ],
  founders: [
    { name: 'Ahmed El-Sayed', role: 'CEO & Co-founder' },
    { name: 'Mohamed Hassan', role: 'CTO & Co-founder' },
  ],
};

const PressPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <Newspaper className="h-4 w-4 mr-1" />
            Press & Media
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Torida in the News
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Stay updated with our latest announcements, press releases, and media coverage.
          </p>
        </div>
      </section>

      {/* Featured Press Release */}
      <section className="py-12 bg-surface-elevated">
        <div className="container mx-auto px-4">
          {pressReleases.filter((pr) => pr.featured).map((pr) => (
            <Card key={pr.id} className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="h-64 md:h-auto bg-gradient-to-br from-primary to-primary-dark" />
                <CardContent className="p-8">
                  <Badge variant="default" className="mb-4">{pr.category}</Badge>
                  <h2 className="text-2xl font-bold mb-4">{pr.title}</h2>
                  <p className="text-text-muted mb-4">{pr.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">{pr.date}</span>
                    <Button rightIcon={<ArrowRight className="h-4 w-4" />}>
                      Read Full Release
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* All Press Releases */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Press Releases</h2>
          <div className="space-y-4">
            {pressReleases.map((pr) => (
              <Card key={pr.id} className="p-6 hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline">{pr.category}</Badge>
                        <span className="text-sm text-text-muted">{pr.date}</span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{pr.title}</h3>
                      <p className="text-text-muted text-sm">{pr.excerpt}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Coverage */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Media Coverage</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {mediaCoverage.map((article) => (
              <Card key={article.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-40 bg-surface" />
                <CardContent className="p-4">
                  <Badge variant="outline" className="mb-2">{article.outlet}</Badge>
                  <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-text-muted">{article.date}</span>
                    <a href={article.url} className="text-primary text-sm flex items-center gap-1">
                      Read <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Media Kit */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-bold mb-6">Media Kit</h2>
              <p className="text-text-muted mb-6">
                Download our media kit for logos, brand assets, and company information.
              </p>
              <Button leftIcon={<Download className="h-4 w-4" />}>
                Download Media Kit
              </Button>
            </div>
            
            <div className="grid sm:grid-cols-2 gap-4">
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Company Facts</h3>
                  <ul className="space-y-2">
                    {mediaKit.stats.map((stat, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span className="text-text-muted">{stat.label}</span>
                        <span className="font-semibold">{stat.value}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="p-4">
                <CardContent className="pt-4">
                  <h3 className="font-semibold mb-2">Founders</h3>
                  <ul className="space-y-2">
                    {mediaKit.founders.map((founder, idx) => (
                      <li key={idx}>
                        <div className="font-medium">{founder.name}</div>
                        <div className="text-sm text-text-muted">{founder.role}</div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact for Press */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Press Inquiries
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            For press inquiries, interview requests, or media partnerships, 
            please contact our communications team.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a href="mailto:press@torida.com">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-gray-100"
              >
                press@torida.com
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PressPage;
