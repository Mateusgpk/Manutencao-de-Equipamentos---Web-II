import { Component } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-funcionarios',
  imports: [RouterLink],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  funcionarios:Employee[];
  constructor (private crudfuncionario: Crudfuncionario){
    this.funcionarios=this.crudfuncionario.getallFuncionario();
  };
}
