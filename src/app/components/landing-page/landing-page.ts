import { Component, HostListener } from '@angular/core';
import { Scroll } from '../../services/scroll';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService } from '../../services/contact/contact';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css',
})
export class LandingPage {
  constructor(
    private scroll: Scroll,
    private router: Router,
    private contactService: ContactService
  ) {}

  isMobileMenuOpen = false;

  // Contact form properties
  contactForm = {
    firstName: '',
    lastName: '',
    email: '',
    institution: '',
    role: '',
    message: '',
  };

  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  debugNavigation(path: string): void {
    console.log('🔄 Navigation clicked, path:', path);
    console.log('🔄 Current routes:', this.router.config);

    this.router
      .navigate([path])
      .then((success) => {
        console.log('✅ Navigation result:', success);
        if (!success) {
          console.error('❌ Navigation failed');
        }
      })
      .catch((error) => {
        console.error('❌ Navigation error:', error);
      });

    this.closeMobileMenu();
  }

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
    console.log('🎯 scrollToSection called with:', sectionId);

    // Add a small delay to ensure the DOM is ready
    setTimeout(() => {
      this.scroll.scrollToElement(sectionId);
    }, 100);

    this.closeMobileMenu();
  }

  // ✅ FIXED: Remove leading slash
  navigation(path: string): void {
    console.log('Navigating to:', path);
    console.log('Full routes:', this.router.config);

    this.router
      .navigate([path])
      .then((success) => {
        console.log('Navigation successful:', success);
      })
      .catch((error) => {
        console.error('Navigation failed:', error);
      });

    this.closeMobileMenu();
  }

  // Contact form methods
  onSubmitContactForm(): void {
    console.log('Contact form submitted:', this.contactForm);

    // Basic validation
    if (
      !this.contactForm.firstName ||
      !this.contactForm.lastName ||
      !this.contactForm.email ||
      !this.contactForm.message
    ) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    if (!this.isValidEmail(this.contactForm.email)) {
      this.submitError = 'Please enter a valid email address.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = '';

    this.contactService.submitContactForm(this.contactForm).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        this.submitSuccess = true;
        console.log('Contact form submitted successfully:', response);

        // Reset form
        this.resetContactForm();

        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      },
      error: (error) => {
        this.isSubmitting = false;
        this.submitError = error.error?.message || 'Failed to send message. Please try again.';
        console.error('Contact form error:', error);
      },
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private resetContactForm(): void {
    this.contactForm = {
      firstName: '',
      lastName: '',
      email: '',
      institution: '',
      role: '',
      message: '',
    };
  }

  // Method to scroll to contact section
  scrollToContact(): void {
    this.scrollToSection('contact');
  }
}
