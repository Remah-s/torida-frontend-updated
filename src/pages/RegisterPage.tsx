import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, MapPin, Building2, CheckCircle2 } from 'lucide-react';
import { Button, Input, Card, Badge } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { governorateService, userTypeService } from '@/services';
import { ApiError } from '@/services/api';
import { isValidEmail, isValidPhone } from '@/utils';
import type { Governorate, UserType } from '@/types';
import logo from '@/assets/images/logo.svg';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, validationErrors, clearError } = useAuthStore();

  // Form state
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [typeId, setTypeId] = useState<number>(2); // Default: Retailer
  const [govId, setGovId] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Lookup data from API
  const [governorates, setGovernorates] = useState<Governorate[]>([]);
  const [userTypes, setUserTypes] = useState<UserType[]>([]);
  const [loadingLookups, setLoadingLookups] = useState(true);

  // Fetch governorates and user types on mount
  useEffect(() => {
    const fetchLookups = async () => {
      try {
        const [govs, types] = await Promise.all([
          governorateService.getGovernorates(),
          userTypeService.getUserTypes(),
        ]);
        setGovernorates(govs);
        setUserTypes(types);
      } catch (err) {
        console.error('Failed to load registration data:', err);
      } finally {
        setLoadingLookups(false);
      }
    };
    fetchLookups();
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.full_name = 'Full name is required';
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    if (!phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!isValidPhone(phone)) {
      newErrors.phone = 'Please enter a valid Egyptian phone number';
    }
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
      newErrors.password = 'Must contain 1 uppercase, 1 lowercase, and 1 digit';
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!typeId) newErrors.type_id = 'Please select an account type';
    if (!govId) newErrors.gov_id = 'Please select your governorate';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateForm()) return;

    try {
      await register({
        full_name: fullName.trim(),
        email,
        phone,
        password,
        type_id: typeId,
        gov_id: govId,
      });
      navigate('/verify-otp');
    } catch (err) {
      if (err instanceof ApiError && err.isValidationError && err.errors) {
        const fieldErrors: Record<string, string> = {};
        Object.entries(err.errors).forEach(([field, msgs]) => {
          fieldErrors[field] = msgs[0];
        });
        setErrors(fieldErrors);
      }
    }
  };

  // Password strength indicator
  const getPasswordStrength = () => {
    if (!password) return { level: 0, label: '', color: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    if (score <= 2) return { level: score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { level: score, label: 'Fair', color: 'bg-yellow-500' };
    if (score <= 4) return { level: score, label: 'Good', color: 'bg-blue-500' };
    return { level: score, label: 'Strong', color: 'bg-green-500' };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Animated Background */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-floatSlow" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal/20 rounded-full blur-3xl animate-floatSlow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full animate-rotateSlow" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12">
          <div className="max-w-lg text-center">
            <div className="mb-8 animate-fadeInUp">
              <Badge className="bg-white/10 text-white border border-white/20 backdrop-blur-sm mb-6">
                Join the B2B Revolution
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
                Grow Your <span className="text-primary">Business</span>
              </h1>
              <p className="text-gray-300 text-lg leading-relaxed">
                Register as a supplier or retailer and start connecting with verified businesses across Egypt.
              </p>
            </div>

            {/* Benefits */}
            <div className="space-y-4 animate-fadeInUp" style={{ animationDelay: '200ms' }}>
              {[
                'Access to thousands of verified B2B partners',
                'Secure payments and buyer protection',
                'Real-time order tracking and analytics',
                'Dedicated support for your business',
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm text-white">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Register Form */}
      <div className="w-full lg:w-[55%] flex items-start justify-center p-6 md:p-10 bg-background overflow-y-auto">
        <div className="w-full max-w-lg py-4">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-6 animate-fadeInDown">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="h-10 w-10 flex items-center justify-center">
                <img src={logo} alt="Torida Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-2xl font-bold text-dark">Torida</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-6 animate-fadeInUp">
            <h2 className="text-3xl font-bold text-text-primary mb-2">Create Account</h2>
            <p className="text-text-secondary">Join Torida and unlock your business potential</p>
          </div>

          {/* Registration Card */}
          <Card variant="default" className="p-6 md:p-8 shadow-xl animate-fadeInUp" style={{ animationDelay: '100ms' }}>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Server error */}
              {error && (
                <div className="p-4 rounded-xl bg-error-light text-error text-sm border border-error/20 animate-fadeInDown flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-error/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-error text-xs">!</span>
                  </div>
                  <span>{error}</span>
                </div>
              )}

              {/* Validation errors summary */}
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

              {/* Account Type Selection */}
              <div>
                <label className="block text-sm font-medium text-text-primary mb-3">Account Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {userTypes.length > 0 ? (
                    userTypes.map((type) => (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setTypeId(type.id)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center transition-all duration-200',
                          typeId === type.id
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-surface text-text-secondary hover:border-primary/30'
                        )}
                      >
                        <Building2 className="h-5 w-5 mx-auto mb-1.5" />
                        <span className="text-xs font-medium">{type.type_name}</span>
                      </button>
                    ))
                  ) : (
                    // Fallback while loading
                    ['Supplier', 'Retailer', 'Company'].map((name, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setTypeId(i + 1)}
                        className={cn(
                          'p-3 rounded-xl border-2 text-center transition-all duration-200',
                          typeId === i + 1
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-border bg-surface text-text-secondary hover:border-primary/30'
                        )}
                      >
                        <Building2 className="h-5 w-5 mx-auto mb-1.5" />
                        <span className="text-xs font-medium">{name}</span>
                      </button>
                    ))
                  )}
                </div>
                {errors.type_id && <p className="text-error text-xs mt-1">{errors.type_id}</p>}
              </div>

              {/* Full Name */}
              <div className={cn('transition-all duration-300', focusedField === 'fullName' && 'transform scale-[1.01]')}>
                <Input
                  id="register-full-name"
                  type="text"
                  label="Full Name"
                  placeholder="Enter your full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onFocus={() => setFocusedField('fullName')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.full_name}
                  leftIcon={<User className="h-4 w-4" />}
                />
              </div>

              {/* Email & Phone row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={cn('transition-all duration-300', focusedField === 'email' && 'transform scale-[1.01]')}>
                  <Input
                    id="register-email"
                    type="email"
                    label="Email Address"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    error={errors.email}
                    leftIcon={<Mail className="h-4 w-4" />}
                  />
                </div>
                <div className={cn('transition-all duration-300', focusedField === 'phone' && 'transform scale-[1.01]')}>
                  <Input
                    id="register-phone"
                    type="tel"
                    label="Phone Number"
                    placeholder="201234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    error={errors.phone}
                    leftIcon={<Phone className="h-4 w-4" />}
                  />
                </div>
              </div>

              {/* Governorate */}
              <div>
                <label htmlFor="register-governorate" className="block text-sm font-medium text-text-primary mb-1.5">
                  Governorate
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
                  <select
                    id="register-governorate"
                    value={govId}
                    onChange={(e) => setGovId(Number(e.target.value))}
                    disabled={loadingLookups}
                    className={cn(
                      'w-full pl-10 pr-4 py-3 rounded-xl border bg-surface text-text-primary text-sm',
                      'focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary',
                      'transition-all duration-200 appearance-none',
                      errors.gov_id ? 'border-error' : 'border-border'
                    )}
                  >
                    <option value={0}>
                      {loadingLookups ? 'Loading...' : 'Select your governorate'}
                    </option>
                    {governorates.map((gov) => (
                      <option key={gov.id} value={gov.id}>
                        {gov.gov_name}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.gov_id && <p className="text-error text-xs mt-1">{errors.gov_id}</p>}
              </div>

              {/* Password */}
              <div className={cn('transition-all duration-300', focusedField === 'password' && 'transform scale-[1.01]')}>
                <Input
                  id="register-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Min 8 chars, 1 upper, 1 lower, 1 digit"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.password}
                  leftIcon={<Lock className="h-4 w-4" />}
                  rightIcon={
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="focus:outline-none hover:text-primary transition-colors">
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  }
                />
                {/* Password strength bar */}
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1.5 mb-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            'h-1 flex-1 rounded-full transition-all duration-300',
                            i <= strength.level ? strength.color : 'bg-border'
                          )}
                        />
                      ))}
                    </div>
                    <p className="text-xs text-text-muted">Password strength: <span className="font-medium">{strength.label}</span></p>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div className={cn('transition-all duration-300', focusedField === 'confirmPassword' && 'transform scale-[1.01]')}>
                <Input
                  id="register-confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  error={errors.confirmPassword}
                  leftIcon={<Lock className="h-4 w-4" />}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2.5">
                <input type="checkbox" id="terms" required className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary/20" />
                <label htmlFor="terms" className="text-xs text-text-secondary leading-relaxed">
                  By creating an account, you agree to our{' '}
                  <Link to="/terms" className="text-primary hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">Privacy Policy</Link>.
                </label>
              </div>

              <Button
                type="submit"
                className="w-full relative overflow-hidden group"
                size="lg"
                isLoading={isLoading}
                rightIcon={<ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />}
              >
                Create Account
              </Button>
            </form>
          </Card>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-text-secondary animate-fadeInUp" style={{ animationDelay: '200ms' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4 hover:text-primary-dark transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

export default RegisterPage;
