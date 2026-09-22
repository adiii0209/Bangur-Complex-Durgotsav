import {
  ContributionFormData,
  ContributionsResponse,
  Contribution,
  Expense,
  ExpensesResponse,
  PerformanceFormData,
  Performance,
  PerformancesResponse,
  VolunteerFormData,
  Volunteer,
  VolunteersResponse,
  ApiResponse,
} from './types';
import {
  getCacheItem,
  setCacheItem,
  enqueueItem,
  processQueue,
  QueueItem,
} from './cacheQueue';

const APPS_SCRIPT_URL = import.meta.env.VITE_APPS_SCRIPT_URL || '';

export const isLiveMode = (): boolean => {
  return Boolean(APPS_SCRIPT_URL && APPS_SCRIPT_URL.trim().length > 10);
};

// Cache keys
const KEY_CONTRIBUTIONS = 'contributions';
const KEY_EXPENSES = 'expenses';
const KEY_PERFORMANCES = 'performances';
const KEY_VOLUNTEERS = 'volunteers';

// -------------------------------------------------------------
// 1. Synchronous Cache Getters (0ms UI Initial Paint)
// -------------------------------------------------------------

export function getCachedContributions(): ContributionsResponse {
  const cached = getCacheItem<ContributionsResponse>(KEY_CONTRIBUTIONS);
  return (
    cached || {
      success: true,
      contributions: [],
      totalCount: 0,
      totalAmount: 0,
    }
  );
}

export function getCachedExpenses(): ExpensesResponse {
  const cached = getCacheItem<ExpensesResponse>(KEY_EXPENSES);
  return (
    cached || {
      success: true,
      expenses: [],
      totalAmount: 0,
    }
  );
}

export function getCachedPerformances(): PerformancesResponse {
  const cached = getCacheItem<PerformancesResponse>(KEY_PERFORMANCES);
  return (
    cached || {
      success: true,
      performances: [],
      totalCount: 0,
    }
  );
}

export function getCachedVolunteers(): VolunteersResponse {
  const cached = getCacheItem<VolunteersResponse>(KEY_VOLUNTEERS);
  return (
    cached || {
      success: true,
      volunteers: [],
      totalCount: 0,
    }
  );
}

// -------------------------------------------------------------
// 2. Fetchers with Stale-While-Revalidate
// -------------------------------------------------------------

/**
 * Fetch Contributors list with instant cache return and background revalidation
 */
export async function getContributions(
  onBackgroundUpdate?: (data: ContributionsResponse) => void
): Promise<ContributionsResponse> {
  const cached = getCachedContributions();

  if (!isLiveMode()) {
    return cached;
  }

  // Background fetch to sync with Google Sheet
  const revalidate = async () => {
    try {
      const url = `${APPS_SCRIPT_URL}?action=getContributions`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const result: ContributionsResponse = {
        success: true,
        contributions: data.contributions || [],
        totalCount: data.totalCount || (data.contributions || []).length,
        totalAmount: data.totalAmount || 0,
      };

      setCacheItem(KEY_CONTRIBUTIONS, result);
      if (onBackgroundUpdate) {
        onBackgroundUpdate(result);
      }
      return result;
    } catch (error) {
      console.warn('Background getContributions sync warning:', error);
      return cached;
    }
  };

  // If we already have cached items, return cached immediately and revalidate in background
  if (cached.contributions && cached.contributions.length > 0) {
    revalidate();
    return cached;
  }

  // First time load with empty cache: wait for network
  return await revalidate();
}

/**
 * Fetch Expenses with instant cache return and background revalidation
 */
export async function getExpenses(
  onBackgroundUpdate?: (data: ExpensesResponse) => void
): Promise<ExpensesResponse> {
  const cached = getCachedExpenses();

  if (!isLiveMode()) {
    return cached;
  }

  const revalidate = async () => {
    try {
      const url = `${APPS_SCRIPT_URL}?action=getExpenses`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const result: ExpensesResponse = {
        success: true,
        expenses: data.expenses || [],
        totalAmount:
          data.totalAmount !== undefined
            ? data.totalAmount
            : (data.expenses || []).reduce((acc: number, cur: Expense) => acc + (cur.amount || 0), 0),
      };

      setCacheItem(KEY_EXPENSES, result);
      if (onBackgroundUpdate) {
        onBackgroundUpdate(result);
      }
      return result;
    } catch (error) {
      console.warn('Background getExpenses sync warning:', error);
      return cached;
    }
  };

  if (cached.expenses && cached.expenses.length > 0) {
    revalidate();
    return cached;
  }

  return await revalidate();
}

/**
 * Fetch Performances with instant cache return and background revalidation
 */
export async function getPerformances(
  onBackgroundUpdate?: (data: PerformancesResponse) => void
): Promise<PerformancesResponse> {
  const cached = getCachedPerformances();

  if (!isLiveMode()) {
    return cached;
  }

  const revalidate = async () => {
    try {
      const url = `${APPS_SCRIPT_URL}?action=getPerformances`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const result: PerformancesResponse = {
        success: true,
        performances: data.performances || [],
        totalCount: data.totalCount || (data.performances || []).length,
      };

      setCacheItem(KEY_PERFORMANCES, result);
      if (onBackgroundUpdate) {
        onBackgroundUpdate(result);
      }
      return result;
    } catch (error) {
      console.warn('Background getPerformances sync warning:', error);
      return cached;
    }
  };

  if (cached.performances && cached.performances.length > 0) {
    revalidate();
    return cached;
  }

  return await revalidate();
}

/**
 * Fetch Volunteers with instant cache return and background revalidation
 */
