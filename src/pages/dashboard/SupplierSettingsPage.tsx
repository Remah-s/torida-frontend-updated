import React from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Store,
  Bell,
  Lock,
  CreditCard,
  Globe,
  Shield,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  FileText,
  Trash2,
} from 'lucide-react';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button, Input, Card, CardContent, Badge } from '@/components/ui';

const SupplierSettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = React.useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'store', label: 'Store Settings', icon: Store },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <DashboardLayout type="supplier">
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
          <p className="text-text-muted">Manage your account and store preferences</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-teal text-white shadow-md shadow-teal/30'
                  : 'bg-surface-elevated text-text-secondary hover:bg-teal-light/20 hover:text-teal'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Picture */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-2xl bg-teal-light/20 flex items-center justify-center overflow-hidden">
                      <Store className="h-12 w-12 text-teal" />
                    </div>
                    <button className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-teal text-white flex items-center justify-center shadow-lg hover:bg-teal-light transition-colors">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted mb-2">
                      Upload a professional photo or logo for your store
                    </p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="teal">Upload Photo</Button>
                      <Button size="sm" variant="ghost">Remove</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
                    <Input placeholder="Enter your full name" defaultValue="Ahmed Hassan" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
                    <Input type="email" placeholder="Enter your email" defaultValue="ahmed@egyptgrains.com" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Phone Number</label>
                    <Input type="tel" placeholder="Enter your phone" defaultValue="+20 100 123 4567" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Alternative Phone</label>
                    <Input type="tel" placeholder="Alternative phone number" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Business Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Business Information</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Business Name</label>
                    <Input placeholder="Your business name" defaultValue="Egypt Grains Co." />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Business Type</label>
                    <select className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-teal">
                      <option>Wholesaler</option>
                      <option>Manufacturer</option>
                      <option>Distributor</option>
                      <option>Importer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Tax ID</label>
                    <Input placeholder="Tax identification number" defaultValue="EG-123456789" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-text-secondary mb-2">Business Address</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                      rows={3}
                      defaultValue="123 Industrial Zone, 6th of October City, Giza, Egypt"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="ghost">Cancel</Button>
              <Button variant="teal" leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'store' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Store Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Store Name</label>
                    <Input placeholder="Your store name" defaultValue="Egypt Grains Co. Official Store" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Store Description</label>
                    <textarea
                      className="w-full px-4 py-3 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-teal resize-none"
                      rows={4}
                      defaultValue="Premium quality grains and rice products from Egypt's leading supplier. We specialize in organic and conventional rice varieties with over 20 years of experience."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Store Categories</label>
                    <div className="flex flex-wrap gap-2">
                      {['Grains & Rice', 'Organic Products', 'Wholesale'].map((cat) => (
                        <Badge key={cat} variant="teal" className="px-3 py-1">
                          {cat}
                        </Badge>
                      ))}
                      <button className="px-3 py-1 rounded-full border border-dashed border-teal text-teal text-sm hover:bg-teal-light/20 transition-colors">
                        + Add Category
                      </button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Operating Hours</h2>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Opening Time</label>
                    <Input type="time" defaultValue="08:00" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Closing Time</label>
                    <Input type="time" defaultValue="18:00" />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-secondary mb-2">Working Days</label>
                  <div className="flex gap-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <button
                        key={day}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          day !== 'Fri'
                            ? 'bg-teal text-white'
                            : 'bg-surface-elevated text-text-muted hover:bg-teal-light/20'
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Delivery Settings</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Delivery Zones</label>
                    <div className="flex flex-wrap gap-2">
                      {['Cairo', 'Giza', 'Alexandria', 'Delta Region'].map((zone) => (
                        <Badge key={zone} variant="outline" className="px-3 py-1">
                          {zone}
                        </Badge>
                      ))}
                      <button className="px-3 py-1 rounded-full border border-dashed border-teal text-teal text-sm hover:bg-teal-light/20 transition-colors">
                        + Add Zone
                      </button>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Minimum Order Amount</label>
                      <Input type="number" placeholder="E£" defaultValue="500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">Delivery Time (Days)</label>
                      <Input type="number" defaultValue="2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end gap-3">
              <Button variant="ghost">Cancel</Button>
              <Button variant="teal" leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold mb-6">Notification Preferences</h2>
              <div className="space-y-6">
                {[
                  { title: 'New Orders', description: 'Get notified when you receive a new order', enabled: true },
                  { title: 'Order Updates', description: 'Updates on order status changes', enabled: true },
                  { title: 'Low Stock Alerts', description: 'Get alerted when products are running low', enabled: true },
                  { title: 'New Reviews', description: 'Notifications for new customer reviews', enabled: false },
                  { title: 'Marketing Emails', description: 'Promotional offers and updates', enabled: false },
                  { title: 'Weekly Reports', description: 'Weekly performance summary', enabled: true },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-text-muted">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked={item.enabled} className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal"></div>
                    </label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Current Password</label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button variant="teal">Update Password</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Two-Factor Authentication</h2>
                <p className="text-text-muted mb-4">Add an extra layer of security to your account</p>
                <Button variant="outline" leftIcon={<Shield className="h-4 w-4" />}>
                  Enable 2FA
                </Button>
              </CardContent>
            </Card>

            <Card className="border-error">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-error">Danger Zone</h2>
                <p className="text-text-muted mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="danger" leftIcon={<Trash2 className="h-4 w-4" />}>
                  Delete Account
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
                <div className="flex items-center justify-between p-4 bg-teal-light/20 rounded-xl border border-teal">
                  <div>
                    <Badge variant="teal" className="mb-2">Active Plan</Badge>
                    <h3 className="text-xl font-bold text-teal">Professional</h3>
                    <p className="text-sm text-text-muted">Unlimited products • Priority support • Analytics</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">E£999</div>
                    <div className="text-sm text-text-muted">/month</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <Button variant="outline">Change Plan</Button>
                  <Button variant="ghost">Cancel Subscription</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                <div className="flex items-center gap-4 p-4 bg-surface-elevated rounded-xl">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">•••• •••• •••• 4242</p>
                    <p className="text-sm text-text-muted">Expires 12/25</p>
                  </div>
                  <Button variant="ghost" size="sm">Edit</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Billing History</h2>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 1, 2024', amount: 'E£999', status: 'Paid' },
                    { date: 'Dec 1, 2023', amount: 'E£999', status: 'Paid' },
                    { date: 'Nov 1, 2023', amount: 'E£999', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                      <div>
                        <p className="font-medium">{invoice.date}</p>
                        <p className="text-sm text-text-muted">Professional Plan</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-medium">{invoice.amount}</span>
                        <Badge variant="success">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default SupplierSettingsPage;
