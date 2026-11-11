import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[MascaraCEP]',
  standalone: true,
})
export class MascaraCEPDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input || input.tagName !== 'INPUT') return;

    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 8) valor = valor.substring(0, 8);

    if (valor.length > 5) {
      valor = valor.replace(/^(\d{5})(\d{1,3})/, '$1-$2');
    }

    if (input.value !== valor) {
      input.value = valor;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
