import { Directive, HostListener } from '@angular/core';
import { FormControl, NgControl } from '@angular/forms';
import { Optional,Self } from '@angular/core';
@Directive({
  selector: '[MascaraCPF]',
  standalone: true
})
export class MascaraCPFDirective {

  constructor(
    @Optional() @Self() private ngControl: NgControl
  ) {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    
    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) {
      valor = valor.substring(0, 11);
    }

    if (valor.length > 9) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{3})(\d{1,2})/, '$1.$2.$3-$4');
    } else if (valor.length > 6) {
      valor = valor.replace(/(\d{3})(\d{3})(\d{1,3})/, '$1.$2.$3');
    } else if (valor.length > 3) {
      valor = valor.replace(/(\d{3})(\d{1,3})/, '$1.$2');
    }

    input.value = valor;    

    this.ngControl.control?.setValue(valor, { emitEvent: false });
  }
}