import { Component, OnInit, inject } from '@angular/core';
import { map } from 'rxjs';
import { Category } from '../../../funcionario/models/category.model';
import { CategoryService } from '../../../funcionario/services/category.service';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { TextArea } from '../../../../shared/components/text-area/text-area';
import { Select } from '../../../../shared/components/select/select';

import { SelectOption } from '../../../../shared/models/select.model';

import { SolicitacaoService } from '../../services/solicitacao';
import { error, log } from 'console';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, InputTexto, TextArea, Select],
  templateUrl: './SolicitarManutencao.html',
  styleUrl: './SolicitarManutencao.css',
})
export class SolicitarManutencao implements OnInit {
  private categoryService = inject(CategoryService);

  opcoesCategoriaEquipamento: SelectOption[] = [];

  ngOnInit(): void {
    this.carregarCategorias();
  }

  private carregarCategorias(): void {
    this.categoryService
      .listarCategorias()
      .pipe(
        map((categorias: Category[]) =>
          categorias.map((cat) => ({
            value: cat.id,
            label: cat.name,
          })),
        ),
      )
      .subscribe({
        next: (opcoes) => {
          this.opcoesCategoriaEquipamento = opcoes;
        },
        error: (erro) => {
          console.error('Falha ao carregar as categorias de Equipamento: ', erro);
        },
      });
  }

  private formBuilder = inject(FormBuilder);

  formSolicitacao = this.formBuilder.nonNullable.group({
    descricaoEquipamento: ['', [Validators.required, Validators.minLength(5)]],
    categoriaEquipamento: ['', [Validators.required]],
    descricaoProblema: ['', [Validators.required, Validators.minLength(10)]],
  });

  private solicitacaoService = inject(SolicitacaoService);

  enviarSolicitacao() {
    if (this.formSolicitacao.valid) {
      const dados = this.formSolicitacao.getRawValue();

      const payload = {
        descricaoEquipamento: dados.descricaoEquipamento,
        categoriaId: Number(dados.categoriaEquipamento),
        descricaoDefeito: dados.descricaoProblema,
      };

      this.solicitacaoService.enviarNovaSolicitacao(payload).subscribe({
        next: (resposta) => {
          console.log('Chamado aberto com Sucesso: ', resposta);
        },
        error: (erro) => {
          console.error('Erro ao enviar Solicitação: ', erro);
        },
      });
    } else {
      this.formSolicitacao.markAllAsTouched();
    }
  }
}
