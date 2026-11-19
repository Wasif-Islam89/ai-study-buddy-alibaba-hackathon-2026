/**
 * progressService.js
 * Data layer and metrics calculation for Progress Analytics.
 * Preserves exact original LocalStorage keys from Old-Version:
 *   - sb_progress_subjects_v1
 *   - sb_progress_sessions_v1
 *   - sb_progress_quizzes_v1
 *   - sb_progress_topics_v1
 *   - sb_progress_flashcards_v1
 *
 * Implements non-destructive fallback migration for unversioned keys
 * and adheres to strict user requirement: genuine empty states with NO
 * fabricated historical progress presented as real user activity.
 */

export const STORAGE_KEYS_PROGRESS = {
  subjects: 'sb_progress_subjects_v1',
  sessions: 'sb_progress_sessions_v1',
  quizzes: 'sb_progress_quizzes_v1',
  topics: 'sb_progress_topics_v1',
  flashcards: 'sb_progress_flashcards_v1',
  isDemo: 'sb_progress_is_demo_v1',
};

export const DEFAULT_SUBJECTS = [
  { id: 'cs', name: 'Computer Science', totalTopics: 10, weight: 0.35, quizBias: 8 },
  { id: 'math', name: 'Mathematics', totalTopics: 16, weight: 0.30, quizBias: 4 },
  { id: 'physics', name: 'Physics', totalTopics: 14, weight: 0.20, quizBias: 0 },
  { id: 'biology', name: 'Biology', totalTopics: 14, weight: 0.15, quizBias: -12 },
];

export const TOPIC_POOL = {
  cs: ['Arrays', 'Recursion', 'Linked Lists', 'Sorting Algorithms', 'Big-O Notation', 'Trees', 'Graphs', 'Dynamic Programming', 'Hash Maps', 'OOP Basics'],
  math: ['Derivatives', 'Integrals', 'Linear Equations', 'Matrices', 'Probability', 'Sequences', 'Limits', 'Vectors', 'Trigonometry', 'Statistics'],
  physics: ['Kinematics', "Newton's Laws", 'Energy & Work', 'Momentum', 'Waves', 'Electric Circuits', 'Thermodynamics', 'Optics'],
  biology: ['Cell Structure', 'Genetics', 'Photosynthesis', 'Human Anatomy', 'Ecosystems', 'Evolution'],
};

function makeId(prefix = 'id') {
  return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
}

