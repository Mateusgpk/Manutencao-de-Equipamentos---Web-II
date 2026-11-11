import { Directive, ElementRef, HostListener, Renderer2, forwardRef, inject } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Mostra o valor em reais (1.234,56) e entrega ao controle o número (1234.56). */
@Directive({
  selector: '[MascaraMoeda]',
  standalone: true,
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MascaraMoedaDirective), multi: true },
  ],
})
export class MascaraMoedaDirective implements ControlValueAccessor {
  private readonly elemento = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);

  private aoAlterar: (valor: number | null) => void = () => {};
  private aoTocar: () => void = () => {};

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Os dígitos digitados são centavos: "12345" vira 123,45.
    const centavos = Number(input.value.replace(/\D/g, '').substring(0, 11));

    // Zero limpa o campo, para o usuário conseguir apagar o valor.
    const valor = centavos > 0 ? centavos / 100 : null;

    this.escrever(valor);
    this.aoAlterar(valor);
  }

  @HostListener('blur')
  onBlur(): void {
    this.aoTocar();
  }

  writeValue(valor: number | null): void {
    this.escrever(valor);
  }

  registerOnChange(fn: (valor: number | null) => void): void {
    this.aoAlterar = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.aoTocar = fn;
  }

  setDisabledState(desabilitado: boolean): void {
    this.renderer.setProperty(this.elemento.nativeElement, 'disabled', desabilitado);
  }

  private escrever(valor: number | null): void {
    const texto = valor === null || valor === undefined
      ? ''
      : valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    this.renderer.setProperty(this.elemento.nativeElement, 'value', texto);
  }
}
