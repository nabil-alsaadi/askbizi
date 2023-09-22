import { Timestamp } from './firebase-timestamp.interface';

export interface FirebaseEntity {
  uid?: string;
  createdBy?: {
    uid: string;
    name: string;
  };
  modifiedBy?: {
    uid: string;
    name: string;
  };
  createdOn?: Timestamp | any;
  modifiedOn?: Timestamp | any;
  version?: number;
  isDeleted?: boolean;
  mirroredOn?: Timestamp;
}
