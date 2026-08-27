import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-area',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './text-area.html',
  styleUrl: './text-area.css',
})
export class TextArea {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) control!: FormControl;

  @Input() placeholder: string = '';
  @Input() id: string = '';
  @Input() class: string = '';
}