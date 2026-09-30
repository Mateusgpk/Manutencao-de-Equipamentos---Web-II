import { Component } from '@angular/core';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
@Component({
  selector: 'app-addfuncionario',
  imports: [InputTexto],
  templateUrl: './addfuncionario.html',
  styleUrl: './addfuncionario.css',
})
export class Addfuncionario {
  FormCadastro = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    dataNascimento: new FormControl('', [Validators.required]),
  });
  constructor(private crudfuncionario: Crudfuncionario) {}
  addFuncionario() {
    if (this.FormCadastro.valid) {
      const funcionario = new Employee(this.FormCadastro.value as Partial<Employee>);
      console.log('Funcionário cadastrado:', funcionario);
      if (this.crudfuncionario.addFuncionario(funcionario)) {
        console.log('Funcionário adicionado com sucesso');
      } else {
        console.log('Erro ao adicionar funcionário');
      }
    } else {
      console.log('Formulário inválido');
    }
  }


}
