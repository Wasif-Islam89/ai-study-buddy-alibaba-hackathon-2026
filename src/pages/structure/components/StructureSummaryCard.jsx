import React from 'react';
import { FileText, FileCode, FileSpreadsheet, Image as ImageIcon, Tag } from 'lucide-react';
import { getFileExtension } from '../../../utils/materialUtils';

export default function StructureSummaryCard({ uploadData }) {
  if (!uploadData) return null;

  const ext = getFileExtension(uploadData.fileName || '');

  const getIcon = () => {
    if (['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'].includes(ext)) return ImageIcon;
    if (['c', 'cpp', 'py', 'js', 'html', 'css'].includes(ext)) return FileCode;
    if (['csv', 'xlsx', 'xls'].includes(ext)) return FileSpreadsheet;
    return FileText;
  };

  const Icon = getIcon();

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-card)] p-6 sm:p-7 shadow-[var(--shadow-card)] space-y-6 transition-all">
      {/* File Header */}
      <div className="flex items-center gap-4 pb-5 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary-light)] text-[var(--primary)] shrink-0 shadow-xs">
          <Icon className="w-6 h-6" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text-main)] truncate">
            {uploadData.fileName}
          </h3>
          <p className="text-xs sm:text-sm text-[var(--color-text-muted)] mt-0.5">
            {uploadData.fileSizeLabel || 'Document'} • Analysis complete
          </p>
        </div>
      </div>

      {/* Identified Topics & Themes */}
      <div>
        <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[var(--color-text-subtle)] mb-3">
          Identified Topics & Themes
        </h4>
        <div className="flex flex-wrap gap-2">
          {(uploadData.topics || []).map((topic, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--color-surface-secondary)] border border-[var(--color-border)] text-[var(--color-text-main)] shadow-xs"
            >
              <Tag className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{topic}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

