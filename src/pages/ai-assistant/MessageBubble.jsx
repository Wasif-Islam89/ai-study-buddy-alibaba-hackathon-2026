import React, { useState } from 'react';
import {
  Bot,
  User,
  Copy,
  Check,
  ThumbsUp,
  ThumbsDown,
  RotateCcw,
  HelpCircle,
  FileText,
  Sparkles,
} from 'lucide-react';

export default function MessageBubble({
  message,
  onFeedback,
  onRegenerate,
}) {
  const [copied, setCopied] = useState(false);
  const [selectedQuizAnswer, setSelectedQuizAnswer] = useState(null);

  const isUser = message.role === 'user';

  const handleCopy = () => {
    let textToCopy = '';
    if (isUser) {
      textToCopy = message.text || '';
    } else {
      const parts = [];
      if (message.content?.paragraphs) {
        parts.push(message.content.paragraphs.join('\n\n'));
      }
      if (message.content?.list?.length) {
        const plainList = message.content.list
          .map((item) => item.replace(/<[^>]*>?/gm, ''))
          .join('\n• ');
        parts.push('• ' + plainList);
      }
      if (message.content?.quiz) {
        parts.push(`Quiz: ${message.content.quiz.question}\n${message.content.quiz.options.join('\n')}`);
      }
      textToCopy = parts.join('\n\n') || message.text || '';
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedTime = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  // User Message
  if (isUser) {
    return (
      <div className="flex items-end justify-end gap-2.5 my-3 sm:my-4 group">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          {message.action && (
            <div className="text-[10px] font-semibold tracking-wider uppercase text-[var(--color-teal)] bg-[var(--color-teal-bg)] px-2 py-0.5 rounded-full mb-1">
              {message.action}
            </div>
          )}
          <div className="bg-[var(--color-navy)] text-white px-4 py-3 rounded-2xl rounded-tr-xs shadow-xs text-xs sm:text-sm leading-relaxed break-words">
            {message.text}
          </div>
          <span className="text-[10px] sm:text-[11px] text-[var(--color-text-subtle)] mt-1 mr-1">
            {formattedTime}
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-[var(--color-navy)] text-white flex items-center justify-center shrink-0 mb-4 shadow-xs">
          <User className="w-4 h-4" />
        </div>
      </div>
    );
  }

  // AI Message
  const content = message.content || {
    paragraphs: typeof message.text === 'string' ? [message.text] : [''],
  };

  return (
    <div className="flex items-start gap-3 my-4 sm:my-5 group">
      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-[var(--color-teal-bg)] text-[var(--color-teal)] border border-[var(--color-teal)]/20 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
        <Bot className="w-4 h-4 sm:w-5 sm:h-5" />
      </div>

      <div className="flex flex-col max-w-[92%] sm:max-w-[85%] min-w-0">
        <div className="bg-[var(--color-surface-card)] border border-[var(--color-border)] rounded-2xl rounded-tl-xs p-4 sm:p-5 shadow-xs text-[var(--color-text-main)] text-xs sm:text-sm leading-relaxed">
          {/* AI Header & Context Tag if any */}
          <div className="flex items-center justify-between gap-2 mb-3 pb-2.5 border-b border-[var(--color-border-subtle)]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-xs text-[var(--color-text-main)] flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[var(--primary)]" />
                Study Assistant
              </span>
            </div>

            {message.contextName && (
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--primary-light)] text-[var(--primary)] text-[11px] font-medium max-w-[200px] truncate">
                <FileText className="w-3 h-3 shrink-0" />
                <span className="truncate">{message.contextName}</span>
              </div>
            )}
          </div>

          {/* Paragraphs */}
          {content.paragraphs && content.paragraphs.length > 0 && (
            <div className="space-y-3">
              {content.paragraphs.map((p, idx) => (
                <p key={idx} className="text-[var(--color-text-main)] text-xs sm:text-sm leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
          )}

          {/* Structured Key List */}
          {content.list && content.list.length > 0 && (
            <div className="mt-3.5 pt-3 border-t border-[var(--color-border-subtle)] space-y-2">
              {content.list.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm">
                  <span className="text-[var(--primary)] font-bold shrink-0 mt-0.5">•</span>
                  <div
                    className="leading-relaxed text-[var(--color-text-main)] flex-1"
                    dangerouslySetInnerHTML={{ __html: item }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quiz Module */}
          {content.quiz && (
            <div className="mt-4 p-3.5 sm:p-4 rounded-xl bg-[var(--color-surface-secondary)] border border-[var(--color-border-subtle)] space-y-3">
              <div className="flex items-center gap-2 font-semibold text-xs sm:text-sm text-[var(--primary)]">
                <HelpCircle className="w-4 h-4" />
                <span>Concept Check Quiz</span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[var(--color-text-main)]">
                {content.quiz.question}
              </p>
              <div className="space-y-2">
                {content.quiz.options.map((opt, optIdx) => {
                  const letter = opt.trim().charAt(0);
                  const isSelected = selectedQuizAnswer === letter;
                  const isCorrect = content.quiz.answer && content.quiz.answer === letter;
                  let btnColor = 'bg-[var(--color-surface-card)] hover:border-[var(--primary)] border-[var(--color-border)]';

                  if (isSelected) {
                    btnColor = isCorrect
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200'
                      : 'bg-rose-50 border-rose-500 text-rose-800 dark:bg-rose-950/40 dark:text-rose-200';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      onClick={() => setSelectedQuizAnswer(letter)}
                      className={`w-full text-left p-2.5 sm:p-3 rounded-lg border text-xs sm:text-sm transition-all cursor-pointer ${btnColor}`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{opt}</span>
                        {isSelected && (
                          <span className="ml-2 font-bold text-xs shrink-0">
                            {isCorrect ? '✓ Correct!' : '✗ Try again'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Action Bar */}
          <div className="flex items-center justify-between pt-3 mt-3.5 border-t border-[var(--color-border-subtle)] text-[11px] text-[var(--color-text-subtle)]">
            <span>{formattedTime}</span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleCopy}
                title="Copy response"
                className="flex items-center gap-1 p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-[11px] text-emerald-600 font-medium">Copied!</span>
                  </>
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>

              {onFeedback && (
                <>
                  <button
                    type="button"
                    onClick={() => onFeedback(message.id, 'up')}
                    title="Helpful response"
                    className={`p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer ${
                      message.feedback === 'up'
                        ? 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/30'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    <ThumbsUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onFeedback(message.id, 'down')}
                    title="Not helpful"
                    className={`p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer ${
                      message.feedback === 'down'
                        ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/30'
                        : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-main)]'
                    }`}
                  >
                    <ThumbsDown className="w-3.5 h-3.5" />
                  </button>
                </>
              )}

              {onRegenerate && (
                <button
                  type="button"
                  onClick={() => onRegenerate(message.id)}
                  title="Regenerate response"
                  className="p-1.5 rounded-lg hover:bg-[var(--color-surface-secondary)] text-[var(--color-text-muted)] hover:text-[var(--color-text-main)] transition-colors cursor-pointer ml-0.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
