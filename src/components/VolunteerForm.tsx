import React, { useState } from 'react';
import { HandHeart, AlertCircle, Users } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { VolunteerFormData } from '../lib/types';
import { addVolunteer } from '../lib/api';

interface VolunteerFormProps {
  onSuccess: () => void;
  volunteerCount?: number;
}

export const VolunteerForm: React.FC<VolunteerFormProps> = ({ onSuccess, volunteerCount = 0 }) => {
  const [formData, setFormData] = useState<VolunteerFormData>({
    name: '',
    role: 'Bhog Distribution',
    availability: 'All 5 Days (Sasthi to Dashami)',
    contact: '',
    notes: '',
    honeypot: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const roleOptions = [
    { value: 'Bhog Distribution', label: 'Bhog Distribution & Dining Support' },
    { value: 'Pandal & Crowd Coordination', label: 'Pandal & Crowd Coordination' },
    { value: 'Cultural & Stage Support', label: 'Cultural & Stage Support' },
    { value: 'Anandamela Food Stall', label: 'Anandamela Stall / Food Fiesta' },
    { value: 'Decorations & Lighting', label: 'Decorations, Flowers & Lighting' },
    { value: 'General Help & Support', label: 'General Volunteering & Assistance' },
  ];

  const availabilityOptions = [
    { value: 'All 5 Days (Sasthi to Dashami)', label: 'All 5 Days (Sasthi to Dashami)' },
    { value: 'Saptami & Ashtami', label: 'Saptami & Ashtami' },
    { value: 'Nabami & Dashami', label: 'Nabami & Dashami' },
    { value: 'Evening Shifts Only', label: 'Evening Hours Only (6 PM - 11 PM)' },
    { value: 'Flexible / As Needed', label: 'Flexible / Call me whenever needed' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name or family details';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await addVolunteer(formData);
      if (response.success) {
        setFormData({
          name: '',
          role: 'Bhog Distribution',
          availability: 'All 5 Days (Sasthi to Dashami)',
          contact: '',
          notes: '',
          honeypot: '',
        });
        onSuccess();
      } else {
        setServerError(response.error || 'Failed to record volunteer signup. Please try again.');
      }
    } catch {
      setServerError('A network error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const scrollToVolunteers = () => {
    const el = document.getElementById('volunteer-list');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-amber-200/80 shadow-md p-4 sm:p-6 text-left">
      {/* Compact Header with Mobile Quick Jump */}
      <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-amber-100">
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-800 shrink-0">
            <HandHeart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold font-serif text-puja-red-900 leading-tight">
              Join Volunteer Squad
            </h2>
            <p className="text-[11px] sm:text-xs text-gray-500">
              Step forward and participate in Bangur Puja 2026
            </p>
          </div>
        </div>

        {/* Quick jump to list on mobile */}
        <button
          type="button"
          onClick={scrollToVolunteers}
          className="lg:hidden inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-[11px] font-medium text-blue-900 border border-blue-200 transition-colors cursor-pointer"
        >
          <Users className="w-3.5 h-3.5 text-blue-700" />
          <span>Squad ({volunteerCount}) ↓</span>
        </button>
      </div>

      {serverError && (
        <div className="mb-4 p-2.5 rounded-xl bg-red-50 border border-red-200 flex items-center space-x-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{serverError}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Honeypot */}
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

        {/* Name / Flat input */}
        <Input
          label="Your Name / Resident Details"
          placeholder="e.g. Subir Ganguly (Tower 2, Flat 6A)"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          error={errors.name}
          className="py-2 text-xs sm:text-sm"
          required
        />

        {/* Role & Availability */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Select
            label="Activity / Role"
            options={roleOptions}
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="py-2 text-xs sm:text-sm"
            required
          />

          <Select
            label="Your Availability"
            options={availabilityOptions}
            value={formData.availability}
            onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
            className="py-2 text-xs sm:text-sm"
            required
          />
        </div>

        {/* Contact / WhatsApp (Optional, Private) */}
        <Input
          label="Phone / WhatsApp Number (Private)"
          type="tel"
          placeholder="e.g. 98300XXXXX"
          value={formData.contact}
          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
          helperText="Strictly private — only used by the committee to coordinate shifts"
          className="py-2 text-xs sm:text-sm"
        />

        {/* Optional Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-800 mb-1">
            Notes / Suggestions <span className="text-gray-400 font-normal text-xs">(Optional)</span>
          </label>
          <textarea
            rows={2}
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="e.g. Available after 5 PM, or interested in coordinating bhog coupons"
            className="w-full px-3.5 py-2 rounded-xl border border-amber-200 hover:border-amber-300 focus:outline-none focus:ring-2 focus:ring-puja-gold/60 focus:border-puja-gold text-xs sm:text-sm text-gray-900 bg-white placeholder-gray-400"
          />
        </div>

        <div className="pt-1">
          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isSubmitting}
            className="w-full text-sm font-semibold shadow-md py-2.5 bg-gradient-to-r from-blue-700 to-indigo-800 hover:from-blue-800 hover:to-indigo-900 text-white"
          >
            Step Forward to Participate
          </Button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            Every hand makes our community Durga Puja more vibrant and joyous!
          </p>
        </div>
      </form>
    </div>
  );
};