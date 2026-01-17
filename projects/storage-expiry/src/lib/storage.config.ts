/**
 * Configuration interface for Storage Service
 */
export interface StorageConfig {
  /**
   * Optional prefix for all storage keys
   * @example 'myApp_' -> keys become 'myApp_user', 'myApp_token'
   */
  prefix?: string;

  /**
   * Default expiry time in minutes for items without explicit TTL
   * @default undefined (no expiry)
   */
  defaultExpiry?: number;

  /**
   * Storage type to use
   * @default 'local'
   */
  storageType?: 'local' | 'session';
}
