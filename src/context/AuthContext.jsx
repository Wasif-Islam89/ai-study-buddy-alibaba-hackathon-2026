import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  STORAGE_KEYS,
  getStoredUsers,
  saveStoredUsers,
  getCurrentUserEmail,
  setCurrentUserEmail,
  clearUserSession,
  getStoredProfile,
  saveStoredProfile,
  getStoredResetRequests,
  saveStoredResetRequests,
  isValidEmail,
  isStrongEnoughPassword,
  isValidFullName,
} from '../utils/authUtils';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentProfile, setCurrentProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session from LocalStorage on mount
  const syncSessionFromStorage = useCallback(() => {
    try {
      const email = getCurrentUserEmail();
      if (email) {
        const users = getStoredUsers();
        const matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
        const profile = getStoredProfile();

        if (matched) {
          setCurrentUser({
            email: matched.email,
            fullName: matched.fullName || (profile?.fullName) || 'Student',
          });
          setCurrentProfile(profile || {
            fullName: matched.fullName,
            email: matched.email,
            educationLevel: '',
            institution: '',
            gradeYear: '',
            bio: '',
          });
        } else if (profile && profile.email.toLowerCase() === email.toLowerCase()) {
          // If in profile but not users list (e.g. demo seed)
          setCurrentUser({
            email: profile.email,
            fullName: profile.fullName || 'Student',
          });
          setCurrentProfile(profile);
        } else {
          // Fallback if email stored but no record
          setCurrentUser({ email, fullName: 'Student' });
          setCurrentProfile(profile);
        }
      } else {
        setCurrentUser(null);
        setCurrentProfile(null);
      }
    } catch (err) {
      console.error('Error syncing auth session:', err);
      setCurrentUser(null);
      setCurrentProfile(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    syncSessionFromStorage();

    const handleStorageChange = (e) => {
      if (
        e.key === STORAGE_KEYS.CURRENT_USER ||
        e.key === STORAGE_KEYS.SESSION ||
        e.key === STORAGE_KEYS.PROFILE_DATA ||
        e.key === STORAGE_KEYS.USERS
      ) {
        syncSessionFromStorage();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [syncSessionFromStorage]);

  /**
   * Signup function preserving original Old-Version behavior
   */
  const signup = async ({ fullName, email, password, termsAgreed }) => {
    // 1. Validation
    if (!isValidFullName(fullName)) {
      return { success: false, error: 'Please enter your full name.', field: 'fullName' };
    }
    if (!isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address.', field: 'email' };
    }
    if (!isStrongEnoughPassword(password)) {
      return { success: false, error: 'Password must be at least 6 characters.', field: 'password' };
    }
    if (!termsAgreed) {
      return { success: false, error: 'You must agree to the Terms & Privacy Policy.', field: 'terms' };
    }

    const trimmedEmail = email.trim();
    const trimmedName = fullName.trim();

    // 2. Check if email already registered
    const users = getStoredUsers();
    const alreadyExists = users.some(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (alreadyExists) {
      return {
        success: false,
        error: 'An account with this email already exists.',
        field: 'email',
      };
    }

    // 3. Register user
    const newUser = {
      fullName: trimmedName,
      email: trimmedEmail,
      password: password,
    };
    users.push(newUser);
    saveStoredUsers(users);

    // 4. Set current user session
    setCurrentUserEmail(trimmedEmail);

    // 5. Seed profile data
    const initialProfile = {
      fullName: trimmedName,
      email: trimmedEmail,
      educationLevel: '',
      institution: '',
      gradeYear: '',
      bio: '',
    };
    saveStoredProfile(initialProfile);

    // 6. Update in-memory state
    setCurrentUser({ email: trimmedEmail, fullName: trimmedName });
    setCurrentProfile(initialProfile);

    return { success: true, user: newUser };
  };

  /**
   * Login function preserving original Old-Version lookup and profile sync
   */
  const login = async ({ email, password }) => {
    const trimmedEmail = String(email || '').trim();

    if (!isValidEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.', field: 'email' };
    }
    if (!password || password.length < 1) {
      return { success: false, error: 'Please enter your password.', field: 'password' };
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase() && u.password === password
    );

    if (!matchedUser) {
      const emailExists = users.some(
        (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
      );
      if (!emailExists) {
        return {
          success: false,
          error: 'No account found with this email. Please sign up first.',
          field: 'general',
        };
      } else {
        return {
          success: false,
          error: 'Incorrect password.',
          field: 'password',
        };
      }
    }

    // Set current user in storage
    setCurrentUserEmail(matchedUser.email);

    // Profile synchronization (from original login.js)
    let existingProfile = getStoredProfile();
    const profileBelongsToThisUser =
      existingProfile &&
      existingProfile.email &&
      existingProfile.email.toLowerCase() === matchedUser.email.toLowerCase();

    let resolvedProfile;
    if (!profileBelongsToThisUser) {
      resolvedProfile = {
        fullName: matchedUser.fullName,
        email: matchedUser.email,
        educationLevel: '',
        institution: '',
        gradeYear: '',
        bio: '',
      };
      saveStoredProfile(resolvedProfile);
    } else {
      resolvedProfile = existingProfile;
    }

    // Update in-memory state
    setCurrentUser({
      email: matchedUser.email,
      fullName: matchedUser.fullName || resolvedProfile.fullName,
    });
    setCurrentProfile(resolvedProfile);

    return { success: true, user: matchedUser };
  };

  /**
   * Logout function preserving exact original behavior
   */
  const logout = () => {
    clearUserSession();
    setCurrentUser(null);
    setCurrentProfile(null);
  };

  /**
   * Forgot password request simulation (15 min expiry)
   */
  const requestPasswordReset = async (email) => {
    const trimmedEmail = String(email || '').trim();
    if (!isValidEmail(trimmedEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    const users = getStoredUsers();
    const matchedUser = users.find(
      (u) => u.email.toLowerCase() === trimmedEmail.toLowerCase()
    );

    if (matchedUser) {
      const resetToken = Math.random().toString(36).slice(2) + Date.now().toString(36);
      const resetRequests = getStoredResetRequests();
      resetRequests[trimmedEmail.toLowerCase()] = {
        token: resetToken,
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      };
      saveStoredResetRequests(resetRequests);
    }

    // Always succeed to mirror standard secure & original UX
    return { success: true };
  };

  /**
   * Update profile and synchronize with storage & account type
   */
  const updateProfile = (updates) => {
    try {
      const activeAccount = localStorage.getItem('sb_active_account') || 'student';
      const targetKey = activeAccount === 'tutor' ? STORAGE_KEYS.PROFILE_TUTOR : STORAGE_KEYS.PROFILE_DATA;
      const existing = getStoredProfile(targetKey) || {};
      const merged = {
        ...existing,
        ...updates,
        email: updates.email || existing.email || currentUser?.email || '',
      };
      saveStoredProfile(merged, targetKey);

      // If updating student account and fullName is changed, sync in users array & currentUser
      if (activeAccount === 'student' && updates.fullName) {
        if (currentUser?.email) {
          const users = getStoredUsers();
          const idx = users.findIndex(
            (u) => u.email.toLowerCase() === currentUser.email.toLowerCase()
          );
          if (idx >= 0) {
            users[idx].fullName = updates.fullName;
            saveStoredUsers(users);
          }
        }
        setCurrentUser((prev) => (prev ? { ...prev, fullName: updates.fullName } : null));
      }

      setCurrentProfile(merged);
      window.dispatchEvent(new Event('storage'));
      return { success: true, profile: merged };
    } catch (err) {
      console.error('Failed to update profile:', err);
      return { success: false, error: err.message };
    }
  };

  const value = {
    user: currentUser,
    profile: currentProfile,
    isAuthenticated: Boolean(currentUser),
    isLoading,
    signup,
    login,
    logout,
    updateProfile,
    requestPasswordReset,
    refreshProfile: syncSessionFromStorage,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

