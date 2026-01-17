/**
 * Internal storage item structure with expiry
 */
export interface StorageItem<T> {
  value: T;
  expiry: number;
}

/**
 * Check if a storage item has expired
 */
export function isExpired(item: StorageItem<any>): boolean {
  return Date.now() > item.expiry;
}

/**
 * Calculate expiry timestamp from TTL in minutes
 */
export function calculateExpiry(ttlMinutes: number): number {
  return Date.now() + ttlMinutes * 60 * 1000;
}

/**
 * Safely parse JSON with error handling
 */
export function safeJsonParse<T>(json: string | null): T | null {
  if (!json) {
    return null;
  }

  try {
    return JSON.parse(json) as T;
  } catch (error) {
    console.warn('[StorageService] Failed to parse JSON:', error);
    return null;
  }
}

/**
 * Safely stringify value to JSON
 */
export function safeJsonStringify(value: any): string | null {
  try {
    return JSON.stringify(value);
  } catch (error) {
    console.warn('[StorageService] Failed to stringify value:', error);
    return null;
  }
}

/**
 * Add prefix to key if configured
 */
export function prefixKey(key: string, prefix?: string): string {
  return prefix ? `${prefix}${key}` : key;
}
