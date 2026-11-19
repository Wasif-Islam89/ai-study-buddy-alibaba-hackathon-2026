import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Bell,
  Moon,
  Sun,
  Check,
  User,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import Dropdown from '../ui/Dropdown';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../hooks/useAuth';

// Default page titles and subtitles based on active route
const ROUTE_INFO = {
  '/dashboard': {
    title: 'Dashboard',
    subtitle: '',
  },
  '/assistant': {
    title: 'AI Study Assistant',
    subtitle: 'Ask questions, clarify concepts, and get instant guidance',
  },
  '/ai-assistant': {
    title: 'AI Study Assistant',
    subtitle: 'Ask questions, clarify concepts, and get instant guidance',
  },
  '/materials': {
    title: 'My Materials',
    subtitle: 'Upload and organize course documents and textbooks',
  },
  '/structure': {
    title: 'Document Structure',
    subtitle: 'Extracted topics, outlines, and chapter summaries',
  },
  '/materials/structure': {
    title: 'Document Structure',
    subtitle: 'Extracted topics, outlines, and chapter summaries',
  },
  '/notes': {
    title: 'Study Notes',
    subtitle: 'Comprehensive notes generated from your study materials',
  },
  '/materials/notes': {
    title: 'Study Notes',
    subtitle: 'Comprehensive notes generated from your study materials',
  },
  '/summaries': {
    title: 'AI Summaries',
    subtitle: 'Generate concise summaries and key takeaways',
  },
  '/summary': {
    title: 'AI Summaries',
    subtitle: 'Generate concise summaries and key takeaways',
  },
  '/quiz-generator': {
    title: 'Quiz Generator',
    subtitle: 'Create personalized practice quizzes and test your understanding.',
  },
  '/quizzes': {
    title: 'Quiz Generator',
    subtitle: 'Create personalized practice quizzes and test your understanding.',
  },
  '/flashcards': {
    title: 'Flashcards',
    subtitle: 'Build knowledge through active recall and spaced repetition.',
  },
  '/flashcard': {
    title: 'Flashcards',
    subtitle: 'Build knowledge through active recall and spaced repetition.',
  },
  '/study-planner': {
    title: 'Study Planner',
    subtitle: 'Manage your weekly study timetable and session goals',
  },
  '/planner': {
    title: 'Study Planner',
    subtitle: 'Manage your weekly study timetable and session goals',
  },
  '/plan-ai-optimization': {
    title: 'Schedule Optimizer',
    subtitle: 'AI-assisted schedule adjustments and workload balancing',
  },
  '/planner/optimization': {
    title: 'Schedule Optimizer',
    subtitle: 'AI-assisted schedule adjustments and workload balancing',
  },
  '/progress': {
    title: 'Progress & Analytics',
    subtitle: 'Centralized study metrics, quiz scores, and milestones',
  },
  '/exam': {
    title: 'Exam Preparation',
    subtitle: 'Countdowns, study readiness, and revision milestones',
  },
  '/exams': {
    title: 'Exam Preparation',
    subtitle: 'Countdowns, study readiness, and revision milestones',
  },
  '/profile': {
    title: 'Student Profile',
    subtitle: 'Manage your academic details and personal information',
  },
  '/settings': {
    title: 'Settings',
    subtitle: 'Preferences, notifications, and application settings',
  },
  '/help': {
    title: 'Help & Support',
    subtitle: 'Guides, student FAQs, and platform assistance',
  },
};

