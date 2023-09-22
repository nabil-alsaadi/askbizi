import {
  addDoc,
  collectionChanges,
  collectionData,
  CollectionReference,
  deleteDoc,
  doc,
  docData,
  DocumentChange,
  DocumentReference,
  Firestore,
  getDoc,
  getDocFromCache,
  getDocs,
  increment,
  PartialWithFieldValue,
  query,
  QueryConstraint,
  QueryDocumentSnapshot,
  serverTimestamp,
  setDoc,
  UpdateData,
  updateDoc,
  WithFieldValue,
  WriteBatch,
  writeBatch
} from '@angular/fire/firestore';
import { defer, from, map, Observable, of, switchMap } from 'rxjs';
import { FirebaseEntity } from '../interfaces/common/firebase-entity.interface';
import { AuthService } from '../modules/auth/auth.service';

export interface FirestoreQueryOptions {
  source?: 'cache' | 'server';
  orderBy?: string;
  orderByDirection?: 'asc' | 'desc';
  limit?: number;
  cacheMaxLife?: number;
}

export abstract class FirestoreService<T extends FirebaseEntity> {
  protected abstract firestore: Firestore;
  protected abstract collectionRef: CollectionReference<Partial<T>>;
  protected abstract authService: AuthService;
  protected globalConstraints: QueryConstraint[] = [];

  getDocumentRef(documentId: string) {
    return doc(
      this.firestore,
      `${this.collectionRef.id}/${documentId}`
    ) as DocumentReference<Partial<T>>;
  }

  data(...constraints: QueryConstraint[]): Observable<Partial<T>[]> {
    const q = query(
      this.collectionRef,
      ...this.globalConstraints,
      ...constraints
    );
    return collectionData<Partial<T>>(q, { idField: 'uid' });
  }

  dataSnapshot(): Observable<Partial<T>[]> {
    const q = query(this.collectionRef, ...this.globalConstraints);
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        return snapshot.docs.map((doc) => {
          return { ...doc.data(), uid: doc.id } as Partial<T>;
        });
      })
    );
  }

  startDoc?: QueryDocumentSnapshot<Partial<T>>;
  lastDoc?: QueryDocumentSnapshot<Partial<T>>;

  query(...constraints: QueryConstraint[]) {
    const q = query(
      this.collectionRef,
      ...this.globalConstraints,
      ...constraints
    );
    return from(getDocs(q)).pipe(
      map((snapshot) => {
        this.startDoc = snapshot.docs[0];
        this.lastDoc = snapshot.docs[snapshot.docs.length - 1];
        return snapshot.docs.map((doc) => {
          return { ...doc.data(), uid: doc.id } as Partial<T>;
        });
      })
    );
  }

  changes(): Observable<DocumentChange<Partial<T>>[]> {
    return collectionChanges(this.collectionRef);
  }

  update(uid: string, changes: UpdateData<Partial<T>>) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    changes.version = increment(1);
    changes.modifiedOn = serverTimestamp();
    changes.modifiedBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    const docRef = doc(this.collectionRef, uid);
    return from(updateDoc(docRef, changes));
  }

  mergeUpdate(uid: string, changes: PartialWithFieldValue<T>) {
    if (!this.authService?.currentUser$.value?.uid)
      throw new Error('User not logged in');
    changes.version = increment(1);
    changes.modifiedOn = serverTimestamp();
    changes.modifiedBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    const docRef = doc(this.collectionRef, uid);
    return from(setDoc(docRef, changes, { merge: true }));
  }

  set(uid: string, data: WithFieldValue<Partial<T>>) {
    const docRef = doc(this.collectionRef, uid);
    return from(setDoc(docRef, data));
  }

  setFields(uid: string, changes: PartialWithFieldValue<T>) {
    if (!this.authService?.currentUser$.value?.uid)
      throw new Error('User not logged in');
    changes.version = increment(1);
    changes.modifiedOn = serverTimestamp();
    changes.modifiedBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    const docRef = doc(this.collectionRef, uid);
    return from(setDoc(docRef, changes, { mergeFields: Object.keys(changes) }));
  }

  create(data: WithFieldValue<Partial<T>>,authRequired: boolean = true) {
    if (!this.authService.currentUser$.value?.uid && authRequired)
      throw new Error('User not logged in');
    
    data.createdOn = serverTimestamp();
    if (authRequired) {
      data.createdBy = {
        uid: this.authService.currentUser$?.value?.uid,
        displayName: this.authService.currentUser$?.value?.displayName
      } as any;
    }
    
    return from(addDoc(this.collectionRef, data));
  }

  delete(uid: string) {
    const docRef = doc(this.collectionRef, uid);
    return this.canDelete(docRef).pipe(
      switchMap((canDelete) => {
        if (!canDelete) throw new Error('Delete feature is disabled');
        return from(deleteDoc(docRef));
      })
    );
  }

  canDelete(docRef: DocumentReference) {
    return of(true);
  }

  softDelete(uid: string) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    const changes = {
      deleted: true,
      deletedOn: serverTimestamp(),
      deletedBy: {
        uid: this.authService.currentUser$.value.uid,
        displayName: this.authService.currentUser$.value.displayName
      }
    } as unknown as UpdateData<Partial<T>>;
    const docRef = doc(this.collectionRef, uid);
    return from(updateDoc(docRef, changes));
  }

  getSnap(
    uid: string,
    options?: FirestoreQueryOptions
  ): Observable<Partial<T>> {
    const docRef = doc(this.collectionRef, uid);
    if (options?.source === 'cache') {
      return from(
        getDocFromCache(docRef)
          .catch((error) => {
            return getDoc(docRef);
          })
          .then((doc) => {
            if (!doc.exists()) return undefined as any;
            return { ...doc.data(), uid: doc.id } as Partial<T>;
          })
      );
    }
    return from(
      getDoc(docRef).then((doc) => {
        if (!doc.exists()) return undefined as any;
        return { ...doc.data(), uid: doc.id } as Partial<T>;
      })
    );
  }

  get(uid: string): Observable<Partial<T>> {
    const docRef = doc(this.collectionRef, uid);
    return docData(docRef, { idField: 'uid' });
  }

  createBatch(cb: (batch: WriteBatch) => void) {
    const batch = writeBatch(this.firestore);
    cb(batch);
    return defer(() => batch.commit());
  }

  getTotal() {
    const q = query(this.collectionRef, ...this.globalConstraints);
    return from(
      getDocs(q).then((snapshot) => {
        return snapshot.size;
      })
    );
  }
}
