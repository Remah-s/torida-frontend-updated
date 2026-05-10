import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle, RefreshCw } from 'lucide-react';
import { Button, Card, CardContent, Badge } from '@/components/ui';
import { authService } from '@/services/auth';

const VerifyOTPPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState('');

  const email = new URLSearchParams(location.search).get('email') || '';

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }

    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtp = [...otp];
    pastedData.split('').forEach((char, idx) => {
      if (idx < 6) newOtp[idx] = char;
    });
    setOtp(newOtp);
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await authService.verifyOtp(email, otpString);
      setIsSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to verify OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setCountdown(60);
    setCanResend(false);
    setOtp(['', '', '', '', '', '']);
    setError('');

    try {
      await authService.resendVerificationOtp(email);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || 'Failed to resend OTP. Please try again.');
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
            <h2 className="text-xl font-bold mb-2">Verification Successful!</h2>
            <p className="text-text-muted mb-6">
              Your account has been verified. Redirecting to login...
            </p>
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Back Link */}
        <Link to="/login" className="inline-flex items-center gap-2 text-text-muted hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Link>

        <Card>
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="h-14 w-14 rounded-full bg-primary-light mx-auto mb-4 flex items-center justify-center">
                <Mail className="h-7 w-7 text-primary" />
              </div>
              <h1 className="text-2xl font-bold mb-2">Verify Your Email</h1>
              <p className="text-text-muted text-sm mb-4">
                We've sent a 6-digit verification code to
              </p>
              <Badge variant="outline">{email}</Badge>
            </div>

            {/* OTP Input */}
            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3 text-center">
                  Enter verification code
                </label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      className={`w-12 h-14 text-center text-xl font-semibold rounded-lg border ${
                        error ? 'border-error' : 'border-border'
                      } focus:outline-none focus:ring-2 focus:ring-primary bg-surface-elevated`}
                    />
                  ))}
                </div>
                {error && (
                  <p className="text-error text-sm text-center mt-2">{error}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
                disabled={otp.join('').length !== 6}
              >
                Verify Code
              </Button>
            </form>

            {/* Resend */}
            <div className="mt-6 text-center">
              <p className="text-text-muted text-sm mb-2">
                Didn't receive the code?
              </p>
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  leftIcon={<RefreshCw className="h-4 w-4" />}
                >
                  Resend Code
                </Button>
              ) : (
                <p className="text-sm text-text-muted">
                  Resend in <span className="font-semibold text-primary">{countdown}s</span>
                </p>
              )}
            </div>

            {/* Help */}
            <div className="mt-6 pt-6 border-t border-border text-center">
              <p className="text-xs text-text-muted">
                Having trouble?{' '}
                <Link to="/contact" className="text-primary hover:underline">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyOTPPage;
