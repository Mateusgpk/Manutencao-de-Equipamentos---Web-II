import { Component, inject, OnInit, signal } from '@angular/core';
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
    if (this.loginserver.usuarioLogado?.user.role === 'CLIENTE') {
     return this.loginserver.usuarioLogado as Client;}
    return null
  }


  private readonly service = inject(SolicitacaoService);
  readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  readonly EstadoSolicitacao = EstadoSolicitacao;
  readonly solicitacoes = signal<Solicitacao[]>([]);
  readonly solicitacaoSelecionada = signal<Solicitacao | undefined>(undefined);
  readonly erro = signal('');

  ngOnInit(): void {
    const clienteId = Number(this.usuarioLogado?.id);

    if (!clienteId) {
      return;
    }

    this.service.listarPorCliente(clienteId).subscribe({
      next: (lista) => this.atualizarSolicitacoes(lista),
      error: () => this.erro.set('Não foi possível carregar as solicitações. Verifique a conexão e tente novamente.'),
    });
  }

  private atualizarSolicitacoes(lista: Solicitacao[]): void {
    this.solicitacoes.set([...lista].sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime()));
  }

  limitar(descricao: string): string {
    return descricao.length > 30 ? `${descricao.slice(0, 27)}...` : descricao;
  }

  dataHora(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }

  visualizar(s: Solicitacao): void {
    this.solicitacaoSelecionada.set(s);
  }

  fecharVisualizacao(): void {
    this.solicitacaoSelecionada.set(undefined);
  }

  resgatar(s: Solicitacao): void {
    const confirmou = confirm(`Resgatar a solicitação #${s.id} e aprovar o serviço novamente?`);

    if (!confirmou) {
      return;
    }

    this.erro.set('');

    this.service.resgatarServico(s.id).subscribe({
      next: (atualizada) => {
        if (!atualizada) {
          return;
        }

        this.atualizarSolicitacoes(
          this.solicitacoes().map((item) => item.id === atualizada.id ? atualizada : item),
        );
        this.solicitacaoSelecionada.set(atualizada);
      },
      error: () => { 
        this.solicitacaoSelecionada.set(undefined);
        this.erro.set('Não foi possível resgatar o serviço. Verifique a conexão e tente novamente.');
      },
    });
  }

}