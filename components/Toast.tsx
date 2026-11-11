'use client';

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-lg border shadow-sm transition-all duration-200 ${
            toast.type === 'success'
              ? 'bg-white border-[#10B981] text-[#0F172A]'
              : toast.type === 'error'
              ? 'bg-white border-[#EF4444] text-[#0F172A]'
              : 'bg-white border-[#E2E8F0] text-[#0F172A]'
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === 'success' && (
              <CheckCircle2 className="w-5 h-5 text-[#10B981] shrink-0" />
            )}
            {toast.type === 'error' && (
              <AlertCircle className="w-5 h-5 text-[#EF4444] shrink-0" />
            )}
            {toast.type === 'info' && (
              <Info className="w-5 h-5 text-[#3B82F6] shrink-0" />
            )}
            <p className="text-sm font-medium text-[#1E293B]">{toast.message}</p>
          </div>
          <button
            onClick={() => onDismiss(toast.id)}
            className="text-[#64748B] hover:text-[#0F172A] p-1 rounded transition-colors"
            aria-label="Tutup notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

