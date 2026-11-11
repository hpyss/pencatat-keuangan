'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Upload, Trash2, ArrowUpRight, ArrowDownLeft, ChevronDown } from 'lucide-react';
import { Transaction, TransactionType, PaymentMethod, Category } from '@/types/finance';
import { PAYMENT_METHODS } from '@/lib/constants';
import { formatNumber, getTodayDateString } from '@/lib/utils';
import { CategoryIcon } from './CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (transactionData: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }) => void;
  categories: Category[];
  editingTransaction?: Transaction | null;
  defaultType?: TransactionType;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSave,
  categories,
  editingTransaction,
  defaultType = 'expense',
}: TransactionModalProps) {
  const [type, setType] = useState<TransactionType>(defaultType);
  const [amountStr, setAmountStr] = useState<string>('');
  const [date, setDate] = useState<string>(getTodayDateString());
  const [category, setCategory] = useState<string>('');
  const [note, setNote] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Tunai');
  const [attachment, setAttachment] = useState<string | undefined>(undefined);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTransaction) {
      setType(editingTransaction.type);
      setAmountStr(String(editingTransaction.amount));
      setDate(editingTransaction.date);
      setCategory(editingTransaction.category);
      setNote(editingTransaction.note);
      setPaymentMethod(editingTransaction.paymentMethod);
      setAttachment(editingTransaction.attachment);
    } else {
      setType(defaultType);
      setAmountStr('');
      setDate(getTodayDateString());
      const filtered = categories.filter((c) => c.type === defaultType || c.type === 'all');
      setCategory(filtered[0]?.name || 'Lainnya');
      setNote('');
      setPaymentMethod('Tunai');
      setAttachment(undefined);
    }
    setErrorMsg('');
  }, [editingTransaction, defaultType, isOpen, categories]);

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    const available = categories.filter((c) => c.type === newType || c.type === 'all');
    if (!available.some((c) => c.name === category)) {
      setCategory(available[0]?.name || 'Lainnya');
    }
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setAmountStr(val);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      setErrorMsg('Ukuran file maksimal 4MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setAttachment(reader.result as string);
      setErrorMsg('');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseInt(amountStr, 10);
    if (!parsedAmount || parsedAmount <= 0) {
      setErrorMsg('Nominal transaksi wajib diisi');
      return;
    }

    if (!category) {
      setErrorMsg('Pilih kategori transaksi');
      return;
    }

    onSave({
      id: editingTransaction ? editingTransaction.id : undefined,
      type,
      amount: parsedAmount,
      date: date || getTodayDateString(),
      category,
      note: note.trim() || (type === 'income' ? 'Pemasukan' : 'Pengeluaran'),
      paymentMethod,
      attachment,
    });

    onClose();
  };

  if (!isOpen) return null;

  const filteredCategories = categories.filter(
    (c) => c.type === type || c.type === 'all'
  );

  const numericVal = parseInt(amountStr, 10) || 0;
  const selectedCatObj = categories.find((c) => c.name === category);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-3 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-lg max-w-[420px] w-full overflow-hidden border border-[#E2E8F0] my-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Compact Modal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <h3 className="text-sm font-bold text-[#0F172A]">
              {editingTransaction ? 'Edit Transaksi' : 'Catat Transaksi'}
            </h3>
            <p className="text-[11px] text-[#64748B]">
              {type === 'income' ? 'Tambah pemasukan dana' : 'Tambah pengeluaran belanja'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#64748B] hover:text-[#0F172A] rounded-md transition-colors"
            aria-label="Tutup modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Compact Modal Body */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-3">
          {errorMsg && (
            <div className="py-1.5 px-3 text-xs font-semibold text-[#EF4444] bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Type Switcher: Income vs Expense */}
          <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F1F5F9] rounded-lg">
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-[#EF4444] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>Pengeluaran</span>
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`flex items-center justify-center gap-1.5 py-1.5 rounded-md text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-[#10B981] text-white shadow-2xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>Pemasukan</span>
            </button>
          </div>

          {/* Compact Nominal Input */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
              Nominal
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#64748B]">
                Rp
              </span>
              <input
                type="text"
                value={amountStr ? formatNumber(numericVal) : ''}
                onChange={handleAmountChange}
                placeholder="0"
                className="w-full pl-9 pr-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-base font-bold text-[#0F172A] focus:outline-hidden focus:border-[#0F172A]"
                autoFocus
              />
            </div>
          </div>

          {/* Kategori Selector (Side-by-side with icon badge, 100% iOS safe) */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
              Kategori
            </label>
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-2xs"
                style={{ backgroundColor: selectedCatObj?.color || '#0F172A' }}
              >
                <CategoryIcon name={selectedCatObj?.icon || 'Tag'} size={14} className="text-white" />
              </div>
              <div className="relative flex-1 min-w-0">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full pl-3 pr-8 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs font-semibold text-[#1E293B] focus:outline-hidden focus:border-[#0F172A] appearance-none"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Tanggal & Metode Pembayaran */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Tanggal
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-2.5 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
                Metode Pembayaran
              </label>
              <div className="relative">
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full pl-2.5 pr-7 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#1E293B] focus:outline-hidden focus:border-[#0F172A] appearance-none"
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#64748B] pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Catatan / Keterangan */}
          <div>
            <label className="block text-[11px] font-semibold text-[#64748B] mb-1">
              Catatan / Keterangan
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Contoh: Makan siang nasi padang"
              className="w-full px-3 py-2 bg-white border border-[#CBD5E1] rounded-lg text-xs text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
            />
          </div>

          {/* Lampiran Bukti Transaksi (Compact) */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />

            {attachment ? (
              <div className="flex items-center justify-between p-2 border border-[#E2E8F0] rounded-lg bg-[#F8FAFC]">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={attachment}
                    alt="Lampiran Struk"
                    className="w-8 h-8 object-cover rounded-md border border-[#CBD5E1]"
                  />
                  <div>
                    <p className="text-xs font-semibold text-[#0F172A]">Struk Terlampir</p>
                    <p className="text-[10px] text-[#64748B]">File siap disimpan</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAttachment(undefined);
                    if (fileInputRef.current) fileInputRef.current.value = '';
                  }}
                  className="p-1 text-[#EF4444] hover:bg-red-50 rounded-md transition-colors"
                  title="Hapus Lampiran"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 border border-dashed border-[#CBD5E1] hover:border-[#0F172A] rounded-lg text-xs font-medium text-[#64748B] hover:text-[#0F172A] transition-colors bg-[#F8FAFC]"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Lampirkan Struk / Nota (Opsional)</span>
              </button>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-lg transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className={`px-4 py-2 text-xs font-bold text-white rounded-lg shadow-2xs transition-colors ${
                type === 'income'
                  ? 'bg-[#10B981] hover:bg-emerald-600'
                  : 'bg-[#EF4444] hover:bg-red-600'
              }`}
            >
              {editingTransaction ? 'Simpan' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
