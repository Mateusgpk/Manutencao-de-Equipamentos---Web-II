import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { TextArea } from '../../../../shared/components/text-area/text-area';
import { Select } from '../../../../shared/components/select/select';

import { SelectOption } from '../../../../shared/models/select.model';

import { SolicitacaoService } from '../../services/solicitacao';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, InputTexto, TextArea, Select],
  templateUrl: './SolicitarManutencao.html',
  styleUrl: './SolicitarManutencao.css',
})
export class SolicitarManutencao {

  opcoesCategoriaEquipamento: SelectOption[] = [
    { value: 'desktop', label: 'Desktop' },
    { value: 'notebook', label: 'Notebook' },
    { value: 'celular', label: 'Celular' },
    { value: 'tablet', label: 'Tablet' },
    { value: 'impressora', label: 'Impressora' },
    { value: 'outros', label: 'Outros' }
  ];

  private formBuilder = inject(FormBuilder);

  formSolicitacao = this.formBuilder.nonNullable.group({
    descricaoEquipamento: ['', [Validators.required, Validators.minLength(5)]],
    categoriaEquipamento: ['', [Validators.required]],
    descricaoProblema: ['', [Validators.required, Validators.minLength(10)]]
  });

  private solicitacaoService = inject(SolicitacaoService);

  enviarSolicitacao() {
    if (this.formSolicitacao.valid) {
      const payload = this.formSolicitacao.getRawValue();

      this.solicitacaoService.enviarNovaSolicitacao(payload).subscribe({
        next: (resposta) => {
          console.log('Enviado com sucesso!', resposta);
        },
        error: (erro) => {
          console.error('Falha ao enviar:', erro);
        }
      });
    } else {
      this.formSolicitacao.markAllAsTouched();
    }
  }
}