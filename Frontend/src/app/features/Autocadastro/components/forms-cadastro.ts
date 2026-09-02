import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTexto } from './inputs/input-texto';
import { BtnSubmit } from '../../../shared/component/btn-submit/btn-submit';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'forms-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit],
  templateUrl:`./forms-cadastro.html`,
})
export class FormsCadastroComponent {
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
  abaAtiva: 'login' | 'cadastro' = 'login'; 

  trocarAba(aba: 'login' | 'cadastro') {
    this.abaAtiva = aba;
  }


 corfundo: string = 'bg-blue-800';

  aoEnviar() {
    this.corfundo = 'bg-blue-600';
    if (this.formCadastro.valid) {
      
      console.log('Dados enviados:', this.formCadastro.value);
    }
  }
}