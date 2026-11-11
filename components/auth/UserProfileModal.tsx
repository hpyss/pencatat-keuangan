'use client';

import React from 'react';
import { X, LogOut, RefreshCw } from 'lucide-react';
import { User } from '@/types/auth';
import { formatDateID } from '@/lib/utils';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onLogout: () => void;
  onSwitchAccount: () => void;
  transactionCount?: number;
}

export function UserProfileModal({
  isOpen,
  onClose,
  user,
  onLogout,
  onSwitchAccount,
  transactionCount = 0,
}: UserProfileModalProps) {
  if (!isOpen || !user) return null;

  const initials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const regDate = new Date(user.createdAt).toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <h3 className="text-sm font-bold text-[#0F172A]">Profil Pengguna</h3>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Info Card */}
        <div className="p-5 flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-xl font-bold border-4 border-[#F1F5F9] shadow-sm mb-3">
            {initials}
          </div>
          <h4 className="text-base font-bold text-[#0F172A]">{user.name}</h4>
          <p className="text-xs text-[#64748B] mt-0.5">{user.email}</p>

          <div className="w-full grid grid-cols-2 gap-2 mt-5 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] text-left">
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#64748B] block">
                Total Transaksi
              </span>
              <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">
                {transactionCount} Catatan
              </span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-semibold text-[#64748B] block">
                Terdaftar Sejak
              </span>
              <span className="text-sm font-bold text-[#0F172A] mt-0.5 block">
                {formatDateID(regDate)}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 pt-0 flex flex-col gap-2">
          <button
            onClick={() => {
              onClose();
              onSwitchAccount();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#0F172A] text-xs font-semibold rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Ganti Akun Lain</span>
          </button>

          <button
            onClick={() => {
              onClose();
              onLogout();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-[#EF4444] hover:bg-red-50 text-xs font-semibold rounded-xl transition-colors border border-red-100"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar dari Akun</span>
          </button>
        </div>
      </div>
    </div>
  );
}

