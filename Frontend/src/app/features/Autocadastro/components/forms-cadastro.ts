import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTexto } from './inputs/input-texto';
import { BtnSubmit } from '../../../shared/component/btn-submit/btn-submit';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Apicep } from '../services/apicep';
import { ComponentCadastro } from './component-cadastro/component-cadastro';
import { ComponentLogin } from './component-login/component-login';
@Component({
  selector: 'forms-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit ,ComponentCadastro, ComponentLogin],
  templateUrl:`./forms-cadastro.html`,
})
export class FormsCadastroComponent  {
  abaAtiva: 'login' | 'cadastro' = 'cadastro'; 

  trocarAba(aba: 'login' | 'cadastro') {
    this.abaAtiva = aba;
  }
}