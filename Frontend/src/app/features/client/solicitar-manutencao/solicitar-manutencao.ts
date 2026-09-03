import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { InputTexto } from '../../../shared/component/input-texto/input-texto';
import { TextArea } from '../../../shared/component/text-area/text-area';
import { SolicitacaoService } from '../services/solicitacao';

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