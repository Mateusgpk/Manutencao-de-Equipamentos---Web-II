import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTexto } from '../../../shared/component/input-texto/input-texto';
import { TextArea } from '../../../shared/component/text-area/text-area';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, InputTexto, TextArea],
  templateUrl: './solicitar-manutencao.html',
  styleUrl: './solicitar-manutencao.css',
})
export class SolicitarManutencao {
  
  private formBuilder = inject(FormBuilder);

  formSolicitacao = this.formBuilder.nonNullable.group({
    descricaoEquipamento: ['', [Validators.required, Validators.minLength(5)]],
    categoriaEquipamento: ['', [Validators.required]],
    descricaoProblema: ['', [Validators.required, Validators.minLength(10)]]
  });

  enviarSolicitacao() {
    if (this.formSolicitacao.valid) {
      const payload = this.formSolicitacao.getRawValue();
      console.log('Dados Validados com Sucesso!', payload);
    } else {
      console.warn("Formulário Inválido, revise os Dados Informados");
      this.formSolicitacao.markAllAsTouched();
    }
  }
}