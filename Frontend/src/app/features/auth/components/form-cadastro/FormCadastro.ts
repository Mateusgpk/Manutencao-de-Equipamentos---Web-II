import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apicep } from '../../services/apicep';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../features/cliente/models/client.model';
import { User } from '../../../../shared/models/user.model';

import { CpfValidator } from '../../../../shared/validators/cpf.validator';
import { Autenticador } from '../../../../shared/services/auth/autenticador';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-form-cadastro',
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit],
  templateUrl: './FormCadastro.html',
  styleUrl: './FormCadastro.css',
})  


export class FormCadastro implements OnInit{

  
  private loginAutenticador=inject(Autenticador)
  private router = inject(Router)
  private route = inject(ActivatedRoute)
  message!: string;

  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    /* TODO: de acordo com documentação, a senha seria mandada por email, não cadastrada
    Logo, tirar daqui depois de implementar */
    senha: new FormControl('', [Validators.required, Validators.minLength(5)]),
    cpf: new FormControl('', [Validators.required, Validators.maxLength(14), Validators.minLength(14), CpfValidator.validar()]),
    telefone: new FormControl('', [Validators.required, Validators.pattern(/^\(?\d{2}\)?\s?(9\d{4}|[2-8]\d{3})\-?\d{4}$/)]),
    cep: new FormControl('', [Validators.required,Validators.maxLength(9)]),
    endereco: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
  });
    dadosCep: any;

  constructor(private apicep: Apicep) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
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

  this.formCadastro.controls.cep.valueChanges
      .pipe(
        debounceTime(400),          // Aguarda 400ms de inatividade após o último clique
        distinctUntilChanged(),     // Só emite se o texto atual for diferente do anterior
        takeUntil(this.destroy$)    // Cancela a inscrição quando o componente sumir
      )
      .subscribe(valor => {
        this.executarAcao(valor);
      });
      
  }

  validacep = /^[0-9]{8}$/;
  executarAcao(texto: string | null): void {
    console.log('O usuário parou de digitar. Texto final:', texto);

    if (texto?.length === 8) {
      if (this.validacep.test(texto || '')) {
        this.apicep.obterDados(texto!).subscribe({
          next: (resposta) => {
            this.dadosCep = resposta;
            this.formCadastro.patchValue({
              endereco: this.dadosCep.logradouro,
              bairro: this.dadosCep.bairro,
              cidade: this.dadosCep.localidade,
              estado: this.dadosCep.uf
            });
          }
        });
      }
    }
  }

    ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

 corfundo: string = 'bg-blue-800';
 piscar: string=''


 async aoEnviar() {
    this.piscar = 'piscando'
    if (this.formCadastro.valid) {
      this.formCadastro.value.cpf=this.formCadastro.value.cpf?.replace(/[.-]/g,'');
      console.log('Dados enviados:', this.formCadastro.value)
      const user = new Client({...(this.formCadastro.value as Partial<Client>),
      user: new User( String( this.formCadastro.value.email), String (this.formCadastro.value.senha),'CLIENT')
})
      if (this.loginAutenticador.registerClient(user)){
        alert("usuario salvo")
        
      }
      
      const savedUserJson = localStorage.getItem("user");
      console.log(savedUserJson)


    }
  }
}