import {
  addDoc,
  collection,
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
import { defer, from, map, Observable } from 'rxjs';
import { FirebaseEntity } from '../interfaces/common/firebase-entity.interface';
import { AuthService } from '../modules/auth/auth.service';

export abstract class FirestoreSubCollectionService<T extends FirebaseEntity> {
  protected abstract firestore: Firestore;
  protected abstract authService: AuthService;
  // use [parentID] in the path to specify the parent collection id location
  protected abstract parentCollectionPath: string;
  protected abstract subCollectionPath: string;

  getCollectionRef(parentId: string) {
    return collection(
      this.firestore,
      `${this.parentCollectionPath}/${parentId}/${this.subCollectionPath}`
    ) as CollectionReference<Partial<T>>;
  }

  getDocumentRef(parentId: string, documentId: string) {
    return doc(
      this.firestore,
      `${this.parentCollectionPath}/${parentId}/${this.subCollectionPath}/${documentId}`
    ) as DocumentReference<Partial<T>>;
  }

  data(
    parentId: string,
    ...constraints: QueryConstraint[]
  ): Observable<Partial<T>[]> {
    const q = query(this.getCollectionRef(parentId), ...constraints);
    return collectionData<Partial<T>>(q, {
      idField: 'uid'
    });
  }

  dataSnapshot(parentId: string): Observable<Partial<T>[]> {
    return from(
      getDocs(this.getCollectionRef(parentId)).then((snapshot) => {
        return snapshot.docs.map((doc) => {
          return { ...doc.data(), uid: doc.id } as Partial<T>;
        });
      })
    );
  }

  startDoc?: QueryDocumentSnapshot<Partial<T>>;
  lastDoc?: QueryDocumentSnapshot<Partial<T>>;

  query(parentId: string, ...constraints: QueryConstraint[]) {
    const q = query(this.getCollectionRef(parentId), ...constraints);
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

  changes(parentId: string): Observable<DocumentChange<Partial<T>>[]> {
    return collectionChanges<Partial<T>>(this.getCollectionRef(parentId));
  }

  update(parentId: string, uid: string, changes: UpdateData<Partial<T>>) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    changes.version = increment(1);
    changes.modifiedOn = serverTimestamp();
    changes.modifiedBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(updateDoc(docRef, changes));
  }

  mergeUpdate(
    parentId: string,
    uid: string,
    changes: PartialWithFieldValue<Partial<T>>
  ) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    changes.version = increment(1);
    changes.modifiedOn = serverTimestamp();
    changes.modifiedBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(
      setDoc(docRef, changes, {
        merge: true
      })
    );
  }

  set(parentId: string, uid: string, data: WithFieldValue<Partial<T>>) {
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(setDoc(docRef, data));
  }

  create(parentId: string, data: WithFieldValue<Partial<T>>) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    data.createdOn = serverTimestamp();
    data.createdBy = {
      uid: this.authService.currentUser$.value.uid,
      displayName: this.authService.currentUser$.value.displayName
    } as any;
    return from(addDoc(this.getCollectionRef(parentId), data));
  }

  delete(parentId: string, uid: string) {
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(deleteDoc(docRef));
  }

  softDelete(parentId: string, uid: string) {
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
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(updateDoc(docRef, changes));
  }

  recover(parentId: string, uid: string) {
    if (!this.authService.currentUser$.value?.uid)
      throw new Error('User not logged in');
    const changes = {
      deleted: false,
      recoveredOn: serverTimestamp(),
      recoveredBy: {
        uid: this.authService.currentUser$.value.uid,
        displayName: this.authService.currentUser$.value.displayName
      }
    } as any;
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(updateDoc(docRef, changes));
  }

  getSnap(parentId: string, uid: string): Observable<Partial<T>> {
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return from(
      getDoc(docRef).then((doc) => {
        if (!doc.exists()) return undefined as any;
        return { ...doc.data(), uid: doc.id } as Partial<T>;
      })
    );
  }

  get(parentId: string, uid: string): Observable<Partial<T>> {
    const docRef = doc(this.getCollectionRef(parentId), uid);
    return docData(docRef, { idField: 'uid' });
  }

  batchUpdate(parentId: string, changes: UpdateData<Partial<T>>[]) {
    const batch = writeBatch(this.firestore);
    changes.forEach((change) => {
      const docRef = doc(this.getCollectionRef(parentId), change.uid as string);
      batch.update(docRef, change);
    });
    return from(batch.commit());
  }

  createBatch(cb: (batch: WriteBatch) => void) {
    const batch = writeBatch(this.firestore);
    cb(batch);
    return defer(() => batch.commit());
  }

  getTotal(parentId: string, constraints?: QueryConstraint[]) {
    const q = constraints
      ? query(this.getCollectionRef(parentId), ...constraints)
      : query(this.getCollectionRef(parentId));
    return from(
      getDocs(q).then((snapshot) => {
        return snapshot.size;
      })
    );
  }
}
