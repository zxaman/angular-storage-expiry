import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StorageDemoComponent } from './storage-demo.component';
import { ComparisonDemoComponent } from './comparison-demo.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StorageDemoComponent, ComparisonDemoComponent, CommonModule],
  template: `
    <div class="app-container">
      <nav class="tabs">
        <button 
          [class.active]="activeTab() === 'comparison'"
          (click)="activeTab.set('comparison')"
          class="tab-btn">
          Comparison
        </button>
        <button 
          [class.active]="activeTab() === 'demo'"
          (click)="activeTab.set('demo')"
          class="tab-btn">
          Interactive Demo
        </button>
      </nav>

      <div class="tab-content">
        <app-comparison-demo *ngIf="activeTab() === 'comparison'"></app-comparison-demo>
        <app-storage-demo *ngIf="activeTab() === 'demo'"></app-storage-demo>
      </div>
    </div>
    <router-outlet></router-outlet>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      background: #f5f5f5;
    }

    .tabs {
      display: flex;
      gap: 0;
      background: white;
      border-bottom: 2px solid #e0e0e0;
      padding: 0 2rem;
      position: sticky;
      top: 0;
      z-index: 100;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .tab-btn {
      padding: 1rem 2rem;
      border: none;
      background: transparent;
      cursor: pointer;
      font-size: 1rem;
      font-weight: 500;
      color: #666;
      border-bottom: 3px solid transparent;
      transition: all 0.2s;
    }

    .tab-btn:hover {
      background: #f5f5f5;
      color: #1976d2;
    }

    .tab-btn.active {
      color: #1976d2;
      border-bottom-color: #1976d2;
      background: #f5f5f5;
    }

    .tab-content {
      padding: 0;
    }
  `]
})
export class App {
  title = 'Angular Storage Expiry Demo';
  activeTab = signal<'comparison' | 'demo'>('comparison');
}
