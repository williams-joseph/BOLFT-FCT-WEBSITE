import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (modalState().isOpen) {
      <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <!-- Backdrop -->
        <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" aria-hidden="true" (click)="handleCancel()"></div>

          <!-- Centering trick -->
          <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

          <!-- Modal Panel -->
          <div class="relative inline-block align-bottom bg-white rounded-3xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full border border-slate-100 animate-in zoom-in-95 duration-300">
            <div class="bg-white px-6 pt-8 pb-6 sm:p-10 sm:pb-8">
              <div class="sm:flex sm:items-start text-center sm:text-left">
                
                <!-- Icon -->
                <div class="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-2xl mb-6 sm:mb-0 sm:mx-0 sm:h-12 sm:w-12 transition-colors duration-500"
                  [ngClass]="{
                    'bg-red-50 text-red-600': modalState().type === 'error',
                    'bg-green-50 text-green-600': modalState().type === 'success',
                    'bg-blue-50 text-blue-600': modalState().type === 'info',
                    'bg-amber-50 text-amber-600': modalState().type === 'warning',
                    'bg-red-600 text-white shadow-lg shadow-red-200': modalState().type === 'danger'
                  }">
                  
                  @if (modalState().type === 'error' || modalState().type === 'danger') {
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  } @else if (modalState().type === 'success') {
                    <svg class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                  } @else if (modalState().type === 'warning') {
                     <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  } @else {
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                </div>

                <!-- Content -->
                <div class="sm:ml-6 w-full">
                  <h3 class="text-2xl font-black text-slate-900 tracking-tight" id="modal-title">
                    {{ modalState().title }}
                  </h3>
                  <div class="mt-3">
                    <p class="text-slate-500 font-medium leading-relaxed whitespace-pre-wrap">
                      {{ modalState().message }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="bg-slate-50/50 px-6 py-5 sm:px-10 sm:flex sm:flex-row-reverse gap-3 border-t border-slate-50">
              <button type="button" 
                class="w-full inline-flex justify-center items-center px-8 py-3 rounded-2xl text-base font-black transition-all duration-300 shadow-lg hover:-translate-y-0.5"
                [ngClass]="{
                  'bg-red-600 hover:bg-red-700 text-white shadow-red-200': modalState().type === 'error' || modalState().type === 'danger',
                  'bg-green-600 hover:bg-green-700 text-white shadow-green-200': modalState().type === 'success',
                  'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200': modalState().type === 'info',
                  'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-200': modalState().type === 'warning'
                }"
                (click)="handleConfirm()">
                {{ modalState().confirmLabel || 'OK' }}
              </button>
              
              @if (modalState().showCancel) {
                <button type="button" 
                  class="mt-3 sm:mt-0 w-full inline-flex justify-center items-center px-8 py-3 rounded-2xl text-base font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-all duration-300"
                  (click)="handleCancel()">
                  {{ modalState().cancelLabel || 'Cancel' }}
                </button>
              }
            </div>
          </div>
        </div>
      </div>
    }
  `
})
export class ModalComponent {
  private modalService = inject(ModalService);

  // Expose the signal directly to the template
  modalState = this.modalService.modalState;

  handleConfirm() {
    this.modalService.close(true);
  }

  handleCancel() {
    this.modalService.close(false);
  }
}
