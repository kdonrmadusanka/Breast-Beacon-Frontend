// src/app/components/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService, SignupRequest } from '../../services/auth/auth';

// Role options interface
interface RoleOption {
  value: string;
  label: string;
  description: string;
  requiresMedicalFields: boolean;
}

@Component({
  selector: 'app-signup',
  standalone: true,
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // No HttpClientModule or providers needed here
  ],
  // Remove the providers array completely
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  showMedicalFields = false;
  showPatientFields = false;
  showAdminFields = false;

  // Role options
  roles: RoleOption[] = [
    {
      value: 'patient',
      label: 'Patient',
      description: 'Access your medical records and reports',
      requiresMedicalFields: false,
    },
    {
      value: 'radiologist',
      label: 'Radiologist',
      description: 'Analyze and interpret medical images',
      requiresMedicalFields: true,
    },
    {
      value: 'physician',
      label: 'Physician',
      description: 'Review patient reports and provide consultations',
      requiresMedicalFields: true,
    },
    {
      value: 'technician',
      label: 'Technician',
      description: 'Upload and manage medical images',
      requiresMedicalFields: true,
    },
    {
      value: 'admin',
      label: 'Administrator',
      description: 'Manage system users and settings',
      requiresMedicalFields: false,
    },
  ];

  // Specialization options
  specializations = [
    { value: 'breast-imaging', label: 'Breast Imaging' },
    { value: 'general-radiology', label: 'General Radiology' },
    { value: 'oncology', label: 'Oncology' },
    { value: 'gynecology', label: 'Gynecology' },
  ];

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService) {
    this.signupForm = this.createForm();
  }

  ngOnInit(): void {
    // Watch for role changes to show/hide fields
    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      this.updateFieldVisibility(role);
      this.updateFormValidators(role);
    });
  }

  private updateFieldVisibility(role: string): void {
    // Update all visibility flags
    this.showMedicalFields = ['radiologist', 'physician', 'technician'].includes(role);
    this.showPatientFields = role === 'patient';
    this.showAdminFields = role === 'admin';
  }

  private createForm(): FormGroup {
    return this.fb.group(
      {
        // Basic information
        firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],

        // Role selection
        role: ['patient', [Validators.required]],

        // Medical professional fields
        licenseNumber: [''],
        specialization: [''],
        institution: [''],

        // Patient-specific fields
        dateOfBirth: [''],
        gender: [''],
        phoneNumber: [''],
        address: [''],

        // Admin-specific field
        adminId: [''],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  private updateFormValidators(role: string): void {
    const medicalFields = ['licenseNumber', 'specialization', 'institution'];
    const patientFields = ['dateOfBirth', 'gender', 'phoneNumber', 'address'];
    const adminFields = ['adminId'];

    const isMedicalProfessional = ['radiologist', 'physician', 'technician'].includes(role);

    // Update medical field validators
    medicalFields.forEach((field) => {
      const control = this.signupForm.get(field);
      if (isMedicalProfessional) {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });

    // Update patient field validators
    patientFields.forEach((field) => {
      const control = this.signupForm.get(field);
      if (role === 'patient') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });

    // Update admin field validators
    adminFields.forEach((field) => {
      const control = this.signupForm.get(field);
      if (role === 'admin') {
        control?.setValidators([Validators.required]);
      } else {
        control?.clearValidators();
      }
      control?.updateValueAndValidity();
    });
  }

  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      confirmPassword?.setErrors(null);
    }

    return null;
  }

  get formControls() {
    return this.signupForm.controls;
  }

  getSelectedRoleDescription(): string {
    const selectedRole = this.roles.find(
      (role) => role.value === this.signupForm.get('role')?.value
    );
    return selectedRole?.description || '';
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.markFormGroupTouched();
      console.log('❌ Form invalid, errors:', this.getFormErrors());
      return;
    }

    this.isLoading = true;

    // Prepare data for backend
    const formData = this.signupForm.value;

    // Remove confirmPassword as it's not needed by backend
    const { confirmPassword, ...userData } = formData;

    // Convert date to ISO string if it exists
    if (userData.dateOfBirth) {
      userData.dateOfBirth = new Date(userData.dateOfBirth).toISOString();
    }

    console.log('Sending to backend:', userData);

    // Call the auth service
    this.authService.register(userData as SignupRequest).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Registration successful:', response);

        // Handle successful registration
        if (response.success) {
          // Store token if provided
          if (response.token) {
            localStorage.setItem('authToken', response.token);
          }

          // Show success message
          alert(response.message);

          // Navigate based on verification requirement
          if (response.requiresVerification) {
            this.router.navigate(['/login'], {
              queryParams: { message: 'Please check your email for verification.' },
            });
          } else {
            this.router.navigate(['/login'], {
              queryParams: { message: 'Account created successfully! Please sign in.' },
            });
          }
        }
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Registration failed:', error);

        // Handle different error types
        let errorMessage = 'Registration failed. Please try again.';

        if (error.status === 409) {
          errorMessage = 'Email address is already registered.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid data provided.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        }

        alert(errorMessage);
      },
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  private getFormErrors(): any {
    const errors: any = {};
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      if (control?.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }
}
