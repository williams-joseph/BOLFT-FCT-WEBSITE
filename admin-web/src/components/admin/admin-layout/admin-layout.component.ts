import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';

interface NavigationItem {
  label: string;
  path: string;
}

/**
 * AdminLayoutComponent
 * 
 * Provides the main layout for the administrative interface, including the header, 
 * navigation links, and a router outlet for sub-pages.
 */
@Component({
  standalone: true,
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
})
export class AdminLayoutComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  /** 
   * Navigation links displayed in the admin header.
   * "Manage Sermons" tab was removed as its functions are integrated into the primary sermons page.
   */
  readonly navigationItems: NavigationItem[] = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Upload Sermon', path: '/admin/sermons' },
    { label: 'Testimonies', path: '/admin/testimonies' },
    { label: 'Messages', path: '/admin/messages' },
  ];

  /**
   * Logs out the current admin and redirects to the login page.
   */
  async logout() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Logout error:', error);
      this.router.navigate(['/login']);
    }
  }
}
