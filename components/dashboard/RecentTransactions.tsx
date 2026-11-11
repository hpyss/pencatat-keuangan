'use client';

import React from 'react';
import { ArrowUpRight, ArrowDownLeft, FileText, ChevronRight, Edit3, Trash2 } from 'lucide-react';
import { Transaction, Category } from '@/types/finance';
import { formatRupiah, formatDateID } from '@/lib/utils';
import { CategoryIcon } from '../CategoryIcon';

interface RecentTransactionsProps {
  transactions: Transaction[];
  categories: Category[];
  onViewAll: () => void;
  onEdit: (tx: Transaction) => void;
  onDelete: (tx: Transaction) => void;
  onViewAttachment: (url: string, title: string) => void;
}

export function RecentTransactions({
  transactions,
  categories,
  onViewAll,
  onEdit,
  onDelete,
  onViewAttachment,
}: RecentTransactionsProps) {
  // Sort descending by date, then createdAt
  const recentList = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() || b.createdAt - a.createdAt)
    .slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0]">
        <div>
          <h3 className="text-base font-bold text-[#0F172A]">Transaksi Terbaru</h3>
          <p className="text-xs text-[#64748B]">5 aktivitas keuangan terakhir yang tercatat</p>
        </div>
        <button
          onClick={onViewAll}
          className="flex items-center gap-1 text-xs font-semibold text-[#0F172A] hover:text-[#10B981] transition-colors py-1 px-2 rounded-lg hover:bg-[#F8FAFC]"
        >
          <span>Lihat Semua</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {recentList.length === 0 ? (
        <div className="py-10 text-center text-xs text-[#64748B]">
          Belum ada transaksi yang dicatat
        </div>
      ) : (
        <div className="divide-y divide-[#F1F5F9]">
          {recentList.map((tx) => {
            const catObj = categories.find((c) => c.name.toLowerCase() === tx.category.toLowerCase());
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="py-3.5 flex items-center justify-between gap-3 hover:bg-[#F8FAFC] px-2 rounded-xl transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: catObj?.color || (isIncome ? '#10B981' : '#EF4444') }}
                  >
                    <CategoryIcon name={catObj?.icon || (isIncome ? 'Briefcase' : 'ShoppingBag')} size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#0F172A] truncate">
                      {tx.note || tx.category}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#64748B]">
                      <span>{formatDateID(tx.date)}</span>
                      <span>•</span>
                      <span className="font-medium text-[#1E293B]">{tx.category}</span>
                      <span>•</span>
                      <span>{tx.paymentMethod}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {tx.attachment && (
                    <button
                      onClick={() => onViewAttachment(tx.attachment!, tx.note || tx.category)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Lihat Bukti Foto"
                    >
                      <FileText className="w-4 h-4" />
                    </button>
                  )}

                  <div className="text-right">
                    <div
                      className={`text-xs sm:text-sm font-bold flex items-center justify-end gap-1 ${
                        isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {isIncome ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownLeft className="w-3.5 h-3.5" />
                      )}
                      <span>{formatRupiah(tx.amount)}</span>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(tx)}
                      className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                      title="Edit Transaksi"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDelete(tx)}
                      className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                      title="Hapus Transaksi"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

