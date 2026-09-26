import { Component } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';

@Component({
  selector: 'app-funcionarios',
  imports: [],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  funcionarios:Employee[];
  constructor (private crudfuncionario: Crudfuncionario){
    this.funcionarios=this.crudfuncionario.getallFuncionario();
  };
}
