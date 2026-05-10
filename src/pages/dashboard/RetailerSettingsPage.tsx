import React, { useState } from 'react';

import {
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Camera,
  Lock,
  Bell,
  Shield,
  Save,
} from 'lucide-react';
import { Button, Card, CardContent, Input, Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui';

const initialProfile = {
  businessName: 'Cairo Supermarket',
  businessType: 'Supermarket',
  ownerName: 'Ahmed Hassan',
  email: 'ahmed@cairosupermarket.com',
  phone: '+20 10 1234 5678',
  address: '123 Main Street, Nasr City',
  governorate: 'Cairo',
  description: 'A leading supermarket chain in Cairo serving over 10,000 customers monthly.',
  logo: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200',
};

const RetailerSettingsPage: React.FC = () => {
  const [profile, setProfile] = useState(initialProfile);
  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: true,
    newsletter: false,
    smsAlerts: true,
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully!');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-surface">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Account Settings</h1>

        <Tabs defaultValue="profile">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-6">Business Information</h2>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Business Name</label>
                          <Input
                            value={profile.businessName}
                            onChange={(e) => setProfile({ ...profile, businessName: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Business Type</label>
                          <Input
                            value={profile.businessType}
                            onChange={(e) => setProfile({ ...profile, businessType: e.target.value })}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium mb-2">Owner/Manager Name</label>
                        <Input
                          value={profile.ownerName}
                          onChange={(e) => setProfile({ ...profile, ownerName: e.target.value })}
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email</label>
                          <Input
                            type="email"
                            value={profile.email}
                            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Phone</label>
                          <Input
                            value={profile.phone}
                            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Address</label>
                        <Input
                          value={profile.address}
                          onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                        />
                      </div>

                      <Button onClick={handleSave} isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardContent className="p-6 text-center">
                    <h2 className="text-lg font-semibold mb-4">Profile Picture</h2>
                    <div className="relative inline-block mb-4">
                      <img
                        src={profile.logo}
                        alt={profile.businessName}
                        className="w-32 h-32 rounded-full object-cover"
                      />
                      <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                        <Camera className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="text-sm text-text-muted">
                      Upload a logo or photo for your business profile
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="security">
            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Change Password
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card className="max-w-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Preferences
                </h2>
                <div className="space-y-4">
                  {[
                    { key: 'orderUpdates', label: 'Order Updates', desc: 'Get notified about order status changes' },
                    { key: 'promotions', label: 'Promotions & Deals', desc: 'Receive updates about special offers' },
                    { key: 'newsletter', label: 'Newsletter', desc: 'Weekly digest of news and updates' },
                    { key: 'smsAlerts', label: 'SMS Alerts', desc: 'Receive important alerts via SMS' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-surface-elevated rounded-lg">
                      <div>
                        <div className="font-medium">{item.label}</div>
                        <div className="text-sm text-text-muted">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                      </label>
                    </div>
                  ))}
                </div>
                <Button onClick={handleSave} className="mt-6" isLoading={isSaving}>
                  Save Preferences
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RetailerSettingsPage;
