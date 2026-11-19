import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle } from 'lucide-react';

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showClose={!isLoading}>
      <div className="flex flex-col items-center text-center p-2">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[var(--color-error-bg)] text-[var(--color-error)] mb-4">
          <AlertTriangle className="w-6 h-6" />
        </div>

        <h3 className="font-display font-bold text-lg text-[var(--color-text-main)] mb-1.5">
          {title}
        </h3>

        <p className="text-sm text-[var(--color-text-muted)] mb-6 leading-relaxed max-w-xs">
          {message}
        </p>

        <div className="flex items-center justify-center gap-3 w-full">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1"
          >
            {cancelText}
          </Button>

          <Button
            variant={confirmVariant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="flex-1"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

