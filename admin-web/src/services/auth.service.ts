import { Injectable, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, signOut, user, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';

/**
 * AuthService
 * 
 * Manages administrative authentication using Firebase Auth and Google Sign-In.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private auth: Auth = inject(Auth);
    /** Observable stream of the currently logged-in user */
    user$: Observable<User | null> = user(this.auth);

    constructor() { }

    /**
     * Initiates the Google Sign-In popup flow.
     * Throws an error if the sign-in is unsuccessful.
     */
    async loginWithGoogle() {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(this.auth, provider);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    }

    /**
     * Signs the user out of the application.
     */
    async logout() {
        await signOut(this.auth);
    }
}
