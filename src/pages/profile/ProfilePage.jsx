import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { useAuth } from '../../hooks/useAuth';
import {
  User,
  Mail,
  School,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Edit3,
  X,
  Save,
  BookOpen,
  ArrowRight,
  Upload,
  Trash2,
  ShieldCheck,
  Settings as SettingsIcon,
  BarChart3,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();

  // Edit Mode state (Inline clean toggle)
  const [isEditing, setIsEditing] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState(profile?.fullName || user?.fullName || 'Student');
  const [institution, setInstitution] = useState(profile?.institution || 'Stanford University');
  const [educationLevel, setEducationLevel] = useState(profile?.educationLevel || 'Undergraduate');
  const [grade, setGrade] = useState(profile?.grade || 'Senior (Year 4)');
  const [bio, setBio] = useState(
    profile?.bio || 'Computer Science student focusing on algorithms, artificial intelligence, and software engineering.'
  );

  // Profile Photo and Account Role from LocalStorage
  const [photo, setPhoto] = useState(localStorage.getItem('sb_profile_photo') || null);
  const [activeAccount, setActiveAccount] = useState(
    localStorage.getItem('sb_active_account') || 'student'
  );
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (profile) {
      if (profile.fullName) setFullName(profile.fullName);
      if (profile.institution) setInstitution(profile.institution);
      if (profile.educationLevel) setEducationLevel(profile.educationLevel);
      if (profile.grade) setGrade(profile.grade);
      if (profile.bio) setBio(profile.bio);
    }
  }, [profile]);

  useEffect(() => {
    const handleStorage = (e) => {
      if (!e || e.key === 'sb_profile_photo' || e.key === 'sb_active_account') {
        setPhoto(localStorage.getItem('sb_profile_photo') || null);
        setActiveAccount(localStorage.getItem('sb_active_account') || 'student');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile({
      fullName: fullName.trim(),
      institution: institution.trim(),
      educationLevel,
      grade: grade.trim(),
      bio: bio.trim(),
    });
    setIsEditing(false);
    showToast('Profile information saved.');
  };

  const handleCancelEditing = () => {
    if (profile) {
      setFullName(profile.fullName || user?.fullName || 'Student');
      setInstitution(profile.institution || 'Stanford University');
      setEducationLevel(profile.educationLevel || 'Undergraduate');
      setGrade(profile.grade || 'Senior (Year 4)');
      setBio(profile.bio || '');
    }
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toast}</span>
          </div>
        )}

        {/* 1. Horizontal Profile Identity Banner */}
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)]">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            {/* Left: Avatar + Details */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar with Photo Upload trigger */}
              <div className="relative group shrink-0">
                {photo ? (
                  <img
                    src={photo}
                    alt={fullName}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-[var(--color-border)] shadow-xs"
                  />
                ) : (
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] font-black text-2xl sm:text-3xl flex items-center justify-center border-2 border-[var(--primary)]/30 shadow-xs">
                    {(profile?.fullName || user?.fullName || 'S').charAt(0).toUpperCase()}
                  </div>
                )}

                {/* Photo quick edit overlay */}
                <label
                  title="Upload profile photo"
                  className="absolute bottom-1 right-1 p-1.5 rounded-lg bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs hover:text-[var(--primary)] text-[var(--color-text-muted)] cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Text info: strictly left-aligned */}
              <div className="space-y-1.5 text-left min-w-0">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] tracking-tight truncate">
                    {profile?.fullName || user?.fullName || 'Student'}
                  </h1>
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] shrink-0">
                    {activeAccount === 'tutor' ? 'Tutor Workspace' : 'Student Workspace'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Verified</span>
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)] flex-wrap">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                    <span>{user?.email || 'student@university.edu'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <School className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                    <span>{profile?.institution || 'Stanford University'}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                    <span>{profile?.educationLevel || 'Undergraduate'}</span>
                  </span>
                </div>

                <p className="text-xs text-[var(--color-text-muted)] max-w-2xl line-clamp-2 pt-0.5">
                  {profile?.bio || 'Computer Science student focusing on algorithms, artificial intelligence, and software engineering.'}
                </p>
              </div>
            </div>

            {/* Right: Action Buttons */}
            <div className="flex items-center gap-2 shrink-0 self-start md:self-center">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Profile</span>
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCancelEditing}
                    className="px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveProfile}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Changes</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 2. Main Content Grid: Personal Info Form/Display (Left) + Account & Subjects (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          {/* Left Column (8 cols): Personal & Academic Information */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[var(--color-border-subtle)]">
                <div>
                  <h2 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
                    <User className="w-5 h-5 text-[var(--primary)]" />
                    <span>Personal & Academic Information</span>
                  </h2>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">
                    Your institutional affiliation, education level, and public learning profile
                  </p>
                </div>
              </div>

              {isEditing ? (
                /* Editable Form */
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
                        Email Address (Verified)
                      </label>
                      <input
                        type="email"
                        disabled
                        value={user?.email || 'student@university.edu'}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/50 text-[var(--color-text-subtle)] cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                    <div>
                      <label className="block font-bold text-[var(--color-text-main)] mb-1">
                        Education Level
                      </label>
                      <select
                        value={educationLevel}
                        onChange={(e) => setEducationLevel(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                      >
                        <option value="High School">High School</option>
                        <option value="Undergraduate">Undergraduate</option>
                        <option value="Graduate">Graduate</option>
                        <option value="Postgraduate">Postgraduate</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      Academic Year / Grade
                    </label>
                    <input
                      type="text"
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      placeholder="e.g. Senior (Year 4)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-[var(--color-text-main)] mb-1">
                      Bio & Study Objectives
                    </label>
                    <textarea
                      rows={3}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full p-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)] resize-none"
                    />
                  </div>

                  <div className="flex justify-end gap-2.5 pt-2">
                    <button
                      type="button"
                      onClick={handleCancelEditing}
                      className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Changes</span>
                    </button>
                  </div>
                </form>
              ) : (
                /* Read-Only Structured Display */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 space-y-1">
                      <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                        Full Name
                      </span>
                      <p className="font-bold text-sm text-[var(--color-text-main)]">
                        {profile?.fullName || user?.fullName || 'Student'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 space-y-1">
                      <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                        Email Address
                      </span>
                      <p className="font-bold text-sm text-[var(--color-text-main)] truncate">
                        {user?.email || 'student@university.edu'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 space-y-1">
                      <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                        Institution / University
                      </span>
                      <p className="font-bold text-sm text-[var(--color-text-main)]">
                        {profile?.institution || 'Stanford University'}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 space-y-1">
                      <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                        Education Level & Year
                      </span>
                      <p className="font-bold text-sm text-[var(--color-text-main)]">
                        {profile?.educationLevel || 'Undergraduate'} • {profile?.grade || 'Senior (Year 4)'}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40 space-y-1">
                    <span className="text-[11px] font-bold text-[var(--color-text-subtle)] uppercase tracking-wider block">
                      Bio & Study Objectives
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                      {profile?.bio || 'Computer Science student focusing on algorithms, artificial intelligence, and software engineering.'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Account & Security Summary */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-4">
              <h3 className="font-display font-bold text-base text-[var(--color-text-main)]">
                Account & Security Status
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40">
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">Account Type</span>
                  <span className="font-bold text-[var(--color-text-main)] mt-0.5 block">
                    {activeAccount === 'tutor' ? 'Tutor Workspace' : 'Student Workspace'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40">
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">Account Status</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Active & Synced</span>
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/40">
                  <span className="text-[11px] text-[var(--color-text-subtle)] block">Authentication</span>
                  <span className="font-bold text-[var(--color-text-main)] mt-0.5 block">
                    Password Protected
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (4 cols): Enrolled Subjects & Shortcuts */}
          <div className="lg:col-span-4 space-y-6">
            {/* Enrolled Subjects */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--color-border-subtle)]">
                <h3 className="font-display font-bold text-base text-[var(--color-text-main)] flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                  <span>Enrolled Subjects</span>
                </h3>
                <span className="text-xs text-[var(--color-text-muted)] font-semibold">
                  4 Active
                </span>
              </div>

              <div className="space-y-2 text-xs">
                {[
                  { name: 'Computer Science', topic: 'Algorithms & C' },
                  { name: 'Mathematics', topic: 'Calculus & Linear Algebra' },
                  { name: 'Physics', topic: 'Mechanics & Waves' },
                  { name: 'Biology', topic: 'Genetics & Cellular' },
                ].map((s, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-secondary)]/60 border border-[var(--color-border-subtle)]"
                  >
                    <div>
                      <h4 className="font-bold text-[var(--color-text-main)]">{s.name}</h4>
                      <p className="text-[11px] text-[var(--color-text-subtle)]">{s.topic}</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Account Quick Shortcuts */}
            <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-3">
              <h3 className="font-display font-bold text-sm text-[var(--color-text-main)]">
                Account Shortcuts
              </h3>

              <div className="space-y-2 text-xs">
                <button
                  type="button"
                  onClick={() => navigate('/settings')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] font-semibold transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <SettingsIcon className="w-4 h-4 text-[var(--primary)]" />
                    <span>Manage Settings & Appearance</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/progress')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] font-semibold transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[var(--primary)]" />
                    <span>View Learning Analytics</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/study-planner')}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[var(--color-surface-secondary)]/50 hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] font-semibold transition-colors cursor-pointer text-left"
                >
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[var(--primary)]" />
                    <span>Weekly Study Schedule</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--color-text-subtle)]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
