import React, { useState } from 'react';
import { Search, Sparkles, RotateCw, Music, Theater, Mic, Drum, HelpCircle } from 'lucide-react';
import { Performance } from '../lib/types';
import { Badge } from './ui/Badge';

interface ParticipantListProps {
  performances: Performance[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const ParticipantList: React.FC<ParticipantListProps> = ({
  performances,
  isLoading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = performances.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.actName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getCategoryIcon = (category: string) => {
    const c = category.toLowerCase();
    if (c.includes('dance')) return <Sparkles className="w-3.5 h-3.5 mr-1" />;
    if (c.includes('song') || c.includes('music')) return <Mic className="w-3.5 h-3.5 mr-1" />;
    if (c.includes('drama') || c.includes('natok')) return <Theater className="w-3.5 h-3.5 mr-1" />;
    if (c.includes('instrumental') || c.includes('tabla')) return <Drum className="w-3.5 h-3.5 mr-1" />;
    if (c.includes('recitation')) return <Music className="w-3.5 h-3.5 mr-1" />;
    return <HelpCircle className="w-3.5 h-3.5 mr-1" />;
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-6 sm:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-amber-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-100 text-puja-red">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-puja-red-900">
              Registered Acts & Artists
            </h3>
            <p className="text-xs text-gray-500">
              {performances.length} cultural {performances.length === 1 ? 'act' : 'acts'} lined up for the puja evenings
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

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by artist, act, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-puja-gold/60 focus:border-puja-gold bg-amber-50/30 placeholder-gray-400"
        />
      </div>

      {/* List / Empty State */}
      {isLoading && performances.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="w-8 h-8 mx-auto border-3 border-puja-red border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading registered performances...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-amber-50/50 rounded-xl border border-dashed border-amber-200 p-6">
          <p className="text-sm font-medium">
            {searchQuery ? 'No performances found matching your search.' : 'No performances registered yet.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery ? 'Try another search term.' : 'Be the first to register your performance!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.map((perf, idx) => (
            <div
              key={`${perf.name}-${idx}`}
              className="p-4 rounded-xl border border-amber-100 bg-gradient-to-br from-white to-amber-50/30 hover:border-amber-300 transition-all text-left flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant="gold">
                    {getCategoryIcon(perf.category)}
                    {perf.category}
                  </Badge>
                  <span className="text-[11px] font-mono text-gray-400">
                    #{idx + 1}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-gray-900 leading-snug">
                  {perf.actName}
                </h4>
              </div>

              <div className="mt-3 pt-2.5 border-t border-amber-100/80 flex items-center text-xs text-gray-600">
                <span className="text-gray-400 mr-1.5">Artist:</span>
                <span className="font-semibold text-puja-red-800">{perf.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Note */}
      <div className="mt-5 pt-3 text-center border-t border-amber-100 text-[11px] text-gray-400">
        🎭 Participant contact information is kept strictly private with the cultural committee.
      </div>
    </div>
  );
};
