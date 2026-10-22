import { Component, inject, signal } from '@angular/core';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { User } from '../../../../shared/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-addfuncionario',
  imports: [InputTexto],
  templateUrl: './addfuncionario.html',
  styleUrl: './addfuncionario.css',
})
export class Addfuncionario implements OnInit {
  novoUsuario = signal(true);
  usuario = signal(new Employee({user: new User('', '', 'EMPLOYEE')}));
  id: string = "";
  loading = signal(false);
  senhaAntiga: string = "";

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  FormCadastro = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    dataNascimento: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    this.usuario.set(new Employee({user: new User('', '', 'EMPLOYEE')}));
    this.loading.set(false);
    this.id = this.route.snapshot.params['id'];
    this.novoUsuario.set(!this.id);

    if (!this.novoUsuario()) {
      this.crudfuncionario.buscarPorId(this.id).subscribe((funcionario) => {
        this.usuario.set(funcionario);
        this.senhaAntiga = funcionario.user.password ? funcionario.user.password : '';
        this.usuario().user.password = this.senhaAntiga;
        this.FormCadastro.setValue({
          name: funcionario.name,
          email: funcionario.user.email,
          senha: funcionario.user.password,
          dataNascimento: funcionario.dataNascimento
        });
      });
    }
    console.log("ID do user do funcionário:", this.usuario().user.id);
  }

  constructor(private crudfuncionario: Crudfuncionario) {}
  addEditFuncionario() {
    if (this.FormCadastro.valid) {
      


      
      if (this.novoUsuario()) {
      const funcionario = new Employee({...(this.FormCadastro.value as Partial<Employee>),
        user: new User(String(this.FormCadastro.value.email),String(this.FormCadastro.value.senha),"EMPLOYEE")
        });
        if (this.crudfuncionario.addFuncionario(funcionario)) {
          console.log('Funcionário adicionado com sucesso');
        } else {
          console.log('Erro ao adicionar funcionário');
        }
    } else{
      let funcionario = new Employee({...(this.FormCadastro.value as Partial<Employee>),
        id: this.id,
        user: this.usuario().user
      });
      this.crudfuncionario.alterarFuncionario(funcionario);
      console.log('Funcionário alterado com sucesso');
    }
    } else {
      console.log('Formulário inválido');
    }
  }


}
