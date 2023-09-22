import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs';
import { Auth, idToken } from '@angular/fire/auth';

@Injectable()
export class FirebaseAuthInterceptor implements HttpInterceptor {
  constructor(private auth: Auth) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return idToken(this.auth).pipe(
      switchMap((idToken) => {
        if (idToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${idToken}`,
            },
          });
        }
        return next.handle(request);
      })
    );
  }
}
