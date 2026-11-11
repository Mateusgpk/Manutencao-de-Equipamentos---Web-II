import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { Autenticador } from '../../../../shared/services/auth/autenticador'
import { User } from '../../../../shared/models/user.model';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';
import { Client } from '../../../cliente/models/client.model';
import { Employee } from '../../../funcionario/models/employee.model';

@Component({
  selector: 'app-form-login',
  imports: [InputTexto, BtnSubmit, CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './FormLogin.html',
  styleUrl: './FormLogin.css',
})


export class FormLogin implements OnInit{




private loginAutenticador=inject(Autenticador)
private router = inject(Router)
private route = inject(ActivatedRoute)



ngOnInit(): void {
  const funcionario= new Employee({"name":"opa","id":"","dataNascimento":"2007-02-24","user":{"ativo":true,"email":"opa@a","id":1,"password":"123456","role":"FUNCIONARIO"}})
  if (this.loginAutenticador.inserirFuncionario(funcionario).subscribe((bool)=> {return bool})){
    console.log("deu boa")
  }
  this.loginAutenticador.autentica()
}


  formCadastro = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
  });
  corfundo = 'bg-blue-800';

  aoEnviar() {
    this.corfundo = 'bg-blue-600';
    if (this.formCadastro.valid) {
      console.log('Dados enviados:', this.formCadastro.value);
      
      this.loginAutenticador.login(new User({email: String(this.formCadastro.value.email), password: String(this.formCadastro.value.senha)})).subscribe((usu)=>{
        if (usu!=null){
          alert('Login realizado com sucesso!');
          this.loginAutenticador.usuarioLogado=usu;
          if (usu.user.role==='FUNCIONARIO'){
            this.router.navigate(['employee/home']);
          }else if (usu.user.role === 'CLIENTE') {
          this.router.navigate(['/home']);
        }else{
          this.router.navigate(['/']);  
        }}
         else {
        console.log('Email ou senha incorretos.');
      }
    });
  }
}
  logout(){
    this.loginAutenticador.logout();
  }
}
