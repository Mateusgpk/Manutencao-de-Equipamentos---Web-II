import { Component, OnInit, inject } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { ModalService } from '../../../../shared/services/modal.service';
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

  private crudfuncionario = inject(Crudfuncionario);
  private modalService = inject(ModalService);

  private recarregar$ = new BehaviorSubject<void>(undefined);
  
  funcionarios$: Observable<Employee[]> = this.recarregar$.pipe(
    switchMap(() => this.crudfuncionario.getallFuncionario())
  );

  ngOnInit(): void {


  }

  async desativar(id: string | undefined): Promise<void> {

    if (!id) return; 

    const temCerteza = await this.modalService.confirmar(
      'Desativar Funcionário',
      'Tem certeza que deseja desativar este funcionário?',
      'Desativar',
      'Cancelar'
    );
    if (!temCerteza) {
      return;
    }

    this.crudfuncionario.desactiveFuncionario(id).subscribe({
      next: () => {
        this.recarregar$.next(); 
      },
      error: (err) => {
        console.error('Erro ao desativar:', err);
        this.modalService.erro(
          'Erro ao desativar',
          'Erro ao desativar o funcionário: ' + (err.error?.message || 'Erro desconhecido')
        );
      },
    });
  }
}