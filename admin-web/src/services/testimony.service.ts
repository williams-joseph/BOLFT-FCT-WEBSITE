import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, query, orderBy, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';
import { Observable } from 'rxjs';

/**
 * Testimony Interface
 * Represents a member's testimony, including content and an optional image.
 */
export interface Testimony {
    /** Unique document ID from Firestore */
    id?: string;
    /** Submitter's name */
    name: string;
    /** The testimony text */
    content: string;
    /** Optional URL to a hosted photo */
    imageUrl?: string;
    /** Firestore Timestamp of when the testimony was added */
    dateAdded: any;
}

/**
 * TestimonyService
 * Handles CRUD operations for church testimonies and supports file uploads to Firebase Storage.
 */
@Injectable({
    providedIn: 'root'
})
export class TestimonyService {
    private firestore: Firestore = inject(Firestore);
    private storage: Storage = inject(Storage);
    private testimoniesCollection = collection(this.firestore, 'testimonies');

    /**
     * Streams all testimonies from Firestore ordered by date.
     */
    getTestimonies(): Observable<Testimony[]> {
        const q = query(this.testimoniesCollection, orderBy('dateAdded', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Testimony[]>;
    }

    /**
     * Uploads an optional image to Firebase Storage and saves the testimony document to Firestore.
     */
    async addTestimony(testimony: Testimony, file?: File) {
        if (file) {
            const storageRef = ref(this.storage, `testimonies/${file.name}`);
            await uploadBytes(storageRef, file);
            testimony.imageUrl = await getDownloadURL(storageRef);
        }
        return addDoc(this.testimoniesCollection, testimony);
    }

    /**
     * Updates an existing testimony document.
     */
    async updateTestimony(id: string, testimony: Testimony, file?: File) {
        if (file) {
            const storageRef = ref(this.storage, `testimonies/${file.name}`);
            await uploadBytes(storageRef, file);
            testimony.imageUrl = await getDownloadURL(storageRef);
        }
        const docRef = doc(this.firestore, `testimonies/${id}`);
        return updateDoc(docRef, testimony as any);
    }

    /**
     * Deletes a testimony document.
     */
    async deleteTestimony(id: string) {
        const docRef = doc(this.firestore, `testimonies/${id}`);
        return deleteDoc(docRef);
    }
}
