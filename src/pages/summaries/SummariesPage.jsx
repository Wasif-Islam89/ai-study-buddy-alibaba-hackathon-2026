import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import SummaryGenerator from './SummaryGenerator';
import SummaryCard from './SummaryCard';
import SummaryDetailView from './SummaryDetailView';
import GenerationOverlay from './GenerationOverlay';
import { summaryService } from '../../services/summaryService';
import {
  BookOpen,
  Search,
  Sparkles,
  Plus,
  FolderX,
  Clock,
  Layers,
  FileText,
  Filter,
} from 'lucide-react';

export default function SummariesPage() {
  // Lazy initialize summaries from LocalStorage (study_buddy_summaries)
  const [summaries, setSummaries] = useState(() => summaryService.getAllSummaries());
  const [activeSummaryId, setActiveSummaryId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isGenerating, setIsGenerating] = useState(false);

  const activeSummary = summaries.find((s) => s.id === activeSummaryId) || null;

  // Derive subjects list
  const subjects = useMemo(() => {
    const set = new Set();
    summaries.forEach((s) => {
      if (s.subject) set.add(s.subject);
    });
    return ['All', ...Array.from(set)];
  }, [summaries]);

  // Derive analytics overview
  const stats = useMemo(() => {
    const totalCount = summaries.length;
    let totalMinutes = 0;
    let totalWords = 0;

    summaries.forEach((s) => {
      const match = (s.readingTime || '').match(/\d+/);
      const mins = match ? parseInt(match[0], 10) : 2;
      totalMinutes += mins;
      totalWords += s.wordCount || 350;
    });

    const uniqueSubjects = new Set(summaries.map((s) => s.subject).filter(Boolean)).size;
    const avgWords = totalCount > 0 ? Math.round(totalWords / totalCount) : 0;

    return {
      totalCount,
      totalMinutes,
      uniqueSubjects,
      avgWords,
    };
  }, [summaries]);

  // Filter and sort
  const filteredSummaries = useMemo(() => {
    return summaries
      .filter((s) => {
        const matchesSubject = selectedSubject === 'All' || s.subject === selectedSubject;
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          (s.title || '').toLowerCase().includes(q) ||
          (s.subject || '').toLowerCase().includes(q) ||
          (s.overview || '').toLowerCase().includes(q);
        return matchesSubject && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'title') {
          return (a.title || '').localeCompare(b.title || '');
        }
        if (sortBy === 'time-asc') {
          const aMin = parseInt((a.readingTime || '2').match(/\d+/)?.[0] || '2', 10);
          const bMin = parseInt((b.readingTime || '2').match(/\d+/)?.[0] || '2', 10);
          return aMin - bMin;
        }
        if (sortBy === 'time-desc') {
          const aMin = parseInt((a.readingTime || '2').match(/\d+/)?.[0] || '2', 10);
          const bMin = parseInt((b.readingTime || '2').match(/\d+/)?.[0] || '2', 10);
          return bMin - aMin;
        }
        // default newest (by index/id)
        return (b.id || '').localeCompare(a.id || '');
      });
  }, [summaries, selectedSubject, searchQuery, sortBy]);

  // Handle generation start
  const handleStartGeneration = (config) => {
    setIsGenerating(true);

    setTimeout(() => {
      const generated = summaryService.generateIntelligentSummary(config);
      summaryService.saveSummary(generated);

      const updated = summaryService.getAllSummaries();
      setSummaries(updated);
      setIsGenerating(false);
      setActiveSummaryId(generated.id);
    }, 1800);
  };

  const handleCancelGeneration = () => {
    setIsGenerating(false);
  };

  const handleDeleteSummary = (id) => {
    summaryService.deleteSummary(id);
    const updated = summaryService.getAllSummaries();
    setSummaries(updated);
    if (activeSummaryId === id) {
      setActiveSummaryId(null);
    }
  };

  const handleRegenerate = (summary) => {
    handleStartGeneration({
      title: summary.title,
      subject: summary.subject,
      source: summary.source,
      summaryType: summary.summaryType,
      length: summary.length,
      difficulty: summary.difficulty,
      language: summary.language || 'English',
    });
  };

  const scrollToGenerator = () => {
    const el = document.getElementById('summary-generator-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* If Active Summary is selected, show Detail View */}
        {activeSummary ? (
          <SummaryDetailView
            summary={activeSummary}
            onBack={() => setActiveSummaryId(null)}
            onRegenerate={handleRegenerate}
            onDelete={handleDeleteSummary}
          />
        ) : (
          /* Main View: Header + Stats + Generator + Library */
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)]">
                  AI Summaries
                </h1>
                <p className="text-sm text-[var(--color-text-muted)] mt-1">
                  Synthesize complex study topics, notes, and textbook excerpts into high-yield revision guides.
                </p>
              </div>

              <button
                type="button"
                onClick={scrollToGenerator}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white font-bold text-xs shadow-xs transition-colors cursor-pointer w-fit"
              >
                <Plus className="w-4 h-4" />
                <span>New Summary</span>
              </button>
            </div>

            {/* Compact Metric Strip */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] truncate">Saved Summaries</span>
                  <BookOpen className="w-4 h-4 text-[var(--primary)] shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  {stats.totalCount}
                </div>
                <p className="text-[11px] text-[var(--color-text-subtle)] truncate">Active study guides</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] truncate">Est. Read Time</span>
                  <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  ~{stats.totalMinutes}m
                </div>
                <p className="text-[11px] text-[var(--color-text-subtle)] truncate">Total revision reading time</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] truncate">Subjects Covered</span>
                  <Layers className="w-4 h-4 text-[var(--color-teal)] shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  {stats.uniqueSubjects}
                </div>
                <p className="text-[11px] text-[var(--color-text-subtle)] truncate">Distinct academic areas</p>
              </div>

              <div className="p-3.5 sm:p-4 rounded-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] shadow-2xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[var(--color-text-muted)] truncate">Avg. Depth</span>
                  <FileText className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
                  ~{stats.avgWords}
                </div>
                <p className="text-[11px] text-[var(--color-text-subtle)] truncate">Words per summary</p>
              </div>
            </div>

            {/* Generator Component */}
            <SummaryGenerator
              onGenerate={handleStartGeneration}
              isGenerating={isGenerating}
            />

            {/* Saved Summaries Library Section */}
            <div className="space-y-4 pt-2">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-lg font-bold text-[var(--color-text-main)]">
                    My Study Summaries
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[var(--primary-light)] text-[var(--primary)]">
                    {filteredSummaries.length}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search summaries..."
                      className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)]"
                    />
                  </div>

                  {/* Sort selector */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs font-semibold text-[var(--color-text-main)] focus:outline-hidden focus:border-[var(--primary)]"
                  >
                    <option value="newest">Newest First</option>
                    <option value="time-asc">Shortest Read</option>
                    <option value="time-desc">Longest Read</option>
                    <option value="title">Title (A - Z)</option>
                  </select>
                </div>
              </div>

              {/* Subject Filter Pills */}
              {subjects.length > 2 && (
                <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                  <span className="text-xs text-[var(--color-text-subtle)] font-medium mr-1 flex items-center gap-1 shrink-0">
                    <Filter className="w-3 h-3" />
                    Subject:
                  </span>
                  {subjects.map((subj) => {
                    const isSelected = selectedSubject === subj;
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => setSelectedSubject(subj)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-[var(--primary)] text-white shadow-xs'
                            : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Grid of Saved Summaries */}
              {filteredSummaries.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] flex items-center justify-center">
                    <FolderX className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-[var(--color-text-main)]">
                      No Summaries Match
                    </h4>
                    <p className="text-xs text-[var(--color-text-muted)] mt-1 max-w-sm">
                      {searchQuery || selectedSubject !== 'All'
                        ? 'Try clearing your search query or subject filter to view all saved summaries.'
                        : 'Use the generator above to create your first intelligent study summary!'}
                    </p>
                  </div>
                  {(searchQuery || selectedSubject !== 'All') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedSubject('All');
                      }}
                      className="px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs font-bold text-[var(--color-text-main)] hover:bg-[var(--color-border)] transition-colors cursor-pointer"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredSummaries.map((summary) => (
                    <SummaryCard
                      key={summary.id}
                      summary={summary}
                      onOpen={(id) => setActiveSummaryId(id)}
                      onDelete={handleDeleteSummary}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Generation Progress Stepper Overlay */}
        <GenerationOverlay
          isOpen={isGenerating}
          onCancel={handleCancelGeneration}
        />
      </div>
    </DashboardLayout>
  );
}

