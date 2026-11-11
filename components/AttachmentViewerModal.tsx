'use client';

import React from 'react';
import { X, Download, FileText } from 'lucide-react';

interface AttachmentViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl?: string;
  title?: string;
}

export function AttachmentViewerModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Bukti Transaksi',
}: AttachmentViewerModalProps) {
  if (!isOpen || !imageUrl) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden border border-[#E2E8F0] animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#0F172A]" />
            <h3 className="text-sm font-bold text-[#0F172A]">{title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={imageUrl}
              download="bukti-transaksi.jpg"
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-md transition-colors"
              title="Unduh Lampiran"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-md transition-colors"
              aria-label="Tutup"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 bg-[#F8FAFC] flex items-center justify-center max-h-[70vh] overflow-auto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Lampiran Struk Bukti Transaksi"
            className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-xs border border-[#E2E8F0]"
          />
        </div>

        <div className="p-3 bg-white border-t border-[#E2E8F0] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#1E293B] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}

