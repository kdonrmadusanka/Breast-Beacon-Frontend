// src/app/services/scroll.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Scroll {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  scrollToElement(elementId: string, offset?: number): void {
    const element = document.getElementById(elementId);
    if (element) {
      // Calculate nav height dynamically if offset not provided
      const nav = this.document.querySelector('nav');
      const calculatedOffset = offset ?? (nav ? nav.offsetHeight : 80);

      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = elementPosition - calculatedOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
