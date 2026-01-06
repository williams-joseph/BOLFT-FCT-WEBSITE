import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TestimonyService, Testimony } from '../../../services/testimony.service';
import { Observable } from 'rxjs';
import { Timestamp } from '@angular/fire/firestore';
import { ModalService } from '../../../services/modal.service';
import { signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * TestimonyManagerComponent
 * 
 * Administrative interface for managing church testimonies.
 * Features:
 * - List view of all uploaded testimonies
 * - Add form for new testimonies (name, content, and optional photo)
 * - Modal view for reading full testimony content
 */
@Component({
  standalone: true,
  selector: 'app-testimony-manager',
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Manage Testimonies</h2>
          <p class="text-slate-500 mt-1">Review and publish stories of God's faithfulness.</p>
        </div>
        <button (click)="toggleAdd()"
          class="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md group">
          <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
          </svg>
          {{ isAdding() ? 'Cancel' : 'Add New Testimony' }}
        </button>
      </div>

      <!-- Add/Edit Form Section -->
      @if (isAdding()) {
      <div class="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-300">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
          <h3 class="text-xl font-bold text-slate-800">{{ editingId() ? 'Edit Testimony Details' : 'Compose New Testimony' }}</h3>
          <button (click)="resetForm()" class="text-slate-400 hover:text-slate-600">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Member Name</label>
            <input [(ngModel)]="name" type="text" placeholder="e.g. John Doe"
              class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
          </div>
          <div class="space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Member Photo (Optional)</label>
            <input type="file" (change)="onFileSelected($event)" 
              class="w-full px-5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-black file:bg-slate-900 file:text-white hover:file:bg-slate-800">
          </div>
          <div class="md:col-span-2 space-y-2">
            <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Testimony Content</label>
            <textarea [(ngModel)]="content" rows="6" placeholder="Be descriptive about the miracle..."
              class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium resize-none"></textarea>
          </div>
        </div>

        <div class="mt-10 flex space-x-4">
          <button (click)="saveTestimony()"
            class="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all transform active:scale-95 shadow-md">
            {{ editingId() ? 'Update Testimony' : 'Save & Publish' }}
          </button>
          <button (click)="resetForm()"
            class="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
            Discard Changes
          </button>
        </div>
      </div>
      }

      <!-- Testimonies Archive Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
          <h3 class="font-bold text-slate-900">Testimony Archive</h3>
          <div class="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
            Total Records: {{ filteredTestimonies().length }}
          </div>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div class="relative flex-grow max-w-md group">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              [(ngModel)]="searchTerm"
              (ngModelChange)="searchTerm.set($event)"
              type="text" 
              placeholder="Search by name or content..." 
              class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-medium">
          </div>
          @if (searchTerm()) {
            <button (click)="searchTerm.set('')" class="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Clear</button>
          }
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-slate-100">
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">Member</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">Snippet</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">Date</th>
                <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-50">
              @for (t of filteredTestimonies(); track t.id) {
              <tr class="hover:bg-slate-50/50 transition-colors group">
                <td class="px-8 py-6">
                  <div class="flex items-center space-x-4">
                    <div class="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 overflow-hidden shadow-inner group-hover:bg-white group-hover:shadow-sm transition-all">
                      @if (t.imageUrl) {
                        <img [src]="t.imageUrl" class="w-full h-full object-cover">
                      } @else {
                        <span class="font-bold">{{ t.name.charAt(0) }}</span>
                      }
                    </div>
                    <span class="font-bold text-slate-900">{{ t.name }}</span>
                  </div>
                </td>
                <td class="px-8 py-6">
                  <p class="text-[13px] text-slate-500 italic line-clamp-2 max-w-md leading-relaxed">
                    "{{ t.content }}"
                  </p>
                </td>
                <td class="px-8 py-6">
                  <div class="font-mono text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                    {{ t.dateAdded?.toDate() | date:'yyyy-MM-dd' }}
                  </div>
                </td>
                <td class="px-8 py-6 text-right">
                  <div class="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                    <button (click)="openDetailModal(t)" class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button (click)="editTestimony(t)" class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                    <button (click)="deleteTestimony(t.id!)" class="p-2.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
              } @empty {
              <tr>
                <td colspan="4" class="px-8 py-20 text-center">
                  <div class="flex flex-col items-center">
                    <svg class="w-16 h-16 text-slate-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No testimonies found in archive</p>
                  </div>
                </td>
              </tr>
              }
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detail View Modal (Simple overlay for content review) -->
      @if (selectedTestimony) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div (click)="closeModal()" class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300"></div>
        <div class="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
          <div class="p-8 sm:p-12">
            <div class="flex justify-between items-start mb-8">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-800 font-bold">
                  {{ selectedTestimony.name.charAt(0) }}
                </div>
                <div>
                  <h3 class="text-2xl font-black text-slate-900">{{ selectedTestimony.name }}</h3>
                  <p class="text-slate-400 text-xs font-bold uppercase tracking-widest">{{ selectedTestimony.dateAdded?.toDate() | date:'longDate' }}</p>
                </div>
              </div>
              <button (click)="closeModal()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="prose max-w-none">
              <p class="text-slate-600 text-lg leading-relaxed italic whitespace-pre-wrap">
                "{{ selectedTestimony.content }}"
              </p>
            </div>
          </div>
          <div class="bg-slate-50 p-6 flex justify-center border-t border-slate-100">
             <button (click)="closeModal()" class="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">Close Review</button>
          </div>
        </div>
      </div>
      }
    </div>
  `
})
export class TestimonyManagerComponent {
  private testimonyService = inject(TestimonyService);
  private modalService = inject(ModalService);

  /** Reactive signal containing the list of testimonies */
  private readonly testimoniesList$ = this.testimonyService.getTestimonies();
  testimonies = toSignal(this.testimoniesList$, { initialValue: [] });

  name = '';
  content = '';
  selectedFile: File | null = null;
  selectedTestimony: Testimony | null = null;

  isAdding = signal(false);
  editingId = signal<string | null>(null);

  /** Search filter signal */
  searchTerm = signal('');

  /** Filtered list of testimonies based on search term */
  filteredTestimonies = computed(() => {
    const list = this.testimonies();
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return list.slice(0, 50);

    return list.filter(t =>
      t.name.toLowerCase().includes(term) ||
      t.content.toLowerCase().includes(term)
    ).slice(0, 50);
  });

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  toggleAdd() {
    if (this.isAdding()) {
      this.resetForm();
    } else {
      this.isAdding.set(true);
      this.editingId.set(null);
    }
  }

  async saveTestimony() {
    if (!this.name.trim() || !this.content.trim()) {
      this.modalService.showError('Please fill in both the member name and the testimony content.');
      return;
    }

    const testimonyData: Testimony = {
      name: this.name.trim(),
      content: this.content.trim(),
      dateAdded: Timestamp.now()
    };

    try {
      if (this.editingId()) {
        await this.testimonyService.updateTestimony(this.editingId()!, testimonyData, this.selectedFile || undefined);
        this.modalService.showSuccess('Testimony updated successfully');
      } else {
        await this.testimonyService.addTestimony(testimonyData, this.selectedFile || undefined);
        this.modalService.showSuccess('New testimony has been published successfully');
      }
      this.resetForm();
    } catch (e) {
      console.error('Error saving testimony:', e);
      this.modalService.showError('An error occurred while saving. Please try again.');
    }
  }

  resetForm() {
    this.name = '';
    this.content = '';
    this.selectedFile = null;
    this.isAdding.set(false);
    this.editingId.set(null);
  }

  editTestimony(t: Testimony) {
    this.name = t.name;
    this.content = t.content;
    this.editingId.set(t.id!);
    this.isAdding.set(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async deleteTestimony(id: string) {
    const confirmed = await this.modalService.confirm(
      'Are you sure you want to permanently delete this testimony? This action cannot be undone.',
      'Delete Testimony',
      'danger',
      'Delete Permanently'
    );

    if (confirmed) {
      try {
        await this.testimonyService.deleteTestimony(id);
        this.modalService.showSuccess('Testimony removed from database');
      } catch (error) {
        console.error('Error deleting testimony:', error);
        this.modalService.showError('Failed to delete record.');
      }
    }
  }

  openDetailModal(t: Testimony) {
    this.selectedTestimony = t;
  }

  closeModal() {
    this.selectedTestimony = null;
  }
}
