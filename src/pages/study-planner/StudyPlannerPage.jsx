import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import WeeklyScheduleCard from './WeeklyScheduleCard';
import AiRecommendationCard from './AiRecommendationCard';
import SessionModal from './SessionModal';
import TaskModal from './TaskModal';
import {
  plannerService,
  formatWeekRangeLabel,
  mondayIndexFromJsDay,
} from '../../services/plannerService';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle2,
  Calendar,
} from 'lucide-react';

export default function StudyPlannerPage() {
  const [plannerData, setPlannerData] = useState(() => plannerService.loadData());
  const [sessionModalOpen, setSessionModalOpen] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const todayIdx = mondayIndexFromJsDay(new Date().getDay());
  const [selectedDay, setSelectedDay] = useState(todayIdx);
  const [defaultSessionDay, setDefaultSessionDay] = useState(todayIdx);

  // On mount: check for lastAction toast notification from AI Optimizer
  useEffect(() => {
    if (plannerData.lastAction === 'applied') {
      showToast('AI optimization applied to your plan.');
      const copy = { ...plannerData, lastAction: null };
      plannerService.saveData(copy);
      setPlannerData(copy);
    } else if (plannerData.lastAction === 'kept') {
      showToast('Kept your current plan.');
      const copy = { ...plannerData, lastAction: null };
      plannerService.saveData(copy);
      setPlannerData(copy);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Week Navigation
  const handlePrevWeek = () => {
    const updated = {
      ...plannerData,
      weekOffset: (plannerData.weekOffset || 0) - 1,
    };
    plannerService.saveData(updated);
    setPlannerData(updated);
  };

  const handleNextWeek = () => {
    const updated = {
      ...plannerData,
      weekOffset: (plannerData.weekOffset || 0) + 1,
    };
    plannerService.saveData(updated);
    setPlannerData(updated);
  };

  const handleResetCurrentWeek = () => {
    if (plannerData.weekOffset === 0 && selectedDay === todayIdx) return;
    const updated = {
      ...plannerData,
      weekOffset: 0,
    };
    plannerService.saveData(updated);
    setPlannerData(updated);
    setSelectedDay(todayIdx);
  };

  // Toggle Session Complete
  const handleToggleComplete = (dateISO, sessionId) => {
    const updated = plannerService.toggleSessionCompleted(dateISO, sessionId);
    setPlannerData(updated);
  };

  // Session CRUD
  const handleOpenAddSession = (dayIdx = null) => {
    setEditingSession(null);
    setDefaultSessionDay(dayIdx ?? selectedDay);
    setSessionModalOpen(true);
  };

  const handleOpenEditSession = (session) => {
    setEditingSession(session);
    setSessionModalOpen(true);
  };

  const handleSaveSession = (sessionData) => {
    if (sessionData.id) {
      plannerService.updateSession(sessionData.id, sessionData);
    } else {
      plannerService.addSession(sessionData);
    }
    setPlannerData(plannerService.loadData());
    showToast(sessionData.id ? 'Session updated.' : 'Session added to timetable.');
  };

  const handleDeleteSession = (sessionId) => {
    const updated = plannerService.deleteSession(sessionId);
    setPlannerData(updated);
    showToast('Session removed.');
  };

  // Focus Task CRUD
  const handleSaveTask = (taskData) => {
    const { data } = plannerService.addFocusTask(taskData);
    setPlannerData(data);
    showToast('Task added to Today’s Focus.');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Action & Navigation Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-[var(--color-border)]/50">
          {/* Week Date Navigation */}
          <div className="flex items-center gap-1 p-1 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs">
            <button
              type="button"
              onClick={handlePrevWeek}
              title="Previous Week"
              aria-label="Previous Week"
              className="p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleResetCurrentWeek}
              title="Click to return to current week"
              className="text-xs font-bold text-[var(--color-text-main)] px-2.5 py-1 rounded-md hover:bg-[var(--color-surface-secondary)] transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{formatWeekRangeLabel(plannerData.weekOffset || 0)}</span>
            </button>

            <button
              type="button"
              onClick={handleNextWeek}
              title="Next Week"
              aria-label="Next Week"
              className="p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Primary Button: Add Session */}
          <button
            type="button"
            onClick={() => handleOpenAddSession(selectedDay)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/25 hover:shadow-lg hover:shadow-[var(--primary)]/30 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Session</span>
          </button>
        </div>

        {/* Calendar Section: Horizontal Date Selector + Daily Agenda + AI Recommendation */}
        <section aria-label="Study Planner Calendar">
          <WeeklyScheduleCard
            plannerData={plannerData}
            selectedDay={selectedDay}
            onSelectDay={setSelectedDay}
            onToggleComplete={handleToggleComplete}
            onAddSessionForDay={handleOpenAddSession}
            onEditSession={handleOpenEditSession}
            onDeleteSession={handleDeleteSession}
            sideContent={
              <AiRecommendationCard
                plannerData={plannerData}
                onUpdatePlan={(updated) => {
                  setPlannerData(updated);
                  showToast('AI recommendation added to your timetable!');
                }}
              />
            }
          />
        </section>

        {/* Modals */}
        <SessionModal
          isOpen={sessionModalOpen}
          onClose={() => setSessionModalOpen(false)}
          session={editingSession}
          defaultDay={defaultSessionDay}
          onSave={handleSaveSession}
          onDelete={handleDeleteSession}
        />

        <TaskModal
          isOpen={taskModalOpen}
          onClose={() => setTaskModalOpen(false)}
          onSave={handleSaveTask}
        />
      </div>
    </DashboardLayout>
  );
}
