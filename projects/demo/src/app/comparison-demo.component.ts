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
  selector: 'app-comparison-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="comparison-container">
      <header class="header">
        <h1>Comparison: Problems vs Solutions</h1>
        <p class="subtitle">See how this package solves real development challenges</p>
      </header>
      
      <div *ngIf="initCleanupInfo()" class="alert alert-info">
        <div class="alert-content">
          <span class="alert-icon">ℹ</span>
          <div>
            <strong>Initialization Status</strong>
            <p>{{ initCleanupInfo() }}</p>
          </div>
        </div>
      </div>

      <div class="comparison-grid">
        <!-- OLD WAY -->
        <div class="panel panel-problem">
          <div class="panel-header">
            <h2>Raw localStorage</h2>
            <span class="badge badge-error">Problems</span>
          </div>

          <div class="panel-section">
            <h3>No Expiry Support</h3>
            <div class="form-group">
              <label>User Name</label>
              <input [(ngModel)]="oldUserName" placeholder="Enter name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input [(ngModel)]="oldUserEmail" placeholder="Enter email" class="form-control" type="email" />
            </div>
            <button (click)="saveOldWay()" class="btn btn-outline btn-danger">Save (No Expiry)</button>
            <div class="note note-warning">
              Data persists indefinitely. No automatic cleanup mechanism.
            </div>
            <div *ngIf="oldUserData()" class="result">
              <div class="result-header">Stored Data</div>
              <pre class="result-content">{{ oldUserData() | json }}</pre>
              <div class="result-meta">Stored at: {{ oldTimestamp() }}</div>
              <div class="result-warning">This data will never expire automatically</div>
            </div>
          </div>

          <div class="panel-section">
            <h3>Manual JSON Parsing</h3>
            <button (click)="loadOldWay()" class="btn btn-outline">Load Data</button>
            <div class="code-block">
              <pre>{{ manualParseExample }}</pre>
            </div>
            <div *ngIf="oldLoadedUser()" class="result">
              <div class="result-header">Loaded Data</div>
              <pre class="result-content">{{ oldLoadedUser() | json }}</pre>
            </div>
            <div *ngIf="oldError()" class="result result-error">
              <div class="result-header">Error</div>
              <p>{{ oldError() }}</p>
            </div>
          </div>

          <div class="panel-section">
            <h3>No Type Safety</h3>
            <div class="code-block">
              <pre>{{ noTypeSafetyExample }}</pre>
            </div>
            <div class="note note-warning">
              TypeScript cannot provide type checking. Runtime errors are possible.
            </div>
          </div>

          <div class="panel-section">
            <h3>Repeated Boilerplate</h3>
            <div class="code-block">
              <pre>{{ boilerplateCodeExample }}</pre>
            </div>
            <div class="note note-warning">
              Same code must be copied across multiple components and services.
            </div>
          </div>

          <div class="panel-section">
            <h3>Stale Data Detection</h3>
            <button (click)="checkStaleData()" class="btn btn-outline">Check Data</button>
            <div *ngIf="staleDataMessage()" class="result result-error">
              <div class="result-header">Status</div>
              <p>{{ staleDataMessage() }}</p>
            </div>
            <div class="note note-warning">
              No mechanism to determine if stored data is still valid.
            </div>
          </div>

          <div class="panel-section">
            <button (click)="clearOldWay()" class="btn btn-outline btn-danger">Clear All</button>
          </div>
        </div>

        <!-- NEW WAY -->
        <div class="panel panel-solution">
          <div class="panel-header">
            <h2>Storage Service</h2>
            <span class="badge badge-success">Solutions</span>
          </div>

          <div class="panel-section">
            <h3>Built-in Expiry</h3>
            <div class="form-group">
              <label>User Name</label>
              <input [(ngModel)]="newUserName" placeholder="Enter name" class="form-control" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input [(ngModel)]="newUserEmail" placeholder="Enter email" class="form-control" type="email" />
            </div>
            <div class="form-group">
              <label>Expiry (minutes)</label>
              <input type="number" [(ngModel)]="expiryMinutes" placeholder="5" class="form-control" min="0" />
            </div>
            <button (click)="saveNewWay()" class="btn btn-outline btn-success">Save (With Expiry)</button>
            <div class="note note-success">
              Data expires automatically. Cleanup happens on access.
            </div>
            <div *ngIf="newUserData()" class="result result-success">
              <div class="result-header">Stored Data</div>
              <pre class="result-content">{{ newUserData() | json }}</pre>
              <div class="result-meta">Expires at: {{ expiryTime() }}</div>
              <div class="result-success-text">Will auto-expire in {{ expiryMinutes }} minutes</div>
            </div>
          </div>

          <div class="panel-section">
            <h3>Automatic Parsing</h3>
            <button (click)="loadNewWay()" class="btn btn-outline btn-success">Load Data</button>
            <div class="code-block">
              <pre>{{ autoParseExample }}</pre>
            </div>
            <div *ngIf="newLoadedUser()" class="result result-success">
              <div class="result-header">Loaded Data</div>
              <pre class="result-content">{{ newLoadedUser() | json }}</pre>
            </div>
            <div *ngIf="!newLoadedUser() && newChecked()" class="result">
              <div class="result-header">Status</div>
              <p>Data not found or expired</p>
            </div>
          </div>

          <div class="panel-section">
            <h3>Type Safety</h3>
            <div class="code-block">
              <pre>{{ typeSafetyExample }}</pre>
            </div>
            <div class="note note-success">
              Full TypeScript support with compile-time type checking and IntelliSense.
            </div>
          </div>

          <div class="panel-section">
            <h3>Centralized Service</h3>
            <div class="code-block">
              <pre>{{ centralizedExample }}</pre>
            </div>
            <div class="note note-success">
              Single service implementation. Easy to maintain and test.
            </div>
          </div>

          <div class="panel-section">
            <h3>Automatic Expiry Check</h3>
            <button (click)="checkExpiry()" class="btn btn-outline btn-success">Check Expiry</button>
            <div *ngIf="expiryMessage()" class="result result-success">
              <div class="result-header">Status</div>
              <p>{{ expiryMessage() }}</p>
            </div>
            <div class="note note-success">
              Expired data is automatically removed when accessed.
            </div>
          </div>

          <div class="panel-section">
            <div class="button-row">
              <button (click)="cleanExpired()" class="btn btn-outline">Clean Expired</button>
              <button (click)="clearNewWay()" class="btn btn-outline btn-success">Clear All</button>
            </div>
            <div class="note note-info">
              Automatic cleanup occurs on: service initialization, set(), get(), and keys() operations.
            </div>
            <div *ngIf="cleanupMessage()" class="result result-success">
              <div class="result-header">Cleanup Status</div>
              <p>{{ cleanupMessage() }}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="comparison-table">
        <h2>Feature Comparison</h2>
        <table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Raw localStorage</th>
              <th>Storage Service</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Expiry Support</strong></td>
              <td class="text-error">No</td>
              <td class="text-success">Yes (automatic)</td>
            </tr>
            <tr>
              <td><strong>JSON Parsing</strong></td>
              <td class="text-error">Manual (error-prone)</td>
              <td class="text-success">Automatic (safe)</td>
            </tr>
            <tr>
              <td><strong>Type Safety</strong></td>
              <td class="text-error">No (returns 'any')</td>
              <td class="text-success">Yes (generics)</td>
            </tr>
            <tr>
              <td><strong>Code Reuse</strong></td>
              <td class="text-error">Copy-paste everywhere</td>
              <td class="text-success">Centralized service</td>
            </tr>
            <tr>
              <td><strong>SSR Safe</strong></td>
              <td class="text-error">Crashes on server</td>
              <td class="text-success">Platform detection</td>
            </tr>
            <tr>
              <td><strong>Auto Cleanup</strong></td>
              <td class="text-error">Manual removal</td>
              <td class="text-success">Automatic on expiry</td>
            </tr>
            <tr>
              <td><strong>Error Handling</strong></td>
              <td class="text-error">Try-catch everywhere</td>
              <td class="text-success">Built-in safety</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `,
  styles: [`
    .comparison-container {
      max-width: 1400px;
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

    .alert {
      margin-bottom: 2rem;
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

    .comparison-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      margin-bottom: 3rem;
    }

    .panel {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }

    .panel-problem {
      border-top: 3px solid #dc3545;
    }

    .panel-solution {
      border-top: 3px solid #28a745;
    }

    .panel-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.5rem;
      background: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .panel-header h2 {
      font-size: 1.25rem;
      font-weight: 600;
      color: #212529;
      margin: 0;
    }

    .badge {
      padding: 0.375rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .badge-error {
      background: #f8d7da;
      color: #721c24;
    }

    .badge-success {
      background: #d4edda;
      color: #155724;
    }

    .panel-section {
      padding: 1.5rem;
      border-bottom: 1px solid #e9ecef;
    }

    .panel-section:last-child {
      border-bottom: none;
    }

    .panel-section h3 {
      font-size: 1rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 1rem 0;
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

    .btn-outline {
      background: white;
      color: #007bff;
      border: 1px solid #007bff;
    }

    .btn-outline:hover {
      background: #007bff;
      color: white;
    }

    .btn-outline.btn-danger {
      color: #dc3545;
      border-color: #dc3545;
    }

    .btn-outline.btn-danger:hover {
      background: #dc3545;
      color: white;
    }

    .btn-outline.btn-success {
      color: #28a745;
      border-color: #28a745;
    }

    .btn-outline.btn-success:hover {
      background: #28a745;
      color: white;
    }

    .button-row {
      display: flex;
      gap: 0.75rem;
      margin-bottom: 1rem;
    }

    .note {
      margin-top: 0.75rem;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .note-warning {
      background: #fff3cd;
      border-left: 3px solid #ffc107;
      color: #856404;
    }

    .note-success {
      background: #d4edda;
      border-left: 3px solid #28a745;
      color: #155724;
    }

    .note-info {
      background: #d1ecf1;
      border-left: 3px solid #17a2b8;
      color: #0c5460;
    }

    .code-block {
      margin: 0.75rem 0;
      background: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 4px;
      overflow: hidden;
    }

    .code-block pre {
      margin: 0;
      padding: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #212529;
      overflow-x: auto;
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
      margin: 0.5rem 0;
      padding: 0.75rem;
      background: #ffffff;
      border-radius: 4px;
      font-size: 0.875rem;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      word-break: break-all;
      overflow-x: auto;
    }

    .result-meta {
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.5rem;
    }

    .result-warning {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #856404;
      font-weight: 500;
    }

    .result-success-text {
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #155724;
      font-weight: 500;
    }

    .comparison-table {
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-top: 2rem;
    }

    .comparison-table h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #212529;
      margin: 0 0 1.5rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
    }

    th, td {
      padding: 0.75rem 1rem;
      text-align: left;
      border-bottom: 1px solid #dee2e6;
    }

    th {
      background: #f8f9fa;
      font-weight: 600;
      color: #495057;
      font-size: 0.875rem;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    tr:hover {
      background: #f8f9fa;
    }

    .text-error {
      color: #dc3545;
      font-weight: 500;
    }

    .text-success {
      color: #28a745;
      font-weight: 500;
    }

    @media (max-width: 1200px) {
      .comparison-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .comparison-container {
        padding: 1rem 0.5rem;
      }

      .header h1 {
        font-size: 1.5rem;
      }

      .panel-section {
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
export class ComparisonDemoComponent {
  private storage = inject(StorageService);

  initCleanupInfo = signal<string>('');

  constructor() {
    this.showInitInfo();
  }

  showInitInfo() {
    const remainingKeys = this.storage.keys();
    const oldWayExists = localStorage.getItem('old_user') !== null;
    
    let message = '';
    if (remainingKeys.length === 0 && !oldWayExists) {
      message = 'All expired items cleaned on page load. No data found.';
    } else if (remainingKeys.length > 0 && !oldWayExists) {
      message = `Expired items cleaned. ${remainingKeys.length} valid item(s) from storage service remain.`;
    } else if (remainingKeys.length === 0 && oldWayExists) {
      message = 'Storage service: All expired items cleaned. Raw localStorage: Data still exists (no expiry).';
    } else {
      message = `Storage service: ${remainingKeys.length} valid item(s). Raw localStorage: Data still exists (no expiry).`;
    }
    
    this.initCleanupInfo.set(message);
    setTimeout(() => this.initCleanupInfo.set(''), 6000);
  }

  boilerplateCodeExample = `// Same code everywhere
try {
  const data = JSON.parse(
    localStorage.getItem('key') || '{}'
  );
} catch (e) {
  console.error(e);
}`;

  manualParseExample = `// Manual parsing required
const data = JSON.parse(
  localStorage.getItem('user') || '{}'
);`;

  noTypeSafetyExample = `// Returns 'any' - no type checking
const user = JSON.parse(
  localStorage.getItem('user') || '{}'
);
// No IntelliSense support`;

  autoParseExample = `// Automatic parsing
const user = storage.get<User>('user');
// Handles JSON parsing automatically`;

  typeSafetyExample = `// Full type safety
const user = storage.get<User>('user');
// Full IntelliSense support`;

  centralizedExample = `// Centralized service
inject(StorageService)
// Single implementation`;

  oldUserName = '';
  oldUserEmail = '';
  oldUserData = signal<User | null>(null);
  oldTimestamp = signal<string>('');
  oldLoadedUser = signal<User | null>(null);
  oldError = signal<string>('');
  staleDataMessage = signal<string>('');

  newUserName = '';
  newUserEmail = '';
  expiryMinutes = 5;
  newUserData = signal<User | null>(null);
  expiryTime = signal<string>('');
  newLoadedUser = signal<User | null>(null);
  newChecked = signal(false);
  expiryMessage = signal<string>('');
  cleanupMessage = signal<string>('');

  saveOldWay() {
    if (!this.oldUserName || !this.oldUserEmail) {
      alert('Please enter both name and email');
      return;
    }

    const user: User = {
      id: Date.now(),
      name: this.oldUserName,
      email: this.oldUserEmail,
    };

    try {
      localStorage.setItem('old_user', JSON.stringify(user));
      this.oldUserData.set(user);
      this.oldTimestamp.set(new Date().toLocaleTimeString());
      this.oldUserName = '';
      this.oldUserEmail = '';
    } catch (e) {
      this.oldError.set('Failed to save: ' + (e as Error).message);
    }
  }

  loadOldWay() {
    try {
      const data = localStorage.getItem('old_user');
      if (!data) {
        this.oldLoadedUser.set(null);
        this.oldError.set('No data found');
        return;
      }
      const user = JSON.parse(data);
      this.oldLoadedUser.set(user);
      this.oldError.set('');
    } catch (e) {
      this.oldError.set('Parse error: ' + (e as Error).message);
      this.oldLoadedUser.set(null);
    }
  }

  checkStaleData() {
    const data = localStorage.getItem('old_user');
    if (data) {
      this.staleDataMessage.set(
        'Data exists but there is no way to determine if it is still valid. ' +
        'It could be from days, weeks, or months ago. No expiry mechanism available.'
      );
    } else {
      this.staleDataMessage.set('No data found');
    }
  }

  clearOldWay() {
    localStorage.removeItem('old_user');
    this.oldUserData.set(null);
    this.oldLoadedUser.set(null);
    this.oldError.set('');
    this.staleDataMessage.set('');
  }

  saveNewWay() {
    if (!this.newUserName || !this.newUserEmail) {
      alert('Please enter both name and email');
      return;
    }

    const user: User = {
      id: Date.now(),
      name: this.newUserName,
      email: this.newUserEmail,
    };

    this.storage.set('new_user', user, this.expiryMinutes);
    this.newUserData.set(user);
    
    const expiryDate = new Date(Date.now() + this.expiryMinutes * 60 * 1000);
    this.expiryTime.set(expiryDate.toLocaleTimeString());
    
    this.newUserName = '';
    this.newUserEmail = '';
  }

  loadNewWay() {
    const user = this.storage.get<User>('new_user');
    this.newLoadedUser.set(user);
    this.newChecked.set(true);
  }

  checkExpiry() {
    const exists = this.storage.has('new_user');
    if (exists) {
      const user = this.storage.get<User>('new_user');
      if (user) {
        this.expiryMessage.set('Data is valid and not expired');
      } else {
        this.expiryMessage.set('Data has expired and was automatically removed');
      }
    } else {
      this.expiryMessage.set('No data found or expired');
    }
  }

  cleanExpired() {
    this.storage.cleanExpired();
    const keys = this.storage.keys();
    this.cleanupMessage.set(`Cleaned expired items. Remaining keys: ${keys.length}`);
    setTimeout(() => this.cleanupMessage.set(''), 3000);
    
    if (this.newLoadedUser()) {
      const user = this.storage.get<User>('new_user');
      this.newLoadedUser.set(user);
    }
  }

  clearNewWay() {
    this.storage.clear();
    this.newUserData.set(null);
    this.newLoadedUser.set(null);
    this.newChecked.set(false);
    this.expiryMessage.set('');
    this.cleanupMessage.set('');
  }
}
