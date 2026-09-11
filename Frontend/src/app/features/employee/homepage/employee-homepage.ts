import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-homepage',
  imports: [RouterLink],
  templateUrl: './employee-homepage.html',
  styleUrl: './employee-homepage.css',
})
export class EmployeeHomepage implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  solicitacoesAbertas: Solicitacao[] = [];

  ngOnInit(): void {
    this.solicitacaoService.listarTodas().subscribe((solicitacoes) => {
      this.solicitacoesAbertas = solicitacoes
        .filter((solicitacao) => solicitacao.estado === EstadoSolicitacao.ABERTA)
        .sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime());
    });
  }

  limitar(descricao: string): string {
    return descricao.length > 30 ? `${descricao.slice(0, 27)}...` : descricao;
  }

  dataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }
}
