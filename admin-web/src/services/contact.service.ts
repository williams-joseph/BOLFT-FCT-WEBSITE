import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, doc, deleteDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * ContactMessage Interface
 * Represents a message received via the website contact form.
 */
export interface ContactMessage {
    id?: string;
    name: string;
    phoneNumber: string;
    message: string;
    read: boolean;
    timestamp: any;
}

/**
 * ContactService
 * Handles administrative operations for contact messages, including retrieval and management.
 */
@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private firestore: Firestore = inject(Firestore);
    private contactMessagesCollection = collection(this.firestore, 'contact_messages');

    /**
     * Streams all contact messages from Firestore ordered by timestamp.
     */
    getMessages(): Observable<ContactMessage[]> {
        const q = query(this.contactMessagesCollection, orderBy('timestamp', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<ContactMessage[]>;
    }

    /**
     * Marks a message as read.
     */
    async markAsRead(id: string) {
        const docRef = doc(this.firestore, `contact_messages/${id}`);
        return updateDoc(docRef, { read: true });
    }

    /**
     * Deletes a contact message.
     */
    async deleteMessage(id: string) {
        const docRef = doc(this.firestore, `contact_messages/${id}`);
        return deleteDoc(docRef);
    }
}
