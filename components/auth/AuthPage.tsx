'use client';

import React, { useState } from 'react';
import {
  Wallet,
  Lock,
  Mail,
  User as UserIcon,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  PieChart,
  Receipt,
  Sparkles,
} from 'lucide-react';
import { User } from '@/types/auth';
import { loginUser, registerUser, loginAsDemo } from '@/lib/auth';

interface AuthPageProps {
  onLoginSuccess: (user: User, message: string) => void;
  initialMode?: 'login' | 'register';
}

export function AuthPage({ onLoginSuccess, initialMode = 'login' }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

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
        if (password.length < 6) {
          setErrorMsg('Kata sandi minimal 6 karakter');
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
          onLoginSuccess(res.user, 'Pendaftaran berhasil! Selamat datang.');
        } else {
          setErrorMsg(res.message);
        }
      } else {
        const res = loginUser(email, password);
        if (res.success && res.user) {
          onLoginSuccess(res.user, 'Berhasil masuk ke akun Anda.');
        } else {
          setErrorMsg(res.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = () => {
    const res = loginAsDemo();
    if (res.success && res.user) {
      onLoginSuccess(res.user, 'Masuk sebagai Pengguna Demo');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4 sm:p-6 text-[#1E293B]">
      {/* Brand Header */}
      <div className="flex flex-col items-center text-center mb-6 max-w-sm">
        <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white flex items-center justify-center shadow-sm mb-3">
          <Wallet className="w-6 h-6 text-[#10B981]" />
        </div>
        <h1 className="text-2xl font-bold text-[#0F172A] tracking-tight">
          KeuanganKu
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          Aplikasi pencatat keuangan pribadi yang rapi, transparan, dan terstruktur
        </p>
      </div>

      {/* Main Auth Card */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl border border-[#E2E8F0] shadow-sm p-6 sm:p-7">
        {/* Toggle Mode: Masuk vs Daftar */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] rounded-xl mb-5">
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

        {/* Title for current mode */}
        <div className="mb-4">
          <h2 className="text-base font-bold text-[#0F172A]">
            {mode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Baru'}
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            {mode === 'login'
              ? 'Masukkan email dan kata sandi yang telah terdaftar'
              : 'Daftarkan diri untuk mulai mencatat keuangan Anda'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 mb-4 text-xs font-semibold text-[#EF4444] bg-red-50 border border-red-200 rounded-xl">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          {/* Nama Lengkap (Register only) */}
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
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
                className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
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
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
                aria-label="Lihat kata sandi"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                  className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                  required
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-2 py-2.5 text-xs font-bold text-white rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 ${
              mode === 'register'
                ? 'bg-[#10B981] hover:bg-emerald-600'
                : 'bg-[#0F172A] hover:bg-slate-800'
            }`}
          >
            <span>{mode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#E2E8F0]" />
          </div>
          <span className="relative px-3 bg-white text-[11px] text-[#64748B]">
            atau coba langsung
          </span>
        </div>

        {/* Demo Account Button */}
        <button
          type="button"
          onClick={handleDemoClick}
          className="w-full py-2.5 bg-[#F8FAFC] hover:bg-[#F1F5F9] border border-[#CBD5E1] text-[#0F172A] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-[#10B981]" />
          <span>Coba Akun Demo dengan Data Siap Pakai</span>
        </button>

        {/* Switch Link */}
        <div className="mt-5 text-center text-xs text-[#64748B]">
          {mode === 'login' ? (
            <p>
              Belum punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setErrorMsg('');
                }}
                className="font-bold text-[#0F172A] hover:text-[#10B981] transition-colors"
              >
                Daftar Akun Baru
              </button>
            </p>
          ) : (
            <p>
              Sudah punya akun?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setErrorMsg('');
                }}
                className="font-bold text-[#0F172A] hover:text-[#10B981] transition-colors"
              >
                Masuk ke Akun
              </button>
            </p>
          )}
        </div>
      </div>

      {/* Feature Highlights beneath */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[420px] w-full mt-6 text-center">
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
          <Receipt className="w-4 h-4 text-[#10B981] mx-auto mb-1" />
          <p className="text-[11px] font-bold text-[#0F172A]">Catat Cepat</p>
          <p className="text-[10px] text-[#64748B]">Input nominal & bukti struk</p>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
          <PieChart className="w-4 h-4 text-[#F59E0B] mx-auto mb-1" />
          <p className="text-[11px] font-bold text-[#0F172A]">Grafik & Laporan</p>
          <p className="text-[10px] text-[#64748B]">Analisis harian hingga tahunan</p>
        </div>
        <div className="p-2.5 bg-white rounded-xl border border-[#E2E8F0] shadow-2xs">
          <ShieldCheck className="w-4 h-4 text-[#3B82F6] mx-auto mb-1" />
          <p className="text-[11px] font-bold text-[#0F172A]">Privasi Aman</p>
          <p className="text-[10px] text-[#64748B]">Tersimpan di perangkat lokal</p>
        </div>
      </div>
    </div>
  );
}

