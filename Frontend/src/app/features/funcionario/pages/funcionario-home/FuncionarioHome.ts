import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Autenticador } from '../../../../shared/services/auth/autenticador';

@Component({
  selector: 'app-funcionario-homepage',
  imports: [RouterLink],
  templateUrl: './FuncionarioHome.html',
  styleUrl: './FuncionarioHome.css',
})
export class FuncionarioHome implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly autenticador = inject(Autenticador);
  private todasSolicitacoes: Solicitacao[] = [];
  readonly EstadoSolicitacao = EstadoSolicitacao; readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  filtro: 'hoje' | 'periodo' | 'todas' = 'todas';
  inicio = ''; fim = '';
  readonly solicitacoesAbertas = signal<Solicitacao[]>([]);
  solicitacaoSelecionada?: Solicitacao;
  readonly solicitacaoParaFinalizar = signal<Solicitacao | undefined>(undefined);
  readonly finalizando = signal(false);
  readonly erro = signal('');

  private get funcionarioLogadoId(): number {
    return Number(this.autenticador.usuarioLogado?.id);
  }

  ngOnInit(): void {
    this.carregar();
  }

  private carregar(): void {
    const funcionarioId = this.funcionarioLogadoId;

    this.solicitacaoService.listarTodas().subscribe({
      next: (solicitacoes) => {
        this.todasSolicitacoes = solicitacoes
          .filter((s) => s.estado !== EstadoSolicitacao.REDIRECIONADA || s.funcionarioDestinoId === funcionarioId)
          .sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
        this.aplicarFiltros();
      },
      error: () => this.erro.set('Não foi possível carregar as solicitações. Verifique a conexão e tente novamente.'),
    });
  }

  aplicarFiltros(): void {
    const hoje = this.dia(new Date());
    this.solicitacoesAbertas.set(this.todasSolicitacoes.filter((s) => {
      const abertura = this.dia(s.dataHoraAbertura);
      return this.filtro === 'todas' || (this.filtro === 'hoje' && abertura === hoje) || ((!this.inicio || abertura >= this.inicio) && (!this.fim || abertura <= this.fim));
    }));
  }

  limitar(descricao: string): string {
    return descricao.length > 30 ? `${descricao.slice(0, 27)}...` : descricao;
  }

  dataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }

  visualizarHistorico(solicitacao: Solicitacao): void {
    this.solicitacaoSelecionada = solicitacao;
  }

  fecharHistorico(): void {
    this.solicitacaoSelecionada = undefined;
  }

  abrirFinalizacao(solicitacao: Solicitacao): void {
    this.solicitacaoParaFinalizar.set(solicitacao);
  }

  cancelarFinalizacao(): void {
    this.solicitacaoParaFinalizar.set(undefined);
  }

  confirmarFinalizacao(): void {
    const s = this.solicitacaoParaFinalizar();
    if (!s || this.finalizando()) return;

    this.erro.set('');
    this.finalizando.set(true);

    this.solicitacaoService
      .finalizarSolicitacao(s.id, this.funcionarioLogadoId)
      .subscribe({
        next: () => {
          this.finalizando.set(false);
          this.solicitacaoParaFinalizar.set(undefined);
          this.carregar();
        },
        error: () => {
          // Fecha a confirmação para a mensagem de erro ficar visível.
          this.finalizando.set(false);
          this.solicitacaoParaFinalizar.set(undefined);
          this.erro.set('Não foi possível finalizar a solicitação. Verifique a conexão e tente novamente.');
        },
      });
  }

  corEstado(estado: EstadoSolicitacao): string { return ({ ABERTA: 'bg-slate-100', ORCADA: 'bg-amber-900/10', REJEITADA: 'bg-red-100', APROVADA: 'bg-yellow-100', REDIRECIONADA: 'bg-purple-100', ARRUMADA: 'bg-blue-100', PAGA: 'bg-orange-100', FINALIZADA: 'bg-green-100' } as Record<EstadoSolicitacao, string>)[estado]; }
  private dia(data: Date): string { return data.toISOString().slice(0, 10); }
}
