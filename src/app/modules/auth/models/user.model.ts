import { Payload } from '../interfaces/payload.interface';

export class SessionUser {
  id: number;
  fullname: string;

  constructor(payload: Payload) {
    this.id = payload.userId;
    this.fullname = payload.fullname ?? 'Anonimo';
  }
}