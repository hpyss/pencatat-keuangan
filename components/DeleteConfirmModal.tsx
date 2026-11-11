'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
}

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full p-5 border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 text-[#EF4444] mb-3">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0 border border-red-100">
            <AlertTriangle className="w-5 h-5 text-[#EF4444]" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">{title}</h3>
            <p className="text-xs text-[#64748B]">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <p className="text-xs text-[#1E293B] mb-5 leading-relaxed bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0]">
          {description}
        </p>

        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
          >
            Batal
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#EF4444] hover:bg-red-600 rounded-lg transition-colors shadow-xs"
          >
            Hapus Sekarang
          </button>
        </div>
      </div>
    </div>
  );
}

