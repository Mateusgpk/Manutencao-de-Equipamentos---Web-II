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
funcionario= new Employee({"name":"opa","dataNascimento":"24/02/2007","user":{"active":true,"email":"opa@a","id":1,"password":"123456","role":"EMPLOYEE"}})



message!: string;
private loginAutenticador=inject(Autenticador)
private router = inject(Router)
private route = inject(ActivatedRoute)



ngOnInit(): void {
  this.loginAutenticador.registerEmployee(this.funcionario);
  
  if (this.loginAutenticador.usuarioLogado) {
    if (this.loginAutenticador.usuarioLogado instanceof Client){
      this.router.navigate( ["/home"] );
    }else{
      this.router.navigate( ["/employee/home"] );
    }

  }
  else {
    this.route.queryParams.subscribe(params => {
    this.message = params['error'];
  });

}
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
      
      this.loginAutenticador.loginuser(new User(this.formCadastro.value.email?? "", this.formCadastro.value.senha ?? "","")).subscribe((usu)=>{
        if (usu!=null){
          alert('Login realizado com sucesso!');
          this.loginAutenticador.usuarioLogado=usu;
          if (usu.user.role==='EMPLOYEE'){
            this.router.navigate(['employee/home']);
          }else if (usu.user.role === 'CLIENT') {
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
}
