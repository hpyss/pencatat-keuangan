'use client';

import React, { useState } from 'react';
import { Transaction, Category, ReportPeriod } from '@/types/finance';
import { formatRupiah } from '@/lib/utils';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { IncomeExpenseBarChart } from '@/components/charts/IncomeExpenseBarChart';
import { ChevronDown } from 'lucide-react';

interface ReportViewProps {
  transactions: Transaction[];
  categories: Category[];
}

type PeriodOption = { id: ReportPeriod; label: string };

const PERIOD_OPTIONS: PeriodOption[] = [
  { id: 'daily', label: 'Harian' },
  { id: 'weekly', label: 'Mingguan' },
  { id: 'monthly', label: 'Bulanan' },
  { id: 'yearly', label: 'Tahunan' },
];

function getFilteredTransactions(transactions: Transaction[], period: ReportPeriod, refDate: Date): Transaction[] {
  const year = refDate.getFullYear();
  const month = refDate.getMonth(); // 0-indexed
  const dateStr = refDate.toISOString().split('T')[0];

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    if (period === 'daily') {
      return tx.date === dateStr;
    }
    if (period === 'weekly') {
      const startOfWeek = new Date(refDate);
      startOfWeek.setDate(refDate.getDate() - refDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return txDate >= startOfWeek && txDate <= endOfWeek;
    }
    if (period === 'monthly') {
      return txDate.getFullYear() === year && txDate.getMonth() === month;
    }
    if (period === 'yearly') {
      return txDate.getFullYear() === year;
    }
    return true;
  });
}

function formatPeriodLabel(period: ReportPeriod, refDate: Date): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  if (period === 'daily') {
    const d = refDate.getDate();
    const m = months[refDate.getMonth()];
    const y = refDate.getFullYear();
    return `${d} ${m} ${y}`;
  }
  if (period === 'weekly') {
    const startOfWeek = new Date(refDate);
    startOfWeek.setDate(refDate.getDate() - refDate.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return `${startOfWeek.getDate()} ${months[startOfWeek.getMonth()]} - ${endOfWeek.getDate()} ${months[endOfWeek.getMonth()]} ${endOfWeek.getFullYear()}`;
  }
  if (period === 'monthly') {
    return `${months[refDate.getMonth()]} ${refDate.getFullYear()}`;
  }
  return String(refDate.getFullYear());
}

function navigateDate(period: ReportPeriod, refDate: Date, direction: -1 | 1): Date {
  const d = new Date(refDate);
  if (period === 'daily') d.setDate(d.getDate() + direction);
  if (period === 'weekly') d.setDate(d.getDate() + direction * 7);
  if (period === 'monthly') d.setMonth(d.getMonth() + direction);
  if (period === 'yearly') d.setFullYear(d.getFullYear() + direction);
  return d;
}

