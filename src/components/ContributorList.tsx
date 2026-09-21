import React, { useState } from 'react';
import { Search, Users, RotateCw, Wallet } from 'lucide-react';
import { Contribution } from '../lib/types';

interface ContributorListProps {
  contributions: Contribution[];
  totalAmount?: number;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ContributorList: React.FC<ContributorListProps> = ({
  contributions,
  totalAmount = 0,
  isLoading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = contributions.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const formatCurrency = (amt: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amt);
  };

  return (
    <div id="contributor-list" className="scroll-mt-16 sm:scroll-mt-20 bg-white rounded-2xl border border-amber-200/80 shadow-md p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-amber-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-red-50 text-puja-red">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-puja-red-900">
              Community Contributors
            </h3>
            <p className="text-xs text-gray-500">
              Transparent community participation ledger
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-end sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh list"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-puja-red' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Small Summary Metrics Strip */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-amber-50/90 to-orange-50/70 rounded-xl px-3 sm:px-3.5 py-2 mb-4 border border-amber-200/70 text-xs overflow-hidden">
        <div className="flex items-center space-x-1.5 text-gray-600 shrink-0">
          <span className="text-gray-500">Contributions:</span>
          <span className="font-semibold text-gray-900 bg-white/80 px-2 py-0.5 rounded-md border border-amber-200/60 font-mono">
            {contributions.length}
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0">
          <Wallet className="w-3.5 h-3.5 text-puja-gold shrink-0" />
          <span className="text-gray-500">Total:</span>
          <span className="font-bold font-serif text-puja-red text-xs sm:text-sm">
            {formatCurrency(totalAmount)}
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by contributor name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-puja-gold/60 focus:border-puja-gold bg-amber-50/30 placeholder-gray-400"
        />
      </div>

      {/* List / Empty / Loading State */}
      {isLoading && contributions.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="w-8 h-8 mx-auto border-3 border-puja-red border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading contributor list...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-amber-50/50 rounded-xl border border-dashed border-amber-200 p-6">
          <p className="text-sm font-medium">
            {searchQuery ? 'No contributors found matching your search.' : 'No contributions recorded yet.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery ? 'Try another keyword.' : 'Be the first one to record your contribution!'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-amber-100/80">
          {filtered.map((item, idx) => (
            <div
              key={`${item.name}-${idx}`}
              className="py-3 sm:py-3.5 flex items-center justify-between gap-2.5 hover:bg-amber-50/40 px-2 rounded-lg transition-colors overflow-hidden"
            >
              {/* Contributor Name */}
              <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0 flex-1">
                <span className="w-7 h-7 rounded-full bg-gradient-to-br from-amber-100 to-amber-50 border border-amber-200/80 text-puja-red font-semibold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                  {item.name ? item.name.trim().charAt(0).toUpperCase() : '•'}
                </span>
                <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                  {item.name}
                </span>
              </div>

              {/* Masked + Blurred Amount */}
              <div className="flex items-center shrink-0">
                <span
                  className="text-xs font-mono tracking-wider sm:tracking-widest text-gray-400 bg-stone-100 px-2 sm:px-2.5 py-1 rounded-md border border-stone-200 select-none blur-[1.5px] hover:blur-none transition-all duration-300 shrink-0"
                  title="Amount is masked for privacy"
                >
                  {item.amountMasked || '₹ ● ● ● ●'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Privacy Note */}
      <div className="mt-5 pt-3 text-center border-t border-amber-100 text-[11px] text-gray-400">
        🔒 In line with committee policy, individual contribution amounts are protected and strictly masked.
      </div>
    </div>
  );
};
