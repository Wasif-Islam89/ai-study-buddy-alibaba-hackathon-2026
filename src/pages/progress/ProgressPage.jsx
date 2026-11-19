import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { analyticsService } from '../../services/analyticsService';
import { progressService } from '../../services/progressService';
import AnalyticsOverviewCards from './components/AnalyticsOverviewCards';
import LearningActivityChart from './components/LearningActivityChart';
import SubjectPerformanceGrid from './components/SubjectPerformanceGrid';
import ToolAnalyticsGrid from './components/ToolAnalyticsGrid';
import PerformanceInsightsCard from './components/PerformanceInsightsCard';
import RecentActivityFeed from './components/RecentActivityFeed';
import {
  RotateCcw,
  Play,
  AlertTriangle,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function ProgressPage() {
  const [range, setRange] = useState('month'); // 'week' | 'month' | 'all'
  const [metrics, setMetrics] = useState(null);

  const loadMetrics = () => {
    const data = analyticsService.computeDashboardMetrics(range);
    setMetrics(data);
  };

  useEffect(() => {
    loadMetrics();

    // Listen for storage updates across tabs/actions
    const handleStorageChange = () => {
      loadMetrics();
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [range]);

  const handleLoadSample = () => {
    progressService.loadDemoData();
    loadMetrics();
  };

  const handleClearSample = () => {
    progressService.clearDemoData();
    loadMetrics();
  };

  if (!metrics) return null;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
        {/* A. Page Header & Time Range Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]/50">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
              Learning Analytics
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              Track your learning journey, understand your performance, and discover opportunities to improve.
            </p>
          </div>

          {/* Time Range Filter Selector */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs text-xs font-semibold self-start md:self-auto">
            {[
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' },
              { id: 'all', label: 'All Time' },
            ].map((btn) => (
              <button
                key={btn.id}
                type="button"
                onClick={() => setRange(btn.id)}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  range === btn.id
                    ? 'bg-[var(--primary)] text-white shadow-xs font-bold'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Data Banner (When Previewing Sample Activity) */}
        {metrics.isDemo && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-200 text-xs sm:text-sm">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                <strong>Viewing Sample Activity</strong> — This preview displays realistic demo data to explore all analytics features.
              </span>
            </div>
            <button
              type="button"
              onClick={handleClearSample}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs hover:bg-amber-700 transition-colors shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Real Data</span>
            </button>
          </div>
        )}

        {/* Genuine Empty State Banner (When New Student Has No Records) */}
        {!metrics.hasData && !metrics.isDemo && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-xs">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-[var(--color-text-main)]">
                No activity recorded yet for {range === 'week' ? 'this week' : range === 'month' ? 'this month' : 'all time'}
              </h3>
              <p className="text-xs text-[var(--color-text-muted)]">
                Study sessions, quiz completions, and flashcard reviews will automatically update this dashboard in real time.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Preview with Sample Activity</span>
            </button>
          </div>
        )}

        {/* B. Overall Performance Overview Cards */}
        <section aria-label="Performance Overview">
          <AnalyticsOverviewCards overview={metrics.overview} />
        </section>

        {/* C. Learning Activity Analytics Chart */}
        <section aria-label="Learning Activity Chart">
          <LearningActivityChart chartData={metrics.chartData} range={range} />
        </section>

        {/* D. Subject-wise Performance */}
        <section aria-label="Subject Performance">
          <SubjectPerformanceGrid subjectAnalytics={metrics.subjectAnalytics} />
        </section>

        {/* E. Tool-wise Learning Analytics */}
        <section aria-label="Tool Analytics">
          <ToolAnalyticsGrid toolAnalytics={metrics.toolAnalytics} />
        </section>

        {/* F & G. Performance Insights (Left) & Recent Learning Activity (Right) */}
        <section aria-label="Insights and Activity" className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-5">
            <PerformanceInsightsCard
              insights={metrics.insights}
              hasData={metrics.hasData}
            />
          </div>

          <div className="lg:col-span-7">
            <RecentActivityFeed activities={metrics.recentActivities} />
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
