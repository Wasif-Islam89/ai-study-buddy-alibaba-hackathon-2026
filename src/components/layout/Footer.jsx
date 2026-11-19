import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../common/Logo';
import { Send, CheckCircle2 } from 'lucide-react';

export default function Footer({ className = '' }) {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    try {
      const existing = JSON.parse(localStorage.getItem('sb_subscribers') || '[]');
      if (!existing.includes(email.trim())) {
        existing.push(email.trim());
        localStorage.setItem('sb_subscribers', JSON.stringify(existing));
      }
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 4000);
    } catch (err) {
      console.warn('Subscription error', err);
    }
  };

  return (
    <footer className={`border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] text-[var(--color-text-muted)] text-sm mt-auto ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <Logo to="/dashboard" size="md" />
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm leading-relaxed">
              Study smarter, not harder. AI-powered summaries, smart quizzes, flashcards, and timetable optimization tailored to your learning pace.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--color-text-main)]">
              Learning Tools
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link to="/materials" className="hover:text-[var(--primary)] transition-colors">
                  Upload Materials
                </Link>
              </li>
              <li>
                <Link to="/summaries" className="hover:text-[var(--primary)] transition-colors">
                  AI Summaries
                </Link>
              </li>
              <li>
                <Link to="/flashcards" className="hover:text-[var(--primary)] transition-colors">
                  Smart Flashcards
                </Link>
              </li>
              <li>
                <Link to="/quizzes" className="hover:text-[var(--primary)] transition-colors">
                  Quiz Generator
                </Link>
              </li>
              <li>
                <Link to="/planner" className="hover:text-[var(--primary)] transition-colors">
                  Weekly Planner
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Form */}
          <div className="space-y-2.5">
            <h4 className="font-display font-semibold text-xs tracking-wider uppercase text-[var(--color-text-main)]">
              Stay in the Loop
            </h4>
            <p className="text-xs text-[var(--color-text-muted)]">
              Get the latest study tips, AI tools, and product updates.
            </p>
            {isSubscribed ? (
              <div className="flex items-center gap-1.5 text-emerald-600 text-xs font-semibold py-2">
                <CheckCircle2 className="w-4 h-4" /> Subscribed successfully!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  required
                  className="w-full text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="px-3 py-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] transition-colors cursor-pointer shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-subtle)]">
          <p>© {new Date().getFullYear()} AI Study Buddy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/help" className="hover:text-[var(--color-text-main)] transition-colors">
              Help Center
            </Link>
            <Link to="/settings" className="hover:text-[var(--color-text-main)] transition-colors">
              Privacy & Settings
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

