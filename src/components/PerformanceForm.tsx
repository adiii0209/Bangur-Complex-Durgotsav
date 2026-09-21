import React, { useState } from 'react';
import { Sparkles, AlertCircle, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { PerformanceFormData } from '../lib/types';
import { validatePerformance, ValidationErrors } from '../lib/validation';
import { addPerformance } from '../lib/api';

interface PerformanceFormProps {
  onSuccess: () => void;
  participantCount?: number;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({ onSuccess, participantCount = 0 }) => {
  const [formData, setFormData] = useState<PerformanceFormData>({
    name: '',
    actName: '',
    category: 'Dance',
    contact: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const categoryOptions = [
    { value: 'Dance', label: 'Dance (Solo / Group)' },
    { value: 'Song', label: 'Music & Singing (Vocal)' },
    { value: 'Drama', label: 'Drama & Skit (Natok)' },
    { value: 'Instrumental', label: 'Instrumental (Tabla / Keyboard / Guitar)' },
    { value: 'Recitation', label: 'Recitation & Shloka (Abritti)' },
    { value: 'Other', label: 'Other Special Talent' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const validationErrors = validatePerformance(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await addPerformance(formData);
      if (response.success) {
        setFormData({
          name: '',
          actName: '',
          category: 'Dance',
          contact: '',
          honeypot: '',
        });
        onSuccess();
      } else {
        setServerError(response.error || 'Failed to submit registration. Please try again.');
      }
    } catch {
      setServerError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToParticipants = () => {
    const el = document.getElementById('participant-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-4 sm:p-6 text-left">
      {/* Compact Header with Mobile Quick Jump */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-red-100 text-puja-red shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-puja-red-900 leading-tight">
              Register Performance
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Cultural Evenings & Anandamela
            </p>
          </div>
        </div>

        {/* Quick jump to list on mobile */}
        <button
          type="button"
          onClick={scrollToParticipants}
          className="lg:hidden inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-[11px] font-medium text-puja-red-800 border border-amber-200 transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-puja-red" />
          <span>Artists ({participantCount}) ↓</span>
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

        {/* Participant Name */}
        <Input
          label="Performer / Group Name"
          placeholder="e.g. Ritu Roy & Kids Troupe"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          className="py-2 text-xs sm:text-sm"
          required
        />

        {/* Act Description */}
        <Input
          label="Performance / Act Description"
          placeholder="e.g. Rabindra Sangeet & Dance Medley"
          value={formData.actName}
          onChange={(e) => {
            setFormData({ ...formData, actName: e.target.value });
            if (errors.actName) setErrors({ ...errors, actName: '' });
          }}
          error={errors.actName}
          className="py-2 text-xs sm:text-sm"
          required
        />

        {/* Category & Contact */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              if (errors.category) setErrors({ ...errors, category: '' });
            }}
            error={errors.category}
            className="py-2 text-xs sm:text-sm"
            required
          />

          <Input
            label="Phone (Optional)"
            type="tel"
            placeholder="e.g. 9830012345"
            value={formData.contact}
            onChange={(e) => {
              setFormData({ ...formData, contact: e.target.value });
              if (errors.contact) setErrors({ ...errors, contact: '' });
            }}
            error={errors.contact}
            helperText="Kept strictly confidential"
            className="py-2 text-xs sm:text-sm"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full text-sm font-semibold shadow-md py-2.5"
          >
            Submit Registration
          </Button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            The committee will coordinate rehearsal & slot timings with participants
          </p>
        </div>
      </form>
    </div>
  );
};