export async function getVolunteers(
  onBackgroundUpdate?: (data: VolunteersResponse) => void
): Promise<VolunteersResponse> {
  const cached = getCachedVolunteers();

  if (!isLiveMode()) {
    return cached;
  }

  const revalidate = async () => {
    try {
      const url = `${APPS_SCRIPT_URL}?action=getVolunteers`;
      const res = await fetch(url, { method: 'GET' });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      const data = await res.json();
      const result: VolunteersResponse = {
        success: true,
        volunteers: data.volunteers || [],
        totalCount: data.totalCount || (data.volunteers || []).length,
      };

      setCacheItem(KEY_VOLUNTEERS, result);
      if (onBackgroundUpdate) {
        onBackgroundUpdate(result);
      }
      return result;
    } catch (error) {
      console.warn('Background getVolunteers sync warning:', error);
      return cached;
    }
  };

  if (cached.volunteers && cached.volunteers.length > 0) {
    revalidate();
    return cached;
  }

  return await revalidate();
}

// -------------------------------------------------------------
// 3. Network Dispatcher with Resilient Dual-Mode Fallback
// -------------------------------------------------------------

async function sendPayloadToGoogle(payload: Record<string, unknown>): Promise<boolean> {
  if (!isLiveMode()) return true;

  try {
    const response = await fetch(APPS_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
    });

    try {
      const json = await response.json();
      return json.success !== false;
    } catch {
      // 302 redirect or opaque response from Google Apps Script still succeeded
      return true;
    }
  } catch {
    // Standard fetch blocked by CORS or network, attempt no-cors mode
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8',
        },
        body: JSON.stringify(payload),
      });
      return true;
    } catch (err) {
      console.warn('Background network dispatch failed, will retry later:', err);
      return false;
    }
  }
}

/**
 * Trigger background queue processor
 */
export function triggerQueueSync(): void {
  processQueue(async (item: QueueItem) => {
    return await sendPayloadToGoogle(item.payload);
  });
}

// Auto-trigger queue processing when user comes back online or switches to tab
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => triggerQueueSync());
  window.addEventListener('focus', () => triggerQueueSync());
  // Initial sync attempt
  setTimeout(() => triggerQueueSync(), 1500);
}

// -------------------------------------------------------------
// 4. Instant Optimistic Submissions (<100ms UI response)
// -------------------------------------------------------------

/**
 * Submit Contribution:
 * 1. Instantly updates local cache (name appears at top of list immediately)
 * 2. Enqueues task into persistent offline queue
 * 3. Dispatches background sync worker without blocking UI
 */
export async function addContribution(formData: ContributionFormData): Promise<ApiResponse> {
  const numericAmount = Number(formData.amount);
  const payload = {
    action: 'addContribution',
    name: formData.name.trim(),
    amount: numericAmount,
    mode: formData.mode,
    honeypot: formData.honeypot || '',
  };

  // 1. Optimistically update local cache
  const cached = getCachedContributions();
  const optimisticItem: Contribution = {
    name: formData.name.trim(),
    amountMasked: '₹ ● ● ● ●',
  };

  const updatedContributions = [optimisticItem, ...(cached.contributions || [])];
  setCacheItem(KEY_CONTRIBUTIONS, {
    ...cached,
    contributions: updatedContributions,
    totalCount: updatedContributions.length,
    totalAmount: (cached.totalAmount || 0) + (numericAmount || 0),
  });

  // 2. Enqueue for background transmission
  enqueueItem('addContribution', payload);

  // 3. Trigger worker asynchronously
  setTimeout(() => triggerQueueSync(), 50);

  // 4. Return instant success to UI
  return {
    success: true,
    message: 'Contribution recorded successfully.',
  };
}

/**
 * Submit Performance Registration:
 * 1. Instantly adds act to local cache
 * 2. Enqueues task to background queue
 * 3. Triggers background worker
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

  // 1. Optimistically update local cache
  const cached = getCachedPerformances();
  const optimisticItem: Performance = {
    name: formData.name.trim(),
    actName: formData.actName.trim(),
    category: formData.category,
  };

  const updatedPerformances = [optimisticItem, ...(cached.performances || [])];
  setCacheItem(KEY_PERFORMANCES, {
    ...cached,
    performances: updatedPerformances,
    totalCount: updatedPerformances.length,
  });

  // 2. Enqueue for background transmission
  enqueueItem('addPerformanceRegistration', payload);

  // 3. Trigger worker asynchronously
  setTimeout(() => triggerQueueSync(), 50);

  return {
    success: true,
    message: 'Performance registration recorded successfully.',
  };
}

/**
 * Submit Volunteer Registration:
 * 1. Instantly adds volunteer to squad cache
 * 2. Enqueues task to background queue
 * 3. Triggers background worker
 */
export async function addVolunteer(formData: VolunteerFormData): Promise<ApiResponse> {
  const payload = {
    action: 'addVolunteer',
    name: formData.name.trim(),
    role: formData.role.trim(),
    availability: formData.availability.trim(),
    contact: formData.contact ? formData.contact.trim() : '',
    notes: formData.notes ? formData.notes.trim() : '',
    honeypot: formData.honeypot || '',
  };

  // 1. Optimistically update local cache
  const cached = getCachedVolunteers();
  const optimisticItem: Volunteer = {
    name: formData.name.trim(),
    role: formData.role.trim(),
    availability: formData.availability.trim(),
  };

  const updatedVolunteers = [optimisticItem, ...(cached.volunteers || [])];
  setCacheItem(KEY_VOLUNTEERS, {
    ...cached,
    volunteers: updatedVolunteers,
    totalCount: updatedVolunteers.length,
  });

  // 2. Enqueue for background transmission
  enqueueItem('addVolunteer', payload);

  // 3. Trigger worker asynchronously
  setTimeout(() => triggerQueueSync(), 50);

  return {
    success: true,
    message: 'Volunteer registration recorded successfully.',
  };
}


