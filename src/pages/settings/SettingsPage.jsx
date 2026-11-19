import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import {
  User,
  Moon,
  Sun,
  Lock,
  Bell,
  CheckCircle2,
  Trash2,
  Upload,
  Save,
  Shield,
  Layers,
  Database,
  Download,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';
import { plannerService } from '../../services/plannerService';
import { quizService } from '../../services/quizService';
import { flashcardService } from '../../services/flashcardService';
import { summaryService } from '../../services/summaryService';
import { progressService } from '../../services/progressService';

const CATEGORIES = [
  { id: 'appearance', label: 'Appearance', icon: Sun },
  { id: 'account', label: 'Account Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security & Password', icon: Shield },
  { id: 'data', label: 'Data & Storage', icon: Database },
];

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const [activeCategory, setActiveCategory] = useState('appearance');

  // Profile Form State
  const [fullName, setFullName] = useState(profile?.fullName || user?.fullName || 'Student');
  const [institution, setInstitution] = useState(profile?.institution || 'Stanford University');
  const [bio, setBio] = useState(profile?.bio || '');
  const [photo, setPhoto] = useState(localStorage.getItem('sb_profile_photo') || null);
  const [activeAccount, setActiveAccount] = useState(
    localStorage.getItem('sb_active_account') || 'student'
  );

  // Security / Password State
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [passwordMsg, setPasswordMsg] = useState({ text: '', isError: false });

  // Notifications State (Persisted in LocalStorage)
  const [notifications, setNotifications] = useState(() => {
    try {
      const raw = localStorage.getItem('sb_notification_settings_v1');
      return raw ? JSON.parse(raw) : { emailDigest: true, quizReminders: true, streakAlerts: true };
    } catch {
      return { emailDigest: true, quizReminders: true, streakAlerts: true };
    }
  });

  // Toast
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.institution) setInstitution(profile.institution);
      if (profile.bio) setBio(profile.bio);
    }
  }, [profile]);

  // Photo handlers
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Photo must be smaller than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      setPhoto(result);
      localStorage.setItem('sb_profile_photo', result);
      window.dispatchEvent(new Event('storage'));
      showToast('Profile photo updated.');
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    localStorage.removeItem('sb_profile_photo');
    window.dispatchEvent(new Event('storage'));
    showToast('Profile photo removed.');
  };

  // Account role switcher
  const handleAccountSwitch = (type) => {
    const currentKey = activeAccount === 'tutor' ? 'sb_profile_data_tutor' : 'sb_profile_data';
    const currentData = {
      fullName: fullName.trim(),
      institution: institution.trim(),
      bio: bio.trim(),
    };
    localStorage.setItem(currentKey, JSON.stringify(currentData));

    setActiveAccount(type);
    localStorage.setItem('sb_active_account', type);

    const targetKey = type === 'tutor' ? 'sb_profile_data_tutor' : 'sb_profile_data';
    const raw = localStorage.getItem(targetKey);
    if (raw) {
      const parsed = JSON.parse(raw);
      setFullName(parsed.fullName || (type === 'tutor' ? 'Tutor Account' : 'Student'));
      setInstitution(parsed.institution || (type === 'tutor' ? 'ABC University' : 'Stanford University'));
      setBio(parsed.bio || '');
    } else if (type === 'tutor') {
      const tutorDefault = {
        fullName: 'Tutor Account',
        email: 'tutor@example.com',
        educationLevel: 'Postgraduate',
        institution: 'ABC University',
        bio: 'Tutor workspace profile.',
      };
      localStorage.setItem('sb_profile_data_tutor', JSON.stringify(tutorDefault));
      setFullName(tutorDefault.fullName);
      setInstitution(tutorDefault.institution);
      setBio(tutorDefault.bio);
    }

    window.dispatchEvent(new Event('storage'));
    showToast(`Switched to ${type === 'tutor' ? 'Tutor' : 'Student'} profile.`);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    const updated = {
      fullName: fullName.trim(),
      institution: institution.trim(),
      bio: bio.trim(),
    };
    updateProfile(updated);
    const targetKey = activeAccount === 'tutor' ? 'sb_profile_data_tutor' : 'sb_profile_data';
    localStorage.setItem(targetKey, JSON.stringify(updated));
    showToast('Profile information saved.');
  };

  const handleToggleNotification = (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    localStorage.setItem('sb_notification_settings_v1', JSON.stringify(updated));
    showToast('Notification preference saved.');
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!currentPw || !newPw || !confirmPw) {
      setPasswordMsg({ text: 'Please fill in all password fields.', isError: true });
      return;
    }
    if (newPw.length < 6) {
      setPasswordMsg({ text: 'New password must be at least 6 characters.', isError: true });
      return;
    }
    if (newPw !== confirmPw) {
      setPasswordMsg({ text: 'New passwords do not match.', isError: true });
      return;
    }

    try {
      const usersRaw = localStorage.getItem('studyBuddyUsers');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const userEmail = (user?.email || localStorage.getItem('studyBuddyCurrentUser') || '').trim();

      const foundUser = users.find((u) => u.email.toLowerCase() === userEmail.toLowerCase());
      const legacyPw = localStorage.getItem('sb_password') || 'password123';
      const expectedPw = foundUser ? foundUser.password : legacyPw;

      if (currentPw !== expectedPw) {
        setPasswordMsg({ text: 'Current password is incorrect.', isError: true });
        return;
      }

      if (foundUser) {
        foundUser.password = newPw;
        localStorage.setItem('studyBuddyUsers', JSON.stringify(users));
      } else {
        localStorage.setItem('sb_password', newPw);
      }
      localStorage.setItem(`sb_password_changed_at:${userEmail || 'demo'}`, String(Date.now()));

      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      setPasswordMsg({ text: 'Password successfully updated!', isError: false });
      showToast('Password changed successfully.');
    } catch {
      setPasswordMsg({ text: 'Could not change password.', isError: true });
    }
  };

  // Export Study Data as JSON
  const handleExportData = () => {
    try {
      const exportPayload = {
        exportDate: new Date().toISOString(),
        user: { email: user?.email, fullName: profile?.fullName || user?.fullName },
        planner: plannerService.loadData(),
        quizzes: quizService.getAllQuizzes(),
        flashcards: {
          decks: flashcardService.getAllDecks(),
          history: flashcardService.getStudyHistory(),
        },
        summaries: summaryService.getAllSummaries(),
      };

      const blob = new Blob([JSON.stringify(exportPayload, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-study-buddy-export-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Study data exported successfully.');
    } catch {
      showToast('Export failed. Please try again.');
    }
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset sample progress activity back to clean empty state?')) {
      progressService.clearDemoData();
      showToast('Sample progress data cleared.');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200 text-left">
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="pb-2 border-b border-[var(--color-border)]/50">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            Customize your learning workspace, theme appearance, account roles, and security
          </p>
        </div>

        {/* Settings Center Layout: Left Categories Nav + Right Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Category Navigation (4 cols) */}
          <div className="lg:col-span-3 space-y-2">
            {/* Mobile horizontal scroll / Desktop vertical stack */}
            <nav
              aria-label="Settings Categories"
              className="flex lg:flex-col overflow-x-auto pb-2 lg:pb-0 scrollbar-none gap-1.5 p-1 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs"
            >
              {CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                const isActive = activeCategory === cat.id;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setActiveCategory(cat.id)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer text-left ${
                      isActive
                        ? 'bg-[var(--primary)] text-white shadow-xs font-bold'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
                    }`}
                  >
                    <IconComp className="w-4 h-4 shrink-0" />
                    <span>{cat.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Category Content Area (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            {/* Category 1: Appearance */}
            {activeCategory === 'appearance' && (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
                <div className="pb-3 border-b border-[var(--color-border-subtle)]">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                    Theme & Interface Appearance
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Choose between light and dark modes to suit your study environment
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg">
                  <button
                    type="button"
                    onClick={() => {
                      if (isDark) toggleTheme();
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      !isDark
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] ring-2 ring-[var(--primary)]/30 font-bold'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] hover:border-[var(--primary)]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-amber-500" />
                      <div>
                        <span className="text-sm font-bold block">Light Theme</span>
                        <span className="text-[11px] text-[var(--color-text-muted)] block">
                          Clean white workspace
                        </span>
                      </div>
                    </div>
                    {!isDark && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (!isDark) toggleTheme();
                    }}
                    className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all cursor-pointer ${
                      isDark
                        ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] ring-2 ring-[var(--primary)]/30 font-bold'
                        : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] hover:border-[var(--primary)]/40'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Moon className="w-5 h-5 text-[var(--primary)]" />
                      <div>
                        <span className="text-sm font-bold block">Dark Theme</span>
                        <span className="text-[11px] text-[var(--color-text-muted)] block">
                          Low-light night study
                        </span>
                      </div>
                    </div>
                    {isDark && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                  </button>
                </div>
              </div>
            )}

            {/* Category 2: Account Profile */}
            {activeCategory === 'account' && (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
                <div className="pb-3 border-b border-[var(--color-border-subtle)]">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                    Account Profile & Workspaces
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Update your public learner identity and active role workspace
                  </p>
                </div>

                {/* Avatar Row */}
                <div className="flex items-center gap-4 pb-4 border-b border-[var(--color-border-subtle)]">
                  {photo ? (
                    <img
                      src={photo}
                      alt={fullName}
                      className="w-16 h-16 rounded-2xl object-cover border border-[var(--color-border)]"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] font-bold text-xl flex items-center justify-center">
                      {fullName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-[var(--color-text-main)] block">
                      Profile Avatar
                    </span>
                    <div className="flex items-center gap-2">
                      <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] cursor-pointer shadow-xs transition-colors">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                        />
                      </label>
                      {photo && (
                        <button
                          type="button"
                          onClick={handleRemovePhoto}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/30 text-rose-600 text-xs font-semibold cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Account Role Switcher */}
                <div className="space-y-2 pb-4 border-b border-[var(--color-border-subtle)]">
                  <span className="text-xs font-bold text-[var(--color-text-main)] block">
                    Active Account Workspace
                  </span>
                  <div className="grid grid-cols-2 gap-3 max-w-md">
                    <button
                      type="button"
                      onClick={() => handleAccountSwitch('student')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        activeAccount === 'student'
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      <span className="block font-bold">Student Workspace</span>
                      <span className="text-[10px] font-normal text-[var(--color-text-subtle)]">
                        Standard learner mode
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAccountSwitch('tutor')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        activeAccount === 'tutor'
                          ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)] ring-2 ring-[var(--primary)]/20'
                          : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      <span className="block font-bold">Tutor Workspace</span>
                      <span className="text-[10px] font-normal text-[var(--color-text-subtle)]">
                        Instructor review mode
                      </span>
                    </button>
                  </div>
                </div>

                {/* Profile Form */}
                <form onSubmit={handleSaveProfile} className="space-y-4 text-xs sm:text-sm">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-[var(--color-text-main)] mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--color-text-main)] mb-1">
                        Institution / University
                      </label>
                      <input
                        type="text"
                        value={institution}
                        onChange={(e) => setInstitution(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      Bio / Summary
                    </label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)] resize-none"
                    />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Profile Settings</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Category 3: Notifications */}
            {activeCategory === 'notifications' && (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
                <div className="pb-3 border-b border-[var(--color-border-subtle)]">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                    Notification Preferences
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Configure which study reminders and alerts you wish to receive
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      id: 'emailDigest',
                      title: 'Weekly Study Digest',
                      desc: 'Weekly summary of your completed hours, quiz accuracy, and streak status.',
                    },
                    {
                      id: 'quizReminders',
                      title: 'Practice Quiz Reminders',
                      desc: 'Timely reminders for recommended practice questions before exams.',
                    },
                    {
                      id: 'streakAlerts',
                      title: 'Daily Habit Streak Alerts',
                      desc: 'Encouraging notifications to maintain your daily study momentum.',
                    },
                  ].map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 gap-4"
                    >
                      <div>
                        <h4 className="text-sm font-bold text-[var(--color-text-main)]">{item.title}</h4>
                        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{item.desc}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleToggleNotification(item.id)}
                        className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer shrink-0 ${
                          notifications[item.id] ? 'bg-[var(--primary)]' : 'bg-slate-300 dark:bg-slate-700'
                        }`}
                      >
                        <span
                          className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${
                            notifications[item.id] ? 'left-6' : 'left-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category 4: Security & Password */}
            {activeCategory === 'security' && (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
                <div className="pb-3 border-b border-[var(--color-border-subtle)]">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                    Security & Password
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Update your account login password and authentication credentials
                  </p>
                </div>

                {passwordMsg.text && (
                  <div
                    className={`p-3.5 rounded-xl text-xs font-semibold ${
                      passwordMsg.isError
                        ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    }`}
                  >
                    {passwordMsg.text}
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-4 max-w-md text-xs sm:text-sm">
                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      Current Password
                    </label>
                    <input
                      type="password"
                      required
                      value={currentPw}
                      onChange={(e) => setCurrentPw(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      New Password (Min 6 characters)
                    </label>
                    <input
                      type="password"
                      required
                      value={newPw}
                      onChange={(e) => setNewPw(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPw}
                      onChange={(e) => setConfirmPw(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Update Password</span>
                  </button>
                </form>
              </div>
            )}

            {/* Category 5: Data & Storage */}
            {activeCategory === 'data' && (
              <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
                <div className="pb-3 border-b border-[var(--color-border-subtle)]">
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)]">
                    Data Management & Export
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Download backups of your study data or manage storage
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[var(--color-text-main)]">
                      Export Learning History
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                      Download your weekly timetable, quizzes, flashcards, and summaries as a structured JSON file.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleExportData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export JSON</span>
                  </button>
                </div>

                {/* Reset Sample Activity */}
                <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-amber-800 dark:text-amber-200">
                      Sample Activity Preview
                    </h3>
                    <p className="text-xs text-amber-700/80 dark:text-amber-300/80 mt-0.5">
                      Clear sample demo records from your analytics and reset to your actual recorded learning metrics.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetDemoData}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs transition-all shrink-0 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Sample Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
