import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Shuffle,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Layers,
  Sparkles,
} from 'lucide-react';
import FlashcardItem from './FlashcardItem';
import { flashcardService } from '../../services/flashcardService';

export default function StudyModeView({
  deck,
  onExit,
  onUpdateDeck,
}) {
  const [filterMode, setFilterMode] = useState('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [cards, setCards] = useState([]);
  const [isStatsOpen, setIsStatsOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Filter cards based on filterMode
  useEffect(() => {
    if (!deck || !Array.isArray(deck.cards)) return;

    let filtered = [...deck.cards];
    if (filterMode === 'bookmarked') {
      filtered = filtered.filter((c) => c.bookmarked);
    } else if (filterMode === 'practice') {
      filtered = filtered.filter((c) => c.status === 'practice');
    } else if (filterMode === 'known') {
      filtered = filtered.filter((c) => c.status === 'known');
    }

    setCards(filtered);
    setCurrentIndex(0);
    setIsFlipped(false);
    setIsCompleted(false);
  }, [deck, filterMode]);

  const stats = flashcardService.calculateDeckStats(deck);
  const currentCard = cards[currentIndex] || null;
  const totalCards = cards.length;
  const progressPercent = totalCards > 0 ? Math.round(((currentIndex + 1) / totalCards) * 100) : 0;

  const handleNext = () => {
    setIsFlipped(false);
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      // Log study activity
      flashcardService.logStudyActivity(
        deck.title,
        `${stats.masteryPercent}% Mastery`
      );
    }
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const shuffled = [...cards].sort(() => 0.5 - Math.random());
    setCards(shuffled);
    setCurrentIndex(0);
  };

  const handleToggleBookmark = () => {
    if (!currentCard) return;
    const newBookmarked = !currentCard.bookmarked;
    flashcardService.updateCardStatus(deck.id, currentCard.id, undefined, newBookmarked);
    onUpdateDeck();
  };

  const handleMarkStatus = (status) => {
    if (!currentCard) return;
    flashcardService.updateCardStatus(deck.id, currentCard.id, status);
    onUpdateDeck();
    handleNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-left">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--color-border)]">
        <button
          type="button"
          onClick={onExit}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-[var(--color-text-muted)] hover:text-[var(--primary)] transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Decks</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsStatsOpen(!isStatsOpen)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isStatsOpen
                ? 'border-[var(--primary)] bg-[var(--primary-light)] text-[var(--primary)]'
                : 'border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5 text-[var(--primary)]" />
            <span>Mastery Stats ({stats.masteryPercent}%)</span>
          </button>
        </div>
      </div>

      {/* Expandable Stats Panel */}
      {isStatsOpen && (
        <div className="p-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] grid grid-cols-2 sm:grid-cols-4 gap-3 text-center animate-in fade-in shadow-xs">
          <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)]">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block uppercase tracking-wider">Total Cards</span>
            <span className="text-lg font-extrabold text-[var(--color-text-main)]">
              {stats.total}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30">
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 block uppercase tracking-wider">Mastered</span>
            <span className="text-lg font-extrabold text-emerald-600">
              {stats.known}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-300 block uppercase tracking-wider">Needs Practice</span>
            <span className="text-lg font-extrabold text-amber-600">
              {stats.practice}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-[var(--color-surface-secondary)]">
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] block uppercase tracking-wider">Mastery Level</span>
            <span className="text-lg font-extrabold text-[var(--primary)]">
              {stats.masteryPercent}%
            </span>
          </div>
        </div>
      )}

      {/* Title & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[var(--color-text-main)]">
            {deck.title}
          </h2>
          <p className="text-xs text-[var(--color-text-muted)] mt-1">
            {deck.subject} • {deck.difficulty} • {totalCards} cards in this session
          </p>
        </div>

        {/* Filter Mode Chips */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] text-xs overflow-x-auto">
          {[
            { id: 'all', label: 'All Cards' },
            { id: 'bookmarked', label: 'Bookmarked' },
            { id: 'practice', label: 'Practice' },
            { id: 'known', label: 'Mastered' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterMode(tab.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer whitespace-nowrap ${
                filterMode === tab.id
                  ? 'bg-[var(--color-surface-card)] text-[var(--primary)] shadow-xs'
                  : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Flashcard Container */}
      {isCompleted ? (
        /* Completed State */
        <div className="max-w-md mx-auto p-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-center space-y-6 shadow-md">
          <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div>
            <h3 className="text-xl font-extrabold text-[var(--color-text-main)]">
              Deck Session Complete!
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-1.5 leading-relaxed">
              You reviewed all {totalCards} cards. Your updated mastery for this deck is {stats.masteryPercent}%.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              type="button"
              onClick={() => {
                setCurrentIndex(0);
                setIsCompleted(false);
                setIsFlipped(false);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Study Again</span>
            </button>

            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--color-border)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer"
            >
              <span>Back to Decks</span>
            </button>
          </div>
        </div>
      ) : totalCards === 0 ? (
        <div className="max-w-md mx-auto p-12 rounded-3xl border border-dashed border-[var(--color-border)] bg-[var(--color-surface-card)] text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] flex items-center justify-center mx-auto">
            <Layers className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[var(--color-text-main)]">No Cards in this View</h4>
          <p className="text-xs text-[var(--color-text-muted)]">
            Try switching filter to "All Cards" or adding new cards.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Progress Bar & Counter */}
          <div className="max-w-xl mx-auto space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[var(--color-text-muted)]">
              <span>
                Card {currentIndex + 1} of {totalCards}
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* 3D Flip Card */}
          <FlashcardItem
            card={currentCard}
            isFlipped={isFlipped}
            onFlip={() => setIsFlipped(!isFlipped)}
            onToggleBookmark={handleToggleBookmark}
            onMarkStatus={handleMarkStatus}
          />

          {/* Navigation Controls Bar */}
          <div className="max-w-xl mx-auto flex items-center justify-between gap-3 pt-2">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={handlePrev}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-xs font-semibold text-[var(--color-text-main)] transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShuffle}
                title="Shuffle Cards"
                className="p-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer shadow-xs"
              >
                <Shuffle className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsFlipped(!isFlipped)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Flip Card</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <span>{currentIndex < totalCards - 1 ? 'Next' : 'Finish'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
