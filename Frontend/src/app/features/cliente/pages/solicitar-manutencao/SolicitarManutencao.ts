import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { Category } from '../../../funcionario/models/category.model';
import { CategoryService } from '../../../funcionario/services/category.service';

import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { TextArea } from '../../../../shared/components/text-area/text-area';
import { Select } from '../../../../shared/components/select/select';

import { SelectOption } from '../../../../shared/models/select.model';
import { NovaSolicitacao } from '../../../../shared/models/solicitacao.model';

import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Autenticador } from '../../../../shared/services/auth/autenticador';

@Component({
  selector: 'app-solicitar-manutencao',
  standalone: true,
  imports: [ReactiveFormsModule, InputTexto, TextArea, Select],
  templateUrl: './SolicitarManutencao.html',
  styleUrl: './SolicitarManutencao.css',
})
export class SolicitarManutencao implements OnInit {
  private categoryService = inject(CategoryService);
  private autenticador = inject(Autenticador);
  private router = inject(Router);

  protected readonly opcoesCategoriaEquipamento = signal<SelectOption[]>([]);
  protected readonly enviando = signal(false);
  protected readonly solicitacaoAberta = signal(false);
  protected readonly erro = signal('');

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
          this.opcoesCategoriaEquipamento.set(opcoes);
        },
        error: (erro) => {
          console.error('Falha ao carregar as categorias de Equipamento: ', erro);
          this.erro.set('Não foi possível carregar as categorias. Verifique a conexão e tente novamente.');
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
      if (this.enviando()) {
        return;
      }

      const clienteId = Number(this.autenticador.usuarioLogado?.id);

      if (!clienteId) {
        this.erro.set('Sua sessão expirou. Faça o login novamente.');
        return;
      }

      const dados = this.formSolicitacao.getRawValue();

      const payload: NovaSolicitacao = {
        descricaoEquipamento: dados.descricaoEquipamento,
        categoriaId: Number(dados.categoriaEquipamento),
        descricaoDefeito: dados.descricaoProblema,
      };

      this.erro.set('');
      this.enviando.set(true);

      this.solicitacaoService.criar(clienteId, payload).subscribe({
        next: () => {
          this.enviando.set(false);
          this.solicitacaoAberta.set(true);
        },
        error: (erro) => {
          console.error('Erro ao enviar Solicitação: ', erro);
          this.enviando.set(false);
          this.erro.set('Não foi possível abrir a solicitação. Verifique a conexão e tente novamente.');
        },
      });
    } else {
      this.formSolicitacao.markAllAsTouched();
    }
  }

  protected voltarParaInicio(): void {
    this.router.navigate(['/home']);
  }
}