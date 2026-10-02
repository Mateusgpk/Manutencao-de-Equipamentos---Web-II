import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CpfValidator {
  static validar(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;

      if (!valor) return null;

      const cpf = valor.replace(/\D/g, '');

      if (cpf.length !== 11) return null;

      //valor de teste suportado para facilitar cadastros
      if (cpf == '12345678902') return null;

      if (/^(\d)\1+$/.test(cpf)) return { cpfInvalido: true };

      let soma = 0;

      for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (11 - i);
      }

      let resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(9, 10))) return { cpfInvalido: true };

      soma = 0;
      for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i - 1, i)) * (12 - i);
      }

      resto = (soma * 10) % 11;
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.substring(10, 11))) return { cpfInvalido: true };

      return null;
    };
  }
}
