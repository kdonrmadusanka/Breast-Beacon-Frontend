import { RouterModule, Routes } from '@angular/router';
import { Signup } from './components/signup/signup';
import { LandingPage } from './components/landing-page/landing-page';
import { RadiologistDashboardComponent } from './dashboards/radiologist-dashboard/components/dashboard/dashboard';
import { Verify } from './pages/verify/verify';

export const routes: Routes = [
  {
    path: '',
    component: LandingPage,
    data: { title: 'BreastBeacon - Advanced Medical Imaging Platform' },
  },
  {
    path: 'register',
    component: Signup,
    data: { title: 'Create Account - BreastBeacon' },
  },
  // {
  //   path: 'login',
  //   component: LoginComponent,
  //   data: { title: 'Sign In - BreastBeacon' }
  // },
  {
    path: 'verify-email',
    component: Verify,
    data: { title: 'Verify Email - BreastBeacon' },
  },
  {
    path: 'dashboard',
    component: RadiologistDashboardComponent,
    data: { title: 'Radiologist Dashboard' },
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
