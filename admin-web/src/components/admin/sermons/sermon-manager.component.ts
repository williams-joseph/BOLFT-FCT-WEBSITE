import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SermonService, Sermon } from '../../../services/sermon.service';
import { ModalService } from '../../../services/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';

/**
 * SermonManagerComponent
 * 
 * Main administrative interface for managing sermons.
 * Provides functionality to:
 * - View a list of existing sermons
 * - Add new sermons with title, preacher, date, description, YouTube link, and Google Drive audio ID
 * - Edit existing sermon records
 * - Delete sermons from Firestore
 */
@Component({
  standalone: true,
  selector: 'app-sermon-manager',
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
<div class="space-y-8">

    <!-- Page Header -->
    <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
            <h2 class="text-2xl font-bold text-slate-900">Manage Sermons</h2>
            <p class="text-slate-500 mt-1">Upload and manage church sermon recordings.</p>
        </div>
        <button (click)="isAdding.set(!isAdding()); editingId.set(null)"
            class="inline-flex items-center px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-md group">
            <svg class="w-5 h-5 mr-2 transition-transform group-hover:rotate-90" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
            </svg>
            {{ isAdding() ? 'Cancel' : 'Upload Sermon' }}
        </button>
    </div>

    <!-- Add/Edit Form Overlay/Section -->
    @if (isAdding()) {
    <div class="bg-white p-8 rounded-2xl shadow-xl border border-slate-200 animate-in fade-in zoom-in duration-300">
        <div class="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <h3 class="text-xl font-bold text-slate-800">{{ editingId() ? 'Edit Sermon Details' : 'Upload New Sermon' }}
            </h3>
            <button (click)="resetForm()" class="text-slate-400 hover:text-slate-600">
                <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Sermon Title</label>
                <input [(ngModel)]="sermonForm().title" type="text" placeholder="e.g. The Power of Grace"
                    class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
            </div>
            <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Preacher</label>
                <input [(ngModel)]="sermonForm().preacher" type="text" placeholder="Pastor's name"
                    class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
            </div>
            <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Date Preached</label>
                <input [(ngModel)]="sermonForm().date" type="date"
                    class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
            </div>
            <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">YouTube Video
                    Link</label>
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xs uppercase bg-slate-100 px-3 rounded-l-xl border-r border-slate-200">
                        URL</div>
                    <input [(ngModel)]="sermonForm().youtubeLink" type="text"
                        placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
                        class="w-full pl-20 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
                </div>
            </div>
            <div class="space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Google Drive ID
                    (Audio)</label>
                <div class="relative">
                    <div
                        class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 font-bold text-xs uppercase bg-slate-100 px-3 rounded-l-xl border-r border-slate-200">
                        GD</div>
                    <input [(ngModel)]="sermonForm().googleDriveId" type="text" placeholder="1G_Xyz..."
                        class="w-full pl-16 pr-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium">
                </div>
            </div>
            <div class="md:col-span-2 space-y-2">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest">Sermon
                    Description</label>
                <textarea [(ngModel)]="sermonForm().description" rows="4" placeholder="Brief summary of the sermon..."
                    class="w-full px-5 py-3.5 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-slate-900 focus:bg-white outline-none transition-all font-medium resize-none"></textarea>
            </div>
        </div>

        <div class="mt-10 flex space-x-4">
            <button (click)="saveSermon()"
                class="px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 hover:shadow-lg transition-all transform active:scale-95 shadow-md">
                {{ editingId() ? 'Update Sermon' : 'Save & Publish' }}
            </button>
            <button (click)="resetForm()"
                class="px-10 py-4 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-all">
                Discard Changes
            </button>
        </div>
    </div>
    }

    <!-- Sermons List / Table -->
    <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div class="p-6 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h3 class="font-bold text-slate-900">Sermon Archive</h3>
            <div
                class="flex items-center text-xs font-bold text-slate-400 uppercase tracking-widest bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                Total: {{ filteredSermons().length }}
            </div>
        </div>

        <!-- Search Bar -->
        <div class="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center gap-4">
          <div class="relative flex-grow max-w-md group">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-slate-900 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              [ngModel]="searchTerm()"
              (ngModelChange)="searchTerm.set($event)"
              type="text" 
              placeholder="Search by title or preacher..." 
              class="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-slate-900 outline-none transition-all text-sm font-medium">
          </div>
          @if (searchTerm()) {
            <button (click)="searchTerm.set('')" class="text-xs font-bold text-slate-400 hover:text-slate-600 uppercase tracking-widest">Clear Search</button>
          }
        </div>

        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-100">
                        <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                            Sermon Info</th>
                        <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                            Preacher</th>
                        <th class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10">
                            Date</th>
                        <th
                            class="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50/10 text-right">
                            Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-50">
                    @for (sermon of filteredSermons(); track sermon.id) {
                    <tr class="hover:bg-slate-50/50 transition-colors group">
                        <td class="px-8 py-6">
                            <div class="flex items-center space-x-4">
                                <div
                                    class="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 shadow-inner group-hover:bg-white group-hover:shadow-sm transition-all">
                                    <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                        <circle cx="12" cy="12" r="9" stroke-width="2" />
                                    </svg>
                                </div>
                                <div>
                                    <div class="font-bold text-slate-900 group-hover:text-slate-950 transition-colors">
                                        {{ sermon.title }}</div>
                                    <div
                                        class="text-[11px] font-bold text-slate-400 uppercase tracking-tighter mt-1 truncate max-w-[200px]">
                                        {{ sermon.description }}</div>
                                </div>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <div class="flex items-center space-x-2">
                                <span class="w-2 h-2 rounded-full bg-slate-900"></span>
                                <span class="font-semibold text-slate-700 text-sm">{{ sermon.preacher }}</span>
                            </div>
                        </td>
                        <td class="px-8 py-6">
                            <div
                                class="font-mono text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 inline-block">
                                {{ sermon.date | date:'yyyy-MM-dd' }}
                            </div>
                        </td>
                        <td class="px-8 py-6 text-right">
                            <div
                                class="flex justify-end space-x-3 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 transition-transform">
                                <button (click)="editSermon(sermon)"
                                    class="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-xl shadow-sm border border-transparent hover:border-slate-200 transition-all shadow-slate-200">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </button>
                                <button (click)="deleteSermon(sermon.id!)"
                                    class="p-2.5 text-red-300 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
                                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </td>
                    </tr>
                    } @empty {
                    <tr>
                        <td colspan="4" class="px-8 py-16 text-center">
                            <div class="flex flex-col items-center">
                                <svg class="w-12 h-12 text-slate-200 mb-4" fill="none" viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                </svg>
                                <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No sermons found
                                    in archive</p>
                            </div>
                        </td>
                    </tr>
                    }
                </tbody>
            </table>
        </div>
    </div>
</div>
  `,
})
export class SermonManagerComponent {
  private sermonService = inject(SermonService);
  private modalService = inject(ModalService);

  /** Reactive signal for the sermons list */
  private readonly sermonsList$ = this.sermonService.getSermons();
  readonly sermons = toSignal(this.sermonsList$, { initialValue: [] });

  /** Management State - toggles the visibility of the add/edit form */
  readonly isAdding = signal(false);

  /** Stores the ID of the sermon currently being edited, or null if adding new */
  readonly editingId = signal<string | null>(null);

  /** Search criteria */
  readonly searchTerm = signal('');

  /** Filtered list of sermons */
  readonly filteredSermons = computed(() => {
    const list = this.sermons();
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return list.slice(0, 50);

    return list.filter(s =>
      s.title.toLowerCase().includes(term) ||
      s.preacher.toLowerCase().includes(term) ||
      s.description.toLowerCase().includes(term)
    ).slice(0, 50);
  });

  /** Reactive form state for sermon entry */
  readonly sermonForm = signal({
    title: '',
    preacher: '',
    date: '',
    youtubeLink: '',
    googleDriveId: '',
    description: ''
  });

  constructor() {
    this.resetForm();
  }

  /**
   * Resets the form fields to their default empty/initial states.
   */
  resetForm() {
    this.sermonForm.set({
      title: '',
      preacher: '',
      date: new Date().toISOString().split('T')[0],
      youtubeLink: '',
      googleDriveId: '',
      description: ''
    });
    this.isAdding.set(false);
    this.editingId.set(null);
  }

  /**
   * Saves the current form data to Firestore.
   * Performs an update if editingId is set, otherwise adds a new sermon.
   */
  async saveSermon() {
    const data = this.sermonForm();

    // Extract ID if a full link was provided
    const driveId = this.extractDriveId(data.googleDriveId);

    const sermonData: Omit<Sermon, 'id'> = {
      title: data.title,
      preacher: data.preacher,
      date: new Date(data.date),
      description: data.description,
      youtubeLink: data.youtubeLink,
      googleDriveId: driveId
    };

    try {
      if (this.editingId()) {
        await this.sermonService.updateSermon(this.editingId()!, sermonData);
        this.modalService.showSuccess('Sermon updated successfully');
      } else {
        await this.sermonService.addSermon(sermonData);
        this.modalService.showSuccess('Sermon added successfully');
      }
      this.resetForm();
    } catch (error) {
      console.error('Error saving sermon:', error);
      this.modalService.showError('Could not save sermon. Please check your connection.');
    }
  }

  /**
   * Extracts the Google Drive file ID from various link formats or returns the input if already an ID.
   */
  private extractDriveId(input: string): string {
    if (!input) return '';

    // Pattern for Google Drive file IDs in links
    // Handles /file/d/[ID]/view, ?id=[ID], etc.
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /[?&]id=([a-zA-Z0-9_-]+)/,
      /drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/
    ];

    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    // If no pattern matches, assume it's already an ID or a direct string
    return input.trim();
  }

  /**
   * Pre-populates the form with data from an existing sermon for editing.
   */
  editSermon(sermon: Sermon) {
    this.sermonForm.set({
      title: sermon.title,
      preacher: sermon.preacher,
      date: new Date(sermon.date as any).toISOString().split('T')[0],
      youtubeLink: sermon.youtubeLink || '',
      googleDriveId: sermon.googleDriveId || '',
      description: sermon.description || ''
    });
    this.editingId.set(sermon.id!);
    this.isAdding.set(true);
  }

  /**
   * Deletes a sermon record after user confirmation.
   */
  async deleteSermon(id: string) {
    const confirmed = await this.modalService.confirm(
      'Are you sure you want to remove this sermon from the database? This cannot be undone.',
      'Delete Sermon',
      'danger',
      'Delete Permanently'
    );

    if (confirmed) {
      try {
        await this.sermonService.deleteSermon(id);
        this.modalService.showSuccess('Sermon deleted successfully');
      } catch (error) {
        console.error('Error deleting sermon:', error);
        this.modalService.showError('Failed to delete sermon.');
      }
    }
  }

  /**
   * Cancels the current add/edit operation and resets the form.
   */
  cancelEdit() {
    this.resetForm();
  }
}
