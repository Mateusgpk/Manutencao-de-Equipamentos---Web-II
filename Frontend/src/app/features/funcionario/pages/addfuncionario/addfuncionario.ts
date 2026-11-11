import { Component, inject, signal } from '@angular/core';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Crudfuncionario } from '../../services/crudfuncionario';
import { Employee } from '../../models/employee.model';
import { User } from '../../../../shared/models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
@Component({
  selector: 'app-addfuncionario',
  imports: [InputTexto, ReactiveFormsModule],
  templateUrl: './addfuncionario.html',
  styleUrl: './addfuncionario.css',
})
export class Addfuncionario implements OnInit {
  novoUsuario = signal(true);
  usuario = signal(new Employee({user: new User({email: '', password: '', role: 'FUNCIONARIO'})}));
  id: string = "";
  loading = signal(false);
  senhaAntiga: string = "";

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  FormCadastro = new FormGroup({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required,]),
    senha: new FormControl('', [ Validators.minLength(4),Validators.maxLength(4)]),
    dataNascimento: new FormControl('', [Validators.required]),
  });
  ngOnInit(): void {
    this.usuario.set(new Employee({user: new User({email: '', password: '', role: 'FUNCIONARIO'})}));
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
          senha: "",
          dataNascimento: funcionario.dataNascimento
        });
      });
    } else {
      // Senha obrigatória só no cadastro; na edição, em branco mantém a senha atual.
      this.FormCadastro.controls.senha.addValidators(Validators.required);
      this.FormCadastro.controls.senha.updateValueAndValidity();
    }
    
  }

  constructor(private crudfuncionario: Crudfuncionario) {}
  addEditFuncionario() {
    if (this.FormCadastro.valid) {
      


      
      if (this.novoUsuario()) {
      const funcionario = new Employee({...(this.FormCadastro.value as Partial<Employee>),
        user: new User({email: String(this.FormCadastro.value.email), password: String(this.FormCadastro.value.senha), role: "FUNCIONARIO"})
        });
        this.crudfuncionario.addFuncionario(funcionario).subscribe({
          next: () => {
            this.router.navigate(['/employee/crud-funcionario']);
          },
          error: (err) => {
            console.error('Erro ao adicionar funcionário:', err);
            window.alert('Erro ao cadastrar o funcionário: ' + (err.error?.message || 'Erro desconhecido'));
          }
        });
    } else{
      let funcionario = new Employee({...(this.FormCadastro.value as Partial<Employee>),
        id: this.id,
        user: new User({id: this.usuario().user.id, email: String(this.FormCadastro.value.email), password: String(this.FormCadastro.value.senha), role: "FUNCIONARIO"}),

      });
      this.crudfuncionario.alterarFuncionario(funcionario).subscribe({
        next: () => {
          this.router.navigate(['/employee/crud-funcionario']);
        },
        error: (err) => {
          console.error('Erro ao alterar funcionário:', err);
          window.alert('Erro ao alterar o funcionário: ' + (err.error?.message || 'Erro desconhecido'));
        }
      });
    }
    }
  }


}
