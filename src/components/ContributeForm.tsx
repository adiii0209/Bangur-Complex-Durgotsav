import React, { useState } from 'react';
import { HeartHandshake, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { ContributionFormData, ContributionMode } from '../lib/types';
import { validateContribution, ValidationErrors } from '../lib/validation';
import { addContribution } from '../lib/api';

interface ContributeFormProps {
  onSuccess: () => void;
}

export const ContributeForm: React.FC<ContributeFormProps> = ({ onSuccess }) => {
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
    } catch (err) {
      setServerError('A network error occurred. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 rounded-xl bg-amber-100 text-puja-red">
          <HeartHandshake className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-puja-red-900">
            Record Your Contribution
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Let the puja committee know about your support for Durga Puja 2026.
          </p>
        </div>
      </div>

      {/* Gentle notice that this is a pledge/record, not payment gateway */}
      <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900 leading-relaxed">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          <strong>Note:</strong> This records your contribution pledge with the committee. No money moves through this website — please hand over cash or complete your UPI/Bank transfer with the committee.
        </span>
      </div>

      {serverError && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
        {/* Honeypot field for spam prevention */}
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
          label="Your Name or Family Name"
          placeholder="e.g. Debashis & Sharmila Mukherjee / Flat 3B"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          required
        />

        {/* Amount & Mode in grid on sm: */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Contribution Amount (₹)"
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
            helperText="Amounts are kept private on the public list"
            required
          />

          <Select
            label="Mode of Contribution"
            options={modeOptions}
            value={formData.mode}
            onChange={(e) => {
              setFormData({ ...formData, mode: e.target.value as ContributionMode });
              if (errors.mode) setErrors({ ...errors, mode: '' });
            }}
            error={errors.mode}
            required
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="gold"
            size="lg"
            isLoading={isSubmitting}
            className="w-full text-base font-semibold shadow-md py-3"
          >
            Record Contribution
          </Button>
        </div>
      </form>
    </div>
  );
};
