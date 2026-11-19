/**
 * plannerService.js
 * Storage and domain logic for Study Planner and AI Plan Optimization.
 * Preserves exact LocalStorage key: aiStudyBuddy_plannerData_v1
 */

export const STORAGE_KEY_PLANNER = "aiStudyBuddy_plannerData_v1";

export const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAY_NAMES_FULL = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
export const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const COLOR_CYCLE = ["primary", "secondary", "tertiary"];

export const KNOWN_SUBJECTS = [
  "Mathematics",
  "Physics",
  "C Programming",
  "Chemistry",
  "Biology",
  "English",
  "Computer Science",
];

/* -------------------- Date Helpers -------------------- */

export function pad2(n) {
  return n < 10 ? "0" + n : "" + n;
}

export function toISO(date) {
  const d = new Date(date);
  return d.getFullYear() + "-" + pad2(d.getMonth() + 1) + "-" + pad2(d.getDate());
}

export function fromISO(iso) {
  const parts = iso.split("-").map(Number);
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

export function todayISO() {
  return toISO(new Date());
}

export function addDaysToDate(date, n) {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}

export function addDaysISO(iso, n) {
  return toISO(addDaysToDate(fromISO(iso), n));
}

// 0=Mon ... 6=Sun. JS getDay(): 0=Sun...6=Sat.
export function mondayIndexFromJsDay(jsDay) {
  return (jsDay + 6) % 7;
}

export function getWeekStart(weekOffset = 0) {
  const now = new Date();
  const mondayOffset = mondayIndexFromJsDay(now.getDay());
  let monday = addDaysToDate(now, -mondayOffset);
  monday = addDaysToDate(monday, weekOffset * 7);
  monday.setHours(0, 0, 0, 0);
  return monday;
}

export function dateForDayInWeek(weekOffset, dayIdx) {
  return addDaysToDate(getWeekStart(weekOffset), dayIdx);
}

export function formatShortDate(date) {
  return MONTH_NAMES[date.getMonth()] + " " + date.getDate();
}

export function formatWeekRangeLabel(weekOffset) {
  const monday = getWeekStart(weekOffset);
  const sunday = addDaysToDate(monday, 6);
  return formatShortDate(monday) + " - " + formatShortDate(sunday);
}

export function daysBetween(isoA, isoB) {
  const a = fromISO(isoA);
  const b = fromISO(isoB);
  return Math.round((b - a) / 86400000);
}

export function formatTime12(time24) {
  if (!time24) return "";
  const parts = time24.split(":");
  const h = parseInt(parts[0], 10);
  const m = parts[1] || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  let h12 = h % 12;
  if (h12 === 0) h12 = 12;
  return h12 + ":" + m + " " + ampm;
}

export function minutesFromTime(time24) {
  if (!time24) return 0;
  const parts = time24.split(":");
  return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
}

export function timeFromMinutes(mins) {
  mins = ((mins % 1440) + 1440) % 1440;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return pad2(h) + ":" + pad2(m);
}

export function makeId(prefix = "id") {
  return prefix + "_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

/* -------------------- Default Seed Data -------------------- */

export function defaultPlannerData() {
  const today = todayISO();
  return {
    weekOffset: 0,
    weeklyGoalHours: 18,
    sessions: [
      { id: "s1", day: 0, subject: "C Programming", title: "C Programming", time: "18:00", duration: 90 },
      { id: "s2", day: 1, subject: "Mathematics", title: "Mathematics", time: "17:00", duration: 60 },
      { id: "s3", day: 2, subject: "Physics", title: "Physics", time: "16:30", duration: 120 },
      { id: "s4", day: 3, subject: "C Programming", title: "C Programming", time: "19:00", duration: 90 },
      { id: "s5", day: 5, subject: "Mathematics", title: "Mathematics", time: "10:00", duration: 120 },
    ],
    restDays: [6],
    completions: {},
    focusTasks: [
      { id: "f1", title: "Calculus Chapter 4 Practice", subject: "Mathematics", done: false, dateISO: today, dueLabel: "Due Tomorrow" },
      { id: "f2", title: "Read Pointers & Arrays", subject: "C Programming", done: true, dateISO: today, dueLabel: "" },
    ],
    focusScoreBase: 92,
    weakTopic: "Recursion",
    weakTopicSubject: "C Programming",
    weakTopicAddressed: false,
    examSubject: "Mathematics",
    examDateISO: addDaysISO(today, 8),
    subjectColors: { "C Programming": "primary", "Mathematics": "secondary", "Physics": "tertiary" },
    lastAction: null,
  };
}

/* -------------------- Planner Service -------------------- */

export const plannerService = {
  loadData() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_PLANNER);
      if (!raw) {
        const fresh = defaultPlannerData();
        this.saveData(fresh);
        return fresh;
      }
      const parsed = JSON.parse(raw);
      const defaults = defaultPlannerData();
      for (const k in defaults) {
        if (!(k in parsed)) parsed[k] = defaults[k];
      }
      return parsed;
    } catch (e) {
      console.error("Planner data load failed, resetting.", e);
      const d = defaultPlannerData();
      this.saveData(d);
      return d;
    }
  },

  saveData(data) {
    try {
      localStorage.setItem(STORAGE_KEY_PLANNER, JSON.stringify(data));
      return true;
    } catch (e) {
      console.error("Planner data save failed.", e);
      return false;
    }
  },

  resetData() {
    const d = defaultPlannerData();
    this.saveData(d);
    return d;
  },

  colorForSubject(data, subject) {
    if (!data.subjectColors) data.subjectColors = {};
    if (!data.subjectColors[subject]) {
      const used = Object.keys(data.subjectColors).length;
      data.subjectColors[subject] = COLOR_CYCLE[used % COLOR_CYCLE.length];
    }
    return data.subjectColors[subject];
  },

  sessionsForDay(data, dayIdx) {
    if (!Array.isArray(data.sessions)) return [];
    return data.sessions
      .filter((s) => s.day === dayIdx)
      .slice()
      .sort((a, b) => minutesFromTime(a.time) - minutesFromTime(b.time));
  },

  dailyTotals(data) {
    const totals = [0, 0, 0, 0, 0, 0, 0];
    if (Array.isArray(data.sessions)) {
      data.sessions.forEach((s) => {
        if (s.day >= 0 && s.day < 7) {
          totals[s.day] += Number(s.duration) || 0;
        }
      });
    }
    return totals;
  },

  isCompleted(data, dateISO, sessionId) {
    if (!data.completions) return false;
    return !!data.completions[dateISO + "|" + sessionId];
  },

  toggleSessionCompleted(dateISO, sessionId) {
    const data = this.loadData();
    if (!data.completions) data.completions = {};
    const key = dateISO + "|" + sessionId;
    if (data.completions[key]) {
      delete data.completions[key];
    } else {
      data.completions[key] = true;
    }
    this.saveData(data);
    return data;
  },

  completedMinutesForWeek(data, weekOffset) {
    let total = 0;
    for (let d = 0; d < 7; d++) {
      const dateISO = toISO(dateForDayInWeek(weekOffset, d));
      this.sessionsForDay(data, d).forEach((s) => {
        if (this.isCompleted(data, dateISO, s.id)) {
          total += Number(s.duration) || 0;
        }
      });
    }
    return total;
  },

  computeStreak(data) {
    let streak = 0;
    let cursor = new Date();
    cursor.setHours(0, 0, 0, 0);

    for (let i = 0; i < 60; i++) {
      const dateISO = toISO(cursor);
      const dayIdx = mondayIndexFromJsDay(cursor.getDay());
      const daySessions = this.sessionsForDay(data, dayIdx);
      const anyCompleted = daySessions.some((s) => this.isCompleted(data, dateISO, s.id));
      const anyScheduled = daySessions.length > 0;

      if (anyCompleted) {
        streak++;
      } else if (anyScheduled) {
        if (dateISO !== todayISO()) break;
      } else {
        if (streak === 0) {
          cursor = addDaysToDate(cursor, -1);
          continue;
        }
      }
      cursor = addDaysToDate(cursor, -1);
    }
    return streak;
  },

  findFreeSlot(data, dayIdx, preferredTime, duration, excludeSessionId) {
    const existing = this.sessionsForDay(data, dayIdx).filter((s) => s.id !== excludeSessionId);
    let start = minutesFromTime(preferredTime);

    for (let attempt = 0; attempt < 12; attempt++) {
      const end = start + duration;
      const conflict = existing.some((s) => {
        const sStart = minutesFromTime(s.time);
        const sEnd = sStart + Number(s.duration || 60);
        return start < sEnd && end > sStart;
      });
      if (!conflict) return timeFromMinutes(start);
      start += 60;
    }
    return timeFromMinutes(start);
  },

  // --- Session Operations ---
  addSession(sessionData) {
    const data = this.loadData();
    const subject = sessionData.subject || "Study Skills";
    this.colorForSubject(data, subject);

    const newSession = {
      id: sessionData.id || makeId("s"),
      day: Number(sessionData.day) || 0,
      subject: subject,
      title: sessionData.title || subject,
      time: sessionData.time || "17:00",
      duration: Number(sessionData.duration) || 60,
    };

    data.sessions.push(newSession);
    this.saveData(data);
    return { data, newSession };
  },

  updateSession(sessionId, updatedFields) {
    const data = this.loadData();
    const idx = data.sessions.findIndex((s) => s.id === sessionId);
    if (idx === -1) return { data, success: false };

    if (updatedFields.subject) {
      this.colorForSubject(data, updatedFields.subject);
    }

    data.sessions[idx] = {
      ...data.sessions[idx],
      ...updatedFields,
      duration: Number(updatedFields.duration ?? data.sessions[idx].duration),
      day: Number(updatedFields.day ?? data.sessions[idx].day),
    };

    this.saveData(data);
    return { data, success: true };
  },

  deleteSession(sessionId) {
    const data = this.loadData();
    data.sessions = data.sessions.filter((s) => s.id !== sessionId);

    // Clean up completions related to this session
    if (data.completions) {
      for (const k in data.completions) {
        if (k.endsWith("|" + sessionId)) {
          delete data.completions[k];
        }
      }
    }

    this.saveData(data);
    return data;
  },

  // --- Focus Tasks Operations ---
  addFocusTask(taskData) {
    const data = this.loadData();
    const newTask = {
      id: taskData.id || makeId("f"),
      title: taskData.title || "Study Task",
      subject: taskData.subject || "General",
      done: !!taskData.done,
      dateISO: taskData.dateISO || todayISO(),
      dueLabel: taskData.dueLabel || "",
    };
    if (!Array.isArray(data.focusTasks)) data.focusTasks = [];
    data.focusTasks.push(newTask);
    this.saveData(data);
    return { data, newTask };
  },

  toggleFocusTask(taskId) {
    const data = this.loadData();
    if (!Array.isArray(data.focusTasks)) return data;
    const task = data.focusTasks.find((t) => t.id === taskId);
    if (task) {
      task.done = !task.done;
      this.saveData(data);
    }
    return data;
  },

  deleteFocusTask(taskId) {
    const data = this.loadData();
    if (!Array.isArray(data.focusTasks)) return data;
    data.focusTasks = data.focusTasks.filter((t) => t.id !== taskId);
    this.saveData(data);
    return data;
  },

  // --- AI Optimization Analysis ---
  computeRecommendations(data) {
    // 1. Load balancing recommendation
    const totals = this.dailyTotals(data);
    const sum = totals.reduce((a, b) => a + b, 0);
    const avg = sum / 7;
    let maxDay = 0;
    for (let i = 1; i < 7; i++) {
      if (totals[i] > totals[maxDay]) maxDay = i;
    }
    const maxVal = totals[maxDay];

    let loadRec = { balanced: true };
    if (maxVal >= 180 && maxVal - avg >= 60) {
      const daySessions = this.sessionsForDay(data, maxDay);
      if (daySessions.length >= 2) {
        const candidate = daySessions.reduce((a, b) => (b.duration > a.duration ? b : a));
        let minDay = -1;
        let minVal = Infinity;
        for (let d = 0; d < 7; d++) {
          if (d === maxDay || data.restDays.includes(d)) continue;
          if (totals[d] < minVal) {
            minVal = totals[d];
            minDay = d;
          }
        }
        if (minDay !== -1) {
          const targetTime = this.findFreeSlot(data, minDay, candidate.time, candidate.duration, candidate.id);
          loadRec = {
            balanced: false,
            maxDay,
            maxVal,
            minDay,
            candidate,
            targetTime,
          };
        }
      }
    }

    // 2. Exam Preparation recommendation
    const today = todayISO();
    if (daysBetween(today, data.examDateISO) <= 0) {
      data.examDateISO = addDaysISO(today, 14);
    }
    const daysUntil = daysBetween(today, data.examDateISO);
    const order = [0, 1, 2, 3, 4, 5, 6]
      .filter((d) => !data.restDays.includes(d))
      .sort((a, b) => totals[a] - totals[b]);

    const count = Math.min(4, Math.max(2, order.length));
    const slots = [];
    const times = ["09:00", "14:00", "10:00", "18:00"];
    for (let i = 0; i < count && i < order.length; i++) {
      const day = order[i];
      const time = this.findFreeSlot(data, day, times[i % times.length], 60);
      slots.push({ day, time });
    }
    const examRec = { daysUntil, slots };

    // 3. Weak Topic recommendation
    const alreadyScheduled = data.sessions.some(
      (s) => s.title.toLowerCase().indexOf(data.weakTopic.toLowerCase()) >= 0
    );
    const resolved = data.weakTopicAddressed || alreadyScheduled;
    let preferredDay = 3; // Thursday
    if (data.restDays.includes(preferredDay)) {
      const available = [0, 1, 2, 3, 4, 5, 6].filter((d) => !data.restDays.includes(d)).sort((a, b) => totals[a] - totals[b]);
      preferredDay = available.length ? available[0] : 3;
    }
    const weakTime = this.findFreeSlot(data, preferredDay, "18:00", 60);
    const weakRec = { resolved, day: preferredDay, time: weakTime };

    return { load: loadRec, exam: examRec, weak: weakRec };
  },

  applyOptimization(data, recommendations) {
    let changed = false;

    // Apply Load Balance
    if (recommendations && !recommendations.load.balanced) {
      const candidate = data.sessions.find((s) => s.id === recommendations.load.candidate.id);
      if (candidate) {
        candidate.day = recommendations.load.minDay;
        candidate.time = recommendations.load.targetTime;
        changed = true;
      }
    }

    // Apply Exam Sessions
    if (recommendations && recommendations.exam.slots.length) {
      recommendations.exam.slots.forEach((slot) => {
        this.colorForSubject(data, data.examSubject);
        data.sessions.push({
          id: makeId("s"),
          day: slot.day,
          subject: data.examSubject,
          title: data.examSubject + " Exam Revision",
          time: slot.time,
          duration: 60,
        });
      });
      changed = true;
    }

    // Apply Weak Topic
    if (recommendations && !recommendations.weak.resolved) {
      const subject = data.weakTopicSubject || "Study Skills";
      this.colorForSubject(data, subject);
      data.sessions.push({
        id: makeId("s"),
        day: recommendations.weak.day,
        subject: subject,
        title: "Review: " + data.weakTopic,
        time: recommendations.weak.time,
        duration: 60,
      });
      data.weakTopicAddressed = true;
      changed = true;
    }

    data.lastAction = changed ? "applied" : "kept";
    this.saveData(data);
    return { data, changed };
  },

  keepCurrentPlan(data) {
    data.lastAction = "kept";
    this.saveData(data);
    return data;
  },
};

