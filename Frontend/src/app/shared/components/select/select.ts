import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { SelectOption } from '../../models/select.model';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './select.html',
  styleUrl: './select.css',
})

export class Select {
  @Input({ required: true }) control!: FormControl;
  @Input({ required: true }) options: SelectOption[] = [];
  @Input() label?: string;
}
