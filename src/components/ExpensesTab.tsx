import React, { useState } from 'react';
import { ReceiptText, ShieldCheck, Filter, RotateCw, Calendar, Tag } from 'lucide-react';
import { Expense } from '../lib/types';
import { Badge } from './ui/Badge';

interface ExpensesTabProps {
  expenses: Expense[];
  totalAmount: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ExpensesTab: React.FC<ExpensesTabProps> = ({
  expenses,
  totalAmount,
  isLoading,
  onRefresh,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Extract unique categories
  const categories = ['All', ...Array.from(new Set(expenses.map((e) => e.category || 'General')))];

  const filteredExpenses =
    selectedCategory === 'All'
      ? expenses
      : expenses.filter((e) => (e.category || 'General') === selectedCategory);

  const getCategoryBadgeVariant = (cat: string): 'gold' | 'red' | 'green' | 'neutral' => {
    const c = cat.toLowerCase();
    if (c.includes('decor') || c.includes('pandal')) return 'gold';
    if (c.includes('idol') || c.includes('puja') || c.includes('priest')) return 'red';
    if (c.includes('cater') || c.includes('bhog')) return 'green';
    return 'neutral';
  };

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Committee Integrity Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 p-3.5 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-start space-x-3">
          <div className="p-2 rounded-xl bg-amber-100 text-puja-red shrink-0 mt-0.5 sm:mt-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold font-serif text-puja-red-900">
              Committee Expense Transparency
            </h3>
            <p className="text-[11px] sm:text-xs text-gray-700 mt-0.5">
              Read-only mirror maintained and audited directly by the puja committee.
            </p>
          </div>
        </div>

        {/* Total Summary Card */}
        <div className="w-full sm:w-auto bg-white/90 border border-amber-200 rounded-xl px-5 py-3 shadow-xs text-left sm:text-right shrink-0">
          <span className="text-[11px] font-medium uppercase tracking-wider text-gray-500 block">
            Total Accounted
          </span>
          <span className="text-xl sm:text-2xl font-bold font-serif text-puja-red">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Category Filter & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2 overflow-x-auto max-w-full pb-2 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-gray-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-puja-red text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-amber-50 border border-amber-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-end sm:self-auto inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-gray-600 bg-white hover:bg-amber-50 border border-amber-200 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
          title="Refresh expenses"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-puja-red' : ''}`} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Expenses Table / Cards */}
      {isLoading && expenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-amber-200 p-12 text-center text-gray-400">
          <div className="w-8 h-8 mx-auto border-3 border-puja-red border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading expense records from Google Sheet...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-amber-200 p-12 text-center text-gray-500">
          <ReceiptText className="w-10 h-10 mx-auto text-amber-300 mb-2" />
          <p className="text-sm font-medium">No expense items found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExpenses.map((expense, idx) => (
            <div
              key={`${expense.item}-${idx}`}
              className="bg-white rounded-2xl border border-amber-200/80 hover:border-amber-300 p-5 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <Badge variant={getCategoryBadgeVariant(expense.category)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {expense.category || 'General'}
                  </Badge>

                  <span className="text-lg font-bold font-serif text-puja-red">
                    {formatCurrency(expense.amount)}
                  </span>
                </div>

                <h4 className="text-base font-semibold text-gray-900 leading-snug mb-1">
                  {expense.item}
                </h4>

                {expense.notes && (
                  <p className="text-xs text-gray-600 mb-3 bg-stone-50 p-2 rounded-lg border border-stone-100">
                    {expense.notes}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-amber-100 flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  <span>{expense.date || 'Pending date'}</span>
                </div>

                {expense.paidTo && (
                  <div className="text-gray-600 font-medium truncate max-w-[180px]">
                    Paid to: <span className="text-gray-900">{expense.paidTo}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
