// src/app/app.config.ts
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Use Zone.js based change detection (standard approach)
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router configuration
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withViewTransitions()
    ),

    // HttpClient configuration with fetch for better performance
    provideHttpClient(withFetch(), withInterceptorsFromDi()),
  ],
};
