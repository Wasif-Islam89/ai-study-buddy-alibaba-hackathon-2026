import React, { useState, useRef } from 'react';
import { UploadCloud, FileText } from 'lucide-react';
import { ALLOWED_EXTENSIONS } from '../../../utils/materialUtils';

export default function DropzoneArea({ onFileSelected, errorMessage }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileSelected(e.target.files[0]);
    }
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer min-h-[340px] select-none ${
        isDragOver
          ? 'border-[var(--primary)] bg-[var(--primary-light)]/20 scale-[1.01]'
          : errorMessage
          ? 'border-red-400 bg-red-50/30 dark:bg-red-950/20'
          : 'border-[var(--color-border)] bg-[var(--color-surface-card)] hover:border-[var(--primary)] hover:bg-[var(--primary-light)]/5'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(',')}
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Cloud Icon */}
      <div className="flex items-center justify-center w-20 h-20 rounded-full bg-[var(--primary-light)] text-[var(--primary)] mb-5 transition-transform duration-300 group-hover:scale-110 shadow-xs">
        <UploadCloud className="w-10 h-10" />
      </div>

      <h3 className="font-display font-bold text-lg sm:text-xl text-[var(--color-text-main)] mb-1">
        Drag and drop study files here
      </h3>
      <p className="text-sm text-[var(--color-text-muted)] mb-5">
        or <span className="font-semibold text-[var(--primary)] underline underline-offset-2">browse from your device</span>
      </p>

      {errorMessage ? (
        <p className="text-xs font-semibold text-red-500 animate-in fade-in">
          {errorMessage}
        </p>
      ) : (
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--color-surface-secondary)] text-[var(--color-text-subtle)] text-xs font-medium">
          <FileText className="w-3.5 h-3.5" />
          <span>Supported: PDF, DOCX, TXT, PPT, and Images (up to 25MB)</span>
        </div>
      )}
    </div>
  );
}

