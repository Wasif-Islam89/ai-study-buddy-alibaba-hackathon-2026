import React, { useState, useRef, useEffect } from 'react';

export default function Dropdown({
  trigger,
  children,
  align = 'right',
  className = '',
  panelClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggle = () => setIsOpen((prev) => !prev);
  const close = () => setIsOpen(false);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <div onClick={toggle} className="cursor-pointer">
        {typeof trigger === 'function' ? trigger({ isOpen, toggle, close }) : trigger}
      </div>

      {isOpen && (
        <div
          role="menu"
          className={`absolute ${
            align === 'right' ? 'right-0' : 'left-0'
          } mt-2 origin-top-right rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] text-[var(--color-text-main)] shadow-[var(--shadow-dropdown)] z-50 p-1.5 focus:outline-none animate-in fade-in zoom-in-95 duration-150 max-w-[calc(100vw-2rem)] ${
            panelClassName || 'w-56'
          }`}
          onClick={(e) => {
            // Optional auto close when clicking an action item
            if (e.target.closest('[role="menuitem"]') || e.target.closest('a') || e.target.closest('button')) {
              close();
            }
          }}
        >
          {typeof children === 'function' ? children({ close }) : children}
        </div>
      )}
    </div>
  );
}

