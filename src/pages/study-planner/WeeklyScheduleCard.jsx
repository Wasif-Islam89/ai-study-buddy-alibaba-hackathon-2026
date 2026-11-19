import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Check,
  Edit2,
  Trash2,
  Plus,
} from 'lucide-react';
import {
  DAY_NAMES,
  DAY_NAMES_FULL,
  dateForDayInWeek,
  formatShortDate,
  toISO,
  todayISO,
  formatTime12,
  plannerService,
  mondayIndexFromJsDay,
} from '../../services/plannerService';

export default function WeeklyScheduleCard({
  plannerData,
  selectedDay: controlledSelectedDay,
  onSelectDay,
  onToggleComplete,
  onAddSessionForDay,
  onEditSession,
  onDeleteSession,
  sideContent,
}) {
  const currentTodayISO = todayISO();
  const todayDayIdx = mondayIndexFromJsDay(new Date().getDay());

  // Support controlled or uncontrolled selectedDay
  const [internalSelectedDay, setInternalSelectedDay] = useState(todayDayIdx);
  const activeDay = controlledSelectedDay !== undefined ? controlledSelectedDay : internalSelectedDay;

  const handleSelectDay = (dayIdx) => {
    if (onSelectDay) {
      onSelectDay(dayIdx);
    } else {
      setInternalSelectedDay(dayIdx);
    }
  };

  // Selected date info
  const selectedDate = dateForDayInWeek(plannerData.weekOffset || 0, activeDay);
  const selectedDateISO = toISO(selectedDate);
  const isSelectedDateToday = selectedDateISO === currentTodayISO;
  const selectedDaySessions = plannerService.sessionsForDay(plannerData, activeDay);
  const selectedDayDuration = selectedDaySessions.reduce(
    (acc, s) => acc + (Number(s.duration) || 0),
    0
  );

  // Subject color styling
  const getSubjectColorStyles = (subject = '') => {
    const s = subject.toLowerCase();
    if (s.includes('comp') || s.includes('prog') || s.includes('c ')) {
      return {
        bar: 'bg-[var(--color-navy)]',
        badge: 'bg-[var(--color-navy-light)] text-[var(--color-navy)]',
      };
    }
    if (s.includes('math') || s.includes('calc')) {
      return {
        bar: 'bg-[var(--color-teal)]',
        badge: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)]',
      };
    }
    if (s.includes('phys')) {
      return {
        bar: 'bg-[var(--color-amber)]',
        badge: 'bg-[var(--color-amber-bg)] text-[var(--color-amber-text)]',
      };
    }
    if (s.includes('bio')) {
      return {
        bar: 'bg-[var(--color-status-success)]',
        badge: 'bg-[var(--color-status-success-bg)] text-[var(--color-status-success-text)]',
      };
    }
    return {
      bar: 'bg-[var(--color-teal)]',
      badge: 'bg-[var(--color-teal-bg)] text-[var(--color-teal)]',
    };
  };

  return (
    <div className="space-y-6">
      {/* 1. Horizontal Weekly Date Selector (7 compact selectable cards in 1 row on desktop) */}
      <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-2.5 sm:p-3.5 shadow-[var(--shadow-card)]">
        <div className="flex overflow-x-auto pb-1 sm:pb-0 scrollbar-none gap-2 sm:gap-2.5 sm:grid sm:grid-cols-7">
          {DAY_NAMES.map((name, dayIdx) => {
            const date = dateForDayInWeek(plannerData.weekOffset || 0, dayIdx);
            const dateISO = toISO(date);
            const isToday = dateISO === currentTodayISO;
            const isSelected = activeDay === dayIdx;
            const daySessions = plannerService.sessionsForDay(plannerData, dayIdx);
            const isRest = (plannerData.restDays || []).includes(dayIdx);

            return (
              <button
                key={dayIdx}
                type="button"
                onClick={() => handleSelectDay(dayIdx)}
                className={`group relative flex-1 min-w-[70px] sm:min-w-0 py-2.5 px-2 rounded-xl text-center transition-all cursor-pointer flex flex-col items-center justify-between border ${
                  isSelected
                    ? 'bg-[var(--primary)] border-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/25 ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--color-surface-card)]'
                    : isToday
                    ? 'bg-[var(--color-surface-card)] border-[var(--primary)]/50 text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
                    : 'bg-[var(--color-surface-card)] border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] hover:border-[var(--primary)]/30'
                }`}
              >
                {/* Weekday abbreviation */}
                <span
                  className={`text-[11px] font-bold uppercase tracking-wider ${
                    isSelected ? 'text-white/90' : 'text-[var(--color-text-muted)]'
                  }`}
                >
                  {name}
                </span>

                {/* Date Number */}
                <span
                  className={`text-base sm:text-lg font-black my-0.5 ${
                    isSelected ? 'text-white' : 'text-[var(--color-text-main)]'
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* Footer Indicator: Today badge, session indicator, or rest badge */}
                <div className="min-h-[18px] flex items-center justify-center">
                  {isToday ? (
                    <span
                      className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/25 text-white'
                          : 'bg-[var(--primary-light)] text-[var(--primary)]'
                      }`}
                    >
                      Today
                    </span>
                  ) : daySessions.length > 0 ? (
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {daySessions.length} {daySessions.length === 1 ? 'session' : 'sessions'}
                    </span>
                  ) : isRest ? (
                    <span
                      className={`text-[10px] font-medium ${
                        isSelected ? 'text-white/75' : 'text-[var(--color-text-subtle)]'
                      }`}
                    >
                      Rest
                    </span>
                  ) : (
                    <span
                      className={`w-1 h-1 rounded-full ${
                        isSelected ? 'bg-white/40' : 'bg-transparent'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Below Date Selector: Daily Agenda and Side Content (AI Suggestion) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Daily Agenda Column */}
        <div className={sideContent ? 'lg:col-span-8' : 'col-span-12'}>
          <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4">
            {/* Daily Agenda Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] flex items-center gap-2">
                    <span>
                      {DAY_NAMES_FULL[activeDay]}, {formatShortDate(selectedDate)}
                    </span>
                    {isSelectedDateToday && (
                      <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-[var(--primary)] text-white">
                        Today
                      </span>
                    )}
                  </h3>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {selectedDaySessions.length > 0 ? (
                      <span>
                        {selectedDaySessions.length}{' '}
                        {selectedDaySessions.length === 1 ? 'session' : 'sessions'} planned •{' '}
                        {Math.floor(selectedDayDuration / 60) > 0
                          ? `${Math.floor(selectedDayDuration / 60)}h `
                          : ''}
                        {selectedDayDuration % 60 > 0
                          ? `${selectedDayDuration % 60}m`
                          : ''}{' '}
                        total
                      </span>
                    ) : (
                      <span>No study sessions scheduled for this day</span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Sessions List OR Empty State */}
            {selectedDaySessions.length > 0 ? (
              <div className="space-y-2.5">
                {selectedDaySessions.map((session) => {
                  const isDone = plannerService.isCompleted(
                    plannerData,
                    selectedDateISO,
                    session.id
                  );
                  const colorStyles = getSubjectColorStyles(session.subject);

                  return (
                    <div
                      key={session.id}
                      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl border transition-all ${
                        isDone
                          ? 'bg-[var(--color-surface-secondary)]/40 border-[var(--color-border-subtle)] opacity-75'
                          : 'bg-[var(--color-surface-card)] border-[var(--color-border)] hover:border-[var(--primary)]/40 hover:shadow-xs'
                      }`}
                    >
                      {/* Left accent bar */}
                      <div
                        className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${
                          isDone ? 'bg-slate-300 dark:bg-slate-700' : colorStyles.bar
                        }`}
                      />

                      <div className="flex items-start sm:items-center gap-3 pl-2 min-w-0 flex-1">
                        {/* Completion Checkbox */}
                        <button
                          type="button"
                          onClick={() => onToggleComplete(selectedDateISO, session.id)}
                          aria-label={
                            isDone ? 'Mark session incomplete' : 'Mark session complete'
                          }
                          className={`w-6 h-6 rounded-lg border flex items-center justify-center shrink-0 transition-all cursor-pointer mt-0.5 sm:mt-0 ${
                            isDone
                              ? 'bg-emerald-500 border-emerald-500 text-white shadow-xs'
                              : 'border-[var(--color-border)] bg-[var(--color-surface-secondary)] hover:border-[var(--primary)] text-transparent hover:text-[var(--primary)]/40'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        </button>

                        {/* Time & Duration */}
                        <div className="flex sm:flex-col items-center sm:items-start gap-1.5 sm:gap-0.5 shrink-0 min-w-[95px]">
                          <span className="text-xs font-bold text-[var(--color-text-main)] flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-[var(--primary)] shrink-0" />
                            {formatTime12(session.time)}
                          </span>
                          <span className="text-[11px] text-[var(--color-text-muted)]">
                            {session.duration} mins
                          </span>
                        </div>

                        {/* Subject & Title */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold ${colorStyles.badge}`}
                            >
                              {session.subject}
                            </span>
                            {isDone && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
                                Completed
                              </span>
                            )}
                          </div>
                          <h4
                            className={`text-sm font-semibold mt-1 truncate ${
                              isDone
                                ? 'line-through text-[var(--color-text-muted)]'
                                : 'text-[var(--color-text-main)]'
                            }`}
                          >
                            {session.title || session.subject}
                          </h4>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-1 self-end sm:self-auto shrink-0 pl-2">
                        <button
                          type="button"
                          onClick={() => onEditSession(session)}
                          title="Edit Session"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--primary)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteSession(session.id)}
                          title="Delete Session"
                          className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty State (Compact, friendly, with one Add Session button) */
              <div className="flex flex-col items-center justify-center py-8 px-4 rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-secondary)]/30 text-center space-y-3">
                <div className="w-11 h-11 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center">
                  <CalendarIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--color-text-main)]">
                    No sessions planned for this day.
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm">
                    Keep your study momentum going or use this day to review and recharge.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddSessionForDay(activeDay)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Session</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Side Content (AI Study Recommendation) */}
        {sideContent && (
          <div className="lg:col-span-4">
            {sideContent}
          </div>
        )}
      </div>
    </div>
  );
}
