import { Category, Transaction } from '@/types/finance';
import { DEFAULT_CATEGORIES, INITIAL_TRANSACTIONS } from './constants';

const BASE_TRANSACTIONS_KEY = 'pencatat_keuangan_transactions_v1';
const BASE_CATEGORIES_KEY = 'pencatat_keuangan_categories_v1';

function getTxKey(userId?: string): string {
  return userId ? `${BASE_TRANSACTIONS_KEY}_${userId}` : BASE_TRANSACTIONS_KEY;
}

function getCatKey(userId?: string): string {
  return userId ? `${BASE_CATEGORIES_KEY}_${userId}` : BASE_CATEGORIES_KEY;
}

export function getStoredTransactions(userId?: string): Transaction[] {
  if (typeof window === 'undefined') return INITIAL_TRANSACTIONS;
  const key = getTxKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      // If demo user or default, populate with INITIAL_TRANSACTIONS
      const initial = (!userId || userId === 'usr-demo') ? INITIAL_TRANSACTIONS : [];
      localStorage.setItem(key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load transactions from localStorage', error);
    return INITIAL_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: Transaction[], userId?: string): void {
  if (typeof window === 'undefined') return;
  const key = getTxKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(transactions));
  } catch (error) {
    console.error('Failed to save transactions to localStorage', error);
  }
}

export function getStoredCategories(userId?: string): Category[] {
  if (typeof window === 'undefined') return DEFAULT_CATEGORIES;
  const key = getCatKey(userId);
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    return JSON.parse(raw);
  } catch (error) {
    console.error('Failed to load categories from localStorage', error);
    return DEFAULT_CATEGORIES;
  }
}

export function saveStoredCategories(categories: Category[], userId?: string): void {
  if (typeof window === 'undefined') return;
  const key = getCatKey(userId);
  try {
    localStorage.setItem(key, JSON.stringify(categories));
  } catch (error) {
    console.error('Failed to save categories to localStorage', error);
  }
}

export function resetStoredData(userId?: string): { transactions: Transaction[]; categories: Category[] } {
  if (typeof window !== 'undefined') {
    localStorage.setItem(getTxKey(userId), JSON.stringify(INITIAL_TRANSACTIONS));
    localStorage.setItem(getCatKey(userId), JSON.stringify(DEFAULT_CATEGORIES));
  }
  return {
    transactions: INITIAL_TRANSACTIONS,
    categories: DEFAULT_CATEGORIES,
  };
}
