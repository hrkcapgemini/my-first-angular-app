import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full',
  },
  {
    path: 'signup',
    loadComponent: () => import('./feature/signup/signup.component').then((m) => m.SignupComponent),
  },
  {
    path: 'login',
    loadComponent: () => import('./feature/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./feature/home/home.component').then((m) => m.HomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'about',
    loadComponent: () => import('./feature/about/about.component').then((m) => m.AboutComponent),
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    loadComponent: () => import('./feature/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./feature/settings/settings.component').then((m) => m.SettingsComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    loadComponent: () => import('./feature/page-not-found-component/page-not-found-component').then((m) => m.PageNotFoundComponent),
  },
];
