import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input-texto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './input-texto.html',
  styleUrl: './input-texto.css'
})


export class InputTexto {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl;

  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() class: string = '';
}