import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-btn-submit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './btn-submit.html',
  styleUrl: './btn-submit.css',
})
export class BtnSubmit {

  meubutao(element: HTMLElement) {
    element.style.opacity = '0.5';
  }
  
  @Input() id: string = "";
  @Input() class: string = "";
  @Input() value: string = "";
}
