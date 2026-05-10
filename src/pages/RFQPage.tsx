import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Send,
  Plus,
  Minus,
  Clock,
  CheckCircle,
  Users,
  Package,
  ArrowRight,
} from 'lucide-react';
import { Button, Badge, Card, CardContent, Input, SimpleSelect } from '@/components/ui';
import api from '@/services/api';
import { categoryService } from '@/services/category';

const rfqSteps = [
  { icon: FileText, title: 'Submit Request', desc: 'Fill out the form with your requirements' },
  { icon: Users, title: 'Get Quotes', desc: 'Receive competitive quotes from suppliers' },
  { icon: CheckCircle, title: 'Compare & Choose', desc: 'Select the best offer for your business' },
  { icon: Package, title: 'Get Delivered', desc: 'Receive your products on time' },
];

const RFQPage: React.FC = () => {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [recentRfqs, setRecentRfqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    categoryService.getCategories().then((res) => {
      setCategories(res.map((c: any) => ({ value: c.category_name, label: c.category_name })));
    }).catch(console.error);

    api.get('/rfqs').then((res: any) => {
      setRecentRfqs(res.data?.items || []);
    }).catch(() => {
      // endpoint might not exist yet
    }).finally(() => setIsLoading(false));
  }, []);

  const [formData, setFormData] = useState({
    product_name: '',
    category: '',
    quantity: '',
    unit: 'kg',
    budget: '',
    description: '',
    delivery_location: '',
    deadline: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    api.post('/rfqs', formData).then(() => {
      setSubmitted(true);
    }).catch(console.error);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <CardContent className="pt-4">
            <div className="h-20 w-20 rounded-full bg-success-light mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-success" />
            </div>
            <h2 className="text-2xl font-bold mb-4">Request Submitted!</h2>
            <p className="text-text-muted mb-6">
              Your RFQ has been sent to relevant suppliers. You'll start receiving quotes within 24 hours.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/dashboard/retailer">
                <Button className="w-full">View My Requests</Button>
              </Link>
              <Button variant="outline" onClick={() => setSubmitted(false)}>
                Submit Another Request
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-dark-light to-teal py-12">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary-light text-primary">
            <FileText className="h-4 w-4 mr-1" />
            Request for Quote
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get the Best Prices for Your Business
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Submit your requirements and let suppliers compete to offer you the best deals. 
            Save time and money with our RFQ system.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-surface-elevated border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {rfqSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary-light flex-shrink-0 flex items-center justify-center">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-6">Submit Your Request</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Product Name *</label>
                      <Input
                        placeholder="e.g., Basmati Rice"
                        value={formData.product_name}
                        onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category *</label>
                      <SimpleSelect
                        value={formData.category}
                        onChange={(value) => setFormData({ ...formData, category: value })}
                        options={[
                          ...categories,
                        ]}
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Quantity *</label>
                      <Input
                        type="number"
                        placeholder="e.g., 500"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Unit *</label>
                      <SimpleSelect
                        value={formData.unit}
                        onChange={(value) => setFormData({ ...formData, unit: value })}
                        options={[
                          { value: 'kg', label: 'Kilograms (kg)' },
                          { value: 'L', label: 'Liters (L)' },
                          { value: 'pieces', label: 'Pieces' },
                          { value: 'cartons', label: 'Cartons' },
                          { value: 'bags', label: 'Bags' },
                        ]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Budget (EGP)</label>
                      <Input
                        type="number"
                        placeholder="e.g., 50000"
                        value={formData.budget}
                        onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Product Description</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-lg border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
                      placeholder="Describe your requirements in detail (quality, brand preferences, specifications, etc.)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Delivery Location *</label>
                      <Input
                        placeholder="e.g., Cairo, Egypt"
                        value={formData.delivery_location}
                        onChange={(e) => setFormData({ ...formData, delivery_location: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Quote Deadline *</label>
                      <Input
                        type="date"
                        value={formData.deadline}
                        onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button type="submit" size="lg" leftIcon={<Send className="h-5 w-5" />}>
                      Submit Request
                    </Button>
                    <Button type="button" variant="outline" size="lg">
                      Save as Draft
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tips Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Tips for Better Quotes</h3>
                <ul className="space-y-3">
                  {[
                    'Be specific about product specifications',
                    'Include quality requirements',
                    'Mention preferred brands if any',
                    'Set a realistic deadline',
                    'Provide accurate quantity estimates',
                  ].map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-text-muted">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Recent RFQs */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Recent Requests</h3>
                <div className="space-y-4">
                  {recentRfqs.map((rfq) => (
                    <div key={rfq.id} className="p-3 bg-surface rounded-lg">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm">{rfq.title}</h4>
                        <Badge variant={rfq.status === 'active' ? 'info' : 'success'} className="text-xs">
                          {rfq.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs text-text-muted">
                        <span>{rfq.quotes} quotes received</span>
                        <span>{rfq.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/dashboard/retailer/rfq">
                  <Button variant="ghost" className="w-full mt-4" rightIcon={<ArrowRight className="h-4 w-4" />}>
                    View All Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RFQPage;
