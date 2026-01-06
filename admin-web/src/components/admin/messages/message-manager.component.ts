import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../../services/contact.service';
import { ModalService } from '../../../services/modal.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  standalone: true,
  selector: 'app-message-manager',
  imports: [CommonModule, FormsModule, DatePipe],
  template: `
    <div class="space-y-8">
      <!-- Page Header -->
      <div class="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h2 class="text-2xl font-bold text-slate-900">Contact Messages</h2>
          <p class="text-slate-500 mt-1">Review and manage inquiries from the website.</p>
        </div>
        <div class="flex items-center space-x-4">
          <div class="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200">
            <span class="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2">Total</span>
            <span class="text-lg font-black text-slate-900">{{ messages().length }}</span>
          </div>
          @if (unreadCount() > 0) {
            <div class="bg-amber-50 px-4 py-2 rounded-xl border border-amber-100">
              <span class="text-xs font-bold text-amber-500 uppercase tracking-widest mr-2">Unread</span>
              <span class="text-lg font-black text-amber-600">{{ unreadCount() }}</span>
            </div>
          }
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4">
        <div class="relative flex-1">
          <svg class="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input 
            type="text" 
            [(ngModel)]="searchTerm"
            placeholder="Search by name, phone or message..." 
            class="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-slate-900 transition-all"
          >
        </div>
      </div>

      <!-- Messages Table -->
      <div class="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-slate-50 border-b border-slate-200">
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Sender</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Message Snippet</th>
              <th class="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            @for (msg of filteredMessages(); track msg.id) {
              <tr class="group hover:bg-slate-50/50 transition-colors">
                <td class="px-6 py-4">
                  @if (!msg.read) {
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-600 uppercase tracking-tighter">New</span>
                  } @else {
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-400 uppercase tracking-tighter">Read</span>
                  }
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm font-medium text-slate-500 italic">{{ msg.timestamp?.toDate() | date:'dd MMM, yyyy' }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="font-bold text-slate-900">{{ msg.name }}</div>
                  <div class="text-xs text-slate-400 font-medium">{{ msg.phoneNumber }}</div>
                </td>
                <td class="px-6 py-4 max-w-xs transition-all">
                  <p class="text-sm text-slate-600 line-clamp-1 hover:line-clamp-none transition-all cursor-pointer hover:text-slate-900 font-medium" (click)="viewMessage(msg)">
                    {{ msg.message }}
                  </p>
                </td>
                <td class="px-6 py-4 text-right">
                  <div class="flex justify-end space-x-2">
                    <button (click)="deleteMessage(msg)" class="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg border border-transparent hover:border-rose-100 transition-all shadow-sm">
                      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-4v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="px-6 py-20 text-center">
                  <div class="flex flex-col items-center">
                    <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4">
                      <svg class="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                      </svg>
                    </div>
                    <p class="text-slate-400 font-bold uppercase tracking-widest text-xs">No messages found</p>
                  </div>
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>

      <!-- Quick Review Modal -->
      @if (selectedMessage()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div class="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 scale-in-center">
            <div class="p-8 border-b border-slate-100 flex justify-between items-start">
              <div>
                <h3 class="text-2xl font-black text-slate-900 tracking-tight">{{ selectedMessage()?.name }}</h3>
                <p class="text-slate-500 font-medium">{{ selectedMessage()?.phoneNumber }}</p>
                <p class="text-xs text-slate-400 mt-1 italic">{{ selectedMessage()?.timestamp?.toDate() | date:'fullDate' }}</p>
              </div>
              <button (click)="closeMessage()" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <svg class="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="p-8 bg-slate-50">
              <div class="prose max-w-none">
                <p class="text-slate-600 text-lg leading-relaxed italic whitespace-pre-wrap">
                  "{{ selectedMessage()?.message }}"
                </p>
              </div>
            </div>
            <div class="p-6 flex justify-center border-t border-slate-100 bg-white">
              <button (click)="closeMessage()" class="px-10 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all">Close Inquiry</button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class MessageManagerComponent {
  private contactService = inject(ContactService);
  private modalService = inject(ModalService);

  private readonly messagesList$ = this.contactService.getMessages();
  messages = toSignal(this.messagesList$, { initialValue: [] });

  searchTerm = signal('');
  selectedMessage = signal<ContactMessage | null>(null);

  unreadCount = computed(() => this.messages().filter(m => !m.read).length);

  filteredMessages = computed(() => {
    const list = this.messages();
    const term = this.searchTerm().toLowerCase().trim();

    if (!term) return list.slice(0, 50);

    return list.filter(m =>
      m.name.toLowerCase().includes(term) ||
      m.phoneNumber.includes(term) ||
      m.message.toLowerCase().includes(term)
    ).slice(0, 50);
  });

  async viewMessage(msg: ContactMessage) {
    this.selectedMessage.set(msg);
    if (!msg.read && msg.id) {
      await this.contactService.markAsRead(msg.id);
    }
  }

  closeMessage() {
    this.selectedMessage.set(null);
  }

  async deleteMessage(msg: ContactMessage) {
    if (!msg.id) return;

    const confirmed = await this.modalService.confirm(
      'Are you sure you want to delete this inquiry? This action cannot be undone.',
      'Delete Message?',
      'danger',
      'Delete'
    );

    if (confirmed) {
      try {
        await this.contactService.deleteMessage(msg.id);
        this.modalService.showSuccess('Deleted', 'Message has been removed.');
      } catch (error) {
        this.modalService.showError('Error', 'Failed to delete message.');
      }
    }
  }
}
