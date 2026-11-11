'use client';

import React, { useState, useEffect } from 'react';
import { X, Trash2 } from 'lucide-react';
import { Category } from '@/types/finance';
import { CategoryIcon, AVAILABLE_CATEGORY_ICONS } from './CategoryIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (categoryData: Omit<Category, 'id'> & { id?: string }) => void;
  onDelete?: (id: string) => void;
  editingCategory?: Category | null;
}

const PRESET_COLORS = [
  '#EF4444', // Red
  '#F59E0B', // Amber
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#14B8A6', // Teal
  '#64748B', // Slate
  '#0F172A', // Navy
];

export function CategoryModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editingCategory,
}: CategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'expense' | 'income' | 'all'>('expense');
  const [color, setColor] = useState('#EF4444');
  const [icon, setIcon] = useState('Tag');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setType(editingCategory.type);
      setColor(editingCategory.color);
      setIcon(editingCategory.icon);
    } else {
      setName('');
      setType('expense');
      setColor('#EF4444');
      setIcon('Tag');
    }
    setErrorMsg('');
  }, [editingCategory, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Nama kategori tidak boleh kosong');
      return;
    }

    onSave({
      id: editingCategory ? editingCategory.id : undefined,
      name: name.trim(),
      type,
      color,
      icon,
      isDefault: false,
    });

    onClose();
  };

  const handleDelete = () => {
    if (editingCategory && onDelete) {
      onDelete(editingCategory.id);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-[#E2E8F0] animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#0F172A]">
              {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
            </h3>
            <p className="text-xs text-[#64748B]">Kelola kategori untuk klasifikasi transaksi</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-5 flex flex-col gap-4">
          {errorMsg && (
            <div className="p-2.5 text-xs font-semibold text-[#EF4444] bg-red-50 border border-red-200 rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Nama Kategori */}
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Nama Kategori
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Investasi, Zakat, Skincare"
              className="w-full px-3.5 py-2 bg-white border border-[#CBD5E1] rounded-xl text-xs font-medium text-[#1E293B] focus:outline-hidden focus:border-[#0F172A]"
              autoFocus
            />
          </div>

          {/* Tipe Kategori */}
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Jenis Kategori
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'expense', label: 'Pengeluaran' },
                { id: 'income', label: 'Pemasukan' },
                { id: 'all', label: 'Keduanya' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setType(opt.id as 'expense' | 'income' | 'all')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all border ${
                    type === opt.id
                      ? 'bg-[#0F172A] text-white border-[#0F172A] shadow-xs'
                      : 'bg-white text-[#64748B] border-[#CBD5E1] hover:border-[#0F172A]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Pilihan Warna */}
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Warna Ikon
            </label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-offset-2 ring-[#0F172A]' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Pilihan Ikon */}
          <div>
            <label className="block text-xs font-semibold text-[#1E293B] mb-1.5">
              Pilih Ikon
            </label>
            <div className="grid grid-cols-6 gap-2 max-h-28 overflow-y-auto p-2 border border-[#E2E8F0] rounded-xl bg-[#F8FAFC]">
              {AVAILABLE_CATEGORY_ICONS.map((iconName) => {
                const isSelected = icon === iconName;
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setIcon(iconName)}
                    className={`p-1.5 rounded-lg flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#0F172A] text-white shadow-xs'
                        : 'bg-white text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9]'
                    }`}
                  >
                    <CategoryIcon name={iconName} size={15} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Preview */}
          <div className="p-2.5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#64748B]">Preview:</span>
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-md flex items-center justify-center text-white shadow-2xs"
                style={{ backgroundColor: color }}
              >
                <CategoryIcon name={icon} size={13} className="text-white" />
              </div>
              <span className="text-xs font-bold text-[#0F172A]">{name || 'Nama Kategori'}</span>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0] mt-1">
            {editingCategory && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#EF4444] hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Hapus Kategori</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#0F172A] hover:bg-slate-800 rounded-xl shadow-xs transition-colors"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
