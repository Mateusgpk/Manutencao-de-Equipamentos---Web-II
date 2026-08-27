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
    this.service.listarTodas().subscribe((lista) => {
      this.solicitacoes = [...lista].sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
    });
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
}
