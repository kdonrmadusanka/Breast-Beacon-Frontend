import { Component, HostListener } from '@angular/core';
import { Scroll } from '../../services/scroll';

@Component({
  selector: 'app-landing-page',
  imports: [],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  constructor(private scroll: Scroll) {}

  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Update aria-expanded attribute for accessibility
    const menuButton = document.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement;
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', this.isMobileMenuOpen.toString());
    }
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;

    // Update aria-expanded attribute
    const menuButton = document.querySelector('[aria-controls="mobile-menu"]') as HTMLButtonElement;
    if (menuButton) {
      menuButton.setAttribute('aria-expanded', 'false');
    }
  }

  // Close mobile menu when clicking outside
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const menu = document.getElementById('mobile-menu');
    const menuButton = document.querySelector('[aria-controls="mobile-menu"]');

    if (menu && menuButton && !menu.contains(target) && !menuButton.contains(target)) {
      this.closeMobileMenu();
    }
  }

  // Close mobile menu on escape key
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    this.closeMobileMenu();
  }

  // Close mobile menu on window resize (if resizing to desktop)
  @HostListener('window:resize')
  onWindowResize(): void {
    if (window.innerWidth >= 768) {
      // md breakpoint
      this.closeMobileMenu();
    }
  }

  scrollToSection(sectionId: string): void {
    this.scroll.scrollToElement(sectionId);
  }
}
