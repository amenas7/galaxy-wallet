import { UserItemResponse } from '../interfaces/user-item.response';

export class UserModel {
  id: number;
  documentNumber: string;
  email: string;
  firstName: string;
  lastName: string;
  isSuperuser: boolean;

  get fullname() {
    return `${this.lastName}, ${this.firstName}`
  }

  constructor(userItem: UserItemResponse) {
    this.id = userItem.id;
    this.documentNumber = userItem.dni;
    this.email = userItem.email;
    this.firstName = userItem.firstName;
    this.lastName = userItem.lastName;
    this.isSuperuser = userItem.isSuperuser;
  }
}