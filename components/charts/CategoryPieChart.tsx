'use client';

import React, { useState } from 'react';
import { Transaction, Category } from '@/types/finance';
import { formatRupiah } from '@/lib/utils';
import { CategoryIcon } from '../CategoryIcon';

interface CategoryPieChartProps {
  transactions: Transaction[];
  categories: Category[];
}

interface CategoryDataItem {
  name: string;
  amount: number;
  percentage: number;
  color: string;
  icon: string;
}

function calculateDonutSlices(data: CategoryDataItem[]) {
  let angle = 0;
  const radius = 70;
  const innerRadius = 45;
  const centerX = 90;
  const centerY = 90;

  return data.map((item) => {
    const sliceAngle = (item.percentage / 100) * 360;
    const startAngle = angle;
    const endAngle = angle + sliceAngle;
    angle += sliceAngle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = centerX + radius * Math.cos(startRad);
    const y1 = centerY + radius * Math.sin(startRad);
    const x2 = centerX + radius * Math.cos(endRad);
    const y2 = centerY + radius * Math.sin(endRad);

    const x3 = centerX + innerRadius * Math.cos(endRad);
    const y3 = centerY + innerRadius * Math.sin(endRad);
    const x4 = centerX + innerRadius * Math.cos(startRad);
    const y4 = centerY + innerRadius * Math.sin(startRad);

    const largeArc = sliceAngle > 180 ? 1 : 0;

    const path = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;

    return {
      ...item,
      path,
      startAngle,
      endAngle,
    };
  });
}

export function CategoryPieChart({ transactions, categories }: CategoryPieChartProps) {
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  // Filter only expenses
  const expenses = transactions.filter((t) => t.type === 'expense');
  const totalExpense = expenses.reduce((sum, t) => sum + t.amount, 0);

  // Group by category
  const categoryMap: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
  });

  // Color palette for slices
  const fallbackColors = [
    '#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6',
    '#EC4899', '#06B6D4', '#14B8A6', '#64748B', '#6366F1'
  ];

  const categoryData: CategoryDataItem[] = Object.entries(categoryMap)
    .map(([name, amount], index) => {
      const catObj = categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
      const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
      return {
        name,
        amount,
        percentage,
        color: catObj?.color || fallbackColors[index % fallbackColors.length],
        icon: catObj?.icon || 'Tag',
      };
    })
    .sort((a, b) => b.amount - a.amount);

  const slices = calculateDonutSlices(categoryData);

  return (
    <div className="w-full bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="pb-4 border-b border-[#E2E8F0]">
        <h3 className="text-base font-bold text-[#0F172A]">Pengeluaran per Kategori</h3>
        <p className="text-xs text-[#64748B]">Distribusi alokasi pengeluaran dana</p>
      </div>

      {totalExpense === 0 ? (
        <div className="py-12 text-center text-sm text-[#64748B]">
          Belum ada data pengeluaran untuk ditampilkan
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pt-5 items-center">
          {/* Donut Chart Visual */}
          <div className="md:col-span-5 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 180 180" className="w-full h-full transform -rotate-90">
                {slices.map((slice) => {
                  const isHovered = hoveredCategory === slice.name;
                  return (
                    <path
                      key={slice.name}
                      d={slice.path}
                      fill={slice.color}
                      opacity={hoveredCategory ? (isHovered ? 1 : 0.4) : 0.95}
                      className="cursor-pointer transition-all duration-200 stroke-white stroke-2"
                      onMouseEnter={() => setHoveredCategory(slice.name)}
                      onMouseLeave={() => setHoveredCategory(null)}
                    />
                  );
                })}
              </svg>
              {/* Center donut text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-4">
                <span className="text-[10px] uppercase font-semibold text-[#64748B] tracking-wider">
                  Total
                </span>
                <span className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight mt-0.5">
                  {formatRupiah(totalExpense)}
                </span>
              </div>
            </div>
          </div>

          {/* Category Legend & List */}
          <div className="md:col-span-7 flex flex-col gap-2.5 max-h-56 overflow-y-auto pr-1">
            {categoryData.map((item) => {
              const isHovered = hoveredCategory === item.name;
              return (
                <div
                  key={item.name}
                  onMouseEnter={() => setHoveredCategory(item.name)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className={`flex items-center justify-between p-2 rounded-lg transition-colors cursor-pointer border ${
                    isHovered
                      ? 'bg-[#F8FAFC] border-[#CBD5E1]'
                      : 'bg-transparent border-transparent hover:bg-[#F8FAFC]'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-7 h-7 rounded-md flex items-center justify-center text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: item.color }}
                    >
                      <CategoryIcon name={item.icon} size={14} className="text-white" />
                    </div>
                    <div className="truncate">
                      <p className="text-xs font-semibold text-[#1E293B] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#64748B]">
                        {item.percentage.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#0F172A] shrink-0">
                    {formatRupiah(item.amount)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
