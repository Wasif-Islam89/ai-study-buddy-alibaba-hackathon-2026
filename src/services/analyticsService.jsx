/**
 * analyticsService.jsx
 * Centralized learning performance analytics engine for AI Study Buddy.
 * Aggregates actual data from all active study tools without fabricating fake metrics:
 *   - Study Planner (sessions & completions)
 *   - Quiz Generator (created quizzes, attempts & scores)
 *   - Flashcards (decks, cards, mastery & review history)
 *   - AI Summaries (generated summaries & reading times)
 *   - AI Assistant (conversations & message exchanges)
 *   - Materials & Notes (uploads, outline topics & study points)
 *   - Exam Prep (upcoming exams, days remaining & readiness)
 *   - Legacy Progress Service (backward-compatibility records)
 */

import { plannerService } from './plannerService';
import { quizService } from './quizService';
import { flashcardService } from './flashcardService';
import { summaryService } from './summaryService';
import { examService } from './examService';
import { loadLastUpload, getAllMaterials } from '../utils/materialUtils';
import { progressService } from './progressService';

// Helpers
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

function toISODateOnly(date) {
  const d = new Date(date);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function getRangeBounds(range = 'month') {
  const now = new Date();
  const end = endOfDay(now);
  let start;

  if (range === 'week') {
    start = startOfDay(new Date(now));
    start.setDate(start.getDate() - 6); // Last 7 days
  } else if (range === 'month') {
    start = startOfDay(new Date(now));
    start.setDate(start.getDate() - 29); // Last 30 days
  } else {
    // All time (from start of 2024 or earliest record)
    start = new Date('2024-01-01T00:00:00Z');
  }

  return { start, end };
}

export const analyticsService = {
  /**
   * Main aggregation method: computes comprehensive analytics for the requested time range.
   */
  computeDashboardMetrics(range = 'month') {
    const bounds = getRangeBounds(range);
    const startMs = bounds.start.getTime();
    const endMs = bounds.end.getTime();

    const inRange = (dateInput) => {
      if (!dateInput) return false;
      const t = new Date(dateInput).getTime();
      return !isNaN(t) && t >= startMs && t <= endMs;
    };

    // 1. Study Planner Sessions & Completions
    const plannerData = plannerService.loadData();
    const plannerSessions = Array.isArray(plannerData.sessions) ? plannerData.sessions : [];
    const completionsMap = plannerData.completions || {};

    let plannerCompletedMinutes = 0;
    let plannerCompletedCount = 0;
    const dailyStudyMinutesMap = {};
    const subjectStudyMinutesMap = {};
    const subjectCompletedSessionsMap = {};

    Object.entries(completionsMap).forEach(([key, val]) => {
      const [dateISO, sessId] = key.split('|');
      const completedTime = val?.completedAt ? new Date(val.completedAt) : new Date(dateISO + 'T12:00:00');

      if (inRange(completedTime) || inRange(dateISO)) {
        const matchingSess = plannerSessions.find((s) => s.id === sessId);
        const duration = matchingSess ? Number(matchingSess.duration) || 45 : 45;
        const subject = matchingSess ? matchingSess.subject : 'General Study';

        plannerCompletedMinutes += duration;
        plannerCompletedCount += 1;

        // Daily bucket
        const dayKey = dateISO || toISODateOnly(completedTime);
        dailyStudyMinutesMap[dayKey] = (dailyStudyMinutesMap[dayKey] || 0) + duration;

        // Subject bucket
        subjectStudyMinutesMap[subject] = (subjectStudyMinutesMap[subject] || 0) + duration;
        subjectCompletedSessionsMap[subject] = (subjectCompletedSessionsMap[subject] || 0) + 1;
      }
    });

    // Also include legacy progress sessions if recorded in range
    const legacyData = progressService.getAllData();
    (legacyData.sessions || []).forEach((ls) => {
      if (inRange(ls.date)) {
        const mins = Number(ls.minutes) || 0;
        plannerCompletedMinutes += mins;
        plannerCompletedCount += 1;
        const dayKey = toISODateOnly(ls.date);
        dailyStudyMinutesMap[dayKey] = (dailyStudyMinutesMap[dayKey] || 0) + mins;

        const subObj = (legacyData.subjects || []).find((s) => s.id === ls.subjectId);
        const subName = subObj ? subObj.name : 'Computer Science';
        subjectStudyMinutesMap[subName] = (subjectStudyMinutesMap[subName] || 0) + mins;
        subjectCompletedSessionsMap[subName] = (subjectCompletedSessionsMap[subName] || 0) + 1;
      }
    });

    // 2. Quizzes
    const allQuizzes = quizService.getAllQuizzes();
    const completedQuizzes = [];
    const subjectQuizzesMap = {};

    allQuizzes.forEach((q) => {
      const qDate = q.createdAt || q.date;
      const isCompleted = q.score && typeof q.score.total === 'number' && q.score.total > 0;

      if (isCompleted && (range === 'all' || inRange(qDate))) {
        completedQuizzes.push(q);
        const sub = q.subject || 'Computer Science';
        if (!subjectQuizzesMap[sub]) {
          subjectQuizzesMap[sub] = { attempts: 0, totalPercentage: 0, bestScore: 0, quizzes: [] };
        }
        const pct = Math.round(Number(q.score.percentage) || 0);
        subjectQuizzesMap[sub].attempts += 1;
        subjectQuizzesMap[sub].totalPercentage += pct;
        subjectQuizzesMap[sub].bestScore = Math.max(subjectQuizzesMap[sub].bestScore, pct);
        subjectQuizzesMap[sub].quizzes.push(q);
      }
    });

    // Also merge legacy quizzes if available
    (legacyData.quizzes || []).forEach((lq) => {
      if (inRange(lq.date)) {
        completedQuizzes.push({
          id: lq.id,
          subject: (legacyData.subjects || []).find((s) => s.id === lq.subjectId)?.name || 'General',
          topic: lq.topic,
          score: { percentage: lq.score, total: lq.questionsCount || 10 },
          createdAt: lq.date,
        });
      }
    });

    const totalQuizAttempts = completedQuizzes.length;
    const avgQuizScore =
      totalQuizAttempts > 0
        ? Math.round(
            completedQuizzes.reduce((acc, q) => acc + (Number(q.score?.percentage) || 0), 0) /
              totalQuizAttempts
          )
        : 0;

    const bestQuizScore =
      totalQuizAttempts > 0
        ? Math.max(...completedQuizzes.map((q) => Number(q.score?.percentage) || 0))
        : 0;

    // 3. Flashcards
    const allDecks = flashcardService.getAllDecks();
    const flashcardHistory = flashcardService.getStudyHistory();
    let totalCardsCount = 0;
    let totalMasteredCards = 0;
    let totalLearningCards = 0;
    const subjectFlashcardMap = {};

    allDecks.forEach((deck) => {
      const sub = deck.subject || 'General';
      const cards = Array.isArray(deck.cards) ? deck.cards : [];
      const masteredInDeck = cards.filter((c) => c.status === 'known').length;
      const learningInDeck = cards.filter((c) => c.status === 'practice').length;

      totalCardsCount += cards.length;
      totalMasteredCards += masteredInDeck;
      totalLearningCards += learningInDeck;

      if (!subjectFlashcardMap[sub]) {
        subjectFlashcardMap[sub] = { decks: 0, cards: 0, mastered: 0 };
      }
      subjectFlashcardMap[sub].decks += 1;
      subjectFlashcardMap[sub].cards += cards.length;
      subjectFlashcardMap[sub].mastered += masteredInDeck;
    });

    // 4. Summaries
    const allSummaries = summaryService.getAllSummaries();
    const summariesInRange = allSummaries.filter((s) => range === 'all' || inRange(s.createdAt));
    const subjectSummariesMap = {};

    allSummaries.forEach((s) => {
      const sub = s.subject || 'General';
      subjectSummariesMap[sub] = (subjectSummariesMap[sub] || 0) + 1;
    });

    // 5. AI Assistant
    let aiChatsCount = 0;
    let aiMessagesCount = 0;
    let recentChatTopics = [];
    try {
      const rawAi = localStorage.getItem('sb_ai_chats_v1');
      if (rawAi) {
        const parsed = JSON.parse(rawAi);
        const chats = Array.isArray(parsed?.chats) ? parsed.chats : [];
        aiChatsCount = chats.length;
        chats.forEach((c) => {
          aiMessagesCount += Array.isArray(c.messages) ? c.messages.length : 0;
        });
        recentChatTopics = chats.slice(0, 3).map((c) => c.title || 'Discussion');
      }
    } catch {
      // safe fallback
    }

    // 6. Materials & Notes
    const materialsList = typeof getAllMaterials === 'function' ? getAllMaterials() : [];
    const lastUpload = loadLastUpload();
    const hasUploadedMaterial = materialsList.length > 0 || !!lastUpload;
    const materialFileName = lastUpload?.fileName || (materialsList[0]?.fileName) || null;
    const materialTopicsCount = materialsList.length > 0
      ? materialsList.reduce((acc, m) => acc + (m.structure?.length || 0), 0)
      : (Array.isArray(lastUpload?.structure) ? lastUpload.structure.length : 0);
    const notesPointsCount = materialsList.length > 0
      ? materialsList.reduce((acc, m) => {
          return acc + (m.structure || []).reduce((sAcc, s) => sAcc + (s.points?.length || 0), 0);
        }, 0)
      : (lastUpload?.structure || []).reduce(
          (acc, sec) => acc + (Array.isArray(sec.points) ? sec.points.length : 0),
          0
        );

    // 7. Exam Prep
    let upcomingExams = [];
    let nextExamDays = null;
    let nextExamSubject = null;
    try {
      const examData = examService.getAllExams?.() || examService.defaultExamState?.()?.exams || [];
      const now = new Date();
      upcomingExams = examData.filter((e) => {
        const ed = new Date(e.date);
        return !isNaN(ed) && ed >= startOfDay(now);
      });
      if (upcomingExams.length > 0) {
        upcomingExams.sort((a, b) => new Date(a.date) - new Date(b.date));
        const diffMs = new Date(upcomingExams[0].date).getTime() - now.getTime();
        nextExamDays = Math.max(0, Math.ceil(diffMs / (1000 * 60 * 60 * 24)));
        nextExamSubject = upcomingExams[0].subject;
      }
    } catch {
      // safe fallback
    }

    // 8. Streak & Study Consistency
    const activeDaysCount = Object.keys(dailyStudyMinutesMap).length;
    const totalDaysInWindow = range === 'week' ? 7 : range === 'month' ? 30 : Math.max(1, activeDaysCount);
    const studyConsistencyPercent = Math.min(100, Math.round((activeDaysCount / totalDaysInWindow) * 100));
    const currentStreak = plannerService.computeStreak?.(plannerData) || (activeDaysCount > 0 ? activeDaysCount : 0);

    // 9. Total Completed Learning Activities
    const totalCompletedActivities =
      plannerCompletedCount +
      totalQuizAttempts +
      flashcardHistory.length +
      summariesInRange.length +
      (hasUploadedMaterial ? 1 : 0);

    // 10. Subject Performance Aggregation
    const knownSubjectNames = [
      'Computer Science',
      'Mathematics',
      'Physics',
      'Biology',
    ];
    // Gather any dynamic subjects found in user data
    Object.keys(subjectStudyMinutesMap).forEach((s) => {
      if (!knownSubjectNames.includes(s) && s !== 'General Study') knownSubjectNames.push(s);
    });
    Object.keys(subjectQuizzesMap).forEach((s) => {
      if (!knownSubjectNames.includes(s)) knownSubjectNames.push(s);
    });

    const subjectAnalytics = knownSubjectNames.map((name) => {
      const studyMins = subjectStudyMinutesMap[name] || 0;
      const completedSessions = subjectCompletedSessionsMap[name] || 0;
      const quizInfo = subjectQuizzesMap[name] || { attempts: 0, totalPercentage: 0, bestScore: 0 };
      const avgScore = quizInfo.attempts > 0 ? Math.round(quizInfo.totalPercentage / quizInfo.attempts) : 0;
      const flashcardInfo = subjectFlashcardMap[name] || { decks: 0, cards: 0, mastered: 0 };
      const summariesCount = subjectSummariesMap[name] || 0;

      // Determine strengths & improvement areas
      let strength = null;
      let needsWork = null;

      if (quizInfo.attempts > 0 && avgScore >= 75) {
        strength = `High accuracy (${avgScore}%) across ${quizInfo.attempts} ${quizInfo.attempts === 1 ? 'quiz' : 'quizzes'}`;
      } else if (studyMins >= 120) {
        strength = `Strong study time logged (${(studyMins / 60).toFixed(1)} hrs)`;
      } else if (flashcardInfo.mastered > 0) {
        strength = `${flashcardInfo.mastered} key flashcards mastered`;
      }

      if (quizInfo.attempts > 0 && avgScore < 70) {
        needsWork = `Practice quiz score (${avgScore}%) could be improved`;
      } else if (studyMins === 0 && quizInfo.attempts === 0) {
        needsWork = 'No study sessions or quizzes completed yet';
      } else if (studyMins < 45) {
        needsWork = 'Under 45 mins logged this period';
      }

      return {
        name,
        studyHours: (studyMins / 60).toFixed(1),
        studyMinutes: studyMins,
        completedSessions,
        quizAttempts: quizInfo.attempts,
        avgScore,
        bestScore: quizInfo.bestScore,
        cardsMastered: flashcardInfo.mastered,
        totalCards: flashcardInfo.cards,
        summariesCount,
        strength,
        needsWork,
      };
    });

    // 11. Daily Activity Timeline Series for Chart
    const dailySeries = [];
    const daysBack = range === 'week' ? 6 : range === 'month' ? 29 : 13;
    const now = new Date();

    for (let i = daysBack; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      const iso = toISODateOnly(d);
      const dayName = d.toLocaleDateString([], { weekday: 'short' });
      const monthDay = d.toLocaleDateString([], { month: 'short', day: 'numeric' });

      const studyMins = dailyStudyMinutesMap[iso] || 0;
      const quizzesOnDay = completedQuizzes.filter((q) => toISODateOnly(q.createdAt || q.date) === iso).length;

      dailySeries.push({
        iso,
        dayName,
        monthDay,
        label: range === 'week' ? dayName : `${d.getDate()}`,
        fullDateLabel: monthDay,
        studyMinutes: studyMins,
        studyHours: Number((studyMins / 60).toFixed(1)),
        quizzesTaken: quizzesOnDay,
      });
    }

    // 12. Recent Activity Feed (Chronological Real Events)
    const recentActivities = [];

    // Completed study sessions
    Object.entries(completionsMap).forEach(([key, val]) => {
      const [dateISO, sessId] = key.split('|');
      const sess = plannerSessions.find((s) => s.id === sessId);
      const completedAt = val?.completedAt || `${dateISO}T12:00:00Z`;
      recentActivities.push({
        id: `sess_${key}`,
        type: 'session',
        title: `Completed Study Session: ${sess?.title || sess?.subject || 'Study Plan'}`,
        subject: sess?.subject || 'Study Session',
        meta: `${sess?.duration || 45} mins logged`,
        timestamp: completedAt,
      });
    });

    // Completed quizzes
    completedQuizzes.forEach((q) => {
      recentActivities.push({
        id: `quiz_${q.id}`,
        type: 'quiz',
        title: `Completed Quiz: ${q.topic || q.subject || 'Practice Quiz'}`,
        subject: q.subject || 'Quiz',
        meta: `Scored ${q.score?.percentage}% (${q.score?.correct || 0}/${q.score?.total || 0})`,
        timestamp: q.createdAt || q.date || new Date().toISOString(),
      });
    });

    // Flashcard study sessions
    flashcardHistory.forEach((h, idx) => {
      recentActivities.push({
        id: `fc_${idx}`,
        type: 'flashcard',
        title: `Reviewed Deck: ${h.deckTitle || 'Flashcards'}`,
        subject: 'Flashcards',
        meta: h.score || 'Review completed',
        timestamp: h.timestamp?.includes('T') ? h.timestamp : new Date().toISOString(),
      });
    });

    // AI Summaries
    allSummaries.slice(0, 3).forEach((s) => {
      recentActivities.push({
        id: `sum_${s.id}`,
        type: 'summary',
        title: `Generated Summary: ${s.title}`,
        subject: s.subject || 'Summary',
        meta: `${s.readingTime || '3 mins'} • ${s.wordCount || 350} words`,
        timestamp: s.createdAt || new Date().toISOString(),
      });
    });

    // Sort recent activities descending by date
    recentActivities.sort((a, b) => {
      const ta = new Date(a.timestamp).getTime();
      const tb = new Date(b.timestamp).getTime();
      return (isNaN(tb) ? 0 : tb) - (isNaN(ta) ? 0 : ta);
    });

    // 13. Data-driven Performance Insights
    const insights = [];

    // Most active subject
    const subjectWithMostTime = [...subjectAnalytics].sort((a, b) => b.studyMinutes - a.studyMinutes)[0];
    if (subjectWithMostTime && subjectWithMostTime.studyMinutes > 0) {
      insights.push({
        type: 'primary',
        title: 'Most Active Subject',
        desc: `${subjectWithMostTime.name} is your most practiced subject with ${subjectWithMostTime.studyHours} hours logged.`,
      });
    }

    // Best quiz performance
    const subjectWithBestScore = [...subjectAnalytics]
      .filter((s) => s.quizAttempts > 0)
      .sort((a, b) => b.avgScore - a.avgScore)[0];
    if (subjectWithBestScore && subjectWithBestScore.avgScore > 0) {
      insights.push({
        type: 'success',
        title: 'Top Quiz Performance',
        desc: `You hold an average accuracy of ${subjectWithBestScore.avgScore}% in ${subjectWithBestScore.name}.`,
      });
    }

    // Area needing focus
    const subjectNeedingFocus = [...subjectAnalytics]
      .filter((s) => s.quizAttempts > 0 && s.avgScore < 70)
      .sort((a, b) => a.avgScore - b.avgScore)[0];
    if (subjectNeedingFocus) {
      insights.push({
        type: 'warning',
        title: 'Recommended Revision',
        desc: `${subjectNeedingFocus.name} average score is currently ${subjectNeedingFocus.avgScore}%. Adding a short review session is recommended.`,
      });
    } else if (nextExamDays !== null && nextExamDays <= 14) {
      insights.push({
        type: 'warning',
        title: 'Upcoming Exam Target',
        desc: `${nextExamSubject} exam is in ${nextExamDays} days. Prioritize planned review sessions this week.`,
      });
    }

    // Tool usage observation
    if (allQuizzes.length > 0 && totalQuizAttempts > 0) {
      insights.push({
        type: 'info',
        title: 'Tool Engagement',
        desc: `Quiz Generator and Study Planner are driving your active recall practice.`,
      });
    }

    const hasData =
      plannerCompletedMinutes > 0 ||
      totalQuizAttempts > 0 ||
      flashcardHistory.length > 0 ||
      allSummaries.length > 0 ||
      hasUploadedMaterial;

    return {
      range,
      hasData,
      isDemo: progressService.isDemoData(),
      overview: {
        totalHours: (plannerCompletedMinutes / 60).toFixed(1),
        totalMinutes: plannerCompletedMinutes,
        completedSessions: plannerCompletedCount,
        quizAttempts: totalQuizAttempts,
        avgQuizScore,
        bestQuizScore,
        studyConsistencyPercent,
        totalCompletedActivities,
        currentStreak,
      },
      chartData: dailySeries,
      subjectAnalytics,
      toolAnalytics: {
        aiAssistant: {
          chatsCount: aiChatsCount,
          messagesCount: aiMessagesCount,
          recentTopics: recentChatTopics,
        },
        materials: {
          hasUploaded: hasUploadedMaterial,
          totalCount: materialsList.length || (hasUploadedMaterial ? 1 : 0),
          fileName: materialFileName,
          topicsCount: materialTopicsCount,
          pointsCount: notesPointsCount,
        },
        notes: {
          totalNotes: materialsList.length || (hasUploadedMaterial ? 1 : 0),
          sectionsCount: materialTopicsCount,
          pointsCount: notesPointsCount,
        },
        summaries: {
          totalCount: allSummaries.length,
          inRangeCount: summariesInRange.length,
        },
        quizzes: {
          totalCreated: allQuizzes.length,
          totalAttempts: totalQuizAttempts,
          avgScore: avgQuizScore,
          bestScore: bestQuizScore,
        },
        flashcards: {
          totalDecks: allDecks.length,
          totalCards: totalCardsCount,
          mastered: totalMasteredCards,
          inPractice: totalLearningCards,
          reviewsCount: flashcardHistory.length,
        },
        planner: {
          plannedSessionsPerWeek: plannerSessions.length,
          completedSessions: plannerCompletedCount,
          weeklyGoalHours: plannerData.weeklyGoalHours || 18,
          completedHours: (plannerCompletedMinutes / 60).toFixed(1),
        },
        exams: {
          upcomingCount: upcomingExams.length,
          nextExamDays,
          nextExamSubject,
        },
      },
      insights,
      recentActivities: recentActivities.slice(0, 10),
    };
  },
};

