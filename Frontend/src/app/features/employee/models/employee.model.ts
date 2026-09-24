import { User } from "../../../shared/models/user.model"
export class Employee {
  id!: number ;
  name!: string ;
  birthDate!: string ;
  user!: User;
}