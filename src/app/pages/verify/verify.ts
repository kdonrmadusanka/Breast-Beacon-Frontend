import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth/auth';

@Component({
  selector: 'app-verify',
  imports: [],
  templateUrl: './verify.html',
  styleUrl: './verify.css',
})
export class Verify implements OnInit {
  isLoading = true;
  isVerified = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.verifyEmail();
  }

  verifyEmail(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.errorMessage = 'Invalid verification link';
      this.isLoading = false;
      return;
    }

    // Simulate API call to verify email
    setTimeout(() => {
      this.authService.verifyEmail(token).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.isVerified = true;

          // Show success alert and wait for user to click OK
          setTimeout(() => {
            alert('Email verification successful! You can now sign in.');

            // Redirect to login after user clicks OK
            this.router.navigate(['/login'], {
              queryParams: {
                message: 'Email verified successfully! You can now sign in.',
              },
            });
          }, 100); // Small delay to ensure the UI updates first
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = error.error?.message || 'Verification failed. Please try again.';
        },
      });
    }, 3000); // Simulate 3 second delay // Simulate 3 second delay
  }

  resendVerification(): void {
    const email = this.route.snapshot.queryParamMap.get('email');

    if (email) {
      this.authService.resendVerificationEmail(email).subscribe({
        next: (response) => {
          alert('Verification email sent! Please check your inbox.');
        },
        error: (error) => {
          alert('Failed to resend verification email. Please try again.');
        },
      });
    } else {
      alert('Please sign in again to resend verification email.');
    }
  }
}
