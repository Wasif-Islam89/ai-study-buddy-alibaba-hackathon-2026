import React, { useState, useEffect, useRef } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  Timer,
  Bot,
  FolderOpen,
  BookOpen,
  FileText,
  HelpCircle,
  Layers,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import Logo from '../common/Logo';
import { useAuth } from '../../hooks/useAuth';

// Logical Navigation Groups
const NAV_GROUPS = [
  {
    title: 'Core Learning',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, aliases: ['/'] },
      { label: 'Study Planner', path: '/study-planner', icon: Calendar, aliases: ['/planner', '/plan-ai-optimization'] },
      { label: 'Progress & Stats', path: '/progress', icon: BarChart3, aliases: [] },
      { label: 'Exam Prep', path: '/exams', icon: Timer, aliases: ['/exam'] },
    ],
  },
  {
    title: 'Study Tools',
    items: [
      { label: 'AI Assistant', path: '/assistant', icon: Bot, aliases: ['/ai-assistant'] },
      { label: 'My Materials', path: '/materials', icon: FolderOpen, aliases: ['/materials/structure', '/structure'] },
      { label: 'Study Notes', path: '/notes', icon: BookOpen, aliases: ['/materials/notes'] },
      { label: 'AI Summaries', path: '/summaries', icon: FileText, aliases: ['/summary'] },
      { label: 'Quiz Generator', path: '/quiz-generator', icon: HelpCircle, aliases: ['/quizzes'] },
      { label: 'Flashcards', path: '/flashcards', icon: Layers, aliases: ['/flashcard'] },
    ],
  },
];

export default function Sidebar({
  isOpen = false,
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) {
  const { logout, user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };
    if (isUserMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isUserMenuOpen]);

  // Lazy profile details from LocalStorage
  const [profileName, setProfileName] = useState(() => {
    try {
      const raw = localStorage.getItem('sb_profile_data');
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed?.fullName) return parsed.fullName;
      }
    } catch (e) {
      console.warn('Sidebar profile read error', e);
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
      console.warn('Sidebar reload error', e);
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to check if item is currently active (including route aliases)
  const isItemActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.aliases && item.aliases.includes(location.pathname)) return true;
    return false;
  };

  // Render navigation item
  const renderNavItem = (item, isCollapsedMode) => {
    const Icon = item.icon;
    const active = isItemActive(item);

    return (
      <div key={item.path} className="relative group">
        <NavLink
          to={item.path}
          onClick={() => onClose?.()}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs sm:text-sm transition-all duration-200 select-none ${
            isCollapsedMode ? 'justify-center px-0 w-11 h-11 mx-auto' : ''
          } ${
            active
              ? `bg-[var(--color-navy)] text-white font-semibold shadow-xs ${
                  isCollapsedMode ? 'ring-2 ring-[var(--color-teal)]' : 'border-l-4 border-[var(--color-teal)] pl-2.5'
                }`
              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
          }`}
        >
          <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-[var(--color-teal)]' : ''}`} />
          {!isCollapsedMode && <span className="truncate">{item.label}</span>}
        </NavLink>

        {/* Tooltip in collapsed mode */}
        {isCollapsedMode && (
          <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-slate-800 text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 transform -translate-x-1 group-hover:translate-x-0">
            {item.label}
          </div>
        )}
      </div>
    );
  };

  const renderSidebarContent = (isCollapsedMode = false, isMobile = false) => (
    <div className="flex flex-col h-full w-full justify-between">
      {/* Brand & Collapse Header */}
      <div>
        <div
          className={`flex items-center px-4 py-4 border-b border-[var(--color-border-subtle)] ${
            isCollapsedMode ? 'justify-center' : 'justify-between'
          }`}
        >
          {isCollapsedMode ? (
            <div className="relative group">
              <Logo to="/dashboard" size="sm" variant="square" showText={false} />
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-semibold whitespace-nowrap shadow-xl z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                AI Study Buddy
              </div>
            </div>
          ) : (
            <div className="min-w-0 flex-1 overflow-hidden pr-2 flex items-center">
              <Logo to="/dashboard" size="md" variant="horizontal" />
            </div>
          )}

          {/* Mobile Close Button */}
          {isMobile && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation menu"
              className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Grouped Navigation */}
        <nav className="p-3 space-y-4 overflow-y-auto max-h-[calc(100vh-220px)]">
          {NAV_GROUPS.map((group, groupIdx) => (
            <div key={group.title} className="space-y-1">
              {!isCollapsedMode && (
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)] mb-1.5">
                  {group.title}
                </p>
              )}
              {isCollapsedMode && groupIdx > 0 && (
                <div className="border-t border-[var(--color-border-subtle)] my-2 w-8 mx-auto" />
              )}
              <div className="space-y-1">
                {group.items.map((item) => renderNavItem(item, isCollapsedMode))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Footer: User Profile & Quick Logout */}
      <div
        className={`p-3 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] ${
          isCollapsedMode ? 'flex flex-col items-center' : ''
        }`}
      >
        {/* User Profile Card & Menu */}
        <div className="relative w-full" ref={userMenuRef}>
          {!isCollapsedMode ? (
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              aria-label="User account menu"
              className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-[var(--color-surface-secondary)] transition-colors select-none text-left cursor-pointer"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="w-8 h-8 rounded-full object-cover shrink-0 border border-[var(--color-border)]"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-teal-bg)] text-[var(--color-teal)] font-bold text-xs shrink-0">
                    {profileName.charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-[var(--color-text-main)] truncate">
                    {profileName}
                  </p>
                  <p className="text-[11px] text-[var(--color-text-muted)] truncate">
                    Student Account
                  </p>
                </div>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-[var(--color-text-subtle)] shrink-0 transition-transform ${
                  isUserMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>
          ) : (
            <div className="flex justify-center group relative">
              <button
                type="button"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                aria-label="User account menu"
                className="p-1 rounded-full hover:ring-2 hover:ring-[var(--primary)]/30 transition-all cursor-pointer"
              >
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt={profileName}
                    className="w-8 h-8 rounded-full object-cover border border-[var(--color-border)]"
                  />
                ) : (
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--color-teal-bg)] text-[var(--color-teal)] font-bold text-xs">
                    {profileName.charAt(0).toUpperCase()}
                  </div>
                )}
              </button>
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 rounded-md bg-slate-900 text-white text-xs font-medium whitespace-nowrap shadow-lg z-50 pointer-events-none opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {profileName}
              </div>
            </div>
          )}

          {/* User Popover Menu - Displays ONLY Logout */}
          {isUserMenuOpen && (
            <div
              className={`absolute bottom-full mb-2 p-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-[var(--shadow-dropdown)] z-50 text-xs animate-in fade-in duration-150 ${
                isCollapsedMode ? 'left-0 w-32' : 'left-0 right-0'
              }`}
            >
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-[var(--color-error)] hover:bg-[var(--color-error-bg)] transition-colors cursor-pointer text-left font-semibold text-xs"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span>Log Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar with Collapsible Width */}
      <aside
        className={`hidden md:flex flex-col shrink-0 border-r border-[var(--color-sidebar-border)] bg-[var(--color-sidebar-bg)] h-screen sticky top-0 z-30 transition-[width] duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {renderSidebarContent(isCollapsed, false)}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          aria-hidden="true"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Mobile Drawer Panel (Always expanded in drawer mode) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[var(--color-sidebar-bg)] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {renderSidebarContent(false, true)}
      </div>
    </>
  );
}
