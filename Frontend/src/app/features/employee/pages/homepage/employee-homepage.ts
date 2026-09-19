import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './employee-homepage.html',
  styleUrl: './employee-homepage.css',
})
export class EmployeeHomepage implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly funcionarioLogado = 'Maria'; private todasSolicitacoes: Solicitacao[] = [];
  readonly EstadoSolicitacao = EstadoSolicitacao; readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  filtro: 'hoje' | 'periodo' | 'todas' = 'todas';
  inicio = ''; fim = '';
  solicitacoesAbertas: Solicitacao[] = [];
  solicitacaoSelecionada?: Solicitacao;

  ngOnInit(): void {
    this.solicitacaoService.listarTodas().subscribe((solicitacoes) => {
      this.todasSolicitacoes = solicitacoes
        .filter((s) => s.estado !== EstadoSolicitacao.REDIRECIONADA || s.funcionarioDestino === this.funcionarioLogado)
        .sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
      this.aplicarFiltros();
    });
  }

  aplicarFiltros(): void {
    const hoje = this.dia(new Date());
    this.solicitacoesAbertas = this.todasSolicitacoes.filter((s) => {
      const abertura = this.dia(s.dataHoraAbertura);
      return this.filtro === 'todas' || (this.filtro === 'hoje' && abertura === hoje) || ((!this.inicio || abertura >= this.inicio) && (!this.fim || abertura <= this.fim));
    });
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

  corEstado(estado: EstadoSolicitacao): string { return ({ ABERTA: 'bg-slate-100', ORCADA: 'bg-amber-900/10', REJEITADA: 'bg-red-100', APROVADA: 'bg-yellow-100', REDIRECIONADA: 'bg-purple-100', ARRUMADA: 'bg-blue-100', PAGA: 'bg-orange-100', FINALIZADA: 'bg-green-100' } as Record<EstadoSolicitacao, string>)[estado]; }
  private dia(data: Date): string { return data.toISOString().slice(0, 10); }
}
