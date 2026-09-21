import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/Button';

interface SuccessAnimationProps {
  title: string;
  message: string;
  subMessage?: string;
  onClose: () => void;
}

export const SuccessAnimation: React.FC<SuccessAnimationProps> = ({
  title,
  message,
  subMessage,
  onClose,
}) => {
  useEffect(() => {
    // Fire festive Durga Puja colored confetti
    const colors = ['#8B0000', '#D4AF37', '#FFD700', '#FFFFFF', '#166534'];

    // Burst 1
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors,
    });

    // Burst 2 after 200ms
    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#FFFDF7] border-2 border-puja-gold/60 rounded-2xl shadow-2xl p-6 sm:p-8 text-center overflow-hidden">
        {/* Decorative corner borders */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-puja-red rounded-tl-xl m-2 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-puja-red rounded-tr-xl m-2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-puja-red rounded-bl-xl m-2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-puja-red rounded-br-xl m-2 pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-amber-100 transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Glow */}
        <div className="relative mx-auto mb-4 w-16 h-16 flex items-center justify-center rounded-full bg-gradient-to-tr from-amber-100 to-amber-200 border-2 border-puja-gold shadow-md">
          <CheckCircle2 className="w-10 h-10 text-puja-red" />
        </div>

        {/* Content */}
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-puja-red-900 mb-2">
          {title}
        </h3>
        <p className="text-base text-gray-800 font-medium mb-2">
          {message}
        </p>
        {subMessage && (
          <p className="text-xs sm:text-sm text-gray-600 mb-6 bg-amber-50 py-2 px-3 rounded-lg border border-amber-200">
            {subMessage}
          </p>
        )}

        <div className="mt-6 flex justify-center">
          <Button variant="gold" size="md" onClick={onClose} className="w-full sm:w-auto px-8">
            View List
          </Button>
        </div>
      </div>
    </div>
  );
};
