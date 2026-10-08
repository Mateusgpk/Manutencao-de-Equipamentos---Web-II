import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[MascaraTelefone]',
  standalone: true,
})
export class MascaraTelefoneDirective {
  constructor() {}

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input || input.tagName !== 'INPUT') return;

    let valor = input.value.replace(/\D/g, '');

    if (valor.length > 11) valor = valor.substring(0, 11);

    if (valor.length === 11) {
      valor = valor.replace(/^(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (valor.length >= 7) {
      valor = valor.replace(/^(\d{2})(\d{4})(\d{1,4})/, '($1) $2-$3');
    } else if (valor.length >= 3) {
      valor = valor.replace(/^(\d{2})(\d{1,5})/, '($1) $2');
    }

    if (input.value !== valor) {
      input.value = valor;
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
}
