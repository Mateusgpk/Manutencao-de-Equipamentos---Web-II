import { Component } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { BehaviorSubject, switchMap } from 'rxjs';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
@Component({
  selector: 'app-funcionarios',
  imports: [RouterLink,AsyncPipe],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {

  private recarregar$ = new BehaviorSubject<void>(undefined);
  funcionarios$: Observable<Employee[]> = this.recarregar$.pipe(
    switchMap(() => this.crudfuncionario.getallFuncionario())
  );

  constructor (private crudfuncionario: Crudfuncionario){};

desativar(id: string | undefined): void {
  this.crudfuncionario.desactiveFuncionario(id).subscribe({
    next: () => {
      console.log('Funcionario desativado com sucesso!');
      this.recarregar$.next(); 
    },
    error: (err) => console.error('Erro ao desativar:', err),
  });
}
}



