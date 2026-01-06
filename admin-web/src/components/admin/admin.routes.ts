import { Routes } from '@angular/router';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardComponent, title: 'Admin Dashboard' },
      { path: 'sermons', loadComponent: () => import('./sermons/sermon-manager.component').then(m => m.SermonManagerComponent), title: 'Manage Sermons' },
      { path: 'testimonies', loadComponent: () => import('./testimonies/testimony-manager.component').then(m => m.TestimonyManagerComponent), title: 'Manage Testimonies' },
      { path: 'messages', loadComponent: () => import('./messages/message-manager.component').then(m => m.MessageManagerComponent), title: 'Manage Messages' },
    ]
  }
];
