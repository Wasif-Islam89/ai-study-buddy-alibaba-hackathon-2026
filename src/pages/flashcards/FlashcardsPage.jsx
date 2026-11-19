import React, { useState, useMemo } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import DeckCard from './DeckCard';
import StudyModeView from './StudyModeView';
import CreateDeckModal from './CreateDeckModal';
import EditDeckModal from './EditDeckModal';
import FlashcardsHistoryPopover from './FlashcardsHistoryPopover';
import { flashcardService } from '../../services/flashcardService';
import {
  Layers,
  Plus,
  Search,
  History,
  FolderX,
  Sparkles,
  Award,
  CheckCircle2,
  Clock,
  Play,
  X,
  RotateCw,
  BookOpen,
} from 'lucide-react';

export default function FlashcardsPage() {
  // Lazy initialize decks and study history from LocalStorage
  const [decks, setDecks] = useState(() => flashcardService.getAllDecks());
  const [history, setHistory] = useState(() => flashcardService.getStudyHistory());
  const [activeDeckId, setActiveDeckId] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const reloadDecks = () => {
    const loadedDecks = flashcardService.getAllDecks();
    setDecks(loadedDecks);
    setHistory(flashcardService.getStudyHistory());
  };

  const activeDeck = decks.find((d) => d.id === activeDeckId) || null;

  // Extract unique subjects from actual decks
  const subjects = useMemo(() => {
    const set = new Set();
    decks.forEach((d) => {
      if (d.subject) set.add(d.subject.trim());
    });
    return ['all', ...Array.from(set)];
  }, [decks]);

  // Compute Learning Overview Metrics strictly from stored data
  const learningMetrics = useMemo(() => {
    const totalDecks = decks.length;
    let totalCards = 0;
    let cardsReviewed = 0;
    let knownCards = 0;

    decks.forEach((deck) => {
      if (Array.isArray(deck.cards)) {
        totalCards += deck.cards.length;
        deck.cards.forEach((card) => {
          if (card.status === 'known') {
            knownCards++;
            cardsReviewed++;
          } else if (card.status === 'practice') {
            cardsReviewed++;
          }
        });
      }
    });

    const overallMastery = totalCards > 0 ? Math.round((knownCards / totalCards) * 100) : 0;
    const reviewedPercent = totalCards > 0 ? Math.round((cardsReviewed / totalCards) * 100) : 0;

    return {
      totalDecks,
      totalCards,
      cardsReviewed,
      knownCards,
      overallMastery,
      reviewedPercent,
    };
  }, [decks]);

  // Featured "Continue Learning" deck based on actual recent history
  const recentStudyDeck = useMemo(() => {
    if (!history || history.length === 0 || decks.length === 0) return null;
    const latest = history[0];
    if (!latest || !latest.deckTitle) return null;
    const matchingDeck = decks.find(
      (d) => d.title.trim().toLowerCase() === latest.deckTitle.trim().toLowerCase()
    );
    if (!matchingDeck) return null;

    return {
      deck: matchingDeck,
      timestamp: latest.timestamp,
      score: latest.score,
    };
  }, [history, decks]);

  // Filter Decks by Search and Subject
  const filteredDecks = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return decks.filter((d) => {
      const matchesSearch =
        !q ||
        (d.title || '').toLowerCase().includes(q) ||
        (d.subject || '').toLowerCase().includes(q) ||
        (d.topic || '').toLowerCase().includes(q);

      const matchesFilter =
        activeFilter === 'all' ||
        (d.subject || '').toLowerCase() === activeFilter.toLowerCase();

      return matchesSearch && matchesFilter;
    });
  }, [decks, searchQuery, activeFilter]);

  // Create Deck Handler
  const handleGenerateDeck = (config) => {
    const newDeck = flashcardService.createIntelligentDeck(config);
    flashcardService.saveDeck(newDeck);
    reloadDecks();
    showToast(`Deck "${newDeck.title}" created successfully!`);
    setActiveDeckId(newDeck.id);
  };

  // Delete Deck Handler
  const handleDeleteDeck = (id) => {
    const target = decks.find((d) => d.id === id);
    flashcardService.deleteDeck(id);
    reloadDecks();
    if (activeDeckId === id) setActiveDeckId(null);
    showToast(`Deck "${target?.title || 'Selected'}" deleted.`);
  };

  // Clear History
  const handleClearHistory = () => {
    flashcardService.clearHistory();
    reloadDecks();
    showToast('Study history cleared.');
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[calc(100vh-14rem)] flex flex-col justify-between animate-in fade-in duration-200 text-left">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-2xl animate-in slide-in-from-bottom-5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {activeDeck ? (
          /* ================= Study Mode View ================= */
          <StudyModeView
            deck={activeDeck}
            onExit={() => setActiveDeckId(null)}
            onUpdateDeck={reloadDecks}
          />
        ) : (
          /* ================= Decks Dashboard View ================= */
          <div className="space-y-6 sm:space-y-8 flex-1">
            {/* 1. Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[var(--color-border)]/50">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-main)] tracking-tight">
                  Flashcards
                </h1>
                <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1">
                  Build knowledge through active recall and spaced repetition.
                </p>
              </div>

              <div className="flex items-center gap-2.5 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setIsHistoryOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] shadow-xs transition-colors cursor-pointer"
                  title="View study history"
                >
                  <History className="w-4 h-4 text-[var(--primary)]" />
                  <span>Study History</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
                  title="Create a new flashcard deck"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Deck</span>
                </button>
              </div>
            </div>

            {/* 2. Compact Learning Overview Metrics (Calculated strictly from actual data) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
              {/* Total Decks */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block">
                    Total Decks
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] mt-0.5">
                    {learningMetrics.totalDecks}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">
                    {subjects.length > 1 ? `${subjects.length - 1} subjects` : 'All topics'}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Layers className="w-5 h-5" />
                </div>
              </div>

              {/* Total Flashcards */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block">
                    Total Flashcards
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] mt-0.5">
                    {learningMetrics.totalCards}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">
                    Available to study
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300 flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
              </div>

              {/* Cards Reviewed */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block">
                    Cards Reviewed
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[var(--color-text-main)] mt-0.5">
                    {learningMetrics.cardsReviewed}
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">
                    {learningMetrics.reviewedPercent}% active recall
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              </div>

              {/* Overall Mastery */}
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] shadow-xs flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)] block">
                    Overall Mastery
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-[var(--primary)] mt-0.5">
                    {learningMetrics.overallMastery}%
                  </div>
                  <span className="text-[11px] text-[var(--color-text-muted)] mt-0.5 block">
                    {learningMetrics.knownCards} cards mastered
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* 3. Featured Learning Section ("Continue Learning" - only shown when actual data exists) */}
            {recentStudyDeck && (
              <div className="p-4 sm:p-5 rounded-2xl border border-[var(--primary)]/25 bg-[var(--primary-light)]/20 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-xs">
                    <RotateCw className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-light)] px-2 py-0.5 rounded-full">
                        Continue Learning
                      </span>
                      <span className="text-xs text-[var(--color-text-subtle)] truncate">
                        {recentStudyDeck.deck.subject}
                      </span>
                    </div>
                    <h3 className="text-sm sm:text-base font-bold text-[var(--color-text-main)] truncate mt-0.5">
                      {recentStudyDeck.deck.title}
                    </h3>
                    <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-[var(--color-text-subtle)]" />
                      <span>Last studied: {recentStudyDeck.timestamp}</span>
                      {recentStudyDeck.score && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[var(--primary)]">{recentStudyDeck.score}</span>
                        </>
                      )}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveDeckId(recentStudyDeck.deck.id)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer shrink-0"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Continue Studying</span>
                </button>
              </div>
            )}

            {/* 4. Deck Library Controls (Subject Filters & Search) */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
                {subjects.map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setActiveFilter(sub)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer whitespace-nowrap ${
                      activeFilter.toLowerCase() === sub.toLowerCase()
                        ? 'bg-[var(--primary)] text-white shadow-xs'
                        : 'bg-[var(--color-surface-card)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--primary)]/40 hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    {sub === 'all' ? 'All Subjects' : sub}
                  </button>
                ))}
              </div>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--color-text-subtle)]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search decks by title or topic..."
                  className="w-full pl-9 pr-8 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden focus:border-[var(--primary)] transition-colors shadow-2xs"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    title="Clear search"
                    className="absolute right-2.5 top-2 text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 5. Decks Grid & Empty States */}
            {decks.length === 0 ? (
              /* Global Empty State: No decks exist at all */
              <div className="flex flex-col items-center justify-center p-8 sm:p-14 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] space-y-4 my-6">
                <div className="w-14 h-14 rounded-2xl bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center shadow-xs">
                  <Layers className="w-7 h-7" />
                </div>
                <div className="max-w-md space-y-1.5">
                  <h3 className="text-lg font-bold text-[var(--color-text-main)]">
                    No Flashcard Decks Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--color-text-muted)] leading-relaxed">
                    Flashcards boost long-term retention through active recall and spaced repetition. Create a custom deck or let AI synthesize one from your study materials.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs sm:text-sm font-bold shadow-md shadow-[var(--primary)]/20 transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Your First Deck</span>
                </button>
              </div>
            ) : filteredDecks.length === 0 ? (
              /* Filter / Search Empty State */
              <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] space-y-3 my-6">
                <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] flex items-center justify-center">
                  <FolderX className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[var(--color-text-main)]">
                    No Matching Decks Found
                  </h4>
                  <p className="text-xs text-[var(--color-text-muted)] mt-1">
                    {searchQuery
                      ? `No decks match "${searchQuery}".`
                      : `No decks found for subject "${activeFilter}".`}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setActiveFilter('all');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
                >
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              /* Decks Grid with Uniform Card Heights */
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                {filteredDecks.map((deck) => (
                  <DeckCard
                    key={deck.id}
                    deck={deck}
                    onStudy={(id) => setActiveDeckId(id)}
                    onEdit={(d) => setEditingDeck(d)}
                    onDelete={handleDeleteDeck}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Modals & Popovers */}
        <CreateDeckModal
          isOpen={isCreateOpen}
          onClose={() => setIsCreateOpen(false)}
          onGenerate={handleGenerateDeck}
        />

        <EditDeckModal
          deck={editingDeck}
          isOpen={!!editingDeck}
          onClose={() => setEditingDeck(null)}
          onSave={() => {
            reloadDecks();
            showToast('Deck updated successfully.');
          }}
        />

        <FlashcardsHistoryPopover
          history={history}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onClear={handleClearHistory}
        />
      </div>
    </DashboardLayout>
  );
}
