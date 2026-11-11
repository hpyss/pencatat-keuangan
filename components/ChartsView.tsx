'use client';

import React from 'react';
import { Transaction, Category } from '@/types/finance';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { IncomeExpenseBarChart } from '@/components/charts/IncomeExpenseBarChart';
import { BalanceLineChart } from '@/components/charts/BalanceLineChart';

interface ChartsViewProps {
  transactions: Transaction[];
  categories: Category[];
}

export function ChartsView({ transactions, categories }: ChartsViewProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <h3 className="text-base font-bold text-[#0F172A]">Visualisasi Keuangan</h3>
        <p className="text-xs text-[#64748B] mt-0.5">Grafik analisis pengeluaran dan tren keuangan Anda</p>
      </div>

      {/* Full width charts */}
      <BalanceLineChart transactions={transactions} />
      <IncomeExpenseBarChart transactions={transactions} />
      <CategoryPieChart transactions={transactions} categories={categories} />
    </div>
  );
}

