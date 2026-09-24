import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './ClienteHome.html',
  styleUrl: './ClienteHome.css',
})
export class ClienteHome implements OnInit {
  private readonly service = inject(SolicitacaoService);
  private readonly cpfClienteLogado = '123.456.789-00';
  readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  readonly EstadoSolicitacao = EstadoSolicitacao;
  solicitacoes: Solicitacao[] = [];
  solicitacaoSelecionada?: Solicitacao;

  ngOnInit(): void {
    this.service.listarTodas().subscribe((lista) => {
      this.atualizarSolicitacoes(lista.filter((s) => s.clienteCpf === this.cpfClienteLogado));
    });
  }

  private atualizarSolicitacoes(lista: Solicitacao[]): void {
    this.solicitacoes = [...lista].sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
  }

  limitar(descricao: string): string {
    return descricao.length > 30 ? `${descricao.slice(0, 27)}...` : descricao;
  }

  dataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }

  visualizar(s: Solicitacao): void {
    this.solicitacaoSelecionada = s;
  }

  fecharVisualizacao(): void {
    this.solicitacaoSelecionada = undefined;
  }

  resgatar(s: Solicitacao): void {
    const confirmou = confirm(`Resgatar a solicitação #${s.id} e aprovar o serviço novamente?`);

    if (!confirmou) {
      return;
    }

    this.service.resgatarServico(s.id).subscribe((atualizada) => {
      if (!atualizada) {
        return;
      }

      this.atualizarSolicitacoes(
        this.solicitacoes.map((item) => item.id === atualizada.id ? atualizada : item),
      );
    });
  }

  pagar(s: Solicitacao): void {
    const valor = s.valorOrcamento === undefined
      ? 'valor ainda não informado'
      : this.formatarMoeda(s.valorOrcamento);

    alert(`Pagamento da Solicitação #${s.id}\nValor: ${valor}`);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }
}
