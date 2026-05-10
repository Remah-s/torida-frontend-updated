import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MapPin,
  Clock,
  Search,
  Filter,
  ChevronRight,
  Building,
  Users,
  Heart,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Input, SimpleSelect } from '@/components/ui';

const jobCategories = [
  'All Departments',
  'Engineering',
  'Product',
  'Design',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Support',
];

const locations = ['All Locations', 'Cairo', 'Alexandria', 'Remote'];

const jobs = [
  {
    id: 1,
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Cairo',
    type: 'Full-time',
    level: 'Senior',
    posted: '2 days ago',
    description: 'Join our engineering team to build the next generation of B2B commerce tools. You\'ll work on challenging problems at scale, from real-time inventory management to AI-powered recommendation systems.',
    requirements: ['5+ years experience', 'React, Node.js, Python', 'AWS/GCP experience', 'Team leadership'],
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Cairo',
    type: 'Full-time',
    level: 'Mid-Senior',
    posted: '3 days ago',
    description: 'Lead product initiatives that help thousands of businesses grow. You\'ll work closely with engineering, design, and business teams to define and deliver impactful features.',
    requirements: ['3+ years product management', 'B2B experience preferred', 'Data-driven mindset', 'Strong communication'],
  },
  {
    id: 3,
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'Remote',
    type: 'Full-time',
    level: 'Mid',
    posted: '1 week ago',
    description: 'Shape the visual identity and user experience of Torida. You\'ll create intuitive designs that make complex B2B transactions simple and delightful.',
    requirements: ['3+ years UI/UX experience', 'Figma expertise', 'Design system experience', 'Portfolio required'],
  },
  {
    id: 4,
    title: 'Growth Marketing Manager',
    department: 'Marketing',
    location: 'Cairo',
    type: 'Full-time',
    level: 'Senior',
    posted: '1 week ago',
    description: 'Drive user acquisition and retention strategies across digital channels. You\'ll own marketing campaigns and work on innovative ways to grow our user base.',
    requirements: ['4+ years growth marketing', 'SEO/SEM expertise', 'Analytics skills', 'Arabic fluency'],
  },
  {
    id: 5,
    title: 'Customer Success Manager',
    department: 'Customer Support',
    location: 'Alexandria',
    type: 'Full-time',
    level: 'Mid',
    posted: '2 weeks ago',
    description: 'Help our enterprise customers succeed. You\'ll be the main point of contact for key accounts, ensuring they get maximum value from our platform.',
    requirements: ['2+ years customer success', 'B2B experience', 'Problem-solving skills', 'Arabic & English'],
  },
  {
    id: 6,
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Cairo',
    type: 'Full-time',
    level: 'Senior',
    posted: '2 weeks ago',
    description: 'Build and maintain our cloud infrastructure. You\'ll work on CI/CD pipelines, monitoring, and ensuring high availability for our growing platform.',
    requirements: ['4+ years DevOps', 'Kubernetes, Docker', 'CI/CD pipelines', 'Security best practices'],
  },
];

const benefits = [
  { icon: '💰', title: 'Competitive Salary', desc: 'Market-leading compensation' },
  { icon: '🏥', title: 'Health Insurance', desc: 'Comprehensive medical coverage' },
  { icon: '🏖️', title: 'Paid Time Off', desc: '21 days annual leave' },
  { icon: '📈', title: 'Stock Options', desc: 'Ownership in our success' },
  { icon: '📚', title: 'Learning Budget', desc: 'Annual learning allowance' },
  { icon: '🏠', title: 'Remote Flexibility', desc: 'Hybrid work options' },
];

const CareersPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');
  const [selectedLocation, setSelectedLocation] = useState('All Locations');
  const [selectedJob, setSelectedJob] = useState<number | null>(null);

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = selectedDepartment === 'All Departments' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'All Locations' || job.location === selectedLocation;
    return matchesSearch && matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center text-white">
            <Badge className="mb-4 bg-primary-light text-primary">
              <Briefcase className="h-4 w-4 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Build the Future of{' '}
              <span className="text-primary">B2B Commerce</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Join a team of passionate people working to transform how businesses 
              buy and sell across Egypt. We're looking for talented individuals who 
              want to make an impact.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-center">
              <div>
                <div className="text-3xl font-bold text-primary">120+</div>
                <div className="text-sm text-gray-300">Team Members</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">15+</div>
                <div className="text-sm text-gray-300">Countries Served</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">2021</div>
                <div className="text-sm text-gray-300">Founded</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Why Work With Us</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              We believe in creating an environment where people can do their best work
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 text-center">
                <CardContent className="pt-4">
                  <div className="text-4xl mb-4">{benefit.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-text-muted">{benefit.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4">Open Positions</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Find your perfect role and join our growing team
            </p>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8 max-w-3xl mx-auto">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search positions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="h-4 w-4" />}
              />
            </div>
            <SimpleSelect
              value={selectedDepartment}
              onChange={setSelectedDepartment}
              options={jobCategories.map((c) => ({ value: c, label: c }))}
              className="min-w-[180px]"
            />
            <SimpleSelect
              value={selectedLocation}
              onChange={setSelectedLocation}
              options={locations.map((l) => ({ value: l, label: l }))}
              className="min-w-[150px]"
            />
          </div>

          {/* Job Listings */}
          <div className="max-w-4xl mx-auto space-y-4">
            {filteredJobs.length === 0 ? (
              <Card className="p-8 text-center">
                <CardContent className="pt-4">
                  <p className="text-text-muted">No positions found matching your criteria.</p>
                </CardContent>
              </Card>
            ) : (
              filteredJobs.map((job) => (
                <Card
                  key={job.id}
                  className={`cursor-pointer transition-all ${
                    selectedJob === job.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedJob(selectedJob === job.id ? null : job.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{job.title}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <Badge variant="outline">{job.department}</Badge>
                          <Badge variant="info">{job.location}</Badge>
                          <Badge variant="success">{job.type}</Badge>
                        </div>
                      </div>
                      <span className="text-sm text-text-muted">{job.posted}</span>
                    </div>
                    
                    {selectedJob === job.id && (
                      <div className="pt-4 border-t border-border">
                        <p className="text-text-secondary mb-4">{job.description}</p>
                        <div className="mb-4">
                          <h4 className="font-semibold mb-2">Requirements:</h4>
                          <ul className="list-disc list-inside text-sm text-text-muted space-y-1">
                            {job.requirements.map((req, idx) => (
                              <li key={idx}>{req}</li>
                            ))}
                          </ul>
                        </div>
                        <Link to={`/careers/${job.id}/apply`}>
                          <Button rightIcon={<ChevronRight className="h-4 w-4" />}>
                            Apply Now
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Culture Section */}
      <section className="py-16 bg-surface-elevated">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-text-primary mb-6">Our Culture</h2>
              <p className="text-text-secondary mb-6">
                At Torida, we believe in empowering our team members to do their best work. 
                We foster a culture of innovation, collaboration, and continuous learning.
              </p>
              <ul className="space-y-4">
                {[
                  'Diverse and inclusive workplace',
                  'Regular team events and activities',
                  'Open and transparent communication',
                  'Focus on personal growth and development',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary-light flex items-center justify-center">
                      <ChevronRight className="h-4 w-4 text-primary" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400"
                alt="Team collaboration"
                className="rounded-lg shadow-md"
              />
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400"
                alt="Office culture"
                className="rounded-lg shadow-md mt-8"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary-dark">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Don't See the Right Fit?
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            We're always looking for talented people. Send us your resume and we'll 
            reach out when a matching position opens up.
          </p>
          <Link to="/contact">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Send Your Resume
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
