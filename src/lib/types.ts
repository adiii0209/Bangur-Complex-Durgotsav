export type ContributionMode = 'Cash' | 'UPI' | 'Bank Transfer';

export interface Contribution {
  name: string;
  amountMasked: string;
}

export interface ContributionFormData {
  name: string;
  amount: number | '';
  mode: ContributionMode;
  honeypot?: string;
}

export interface Expense {
  date: string;
  item: string;
  category: string;
  amount: number;
  paidTo?: string;
  notes?: string;
}

export interface Performance {
  name: string;
  actName: string;
  category: string;
}

export interface PerformanceFormData {
  name: string;
  actName: string;
  category: string;
  contact?: string;
  honeypot?: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

export interface ContributionsResponse {
  success?: boolean;
  contributions: Contribution[];
  totalCount?: number;
  totalAmount?: number;
  error?: string;
}

export interface ExpensesResponse {
  success?: boolean;
  expenses: Expense[];
  totalAmount?: number;
  error?: string;
}

export interface PerformancesResponse {
  success?: boolean;
  performances: Performance[];
  totalCount?: number;
  error?: string;
}
