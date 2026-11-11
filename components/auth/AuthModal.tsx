'use client';

import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Eye, EyeOff, Wallet, CheckCircle, ArrowRight } from 'lucide-react';
import { User } from '@/types/auth';
import { loginUser, registerUser } from '@/lib/auth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User, message: string) => void;
  initialMode?: 'login' | 'register';
}

export function AuthModal({
  isOpen,
  onClose,
  onSuccess,
  initialMode = 'login',
}: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setErrorMsg('Nama lengkap wajib diisi');
          setLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setErrorMsg('Konfirmasi kata sandi tidak cocok');
          setLoading(false);
          return;
        }
        const res = registerUser(name, email, password);
        if (res.success && res.user) {
          onSuccess(res.user, 'Pendaftaran berhasil! Selamat datang.');
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = loginUser(email, password);
        if (res.success && res.user) {
          onSuccess(res.user, 'Berhasil masuk ke akun Anda.');
          onClose();
        } else {
          setErrorMsg(res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setErrorMsg('');
    const res = loginUser('demo@keuanganku.com', 'demo123');
    if (res.success && res.user) {
      onSuccess(res.user, 'Masuk sebagai Pengguna Demo');
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-[420px] w-full overflow-hidden border border-[#E2E8F0] my-6 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 pb-4 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4 text-[#10B981]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#0F172A]">
                {mode === 'login' ? 'Masuk ke KeuanganKu' : 'Daftar Akun Baru'}
              </h3>
              <p className="text-xs text-[#64748B]">
                {mode === 'login'
                  ? 'Akses catatan keuangan pribadi Anda'
                  : 'Mulai kelola keuangan Anda dengan rapi'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
            aria-label="Tutup"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="p-4 pb-0">
          <div className="grid grid-cols-2 gap-1 p-1 bg-[#F1F5F9] rounded-xl">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'login'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Masuk
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                mode === 'register'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              Daftar Akun
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-3.5">
          {errorMsg && (
            <div className="p-2.5 text-xs font-semibold text-[#EF4444] bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Nama (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Nama Lengkap
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                  required
                />
              </div>
            </div>
          )}

          {/* Email */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
              Alamat Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
              Kata Sandi
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'register' ? 'Minimal 6 karakter' : 'Masukkan kata sandi'}
                className="w-full pl-9 pr-10 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                aria-label="Lihat kata sandi"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password (Register only) */}
          {mode === 'register' && (
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Ulangi Kata Sandi
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Ketik ulang kata sandi"
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                  required
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-1 py-2.5 bg-[#0F172A] hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          {/* Divider */}
          <div className="relative my-1 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E2E8F0]" />
            </div>
            <span className="relative px-3 bg-white text-[11px] text-[#64748B]">
              atau
            </span>
          </div>

          {/* Demo Account Quick Access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            <CheckCircle className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Coba Akun Demo Langsung</span>
          </button>
        </form>

        {/* Footer info */}
        <div className="p-3 bg-[#F8FAFC] border-t border-[#E2E8F0] text-center">
          <p className="text-[11px] text-[#64748B]">
            Data akun dan transaksi tersimpan aman di peramban Anda.
          </p>
        </div>
      </div>
    </div>
  );
}

