import { Component, Input, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-input-texto',
  standalone: true,
  imports: [ReactiveFormsModule],
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

  formDir = inject(FormGroupDirective, { optional: true });
}