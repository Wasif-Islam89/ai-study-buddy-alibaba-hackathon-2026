import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);

    // Clear live errors as user types (mirrors original login.js line 179)
    if (fieldErrors[field]) {
      setFieldErrors((prev) => ({ ...prev, [field]: '' }));
    }
    if (generalError) {
      setGeneralError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setGeneralError('');

    setIsSubmitting(true);
    const result = await login({ email, password });
    setIsSubmitting(false);

    if (!result.success) {
      if (result.field === 'general') {
        setGeneralError(result.error);
      } else if (result.field) {
        setFieldErrors({ [result.field]: result.error });
      } else {
        setGeneralError(result.error || 'Login failed. Please try again.');
      }
      return;
    }

    setIsSuccess(true);
    const destination = location.state?.from?.pathname || '/dashboard';
    setTimeout(() => {
      navigate(destination, { replace: true });
    }, 600);
  };

  const handleSocialClick = (provider) => {
    alert(`${provider} sign-in ke liye backend/OAuth integration abhi setup nahi hai.`);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors duration-200">
      <main className="w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-8 shadow-[var(--shadow-card)] animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <Logo variant="square" size="auth" showText={false} to="/" />
          </div>
          <h1 className="font-display font-bold text-2xl text-[var(--color-text-main)]">
            Welcome Back
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Continue your learning journey.
          </p>
        </header>

        {/* General Error Banner */}
        {generalError && (
          <div className="mb-4">
            <ErrorMessage message={generalError} />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Field */}
          <Input
            id="email"
            label="Email Address"
            type="email"
            required
            placeholder="student@university.edu"
            value={email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={fieldErrors.email}
            icon={Mail}
          />

          {/* Password Field with Label Row for Forgot Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="password"
                className="text-xs font-semibold text-[var(--color-text-main)]"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-xs font-medium text-[var(--primary)] hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              error={fieldErrors.password}
              icon={Lock}
              endIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="p-1 text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              }
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full mt-2"
            isLoading={isSubmitting}
            disabled={isSuccess}
            rightIcon={!isSuccess ? ArrowRight : null}
          >
            {isSuccess ? 'Signing In ✓' : 'Sign In'}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 border-t border-[var(--color-border)]" />
          <span className="px-3 text-xs font-medium text-[var(--color-text-subtle)] uppercase tracking-wider">
            or continue with
          </span>
          <div className="flex-1 border-t border-[var(--color-border)]" />
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => handleSocialClick('Google')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            <span>Google</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialClick('Apple')}
            className="flex items-center justify-center gap-2.5 py-2.5 px-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M16.1 11.23c-.02-2.85 2.33-4.22 2.44-4.29-1.32-1.93-3.38-2.2-4.1-2.24-1.76-.18-3.43 1.04-4.32 1.04-.9 0-2.28-1-3.73-.97-1.89.03-3.64 1.1-4.6 2.78-1.96 3.38-.5 8.38 1.4 11.13.93 1.34 2.02 2.85 3.47 2.8 1.4-.06 1.94-.9 3.63-.9 1.69 0 2.18.9 3.65.87 1.5-.03 2.44-1.38 3.37-2.74 1.07-1.57 1.51-3.09 1.53-3.17-.03-.02-2.73-1.04-2.74-4.31zM14.65 4.38c.78-.94 1.3-2.25 1.15-3.56-1.12.05-2.49.75-3.28 1.7-.71.85-1.33 2.18-1.16 3.47 1.25.1 2.51-.67 3.29-1.61z" />
            </svg>
            <span>Apple</span>
          </button>
        </div>

        {/* Footer Link */}
        <p className="text-center text-xs text-[var(--color-text-muted)]">
          Don't have an account?{' '}
          <Link
            to="/signup"
            className="font-semibold text-[var(--primary)] hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </main>
    </div>
  );
}

