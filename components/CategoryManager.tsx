'use client';

import React, { useState } from 'react';
import { Category, Transaction } from '@/types/finance';
import { CategoryIcon } from '@/components/CategoryIcon';
import { CategoryModal } from '@/components/CategoryModal';
import { DeleteConfirmModal } from '@/components/DeleteConfirmModal';
import { Plus, Edit3, Trash2, RotateCcw } from 'lucide-react';

interface CategoryManagerProps {
  categories: Category[];
  transactions?: Transaction[];
  onAdd: (cat: Omit<Category, 'id'>) => void;
  onEdit: (cat: Category) => void;
  onDelete: (id: string) => void;
  onResetDefaults?: () => void;
}

export function CategoryManager({
  categories,
  transactions = [],
  onAdd,
  onEdit,
  onDelete,
  onResetDefaults,
}: CategoryManagerProps) {
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  const expenseCategories = categories.filter((c) => c.type === 'expense' || c.type === 'all');
  const incomeCategories = categories.filter((c) => c.type === 'income' || c.type === 'all');

  const getUsageCount = (catName: string) => {
    return transactions.filter((t) => t.category.toLowerCase() === catName.toLowerCase()).length;
  };

  const handleSave = (data: Omit<Category, 'id'> & { id?: string }) => {
    if (data.id) {
      onEdit({ ...data, id: data.id } as Category);
    } else {
      onAdd({
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
        isDefault: data.isDefault,
      });
    }
  };

  const CategoryCard = ({ cat }: { cat: Category }) => {
    const usageCount = getUsageCount(cat.name);

    return (
      <div className="flex items-center justify-between p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all group">
        <div className="flex items-center gap-2.5 min-w-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 shadow-xs"
            style={{ backgroundColor: cat.color }}
          >
            <CategoryIcon name={cat.icon} size={15} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[#0F172A] truncate">{cat.name}</p>
            <p className="text-[11px] text-[#64748B]">
              {usageCount > 0 ? `${usageCount} transaksi` : 'Belum ada transaksi'}
            </p>
          </div>
        </div>

        {/* Action Buttons (Edit and Delete) */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => {
              setEditingCategory(cat);
              setShowModal(true);
            }}
            className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-white rounded-lg transition-colors"
            title="Edit Kategori"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setDeletingCategory(cat)}
            className="p-1.5 text-[#64748B] hover:text-[#EF4444] hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Kategori"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header & Quick Actions */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-[#0F172A]">Kelola Kategori</h3>
            <p className="text-xs text-[#64748B]">
              Tambah, ubah, atau hapus kategori untuk mengelompokkan transaksi Anda
            </p>
          </div>
          <div className="flex items-center gap-2">
            {onResetDefaults && (
              <button
                onClick={onResetDefaults}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] bg-[#F1F5F9] hover:bg-[#E2E8F0] rounded-xl transition-colors"
                title="Kembalikan daftar kategori default"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Reset Default</span>
              </button>
            )}
            <button
              onClick={() => {
                setEditingCategory(null);
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#0F172A] text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori</span>
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Kategori', value: categories.length },
            { label: 'Pengeluaran', value: expenseCategories.length },
            { label: 'Pemasukan', value: incomeCategories.length },
          ].map((stat) => (
            <div key={stat.label} className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-3 text-center">
              <p className="text-xl font-bold text-[#0F172A]">{stat.value}</p>
              <p className="text-[11px] text-[#64748B] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div className="w-2 h-2 rounded-full bg-[#EF4444]" />
          <h4 className="text-sm font-bold text-[#0F172A]">Kategori Pengeluaran</h4>
          <span className="text-xs text-[#64748B] font-medium ml-auto">
            {expenseCategories.length} kategori
          </span>
        </div>
        {expenseCategories.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-4">
            Belum ada kategori pengeluaran. Klik &quot;Tambah Kategori&quot; di atas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {expenseCategories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>

      {/* Income Categories */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#E2E8F0]">
          <div className="w-2 h-2 rounded-full bg-[#10B981]" />
          <h4 className="text-sm font-bold text-[#0F172A]">Kategori Pemasukan</h4>
          <span className="text-xs text-[#64748B] font-medium ml-auto">
            {incomeCategories.length} kategori
          </span>
        </div>
        {incomeCategories.length === 0 ? (
          <p className="text-xs text-[#64748B] text-center py-4">
            Belum ada kategori pemasukan. Klik &quot;Tambah Kategori&quot; di atas.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {incomeCategories.map((cat) => (
              <CategoryCard key={cat.id} cat={cat} />
            ))}
          </div>
        )}
      </div>

      {/* Category Modal (Add / Edit) */}
      <CategoryModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSave={handleSave}
        onDelete={(id) => {
          const cat = categories.find((c) => c.id === id);
          if (cat) {
            setDeletingCategory(cat);
          }
        }}
        editingCategory={editingCategory}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!deletingCategory}
        onClose={() => setDeletingCategory(null)}
        onConfirm={() => {
          if (deletingCategory) {
            onDelete(deletingCategory.id);
            setDeletingCategory(null);
          }
        }}
        title="Hapus Kategori?"
        description={
          deletingCategory
            ? `Kategori "${deletingCategory.name}"${
                getUsageCount(deletingCategory.name) > 0
                  ? ` (digunakan pada ${getUsageCount(deletingCategory.name)} transaksi)`
                  : ''
              } akan dihapus. Riwayat transaksi yang sudah ada tidak akan hilang.`
            : ''
        }
      />
    </div>
  );
}
