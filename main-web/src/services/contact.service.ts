import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, serverTimestamp } from '@angular/fire/firestore';

export interface ContactMessage {
    name: string;
    phoneNumber: string;
    message: string;
}

@Injectable({
    providedIn: 'root'
})
export class ContactService {
    private firestore: Firestore = inject(Firestore);
    private contactMessagesCollection = collection(this.firestore, 'contact_messages');

    saveContactMessage(message: ContactMessage): Promise<void> {
        return addDoc(this.contactMessagesCollection, {
            ...message,
            read: false,
            timestamp: serverTimestamp()
        }).then(() => { });
    }
}
