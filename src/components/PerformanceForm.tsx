import React, { useState } from 'react';
import { Sparkles, AlertCircle, Info } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { PerformanceFormData } from '../lib/types';
import { validatePerformance, ValidationErrors } from '../lib/validation';
import { addPerformance } from '../lib/api';

interface PerformanceFormProps {
  onSuccess: () => void;
}

export const PerformanceForm: React.FC<PerformanceFormProps> = ({ onSuccess }) => {
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
    } catch (err) {
      setServerError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-6 sm:p-8">
      <div className="flex items-center space-x-3 mb-4">
        <div className="p-2.5 rounded-xl bg-red-100 text-puja-red">
          <Sparkles className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-bold font-serif text-puja-red-900">
            Register for Cultural Evening
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Showcase your talent on the Bangur Complex Durga Puja stage!
          </p>
        </div>
      </div>

      <div className="mb-6 p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2.5 text-xs text-amber-900 leading-relaxed">
        <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <span>
          Residents of all ages are warmly invited to perform. The committee will coordinate slot timings with you before Saptami.
        </span>
      </div>

      {serverError && (
        <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs sm:text-sm text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-left">
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
          required
        />

        {/* Act Description */}
        <Input
          label="Performance / Act Description"
          placeholder="e.g. Rabindra Sangeet & Semi-Classical Dance Medley"
          value={formData.actName}
          onChange={(e) => {
            setFormData({ ...formData, actName: e.target.value });
            if (errors.actName) setErrors({ ...errors, actName: '' });
          }}
          error={errors.actName}
          required
        />

        {/* Category & Contact grid on sm: */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Performance Category"
            options={categoryOptions}
            value={formData.category}
            onChange={(e) => {
              setFormData({ ...formData, category: e.target.value });
              if (errors.category) setErrors({ ...errors, category: '' });
            }}
            error={errors.category}
            required
          />

          <Input
            label="Contact Number (Optional)"
            type="tel"
            placeholder="e.g. 9830012345"
            value={formData.contact}
            onChange={(e) => {
              setFormData({ ...formData, contact: e.target.value });
              if (errors.contact) setErrors({ ...errors, contact: '' });
            }}
            error={errors.contact}
            helperText="Kept confidential — never shown on the public site"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isSubmitting}
            className="w-full text-base font-semibold shadow-md py-3"
          >
            Submit Registration
          </Button>
        </div>
      </form>
    </div>
  );
};