export default function Navbar({
  onMenuToggle,
  isSidebarCollapsed = false,
  onToggleSidebarCollapse,
  title,
  subtitle,
}) {
  const { isDark, toggleTheme } = useTheme();
  const { logout, user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Resolve page title and subtitle from route if not explicitly provided
  const currentRouteInfo = ROUTE_INFO[location.pathname] || {
    title: 'Study Buddy',
    subtitle: 'AI-Powered Learning Platform',
  };

  const displayTitle = title || currentRouteInfo.title;
  const displaySubtitle = subtitle || currentRouteInfo.subtitle;

  // Profile data
  const [profileName, setProfileName] = useState(() => {
    try {
      const raw = localStorage.getItem('sb_profile_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.fullName) return parsed.fullName;
      }
    } catch (e) {
      console.warn('Navbar profile read error', e);
    }
    return profile?.fullName || user?.fullName || 'Student';
  });

  const [profilePhoto, setProfilePhoto] = useState(() => {
    try {
      return localStorage.getItem('sb_profile_photo') || null;
    } catch {
      return null;
    }
  });

  const [unreadNotifications, setUnreadNotifications] = useState([
    { id: '1', title: 'Calculus exam milestone approaching', time: '1h ago', unread: true },
    { id: '2', title: 'Daily study goal streak active', time: 'Today', unread: true },
    { id: '3', title: 'Pomodoro focus session completed', time: 'Yesterday', unread: false },
  ]);

  const loadProfile = () => {
    try {
      const raw = localStorage.getItem('sb_profile_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.fullName) setProfileName(parsed.fullName);
      }
      const photo = localStorage.getItem('sb_profile_photo');
      setProfilePhoto(photo || null);
    } catch (e) {
      console.warn('Navbar profile reload error', e);
    }
  };

  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'sb_profile_data' || e.key === 'sb_profile_photo') {
        loadProfile();
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const unreadCount = unreadNotifications.filter((n) => n.unread).length;

  const markAllRead = () => {
    setUnreadNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-20 w-full border-b border-[var(--color-border)] bg-[var(--color-header-bg)] backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16 gap-4">
        {/* Left Side: Mobile Menu Toggle, Desktop Collapse Toggle & Page Heading */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Mobile Drawer Button */}
          <button
            type="button"
            onClick={onMenuToggle}
            aria-label="Open mobile menu"
            className="md:hidden p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Desktop Sidebar Collapse / Expand Toggle */}
          <button
            type="button"
            onClick={onToggleSidebarCollapse}
            aria-label={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden md:flex p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] cursor-pointer transition-colors"
          >
            {isSidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-[var(--color-text-muted)] hover:text-[var(--primary)]" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-[var(--color-text-muted)] hover:text-[var(--primary)]" />
            )}
          </button>

          {/* Clean Page Title (Single concise title, eliminated duplicate navbar subtitle) */}
          <div className="min-w-0">
            <h1 className="font-display font-bold text-base sm:text-lg text-[var(--color-navy)] dark:text-[var(--color-text-main)] truncate leading-tight">
              {displayTitle}
            </h1>
          </div>
        </div>

        {/* Right Side: Theme Switcher, Notifications, Profile Menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Dark / Light Theme Quick Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle color theme"
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            {isDark ? (
              <Moon className="w-5 h-5 text-[var(--primary)] transition-transform duration-200 hover:rotate-12" />
            ) : (
              <Sun className="w-5 h-5 text-[var(--color-amber)] transition-transform duration-200 hover:rotate-45" />
            )}
          </button>

          {/* Notifications Dropdown */}
          <Dropdown
            align="right"
            panelClassName="w-72 sm:w-80 p-0 overflow-hidden"
            trigger={
              <button
                type="button"
                aria-label="Open notifications"
                title="Notifications"
                className="relative p-2 rounded-xl text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-[var(--primary)] text-[10px] font-bold text-white shadow-xs ring-2 ring-[var(--color-header-bg)]">
                    {unreadCount}
                  </span>
                )}
              </button>
            }
          >
            {() => (
              <div className="w-full">
                <div className="flex items-center justify-between px-3.5 py-2.5 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-card)]">
                  <span className="font-display font-semibold text-xs text-[var(--color-text-main)]">
                    Notifications
                  </span>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllRead}
                      className="text-[11px] font-medium text-[var(--primary)] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto divide-y divide-[var(--color-border-subtle)]">
                  {unreadNotifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3 text-xs flex items-start gap-2.5 transition-colors ${
                        notif.unread
                          ? 'bg-[var(--primary-light)]/20 text-[var(--color-text-main)]'
                          : 'text-[var(--color-text-muted)]'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[var(--color-text-main)] truncate">
                          {notif.title}
                        </p>
                        <span className="text-[10px] text-[var(--color-text-subtle)] mt-0.5 block">
                          {notif.time}
                        </span>
                      </div>
                      {notif.unread && (
                        <span className="w-2 h-2 rounded-full bg-[var(--primary)] shrink-0 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Dropdown>

          {/* User Profile Avatar Dropdown */}
          <Dropdown
            align="right"
            panelClassName="w-52"
            trigger={
              <button
                type="button"
                aria-label="User account menu"
                title={`${profileName} (Student)`}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-[var(--primary)]/30 transition-all cursor-pointer"
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-teal-bg)] text-[var(--color-teal)] font-bold text-xs shrink-0">
                    {profileName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
            }
          >
            {() => (
              <div className="p-1.5 text-xs w-52">
                <div className="px-3 py-2 border-b border-[var(--color-border-subtle)] mb-1">
                  <p className="font-bold text-[var(--color-text-main)] truncate">{profileName}</p>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate">Student Account</p>
                </div>
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/settings"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>Settings</span>
                </Link>
                <Link
                  to="/help"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                  <span>Help & Support</span>
                </Link>
                <div className="my-1 border-t border-[var(--color-border-subtle)]" />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 font-medium transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </Dropdown>
        </div>
      </div>
    </header>
  );
}
