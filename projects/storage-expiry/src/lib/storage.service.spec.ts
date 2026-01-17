import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_CONFIG } from './storage.tokens';
import { StorageConfig } from './storage.config';

describe('StorageService', () => {
  let service: StorageService;
  let storage: Storage;

  beforeEach(() => {
    // Mock localStorage
    storage = {
      getItem: jasmine.createSpy('getItem'),
      setItem: jasmine.createSpy('setItem'),
      removeItem: jasmine.createSpy('removeItem'),
      clear: jasmine.createSpy('clear'),
      key: jasmine.createSpy('key'),
      length: 0,
    };

    Object.defineProperty(window, 'localStorage', {
      value: storage,
      writable: true,
    });

    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: STORAGE_CONFIG, useValue: {} },
      ],
    });

    service = TestBed.inject(StorageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set item with expiry', () => {
    service.set('test', { data: 'value' }, 60);
    expect(storage.setItem).toHaveBeenCalled();
  });

  it('should get item', () => {
    const mockItem = JSON.stringify({
      value: { data: 'value' },
      expiry: Date.now() + 60000,
    });
    (storage.getItem as jasmine.Spy).and.returnValue(mockItem);

    const result = service.get<{ data: string }>('test');
    expect(result).toEqual({ data: 'value' });
  });

  it('should return null for expired items', () => {
    const expiredItem = JSON.stringify({
      value: { data: 'value' },
      expiry: Date.now() - 1000, // Expired
    });
    (storage.getItem as jasmine.Spy).and.returnValue(expiredItem);

    const result = service.get('test');
    expect(result).toBeNull();
    expect(storage.removeItem).toHaveBeenCalledWith('test');
  });

  it('should remove item', () => {
    service.remove('test');
    expect(storage.removeItem).toHaveBeenCalledWith('test');
  });

  it('should clear storage', () => {
    service.clear();
    expect(storage.clear).toHaveBeenCalled();
  });

  it('should be SSR safe', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        StorageService,
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: STORAGE_CONFIG, useValue: {} },
      ],
    });

    const serverService = TestBed.inject(StorageService);
    serverService.set('test', 'value');
    expect(storage.setItem).not.toHaveBeenCalled();

    const result = serverService.get('test');
    expect(result).toBeNull();
  });
});
