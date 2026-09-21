import {
  ContributionFormData,
  ContributionsResponse,
  Expense,
  ExpensesResponse,
  PerformanceFormData,
  PerformancesResponse,
  ApiResponse,
} from './types';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export const isLiveMode = (): boolean => {
  return Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim().length > 10);
};

/**
 * Fetch Contributors list from real Google Sheet
 */
export async function getContributions(): Promise<ContributionsResponse> {
  if (!isLiveMode()) {
    return {
      success: true,
      contributions: [],
      totalCount: 0,
      totalAmount: 0,
    };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=getContributions&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return {
      success: true,
      contributions: data.contributions || [],
      totalCount: data.totalCount || (data.contributions || []).length,
      totalAmount: data.totalAmount || 0,
    };
  } catch (error) {
    console.error('getContributions failed:', error);
    return {
      success: false,
      error: 'Unable to connect to Google Sheets server. Please check deployment access.',
      contributions: [],
      totalCount: 0,
      totalAmount: 0,
    };
  }
}

/**
 * Fetch Expenses mirror from real Google Sheet
 */
export async function getExpenses(): Promise<ExpensesResponse> {
  if (!isLiveMode()) {
    return {
      success: true,
      expenses: [],
      totalAmount: 0,
    };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=getExpenses&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return {
      success: true,
      expenses: data.expenses || [],
      totalAmount:
        data.totalAmount !== undefined
          ? data.totalAmount
          : (data.expenses || []).reduce((acc: number, cur: Expense) => acc + (cur.amount || 0), 0),
    };
  } catch (error) {
    console.error('getExpenses failed:', error);
    return {
      success: false,
      error: 'Unable to load expenses from Google Sheets.',
      expenses: [],
      totalAmount: 0,
    };
  }
}

/**
 * Fetch Performances list from real Google Sheet
 */
export async function getPerformances(): Promise<PerformancesResponse> {
  if (!isLiveMode()) {
    return {
      success: true,
      performances: [],
      totalCount: 0,
    };
  }

  try {
    const url = `${APPS_SCRIPT_URL}?action=getPerformances&_t=${Date.now()}`;
    const res = await fetch(url, { method: 'GET' });
    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`);
    }
    const data = await res.json();
    return {
      success: true,
      performances: data.performances || [],
      totalCount: data.totalCount || (data.performances || []).length,
    };
  } catch (error) {
    console.error('getPerformances failed:', error);
    return {
      success: false,
      error: 'Unable to load registered performances from Google Sheets.',
      performances: [],
      totalCount: 0,
    };
  }
}

/**
 * Submit Contribution to real Google Sheet
 */
export async function addContribution(formData: ContributionFormData): Promise<ApiResponse> {
  const payload = {
    action: 'addContribution',
    name: formData.name.trim(),
    amount: Number(formData.amount),
    mode: formData.mode,
    honeypot: formData.honeypot || '',
  };

  if (!isLiveMode()) {
    return {
      success: false,
      error: 'Google Apps Script URL is not configured. Please set VITE_APPS_SCRIPT_URL in .env.',
    };
  }

  try {
    // Send as plain text with redirect: follow to avoid CORS preflight rejection on Google Apps Script
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting contribution:', error);
    return {
      success: false,
      error: 'Network request failed. Please check your internet connection or Google Sheet permissions.',
    };
  }
}

/**
 * Submit Performance Registration to real Google Sheet
 */
export async function addPerformance(formData: PerformanceFormData): Promise<ApiResponse> {
  const payload = {
    action: 'addPerformanceRegistration',
    name: formData.name.trim(),
    actName: formData.actName.trim(),
    category: formData.category,
    contact: formData.contact ? formData.contact.trim() : '',
    honeypot: formData.honeypot || '',
  };

  if (!isLiveMode()) {
    return {
      success: false,
      error: 'Google Apps Script URL is not configured. Please set VITE_APPS_SCRIPT_URL in .env.',
    };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error submitting performance registration:', error);
    return {
      success: false,
      error: 'Network request failed. Please check your internet connection or Google Sheet permissions.',
    };
  }
}
