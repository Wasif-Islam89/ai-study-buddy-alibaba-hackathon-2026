/**
 * Authentication and LocalStorage Persistence Utilities
 * Uses exact original LocalStorage keys from Old-Version.
 */

export const STORAGE_KEYS = {
  USERS: 'studyBuddyUsers',
  CURRENT_USER: 'studyBuddyCurrentUser',
  SESSION: 'sb_session',
  RESET_REQUESTS: 'studyBuddyResetRequests',
  PROFILE_DATA: 'sb_profile_data',
  PROFILE_TUTOR: 'sb_profile_data_tutor',
  ACTIVE_ACCOUNT: 'sb_active_account',
  PROFILE_PHOTO: 'sb_profile_photo',
  THEME: 'sb_theme',
};

// --- Validation Helpers ---

export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || '').trim());
}

export function isStrongEnoughPassword(pwd) {
  return typeof pwd === 'string' && pwd.length >= 6;
}

export function isValidFullName(name) {
  return typeof name === 'string' && name.trim().length >= 2;
}

// --- Storage Access Helpers ---

export function getStoredUsers() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to read users from localStorage', err);
    return [];
  }
}

export function saveStoredUsers(users) {
  try {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    return true;
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
    return false;
  }
}

export function getCurrentUserEmail() {
  try {
    return localStorage.getItem(STORAGE_KEYS.CURRENT_USER) || null;
  } catch {
    return null;
  }
}

export function setCurrentUserEmail(email) {
  try {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, email);
    localStorage.setItem(STORAGE_KEYS.SESSION, 'active');
  } catch (err) {
    console.error('Failed to set current user email', err);
  }
}

export function clearUserSession() {
  try {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    localStorage.removeItem(STORAGE_KEYS.SESSION);
  } catch (err) {
    console.error('Failed to clear session', err);
  }
}

export function getStoredProfile(key = STORAGE_KEYS.PROFILE_DATA) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveStoredProfile(profile, key = STORAGE_KEYS.PROFILE_DATA) {
  try {
    localStorage.setItem(key, JSON.stringify(profile));
    return true;
  } catch (err) {
    console.error('Failed to save profile', err);
    return false;
  }
}

export function getStoredResetRequests() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESET_REQUESTS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveStoredResetRequests(requests) {
  try {
    localStorage.setItem(STORAGE_KEYS.RESET_REQUESTS, JSON.stringify(requests));
  } catch (err) {
    console.error('Failed to save reset requests', err);
  }
}

