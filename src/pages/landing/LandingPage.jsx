import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import Logo from '../../components/common/Logo';
import logoSquare from '../../assets/logos/AI Study Buddy Square Logo.png';
import {
  Sparkles,
  ArrowRight,
  BookOpen,
  FileText,
  HelpCircle,
  Upload,
  Cpu,
  GraduationCap,
  Sun,
  Moon,
  Menu,
  X,
  CheckCircle2,
  Brain,
  Layers,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-base)] text-[var(--color-text-main)] transition-colors duration-200">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 w-full bg-[var(--color-surface-card)]/90 backdrop-blur-md border-b border-[var(--color-border)] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <Logo to="/" size="lg" />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--color-text-muted)]">
            <button
              type="button"
              onClick={() => scrollToSection('top')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('features')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Features
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('how-it-works')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              How It Works
            </button>
            <button
              type="button"
              onClick={() => scrollToSection('testimonials')}
              className="hover:text-[var(--primary)] transition-colors cursor-pointer"
            >
              Testimonials
            </button>
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>

            {isAuthenticated ? (
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] shadow-sm shadow-[var(--primary)]/25 transition-all cursor-pointer"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors px-3 py-2"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-[var(--primary)] text-white text-sm font-semibold hover:bg-[var(--primary-dark)] shadow-sm shadow-[var(--primary)]/25 transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)]"
            >
              {isDark ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle menu"
              className="p-2 rounded-xl text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface-card)] px-4 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="flex flex-col space-y-3 font-medium text-sm">
              <button
                type="button"
                onClick={() => scrollToSection('top')}
                className="text-left px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]"
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('features')}
                className="text-left px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]"
              >
                Features
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('how-it-works')}
                className="text-left px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]"
              >
                How It Works
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('testimonials')}
                className="text-left px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]"
              >
                Testimonials
              </button>
            </div>

            <div className="pt-2 border-t border-[var(--color-border)] flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full text-center py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full text-center py-2.5 rounded-xl border border-[var(--color-border)] text-[var(--color-text-main)] text-sm font-semibold"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full text-center py-2.5 rounded-xl bg-[var(--primary)] text-white text-sm font-semibold"
                  >
                    Get Started for Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="top" className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[var(--color-teal-bg)] text-[var(--color-teal)] text-xs sm:text-sm font-semibold">
                <Sparkles className="w-4 h-4 text-[var(--color-teal)]" />
                <span>Introducing Calm Tech Learning</span>
              </div>

              {/* Title with Hand-drawn Underline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[var(--color-text-main)] tracking-tight leading-[1.12]">
                Study Smarter,
                <br />
                <span className="relative inline-block text-[var(--primary)]">
                  Not Harder
                  <svg
                    className="absolute -bottom-2 left-0 w-full h-3 text-[var(--primary-light)] pointer-events-none"
                    viewBox="0 0 100 10"
                    preserveAspectRatio="none"
                    aria-hidden="true"
                  >
                    <path d="M0 5 Q 50 10 100 5" fill="none" stroke="currentColor" strokeWidth="4" />
                  </svg>
                </span>{' '}
                with AI
              </h1>

              {/* Description */}
              <p className="text-base sm:text-lg text-[var(--color-text-muted)] max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Upload your dense PDFs and textbooks. Experience instant summaries, adaptive quizzes,
                and intelligent notes designed to reduce cognitive load and keep you in the flow state.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white text-sm sm:text-base font-bold shadow-lg shadow-[var(--primary)]/25 transition-all transform hover:-translate-y-0.5"
                >
                  <span>{isAuthenticated ? 'Open Dashboard' : 'Get Started for Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => scrollToSection('features')}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-text-muted)] text-[var(--color-text-main)] text-sm sm:text-base font-semibold transition-all cursor-pointer"
                >
                  Explore Features
                </button>
              </div>

              {/* Quick Trust Stat */}
              <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-[var(--color-text-subtle)] font-medium">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> English-only calm interface
                </span>
              </div>
            </div>

            {/* Right Visual Column */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Glowing Background Blur */}
              <div className="absolute w-72 sm:w-96 h-72 sm:h-96 rounded-full bg-[var(--primary)]/10 blur-3xl pointer-events-none" />

              {/* Central Card with Logo */}
              <div className="relative z-10 w-full max-w-sm sm:max-w-md aspect-square rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xl p-8 flex flex-col items-center justify-center group">
                <img
                  src={logoSquare}
                  alt="AI Study Buddy Mark"
                  className="w-3/5 h-3/5 object-contain transition-transform duration-500 group-hover:scale-105"
                />
                <div className="mt-4 text-center">
                  <span className="font-display font-black text-xl text-[var(--color-text-main)] block">
                    AI Study Buddy
                  </span>
                  <span className="text-xs font-semibold text-[var(--primary)] uppercase tracking-wider">
                    Autonomous Learning System
                  </span>
                </div>

                {/* Floating Card 1: Biology 101 Mastery */}
                <div className="absolute -top-4 -right-4 sm:-right-6 p-4 rounded-2xl bg-[var(--color-surface-card)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-xl flex items-center gap-3 animate-bounce-slow">
                  <div className="relative w-12 h-12 flex items-center justify-center">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-emerald-500/20"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="text-emerald-500"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray="75, 100"
                        strokeLinecap="round"
                        strokeWidth="4"
                      />
                    </svg>
                    <span className="absolute text-[11px] font-black text-emerald-600 dark:text-emerald-400">
                      75%
                    </span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-[var(--color-text-main)]">Biology 101</h5>
                    <p className="text-[10px] text-[var(--color-text-muted)]">Mastery achieved</p>
                  </div>
                </div>

                {/* Floating Card 2: AI Note Generation */}
                <div className="absolute -bottom-4 -left-4 sm:-left-6 p-3.5 rounded-2xl bg-[var(--color-surface-card)]/95 backdrop-blur-md border border-[var(--color-border)] shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                    <Brain className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-xs font-bold text-[var(--color-text-main)]">AI Note Generation</h5>
                    <div className="w-24 h-1.5 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
                      <div className="w-3/4 h-full bg-[var(--primary)] rounded-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 bg-[var(--color-surface-secondary)]/50 border-y border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {/* Section Heading */}
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--color-text-main)]">
              Powerful Tools for Deep Focus
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)]">
              Everything you need to digest complex information quickly, organized in a distraction-free environment.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* 1. PDF Analysis (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
                  Instant PDF Analysis
                </h3>
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                  Upload any syllabus, research paper, or textbook chapter. Our AI extracts key concepts, formulas,
                  and definitions in seconds, formatting them into highly readable study guides.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border-subtle)]">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-xs font-semibold">
                  Supports up to 100 pages per upload
                </span>
                <Link
                  to={isAuthenticated ? '/materials' : '/signup'}
                  className="text-xs font-bold text-[var(--primary)] hover:underline inline-flex items-center gap-1"
                >
                  Try PDF Analyzer <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* 2. Intelligent Notes */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-teal-bg)] text-[var(--color-teal)] flex items-center justify-center">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
                  Intelligent Notes
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Transform sprawling lectures into structured, bulleted insights. Missing a concept? Just ask the AI to expand.
                </p>
              </div>

              {/* Skeleton Mockup */}
              <div className="p-4 rounded-2xl bg-[var(--color-surface-secondary)] space-y-2.5">
                <div className="w-3/4 h-2 rounded-full bg-[var(--primary)]/40" />
                <div className="w-full h-2 rounded-full bg-[var(--color-border)]" />
                <div className="w-5/6 h-2 rounded-full bg-[var(--color-border)]" />
              </div>
            </div>

            {/* 3. Adaptive Quizzes */}
            <div className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <HelpCircle className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
                  Adaptive Quizzes
                </h3>
                <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                  Test your knowledge with auto-generated multiple choice and short answer questions based exactly on your material.
                </p>
              </div>

              {/* Mock Quiz Answer */}
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300 font-medium flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Instant scoring with detailed rationale</span>
              </div>
            </div>

            {/* 4. Spaced Repetition & Study Planner (Spans 2 cols on lg) */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl sm:text-2xl text-[var(--color-text-main)]">
                  Spaced Repetition &amp; Intelligent Planning
                </h3>
                <p className="text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed max-w-xl">
                  Retain what you learn with active recall flashcards, progress analytics, and smart schedule optimization tailored to your exams.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 max-w-md p-4 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)]">
                <div className="space-y-1">
                  <strong className="text-sm font-bold text-[var(--color-text-main)] block">Active Recall</strong>
                  <span className="text-[11px] text-[var(--color-text-subtle)]">Flashcards &amp; Quizzes</span>
                </div>
                <div className="space-y-1">
                  <strong className="text-sm font-bold text-[var(--color-text-main)] block">Progress Velocity</strong>
                  <span className="text-[11px] text-[var(--color-text-subtle)]">Weekly Goal Tracking</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--color-text-main)]">
              How It Works
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)]">
              Three simple steps to supercharge your learning.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center mx-auto sm:mx-0">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
                1. Upload
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Drag &amp; drop your PDFs, notes, or syllabi directly into the platform to organize your course library.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[var(--color-teal-bg)] text-[var(--color-teal)] flex items-center justify-center mx-auto sm:mx-0">
                <Cpu className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
                2. Analyze
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Our AI parses chapters into structured key points, formulas, high-yield takeaways, and concept maps.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs space-y-4 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto sm:mx-0">
                <GraduationCap className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-xl text-[var(--color-text-main)]">
                3. Master
              </h3>
              <p className="text-sm text-[var(--color-text-muted)] leading-relaxed">
                Review with flashcards, adaptive practice quizzes, and interactive AI tutoring to achieve exam readiness.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="py-20 sm:py-28 bg-[var(--color-surface-secondary)]/50 border-t border-[var(--color-border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-[var(--color-text-main)]">
              Trusted by Students
            </h2>
            <p className="text-base sm:text-lg text-[var(--color-text-muted)]">
              See how AI Study Buddy is changing the way people learn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <p className="text-sm sm:text-base text-[var(--color-text-main)] italic leading-relaxed">
                "This platform completely changed how I study for my biology exams. The AI notes are spot on and save me hours of reading."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--primary)] text-white font-bold text-sm flex items-center justify-center">
                  S
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--color-text-main)]">Sarah J.</h5>
                  <p className="text-xs text-[var(--color-text-muted)]">Biology Major</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <p className="text-sm sm:text-base text-[var(--color-text-main)] italic leading-relaxed">
                "The intelligent study planner and automated flashcards have made reviewing complex subjects structured and stress-free."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[var(--color-teal)] text-white font-bold text-sm flex items-center justify-center">
                  A
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--color-text-main)]">Ali R.</h5>
                  <p className="text-xs text-[var(--color-text-muted)]">Engineering Student</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="p-8 rounded-3xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs flex flex-col justify-between space-y-6">
              <p className="text-sm sm:text-base text-[var(--color-text-main)] italic leading-relaxed">
                "The adaptive quizzes exposed my weak points before the actual midterms. I feel much more confident going into exams now."
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-bold text-sm flex items-center justify-center">
                  M
                </div>
                <div>
                  <h5 className="text-sm font-bold text-[var(--color-text-main)]">Maria C.</h5>
                  <p className="text-xs text-[var(--color-text-muted)]">Law Student</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section id="get-started" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-[var(--primary)] text-white p-8 sm:p-14 text-center shadow-2xl">
            {/* Background Glows */}
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />
            <div className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-white/10 blur-xl pointer-events-none" />

            <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
              <h2 className="font-display font-black text-3xl sm:text-4xl text-white">
                Ready to transform your study routine?
              </h2>
              <p className="text-sm sm:text-base text-slate-200 leading-relaxed">
                Join thousands of students saving hours every week with AI-powered study sessions.
              </p>
              <div className="pt-4">
                <Link
                  to={isAuthenticated ? '/dashboard' : '/signup'}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-[var(--primary)] hover:bg-[var(--primary-light)] font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <span>{isAuthenticated ? 'Open My Dashboard' : 'Get Started for Free'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface-card)] py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <Logo to="/" size="md" />
              <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-sm">
                Study Smarter, Not Harder. Empowering learners worldwide with AI-powered summaries,
                spaced-repetition flashcards, and personalized study schedules.
              </p>
            </div>

            {/* Product Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[var(--color-text-main)] uppercase tracking-wider">Product</h4>
              <ul className="space-y-2 text-[var(--color-text-muted)] font-medium">
                <li><Link to="/dashboard" className="hover:text-[var(--primary)] transition-colors">Dashboard</Link></li>
                <li><Link to="/materials" className="hover:text-[var(--primary)] transition-colors">My Materials</Link></li>
                <li><Link to="/study-planner" className="hover:text-[var(--primary)] transition-colors">Study Planner</Link></li>
                <li><Link to="/quiz-generator" className="hover:text-[var(--primary)] transition-colors">Quiz Generator</Link></li>
                <li><Link to="/flashcards" className="hover:text-[var(--primary)] transition-colors">Flashcards</Link></li>
              </ul>
            </div>

            {/* Support Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[var(--color-text-main)] uppercase tracking-wider">Support</h4>
              <ul className="space-y-2 text-[var(--color-text-muted)] font-medium">
                <li><Link to="/help" className="hover:text-[var(--primary)] transition-colors">Help Center &amp; FAQs</Link></li>
                <li><Link to="/settings" className="hover:text-[var(--primary)] transition-colors">Account Settings</Link></li>
                <li><span className="cursor-pointer hover:text-[var(--primary)] transition-colors">Privacy Policy</span></li>
                <li><span className="cursor-pointer hover:text-[var(--primary)] transition-colors">Terms of Service</span></li>
              </ul>
            </div>

            {/* Community Links */}
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-[var(--color-text-main)] uppercase tracking-wider">Community</h4>
              <ul className="space-y-2 text-[var(--color-text-muted)] font-medium">
                <li><span className="cursor-pointer hover:text-[var(--primary)] transition-colors">Student Blog</span></li>
                <li><span className="cursor-pointer hover:text-[var(--primary)] transition-colors">Discord Community</span></li>
                <li><span className="cursor-pointer hover:text-[var(--primary)] transition-colors">Twitter / X</span></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--color-text-subtle)]">
            <p>© 2026 AI Study Buddy. All rights reserved.</p>
            <p>Designed for focused learning and calm technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
