import { Provider } from '@angular/core';
import { STORAGE_CONFIG, DEFAULT_STORAGE_CONFIG } from './storage.tokens';
import { StorageConfig } from './storage.config';

/**
 * Provide Storage Service for Standalone Angular applications
 * 
 * @param config Optional configuration
 * @returns Provider array for bootstrapApplication
 * 
 * @example
 * ```typescript
 * bootstrapApplication(AppComponent, {
 *   providers: [
 *     provideStorage({
 *       prefix: 'myApp_',
 *       defaultExpiry: 60
 *     })
 *   ]
 * });
 * ```
 */
export function provideStorage(config?: StorageConfig): Provider[] {
  return [
    {
      provide: STORAGE_CONFIG,
      useValue: { ...DEFAULT_STORAGE_CONFIG, ...config },
    },
  ];
}
