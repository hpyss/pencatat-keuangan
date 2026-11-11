'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { Transaction, Category, TransactionType } from '@/types/finance';
import { User } from '@/types/auth';
import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredCategories,
  saveStoredCategories,
} from '@/lib/storage';
import { getActiveUser, logoutUser } from '@/lib/auth';
import { Sidebar, TopBar, TabId } from '@/components/Sidebar';
import { StatsOverview } from '@/components/dashboard/StatsOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { IncomeExpenseBarChart } from '@/components/charts/IncomeExpenseBarChart';
import { TransactionModal } from '@/components/TransactionModal';
import { TransactionHistory } from '@/components/TransactionHistory';
import { CategoryManager } from '@/components/CategoryManager';
import { ReportView } from '@/components/ReportView';
import { ChartsView } from '@/components/ChartsView';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import { AttachmentViewerModal } from '@/components/AttachmentViewerModal';
import { AuthPage } from '@/components/auth/AuthPage';
import { UserProfileModal } from '@/components/auth/UserProfileModal';
import { DEFAULT_CATEGORIES } from '@/lib/constants';

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Modal states
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('expense');
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [attachmentView, setAttachmentView] = useState<{ url: string; title: string } | null>(null);

  // Profile Modal
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  // Toast
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const pushToast = useCallback((type: ToastMessage['type'], message: string) => {
    const id = generateId();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Hydrate from localStorage once mounted
  useEffect(() => {
    const user = getActiveUser();
    setCurrentUser(user);
    if (user) {
      setTransactions(getStoredTransactions(user.id));
      setCategories(getStoredCategories(user.id));
    }
    setHydrated(true);
  }, []);

  // ---- Auth handlers ----
  const handleAuthSuccess = useCallback(
    (user: User, message: string) => {
      setCurrentUser(user);
      setTransactions(getStoredTransactions(user.id));
      setCategories(getStoredCategories(user.id));
      pushToast('success', message);
    },
    [pushToast]
  );

  const handleLogout = useCallback(() => {
    logoutUser();
    setCurrentUser(null);
    setTransactions([]);
    setCategories(DEFAULT_CATEGORIES);
    pushToast('info', 'Anda telah keluar dari akun');
  }, [pushToast]);

  // ---- Transaction handlers ----
  const openAddModal = useCallback((type: TransactionType = 'expense') => {
    setEditingTx(null);
    setTxModalType(type);
    setTxModalOpen(true);
  }, []);

  const openEditModal = useCallback((tx: Transaction) => {
    setEditingTx(tx);
    setTxModalType(tx.type);
    setTxModalOpen(true);
  }, []);

  const handleSaveTransaction = useCallback(
    (data: Omit<Transaction, 'id' | 'createdAt'> & { id?: string }) => {
      setTransactions((prev) => {
        let updated: Transaction[];
        if (data.id) {
          // Edit existing
          updated = prev.map((tx) =>
            tx.id === data.id
              ? { ...tx, ...data, id: tx.id, createdAt: tx.createdAt }
              : tx
          );
          pushToast('success', 'Transaksi berhasil diperbarui');
        } else {
          // Add new
          const newTx: Transaction = {
            ...data,
            id: generateId(),
            createdAt: Date.now(),
          };
          updated = [newTx, ...prev];
          pushToast(
            'success',
            `${data.type === 'income' ? 'Pemasukan' : 'Pengeluaran'} berhasil dicatat`
          );
        }
        saveStoredTransactions(updated, currentUser?.id);
        return updated;
      });
    },
    [pushToast, currentUser?.id]
  );

  const handleDeleteTransaction = useCallback(
    (id: string) => {
      setTransactions((prev) => {
        const updated = prev.filter((tx) => tx.id !== id);
        saveStoredTransactions(updated, currentUser?.id);
        return updated;
      });
      pushToast('success', 'Transaksi berhasil dihapus');
    },
    [pushToast, currentUser?.id]
  );

  // ---- Category handlers ----
  const handleAddCategory = useCallback(
    (cat: Omit<Category, 'id'>) => {
      const newCat: Category = { ...cat, id: generateId() };
      setCategories((prev) => {
        const updated = [...prev, newCat];
        saveStoredCategories(updated, currentUser?.id);
        return updated;
      });
      pushToast('success', `Kategori "${cat.name}" berhasil ditambahkan`);
    },
    [pushToast, currentUser?.id]
  );

  const handleEditCategory = useCallback(
    (cat: Category) => {
      setCategories((prev) => {
        const updated = prev.map((c) => (c.id === cat.id ? cat : c));
        saveStoredCategories(updated, currentUser?.id);
        return updated;
      });
      pushToast('success', `Kategori "${cat.name}" berhasil diperbarui`);
    },
    [pushToast, currentUser?.id]
  );

  const handleDeleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        saveStoredCategories(updated, currentUser?.id);
        return updated;
      });
      pushToast('success', 'Kategori berhasil dihapus');
    },
    [pushToast, currentUser?.id]
  );

  const handleResetCategories = useCallback(() => {
    setCategories(DEFAULT_CATEGORIES);
    saveStoredCategories(DEFAULT_CATEGORIES, currentUser?.id);
    pushToast('info', 'Daftar kategori dikembalikan ke bawaan');
  }, [pushToast, currentUser?.id]);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#64748B] mt-3 font-medium">Memuat data...</p>
        </div>
      </div>
    );
  }

  // If user is NOT logged in, render the dedicated AuthPage!
  if (!currentUser) {
    return (
      <>
        <AuthPage onLoginSuccess={handleAuthSuccess} />
        <ToastContainer toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  // When logged in, render the complete dashboard shell
  return (
    <div className="min-h-screen flex bg-[#F8FAFC]">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setMobileOpen(false);
        }}
        onAddTransaction={() => openAddModal('expense')}
        mobileOpen={mobileOpen}
        onMobileToggle={() => setMobileOpen((o) => !o)}
        user={currentUser}
        onOpenAuth={() => {}}
        onOpenProfile={() => setProfileModalOpen(true)}
      />

      {/* Main content area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">
        <TopBar
          activeTab={activeTab}
          onMobileMenuToggle={() => setMobileOpen((o) => !o)}
          onAddTransaction={() => openAddModal('expense')}
          user={currentUser}
          onOpenAuth={() => {}}
          onOpenProfile={() => setProfileModalOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 max-w-6xl mx-auto w-full">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="flex flex-col gap-5">
              <StatsOverview
                transactions={transactions}
                onOpenAddModal={(type) => openAddModal(type || 'expense')}
              />
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <div className="xl:col-span-2">
                  <IncomeExpenseBarChart transactions={transactions} />
                </div>
                <div>
                  <RecentTransactions
                    transactions={transactions}
                    categories={categories}
                    onViewAll={() => setActiveTab('history')}
                    onEdit={openEditModal}
                    onDelete={(tx) => handleDeleteTransaction(tx.id)}
                    onViewAttachment={(url, title) => setAttachmentView({ url, title })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {activeTab === 'history' && (
            <TransactionHistory
              transactions={transactions}
              categories={categories}
              onEdit={openEditModal}
              onDelete={handleDeleteTransaction}
            />
          )}

          {/* Categories */}
          {activeTab === 'categories' && (
            <CategoryManager
              categories={categories}
              transactions={transactions}
              onAdd={handleAddCategory}
              onEdit={handleEditCategory}
              onDelete={handleDeleteCategory}
              onResetDefaults={handleResetCategories}
            />
          )}

          {/* Report */}
          {activeTab === 'report' && (
            <ReportView transactions={transactions} categories={categories} />
          )}

          {/* Charts */}
          {activeTab === 'charts' && (
            <ChartsView transactions={transactions} categories={categories} />
          )}
        </main>
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={txModalOpen}
        onClose={() => {
          setTxModalOpen(false);
          setEditingTx(null);
        }}
        onSave={handleSaveTransaction}
        categories={categories}
        editingTransaction={editingTx}
        defaultType={txModalType}
      />

      {/* Attachment Viewer */}
      <AttachmentViewerModal
        isOpen={!!attachmentView}
        onClose={() => setAttachmentView(null)}
        imageUrl={attachmentView?.url}
        title={attachmentView?.title}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
        user={currentUser}
        onLogout={handleLogout}
        onSwitchAccount={handleLogout}
        transactionCount={transactions.length}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
