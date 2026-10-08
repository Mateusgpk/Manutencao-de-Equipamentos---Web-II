import { Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { User } from '../../../shared/models/user.model';
import { Autenticador } from '../../../shared/services/auth/autenticador';
import { inject } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class Crudfuncionario {
  private loginserver = inject(Autenticador)
  getallFuncionario(): Employee[]{
    const empregados=localStorage.getItem("employees");
    const todosempregados: Employee[]=empregados?JSON.parse(empregados):[];
    const ativos=todosempregados.filter(us=>us.user.active===true)
    return ativos;
  }
  addFuncionario(employee:Employee):boolean{
    return this.loginserver.registerEmployee(employee)
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


    const usersStorage = localStorage.getItem("user");
    const todosusers: User[] = usersStorage
      ? JSON.parse(usersStorage)
      : [];

    const user = todosusers.find(
      us => us.id === id
    );

    if (user) {
      user.active = false;
      localStorage.setItem(
        "user",
        JSON.stringify(todosusers)
      );
    }



    return true
  }
}

