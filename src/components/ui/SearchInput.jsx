import React, { forwardRef } from 'react';
import { Search, X } from 'lucide-react';

const SearchInput = forwardRef(function SearchInput(
  {
    value = '',
    onChange,
    onClear,
    placeholder = 'Search topics, quizzes, flashcards... (Ctrl+K)',
    shortcut = 'Ctrl K',
    className = '',
    size = 'md',
    autoFocus = false,
    ...props
  },
  ref
) {
  const handleClear = () => {
    if (onClear) onClear();
    else if (onChange) onChange({ target: { value: '' } });
  };

  const sizeClasses = {
    sm: 'py-1.5 text-xs pl-8 pr-16',
    md: 'py-2.5 text-sm pl-10 pr-20',
    lg: 'py-3 text-base pl-11 pr-24',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5 left-2.5',
    md: 'w-4 h-4 left-3.5',
    lg: 'w-5 h-5 left-4',
  };

  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <Search
        className={`absolute ${iconSizes[size] || iconSizes.md} text-[var(--color-text-subtle)] pointer-events-none`}
      />

      <input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        autoFocus={autoFocus}
        placeholder={placeholder}
        className={`w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] placeholder:text-[var(--color-text-subtle)] focus:outline-none focus:ring-2 focus:ring-[var(--color-teal)] focus:border-transparent transition-all duration-200 ${
          sizeClasses[size] || sizeClasses.md
        }`}
        {...props}
      />

      <div className="absolute right-3 flex items-center gap-1.5">
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Clear search text"
            className="p-1 rounded-md text-[var(--color-text-subtle)] hover:text-[var(--color-text-main)] hover:bg-[var(--color-surface-secondary)] transition-colors cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {shortcut && !value && (
          <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 text-[10px] font-semibold tracking-wide text-[var(--color-text-subtle)] bg-[var(--color-surface-secondary)] border border-[var(--color-border)] rounded">
            {shortcut}
          </kbd>
        )}
      </div>
    </div>
  );
});

export default SearchInput;

