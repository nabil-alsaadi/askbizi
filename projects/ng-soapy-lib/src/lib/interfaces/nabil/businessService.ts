import { FirebaseEntity } from '../common/firebase-entity.interface';

export interface BusinessService extends FirebaseEntity {
  name: string; //"standard 48 hours"
  desc: string;
  icon: string;
  order: number;
}
