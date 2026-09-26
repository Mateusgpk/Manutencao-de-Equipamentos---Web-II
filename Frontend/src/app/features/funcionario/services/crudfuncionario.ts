import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { auth } from '../../../shared/services/auth/auth';
import { User } from '../../../shared/models/user.model';
@Injectable({
  providedIn: 'root',
})
export class Crudfuncionario {
  getallFuncionario(): Employee[]{
    const empregados=localStorage.getItem("employees");
    const todosempregados: Employee[]=empregados?JSON.parse(empregados):[];
    return todosempregados;
  }
  addFuncionario(employee:Employee):boolean{
    return auth.registerEmployee(employee)
  }
}

