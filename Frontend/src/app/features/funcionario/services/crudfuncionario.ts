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
    const ativos=todosempregados.filter(us=>us.user.active===true)
    return ativos;
  }
  addFuncionario(employee:Employee):boolean{
    return auth.registerEmployee(employee)
  }
  desactiveFuncionario(id:number):boolean{
    const funcionarios=localStorage.getItem("employees")
    const todosfuncionarios: Employee[]=funcionarios?JSON.parse(funcionarios):[];
    const funcionario = todosfuncionarios.find(us => us.user.id === id)
    if (!funcionario) {
      return false;
    }
    funcionario.user.active=false
    localStorage.setItem("employees", JSON.stringify(todosfuncionarios));

    
    const usersStorage = localStorage.getItem("users");
    const todosusers: User[] = usersStorage
      ? JSON.parse(usersStorage)
      : [];

    const user = todosusers.find(
      us => us.id === id
    );

    if (user) {
      user.active = false;

      localStorage.setItem(
        "users",
        JSON.stringify(todosusers)
      );
    }



    return true
  }
}

