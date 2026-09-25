import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { auth } from '../../../../shared/services/auth/auth'
import { User } from '../../../../shared/models/user.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-form-login',
  imports: [InputTexto, BtnSubmit, CommonModule, ReactiveFormsModule,],
  templateUrl: './FormLogin.html',
  styleUrl: './FormLogin.css',
})


export class FormLogin {


  formCadastro = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
  });
  corfundo = 'bg-blue-800';

  constructor(private router: Router) { }
  aoEnviar() {
    this.corfundo = 'bg-blue-600';



    if (this.formCadastro.valid) {
      console.log('Dados enviados:', this.formCadastro.value);
      
      const login=auth.loginuser(new User(this.formCadastro.value.email?? "", this.formCadastro.value.senha ?? ""))

      if (login.sucesso) {

        alert('Login realizado com sucesso!');
        if (login.role === 'FUNCIONARIO') {
          this.router.navigate(['employee/home']);
        }
        else if (login.role === 'CLIENTE') {
          this.router.navigate(['/home']);
        }
        else {
          this.router.navigate(['/']);
        }

      } else {
        console.log('Email ou senha incorretos.');
      }
    }
  }
}
