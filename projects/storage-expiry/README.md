# @angular-storage-expiry/storage-expiry

> **Angular Storage with Automatic Expiry** - A production-ready, SSR-safe storage service that solves real problems developers face every day with browser localStorage.

[![npm version](https://img.shields.io/npm/v/@angular-storage-expiry/storage-expiry.svg)](https://www.npmjs.com/package/@angular-storage-expiry/storage-expiry)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📦 Package Name

**`@angular-storage-expiry/storage-expiry`**

Install it with:
```bash
npm install @angular-storage-expiry/storage-expiry
```

---

## 🔴 The Real Problems Developers Face Today

### Problem 1: No Expiry = Stale Data Bugs

**What happens:**
```typescript
// Developer stores auth token
localStorage.setItem('token', jwtToken);

// User closes browser, comes back 2 months later
// App still thinks user is logged in
const token = localStorage.getItem('token'); // Still there! 😱

// User clicks something → API returns 401
// App crashes or shows confusing error
// User frustrated, thinks app is broken
```

**User Experience Impact:**
- ❌ User sees "You are logged in" but can't access anything
- ❌ Random errors when clicking buttons
- ❌ Confusing logout messages
- ❌ User loses trust in the application

**What this package solves:**
```typescript
// ✅ Token expires automatically
storage.set('token', jwtToken, 15); // 15 minutes

// After expiry, returns null automatically
const token = storage.get<string>('token'); // null if expired

// App can handle gracefully → redirect to login
// User experience: smooth, predictable
```

---

### Problem 2: SSR Crashes = Broken SEO & Universal Apps

**What happens:**
```typescript
// Developer uses localStorage directly
export class UserService {
  getUser() {
    return JSON.parse(localStorage.getItem('user') || '{}');
  }
}

// Deploys to Angular Universal (SSR)
// Server tries to render page
// 💥 CRASH: ReferenceError: localStorage is not defined
// Page doesn't render → SEO fails
// Search engines see blank page
```

**User Experience Impact:**
- ❌ App doesn't work with Angular Universal
- ❌ SEO completely broken
- ❌ Slow page loads (no server-side rendering)
- ❌ Poor search engine rankings

**What this package solves:**
```typescript
// ✅ Automatically detects platform
// On server: returns null safely
// On browser: works normally
const user = storage.get<User>('user'); // Works everywhere!

// SEO works perfectly
// Fast initial page load
// Search engines see content
```

---

### Problem 3: JSON Parsing Errors = App Crashes

**What happens:**
```typescript
// Developer forgets error handling
const user = JSON.parse(localStorage.getItem('user') || '{}');

// User manually clears storage
// Or storage gets corrupted
// 💥 CRASH: SyntaxError: Unexpected token
// Entire app breaks
// User sees white screen of death
```

**User Experience Impact:**
- ❌ App completely breaks
- ❌ White screen of death
- ❌ User has to refresh page
- ❌ Data loss

**What this package solves:**
```typescript
// ✅ Safe parsing built-in
const user = storage.get<User>('user'); // Never crashes!

// Returns null if corrupted
// App continues working
// User experience: smooth, no crashes
```

---

### Problem 4: Repeated Boilerplate = Maintenance Nightmare

**What happens:**
```typescript
// Developer writes this in 20 different places
try {
  const data = JSON.parse(localStorage.getItem('key') || '{}');
  if (data.expiry && Date.now() > data.expiry) {
    localStorage.removeItem('key');
    return null;
  }
  return data.value;
} catch (e) {
  localStorage.removeItem('key');
  return null;
}

// Bug found? Fix it in 20 places
// New requirement? Update 20 places
// Testing? Mock localStorage 20 times
```

**User Experience Impact:**
- ❌ Inconsistent behavior across app
- ❌ Bugs take longer to fix
- ❌ More bugs = worse UX

**What this package solves:**
```typescript
// ✅ One line, everywhere
const user = storage.get<User>('user');

// Bug fix? One place
// New feature? One place
// Testing? Mock one service
// Consistent behavior everywhere
```

---

### Problem 5: No Type Safety = Runtime Errors

**What happens:**
```typescript
// Developer gets data
const user = JSON.parse(localStorage.getItem('user') || '{}');

// TypeScript thinks it's 'any'
// No autocomplete
// Developer makes typo
user.nmae // Typo! But TypeScript doesn't catch it

// Runtime error: Cannot read property 'nmae' of undefined
// User sees error message
```

**User Experience Impact:**
- ❌ More bugs in production
- ❌ Runtime errors users see
- ❌ Slower development = slower features

**What this package solves:**
```typescript
// ✅ Full type safety
const user = storage.get<User>('user');

// TypeScript knows the type
// Autocomplete works
// Catches errors at compile time
// Better code = better UX
```

---

## ✅ How This Package Solves Everything

### 🎯 Solution Overview

This package provides a **single, centralized service** that:

1. ✅ **Automatic Expiry** - Data expires on its own, no stale data
2. ✅ **SSR Safe** - Works perfectly with Angular Universal
3. ✅ **Error Handling** - Never crashes, always returns safely
4. ✅ **Type Safety** - Full TypeScript support with generics
5. ✅ **Clean API** - One service, used everywhere
6. ✅ **Auto Cleanup** - Expired items removed automatically

### 🚀 Result: Smooth User Experience

- ✅ **Predictable behavior** - Users know what to expect
- ✅ **No random errors** - App handles expired data gracefully
- ✅ **Fast loading** - SSR works, SEO works
- ✅ **Reliable** - No crashes from corrupted data
- ✅ **Secure** - Tokens expire automatically

---

## 📦 Installation

```bash
npm install @angular-storage-expiry/storage-expiry
```

---

## 🚀 Quick Start Guide

### Step 1: Configure (Choose One)

**For Standalone Angular (Angular 16+):**
```typescript
import { bootstrapApplication } from '@angular/platform-browser';
import { provideStorage } from '@angular-storage-expiry/storage-expiry';
import { AppComponent } from './app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideStorage({
      prefix: 'myApp_',        // Optional: prefix all keys
      defaultExpiry: 60        // Optional: default 60 minutes
    })
  ]
});
```

**For NgModule Angular:**
```typescript
import { NgModule } from '@angular/core';
import { StorageModule } from '@angular-storage-expiry/storage-expiry';

@NgModule({
  imports: [
    StorageModule.forRoot({
      prefix: 'myApp_',
      defaultExpiry: 60
    })
  ]
})
export class AppModule {}
```

### Step 2: Use in Your Code

```typescript
import { Component, inject } from '@angular/core';
import { StorageService } from '@angular-storage-expiry/storage-expiry';

@Component({...})
export class MyComponent {
  private storage = inject(StorageService);
  
  // Store data with expiry
  saveUser(user: User) {
    this.storage.set('user', user, 60); // Expires in 60 minutes
  }
  
  // Get data (type-safe, auto-expiry check)
  getUser(): User | null {
    return this.storage.get<User>('user'); // Returns null if expired
  }
}
```

That's it! You're ready to go.

---

## 💻 Complete Usage Guide

### Storing Data

```typescript
// Store with specific expiry (in minutes)
this.storage.set('token', jwtToken, 15); // 15 minutes

// Store with default expiry (from config)
this.storage.set('user', userData); // Uses defaultExpiry

// Store without expiry
this.storage.set('theme', 'dark', 0); // Never expires
```

### Retrieving Data

```typescript
// Get with type safety
const user = this.storage.get<User>('user');
// Returns: User | null (null if expired or not found)

// Check if exists (and not expired)
if (this.storage.has('token')) {
  const token = this.storage.get<string>('token');
}

// Get all keys
const keys = this.storage.keys(); // ['user', 'token', ...]
```

### Removing Data

```typescript
// Remove specific key
this.storage.remove('token');

// Clear all (respects prefix if configured)
this.storage.clear();

// Clean expired items manually
this.storage.cleanExpired();
```

---

## 🏗️ Real-World Examples

### Example 1: Authentication Service

**Problem Solved:** Tokens expire automatically, no stale auth state

```typescript
import { Injectable, inject } from '@angular/core';
import { StorageService } from '@angular-storage-expiry/storage-expiry';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);
  
  login(accessToken: string, refreshToken: string) {
    // Access token: short-lived for security
    this.storage.set('accessToken', accessToken, 15); // 15 min
    
    // Refresh token: longer for seamless UX
    this.storage.set('refreshToken', refreshToken, 7 * 24 * 60); // 7 days
  }
  
  getAccessToken(): string | null {
    const token = this.storage.get<string>('accessToken');
    
    // If expired, try to refresh
    if (!token) {
      this.refreshToken();
      return this.storage.get<string>('accessToken');
    }
    
    return token;
  }
  
  private refreshToken() {
    const refreshToken = this.storage.get<string>('refreshToken');
    if (refreshToken) {
      // Call API to get new access token
      // User stays logged in seamlessly
    } else {
      // Both expired, redirect to login
      this.router.navigate(['/login']);
    }
  }
  
  logout() {
    this.storage.remove('accessToken');
    this.storage.remove('refreshToken');
  }
  
  isAuthenticated(): boolean {
    return this.storage.has('accessToken');
  }
}
```

**User Experience:**
- ✅ User stays logged in seamlessly (token refresh)
- ✅ Automatic logout when session expires
- ✅ No confusing "logged in but can't access" states

---

### Example 2: Shopping Cart

**Problem Solved:** Cart expires after reasonable time, prevents stale data

```typescript
import { Injectable, inject } from '@angular/core';
import { StorageService } from '@angular-storage-expiry/storage-expiry';

interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private storage = inject(StorageService);
  
  saveCart(items: CartItem[]) {
    // Cart expires in 7 days
    this.storage.set('cart', items, 7 * 24 * 60);
  }
  
  getCart(): CartItem[] {
    const cart = this.storage.get<CartItem[]>('cart');
    return cart || []; // Return empty array if expired
  }
  
  addItem(item: CartItem) {
    const cart = this.getCart();
    cart.push(item);
    this.saveCart(cart);
  }
  
  clearCart() {
    this.storage.remove('cart');
  }
}
```

**User Experience:**
- ✅ Cart persists across sessions
- ✅ Expires after 7 days (prevents stale data)
- ✅ User can continue shopping seamlessly

---

### Example 3: User Preferences

**Problem Solved:** Preferences persist, no expiry needed

```typescript
import { Injectable, inject } from '@angular/core';
import { StorageService } from '@angular-storage-expiry/storage-expiry';

@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private storage = inject(StorageService);
  
  saveTheme(theme: 'light' | 'dark') {
    // No expiry for user preferences
    this.storage.set('theme', theme, 0);
  }
  
  getTheme(): 'light' | 'dark' {
    return this.storage.get<'light' | 'dark'>('theme') || 'light';
  }
  
  saveLanguage(lang: string) {
    this.storage.set('language', lang, 0);
  }
  
  getLanguage(): string {
    return this.storage.get<string>('language') || 'en';
  }
}
```

**User Experience:**
- ✅ Preferences persist forever
- ✅ User doesn't have to reconfigure
- ✅ Smooth, personalized experience

---

## ⚙️ Configuration Options

```typescript
interface StorageConfig {
  /**
   * Prefix for all storage keys
   * Useful for namespacing in multi-app scenarios
   * @default ''
   * @example 'myApp_' → keys become 'myApp_user', 'myApp_token'
   */
  prefix?: string;

  /**
   * Default expiry time in minutes
   * Applied when set() is called without expiry parameter
   * @default undefined (no expiry)
   * @example 60 → items expire after 1 hour by default
   */
  defaultExpiry?: number;

  /**
   * Storage type to use
   * @default 'local'
   * @example 'session' → uses sessionStorage instead
   */
  storageType?: 'local' | 'session';
}
```

### Configuration Examples

```typescript
// E-commerce app: prefix + default expiry
provideStorage({
  prefix: 'shop_',
  defaultExpiry: 120 // 2 hours default
})

// Multi-tenant app: different prefixes
provideStorage({
  prefix: `tenant_${tenantId}_`,
  defaultExpiry: 60
})

// Session-only app
provideStorage({
  storageType: 'session',
  defaultExpiry: 30
})
```

---

## 🛡️ SSR Safety (Angular Universal)

The service automatically handles server-side rendering:

```typescript
// On server: returns null safely, no crashes
const user = this.storage.get<User>('user'); // null

// On browser: works normally
const user = this.storage.get<User>('user'); // User | null

// No platform checks needed!
// Works with Angular Universal out of the box
```

**Benefits:**
- ✅ SEO works perfectly
- ✅ Fast initial page load
- ✅ No server crashes
- ✅ Works with Vercel, Netlify, etc.

---

## ⚠️ Security Best Practices

### ❌ NEVER Store These

**This library is NOT for sensitive credentials:**

- ❌ Passwords or PINs
- ❌ Credit card numbers / CVV
- ❌ OTP / verification codes
- ❌ Government identity numbers
- ❌ Bank account details

### ✅ Safe to Store

- ✅ Access tokens (with short expiry)
- ✅ Refresh tokens (with longer expiry)
- ✅ User profile data (non-sensitive)
- ✅ UI preferences (theme, language)
- ✅ Cart items, filters, UI state
- ✅ Session flags

### 🔐 Correct Authentication Pattern

```typescript
// ❌ WRONG - Never do this
storage.set('password', password, 60); // NEVER!

// ✅ CORRECT - Token-based auth
storage.set('accessToken', token, 15); // 15 minutes
storage.set('refreshToken', refreshToken, 7 * 24 * 60); // 7 days
```

**Remember:** localStorage is a cache, not a secure vault.

---

## 📋 What Should Expire? (Data Guide)

| Data Type | Example | Expiry | Why |
|-----------|---------|--------|-----|
| **Access Token** | JWT token | 15-60 min | Security, can be refreshed |
| **User Profile** | Name, ID, role | 1-24 hours | Can be refetched from API |
| **Cart Items** | Product IDs | 1-7 days | Can be rebuilt from backend |
| **Theme** | dark/light | None | User preference, should persist |
| **Language** | en, hi | None | User preference, should persist |
| **Form Drafts** | Unsaved edits | None | User work, should not expire |

---

## 🔧 API Reference

### `StorageService`

#### `set<T>(key: string, value: T, expiryMinutes?: number): void`

Store a value with optional expiry.

```typescript
storage.set('user', userData, 60); // 60 minutes
storage.set('token', token); // Uses defaultExpiry
storage.set('theme', 'dark', 0); // No expiry
```

#### `get<T>(key: string): T | null`

Retrieve a value. Returns `null` if not found or expired.

```typescript
const user = storage.get<User>('user'); // User | null
```

- Automatically removes expired items
- Type-safe with generics
- Never throws errors

#### `has(key: string): boolean`

Check if a key exists and is not expired.

```typescript
if (storage.has('token')) {
  // Token exists and is valid
}
```

#### `remove(key: string): void`

Remove a specific key.

```typescript
storage.remove('token');
```

#### `clear(): void`

Clear all storage items (respects prefix if configured).

```typescript
storage.clear(); // Removes all items with prefix
```

#### `keys(): string[]`

Get all storage keys (with prefix stripped if configured).

```typescript
const keys = storage.keys(); // ['user', 'token', ...]
```

#### `cleanExpired(): void`

Manually clean all expired items.

```typescript
storage.cleanExpired(); // Removes all expired items
```

---

## 🧪 Testing

Easy to mock in tests:

```typescript
import { StorageService } from '@angular-storage-expiry/storage-expiry';

describe('MyComponent', () => {
  let storageService: jasmine.SpyObj<StorageService>;
  
  beforeEach(() => {
    storageService = jasmine.createSpyObj('StorageService', ['get', 'set']);
    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: storageService }
      ]
    });
  });
  
  it('should load user from storage', () => {
    storageService.get.and.returnValue({ id: 1, name: 'John' });
    // Test your component
  });
});
```

---

## 🔄 Migration from Raw localStorage

### Before (Problems)

```typescript
// ❌ No expiry
localStorage.setItem('user', JSON.stringify(user));

// ❌ Manual parsing, error-prone
const user = JSON.parse(localStorage.getItem('user') || '{}');

// ❌ No type safety
// ❌ Crashes on SSR
// ❌ Repeated everywhere
```

### After (Solutions)

```typescript
// ✅ Automatic expiry
storage.set('user', user, 60);

// ✅ Safe, type-safe retrieval
const user = storage.get<User>('user');

// ✅ Type safety
// ✅ SSR safe
// ✅ Centralized service
```

---

## 📊 Bundle Size

- **Minified**: ~2KB
- **Gzipped**: ~1KB
- **Zero dependencies** (only Angular core)
- **Tree-shakeable**

---

## 🌟 Features

- ✅ **Automatic Expiry** - TTL support with auto-cleanup
- ✅ **SSR Safe** - Works with Angular Universal
- ✅ **Type Safe** - Full TypeScript generics
- ✅ **Dual Support** - NgModule & Standalone
- ✅ **Error Handling** - Safe JSON parsing
- ✅ **Prefix Support** - Namespace your keys
- ✅ **Session Storage** - Optional sessionStorage support
- ✅ **Auto Cleanup** - Expired items removed automatically
- ✅ **Tree Shakeable** - No unused code

---

## 🤝 Comparison with Other Packages

| Feature | This Package | ngx-webstorage | angular-2-local-storage |
|---------|-------------|----------------|------------------------|
| Standalone Support | ✅ | ❌ | ❌ |
| Built-in Expiry | ✅ | ❌ | ❌ |
| SSR Safe | ✅ | ⚠️ | ❌ |
| Type Safety | ✅ | ⚠️ | ⚠️ |
| Bundle Size | ✅ Small | ⚠️ Medium | ⚠️ Medium |
| Maintenance | ✅ Active | ⚠️ Slow | ❌ Deprecated |

---

## 📄 License

MIT

---

## 🙏 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📮 Support

For issues and feature requests, please use the [GitHub Issues](https://github.com/yourusername/angular-storage-expiry/issues) page.

---

**Made with ❤️ for the Angular community**
