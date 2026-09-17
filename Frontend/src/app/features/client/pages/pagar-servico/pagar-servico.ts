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
}