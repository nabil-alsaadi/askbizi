import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore, query, QueryConstraint } from '@angular/fire/firestore';
import { AuthService, FirestoreService } from 'ng-soapy-lib';
import { map } from 'rxjs';
import { BusinessService } from 'soapy-types';


@Injectable()
export class ContactService extends FirestoreService<BusinessService> {
  collectionRef: CollectionReference<Partial<BusinessService>>;
  constructor(
    protected firestore: Firestore,
    protected authService: AuthService
  ) {
    super();
    this.collectionRef = collection(this.firestore, 'contact');
  }
}