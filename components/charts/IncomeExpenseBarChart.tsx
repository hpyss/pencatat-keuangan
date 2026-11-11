'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/finance';
import { formatRupiah } from '@/lib/utils';

interface IncomeExpenseBarChartProps {
  transactions: Transaction[];
}

export function IncomeExpenseBarChart({ transactions }: IncomeExpenseBarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Group transactions by month for the last 6 months
  const now = new Date();
  const monthsData: { label: string; key: string; income: number; expense: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
    const label = `${monthNames[d.getMonth()]} ${String(d.getFullYear()).slice(-2)}`;
    monthsData.push({ label, key, income: 0, expense: 0 });
  }

  transactions.forEach((tx) => {
    const txMonth = tx.date.slice(0, 7);
    const item = monthsData.find((m) => m.key === txMonth);
    if (item) {
      if (tx.type === 'income') {
        item.income += tx.amount;
      } else {
        item.expense += tx.amount;
      }
    }
  });

  const maxVal = Math.max(...monthsData.flatMap((m) => [m.income, m.expense]), 1000000);
  const chartHeight = 180;
  const chartWidth = 520;
  const paddingLeft = 50;
  const paddingBottom = 30;
  const availableWidth = chartWidth - paddingLeft - 20;
  const barGroupWidth = availableWidth / monthsData.length;
  const barWidth = 14;

  return (
    <div className="w-full bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">Pemasukan vs Pengeluaran</h3>
          <p className="text-xs text-[#64748B]">Perbandingan 6 bulan terakhir</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-[#1E293B]">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#10B981]" />
            <span>Pemasukan</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-xs bg-[#EF4444]" />
            <span>Pengeluaran</span>
          </div>
        </div>
      </div>

      <div className="relative pt-6 overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight + paddingBottom}`}
          className="w-full h-56 select-none"
        >
          {/* Subtle grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = chartHeight - ratio * (chartHeight - 20);
            const val = maxVal * ratio;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - 10}
                  y2={y}
                  stroke="#E2E8F0"
                  strokeDasharray="3 3"
                  strokeWidth="1"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#64748B] text-[10px] font-sans"
                >
                  {val >= 1000000
                    ? `${(val / 1000000).toFixed(val % 1000000 === 0 ? 0 : 1)}jt`
                    : val >= 1000
                    ? `${(val / 1000).toFixed(0)}rb`
                    : val}
                </text>
              </g>
            );
          })}

          {/* Bars */}
          {monthsData.map((item, idx) => {
            const groupX = paddingLeft + idx * barGroupWidth;
            const centerX = groupX + barGroupWidth / 2;

            const incomeH = maxVal > 0 ? (item.income / maxVal) * (chartHeight - 20) : 0;
            const expenseH = maxVal > 0 ? (item.expense / maxVal) * (chartHeight - 20) : 0;

            const incomeY = chartHeight - incomeH;
            const expenseY = chartHeight - expenseH;

            const isHovered = hoveredIndex === idx;

            return (
              <g
                key={item.key}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Background hover highlight */}
                {isHovered && (
                  <rect
                    x={groupX + 4}
                    y={10}
                    width={barGroupWidth - 8}
                    height={chartHeight - 10}
                    fill="#F1F5F9"
                    rx="4"
                  />
                )}

                {/* Income Bar */}
                <rect
                  x={centerX - barWidth - 2}
                  y={incomeY}
                  width={barWidth}
                  height={Math.max(incomeH, 2)}
                  rx="3"
                  fill="#10B981"
                  className="transition-all duration-150"
                  opacity={isHovered ? 1 : 0.9}
                />

                {/* Expense Bar */}
                <rect
                  x={centerX + 2}
                  y={expenseY}
                  width={barWidth}
                  height={Math.max(expenseH, 2)}
                  rx="3"
                  fill="#EF4444"
                  className="transition-all duration-150"
                  opacity={isHovered ? 1 : 0.9}
                />

                {/* X Axis Label */}
                <text
                  x={centerX}
                  y={chartHeight + 18}
                  textAnchor="middle"
                  className={`text-[11px] font-sans transition-colors ${
                    isHovered ? 'fill-[#0F172A] font-bold' : 'fill-[#64748B]'
                  }`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating tooltip */}
        {hoveredIndex !== null && (
          <div className="absolute top-1 right-2 bg-[#0F172A] text-white text-xs rounded-lg px-3 py-2 shadow-md border border-slate-700 pointer-events-none">
            <p className="font-semibold text-slate-300 pb-1 border-b border-slate-700 mb-1">
              {monthsData[hoveredIndex].label}
            </p>
            <div className="flex justify-between gap-4 py-0.5">
              <span className="text-[#10B981]">Pemasukan:</span>
              <span className="font-bold">{formatRupiah(monthsData[hoveredIndex].income)}</span>
            </div>
            <div className="flex justify-between gap-4 py-0.5">
              <span className="text-[#EF4444]">Pengeluaran:</span>
              <span className="font-bold">{formatRupiah(monthsData[hoveredIndex].expense)}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

