import { Component } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';
import { switchMap } from 'rxjs';
@Component({
  selector: 'app-funcionarios',
  imports: [RouterLink],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  funcionarios:Employee[]=[];
  constructor (private crudfuncionario: Crudfuncionario){};

  ngOnInit(){
    this.crudfuncionario.getallFuncionario().subscribe((ativos)=>{this.funcionarios=ativos});
  }
desativar(id: string | undefined): void {
  this.crudfuncionario.desactiveFuncionario(id).pipe(
    switchMap(() => this.crudfuncionario.getallFuncionario())
  ).subscribe({
    next: (ativos) => {
      this.funcionarios = ativos;
    },
    error: (erro) => {
      console.error('Erro ao desativar funcionário:', erro);
    }
  });
}


}
