import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Truck, TrendingUp } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { isValidEmail } from '@/utils';
import { ApiError } from '@/services/api';
import logo from '@/assets/images/logo.svg';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, validationErrors, clearError } = useAuthStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    
    if (!validateForm()) return;
    
    try {
      await login(email, password);
      // Redirect to dashboard — it will auto-redirect based on user role
      navigate('/dashboard');
    } catch (err) {
      // ApiError with validation errors are handled by the store
      // but we can also extract field-level errors from 422 responses
      if (err instanceof ApiError && err.isValidationError && err.errors) {
        const fieldErrors: { email?: string; password?: string } = {};
        if (err.errors.email) fieldErrors.email = err.errors.email[0];
        if (err.errors.password) fieldErrors.password = err.errors.password[0];
        setErrors(fieldErrors);
      }
    }
  };

  const features = [
    { icon: Truck, text: 'Fast Delivery' },
    { icon: Shield, text: 'Secure Payments' },
    { icon: TrendingUp, text: 'Best Prices' },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-floatSlow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full animate-rotateSlow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] border border-white/5 rounded-full animate-rotateSlow" style={{ animationDirection: 'reverse', animationDuration: '30s' }} />
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="max-w-lg text-center">
            <div className="mb-8 animate-fadeInUp">
              <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-sm mb-6">
                Egypt's #1 B2B Marketplace
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Welcome to <span className="text-primary">Torida</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Connect with thousands of verified suppliers and get the best wholesale prices for your business.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              {features.map((feature, index) => (
                <div key={index} className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <div className="h-12 w-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-white font-medium">{feature.text}</span>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-12 flex items-center justify-center gap-8 animate-fadeInUp" style={{ animationDelay: '400ms' }}>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">5K+</p>
                <p className="text-sm text-gray-400">Suppliers</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">15K+</p>
                <p className="text-sm text-gray-400">Products</p>
              </div>
              <div className="h-10 w-px bg-white/20" />
              <div className="text-center">
                <p className="text-3xl font-bold text-white">50K+</p>
                <p className="text-sm text-gray-400">Orders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8 animate-fadeInDown">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="relative">
                <div className="h-12 w-12 flex items-center justify-center transition-all duration-300 group-hover:scale-105">
                  <img src={logo} alt="Torida Logo" className="h-full w-full object-contain" />
                </div>
              </div>
              <span className="text-2xl font-bold text-dark">Torida</span>
            </Link>
          </div>

          {/* Welcome Text */}
          <div className="mb-8 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Welcome Back</h2>
            <p className="text-text-secondary">Sign in to your account to continue</p>
          </div>

          {/* Login Card */}
          <Card variant="default" className="p-8 shadow-xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Server error banner */}
              {error && (
                <div className="p-4 rounded-xl bg-error-light text-error text-sm border border-error/20 animate-fadeInDown flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-error text-xs">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {/* Validation error summary */}
              {validationErrors && (
                <div className="p-4 rounded-xl bg-yellow-50 text-yellow-800 text-sm border border-yellow-200 animate-fadeInDown">
                  <p className="font-medium mb-1">Please fix the following:</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {Object.entries(validationErrors).map(([field, msgs]) => (
                      <li key={field}>{msgs[0]}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              <div className="space-y-4">
                <div
                  className={cn(
                    'transition-all duration-300',
                    focusedField === 'email' && 'transform scale-[1.02]'
                  )}
                >
                  <Input
                    id="login-email"
                    type="email"
                    label="Email Address"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    error={errors.email}
                    leftIcon={<Mail className="h-4 w-4" />}
                    autoComplete="email"
                  />
                </div>
                
                <div
                  className={cn(
                    'transition-all duration-300',
                    focusedField === 'password' && 'transform scale-[1.02]'
                  )}
                >
                  <Input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    error={errors.password}
                    leftIcon={<Lock className="h-4 w-4" />}
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="focus:outline-none hover:text-primary transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    }
                    autoComplete="current-password"
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2.5 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      className="peer sr-only"
                    />
                    <div className="h-5 w-5 rounded-md border-2 border-border bg-surface peer-checked:bg-primary peer-checked:border-primary transition-all duration-200 group-hover:border-primary/50" />
                    <svg className="absolute top-1 left-1 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline underline-offset-4 hover:text-primary-dark transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              
              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />}
              >
                Sign In
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-surface text-text-muted">Or continue with</span>
              </div>
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/30 transition-all duration-200 group"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border bg-surface hover:bg-surface-elevated hover:border-primary/30 transition-all duration-200 group"
              >
                <svg className="h-5 w-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-text-secondary group-hover:text-text-primary transition-colors">Facebook</span>
              </button>
            </div>
          </Card>

          {/* Sign Up Link */}
          <p className="mt-6 text-center text-sm text-text-secondary animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline underline-offset-4 hover:text-primary-dark transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

// Helper function for classnames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default LoginPage;
