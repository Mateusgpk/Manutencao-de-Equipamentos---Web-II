import { User } from "../../../shared/models/user.model"

export class Employee {
  id: number = 0;
  name: string = '';
  birthDate: string = '';
  user: User = new User('', '');
}