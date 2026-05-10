import React, { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle, ArrowLeft, KeyRound } from 'lucide-react';
import { Button, Card, CardContent, Input, Badge } from '@/components/ui';
import { authService } from '@/services/auth';

const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: searchParams.get('email') || '',
    otp: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState('');

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    }

    if (!formData.otp) {
      newErrors.otp = 'OTP code is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setApiError('');

    try {
      await authService.resetPassword({
        email: formData.email,
        otp: formData.otp,
        new_password: formData.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || err?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="h-16 w-16 rounded-full bg-success-light mx-auto mb-6 flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-success" />
            </div>
            <h2 className="text-xl font-bold mb-2">Password Reset Successful</h2>
            <p className="text-text-muted mb-6">
              Your password has been reset successfully. You can now log in with your new password.
            </p>
            <Link to="/login">
              <Button className="w-full">Continue to Login</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link to="/forgot-password" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Forgot Password
        </Link>

        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
                <Lock className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Reset Your Password</h1>
              <p className="text-text-muted text-sm">
                Enter the OTP sent to your email and create a new password
              </p>
            </div>

            {/* API Error */}
            {apiError && (
              <div className="p-3 rounded-lg bg-error-light text-error text-sm mb-4">
                {apiError}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  error={errors.email}
                  autoComplete="email"
                />
              </div>

              <div>
                <Input
                  type="text"
                  label="OTP Code"
                  placeholder="Enter the 6-digit OTP"
                  value={formData.otp}
                  onChange={(e) => setFormData({ ...formData, otp: e.target.value })}
                  error={errors.otp}
                  leftIcon={<KeyRound className="h-4 w-4" />}
                  maxLength={6}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    error={errors.password}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-error text-xs mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    error={errors.confirmPassword}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-error text-xs mt-1">{errors.confirmPassword}</p>}
              </div>

              {/* Password Requirements */}
              <div className="bg-surface-elevated rounded-lg p-4">
                <p className="text-xs font-medium mb-2">Password must contain:</p>
                <ul className="space-y-1">
                  {[
                    { text: 'At least 8 characters', valid: formData.password.length >= 8 },
                    { text: 'One uppercase letter', valid: /[A-Z]/.test(formData.password) },
                    { text: 'One lowercase letter', valid: /[a-z]/.test(formData.password) },
                    { text: 'One number', valid: /\d/.test(formData.password) },
                  ].map((req, idx) => (
                    <li key={idx} className={`flex items-center gap-2 text-xs ${req.valid ? 'text-success' : 'text-text-muted'}`}>
                      <CheckCircle className={`h-3 w-3 ${req.valid ? 'opacity-100' : 'opacity-30'}`} />
                      {req.text}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Reset Password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