export function ReportView({ transactions, categories }: ReportViewProps) {
  const [period, setPeriod] = useState<ReportPeriod>('monthly');
  const [refDate, setRefDate] = useState<Date>(new Date());

  const filtered = getFilteredTransactions(transactions, period, refDate);

  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalExpense = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const selisih = totalIncome - totalExpense;

  // Category breakdown for expenses
  const categoryMap: Record<string, number> = {};
  filtered.filter(t => t.type === 'expense').forEach(tx => {
    categoryMap[tx.category] = (categoryMap[tx.category] || 0) + tx.amount;
  });
  const categoryBreakdown = Object.entries(categoryMap)
    .map(([name, amount]) => {
      const cat = categories.find(c => c.name.toLowerCase() === name.toLowerCase());
      return { name, amount, color: cat?.color || '#64748B', icon: cat?.icon || 'Tag' };
    })
    .sort((a, b) => b.amount - a.amount);

  const isCurrentPeriod = () => {
    const now = new Date();
    if (period === 'daily') return refDate.toDateString() === now.toDateString();
    if (period === 'weekly') {
      const startNow = new Date(now); startNow.setDate(now.getDate() - now.getDay());
      const startRef = new Date(refDate); startRef.setDate(refDate.getDate() - refDate.getDay());
      return startNow.toDateString() === startRef.toDateString();
    }
    if (period === 'monthly') return refDate.getFullYear() === now.getFullYear() && refDate.getMonth() === now.getMonth();
    return refDate.getFullYear() === now.getFullYear();
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Period Selector */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Laporan Keuangan</h3>
            <p className="text-xs text-[#64748B]">Ringkasan aktivitas keuangan per periode</p>
          </div>
          {/* Period type tabs */}
          <div className="flex p-1 bg-[#F1F5F9] rounded-xl gap-1">
            {PERIOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => { setPeriod(opt.id); setRefDate(new Date()); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  period === opt.id
                    ? 'bg-[#0F172A] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#0F172A]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Period Navigator */}
        <div className="flex items-center justify-between mt-4 p-3 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
          <button
            onClick={() => setRefDate(navigateDate(period, refDate, -1))}
            className="p-2 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#E2E8F0]"
          >
            <ChevronDown className="w-4 h-4 rotate-90" />
          </button>
          <div className="text-center">
            <p className="text-sm font-bold text-[#0F172A]">{formatPeriodLabel(period, refDate)}</p>
            {!isCurrentPeriod() && (
              <button
                onClick={() => setRefDate(new Date())}
                className="text-[11px] text-[#10B981] font-semibold hover:underline mt-0.5"
              >
                Kembali ke sekarang
              </button>
            )}
          </div>
          <button
            onClick={() => setRefDate(navigateDate(period, refDate, 1))}
            disabled={isCurrentPeriod()}
            className={`p-2 rounded-lg transition-colors border border-transparent ${
              isCurrentPeriod()
                ? 'text-[#CBD5E1] cursor-not-allowed'
                : 'text-[#64748B] hover:text-[#0F172A] hover:bg-white hover:border-[#E2E8F0]'
            }`}
          >
            <ChevronDown className="w-4 h-4 -rotate-90" />
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Pemasukan</p>
          <p className="text-2xl font-bold text-[#10B981] mt-2 tracking-tight">{formatRupiah(totalIncome)}</p>
          <p className="text-[11px] text-[#64748B] mt-1">
            {filtered.filter(t => t.type === 'income').length} transaksi pemasukan
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <p className="text-xs font-semibold text-[#64748B]">Total Pengeluaran</p>
          <p className="text-2xl font-bold text-[#EF4444] mt-2 tracking-tight">{formatRupiah(totalExpense)}</p>
          <p className="text-[11px] text-[#64748B] mt-1">
            {filtered.filter(t => t.type === 'expense').length} transaksi pengeluaran
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <p className="text-xs font-semibold text-[#64748B]">Selisih / Saldo</p>
          <p className={`text-2xl font-bold mt-2 tracking-tight ${selisih >= 0 ? 'text-[#0F172A]' : 'text-[#EF4444]'}`}>
            {formatRupiah(selisih)}
          </p>
          <p className="text-[11px] text-[#64748B] mt-1">
            {selisih >= 0 ? 'Surplus' : 'Defisit'} periode ini
          </p>
        </div>
      </div>

      {/* Category Breakdown Table */}
      {categoryBreakdown.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
          <div className="pb-4 border-b border-[#E2E8F0] mb-4">
            <h4 className="text-sm font-bold text-[#0F172A]">Rincian Pengeluaran per Kategori</h4>
            <p className="text-xs text-[#64748B]">Alokasi pengeluaran berdasarkan kategori periode ini</p>
          </div>
          <div className="flex flex-col gap-2">
            {categoryBreakdown.map((item) => {
              const pct = totalExpense > 0 ? (item.amount / totalExpense) * 100 : 0;
              return (
                <div key={item.name} className="flex items-center gap-3">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white shrink-0"
                    style={{ backgroundColor: item.color }}
                  >
                    <CategoryIcon name={item.icon} size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-semibold text-[#1E293B]">{item.name}</span>
                      <span className="text-xs font-bold text-[#0F172A]">{formatRupiah(item.amount)}</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{ width: `${pct}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <span className="text-[11px] text-[#64748B]">{pct.toFixed(1)}% dari total pengeluaran</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <CategoryPieChart transactions={filtered} categories={categories} />
        <IncomeExpenseBarChart transactions={transactions} />
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <p className="text-sm font-semibold text-[#1E293B]">Tidak ada data untuk periode ini</p>
          <p className="text-xs text-[#64748B] mt-1">Coba pilih periode lain atau tambah transaksi baru</p>
        </div>
      )}
    </div>
  );
}

