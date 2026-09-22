/**
 * Bangur Complex Durga Puja 2026
 * Client-Side Caching (Stale-While-Revalidate) & Resilient Offline/Background Queue
 */

const CACHE_PREFIX = 'bangur_cache_';
const QUEUE_STORAGE_KEY = 'bangur_offline_queue_v1';

export interface CacheWrapper<T> {
  data: T;
  timestamp: number;
}

export interface QueueItem {
  id: string;
  action: string;
  payload: Record<string, unknown>;
  attempts: number;
  timestamp: number;
}

/**
 * Retrieve cached data from localStorage
 */
export function getCacheItem<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!raw) return null;
    const wrapper: CacheWrapper<T> = JSON.parse(raw);
    return wrapper.data;
  } catch (e) {
    console.warn('Failed to read from cache:', e);
    return null;
  }
}

/**
 * Save data to localStorage cache
 */
export function setCacheItem<T>(key: string, data: T): void {
  try {
    const wrapper: CacheWrapper<T> = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(wrapper));
  } catch (e) {
    console.warn('Failed to write to cache:', e);
  }
}

/**
 * Get pending sync queue from localStorage
 */
export function getQueue(): QueueItem[] {
  try {
    const raw = localStorage.getItem(QUEUE_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

/**
 * Persist queue to localStorage
 */
function saveQueue(queue: QueueItem[]): void {
  try {
    localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(queue));
  } catch (e) {
    console.error('Failed to persist queue to localStorage:', e);
  }
}

/**
 * Enqueue a submission task to the background queue
 */
export function enqueueItem(action: string, payload: Record<string, unknown>): QueueItem {
  const queue = getQueue();
  const newItem: QueueItem = {
    id: `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    action,
    payload,
    attempts: 0,
    timestamp: Date.now(),
  };

  queue.push(newItem);
  saveQueue(queue);
  return newItem;
}

/**
 * Remove an item from the queue after successful processing
 */
export function removeFromQueue(id: string): void {
  const queue = getQueue().filter((item) => item.id !== id);
  saveQueue(queue);
}

let isProcessing = false;

/**
 * Process all pending items in the queue sequentially in the background
 */
export async function processQueue(
  dispatcher: (item: QueueItem) => Promise<boolean>
): Promise<void> {
  if (isProcessing) return;
  const queue = getQueue();
  if (queue.length === 0) return;

  isProcessing = true;

  try {
    for (const item of queue) {
      try {
        item.attempts += 1;
        const success = await dispatcher(item);
        if (success) {
          removeFromQueue(item.id);
        } else if (item.attempts >= 5) {
          // Drop corrupted or unprocessable item after 5 failed attempts
          console.warn(`Dropping queue item ${item.id} after 5 failed attempts.`);
          removeFromQueue(item.id);
        } else {
          // Keep item in queue and break loop for later retry
          saveQueue(getQueue().map((q) => (q.id === item.id ? item : q)));
          break;
        }
      } catch (err) {
        console.warn(`Error processing queue item ${item.id}:`, err);
        break;
      }
    }
  } finally {
    isProcessing = false;
  }
}