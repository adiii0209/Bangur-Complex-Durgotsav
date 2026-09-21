import { ContributionFormData, PerformanceFormData } from './types';

export interface ValidationErrors {
  [key: string]: string;
}

export function validateContribution(data: ContributionFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Please enter your name.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (trimmedName.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  if (data.amount === '' || data.amount === undefined || isNaN(Number(data.amount))) {
    errors.amount = 'Please enter a contribution amount.';
  } else if (Number(data.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  } else if (Number(data.amount) > 10000000) {
    errors.amount = 'Amount cannot exceed ₹1,00,00,000.';
  }

  const validModes = ['Cash', 'UPI', 'Bank Transfer'];
  if (!data.mode || !validModes.includes(data.mode)) {
    errors.mode = 'Please select a valid payment mode.';
  }

  return errors;
}

export function validatePerformance(data: PerformanceFormData): ValidationErrors {
  const errors: ValidationErrors = {};

  const trimmedName = data.name.trim();
  if (!trimmedName) {
    errors.name = 'Please enter the participant or group name.';
  } else if (trimmedName.length < 2) {
    errors.name = 'Name must be at least 2 characters long.';
  } else if (trimmedName.length > 100) {
    errors.name = 'Name cannot exceed 100 characters.';
  }

  const trimmedAct = data.actName.trim();
  if (!trimmedAct) {
    errors.actName = 'Please describe your performance or act name.';
  } else if (trimmedAct.length < 2) {
    errors.actName = 'Act name must be at least 2 characters long.';
  } else if (trimmedAct.length > 150) {
    errors.actName = 'Act name cannot exceed 150 characters.';
  }

  if (!data.category || data.category.trim() === '') {
    errors.category = 'Please select an act category.';
  }

  if (data.contact && data.contact.trim().length > 0) {
    const contactClean = data.contact.replace(/[\s-()]/g, '');
    if (!/^\+?[0-9]{10,14}$/.test(contactClean)) {
      errors.contact = 'Please enter a valid phone number (10-14 digits).';
    }
  }

  return errors;
}
