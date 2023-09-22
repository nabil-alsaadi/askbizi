import { Injectable } from '@angular/core';
import {
  Auth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  User,
  UserCredential
} from '@angular/fire/auth';
import { BehaviorSubject, from, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentUser$ = new BehaviorSubject<User | null>(null);

  constructor(private auth: Auth) {
    const currentUserData = localStorage.getItem('currentUser');
    let currentUser: User | null = null;
    if (currentUserData) {
      try {
        currentUser = JSON.parse(currentUserData);
      } catch (e) {
        currentUser = null;
        localStorage.removeItem('currentUser');
      }
    }

    this.currentUser$.next(currentUser);

    onAuthStateChanged(this.auth, this.currentUser$);

    this.currentUser$.subscribe((user) => {
      if (user) localStorage.setItem('currentUser', JSON.stringify(user));
      else localStorage.removeItem('currentUser');
    });
  }

  hasClaim(claim: string): Observable<boolean> {
    console.log('this.auth.currentUser')
    if (!this.auth.currentUser) return of(false);
    return from(this.auth.currentUser.getIdTokenResult()).pipe(
      map((idTokenResult) => {
        console.log('idTokenResult?.claims',idTokenResult?.claims)
        if (!!idTokenResult?.claims[claim]) {
          return true;
        }
        return false;
      })
    );
  }

  signInWithEmailAndPassword(
    email: string,
    password: string
  ): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout() {
    localStorage.removeItem('currentUser');
    return this.auth.signOut();
  }
}
