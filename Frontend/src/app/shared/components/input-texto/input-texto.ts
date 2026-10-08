import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';
import { MascaraCPFDirective } from '../../directives/mascara-cpf';
import { MascaraTelefoneDirective } from '../../directives/mascara-telefone';

@Component({
  selector: 'app-input-texto',
  standalone: true,
  imports: [ReactiveFormsModule, MascaraCPFDirective, MascaraTelefoneDirective],
  templateUrl: './input-texto.html',
  styleUrl: './input-texto.css'
})


export class InputTexto { // (E Textarea no outro)
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl; 
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() class: string = '';
  @Input() mascara: 'cpf' | 'cep' | 'telefone' | 'nenhuma' = 'nenhuma';;

  formDir = inject(FormGroupDirective, { optional: true });
}