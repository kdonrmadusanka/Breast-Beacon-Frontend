// src/app/services/scroll.service.ts
import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class Scroll {
  constructor(@Inject(DOCUMENT) private document: Document) {}

  scrollToElement(elementId: string, offset?: number): void {
    console.log('🔄 Scroll service called for:', elementId);

    // Wait for the next tick to ensure DOM is updated
    setTimeout(() => {
      const element = this.document.getElementById(elementId);
      console.log('🔍 Element found:', element);

      if (element) {
        console.log('✅ Element exists, scrolling to:', elementId);

        // Calculate the offset (navbar height)
        const nav = this.document.querySelector('nav');
        const navHeight = nav ? nav.clientHeight : 80;
        const calculatedOffset = offset ?? navHeight;

        console.log('📏 Nav height:', navHeight, 'Using offset:', calculatedOffset);

        // Get the element's position
        const elementRect = element.getBoundingClientRect();
        const elementPosition = elementRect.top + window.pageYOffset;
        const offsetPosition = elementPosition - calculatedOffset;

        console.log('📍 Element position:', elementPosition, 'Offset position:', offsetPosition);

        // Scroll to the element
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
        });

        console.log('🎯 Scrolling completed');
      } else {
        console.error('❌ Element not found:', elementId);
        console.log('🔍 Available elements with IDs:');
        const allElements = this.document.querySelectorAll('[id]');
        allElements.forEach((el) => {
          console.log(' -', el.id, el.tagName);
        });
      }
    }, 50);
  }

  scrollToTop(): void {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }
}
