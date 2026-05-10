import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  Building2,
  MapPin,
  Camera,
  Save,
  Lock,


} from 'lucide-react';
import { Button, Card, Input, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';

const governorates = [
  { id: 1, name: 'Cairo' },
  { id: 2, name: 'Alexandria' },
  { id: 3, name: 'Giza' },
  { id: 4, name: 'Qalyubia' },
  { id: 5, name: 'Port Said' },
  { id: 6, name: 'Suez' },
  { id: 7, name: 'Dakahlia' },
  { id: 8, name: 'Sharqia' },
];

const ProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuthStore();

  const [formData, setFormData] = useState({
    username: user?.full_name || 'supermarket_user',
    email: user?.email || 'user@example.com',
    phone: '+20 123 456 7890',
    business_name: 'Cairo Fresh Market',
    business_type: 'Supermarket',
    governorate: 'Cairo',
    address: '123 Tahrir Street, Downtown',
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <User className="h-16 w-16 text-text-muted mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">Please Login</h2>
        <p className="text-text-secondary mb-6">Login to view your profile</p>
        <Link to="/login">
          <Button size="lg">Login</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold text-text-primary mb-8">Profile Settings</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <Card className="p-6 text-center">
              <div className="relative inline-block mb-4">
                <div className="h-24 w-24 rounded-full bg-primary-light flex items-center justify-center mx-auto">
                  <User className="h-12 w-12 text-primary" />
                </div>
                <button className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg hover:bg-primary-dark transition-colors">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
              <h2 className="text-lg font-semibold text-text-primary">{formData.business_name}</h2>
              <p className="text-text-muted text-sm mb-3">@{formData.username}</p>
              <Badge variant="success">Verified Account</Badge>

              <div className="mt-6 pt-6 border-t border-border text-left space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">{formData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">{formData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-text-muted" />
                  <span className="text-sm text-text-secondary">{formData.governorate}</span>
                </div>
              </div>
            </Card>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Personal Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  leftIcon={<User className="h-4 w-4" />}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  leftIcon={<Mail className="h-4 w-4" />}
                />
                <Input
                  label="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  leftIcon={<Phone className="h-4 w-4" />}
                />
              </div>
            </Card>

            {/* Business Info */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Business Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  label="Business Name"
                  value={formData.business_name}
                  onChange={(e) => setFormData({ ...formData, business_name: e.target.value })}
                  leftIcon={<Building2 className="h-4 w-4" />}
                />
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Business Type
                  </label>
                  <select
                    value={formData.business_type}
                    onChange={(e) => setFormData({ ...formData, business_type: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option>Supermarket</option>
                    <option>Hypermarket</option>
                    <option>Convenience Store</option>
                    <option>Wholesale Market</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Governorate
                  </label>
                  <select
                    value={formData.governorate}
                    onChange={(e) => setFormData({ ...formData, governorate: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl border border-border bg-surface focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {governorates.map(gov => (
                      <option key={gov.id} value={gov.name}>{gov.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  leftIcon={<MapPin className="h-4 w-4" />}
                />
              </div>
            </Card>

            {/* Change Password */}
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-text-primary mb-6">Change Password</h2>
              <div className="space-y-4">
                <Input
                  label="Current Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.current_password}
                  onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <Input
                  label="New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.new_password}
                  onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                  leftIcon={<Lock className="h-4 w-4" />}
                />
                <Input
                  label="Confirm New Password"
                  type={showPassword ? 'text' : 'password'}
                  value={passwordData.confirm_password}
                  onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                  leftIcon={<Lock className="h-4 w-4" />}
                  error={
                    passwordData.confirm_password && passwordData.new_password !== passwordData.confirm_password
                      ? 'Passwords do not match'
                      : undefined
                  }
                />
                <label className="flex items-center gap-2 text-sm text-text-muted">
                  <input
                    type="checkbox"
                    checked={showPassword}
                    onChange={(e) => setShowPassword(e.target.checked)}
                  />
                  Show passwords
                </label>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end gap-3">
              <Button variant="ghost">Cancel</Button>
              <Button onClick={handleSave} isLoading={isLoading} leftIcon={<Save className="h-4 w-4" />}>
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
