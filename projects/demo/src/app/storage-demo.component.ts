import { Component, inject, signal } from '@angular/core';
import { StorageService } from '@angular-storage-expiry/storage-expiry';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
  email: string;
}

@Component({
  selector: 'app-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container">
      <header class="header">
        <h1>Storage Service Demo</h1>
        <p class="subtitle">Interactive demonstration of Angular Storage with Expiry</p>
      </header>
      
      <div *ngIf="initCleanupMessage()" class="alert alert-info">
        <div class="alert-content">
          <span class="alert-icon">ℹ</span>
          <div>
            <strong>Initialization Complete</strong>
            <p>{{ initCleanupMessage() }}</p>
          </div>
        </div>
      </div>
      
      <div class="card">
        <div class="card-header">
          <h2>Store Data</h2>
          <span class="card-subtitle">Save data with automatic expiry</span>
        </div>
        <div class="card-body">
          <div class="form-group">
            <label>User Name</label>
            <input 
              [(ngModel)]="userName" 
              placeholder="Enter name"
              class="form-control"
            />
          </div>
          <div class="form-group">
            <label>Email</label>
            <input 
              [(ngModel)]="userEmail" 
              placeholder="Enter email"
              class="form-control"
              type="email"
            />
          </div>
          <div class="form-group">
            <label>Expiry (minutes)</label>
            <input 
              type="number"
              [(ngModel)]="expiryMinutes" 
              placeholder="5"
              class="form-control"
              min="0"
            />
          </div>
          <button (click)="saveUser()" class="btn btn-primary">Save User</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Retrieve Data</h2>
          <span class="card-subtitle">Load stored data with type safety</span>
        </div>
        <div class="card-body">
          <button (click)="loadUser()" class="btn btn-secondary">Load User</button>
          <div *ngIf="loadedUser()" class="result">
            <div class="result-header">Loaded Data</div>
            <pre class="result-content">{{ loadedUser() | json }}</pre>
          </div>
          <div *ngIf="!loadedUser() && checked" class="result result-error">
            <div class="result-header">No Data Found</div>
            <p>User data not found or has expired</p>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Storage Operations</h2>
          <span class="card-subtitle">Manage storage items</span>
        </div>
        <div class="card-body">
          <div class="button-row">
            <button (click)="checkExists()" class="btn btn-outline">Check Exists</button>
            <button (click)="getAllKeys()" class="btn btn-outline">Get All Keys</button>
            <button (click)="removeUser()" class="btn btn-outline btn-warning">Remove</button>
            <button (click)="clearAll()" class="btn btn-outline btn-danger">Clear All</button>
          </div>
          <div *ngIf="existsResult() !== null" class="result">
            <div class="result-header">Status</div>
            <p>User exists: <strong>{{ existsResult() }}</strong></p>
          </div>
          <div *ngIf="allKeys().length > 0" class="result">
            <div class="result-header">Storage Keys</div>
            <div class="key-list">
              <span *ngFor="let key of allKeys()" class="key-badge">{{ key }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Quick Actions</h2>
          <span class="card-subtitle">Common storage operations</span>
        </div>
        <div class="card-body">
          <div class="button-row">
            <button (click)="saveToken()" class="btn btn-outline">Save Token (15 min)</button>
            <button (click)="savePreferences()" class="btn btn-outline">Save Preferences</button>
          </div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <h2>Automatic Cleanup</h2>
          <span class="card-subtitle">Expired items are automatically removed</span>
        </div>
        <div class="card-body">
          <div class="info-text">
            <p>Expired items are automatically cleaned when you call <code>get()</code>, <code>has()</code>, or <code>keys()</code>. Cleanup also happens on service initialization and when setting new items.</p>
          </div>
          <button (click)="cleanExpired()" class="btn btn-outline">Clean Expired Items</button>
          <div *ngIf="cleanupResult()" class="result result-success">
            <div class="result-header">Cleanup Complete</div>
            <p>{{ cleanupResult() }}</p>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .demo-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem 1rem;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: #f8f9fa;
      min-height: 100vh;
    }

    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1.5rem;
      border-bottom: 1px solid #dee2e6;
    }

    .header h1 {
      font-size: 2rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 0.5rem 0;
    }

    .subtitle {
      color: #6c757d;
      font-size: 0.95rem;
      margin: 0;
    }

    .card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      margin-bottom: 1.5rem;
      overflow: hidden;
    }

    .card-header {
      padding: 1.25rem 1.5rem;
      border-bottom: 1px solid #e9ecef;
      background: #f8f9fa;
    }

    .card-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 0.25rem 0;
    }

    .card-subtitle {
      font-size: 0.875rem;
      color: #6c757d;
    }

    .card-body {
      padding: 1.5rem;
    }

    .form-group {
      margin-bottom: 1rem;
    }

    .form-group label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: #495057;
      margin-bottom: 0.5rem;
    }

    .form-control {
      width: 100%;
      padding: 0.625rem 0.75rem;
      font-size: 0.9375rem;
      border: 1px solid #ced4da;
      border-radius: 4px;
      transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
      box-sizing: border-box;
    }

    .form-control:focus {
      outline: 0;
      border-color: #80bdff;
      box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    }

    .btn {
      padding: 0.625rem 1.25rem;
      font-size: 0.9375rem;
      font-weight: 500;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.15s ease-in-out;
      display: inline-block;
    }

    .btn-primary {
      background: #007bff;
      color: white;
    }

    .btn-primary:hover {
      background: #0056b3;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #545b62;
    }

    .btn-outline {
      background: white;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-outline:hover {
      background: #007bff;
      color: white;
    }

    .btn-outline.btn-warning {
      color: #ffc107;
      border-color: #ffc107;
    }

    .btn-outline.btn-warning:hover {
      background: #ffc107;
      color: #212529;
    }

    .btn-outline.btn-danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn-outline.btn-danger:hover {
      background: #dc3545;
      color: white;
    }

    .button-row {
      display: flex;
      gap: 0.75rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }

    .result {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      border-left: 3px solid #007bff;
    }

    .result-success {
      border-left-color: #28a745;
      background: #d4edda;
    }

    .result-error {
      border-left-color: #dc3545;
      background: #f8d7da;
    }

    .result-header {
      font-weight: 600;
      font-size: 0.875rem;
      color: #495057;
      margin-bottom: 0.5rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .result-content {
      margin: 0;
      padding: 0.75rem;
      background: #ffffff;
      border-radius: 4px;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      overflow-x: auto;
    }

    .key-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .key-badge {
      display: inline-block;
      padding: 0.375rem 0.75rem;
      background: #e9ecef;
      border-radius: 4px;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
      color: #495057;
    }

    .info-text {
      margin-bottom: 1rem;
      padding: 0.75rem;
      background: #e7f3ff;
      border-left: 3px solid #007bff;
      border-radius: 4px;
    }

    .info-text p {
      margin: 0;
      font-size: 0.875rem;
      color: #004085;
      line-height: 1.5;
    }

    .info-text code {
      background: rgba(0, 0, 0, 0.05);
      padding: 0.125rem 0.375rem;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
      font-size: 0.875em;
    }

    .alert {
      margin-bottom: 1.5rem;
      padding: 1rem 1.25rem;
      border-radius: 4px;
      border-left: 4px solid;
    }

    .alert-info {
      background: #d1ecf1;
      border-left-color: #0c5460;
      color: #0c5460;
    }

    .alert-content {
      display: flex;
      align-items: flex-start;
      gap: 0.75rem;
    }

    .alert-icon {
      font-size: 1.25rem;
      font-weight: 600;
    }

    .alert-content strong {
      display: block;
      margin-bottom: 0.25rem;
      font-weight: 600;
    }

    .alert-content p {
      margin: 0;
      font-size: 0.875rem;
    }

    @media (max-width: 768px) {
      .demo-container {
        padding: 1rem 0.5rem;
      }

      .header h1 {
        font-size: 1.5rem;
      }

      .card-body {
        padding: 1rem;
      }

      .button-row {
        flex-direction: column;
      }

      .btn {
        width: 100%;
      }
    }
  `]
})
export class StorageDemoComponent {
  private storage = inject(StorageService);

  userName = '';
  userEmail = '';
  expiryMinutes = 5;
  checked = false;

  loadedUser = signal<User | null>(null);
  existsResult = signal<boolean | null>(null);
  allKeys = signal<string[]>([]);
  cleanupResult = signal<string>('');
  initCleanupMessage = signal<string>('');

  constructor() {
    this.checkInitCleanup();
  }

  checkInitCleanup() {
    const remainingKeys = this.storage.keys();
    if (remainingKeys.length === 0) {
      this.initCleanupMessage.set('All expired items were automatically cleaned on page load. No valid items found.');
    } else {
      this.initCleanupMessage.set(`Automatic cleanup completed on page load. ${remainingKeys.length} valid item(s) remaining.`);
    }
    setTimeout(() => this.initCleanupMessage.set(''), 5000);
  }

  saveUser() {
    if (!this.userName || !this.userEmail) {
      alert('Please enter both name and email');
      return;
    }

    const user: User = {
      id: Date.now(),
      name: this.userName,
      email: this.userEmail,
    };

    this.storage.set('user', user, this.expiryMinutes);
    alert(`User saved with ${this.expiryMinutes} minute expiry`);
    this.userName = '';
    this.userEmail = '';
  }

  loadUser() {
    const user = this.storage.get<User>('user');
    this.loadedUser.set(user);
    this.checked = true;
  }

  checkExists() {
    const exists = this.storage.has('user');
    this.existsResult.set(exists);
  }

  getAllKeys() {
    const keys = this.storage.keys();
    this.allKeys.set(keys);
  }

  removeUser() {
    this.storage.remove('user');
    this.loadedUser.set(null);
    this.existsResult.set(null);
    alert('User removed from storage');
  }

  clearAll() {
    this.storage.clear();
    this.loadedUser.set(null);
    this.existsResult.set(null);
    this.allKeys.set([]);
    alert('All storage cleared');
  }

  saveToken() {
    const token = `token_${Date.now()}`;
    this.storage.set('authToken', token, 15);
    alert('Token saved with 15 minute expiry');
  }

  savePreferences() {
    const prefs = {
      theme: 'dark',
      language: 'en',
      notifications: true,
    };
    this.storage.set('preferences', prefs, 0);
    alert('Preferences saved (no expiry)');
  }

  cleanExpired() {
    const keysBefore = this.storage.keys().length;
    this.storage.cleanExpired();
    const keysAfter = this.storage.keys().length;
    const removed = keysBefore - keysAfter;
    
    if (removed > 0) {
      this.cleanupResult.set(`Cleaned ${removed} expired item(s). ${keysAfter} item(s) remaining.`);
    } else {
      this.cleanupResult.set('No expired items found. All items are still valid.');
    }
    
    this.getAllKeys();
    setTimeout(() => this.cleanupResult.set(''), 3000);
  }
}
