import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';
import { User } from '../../../shared/models/user.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private nextId = 3;

  private readonly employees = signal<Employee[]>([
    criarFuncionario(1, 'Maria', '2002-02-20', 'maria@company.com', '123'),
    criarFuncionario(2, 'Mario', '1999-09-19', 'mario@company.com', '456'),
  ]);

  listAll(): Employee[] {
    return this.employees();
  }

  findById(id: number): Employee | undefined {
    return this.employees().find((e) => e.id === id);
  }

  listAllExcept(id: number): Employee[] {
    return this.employees().filter((e) => e.id !== id);
  }

  insert(employee: Employee): void {
    employee.id = this.nextId++;
    this.employees.update((list) => [...list, employee]);
  }

  update(employee: Employee): void {
    this.employees.update((list) =>
      list.map((e) => (e.id === employee.id ? { ...employee } : e)),
    );
  }

  remove(id: number): void {
    if (this.employees().length <= 1) {
      return;
    }
    this.employees.update((list) => list.filter((e) => e.id !== id));
  }
}

function criarFuncionario(
  id: number,
  name: string,
  birthDate: string,
  email: string,
  password: string,
): Employee {
  const employee = new Employee();
  employee.id = id;
  employee.name = name;
  employee.birthDate = birthDate;
  employee.user = new User(email, password);
  employee.user.role = 'FUNCIONARIO'; 
  return employee;
}