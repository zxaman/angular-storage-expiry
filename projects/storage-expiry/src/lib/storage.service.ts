import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { STORAGE_CONFIG, DEFAULT_STORAGE_CONFIG } from './storage.tokens';
import { StorageConfig } from './storage.config';
import {
  StorageItem,
  isExpired,
  calculateExpiry,
  safeJsonParse,
  safeJsonStringify,
  prefixKey,
} from './storage.utils';

/**
 * Angular Storage Service with Expiry Support
 * 
 * Provides a safe, type-safe wrapper around browser localStorage/sessionStorage
 * with automatic expiry, SSR safety, and clean API.
 * 
 * ⚠️ Security Note: This service is NOT meant for storing sensitive credentials
 * like passwords, PINs, or credit card information. Use it for tokens, user
 * preferences, and other non-sensitive application state.
 */
@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private readonly config: StorageConfig;
  private readonly storage: Storage | null;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(STORAGE_CONFIG) config: StorageConfig | null
  ) {
    this.config = { ...DEFAULT_STORAGE_CONFIG, ...config };
    
    // Only access storage in browser environment
    if (isPlatformBrowser(this.platformId)) {
      this.storage =
        this.config.storageType === 'session'
          ? window.sessionStorage
          : window.localStorage;
      
      // Clean expired items on service initialization
      this.cleanExpired();
    } else {
      this.storage = null;
    }
  }

  /**
   * Store a value with optional expiry
   * @param key Storage key
   * @param value Value to store (will be JSON stringified)
   * @param expiryMinutes Optional expiry time in minutes (overrides defaultExpiry)
   */
  set<T>(key: string, value: T, expiryMinutes?: number): void {
    if (!this.storage) {
      return; // SSR safe: do nothing on server
    }

    // Clean expired items before setting new data
    this.cleanExpired();

    const prefixedKey = prefixKey(key, this.config.prefix);
    const ttl = expiryMinutes ?? this.config.defaultExpiry;

    const item: StorageItem<T> = {
      value,
      expiry: ttl ? calculateExpiry(ttl) : Number.MAX_SAFE_INTEGER,
    };

    const serialized = safeJsonStringify(item);
    if (serialized) {
      this.storage.setItem(prefixedKey, serialized);
    }
  }

  /**
   * Retrieve a value by key
   * Automatically removes expired items
   * @param key Storage key
   * @returns Value or null if not found/expired
   */
  get<T>(key: string): T | null {
    if (!this.storage) {
      return null; // SSR safe: return null on server
    }

    const prefixedKey = prefixKey(key, this.config.prefix);
    const itemJson = this.storage.getItem(prefixedKey);

    if (!itemJson) {
      return null;
    }

    const item = safeJsonParse<StorageItem<T>>(itemJson);
    if (!item) {
      // Corrupted data, remove it
      this.storage.removeItem(prefixedKey);
      return null;
    }

    // Check expiry
    if (isExpired(item)) {
      this.storage.removeItem(prefixedKey);
      return null;
    }

    return item.value;
  }

  /**
   * Check if a key exists and is not expired
   * @param key Storage key
   * @returns true if key exists and is valid
   */
  has(key: string): boolean {
    if (!this.storage) {
      return false;
    }

    const prefixedKey = prefixKey(key, this.config.prefix);
    const itemJson = this.storage.getItem(prefixedKey);

    if (!itemJson) {
      return false;
    }

    const item = safeJsonParse<StorageItem<any>>(itemJson);
    if (!item) {
      return false;
    }

    if (isExpired(item)) {
      this.storage.removeItem(prefixedKey);
      return false;
    }

    return true;
  }

  /**
   * Remove a specific key from storage
   * @param key Storage key
   */
  remove(key: string): void {
    if (!this.storage) {
      return;
    }

    const prefixedKey = prefixKey(key, this.config.prefix);
    this.storage.removeItem(prefixedKey);
  }

  /**
   * Clear all storage items (respects prefix if configured)
   */
  clear(): void {
    if (!this.storage) {
      return;
    }

    if (this.config.prefix) {
      // Only clear items with prefix
      const keysToRemove: string[] = [];
      for (let i = 0; i < this.storage.length; i++) {
        const key = this.storage.key(i);
        if (key && key.startsWith(this.config.prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => {
        if (this.storage) {
          this.storage.removeItem(key);
        }
      });
    } else {
      // Clear all storage
      this.storage.clear();
    }
  }

  /**
   * Get all keys (with prefix stripped if configured)
   * @returns Array of keys
   */
  keys(): string[] {
    if (!this.storage) {
      return [];
    }

    // Clean expired items before returning keys
    this.cleanExpired();

    const keys: string[] = [];
    const prefix = this.config.prefix || '';

    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key) {
        if (prefix && key.startsWith(prefix)) {
          keys.push(key.substring(prefix.length));
        } else if (!prefix) {
          keys.push(key);
        }
      }
    }

    return keys;
  }

  /**
   * Clean all expired items from storage
   * This method is called automatically on initialization and when setting/getting items
   * You can also call it manually to clean expired items
   */
  cleanExpired(): void {
    if (!this.storage) {
      return;
    }

    const prefix = this.config.prefix || '';
    const keysToRemove: string[] = [];

    // Iterate through all storage items
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (!key) {
        continue;
      }

      // Only check items with our prefix (if configured)
      if (prefix && !key.startsWith(prefix)) {
        continue;
      }

      // Try to parse and check expiry
      const itemJson = this.storage.getItem(key);
      if (!itemJson) {
        continue;
      }

      const item = safeJsonParse<StorageItem<any>>(itemJson);
      if (!item) {
        // Corrupted data, mark for removal
        keysToRemove.push(key);
        continue;
      }

      // Check if expired
      if (isExpired(item)) {
        keysToRemove.push(key);
      }
    }

    // Remove all expired/corrupted items
    keysToRemove.forEach((key) => {
      this.storage!.removeItem(key);
    });
  }
}
