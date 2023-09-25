import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { environment } from 'enviorment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { AngularFirestore, AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { NewClaimComponent } from './components/new-claim/new-claim.component';
import { HomeComponent } from './components/home/home.component';
import { ComingSoonComponent } from './components/coming-soon/coming-soon.component';
import { BusinessSetupService } from './components/home/services/business-setup.service';
import { enableMultiTabIndexedDbPersistence, getFirestore, provideFirestore } from '@angular/fire/firestore';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { AuthModule } from 'ng-soapy-lib';
import { BusinessServicesService } from './components/home/services/business-services.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InquiriesService } from './components/home/services/inquiries-service.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ContactService } from './components/home/services/contact-service.service';
import { PrivacyComponent } from './components/privacy/privacy.component';
let resolvePersistenceEnabled: (enabled: boolean) => void;
export const persistenceEnabled = new Promise<boolean>((resolve) => {
  resolvePersistenceEnabled = resolve;
});

@NgModule({
  declarations: [
    AppComponent,
    NewClaimComponent,
    HomeComponent,
    ComingSoonComponent,
    PrivacyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatStepperModule,
    MatIconModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatCheckboxModule,
    // AngularFireModule.initializeApp(environment.firebase),
    provideAuth(() => {
      const auth = getAuth();
      return auth;
    }),
    provideFirebaseApp(() =>
      initializeApp(
        Object.assign(environment.firebase, {
          projectId: environment.firebase.projectId
        })
      )
    ),
    provideFirestore(() => {
      const firestore = getFirestore();
      enableMultiTabIndexedDbPersistence(firestore).then(
        () => resolvePersistenceEnabled(true),
        () => resolvePersistenceEnabled(false)
      );
      return firestore;
    }),
    provideStorage(() => {
      const storage = getStorage();
      return storage;
    }),
    // provideFunctions(() => {
    //   const functions = getFunctions();
    //   return functions;
    // }),
    AuthModule.forRoot(() => {
      return environment.functionsApiRoot;
    }),
    // AngularFireAuthModule,
    // AngularFirestoreModule,
    // AngularFireStorageModule,
    // AngularFireDatabaseModule,
  ],
  providers: [BusinessSetupService,BusinessServicesService,InquiriesService,ContactService],
  bootstrap: [AppComponent]
})
export class AppModule { }
// function resolvePersistenceEnabled(arg0: boolean): any {
//   throw new Error('Function not implemented.');
// }

// function provideFunctions(arg0: () => any): any[] | import("@angular/core").Type<any> | import("@angular/core").ModuleWithProviders<{}> {
//   throw new Error('Function not implemented.');
// }

// function getFunctions() {
//   throw new Error('Function not implemented.');
// }

