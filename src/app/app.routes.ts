import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { Signup } from './components/signup/signup';
import { LandingPage } from './components/landing-page/landing-page';

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
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
