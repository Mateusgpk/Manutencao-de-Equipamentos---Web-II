import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-client-homepage',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './client-homepage.html',
  styleUrl: './client-homepage.css',
})
export class ClientHomepage implements OnInit {
  private readonly service = inject(SolicitacaoService);
  readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  readonly EstadoSolicitacao = EstadoSolicitacao;
  solicitacoes: Solicitacao[] = [];

  ngOnInit(): void {
    this.service.listarTodas().subscribe((lista) => this.atualizarSolicitacoes(lista));
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
    const historico = s.historico.map((h) => `${this.dataHora(h.dataHora)} - ${this.estadoLabel[h.estado]}`).join('\n');
    alert(`Solicitação #${s.id}\nEquipamento: ${s.descricaoEquipamento}\nDefeito: ${s.descricaoDefeito}\nEstado: ${this.estadoLabel[s.estado]}\nHistórico:\n${historico}`);
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
      : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(s.valorOrcamento);

    alert(`Pagamento da Solicitação #${s.id}\nValor: ${valor}`);
  }
}
