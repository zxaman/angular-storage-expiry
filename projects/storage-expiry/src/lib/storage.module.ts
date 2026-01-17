import { ModuleWithProviders, NgModule } from '@angular/core';
import { STORAGE_CONFIG, DEFAULT_STORAGE_CONFIG } from './storage.tokens';
import { StorageConfig } from './storage.config';
import { StorageService } from './storage.service';

/**
 * Storage Module for NgModule-based Angular applications
 * 
 * @example
 * ```typescript
 * @NgModule({
 *   imports: [
 *     StorageModule.forRoot({
 *       prefix: 'myApp_',
 *       defaultExpiry: 60
 *     })
 *   ]
 * })
 * export class AppModule {}
 * ```
 */
@NgModule({
  providers: [StorageService],
})
export class StorageModule {
  /**
   * Configure Storage Service with custom settings
   * 
   * @param config Optional configuration
   * @returns Module with providers
   */
  static forRoot(config?: StorageConfig): ModuleWithProviders<StorageModule> {
    return {
      ngModule: StorageModule,
      providers: [
        {
          provide: STORAGE_CONFIG,
          useValue: { ...DEFAULT_STORAGE_CONFIG, ...config },
        },
      ],
    };
  }
}
