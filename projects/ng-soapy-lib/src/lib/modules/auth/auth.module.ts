import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { FUNCTIONS_ENDPOINT } from '../../functions-endpoint';
import {
  RedirectAuthenticatedToDashboard,
  RedirectUnauthenticatedToLogin
} from './auth-guards';
import { AuthService } from './auth.service';
import { FirebaseAuthInterceptor } from './firebase-auth.interceptor';

@NgModule({
  imports: [AngularFireAuthModule],
  providers: [
    AuthService,
    RedirectAuthenticatedToDashboard,
    RedirectUnauthenticatedToLogin,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: FirebaseAuthInterceptor,
      multi: true
    }
  ]
})
export class AuthModule {
  static forRoot(functionsEndPointFactory: () => string) {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: HTTP_INTERCEPTORS,
          useClass: FirebaseAuthInterceptor,
          multi: true
        },
        {
          provide: FUNCTIONS_ENDPOINT,
          useFactory: functionsEndPointFactory
        }
      ]
    };
  }
}
