import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import {
  ESTADO_SOLICITACAO_LABEL,
  EstadoSolicitacao,
  Solicitacao,
} from '../models/solicitacao.model';
import { SolicitacaoService } from '../services/solicitacao.service';

/** Passos pelos quais a tela pode passar (RF005 -> RF006 / RF007). */
type Etapa =
  | 'carregando'
  | 'naoEncontrada'
  | 'orcamento'
  | 'motivoRejeicao'
  | 'servicoAprovado'
  | 'servicoRejeitado';

@Component({
  selector: 'app-orcamento',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './orcamento.html',
  styleUrl: './orcamento.css',
})
export class Orcamento implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);

  protected readonly EstadoSolicitacao = EstadoSolicitacao;
  protected readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;

  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviandoRejeicao = signal(false);

  /** RF007 - motivo da rejeição, validado como obrigatório. */
  protected readonly motivoRejeicaoControl = new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }

    this.solicitacaoService.getById(id).subscribe((solicitacao) => {
      if (!solicitacao || solicitacao.estado !== EstadoSolicitacao.ORCADA) {
        this.etapa.set('naoEncontrada');
        return;
      }

      this.solicitacao.set(solicitacao);
      this.etapa.set('orcamento');
    });
  }

  /** RF006 - Aprovar Serviço. */
  protected aprovarServico(): void {
    const atual = this.solicitacao();
    if (!atual) {
      return;
    }

    this.solicitacaoService.aprovarServico(atual.id).subscribe((atualizada) => {
      if (atualizada) {
        this.solicitacao.set(atualizada);
      }
      this.etapa.set('servicoAprovado');
    });
  }

  /** Abre o formulário de motivo, primeiro passo do RF007. */
  protected abrirRejeicaoServico(): void {
    this.motivoRejeicaoControl.reset('');
    this.etapa.set('motivoRejeicao');
  }

  protected cancelarRejeicao(): void {
    this.etapa.set('orcamento');
  }

  /** RF007 - Rejeitar Serviço, após o usuário informar o motivo. */
  protected confirmarRejeicaoServico(): void {
    this.motivoRejeicaoControl.markAsTouched();

    if (this.motivoRejeicaoControl.invalid) {
      return;
    }

    const atual = this.solicitacao();
    if (!atual) {
      return;
    }

    this.enviandoRejeicao.set(true);

    this.solicitacaoService
      .rejeitarServico(atual.id, this.motivoRejeicaoControl.value.trim())
      .subscribe((atualizada) => {
        this.enviandoRejeicao.set(false);
        if (atualizada) {
          this.solicitacao.set(atualizada);
        }
        this.etapa.set('servicoRejeitado');
      });
  }

  /** Ao clicar OK nas mensagens de sucesso, volta para a Página Inicial do Cliente (RF003). */
  protected voltarParaInicio(): void {
    this.router.navigate(['/']);
  }

  protected formatarMoeda(valor: number | undefined): string {
    if (valor === undefined) {
      return '';
    }
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  protected formatarDataHora(data: Date | undefined): string {
    if (!data) {
      return '';
    }
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
      timeStyle: 'short',
    }).format(data);
  }
}
