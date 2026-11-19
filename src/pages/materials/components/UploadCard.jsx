import React from 'react';
import { FileText, FileCode, FileSpreadsheet, Image as ImageIcon, X } from 'lucide-react';
import { formatFileSize, getFileExtension } from '../../../utils/materialUtils';

export default function UploadCard({ file, uploadProgress, uploadSpeed, onCancel }) {
  if (!file) return null;

  const ext = getFileExtension(file.name);

  const getIcon = () => {
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return ImageIcon;
    if (['c', 'cpp', 'py', 'js', 'html', 'css'].includes(ext)) return FileCode;
    if (['csv', 'xlsx', 'xls'].includes(ext)) return FileSpreadsheet;
    return FileText;
  };

  const Icon = getIcon();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-5 sm:p-6 shadow-[var(--shadow-card)] space-y-4 animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0">
            <Icon className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <h4 className="font-display font-bold text-sm sm:text-base text-[var(--color-text-main)] truncate">
              {file.name}
            </h4>
            <span className="text-xs text-[var(--color-text-muted)] mt-0.5 block">
              {formatFileSize(file.size)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={onCancel}
          aria-label="Cancel upload"
          className="p-1.5 rounded-lg text-[var(--color-text-subtle)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Progress Bar & Status */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-[var(--primary)]">{uploadProgress}%</span>
          <span className="text-[var(--color-text-subtle)]">{uploadSpeed}</span>
        </div>

        <div className="w-full h-2 rounded-full bg-[var(--color-surface-secondary)] overflow-hidden">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

