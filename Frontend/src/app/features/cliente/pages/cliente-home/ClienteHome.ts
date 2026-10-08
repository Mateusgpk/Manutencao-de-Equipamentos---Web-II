import { Component, inject, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Router } from '@angular/router';
import { Autenticador } from '../../../../shared/services/auth/autenticador';
import { Client } from '../../models/client.model';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-cliente-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe,RouterOutlet],
  templateUrl: './ClienteHome.html',
  styleUrl: './ClienteHome.css',
})
export class ClienteHome implements OnInit {
  private router = inject(Router);
  private loginserver= inject(Autenticador)

  get usuarioLogado(): Client|null {
    if (this.loginserver.usuarioLogado instanceof Client){
    return this.loginserver.usuarioLogado;}
    return null
  }


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
      this.solicitacaoSelecionada = atualizada;
    });
  }

}
