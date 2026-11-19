import React from 'react';
import { Sparkles, Bot, PlusCircle, CheckCircle2 } from 'lucide-react';
import {
  plannerService,
  addDaysISO,
  todayISO,
  mondayIndexFromJsDay,
  makeId,
} from '../../services/plannerService';

export default function AiRecommendationCard({ plannerData, onUpdatePlan }) {
  const weakTopic = plannerData.weakTopic || 'Recursion';
  const weakTopicSubject = plannerData.weakTopicSubject || 'C Programming';

  const alreadyScheduled = (plannerData.sessions || []).some((s) =>
    (s.title || '').toLowerCase().includes(weakTopic.toLowerCase())
  );
  const isAddressed = plannerData.weakTopicAddressed || alreadyScheduled;

  const handleAddToPlan = () => {
    const tomorrow = mondayIndexFromJsDay(
      new Date(addDaysISO(todayISO(), 1) + 'T00:00:00').getDay()
    );
    const freeSlot = plannerService.findFreeSlot(
      plannerData,
      tomorrow,
      '09:00',
      30
    );

    const updatedData = { ...plannerData };
    plannerService.colorForSubject(updatedData, weakTopicSubject);

    updatedData.sessions.push({
      id: makeId('s'),
      day: tomorrow,
      subject: weakTopicSubject,
      title: 'Review: ' + weakTopic,
      time: freeSlot,
      duration: 30,
    });
    updatedData.weakTopicAddressed = true;

    plannerService.saveData(updatedData);
    onUpdatePlan?.(updatedData);
  };

  return (
    <div className="relative overflow-hidden bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 flex flex-col justify-between">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-[var(--primary)]/10 blur-2xl pointer-events-none" />

      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)]">
                AI Schedule Suggestion
              </h2>
              <span className="text-[11px] text-[var(--color-text-muted)]">
                Targeted review recommendation
              </span>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[var(--primary-light)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Smart Tip
          </span>
        </div>

        {/* Suggestion Body */}
        <p className="text-xs sm:text-sm text-[var(--color-text-main)] leading-relaxed mt-2">
          {isAddressed ? (
            <span>
              A dedicated revision session for{' '}
              <strong className="text-[var(--primary)] font-bold">"{weakTopic}"</strong> in{' '}
              <span className="font-semibold">{weakTopicSubject}</span> is scheduled on your timetable.
            </span>
          ) : (
            <span>
              We noticed you could benefit from practicing{' '}
              <strong className="text-[var(--primary)] font-bold">"{weakTopic}"</strong> in{' '}
              <span className="font-semibold">{weakTopicSubject}</span>. We suggest adding a 30-minute review session tomorrow.
            </span>
          )}
        </p>
      </div>

      {/* Action / Status */}
      <div className="pt-2">
        {!isAddressed ? (
          <button
            type="button"
            onClick={handleAddToPlan}
            className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add Session to Timetable</span>
          </button>
        ) : (
          <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
            <CheckCircle2 className="w-4 h-4" />
            <span>Scheduled in Study Plan</span>
          </div>
        )}
      </div>
    </div>
  );
}
