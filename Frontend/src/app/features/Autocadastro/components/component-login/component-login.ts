import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BtnSubmit } from '../../../../shared/component/btn-submit/btn-submit';
import { InputTexto } from '../inputs/input-texto';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-component-login',
  imports: [InputTexto, BtnSubmit,CommonModule, ReactiveFormsModule,],
  templateUrl: './component-login.html',
  styleUrl: './component-login.css',
})
export class ComponentLogin {
    formCadastro = new FormGroup({
      email: new FormControl('', Validators.required),
      senha: new FormControl('', Validators.required),
    });
    corfundo = 'bg-blue-800';
    aoEnviar() {
    this.corfundo = 'bg-blue-600';
    if (this.formCadastro.valid) {
      console.log('Dados enviados:', this.formCadastro.value);
    }
  }
}
