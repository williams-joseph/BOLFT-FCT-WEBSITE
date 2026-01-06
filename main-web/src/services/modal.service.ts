import { Injectable, signal } from '@angular/core';

export type ModalType = 'success' | 'error' | 'info' | 'warning';

export interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
}

@Injectable({
    providedIn: 'root'
})
export class ModalService {
    // Signal to hold the modal state
    readonly modalState = signal<ModalState>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    constructor() { }

    /**
     * Show an error modal
     * @param message Error message to display
     * @param title Optional title (default: 'Error')
     */
    showError(message: string, title: string = 'Error') {
        this.openModal(title, message, 'error');
    }

    /**
     * Show a success modal
     * @param message Success message to display
     * @param title Optional title (default: 'Success')
     */
    showSuccess(message: string, title: string = 'Success') {
        this.openModal(title, message, 'success');
    }

    /**
     * Show an info modal
     * @param message Info message to display
     * @param title Optional title (default: 'Information')
     */
    showInfo(message: string, title: string = 'Information') {
        this.openModal(title, message, 'info');
    }

    /**
     * Close the modal
     */
    close() {
        this.modalState.update(state => ({ ...state, isOpen: false }));
    }

    private openModal(title: string, message: string, type: ModalType) {
        this.modalState.set({
            isOpen: true,
            title,
            message,
            type
        });
    }
}
