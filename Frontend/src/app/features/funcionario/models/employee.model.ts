import { User } from "../../../shared/models/user.model"

export class Employee {
  name!: string  ;
  dataNascimento!: string;
  user!: User;

  constructor(dados: Partial<Employee>) {
    Object.assign(this, dados);
  }
}