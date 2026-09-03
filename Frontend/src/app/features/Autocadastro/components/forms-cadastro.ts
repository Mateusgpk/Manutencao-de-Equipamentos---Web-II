import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTexto } from './inputs/input-texto';
import { BtnSubmit } from '../../../shared/component/btn-submit/btn-submit';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Apicep } from '../services/apicep';
@Component({
  selector: 'forms-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit],
  templateUrl:`./forms-cadastro.html`,
})
export class FormsCadastroComponent implements OnInit {
  formCadastro = new FormGroup({
    nome: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    cpf: new FormControl('', Validators.required),
    cep: new FormControl('', Validators.required),
    endereco: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
  
    
  });

  dadosCep: any;

  constructor(private apicep: Apicep) {}



  abaAtiva: 'login' | 'cadastro' = 'cadastro'; 

  trocarAba(aba: 'login' | 'cadastro') {
    this.abaAtiva = aba;
  }

  
  // Subject para gerenciar o ciclo de vida e evitar memory leak
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

  aoEnviar() {
    this.corfundo = 'bg-blue-600';
    if (this.formCadastro.valid) {
      
      console.log('Dados enviados:', this.formCadastro.value);
    }
  }
}