import { Injectable, inject } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc, query, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface Sermon {
    id?: string;
    title: string;
    preacher: string;
    date: Date | Timestamp;
    description: string;
    youtubeLink?: string;
    googleDriveId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class SermonService {
    private firestore: Firestore = inject(Firestore);
    /** Firestore collection reference for sermons */
    private sermonsCollection = collection(this.firestore, 'sermons');

    /**
     * Retrieves all sermons from Firestore, ordered by date descending.
     * @returns Observable of Sermon array
     */
    getSermons(): Observable<Sermon[]> {
        const q = query(this.sermonsCollection, orderBy('date', 'desc'));
        return collectionData(q, { idField: 'id' }).pipe(
            map(sermons => sermons.map(s => ({
                ...s,
                date: s.date instanceof Timestamp ? s.date.toDate() : s.date
            })))
        ) as Observable<Sermon[]>;
    }

    /**
     * Adds a new sermon document to Firestore.
     * Converts Date object to Firestore Timestamp.
     */
    addSermon(sermon: Omit<Sermon, 'id'>) {
        return addDoc(this.sermonsCollection, {
            ...sermon,
            date: Timestamp.fromDate(sermon.date as Date)
        });
    }

    /**
     * Updates an existing sermon document in Firestore.
     */
    updateSermon(id: string, sermon: Partial<Sermon>) {
        const docRef = doc(this.firestore, 'sermons', id);
        const updateData: any = { ...sermon };
        if (sermon.date instanceof Date) {
            updateData.date = Timestamp.fromDate(sermon.date);
        }
        return updateDoc(docRef, updateData);
    }

    /**
     * Deletes a sermon document from Firestore by its ID.
     */
    deleteSermon(id: string) {
        const docRef = doc(this.firestore, 'sermons', id);
        return deleteDoc(docRef);
    }
}
