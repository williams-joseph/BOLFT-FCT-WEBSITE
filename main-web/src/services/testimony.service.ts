import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

/**
 * Testimony Interface
 * Represents a member's testimony displayed on the public site.
 */
export interface Testimony {
    id?: string;
    name: string;
    content: string;
    imageUrl?: string;
    dateAdded: any; // Timestamp
}

/**
 * TestimonyService
 * Provides public access to testimonies stored in Firestore.
 */
@Injectable({
    providedIn: 'root'
})
export class TestimonyService {
    private firestore: Firestore = inject(Firestore);
    private testimoniesCollection = collection(this.firestore, 'testimonies');

    /**
     * Streams all testimonies fetched from Firestore, ordered by date.
     */
    getTestimonies(): Observable<Testimony[]> {
        const q = query(this.testimoniesCollection, orderBy('dateAdded', 'desc'));
        return collectionData(q, { idField: 'id' }) as Observable<Testimony[]>;
    }
}
