import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./components/admin/login/login.component').then(m => m.LoginComponent),
    title: 'Admin Login'
  },
  {
    path: 'admin',
    loadChildren: () => import('./components/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    title: 'Admin'
  },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
