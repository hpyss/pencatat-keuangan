'use client';

import React, { useState, useCallback } from 'react';
import { Transaction, Category, TransactionFilter } from '@/types/finance';
import { formatRupiah, formatDateID } from '@/lib/utils';
import { CategoryIcon } from '@/components/CategoryIcon';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { AttachmentViewerModal } from '@/components/AttachmentViewerModal';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  ArrowDownLeft,
  Edit3,
  Trash2,
  FileText,
  X,
  ChevronDown,
} from 'lucide-react';
import { PAYMENT_METHODS } from '@/lib/constants';

interface TransactionHistoryProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => void;
}

export function TransactionHistory({
  transactions,
  categories,
  onEdit,
  onDelete,
}: TransactionHistoryProps) {
  const [filter, setFilter] = useState<TransactionFilter>({ period: 'all' });
  const [showFilters, setShowFilters] = useState(false);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [attachmentView, setAttachmentView] = useState<{ url: string; title: string } | null>(null);

  // Apply filters
  const filtered = transactions.filter((tx) => {
    // Date filter
    if (filter.startDate && tx.date < filter.startDate) return false;
    if (filter.endDate && tx.date > filter.endDate) return false;

    // Type filter
    if (filter.type && filter.type !== 'all' && tx.type !== filter.type) return false;

    // Category filter
    if (filter.category && filter.category !== 'all' && tx.category !== filter.category) return false;

    // Payment method filter
    if (filter.paymentMethod && filter.paymentMethod !== 'all' && tx.paymentMethod !== filter.paymentMethod) return false;

    // Search
    if (filter.searchQuery) {
      const q = filter.searchQuery.toLowerCase();
      if (
        !tx.note.toLowerCase().includes(q) &&
        !tx.category.toLowerCase().includes(q) &&
        !String(tx.amount).includes(q)
      ) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime() ||
      b.createdAt - a.createdAt
  );

  // Group by date
  const grouped: Record<string, Transaction[]> = {};
  sorted.forEach((tx) => {
    if (!grouped[tx.date]) grouped[tx.date] = [];
    grouped[tx.date].push(tx);
  });

  const hasActiveFilters =
    filter.type ||
    filter.category ||
    filter.paymentMethod ||
    filter.startDate ||
    filter.endDate;

  const clearFilters = useCallback(() => {
    setFilter({ period: 'all', searchQuery: filter.searchQuery });
  }, [filter.searchQuery]);

  return (
    <div className="flex flex-col gap-4">
      {/* Search + Filter Bar */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-4 shadow-xs flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              value={filter.searchQuery || ''}
              onChange={(e) => setFilter((f) => ({ ...f, searchQuery: e.target.value }))}
              placeholder="Cari transaksi (catatan, kategori, nominal)..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-[#F8FAFC] focus:outline-none focus:border-[#0F172A]"
            />
            {filter.searchQuery && (
              <button
                onClick={() => setFilter((f) => ({ ...f, searchQuery: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748B] hover:text-[#0F172A]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors ${
              showFilters || hasActiveFilters
                ? 'bg-[#0F172A] text-white border-[#0F172A]'
                : 'bg-white text-[#1E293B] border-[#CBD5E1] hover:border-[#0F172A]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter</span>
            {hasActiveFilters && (
              <span className="bg-[#10B981] text-white w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold">
                !
              </span>
            )}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="flex flex-col gap-3 pt-3 border-t border-[#E2E8F0]">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {/* Type */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Jenis</label>
                <div className="relative">
                  <select
                    value={filter.type || 'all'}
                    onChange={(e) => setFilter((f) => ({ ...f, type: e.target.value as 'all' | 'income' | 'expense' }))}
                    className="w-full appearance-none px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#0F172A] pr-7"
                  >
                    <option value="all">Semua</option>
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748B] pointer-events-none" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Kategori</label>
                <div className="relative">
                  <select
                    value={filter.category || 'all'}
                    onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#0F172A] pr-7"
                  >
                    <option value="all">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748B] pointer-events-none" />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Metode</label>
                <div className="relative">
                  <select
                    value={filter.paymentMethod || 'all'}
                    onChange={(e) => setFilter((f) => ({ ...f, paymentMethod: e.target.value }))}
                    className="w-full appearance-none px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#0F172A] pr-7"
                  >
                    <option value="all">Semua Metode</option>
                    {PAYMENT_METHODS.map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[#64748B] pointer-events-none" />
                </div>
              </div>

              {/* Clear Filter */}
              <div className="flex items-end">
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="w-full px-3 py-2 text-xs font-semibold text-[#EF4444] border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
                  >
                    Hapus Filter
                  </button>
                )}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Dari Tanggal</label>
                <input
                  type="date"
                  value={filter.startDate || ''}
                  onChange={(e) => setFilter((f) => ({ ...f, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#0F172A]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#64748B] mb-1">Sampai Tanggal</label>
                <input
                  type="date"
                  value={filter.endDate || ''}
                  onChange={(e) => setFilter((f) => ({ ...f, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-[#CBD5E1] rounded-xl text-xs text-[#1E293B] bg-white focus:outline-none focus:border-[#0F172A]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between px-1">
        <span className="text-xs text-[#64748B] font-medium">
          Menampilkan <span className="font-bold text-[#0F172A]">{sorted.length}</span> transaksi
        </span>
        <div className="flex gap-3 text-xs font-semibold">
          <span className="text-[#10B981]">
            + {formatRupiah(sorted.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0))}
          </span>
          <span className="text-[#EF4444]">
            - {formatRupiah(sorted.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      {sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center">
          <p className="text-sm font-semibold text-[#1E293B]">Tidak ada transaksi ditemukan</p>
          <p className="text-xs text-[#64748B] mt-1">Coba ubah filter atau tambahkan transaksi baru</p>
        </div>
      ) : (
        Object.entries(grouped).map(([date, dayTxs]) => {
          const dayIncome = dayTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
          const dayExpense = dayTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
          return (
            <div key={date} className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
              {/* Date Header */}
              <div className="flex items-center justify-between px-5 py-3 bg-[#F8FAFC] border-b border-[#E2E8F0]">
                <span className="text-xs font-bold text-[#0F172A]">{formatDateID(date)}</span>
                <div className="flex gap-3 text-xs font-semibold">
                  {dayIncome > 0 && <span className="text-[#10B981]">+{formatRupiah(dayIncome)}</span>}
                  {dayExpense > 0 && <span className="text-[#EF4444]">-{formatRupiah(dayExpense)}</span>}
                </div>
              </div>

              {/* Transactions for that day */}
              <div className="divide-y divide-[#F1F5F9]">
                {dayTxs.map((tx) => {
                  const catObj = categories.find(c => c.name.toLowerCase() === tx.category.toLowerCase());
                  const isIncome = tx.type === 'income';
                  return (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between gap-3 px-5 py-4 hover:bg-[#F8FAFC] transition-colors group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0"
                          style={{ backgroundColor: catObj?.color || (isIncome ? '#10B981' : '#EF4444') }}
                        >
                          <CategoryIcon name={catObj?.icon || (isIncome ? 'Briefcase' : 'ShoppingBag')} size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#0F172A] truncate">{tx.note || tx.category}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className="text-[11px] text-[#64748B]">{tx.category}</span>
                            <span className="text-[11px] text-[#CBD5E1]">•</span>
                            <span className="text-[11px] text-[#64748B]">{tx.paymentMethod}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {tx.attachment && (
                          <button
                            onClick={() => setAttachmentView({ url: tx.attachment!, title: tx.note || tx.category })}
                            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Lihat Bukti"
                          >
                            <FileText className="w-4 h-4" />
                          </button>
                        )}

                        <span className={`text-sm font-bold flex items-center gap-1 min-w-20 justify-end ${isIncome ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
                          {isIncome ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                          {formatRupiah(tx.amount)}
                        </span>

                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => onEdit(tx)}
                            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setTxToDelete(tx)}
                            className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}

      <DeleteConfirmModal
        isOpen={!!txToDelete}
        onClose={() => setTxToDelete(null)}
        onConfirm={() => {
          if (txToDelete) onDelete(txToDelete.id);
          setTxToDelete(null);
        }}
        title="Hapus Transaksi?"
        description={
          txToDelete
            ? `Transaksi "${txToDelete.note || txToDelete.category}" senilai ${formatRupiah(txToDelete.amount)} pada ${formatDateID(txToDelete.date)} akan dihapus secara permanen.`
            : ''
        }
      />

      <AttachmentViewerModal
        isOpen={!!attachmentView}
        onClose={() => setAttachmentView(null)}
        imageUrl={attachmentView?.url}
        title={attachmentView?.title}
      />
    </div>
  );
}