function startOfDay(d) {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function endOfDay(d) {
  const copy = new Date(d);
  copy.setHours(23, 59, 59, 999);
  return copy;
}

export function getRangeBounds(range) {
  const now = new Date();
  const end = endOfDay(now);
  let start;

  if (range === 'week') {
    start = startOfDay(new Date(now));
    start.setDate(start.getDate() - 6);
  } else if (range === 'month') {
    start = startOfDay(new Date(now));
    start.setDate(start.getDate() - 29);
  } else {
    // all time
    start = new Date(0);
  }

  return { start, end };
}

export const progressService = {
  /**
   * Safe read with non-destructive fallback migration
   * Reads _v1 canonical key; if missing, safely checks legacy unversioned key
   * and copies over without overwriting or deleting either version.
   */
  read(key, fallback = []) {
    try {
      let raw = localStorage.getItem(key);
      if (!raw && key.endsWith('_v1')) {
        const legacyKey = key.slice(0, -3); // e.g. 'sb_progress_sessions'
        const legacyRaw = localStorage.getItem(legacyKey);
        if (legacyRaw) {
          raw = legacyRaw;
          // Non-destructive copy to versioned key
          localStorage.setItem(key, legacyRaw);
        }
      }
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  write(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Ensures subjects curriculum structure exists.
   * Does NOT fabricate sessions or quizzes.
   */
  ensureSubjects() {
    const existing = this.read(STORAGE_KEYS_PROGRESS.subjects, null);
    if (!existing || existing.length === 0) {
      this.write(STORAGE_KEYS_PROGRESS.subjects, DEFAULT_SUBJECTS);
    }
  },

  /**
   * Check if the currently loaded data is explicitly flagged as demo/sample
   */
  isDemoData() {
    try {
      return localStorage.getItem(STORAGE_KEYS_PROGRESS.isDemo) === 'true';
    } catch {
      return false;
    }
  },

  /**
   * Explicitly load realistic sample activity when requested by the user
   */
  loadDemoData() {
    this.ensureSubjects();

    const sessions = [];
    const quizzes = [];
    const topics = [];
    const flashcards = [];

    const now = new Date();
    const DAYS_OF_HISTORY = 45;

    for (let daysAgo = DAYS_OF_HISTORY; daysAgo >= 0; daysAgo--) {
      const day = new Date(now);
      day.setDate(now.getDate() - daysAgo);

      // Study Sessions
      if (Math.random() < 0.65) {
        const sub = DEFAULT_SUBJECTS[Math.floor(Math.random() * DEFAULT_SUBJECTS.length)];
        const minutes = 20 + Math.floor(Math.random() * 55);
        sessions.push({
          id: makeId('sess'),
          subjectId: sub.id,
          minutes,
          date: day.toISOString(),
        });
      }

      // Quizzes
      if (Math.random() < 0.35) {
        const sub = DEFAULT_SUBJECTS[Math.floor(Math.random() * DEFAULT_SUBJECTS.length)];
        const score = Math.min(100, Math.max(50, Math.floor(75 + (Math.random() * 30 - 10))));
        quizzes.push({
          id: makeId('quiz'),
          subjectId: sub.id,
          topic: (TOPIC_POOL[sub.id] || [])[0] || 'General Review',
          score,
          questionsCount: 10,
          date: day.toISOString(),
        });
      }

      // Topics Completed
      if (Math.random() < 0.3) {
        const sub = DEFAULT_SUBJECTS[Math.floor(Math.random() * DEFAULT_SUBJECTS.length)];
        const pool = TOPIC_POOL[sub.id] || [];
        const topicName = pool[Math.floor(Math.random() * pool.length)] || 'Core Concepts';
        topics.push({
          id: makeId('top'),
          subjectId: sub.id,
          topic: topicName,
          date: day.toISOString(),
        });
      }

      // Flashcards
      if (Math.random() < 0.45) {
        const sub = DEFAULT_SUBJECTS[Math.floor(Math.random() * DEFAULT_SUBJECTS.length)];
        const reviewed = 8 + Math.floor(Math.random() * 12);
        const mastered = Math.floor(reviewed * (0.6 + Math.random() * 0.3));
        flashcards.push({
          id: makeId('fc'),
          subjectId: sub.id,
          reviewed,
          mastered,
          date: day.toISOString(),
        });
      }
    }

    this.write(STORAGE_KEYS_PROGRESS.sessions, sessions);
    this.write(STORAGE_KEYS_PROGRESS.quizzes, quizzes);
    this.write(STORAGE_KEYS_PROGRESS.topics, topics);
    this.write(STORAGE_KEYS_PROGRESS.flashcards, flashcards);
    try {
      localStorage.setItem(STORAGE_KEYS_PROGRESS.isDemo, 'true');
    } catch (e) {
      console.warn('Unable to persist demo state flag', e);
    }
    return true;
  },

  /**
   * Reset / clear sample demo activity back to genuine empty state
   */
  clearDemoData() {
    this.write(STORAGE_KEYS_PROGRESS.sessions, []);
    this.write(STORAGE_KEYS_PROGRESS.quizzes, []);
    this.write(STORAGE_KEYS_PROGRESS.topics, []);
    this.write(STORAGE_KEYS_PROGRESS.flashcards, []);
    try {
      localStorage.removeItem(STORAGE_KEYS_PROGRESS.isDemo);
    } catch (e) {
      console.warn('Unable to remove demo state flag', e);
    }
    return true;
  },

  /**
   * Get all progress records.
   * Preserves genuine empty arrays for new users.
   */
  getAllData() {
    this.ensureSubjects();
    return {
      subjects: this.read(STORAGE_KEYS_PROGRESS.subjects, DEFAULT_SUBJECTS),
      sessions: this.read(STORAGE_KEYS_PROGRESS.sessions, []),
      quizzes: this.read(STORAGE_KEYS_PROGRESS.quizzes, []),
      topics: this.read(STORAGE_KEYS_PROGRESS.topics, []),
      flashcards: this.read(STORAGE_KEYS_PROGRESS.flashcards, []),
    };
  },

  computeSummary(range = 'month') {
    const data = this.getAllData();
    const bounds = getRangeBounds(range);
    const startMs = bounds.start.getTime();
    const endMs = bounds.end.getTime();

    const inRange = (item) => {
      const t = new Date(item.date).getTime();
      return t >= startMs && t <= endMs;
    };

    const sessions = data.sessions.filter(inRange);
    const quizzes = data.quizzes.filter(inRange);
    const topics = data.topics.filter(inRange);
    const flashcards = data.flashcards.filter(inRange);

    const hasData =
      data.sessions.length > 0 ||
      data.quizzes.length > 0 ||
      data.topics.length > 0 ||
      data.flashcards.length > 0;

    const isDemo = this.isDemoData();

    const totalMinutes = sessions.reduce((sum, s) => sum + (s.minutes || 0), 0);
    const totalHours = (totalMinutes / 60).toFixed(1);

    const totalQuizzes = quizzes.length;
    const avgScore =
      totalQuizzes > 0
        ? Math.round(quizzes.reduce((sum, q) => sum + (q.score || 0), 0) / totalQuizzes)
        : 0;

    const totalTopics = topics.length;

    const flashcardsReviewed = flashcards.reduce((sum, f) => sum + (f.reviewed || 0), 0);
    const flashcardsMastered = flashcards.reduce((sum, f) => sum + (f.mastered || 0), 0);

    // Subject breakdown
    const subjectProgress = data.subjects.map((sub) => {
      const subSessions = sessions.filter((s) => s.subjectId === sub.id);
      const subMinutes = subSessions.reduce((sum, s) => sum + s.minutes, 0);
      const subQuizzes = quizzes.filter((q) => q.subjectId === sub.id);
      const subAvgScore =
        subQuizzes.length > 0
          ? Math.round(subQuizzes.reduce((sum, q) => sum + q.score, 0) / subQuizzes.length)
          : 0;
      const subTopics = topics.filter((t) => t.subjectId === sub.id);
      const pct = Math.min(100, Math.round((subTopics.length / (sub.totalTopics || 10)) * 100));

      return {
        ...sub,
        hours: (subMinutes / 60).toFixed(1),
        quizzesTaken: subQuizzes.length,
        avgScore: subAvgScore,
        topicsCompleted: subTopics.length,
        percentage: pct,
      };
    });

    // Recent activity list
    const activities = [];
    sessions.slice(-4).forEach((s) => {
      const sub = data.subjects.find((sb) => sb.id === s.subjectId);
      activities.push({
        type: 'session',
        title: `Studied ${sub?.name || 'Subject'}`,
        meta: `${s.minutes} minutes • ${new Date(s.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        date: s.date,
      });
    });
    quizzes.slice(-4).forEach((q) => {
      const sub = data.subjects.find((sb) => sb.id === q.subjectId);
      activities.push({
        type: 'quiz',
        title: `Completed ${sub?.name || 'Subject'} Quiz`,
        meta: `Scored ${q.score}% • ${new Date(q.date).toLocaleDateString([], { month: 'short', day: 'numeric' })}`,
        date: q.date,
      });
    });
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      totalHours,
      totalQuizzes,
      avgScore,
      totalTopics,
      flashcardsReviewed,
      flashcardsMastered,
      subjectProgress,
      recentActivities: activities.slice(0, 5),
      hasData,
      isDemo,
    };
  },
};
