import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';

const INITIAL_MESSAGES = [
  {
    id: 'welcome',
    role: 'ai',
    text: "Hello! I'm your AI Study Buddy. Ask me to explain a concept, quiz you on a topic, or summarize your notes.",
    time: 'Just now',
  },
];

const SUGGESTIONS = [
  'Explain recursion in C',
  'Key calculus derivative rules',
  'How to study for upcoming exam',
];

export default function FloatingChatbot({ isOpen, onToggle, onClose }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    const query = (textToSend || inputText).trim();
    if (!query) return;

    const userMsg = {
      id: 'user_' + Date.now(),
      role: 'user',
      text: query,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm ready to help! Reviewing your curriculum and study history to provide the best explanation.";
      const lower = query.toLowerCase();

      if (lower.includes('recursion')) {
        reply = "Recursion is where a function calls itself to solve smaller subproblems until hitting a base case. Remember: always define your base case first to avoid a stack overflow!";
      } else if (lower.includes('calculus') || lower.includes('derivative')) {
        reply = "Key derivative rules: Power Rule: d/dx(x^n) = n*x^(n-1). Product Rule: (uv)' = u'v + uv'. Chain Rule: d/dx(f(g(x))) = f'(g(x)) * g'(x).";
      } else if (lower.includes('exam') || lower.includes('study')) {
        reply = "Tip: Break study into 25-minute Pomodoro sessions, review high-yield flashcards first, and take practice quizzes rather than passively re-reading.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: 'ai_' + Date.now(),
          role: 'ai',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setIsTyping(false);
    }, 700);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        type="button"
        onClick={onToggle}
        aria-label="Toggle AI Assistant"
        className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[var(--primary)] text-white shadow-lg hover:shadow-[var(--primary)]/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
      </button>

      {/* Floating Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-40 w-[calc(100vw-32px)] sm:w-96 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] shadow-2xl overflow-hidden flex flex-col h-[480px] animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-secondary)]">
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)] text-white">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-display font-bold text-xs sm:text-sm">AI Study Buddy</h4>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active Assistant
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-[var(--primary)] text-white rounded-br-xs'
                      : 'bg-[var(--color-surface-secondary)] text-[var(--color-text-main)] border border-[var(--color-border)] rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-[var(--color-text-subtle)] mt-1 px-1">
                  {msg.time}
                </span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[var(--color-surface-secondary)] border border-[var(--color-border)] w-fit text-xs text-[var(--color-text-muted)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.2s]" />
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Suggestions */}
          <div className="p-2 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] flex gap-1.5 overflow-x-auto text-[10px]">
            {SUGGESTIONS.map((sug, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendMessage(sug)}
                className="px-2.5 py-1 rounded-full bg-[var(--color-surface-secondary)] border border-[var(--color-border)] hover:border-[var(--primary)]/50 text-[var(--color-text-main)] whitespace-nowrap cursor-pointer transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-2.5 border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-card)] flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask a study question..."
              className="flex-1 text-xs px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-base)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-1 focus:ring-[var(--primary)]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2 rounded-xl bg-[var(--primary)] text-white hover:bg-[var(--primary-dark)] disabled:opacity-40 transition-colors cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

