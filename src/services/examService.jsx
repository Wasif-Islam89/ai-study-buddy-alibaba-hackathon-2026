/**
 * examService.js
 * Data layer and countdown calculations for Exam Countdown.
 * Preserves exact LocalStorage key: aiStudyBuddy.examCountdown.v1
 */

export const STORAGE_KEY_EXAM = 'aiStudyBuddy.examCountdown.v1';

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

export function defaultExamState() {
  const heroDate = new Date();
  heroDate.setDate(heroDate.getDate() + 21);
  const mathDate = new Date();
  mathDate.setDate(mathDate.getDate() + 28);
  const physicsDate = new Date();
  physicsDate.setDate(physicsDate.getDate() + 35);

  const heroId = uid();

  return {
    activeExamId: heroId,
    exams: [
      {
        id: heroId,
        subject: 'Computer Science',
        title: 'Programming Fundamentals Final Exam',
        date: isoDate(heroDate),
        icon: 'computer',
        color: 'primary',
        topicsTotal: 25,
        topicsCovered: 17,
        sessionsTotal: 18,
        sessionsCompleted: 12,
        quizzesTaken: 6,
        practice: 65,
        revision: 70,
        topics: [
          {
            id: uid(),
            name: 'Pointers & Dynamic Memory',
            accuracy: 42,
            desc: 'Low performance on recent practice quizzes.',
            mastered: false,
          },
          {
            id: uid(),
            name: 'Pointer Arithmetic & Arrays',
            accuracy: 51,
            desc: 'Needs review before moving to advanced topics.',
            mastered: false,
          },
        ],
        aiInsightTopic: 'Function Pointers',
        aiInsightAccuracy: 48,
        aiInsightAdded: false,
      },
      {
        id: uid(),
        subject: 'Mathematics',
        title: 'Calculus & Algebra Midterm',
        date: isoDate(mathDate),
        icon: 'calculate',
        color: 'primary',
        topicsTotal: 20,
        topicsCovered: 9,
        sessionsTotal: 14,
        sessionsCompleted: 6,
        quizzesTaken: 3,
        practice: 40,
        revision: 45,
        topics: [
          {
            id: uid(),
            name: 'Partial Derivatives',
            accuracy: 48,
            desc: 'Review multivariate chain rule.',
            mastered: false,
          },
        ],
        aiInsightTopic: null,
        aiInsightAccuracy: null,
        aiInsightAdded: true,
      },
      {
        id: uid(),
        subject: 'Physics',
        title: 'Mechanics & Motion Exam',
        date: isoDate(physicsDate),
        icon: 'science',
        color: 'secondary',
        topicsTotal: 18,
        topicsCovered: 12,
        sessionsTotal: 16,
        sessionsCompleted: 11,
        quizzesTaken: 5,
        practice: 60,
        revision: 65,
        topics: [],
        aiInsightTopic: null,
        aiInsightAccuracy: null,
        aiInsightAdded: false,
      },
    ],
  };
}

export const examService = {
  loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_EXAM);
      if (!raw) {
        const fresh = defaultExamState();
        this.saveState(fresh);
        return fresh;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.exams || !Array.isArray(parsed.exams)) {
        const fresh = defaultExamState();
        this.saveState(fresh);
        return fresh;
      }
      return parsed;
    } catch {
      const fresh = defaultExamState();
      this.saveState(fresh);
      return fresh;
    }
  },

  saveState(state) {
    try {
      localStorage.setItem(STORAGE_KEY_EXAM, JSON.stringify(state));
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('storage'));
      }
      return true;
    } catch {
      return false;
    }
  },

  getActiveExam() {
    const state = this.loadState();
    return state.exams.find((e) => e.id === state.activeExamId) || state.exams[0] || null;
  },

  setActiveExam(id) {
    const state = this.loadState();
    state.activeExamId = id;
    this.saveState(state);
    return state;
  },

  saveExam(exam) {
    const state = this.loadState();
    const idx = state.exams.findIndex((e) => e.id === exam.id);
    if (idx >= 0) {
      state.exams[idx] = { ...state.exams[idx], ...exam };
    } else {
      const newExam = {
        id: exam.id || uid(),
        topics: [],
        ...exam,
      };
      state.exams.push(newExam);
      state.activeExamId = newExam.id;
    }
    this.saveState(state);
    return state;
  },

  deleteExam(id) {
    const state = this.loadState();
    state.exams = state.exams.filter((e) => e.id !== id);
    if (state.activeExamId === id) {
      state.activeExamId = state.exams[0]?.id || null;
    }
    this.saveState(state);
    return state;
  },

  toggleTopicMastered(examId, topicId) {
    const state = this.loadState();
    const exam = state.exams.find((e) => e.id === examId);
    if (!exam || !Array.isArray(exam.topics)) return state;

    const topic = exam.topics.find((t) => t.id === topicId);
    if (topic) {
      topic.mastered = !topic.mastered;
      this.saveState(state);
    }
    return state;
  },

  computeCountdown(dateStr) {
    if (!dateStr) return { days: 0, hours: 0, minutes: 0, seconds: 0, totalSeconds: 0 };
    const target = new Date(dateStr + 'T23:59:59').getTime();
    const now = Date.now();
    const diff = Math.max(0, target - now);

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, totalSeconds };
  },
};

