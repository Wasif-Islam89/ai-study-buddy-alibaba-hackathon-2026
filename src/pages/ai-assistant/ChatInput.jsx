import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Sparkles,
  Mic,
  Paperclip,
  X,
  BookOpen,
  HelpCircle,
  Layers,
  GraduationCap,
  Lightbulb,
  Loader2,
} from 'lucide-react';

const QUICK_STUDY_ACTIONS = [
  {
    id: 'explain',
    label: 'Explain Topic',
    icon: Lightbulb,
    prompt: 'Please explain this topic in clear, simple terms with an intuitive analogy.',
  },
  {
    id: 'summarize',
    label: 'Summarize',
    icon: BookOpen,
    prompt: 'Summarize the key concepts, main rules, and core takeaways for this subject.',
  },
  {
    id: 'quiz',
    label: 'Generate Quiz',
    icon: HelpCircle,
    prompt: 'Create a concept-check quiz question with multiple-choice options to test my understanding.',
  },
  {
    id: 'flashcards',
    label: 'Create Flashcards',
    icon: Layers,
    prompt: 'Generate 3 high-yield study flashcards with front questions and back answers.',
  },
  {
    id: 'revision',
    label: 'Exam Revision',
    icon: GraduationCap,
    prompt: 'Provide a high-yield exam preparation checklist with must-know rules and common pitfalls.',
  },
];

export default function ChatInput({
  onSendMessage,
  isGenerating,
  activeContext,
  onClearContext,
  onAttachContext,
}) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef(null);

  // Auto-focus input on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const handleSend = (overrideAction = null) => {
    const trimmed = text.trim();
    if (!trimmed && !overrideAction) return;

    onSendMessage({
      text: trimmed,
      action: overrideAction,
    });
    setText('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isGenerating && text.trim()) {
        handleSend();
      }
    }
  };

  const handleActionClick = (actionItem) => {
    if (isGenerating) return;

    if (text.trim()) {
      // If user already typed something, send it tagged with this action
      handleSend(actionItem.id);
    } else {
      // If input is empty, prefill with action template and focus
      setText(actionItem.prompt);
      if (textareaRef.current) {
        textareaRef.current.focus();
        setTimeout(() => {
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
          }
        }, 50);
      }
    }
  };

  const handleVoiceToggle = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please type your message.');
      return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    if (!isListening) {
      setIsListening(true);
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? prev + ' ' + transcript : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };
    } else {
      setIsListening(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Quick Action Chips Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-semibold text-[var(--color-text-subtle)] shrink-0 flex items-center gap-1.5 pl-0.5">
          <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
          <span className="hidden sm:inline">Study Tools:</span>
        </span>
        {QUICK_STUDY_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={() => handleActionClick(action)}
              disabled={isGenerating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[var(--color-border)] bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary-light)]/40 transition-all cursor-pointer shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Context Banner if material is attached */}
      {activeContext && (
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] text-xs font-medium border border-[var(--primary)]/20 animate-in fade-in">
          <div className="flex items-center gap-2 truncate">
            <Paperclip className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">Active Context: {activeContext.name}</span>
          </div>
          <button
            type="button"
            onClick={onClearContext}
            title="Detach context material"
            className="p-1 rounded-md hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Composer Box */}
      <div className="relative flex items-end gap-2 bg-[var(--color-surface-secondary)] border border-[var(--color-border)] focus-within:border-[var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary)]/20 rounded-2xl p-2.5 transition-all shadow-xs">
        {/* Attach File / Material button */}
        <button
          type="button"
          onClick={onAttachContext}
          title={activeContext ? `Attached: ${activeContext.name}` : "Attach study notes or material context"}
          className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 ${
            activeContext
              ? 'text-[var(--primary)] bg-[var(--primary-light)]'
              : 'text-[var(--color-text-muted)] hover:text-[var(--primary)] hover:bg-[var(--color-surface-card)]'
          }`}
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Text Area Input */}
        <textarea
          ref={textareaRef}
          rows={1}
          value={text}
          disabled={isGenerating}
          onChange={(e) => {
            setText(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${Math.min(e.target.scrollHeight, 140)}px`;
          }}
          onKeyDown={handleKeyDown}
          placeholder={
            isGenerating
              ? 'Study Buddy is responding...'
              : 'Ask a question or request an explanation... (Enter to send, Shift+Enter for new line)'
          }
          className="flex-1 max-h-36 bg-transparent text-xs sm:text-sm text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-hidden resize-none py-1 px-1 leading-relaxed disabled:opacity-60"
        />

        {/* Voice Dictation button */}
        <button
          type="button"
          onClick={handleVoiceToggle}
          disabled={isGenerating}
          title={isListening ? 'Stop listening' : 'Voice input'}
          className={`p-2 rounded-xl transition-colors cursor-pointer shrink-0 disabled:opacity-50 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse'
              : 'text-[var(--color-text-muted)] hover:text-[var(--primary)] hover:bg-[var(--color-surface-card)]'
          }`}
        >
          <Mic className="w-4 h-4" />
        </button>

        {/* Send button */}
        <button
          type="button"
          onClick={() => handleSend()}
          disabled={!text.trim() || isGenerating}
          title="Send message"
          className="p-2.5 rounded-xl bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer shrink-0"
        >
          {isGenerating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
        </button>
      </div>

      <div className="flex items-center justify-between text-[11px] text-[var(--color-text-subtle)] px-1">
        <span>Press <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] font-mono text-[10px]">Enter</kbd> to send, <kbd className="px-1.5 py-0.5 rounded bg-[var(--color-surface-secondary)] border border-[var(--color-border)] font-mono text-[10px]">Shift+Enter</kbd> for line break</span>
        <span className="hidden sm:inline">AI Study Buddy v2.0</span>
      </div>
    </div>
  );
}
