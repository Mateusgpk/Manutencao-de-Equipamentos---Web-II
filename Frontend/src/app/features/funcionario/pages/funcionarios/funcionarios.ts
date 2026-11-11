import { Component, OnInit } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, switchMap, Observable } from 'rxjs';
import { AsyncPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-funcionarios',

  standalone: true, 
  imports: [RouterLink, AsyncPipe, DatePipe],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios implements OnInit {


  private recarregar$ = new BehaviorSubject<void>(undefined);
  
  funcionarios$: Observable<Employee[]> = this.recarregar$.pipe(
    switchMap(() => this.crudfuncionario.getallFuncionario())
  );

  constructor(private crudfuncionario: Crudfuncionario) {}

  ngOnInit(): void {


  }

  desativar(id: string | undefined): void {

    if (!id) return; 

    const temCerteza = window.confirm('Tem certeza que deseja desativar este funcionário?');
    if (!temCerteza) {
      return;
    }

    this.crudfuncionario.desactiveFuncionario(id).subscribe({
      next: () => {
        this.recarregar$.next(); 
      },
      error: (err) => {
        console.error('Erro ao desativar:', err);
        window.alert('Erro ao desativar o funcionário: ' + (err.error?.message || 'Erro desconhecido'));
      },
    });
  }
}