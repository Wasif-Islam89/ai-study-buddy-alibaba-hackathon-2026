import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../../components/common/Logo';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const { requestPasswordReset } = useAuth();

  const handleInputChange = (val) => {
    setEmail(val);
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    setIsSubmitting(true);
    const result = await requestPasswordReset(email);
    setIsSubmitting(false);

    if (!result.success) {
      setError(result.error || 'Please enter a valid email address.');
      return;
    }

    setSubmittedEmail(email);
    setIsSuccess(true);
  };

  const handleSendAgain = () => {
    setIsSuccess(false);
    setEmail('');
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors duration-200">
      <main className="w-full max-w-[440px] rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-8 shadow-[var(--shadow-card)] animate-in fade-in zoom-in-95 duration-200">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="mb-4">
            <Logo variant="square" size="auth" showText={false} to="/" />
          </div>

          {!isSuccess ? (
            <>
              <h1 className="font-display font-bold text-2xl text-[var(--color-text-main)]">
                Forgot Password?
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-1 max-w-xs">
                Enter your email address and we'll send you a link to reset your password.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-3">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h1 className="font-display font-bold text-2xl text-[var(--color-text-main)]">
                Check Your Email
              </h1>
              <p className="text-sm text-[var(--color-text-muted)] mt-2 leading-relaxed">
                If an account exists for <strong className="text-[var(--color-text-main)]">{submittedEmail}</strong>, we've sent a link to reset your password. It may take a minute to arrive.
              </p>
            </>
          )}
        </div>

        {error && (
          <div className="mb-4">
            <ErrorMessage message={error} />
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email Address"
              type="email"
              required
              placeholder="student@university.edu"
              value={email}
              onChange={(e) => handleInputChange(e.target.value)}
              icon={Mail}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-2"
              isLoading={isSubmitting}
              rightIcon={Send}
            >
              Send Reset Link
            </Button>
          </form>
        ) : (
          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={handleSendAgain}
              className="w-full"
            >
              Send Again
            </Button>
          </div>
        )}

        {/* Back to Login Link */}
        <div className="mt-6 pt-5 border-t border-[var(--color-border-subtle)] flex justify-center">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

