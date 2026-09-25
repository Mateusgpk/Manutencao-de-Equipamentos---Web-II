import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apicep } from '../../services/apicep';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { auth } from '../../../../shared/services/auth/auth';
import { Client } from '../../../cliente/models/client.model';


@Component({
  selector: 'app-form-cadastro',
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit],
  templateUrl: './FormCadastro.html',
  styleUrl: './FormCadastro.css',
})


export class FormCadastro implements OnInit{
  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.min(5)]),
    cpf: new FormControl('', [Validators.required, Validators.maxLength(11), Validators.minLength(11)]),
    cep: new FormControl('', [Validators.required,Validators.maxLength(8), Validators.minLength(8)]),
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
      
      console.log('Dados enviados:', this.formCadastro.value);
      const user = new Client(this.formCadastro.value as Partial<Client>)
      if (auth.registerClient(user)){
        alert("usuario salvo")
      }
      
      const savedUserJson = localStorage.getItem("user");
      console.log(savedUserJson)


    }
  }
}
