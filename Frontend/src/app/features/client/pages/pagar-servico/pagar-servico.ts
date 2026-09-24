import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
 
import {
  ESTADO_SOLICITACAO_LABEL,
  EstadoSolicitacao,
  Solicitacao,
} from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
 
/** Passos pelos quais a tela pode passar (RF010). */
type Etapa =
  | 'carregando'
  | 'naoEncontrada'
  | 'pagamento'
  | 'confirmandoPagamento'
  | 'pagamentoConfirmado';
 
@Component({
  selector: 'app-pagar-servico',
  imports: [RouterLink],
  templateUrl: './pagar-servico.html',
  styleUrl: './pagar-servico.css',
})
export class PagarServico implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
 
  protected readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
 
  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviandoPagamento = signal(false);
  oi(){}
  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
 
    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }
 
    this.solicitacaoService.getById(id).subscribe((solicitacao) => {
      if (!solicitacao || solicitacao.estado !== EstadoSolicitacao.ARRUMADA) {
        this.etapa.set('naoEncontrada');
        return;
      }
 
      this.solicitacao.set(solicitacao);
      this.etapa.set('pagamento');
    });
  }

  /** Abre a confirmacao, primeiro passo do RF010. */
  protected abrirConfirmacaoPagamento(): void {
    this.etapa.set('confirmandoPagamento');
  }

  /** Permite fechar a confirmacao de pagamento apertando Esc, sem precisar do mouse. */
  @HostListener('document:keydown.escape')
  protected aoPressionarEsc(): void {
    if (this.etapa() === 'confirmandoPagamento' && !this.enviandoPagamento()) {
      this.cancelarConfirmacao();
    }
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

    this.enviandoPagamento.set(true);

    this.solicitacaoService.pagarServico(atual.id).subscribe((atualizada) => {
      this.enviandoPagamento.set(false);
      if (atualizada) {
        this.solicitacao.set(atualizada);
      }
      this.etapa.set('pagamentoConfirmado');
    });
  }

  /** Ao clicar OK na mensagem de sucesso, volta para a Pagina Inicial do Cliente. */
  protected voltarParaInicio(): void {
    this.router.navigate(['/home']);
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