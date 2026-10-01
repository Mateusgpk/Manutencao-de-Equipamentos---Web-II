import { Component } from '@angular/core';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { RouterLink } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-funcionarios',
  imports: [RouterLink],
  templateUrl: './funcionarios.html',
  styleUrl: './funcionarios.css',
})
export class Funcionarios {
  funcionarios:Employee[]=[];
  constructor (private crudfuncionario: Crudfuncionario){};

  ngOnInit(){this.funcionarios=this.crudfuncionario.getallFuncionario();}
    desativar(id:number){
    if(this.crudfuncionario.desactiveFuncionario(id)){
      this.funcionarios=this.crudfuncionario.getallFuncionario();
    }
  }


}
