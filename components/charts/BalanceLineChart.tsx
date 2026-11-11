'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/finance';
import { formatRupiah, formatDateID } from '@/lib/utils';

interface BalanceLineChartProps {
  transactions: Transaction[];
}

export function BalanceLineChart({ transactions }: BalanceLineChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Sort transactions by date ascending
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime() || a.createdAt - b.createdAt
  );

  // Group by date to calculate cumulative balance
  const dateBalances: { date: string; balance: number }[] = [];
  let runningBalance = 0;

  sorted.forEach((tx) => {
    runningBalance += tx.type === 'income' ? tx.amount : -tx.amount;
    const existing = dateBalances.find((d) => d.date === tx.date);
    if (existing) {
      existing.balance = runningBalance;
    } else {
      dateBalances.push({ date: tx.date, balance: runningBalance });
    }
  });

  if (dateBalances.length === 0) {
    return (
      <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="pb-4 border-b border-[#E2E8F0]">
          <h3 className="text-base font-bold text-[#0F172A]">Perkembangan Saldo</h3>
          <p className="text-xs text-[#64748B]">Grafik akumulasi saldo keuangan</p>
        </div>
        <div className="py-12 text-center text-sm text-[#64748B]">
          Belum ada transaksi untuk menghitung riwayat saldo
        </div>
      </div>
    );
  }

  // Ensure at least 2 points for line drawing
  const pointsData =
    dateBalances.length === 1
      ? [{ date: 'Awal', balance: 0 }, dateBalances[0]]
      : dateBalances;

  const chartWidth = 560;
  const chartHeight = 200;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 25;
  const paddingBottom = 35;

  const minVal = Math.min(0, ...pointsData.map((p) => p.balance));
  const maxVal = Math.max(100000, ...pointsData.map((p) => p.balance));
  const range = maxVal - minVal || 1;

  const effectiveWidth = chartWidth - paddingLeft - paddingRight;
  const effectiveHeight = chartHeight - paddingTop - paddingBottom;

  const coords = pointsData.map((p, idx) => {
    const x = paddingLeft + (idx / (pointsData.length - 1)) * effectiveWidth;
    const y = paddingTop + effectiveHeight - ((p.balance - minVal) / range) * effectiveHeight;
    return { ...p, x, y };
  });

  // Build SVG path for the line
  const linePath = coords.reduce((acc, curr, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${curr.x} ${curr.y}`;
  }, '');

  // Build SVG path for the area gradient fill
  const areaPath = `
    ${linePath}
    L ${coords[coords.length - 1].x} ${paddingTop + effectiveHeight}
    L ${coords[0].x} ${paddingTop + effectiveHeight}
    Z
  `;

  // Active hover point
  const activePoint = hoveredIndex !== null ? coords[hoveredIndex] : null;

  // Clamped X for SVG tooltip bubble so it never gets clipped at chart borders
  const tooltipX = activePoint
    ? Math.max(75, Math.min(chartWidth - 75, activePoint.x))
    : 0;

  const tooltipY = activePoint
    ? activePoint.y < 65
      ? activePoint.y + 55
      : activePoint.y - 15
    : 0;

  return (
    <div className="w-full bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E2E8F0] gap-2">
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">Perkembangan Saldo</h3>
          <p className="text-xs text-[#64748B]">Akumulasi riwayat saldo seiring waktu</p>
        </div>

        {/* Live Hover Info or Total Points */}
        {activePoint ? (
          <div className="flex items-center gap-2 text-xs bg-[#F8FAFC] px-3 py-1.5 rounded-lg border border-[#E2E8F0]">
            <span className="text-[#64748B]">
              {activePoint.date === 'Awal' ? 'Saldo Awal' : formatDateID(activePoint.date)}:
            </span>
            <span className="font-bold text-[#0F172A]">{formatRupiah(activePoint.balance)}</span>
          </div>
        ) : (
          <span className="text-xs font-semibold px-2.5 py-1 bg-[#F1F5F9] text-[#0F172A] rounded-md self-start sm:self-auto">
            {pointsData.length} Titik Data
          </span>
        )}
      </div>

      <div className="relative pt-4 select-none">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-60"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            <linearGradient id="balanceAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F172A" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0F172A" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Horizontal grid lines */}
          {[0, 0.5, 1].map((ratio, idx) => {
            const y = paddingTop + effectiveHeight - ratio * effectiveHeight;
            const val = minVal + ratio * range;
            return (
              <g key={idx}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={chartWidth - paddingRight}
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

          {/* Area fill */}
          <path d={areaPath} fill="url(#balanceAreaGrad)" />

          {/* Solid line */}
          <path
            d={linePath}
            fill="none"
            stroke="#0F172A"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Vertical cursor guide line when active */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingTop}
              x2={activePoint.x}
              y2={paddingTop + effectiveHeight}
              stroke="#0F172A"
              strokeDasharray="3 3"
              strokeWidth="1.5"
              opacity="0.35"
            />
          )}

          {/* Points (Inactive and Active) */}
          {coords.map((pt, idx) => {
            const isActive = hoveredIndex === idx;

            return (
              <g key={idx}>
                {/* Visual circle dot */}
                {isActive ? (
                  <>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="10"
                      fill="#10B981"
                      opacity="0.2"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5.5"
                      fill="#10B981"
                      stroke="#FFFFFF"
                      strokeWidth="2.5"
                    />
                  </>
                ) : (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#0F172A"
                    strokeWidth="2"
                  />
                )}

                {/* X Axis Date Labels */}
                {(idx === 0 ||
                  idx === coords.length - 1 ||
                  idx === Math.floor(coords.length / 2)) && (
                  <text
                    x={pt.x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="fill-[#64748B] text-[10px] font-sans"
                  >
                    {pt.date === 'Awal' ? 'Awal' : formatDateID(pt.date)}
                  </text>
                )}

                {/* Generous invisible hover target area (prevents flickering) */}
                <rect
                  x={pt.x - effectiveWidth / (coords.length * 2)}
                  y={paddingTop}
                  width={Math.max(28, effectiveWidth / coords.length)}
                  height={effectiveHeight + 15}
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(idx)}
                />
              </g>
            );
          })}

          {/* SVG Tooltip Card (Rendered inside SVG with pointer-events-none) */}
          {activePoint && (
            <g
              transform={`translate(${tooltipX}, ${tooltipY})`}
              className="pointer-events-none transition-transform duration-75"
            >
              <rect
                x="-68"
                y="-42"
                width="136"
                height="40"
                rx="8"
                fill="#0F172A"
                filter="drop-shadow(0 4px 6px rgba(0, 0, 0, 0.2))"
              />
              <text
                x="0"
                y="-26"
                textAnchor="middle"
                fill="#94A3B8"
                fontSize="9.5"
                fontFamily="inherit"
              >
                {activePoint.date === 'Awal' ? 'Saldo Awal' : formatDateID(activePoint.date)}
              </text>
              <text
                x="0"
                y="-11"
                textAnchor="middle"
                fill="#10B981"
                fontSize="11.5"
                fontWeight="bold"
                fontFamily="inherit"
              >
                {formatRupiah(activePoint.balance)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
