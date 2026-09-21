import React, { useState } from 'react';
import { HandHeart, Search, RotateCw, Calendar, Tag, Sparkles } from 'lucide-react';
import { Volunteer } from '../lib/types';
import { Badge } from './ui/Badge';

interface VolunteerListProps {
  volunteers: Volunteer[];
  isLoading: boolean;
  onRefresh: () => void;
}

export const VolunteerList: React.FC<VolunteerListProps> = ({
  volunteers,
  isLoading,
  onRefresh,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = volunteers.filter(
    (v) =>
      v.name.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      v.role.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  const getRoleBadgeVariant = (role: string): 'gold' | 'red' | 'green' | 'neutral' => {
    const r = role.toLowerCase();
    if (r.includes('bhog')) return 'green';
    if (r.includes('pandal') || r.includes('crowd')) return 'red';
    if (r.includes('cultural') || r.includes('stage')) return 'gold';
    if (r.includes('anandamela') || r.includes('stall')) return 'gold';
    return 'neutral';
  };

  return (
    <div
      id="volunteer-list"
      className="scroll-mt-16 sm:scroll-mt-20 bg-white rounded-2xl border border-amber-200/80 shadow-md p-4 sm:p-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-amber-100">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-800">
            <HandHeart className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold font-serif text-puja-red-900">
              Community Volunteer Squad
            </h3>
            <p className="text-xs text-gray-500">
              Residents stepping forward for Bangur Puja 2026
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="self-end sm:self-auto inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-colors disabled:opacity-50 cursor-pointer"
          title="Refresh volunteer squad"
        >
          <RotateCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-puja-red' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Small Summary Metrics Strip */}
      <div className="flex items-center justify-between gap-2 bg-gradient-to-r from-blue-50/80 via-amber-50/70 to-blue-50/80 rounded-xl px-3 sm:px-3.5 py-2 mb-4 border border-blue-200/60 text-xs overflow-hidden">
        <div className="flex items-center space-x-1.5 text-gray-600 shrink-0">
          <span className="text-gray-500">Active Volunteers:</span>
          <span className="font-semibold text-blue-900 bg-white/90 px-2 py-0.5 rounded-md border border-blue-200/80 font-mono">
            {volunteers.length}
          </span>
        </div>

        <div className="flex items-center space-x-1 sm:space-x-1.5 shrink-0 text-gray-600">
          <Sparkles className="w-3.5 h-3.5 text-puja-gold shrink-0" />
          <span className="text-gray-500 hidden sm:inline">Spirit:</span>
          <span className="font-semibold text-puja-red text-xs">
            Community Pride
          </span>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search by volunteer name or role..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-sm rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-puja-gold/60 focus:border-puja-gold bg-amber-50/30 placeholder-gray-400"
        />
      </div>

      {/* List / Empty / Loading State */}
      {isLoading && volunteers.length === 0 ? (
        <div className="py-12 text-center text-gray-400">
          <div className="w-8 h-8 mx-auto border-3 border-puja-red border-t-transparent rounded-full animate-spin mb-3"></div>
          <p className="text-sm">Loading volunteer squad...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-10 text-center text-gray-500 bg-amber-50/50 rounded-xl border border-dashed border-amber-200 p-6">
          <p className="text-sm font-medium">
            {searchQuery ? 'No volunteers found matching your search.' : 'No volunteers registered yet.'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {searchQuery ? 'Try another keyword.' : 'Be the first resident to join the volunteer squad!'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filtered.map((vol, idx) => (
            <div
              key={`${vol.name}-${idx}`}
              className="p-4 rounded-xl border border-amber-100 bg-gradient-to-br from-white to-blue-50/20 hover:border-blue-300 transition-all text-left flex flex-col justify-between overflow-hidden shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge variant={getRoleBadgeVariant(vol.role)}>
                    <Tag className="w-3 h-3 mr-1" />
                    {vol.role}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2.5 min-w-0 mb-2">
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-100 to-indigo-50 border border-blue-200/80 text-blue-900 font-semibold text-xs flex items-center justify-center shrink-0 uppercase shadow-xs">
                    {vol.name ? vol.name.trim().charAt(0).toUpperCase() : '•'}
                  </span>
                  <h4 className="text-sm font-bold text-gray-900 leading-snug truncate">
                    {vol.name}
                  </h4>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-amber-100/80 flex items-center text-xs text-gray-600">
                <Calendar className="w-3.5 h-3.5 text-gray-400 mr-1.5 shrink-0" />
                <span className="text-gray-500 mr-1 shrink-0">Availability:</span>
                <span className="font-medium text-gray-800 truncate">{vol.availability}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Privacy Note */}
      <div className="mt-5 pt-3 text-center border-t border-amber-100 text-[11px] text-gray-400">
        🔒 Volunteer contact details and personal notes are kept strictly private with the organizing committee.
      </div>
    </div>
  );
};