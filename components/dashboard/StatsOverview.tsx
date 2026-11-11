'use client';

import React from 'react';
import { Wallet, ArrowDownRight, ArrowUpRight, CalendarDays, TrendingUp } from 'lucide-react';
import { Transaction } from '@/types/finance';
import { formatRupiah, getCurrentYearMonth, formatMonthYear } from '@/lib/utils';

interface StatsOverviewProps {
  transactions: Transaction[];
  onOpenAddModal: (type?: 'income' | 'expense') => void;
}

export function StatsOverview({ transactions, onOpenAddModal }: StatsOverviewProps) {
  // All time balance calculation
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const currentBalance = totalIncome - totalExpense;

  // Current month stats
  const currentYM = getCurrentYearMonth();
  const currentMonthTransactions = transactions.filter((t) => t.date.startsWith(currentYM));

  const monthIncome = currentMonthTransactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthExpense = currentMonthTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const monthRemaining = monthIncome - monthExpense;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Saldo Saat Ini */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Saldo Saat Ini</span>
          <div className="w-9 h-9 rounded-xl bg-[#0F172A] text-white flex items-center justify-center shadow-2xs">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            {formatRupiah(currentBalance)}
          </h2>
          <div className="flex items-center gap-1.5 mt-2 text-[11px] text-[#64748B]">
            <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
            <span>Total akumulasi seluruh akun</span>
          </div>
        </div>
      </div>

      {/* 2. Total Pemasukan */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Total Pemasukan</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#10B981] flex items-center justify-center border border-emerald-100">
            <ArrowUpRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#10B981] tracking-tight">
            {formatRupiah(totalIncome)}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-[#64748B]">
              Bulan ini: {formatRupiah(monthIncome)}
            </span>
            <button
              onClick={() => onOpenAddModal('income')}
              className="text-[11px] font-bold text-[#10B981] hover:underline"
            >
              + Tambah
            </button>
          </div>
        </div>
      </div>

      {/* 3. Total Pengeluaran */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Total Pengeluaran</span>
          <div className="w-9 h-9 rounded-xl bg-red-50 text-[#EF4444] flex items-center justify-center border border-red-100">
            <ArrowDownRight className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-bold text-[#EF4444] tracking-tight">
            {formatRupiah(totalExpense)}
          </h2>
          <div className="flex items-center justify-between mt-2">
            <span className="text-[11px] text-[#64748B]">
              Bulan ini: {formatRupiah(monthExpense)}
            </span>
            <button
              onClick={() => onOpenAddModal('expense')}
              className="text-[11px] font-bold text-[#EF4444] hover:underline"
            >
              + Catat
            </button>
          </div>
        </div>
      </div>

      {/* 4. Sisa Uang Bulan Ini */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#64748B]">Sisa Uang Bulan Ini</span>
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-[#F59E0B] flex items-center justify-center border border-amber-100">
            <CalendarDays className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-3">
          <h2
            className={`text-2xl font-bold tracking-tight ${
              monthRemaining >= 0 ? 'text-[#0F172A]' : 'text-[#EF4444]'
            }`}
          >
            {formatRupiah(monthRemaining)}
          </h2>
          <p className="text-[11px] text-[#64748B] mt-2">
            Periode: {formatMonthYear(currentYM)}
          </p>
        </div>
      </div>
    </div>
  );
}

