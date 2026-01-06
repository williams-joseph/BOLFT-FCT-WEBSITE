import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * AdminDashboardComponent
 * 
 * Central hub for church administrators. Provides quick access 
 * to primary management tasks like sermons and testimonies.
 */
@Component({
  standalone: true,
  selector: 'app-admin-dashboard',
  template: `
    <div class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-24 h-24 bg-slate-900 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-slate-200">
        <img src="assets/logo.jpg" alt="Logo" class="w-full h-full object-cover rounded-3xl">
      </div>
      
      <h2 class="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tight">Welcome, Admin</h2>
      <p class="text-slate-500 max-w-md mx-auto mb-12 font-medium leading-relaxed">
        Manage your church content efficiently. Use the quick actions below to update sermons or testimonies.
      </p>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <a routerLink="/admin/sermons" 
           class="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-slate-900 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 text-left">
          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <circle cx="12" cy="12" r="9" stroke-width="2" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-1">Manage Sermons</h3>
          <p class="text-sm text-slate-400 font-medium">Upload, edit, or remove sermon recordings.</p>
        </a>

        <a routerLink="/admin/testimonies" 
           class="group p-8 bg-white border border-slate-200 rounded-3xl hover:border-slate-900 hover:shadow-xl hover:shadow-slate-100 transition-all duration-300 text-left">
          <div class="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-slate-900 group-hover:text-white transition-colors">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 class="text-xl font-bold text-slate-900 mb-1">Testimonies</h3>
          <p class="text-sm text-slate-400 font-medium">Review and publish congregational testimonies.</p>
        </a>
      </div>
      
      <div class="mt-20 pt-10 border-t border-slate-100 w-full max-w-xs">
         <p class="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Authorized Access Only</p>
      </div>

    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, CommonModule]
})
export class AdminDashboardComponent { }
