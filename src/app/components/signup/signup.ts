// src/app/components/signup/signup.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

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
    ReactiveFormsModule, // ✅ Add this here
  ],
})
export class Signup implements OnInit {
  signupForm: FormGroup;
  isLoading = false;
  showMedicalFields = false;

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.createForm();
  }

  ngOnInit(): void {
    // Watch for role changes to show/hide medical fields
    this.signupForm.get('role')?.valueChanges.subscribe((role) => {
      const selectedRole = this.roles.find((r) => r.value === role);
      this.showMedicalFields = selectedRole?.requiresMedicalFields || false;

      // Update validators based on role
      this.updateFormValidators(role);
    });
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

        // Medical professional fields (conditionally required)
        licenseNumber: [''],
        specialization: [''],
        institution: [''],

        // Patient-specific fields
        dateOfBirth: [''],
        gender: [''],
        phoneNumber: [''],
        address: [''],

        // Admin-specific fields
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
      return;
    }

    this.isLoading = true;

    // Here you would call your authentication service
    console.log('Form submitted:', this.signupForm.value);

    // Simulate API call
    setTimeout(() => {
      this.isLoading = false;
      // Navigate to verification or login page
      this.router.navigate(['/login']);
    }, 2000);
  }

  private markFormGroupTouched(): void {
    Object.keys(this.signupForm.controls).forEach((key) => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
    });
  }

  navigateToLogin(): void {
    // this.router.navigate(['/login']);
  }
}
