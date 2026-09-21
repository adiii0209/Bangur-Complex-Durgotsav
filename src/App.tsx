import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake, ReceiptText, Sparkles, Shield, MapPin, CalendarDays, HandHeart } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { ContributeForm } from './components/ContributeForm';
import { ContributorList } from './components/ContributorList';
import { ExpensesTab } from './components/ExpensesTab';
import { PerformanceForm } from './components/PerformanceForm';
import { ParticipantList } from './components/ParticipantList';
import { VolunteerForm } from './components/VolunteerForm';
import { VolunteerList } from './components/VolunteerList';
import { SuccessAnimation } from './components/SuccessAnimation';
import {
  getContributions,
  getExpenses,
  getPerformances,
  getVolunteers,
} from './lib/api';
import { Contribution, Expense, Performance, Volunteer } from './lib/types';
import { Analytics } from '@vercel/analytics/react';

type SectionType = 'contribute' | 'expenses' | 'performances' | 'volunteer';

export const App: React.FC = () => {
  // Navigation State with URL hash synchronization
  const [activeSection, setActiveSection] = useState<SectionType>('contribute');
  const sectionContentRef = useRef<HTMLDivElement>(null);

  // Data State
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [totalContributionsAmount, setTotalContributionsAmount] = useState<number>(0);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [totalExpenses, setTotalExpenses] = useState<number>(0);
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);

  // Loading States
  const [loadingContributions, setLoadingContributions] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingPerformances, setLoadingPerformances] = useState(false);
  const [loadingVolunteers, setLoadingVolunteers] = useState(false);

  // Success Celebration Modal State
  const [celebrationModal, setCelebrationModal] = useState<{
    show: boolean;
    title: string;
    message: string;
    subMessage?: string;
  }>({
    show: false,
    title: '',
    message: '',
  });

  // 1. Synchronize URL Hash on Mount & Listen to hashchange
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'contribute' || hash === 'expenses' || hash === 'performances') {
        setActiveSection(hash as SectionType);
      }
    };

    // On initial load
    const initialHash = window.location.hash.replace('#', '').toLowerCase();
    if (initialHash === 'contribute' || initialHash === 'expenses' || initialHash === 'performances') {
      setActiveSection(initialHash as SectionType);
      setTimeout(() => {
        sectionContentRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // 2. Fetch data on load
  const loadContributions = async () => {
    setLoadingContributions(true);
    try {
      const res = await getContributions();
      setContributions(res.contributions || []);
      setTotalContributionsAmount(res.totalAmount || 0);
    } finally {
      setLoadingContributions(false);
    }
  };

  const loadExpenses = async () => {
    setLoadingExpenses(true);
    try {
      const res = await getExpenses();
      setExpenses(res.expenses || []);
      setTotalExpenses(res.totalAmount || 0);
    } finally {
      setLoadingExpenses(false);
    }
  };

  const loadPerformances = async () => {
    setLoadingPerformances(true);
    try {
      const res = await getPerformances();
      setPerformances(res.performances || []);
    } finally {
      setLoadingPerformances(false);
    }
  };

  const loadVolunteers = async () => {
    setLoadingVolunteers(true);
    try {
      const res = await getVolunteers();
      setVolunteers(res.volunteers || []);
    } finally {
      setLoadingVolunteers(false);
    }
  };

  useEffect(() => {
    loadContributions();
    loadExpenses();
    loadPerformances();
    loadVolunteers();
  }, []);

  // 3. Navigation handler for Hero & Tabs
  const handleSelectSection = (section: SectionType) => {
    setActiveSection(section);
    window.location.hash = section;
    const target = document.getElementById('main-content');
    if (target) {
      const navHeight = 65;
      const y = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-gray-900 flex flex-col selection:bg-puja-gold/30 selection:text-puja-red-900 overflow-x-hidden w-full max-w-full">
      {/* 1. Hero Section */}
      <HeroSection onSelectSection={handleSelectSection} />

      {/* 2. Sticky Tab Navigation Bar */}
      <div
        ref={sectionContentRef}
        className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs py-2 px-2.5 sm:px-6 w-full max-w-full"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          {/* Desktop Mini Branding */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-xl">🪔</span>
            <div>
              <span className="text-sm font-bold font-serif text-puja-red block leading-none">
                Bangur Durgotsav
              </span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">
                Puja 2026
              </span>
            </div>
          </div>

          {/* Centered Segmented Control */}
          <nav className="w-full md:w-auto bg-amber-100/70 p-1 rounded-2xl border border-amber-200/90 flex items-center justify-center gap-1 shadow-inner max-w-xl mx-auto md:mx-0">
            {/* Tab 1: Contribute */}
            <button
              onClick={() => handleSelectSection('contribute')}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'contribute'
                  ? 'bg-puja-red text-white shadow-sm'
                  : 'text-stone-700 hover:text-puja-red hover:bg-amber-200/40'
              }`}
            >
              <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Contribute</span>
              {contributions.length > 0 && (
                <span
                  className={`ml-1 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                    activeSection === 'contribute'
                      ? 'bg-amber-400 text-puja-dark-deep font-bold'
                      : 'bg-amber-200/80 text-gray-800'
                  }`}
                >
                  {contributions.length}
                </span>
              )}
            </button>

            {/* Tab 2: Expenses */}
            <button
              onClick={() => handleSelectSection('expenses')}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'expenses'
                  ? 'bg-puja-red text-white shadow-sm'
                  : 'text-stone-700 hover:text-puja-red hover:bg-amber-200/40'
              }`}
            >
              <ReceiptText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Expenses</span>
            </button>

            {/* Tab 3: Performances */}
            <button
              onClick={() => handleSelectSection('performances')}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'performances'
                  ? 'bg-puja-red text-white shadow-sm'
                  : 'text-stone-700 hover:text-puja-red hover:bg-amber-200/40'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate hidden sm:inline">Performances</span>
              <span className="truncate sm:hidden">Events</span>
              {performances.length > 0 && (
                <span
                  className={`ml-1 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                    activeSection === 'performances'
                      ? 'bg-amber-400 text-puja-dark-deep font-bold'
                      : 'bg-amber-200/80 text-gray-800'
                  }`}
                >
                  {performances.length}
                </span>
              )}
            </button>

            {/* Tab 4: Volunteer */}
            <button
              onClick={() => handleSelectSection('volunteer')}
              className={`flex-1 min-w-0 flex items-center justify-center space-x-1 px-1.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-[11px] sm:text-xs md:text-sm font-semibold transition-all cursor-pointer ${
                activeSection === 'volunteer'
                  ? 'bg-blue-800 text-white shadow-sm'
                  : 'text-stone-700 hover:text-blue-800 hover:bg-amber-200/40'
              }`}
            >
              <HandHeart className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="truncate">Volunteer</span>
              {volunteers.length > 0 && (
                <span
                  className={`ml-1 text-[9px] sm:text-[10px] px-1 sm:px-1.5 py-0.2 rounded-full font-mono shrink-0 ${
                    activeSection === 'volunteer'
                      ? 'bg-amber-400 text-puja-dark-deep font-bold'
                      : 'bg-amber-200/80 text-gray-800'
                  }`}
                >
                  {volunteers.length}
                </span>
              )}
            </button>
          </nav>
        </div>
      </div>

      {/* 3. Main Section Content Area */}
      <main id="main-content" className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Section 1: Contribute Flow */}
        {activeSection === 'contribute' && (
          <div className="space-y-6 animate-fade-in">
            {/* Form + Contributor List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-6">
                <ContributeForm
                  contributorCount={contributions.length}
                  onSuccess={() => {
                    loadContributions();
                    setCelebrationModal({
                      show: true,
                      title: 'Thank You for Your Support! 🙏',
                      message: 'Your contribution has been recorded in the committee records.',
                      subMessage: 'Your name is now visible in the community contributors list below.',
                    });
                  }}
                />
              </div>

              <div className="lg:col-span-6">
                <ContributorList
                  contributions={contributions}
                  totalAmount={totalContributionsAmount}
                  isLoading={loadingContributions}
                  onRefresh={loadContributions}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Expenses Tab */}
        {activeSection === 'expenses' && (
          <div className="animate-fade-in">
            <ExpensesTab
              expenses={expenses}
              totalAmount={totalExpenses}
              isLoading={loadingExpenses}
              onRefresh={loadExpenses}
            />
          </div>
        )}

        {/* Section 3: Performance Registration Flow */}
        {activeSection === 'performances' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-6">
                <PerformanceForm
                  participantCount={performances.length}
                  onSuccess={() => {
                    loadPerformances();
                    setCelebrationModal({
                      show: true,
                      title: 'Registration Received! 🎭',
                      message: 'Your act has been registered for the cultural evening.',
                      subMessage: 'The committee will reach out to confirm your rehearsal and schedule timings.',
                    });
                  }}
                />
              </div>

              <div className="lg:col-span-6">
                <ParticipantList
                  performances={performances}
                  isLoading={loadingPerformances}
                  onRefresh={loadPerformances}
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Volunteer & Participation Flow */}
        {activeSection === 'volunteer' && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-start">
              <div className="lg:col-span-6">
                <VolunteerForm
                  volunteerCount={volunteers.length}
                  onSuccess={() => {
                    loadVolunteers();
                    setCelebrationModal({
                      show: true,
                      title: 'Welcome to the Squad! 🤝',
                      message: 'Thank you for stepping forward to make Durga Puja 2026 grand and joyous.',
                      subMessage: 'Your participation is now recorded in the community squad roster below.',
                    });
                  }}
                />
              </div>

              <div className="lg:col-span-6">
                <VolunteerList
                  volunteers={volunteers}
                  isLoading={loadingVolunteers}
                  onRefresh={loadVolunteers}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* 4. Celebratory Success Modal */}
      {celebrationModal.show && (
        <SuccessAnimation
          title={celebrationModal.title}
          message={celebrationModal.message}
          subMessage={celebrationModal.subMessage}
          onClose={() => setCelebrationModal({ ...celebrationModal, show: false })}
          onViewList={() => {
            setTimeout(() => {
              const targetId =
                activeSection === 'performances'
                  ? 'participant-list'
                  : activeSection === 'volunteer'
                  ? 'volunteer-list'
                  : 'contributor-list';
              const el = document.getElementById(targetId);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }, 100);
          }}
        />
      )}

      {/* 5. Festive Footer */}
      <footer className="mt-16 bg-[#170E0E] text-amber-100/80 border-t border-puja-gold/20 py-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-white/10 text-center md:text-left">
            <div>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
                <span className="text-2xl">🪔</span>
                <span className="text-lg font-serif font-bold text-white tracking-wide">
                  Bangur Complex Durga Puja 2026
                </span>
              </div>
              <p className="text-xs text-amber-200/70 max-w-sm">
                Organized with love and devotion by the residents and puja committee of Bangur Complex.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-xs text-amber-200/80">
              <div className="flex items-center space-x-1.5">
                <MapPin className="w-4 h-4 text-puja-gold" />
                <span>Bangur Complex, Kolkata</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CalendarDays className="w-4 h-4 text-puja-gold" />
                <span>Durga Puja Autumn 2026</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-500 gap-3 text-center">
            <p>
              © 2026 Bangur Complex Puja Committee. All rights reserved.
            </p>
            <p className="flex items-center justify-center space-x-1">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Transparent community ledger powered by Google Sheets</span>
            </p>
          </div>
        </div>
      </footer>

      {/* Vercel Web Analytics */}
      <Analytics />
    </div>
  );
};

export default App;
