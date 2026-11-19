import React from 'react';
import { Link } from 'react-router-dom';
import logoInline from '../../assets/logos/AI Study Buddy Inline Logo.png';
import logoSquare from '../../assets/logos/AI Study Buddy Square Logo.png';
import favicon from '../../assets/logos/favicon.png';

export default function Logo({
  variant = 'horizontal', // 'horizontal' | 'inline' | 'square' | 'icon'
  size = 'md',            // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auth'
  showText = true,        // applied when variant is square / icon
  to = '/dashboard',      // string path or null/false for static
  className = '',
  imgClassName = '',
  alt = 'AI Study Buddy Logo',
}) {
  const isSquare = variant === 'square' || variant === 'icon';

  // Height presets for horizontal logo (width scales automatically with ~2.85:1 aspect ratio)
  const horizontalSizes = {
    xs: 'h-7 max-h-7',
    sm: 'h-8 sm:h-9 max-h-9',
    md: 'h-9 sm:h-10 max-h-10',
    lg: 'h-11 sm:h-12 max-h-12',
    xl: 'h-13 sm:h-14 max-h-14',
    '2xl': 'h-16 sm:h-18 max-h-18',
    auth: 'h-11 sm:h-12 max-h-12',
  };

  // Dimensions for square/icon logo mark
  const squareSizes = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7 sm:w-8 sm:h-8',
    md: 'w-9 h-9 sm:w-10 sm:h-10',
    lg: 'w-10 h-10 sm:w-12 sm:h-12',
    xl: 'w-14 h-14 sm:w-16 sm:h-16',
    '2xl': 'w-16 h-16 sm:w-20 sm:h-20',
    auth: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const imageSrc = isSquare ? (favicon || logoSquare) : logoInline;

  const content = (
    <div className={`inline-flex items-center gap-2.5 font-display font-bold select-none max-w-full overflow-hidden ${className}`}>
      {isSquare ? (
        <img
          src={imageSrc}
          alt={alt}
          className={`${squareSizes[size] || squareSizes.md} object-contain transition-transform duration-200 group-hover:scale-105 shrink-0 ${imgClassName}`}
        />
      ) : (
        <img
          src={imageSrc}
          alt={alt}
          className={`${horizontalSizes[size] || horizontalSizes.md} w-auto max-w-full object-contain pointer-events-none select-none transition-transform duration-200 group-hover:scale-105 shrink-0 ${imgClassName}`}
        />
      )}

      {showText && isSquare && (
        <span className="text-base sm:text-lg font-bold tracking-tight text-[var(--color-text-main)] truncate">
          AI Study <span className="text-[var(--primary)]">Buddy</span>
        </span>
      )}
    </div>
  );

  if (to) {
    return (
      <Link
        to={to}
        aria-label="AI Study Buddy Home"
        className="group inline-flex items-center max-w-full shrink-0 cursor-pointer focus:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-lg overflow-hidden"
      >
        {content}
      </Link>
    );
  }

  return content;
}
