import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStorage } from '@angular-storage-expiry/storage-expiry';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStorage({
      prefix: 'demo_',
      defaultExpiry: 5 // 5 minutes default expiry
    })
  ]
};
