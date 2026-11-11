import { Component, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao, } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
 
/** Passos pelos quais a tela pode passar. */
type Etapa =
  | 'carregando'
  | 'naoEncontrada'
  | 'pagamento'
  | 'confirmandoPagamento'
  | 'pagamentoConfirmado';

@Component({
  selector: 'app-pagar-manuntencao',
  imports: [RouterLink, CurrencyPipe, DatePipe],
  templateUrl: './PagarManuntencao.html',
  styleUrl: './PagarManuntencao.css',
})
export class PagarManuntencao implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
 
  protected readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
 
  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviandoPagamento = signal(false);
  protected readonly erro = signal('');

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
 
    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }
 
    this.solicitacaoService.getByIdNoBackend(id).subscribe((solicitacao) => {
      if (!solicitacao || solicitacao.estado !== EstadoSolicitacao.ARRUMADA) {
        this.etapa.set('naoEncontrada');
        return;
      }
 
      this.solicitacao.set(solicitacao);
      this.etapa.set('pagamento');
    });
  }

  protected abrirConfirmacaoPagamento(): void {
    this.erro.set('');
    this.etapa.set('confirmandoPagamento');
  }

  /** Volta para a tela de pagamento, caso o usuario desista de confirmar. */
  protected cancelarConfirmacao(): void {
    this.etapa.set('pagamento');
  }

  /** RF010 - Pagar Servico, apos o usuario confirmar a acao. */
  protected confirmarPagamento(): void {
    const atual = this.solicitacao();
    if (!atual) {
      return;
    }

    this.erro.set('');
    this.enviandoPagamento.set(true);

    this.solicitacaoService.pagarServico(atual.id).subscribe({
      next: (atualizada) => {
        if (atualizada?.estado !== EstadoSolicitacao.PAGA) {
          this.mostrarErroPagamento();
          return;
        }

        this.enviandoPagamento.set(false);
        this.solicitacao.set(atualizada);
        this.etapa.set('pagamentoConfirmado');
      },
      error: () => this.mostrarErroPagamento(),
    });
  }

  /** Reabilita os botões e avisa o usuário que o pagamento não foi registrado. */
  private mostrarErroPagamento(): void {
    this.enviandoPagamento.set(false);
    this.erro.set('Não foi possível registrar o pagamento. Verifique a conexão e tente novamente.');
  }

  /** Volta para a Pagina Inicial do Cliente. */
  protected voltarParaInicio(): void {
    this.router.navigate(['/home']);
  }
}