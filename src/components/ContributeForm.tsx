import React, { useState } from 'react';
import { HeartHandshake, AlertCircle, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ContributionFormData, ContributionMode } from '../lib/types';
import { validateContribution, ValidationErrors } from '../lib/validation';
import { addContribution } from '../lib/api';

interface ContributeFormProps {
  onSuccess: () => void;
  contributorCount?: number;
}

export const ContributeForm: React.FC<ContributeFormProps> = ({ onSuccess, contributorCount = 0 }) => {
  const [formData, setFormData] = useState<ContributionFormData>({
    name: '',
    amount: '',
    mode: 'UPI',
    honeypot: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const modeOptions = [
    { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
    { value: 'Cash', label: 'Cash (Handed to committee)' },
    { value: 'Bank Transfer', label: 'Bank Transfer (NEFT / IMPS)' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validateContribution(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await addContribution(formData);
      if (response.success) {
        setFormData({
          name: '',
          amount: '',
          mode: 'UPI',
          honeypot: '',
        });
        onSuccess();
      } else {
        setServerError(response.error || 'Failed to submit. Please try again.');
      }
    } catch {
      setServerError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToContributors = () => {
    const el = document.getElementById('contributor-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-4 sm:p-6 text-left">
      {/* Compact Header with Mobile Quick Jump */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-amber-100 text-puja-red shrink-0">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-puja-red-900 leading-tight">
              Record Contribution
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Durga Puja 2026 Committee Drive
            </p>
          </div>
        </div>

        {/* Quick jump to list on mobile */}
        <button
          type="button"
          onClick={scrollToContributors}
          className="lg:hidden inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[11px] font-medium text-puja-red-800 border border-amber-200 transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-puja-red" />
          <span>List ({contributorCount}) ↓</span>
        </button>
      </div>

      {serverError && (
        <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Honeypot field for bot protection */}
        <input
          type="text"
          name="website"
          value={formData.honeypot}
          onChange={(e) => setFormData({ ...formData, honeypot: e.target.value })}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          style={{ position: 'absolute', left: '-9999px', opacity: 0 }}
        />

        {/* Name input */}
        <Input
          label="Name / Family"
          placeholder="e.g. Debashis Mukherjee (Flat 3B)"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          className="py-2 text-xs sm:text-sm"
          required
        />

        {/* Amount & Mode */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Amount (₹)"
            type="number"
            min="1"
            step="1"
            placeholder="e.g. 2500"
            value={formData.amount}
            onChange={(e) => {
              const val = e.target.value === '' ? '' : Number(e.target.value);
              setFormData({ ...formData, amount: val });
              if (errors.amount) setErrors({ ...errors, amount: '' });
            }}
            error={errors.amount}
            helperText="Amounts are masked on the public list"
            className="py-2 text-xs sm:text-sm"
            required
          />

          <Select
            label="Payment Mode"
            options={modeOptions}
            value={formData.mode}
            onChange={(e) => {
              setFormData({ ...formData, mode: e.target.value as ContributionMode });
              if (errors.mode) setErrors({ ...errors, mode: '' });
            }}
            error={errors.mode}
            className="py-2 text-xs sm:text-sm"
            required
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            variant="gold"
            size="md"
            isLoading={isSubmitting}
            className="w-full text-sm font-semibold shadow-md py-2.5"
          >
            Record Contribution
          </Button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Pledge record only • Committee collects funds directly via cash/UPI
          </p>
        </div>
      </form>
    </div>
  );
};
