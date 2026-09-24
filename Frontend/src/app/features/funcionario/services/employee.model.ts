import { Injectable, signal } from '@angular/core';
import { Employee } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private nextId = 3;

  private readonly employees = signal<Employee[]>([
    new Employee(1, 'Maria', 'maria@company.com', '2002-02-20', '123'),
    new Employee(2, 'Mario', 'mario@company.com', '1999-09-19', '456'),
  ]);

  listAll(): Employee[] {
    return this.employees();
  }

  findById(id: number): Employee | undefined {
    return this.employees().find((e) => e.id === id);
  }

  // Lista todos funcionários exceto ele mesmo (para RF015)
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
    // não pode remover o último funcionário
    if (this.employees().length <= 1) { 
      return; 
    }
    this.employees.update((list) => list.filter((e) => e.id !== id)); // funcionário não pode remover a si mesmo
  }
}