export type TransactionType = 'income' | 'expense';

export type PaymentMethod = 
  | 'Tunai'
  | 'Transfer Bank'
  | 'E-Wallet'
  | 'Kartu Kredit'
  | 'QRIS'
  | 'Lainnya';

export interface Category {
  id: string;
  name: string;
  type: 'expense' | 'income' | 'all';
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  date: string; // Format: YYYY-MM-DD
  category: string;
  note: string;
  paymentMethod: PaymentMethod;
  attachment?: string; // base64 data URL or image path
  createdAt: number;
}

export type TimeFilterPeriod = 'all' | 'today' | '7days' | 'this_month' | 'last_month' | 'this_year' | 'custom';

export interface TransactionFilter {
  period: TimeFilterPeriod;
  startDate?: string;
  endDate?: string;
  type?: 'all' | TransactionType;
  category?: string;
  paymentMethod?: string;
  searchQuery?: string;
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';

