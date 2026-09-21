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
 * Fetch Contributors list from Google Sheet
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
    console.error('getContributions error:', error);
    return {
      success: false,
      error: 'Unable to connect to Google Sheets. Please ensure Apps Script deployment access is set to "Anyone".',
      contributions: [],
      totalCount: 0,
      totalAmount: 0,
    };
  }
}

/**
 * Fetch Expenses mirror from Google Sheet
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
    console.error('getExpenses error:', error);
    return {
      success: false,
      error: 'Unable to load expenses from Google Sheets.',
      expenses: [],
      totalAmount: 0,
    };
  }
}

/**
 * Fetch Performances list from Google Sheet
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
    console.error('getPerformances error:', error);
    return {
      success: false,
      error: 'Unable to load registered performances from Google Sheets.',
      performances: [],
      totalCount: 0,
    };
  }
}

/**
 * Submit Contribution with dual-mode fallback (standard + no-cors)
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
      error: 'Google Apps Script URL is not configured.',
    };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    try {
      const result = await response.json();
      return result;
    } catch {
      // In case Apps Script redirects and body isn't readable
      return {
        success: true,
        message: 'Contribution recorded successfully.',
      };
    }
  } catch (error) {
    console.warn('Standard POST hit CORS or network block, sending with no-cors fallback:', error);
    try {
      // no-cors sends the POST request without preflight and writes to Google Sheet
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        message: 'Contribution recorded successfully.',
      };
    } catch (fallbackError) {
      console.error('All submission attempts failed:', fallbackError);
      return {
        success: false,
        error: 'Unable to record contribution. Please verify Google Apps Script deployment permissions are set to "Anyone".',
      };
    }
  }
}

/**
 * Submit Performance Registration with dual-mode fallback (standard + no-cors)
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
      error: 'Google Apps Script URL is not configured.',
    };
  }

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    try {
      const result = await response.json();
      return result;
    } catch {
      return {
        success: true,
        message: 'Performance registration recorded successfully.',
      };
    }
  } catch (error) {
    console.warn('Standard POST hit CORS, falling back to no-cors:', error);
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });

      return {
        success: true,
        message: 'Performance registration recorded successfully.',
      };
    } catch (fallbackError) {
      console.error('All submission attempts failed:', fallbackError);
      return {
        success: false,
        error: 'Unable to submit registration. Please verify Google Apps Script deployment permissions are set to "Anyone".',
      };
    }
  }
}
