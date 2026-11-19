import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Edit3, Save, Layers } from 'lucide-react';
import { flashcardService } from '../../services/flashcardService';

export default function EditDeckModal({
  deck,
  isOpen,
  onClose,
  onSave,
}) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [topic, setTopic] = useState('');
  const [cards, setCards] = useState([]);

  // New card inline state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [newTag, setNewTag] = useState('');
  const [newCode, setNewCode] = useState('');
  const [showAddCard, setShowAddCard] = useState(false);

  useEffect(() => {
    if (!deck || !isOpen) return;
    setTitle(deck.title || '');
    setSubject(deck.subject || '');
    setTopic(deck.topic || '');
    setCards(deck.cards ? JSON.parse(JSON.stringify(deck.cards)) : []);
    setShowAddCard(false);
  }, [deck, isOpen]);

  if (!isOpen || !deck) return null;

  const handleAddCard = (e) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    const created = {
      id: 'card_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      tag: newTag.trim() || 'Concept',
      question: newQuestion.trim(),
      answer: newAnswer.trim(),
      code: newCode.trim(),
      status: 'unseen',
      bookmarked: false,
    };

    setCards([...cards, created]);
    setNewQuestion('');
    setNewAnswer('');
    setNewTag('');
    setNewCode('');
    setShowAddCard(false);
  };

  const handleDeleteCard = (cardId) => {
    setCards(cards.filter((c) => c.id !== cardId));
  };

  const handleSaveDeck = () => {
    const updated = {
      ...deck,
      title: title.trim() || deck.title,
      subject: subject.trim() || deck.subject,
      topic: topic.trim() || deck.topic,
      cards,
    };

    flashcardService.saveDeck(updated);
    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
          <div className="flex items-center gap-2">
            <Edit3 className="w-4 h-4 text-[var(--primary)]" />
            <h3 className="text-base font-bold text-[var(--color-text-main)]">
              Edit Deck & Cards
            </h3>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Deck Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1">
                Deck Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[var(--color-text-main)] mb-1">
                Topic
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3 py-1.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-xs text-[var(--color-text-main)] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Cards List Header */}
          <div className="flex items-center justify-between pt-2 border-t border-[var(--color-border-subtle)]">
            <h4 className="text-sm font-bold text-[var(--color-text-main)]">
              Cards in Deck ({cards.length})
            </h4>

            <button
              type="button"
              onClick={() => setShowAddCard(!showAddCard)}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Card</span>
            </button>
          </div>

          {/* New Card Form */}
          {showAddCard && (
            <div className="p-4 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary-light)]/20 space-y-3 animate-in fade-in">
              <h5 className="text-xs font-bold text-[var(--primary)]">New Card Details</h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Question / Prompt"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] focus:outline-hidden"
                />
                <input
                  type="text"
                  placeholder="Concept Tag (e.g. Core Rule)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] focus:outline-hidden"
                />
              </div>
              <textarea
                rows={2}
                placeholder="Answer text..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs text-[var(--color-text-main)] focus:outline-hidden resize-none"
              />
              <textarea
                rows={2}
                placeholder="Optional Code snippet / example..."
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-card)] text-xs font-mono text-[var(--color-text-main)] focus:outline-hidden resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddCard(false)}
                  className="px-3 py-1 rounded-lg text-xs font-medium text-[var(--color-text-muted)]"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAddCard}
                  className="px-4 py-1.5 rounded-lg bg-[var(--primary)] text-white text-xs font-bold"
                >
                  Confirm Card
                </button>
              </div>
            </div>
          )}

          {/* Cards List */}
          <div className="space-y-2.5">
            {cards.map((c, idx) => (
              <div
                key={c.id || idx}
                className="p-3.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-secondary)]/40 hover:bg-[var(--color-surface-secondary)] flex items-start justify-between gap-3 text-xs"
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[var(--color-text-subtle)]">#{idx + 1}</span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--color-surface-card)] text-[var(--primary)] border border-[var(--color-border)]">
                      {c.tag || 'Concept'}
                    </span>
                    <span className="font-bold text-[var(--color-text-main)] truncate">
                      {c.question}
                    </span>
                  </div>
                  <p className="text-[var(--color-text-muted)] line-clamp-1">{c.answer}</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteCard(c.id)}
                  className="p-1 rounded-md text-[var(--color-text-subtle)] hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0"
                  title="Delete card"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-[var(--color-border)] text-xs font-semibold text-[var(--color-text-muted)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSaveDeck}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}

