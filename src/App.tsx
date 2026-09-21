import React, { useState, useEffect, useRef } from 'react';
import { HeartHandshake, ReceiptText, Sparkles, Shield, MapPin, CalendarDays } from 'lucide-react';
import { HeroSection } from './components/HeroSection';
import { ContributeForm } from './components/ContributeForm';
import { ContributorList } from './components/ContributorList';
import { ExpensesTab } from './components/ExpensesTab';
import { PerformanceForm } from './components/PerformanceForm';
import { ParticipantList } from './components/ParticipantList';
import { SuccessAnimation } from './components/SuccessAnimation';
import {
  getContributions,
  getExpenses,
  getPerformances,
  isLiveMode,
} from './lib/api';
import { Contribution, Expense, Performance } from './lib/types';

type SectionType = 'contribute' | 'expenses' | 'performances';

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

  // Loading States
  const [loadingContributions, setLoadingContributions] = useState(false);
  const [loadingExpenses, setLoadingExpenses] = useState(false);
  const [loadingPerformances, setLoadingPerformances] = useState(false);

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

  useEffect(() => {
    loadContributions();
    loadExpenses();
    loadPerformances();
  }, []);

  // 3. Navigation handler for Hero & Tabs
  const handleSelectSection = (section: SectionType) => {
    setActiveSection(section);
    window.location.hash = section;
    sectionContentRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#FCFAF7] text-gray-900 flex flex-col selection:bg-puja-gold/30 selection:text-puja-red-900">
      {/* 1. Hero Section */}
      <HeroSection onSelectSection={handleSelectSection} />

      {/* 2. Sticky Tab Navigation Bar */}
      <div
        ref={sectionContentRef}
        className="sticky top-0 z-40 bg-[#FFFDF7]/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs"
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between py-2.5">
            {/* Bengali/English Mini Branding */}
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

            {/* Nav Tabs */}
            <div className="flex items-center justify-center w-full md:w-auto space-x-1.5 sm:space-x-3">
              {/* Tab 1: Contribute */}
              <button
                onClick={() => handleSelectSection('contribute')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'contribute'
                    ? 'bg-puja-red text-white shadow-md shadow-puja-red/20'
                    : 'text-gray-700 hover:bg-amber-100/60 hover:text-puja-red'
                }`}
              >
                <HeartHandshake className="w-4 h-4" />
                <span>Contribute</span>
                {contributions.length > 0 && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeSection === 'contribute'
                        ? 'bg-amber-400 text-puja-dark-deep font-bold'
                        : 'bg-amber-200 text-gray-800'
                    }`}
                  >
                    {contributions.length}
                  </span>
                )}
              </button>

              {/* Tab 2: Expenses */}
              <button
                onClick={() => handleSelectSection('expenses')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'expenses'
                    ? 'bg-puja-red text-white shadow-md shadow-puja-red/20'
                    : 'text-gray-700 hover:bg-amber-100/60 hover:text-puja-red'
                }`}
              >
                <ReceiptText className="w-4 h-4" />
                <span>Expenses</span>
              </button>

              {/* Tab 3: Performances */}
              <button
                onClick={() => handleSelectSection('performances')}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3.5 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  activeSection === 'performances'
                    ? 'bg-puja-red text-white shadow-md shadow-puja-red/20'
                    : 'text-gray-700 hover:bg-amber-100/60 hover:text-puja-red'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Performances</span>
                {performances.length > 0 && (
                  <span
                    className={`ml-1 text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                      activeSection === 'performances'
                        ? 'bg-amber-400 text-puja-dark-deep font-bold'
                        : 'bg-amber-200 text-gray-800'
                    }`}
                  >
                    {performances.length}
                  </span>
                )}
              </button>
            </div>

            {/* Connection mode status indicator */}
            <div className="hidden lg:flex items-center text-[11px] text-gray-500 font-mono">
              {isLiveMode() ? (
                <span className="flex items-center text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                  Sheet Live
                </span>
              ) : (
                <span className="flex items-center text-amber-700 bg-amber-50 px-2 py-1 rounded-md border border-amber-200" title="Deploy Apps Script & set VITE_APPS_SCRIPT_URL in .env to connect live sheet">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
                  Local Preview
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Main Section Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Section 1: Contribute Flow */}
        {activeSection === 'contribute' && (
          <div className="space-y-8 animate-fade-in">
            {/* Top Introductory Bar */}
            <div className="text-center max-w-2xl mx-auto mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-puja-red-900 mb-2">
                Durga Puja 2026 Contribution Drive
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Join hands with your neighbors in Bangur Complex to make this year's Durgotsav magnificent. Record your contribution below.
              </p>
            </div>

            {/* Form + Contributor List */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <ContributeForm
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
            <div className="text-center max-w-2xl mx-auto mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-puja-red-900 mb-2">
                Puja Expenditure Transparency
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Every rupee contributed by residents is accounted for with complete transparency. All numbers mirror the committee's live audit ledger.
              </p>
            </div>

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
          <div className="space-y-8 animate-fade-in">
            <div className="text-center max-w-2xl mx-auto mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold font-serif text-puja-red-900 mb-2">
                Cultural Evenings Stage Registration
              </h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Celebrate Anandamela and cultural nights with songs, dance, recitations, and drama. Register your act or group performance.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-6">
                <PerformanceForm
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
      </main>

      {/* 4. Celebratory Success Modal */}
      {celebrationModal.show && (
        <SuccessAnimation
          title={celebrationModal.title}
          message={celebrationModal.message}
          subMessage={celebrationModal.subMessage}
          onClose={() => setCelebrationModal({ ...celebrationModal, show: false })}
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
    </div>
  );
};

export default App;
