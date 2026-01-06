import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, query, orderBy, Timestamp } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

/**
 * Sermon Interface
 * Represents a sermon record with its associated metadata and media links.
 */
export interface Sermon {
    /** Unique document ID from Firestore */
    id?: string;
    /** Title of the sermon message */
    title: string;
    /** Name of the person who delivered the message */
    preacher: string;
    /** Date the sermon was preached */
    date: Date | Timestamp;
    /** brief description or summary of the sermon content */
    description: string;
    /** Link to the YouTube video of the sermon */
    youtubeLink?: string;
    /** Google Drive file ID for direct audio download */
    googleDriveId?: string;
}

/**
 * SermonService
 * Provides methods for retrieving sermon data from Firebase Firestore.
 */
@Injectable({
    providedIn: 'root'
})
export class SermonService {
    private firestore: Firestore = inject(Firestore);
    /** Firestore collection reference for sermons */
    private sermonsCollection = collection(this.firestore, 'sermons');

    /**
     * Retrieves all sermons from Firestore, ordered by date descending.
     * Converts Firestore Timestamps to standard JS Date objects.
     * @returns Observable of Sermon array
     */
    getSermons(): Observable<Sermon[]> {
        const q = query(this.sermonsCollection, orderBy('date', 'desc'));
        return (collectionData(q, { idField: 'id' }) as Observable<any[]>).pipe(
            map(sermons => sermons.map(s => ({
                ...s,
                date: s.date instanceof Timestamp ? s.date.toDate() : s.date
            })))
        ) as Observable<Sermon[]>;
    }
}
