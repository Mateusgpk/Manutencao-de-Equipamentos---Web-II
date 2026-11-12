import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { Autenticador } from '../../../../shared/services/auth/autenticador'
import { ModalService } from '../../../../shared/services/modal.service';
import { User } from '../../../../shared/models/user.model';
import { Router, RouterModule,ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { inject } from '@angular/core';


@Component({
  selector: 'app-form-login',
  imports: [InputTexto, BtnSubmit, CommonModule, ReactiveFormsModule,RouterModule],
  templateUrl: './FormLogin.html',
  styleUrl: './FormLogin.css',
})


export class FormLogin implements OnInit{



private cdr = inject(ChangeDetectorRef);
private loginAutenticador=inject(Autenticador)
private modalService = inject(ModalService);
private router = inject(Router)
private route = inject(ActivatedRoute)



ngOnInit(): void {
  this.loginAutenticador.autentica()
}


  formCadastro = new FormGroup({
    email: new FormControl('', Validators.required),
    senha: new FormControl('', Validators.required),
  });
  corfundo = 'bg-blue-800';
  erroLogin: boolean = false;
  aoEnviar() {
    this.corfundo = 'bg-blue-600';
    this.erroLogin = false; // Oculta o erro ao tentar submeter novamente

    if (this.formCadastro.valid) {
      const email = String(this.formCadastro.value.email);
      const senha = String(this.formCadastro.value.senha);

      this.loginAutenticador.login(new User({ email, password: senha })).subscribe({
        next: async (usu) => {
          if (usu != null) {
            this.loginAutenticador.usuarioLogado = usu;
            await this.modalService.sucesso('Bem-vindo!', 'Login realizado com sucesso!');
            
            if (usu.user.role === 'FUNCIONARIO') {
              this.router.navigate(['employee/home']);
            } else if (usu.user.role === 'CLIENTE') {
              this.router.navigate(['/home']);
            } else {
              this.router.navigate(['/']);
            }
          } else {
            this.erroLogin = true;
            this.cdr.detectChanges(); 
          }
        },
        error: (err) => {
          console.error('Erro na autenticação:', err);
          this.erroLogin = true;
          this.cdr.detectChanges(); 
        }
      });
    }
  }
  logout(){
    this.loginAutenticador.logout();
  }
}
