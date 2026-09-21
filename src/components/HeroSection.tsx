import React from 'react';
import { HeartHandshake, ReceiptText, Sparkles, ChevronDown, HandHeart } from 'lucide-react';

interface HeroSectionProps {
  onSelectSection: (section: 'contribute' | 'expenses' | 'performances' | 'volunteer') => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onSelectSection }) => {
  return (
    <section className="relative w-full min-h-[90vh] sm:min-h-screen flex items-center justify-center overflow-hidden bg-puja-dark">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster="/hero-poster.jpg"
        className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-75 sm:opacity-80 scale-105"
      >
        <source src="/hero-durga-puja.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Festive Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/85 via-black/60 to-black/90 z-10" />

      {/* Subtle Festive Vignette & Gold Tint */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-puja-red-950/20 to-black/90 z-10 pointer-events-none" />

      {/* Hero Content */}
      <div className="relative z-20 max-w-4xl mx-auto px-4 sm:px-6 py-14 text-center flex flex-col items-center justify-center">
        {/* Top Community Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-medium mb-4 backdrop-blur-md animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping mr-1"></span>
          <span>Bangur Complex Puja Committee 2026</span>
        </div>

        {/* English Main Heading */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold font-serif text-white tracking-wide leading-tight mb-2 drop-shadow-md">
          Bangur Complex Durga Puja
        </h1>

        {/* Festive Year / Tagline */}
        <p className="text-lg sm:text-2xl md:text-3xl font-serif text-puja-gold font-semibold tracking-wider mb-4 drop-shadow">
          Autumn 2026
        </p>

        {/* Community Welcome Message */}
        <p className="text-xs sm:text-base md:text-lg text-amber-100/90 max-w-xl mx-auto leading-relaxed mb-8 font-normal">
          A shared festival of joy, devotion, and community pride. Record your contribution, review committee expenses transparently, or join our cultural evening!
        </p>

        {/* Smaller 3 CTA Buttons: 2 on either side and 1 in the middle */}
        <div className="w-full max-w-lg mx-auto flex flex-row items-center justify-center gap-1.5 sm:gap-3.5 px-1 sm:px-0">
          {/* Left Button: Contribute */}
          <button
            onClick={() => onSelectSection('contribute')}
            className="flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-gradient-to-r from-amber-500 via-puja-gold to-yellow-500 text-puja-dark-deep font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-amber-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer border border-amber-300"
          >
            <HeartHandshake className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-puja-dark-deep shrink-0" />
            <span className="truncate">Contribute</span>
          </button>

          {/* Middle Button: Expenses */}
          <button
            onClick={() => onSelectSection('expenses')}
            className="flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-black/45 hover:bg-black/65 text-amber-100 hover:text-white font-medium text-xs sm:text-sm border border-amber-300/40 hover:border-amber-300/80 backdrop-blur-md hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer shadow-md"
          >
            <ReceiptText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="truncate">Expenses</span>
          </button>

          {/* Right Button: Register for Performance */}
          <button
            onClick={() => onSelectSection('performances')}
            className="flex-1 min-w-0 flex items-center justify-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-2 sm:py-3 rounded-xl bg-puja-red hover:bg-puja-red-800 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-puja-red/25 border border-red-400/40 hover:scale-[1.03] active:scale-[0.98] transition-all duration-200 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 shrink-0" />
            <span className="truncate">
              Register<span className="hidden sm:inline"> Act</span>
            </span>
          </button>
        </div>

        {/* 4th Big Length Button for Volunteering & Community Participation */}
        <div className="w-full max-w-lg mx-auto mt-2.5 sm:mt-3 px-1 sm:px-0">
          <button
            onClick={() => onSelectSection('volunteer')}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 hover:from-blue-800 hover:to-indigo-900 text-white font-semibold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-blue-900/30 border border-blue-400/40 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 cursor-pointer"
          >
            <HandHeart className="w-4 h-4 text-amber-300 shrink-0" />
            <span className="truncate">Join Volunteer Squad & Participate</span>
          </button>
        </div>

        {/* Scroll indicator */}
        <div
          onClick={() => onSelectSection('contribute')}
          className="mt-10 sm:mt-14 flex flex-col items-center text-amber-200/60 hover:text-amber-200 transition-colors cursor-pointer text-xs font-light"
        >
          <span className="mb-1 tracking-widest uppercase text-[10px]">Explore Sections</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
};
