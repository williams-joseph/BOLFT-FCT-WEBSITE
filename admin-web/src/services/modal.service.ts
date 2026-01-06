import { Injectable, signal } from '@angular/core';

export type ModalType = 'success' | 'error' | 'info' | 'warning' | 'danger';

export interface ModalState {
    isOpen: boolean;
    title: string;
    message: string;
    type: ModalType;
    showCancel?: boolean;
    confirmLabel?: string;
    cancelLabel?: string;
    resolve?: (value: boolean) => void;
}

/**
 * ModalService
 * 
 * Manages the global application modal state for displaying messages 
 * (success, error, info, warning, danger) and handling confirmations.
 */
@Injectable({
    providedIn: 'root'
})
export class ModalService {
    /** Reactive signal to hold the current modal state */
    readonly modalState = signal<ModalState>({
        isOpen: false,
        title: '',
        message: '',
        type: 'info'
    });

    constructor() { }

    /**
     * Shows an error modal with a red visual theme.
     */
    showError(message: string, title: string = 'Error') {
        this.openModal(title, message, 'error');
    }

    /**
     * Shows a success modal with a green visual theme.
     */
    showSuccess(message: string, title: string = 'Success') {
        this.openModal(title, message, 'success');
    }

    /**
     * Shows an informational modal with a blue visual theme.
     */
    showInfo(message: string, title: string = 'Information') {
        this.openModal(title, message, 'info');
    }

    /**
     * Shows a confirmation modal and returns a promise resolving to true or false.
     */
    confirm(message: string, title: string = 'Confirm Action', type: ModalType = 'warning', confirmLabel: string = 'Confirm', cancelLabel: string = 'Cancel'): Promise<boolean> {
        return new Promise((resolve) => {
            this.modalState.set({
                isOpen: true,
                title,
                message,
                type,
                showCancel: true,
                confirmLabel,
                cancelLabel,
                resolve
            });
        });
    }

    /**
     * Closes the currently active modal.
     */
    close(result: boolean = false) {
        const state = this.modalState();
        if (state.resolve) {
            state.resolve(result);
        }
        this.modalState.update(state => ({ ...state, isOpen: false, resolve: undefined }));
    }

    /**
     * Helper method to update the modal signal with new state.
     */
    private openModal(title: string, message: string, type: ModalType) {
        this.modalState.set({
            isOpen: true,
            title,
            message,
            type,
            showCancel: false,
            confirmLabel: 'Close'
        });
    }
}
