import { Injectable } from '@angular/core';
import { collection, collectionData, CollectionReference, Firestore, query, QueryConstraint } from '@angular/fire/firestore';
import { AuthService, FirestoreService } from 'ng-soapy-lib';
import { map } from 'rxjs';
import { BusinessService } from 'soapy-types';


@Injectable()
export class BusinessSetupService extends FirestoreService<BusinessService> {
  collectionRef: CollectionReference<Partial<BusinessService>>;
  constructor(
    protected firestore: Firestore,
    protected authService: AuthService
  ) {
    super();
    this.collectionRef = collection(this.firestore, 'businessSetup');
  }

  override data(...constraints: QueryConstraint[]) {
    const q = query(
      this.collectionRef,
      ...this.globalConstraints,
      ...constraints
    );
    return collectionData(q, { idField: 'uid' }).pipe(
      map((docs) => 
      docs
      .sort((a,b) => (a.order ?? 0) - (b.order ?? 0)))
      //sort((a, b) => b.createdOn - a.createdOn))
    );
  }
}