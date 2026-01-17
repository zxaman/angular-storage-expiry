import { InjectionToken } from '@angular/core';
import { StorageConfig } from './storage.config';

/**
 * Injection token for Storage Configuration
 */
export const STORAGE_CONFIG = new InjectionToken<StorageConfig>('STORAGE_CONFIG');

/**
 * Default configuration values
 */
export const DEFAULT_STORAGE_CONFIG: StorageConfig = {
  prefix: '',
  defaultExpiry: undefined,
  storageType: 'local',
};
