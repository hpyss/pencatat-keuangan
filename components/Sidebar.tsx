'use client';

import React from 'react';
import {
  LayoutDashboard,
  History,
  Tag,
  BarChart3,
  LineChart,
  Plus,
  Wallet,
  Menu,
  X,
  LogIn,
} from 'lucide-react';
import { User } from '@/types/auth';

export type TabId = 'dashboard' | 'history' | 'categories' | 'report' | 'charts';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'history', label: 'Riwayat', icon: <History className="w-4 h-4" /> },
  { id: 'categories', label: 'Kategori', icon: <Tag className="w-4 h-4" /> },
  { id: 'report', label: 'Laporan', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'charts', label: 'Grafik', icon: <LineChart className="w-4 h-4" /> },
];

interface SidebarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  onAddTransaction: () => void;
  mobileOpen: boolean;
  onMobileToggle: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

export function Sidebar({
  activeTab,
  onTabChange,
  onAddTransaction,
  mobileOpen,
  onMobileToggle,
  user,
  onOpenAuth,
  onOpenProfile,
}: SidebarProps) {
  const handleNav = (tab: TabId) => {
    onTabChange(tab);
    onMobileToggle();
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen w-64 bg-[#0F172A] flex flex-col shrink-0 border-r border-slate-800 transition-transform duration-250 ease-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-30`}
      >
        {/* Logo / Brand */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#10B981] rounded-lg flex items-center justify-center shadow-xs">
              <Wallet className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">KeuanganKu</p>
              <p className="text-[11px] text-slate-400 mt-1">Pencatat Keuangan</p>
            </div>
          </div>
          <button
            onClick={onMobileToggle}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Add Transaction CTA */}
        <div className="p-4 shrink-0">
          <button
            onClick={() => {
              onAddTransaction();
              onMobileToggle();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#10B981] hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Catat Transaksi</span>
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-2 pb-1 pt-2">
            Menu
          </p>
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isActive
                    ? 'bg-white/10 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={isActive ? 'text-[#10B981]' : ''}>{item.icon}</span>
                <span>{item.label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Account Footer Section */}
        <div className="p-3 border-t border-slate-800 shrink-0">
          {user ? (
            <button
              onClick={() => {
                onOpenProfile();
                onMobileToggle();
              }}
              className="w-full flex items-center gap-2.5 p-2 rounded-xl hover:bg-white/5 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#10B981] text-white flex items-center justify-center text-xs font-bold shrink-0">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-[10px] text-slate-400 truncate mt-0.5">
                  {user.email}
                </p>
              </div>
            </button>
          ) : (
            <button
              onClick={() => {
                onOpenAuth();
                onMobileToggle();
              }}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold rounded-xl transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Masuk / Daftar Akun</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}

interface TopBarProps {
  activeTab: TabId;
  onMobileMenuToggle: () => void;
  onAddTransaction: () => void;
  user: User | null;
  onOpenAuth: () => void;
  onOpenProfile: () => void;
}

const TAB_TITLES: Record<TabId, { title: string; desc: string }> = {
  dashboard: { title: 'Dashboard', desc: 'Ringkasan keuangan Anda hari ini' },
  history: { title: 'Riwayat Transaksi', desc: 'Semua transaksi yang pernah dicatat' },
  categories: { title: 'Kategori', desc: 'Kelola kategori transaksi Anda' },
  report: { title: 'Laporan Keuangan', desc: 'Analisis keuangan per periode' },
  charts: { title: 'Grafik', desc: 'Visualisasi data keuangan' },
};

export function TopBar({
  activeTab,
  onMobileMenuToggle,
  onAddTransaction,
  user,
  onOpenAuth,
  onOpenProfile,
}: TopBarProps) {
  const { title, desc } = TAB_TITLES[activeTab];

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-20 bg-[#F8FAFC]/95 backdrop-blur-xs border-b border-[#E2E8F0] px-4 sm:px-6 py-3.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="lg:hidden p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-xl border border-transparent hover:border-[#E2E8F0] transition-colors"
            aria-label="Buka menu navigasi"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-base font-bold text-[#0F172A] leading-tight">{title}</h1>
            <p className="text-xs text-[#64748B] hidden sm:block">{desc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {user ? (
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0F172A] rounded-xl transition-colors text-left"
              title="Lihat Profil Akun"
            >
              <div className="w-6 h-6 rounded-full bg-[#0F172A] text-white flex items-center justify-center text-[10px] font-bold">
                {initials}
              </div>
              <span className="hidden sm:inline text-xs font-semibold text-[#1E293B] max-w-[120px] truncate">
                {user.name}
              </span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0F172A] rounded-xl text-xs font-semibold text-[#0F172A] transition-colors"
            >
              <LogIn className="w-3.5 h-3.5 text-[#10B981]" />
              <span>Masuk</span>
            </button>
          )}

          <button
            onClick={onAddTransaction}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Catat Transaksi</span>
            <span className="sm:hidden">Tambah</span>
          </button>
        </div>
      </div>
    </header>
  );
}
