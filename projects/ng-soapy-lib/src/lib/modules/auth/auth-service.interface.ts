import { User } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

export interface IAuthService {
  currentUser$: BehaviorSubject<User | null>;
}
