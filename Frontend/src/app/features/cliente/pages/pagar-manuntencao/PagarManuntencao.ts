import { Component, HostListener, computed, inject, OnInit, signal } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
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
  | 'pagamentoConfirmado'
  | 'pixGerado';
 
/** Confere se o cartão não está vencido (vale até o fim do mês informado). */
function validadeCartaoValidator(control: AbstractControl): ValidationErrors | null {
  const partes = /^(\d{2})\/(\d{2})$/.exec(control.value ?? '');
  if (!partes) {
    return null;
  }

  const mes = Number(partes[1]);
  const ano = 2000 + Number(partes[2]);
  const hoje = new Date();
  const vencido = ano < hoje.getFullYear() || (ano === hoje.getFullYear() && mes < hoje.getMonth() + 1);

  return vencido ? { cartaoVencido: true } : null;
}

@Component({
  selector: 'app-pagar-manuntencao',
  imports: [RouterLink, CurrencyPipe, DatePipe, ReactiveFormsModule],
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

  /** Forma de pagamento escolhida. */
  protected readonly metodo = signal<'cartao' | 'pix'>('cartao');

  /** Formulário do cartão (os dados ficam só no front, nada é enviado). */
  protected readonly cartaoForm = new FormGroup({
    numero: new FormControl('', [Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]),
    validade: new FormControl('', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/), validadeCartaoValidator]),
    cvc: new FormControl('', [Validators.required, Validators.pattern(/^\d{3,4}$/)]),
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  /** Código Pix "copia e cola". */
  protected readonly codigoPix = computed(() => {
    const s = this.solicitacao();
    if (!s) {
      return '';
    }
    return (
      '00020126580014br.gov.bcb.pix0136pix@manutencao.exemplo.com' +
      `5204000053039865406${(s.valorOrcamento ?? 0).toFixed(2)}5802BR` +
      `5923MANUTENCAO EQUIPAMENTOS6008CURITIBA62100506SOL${String(s.id).padStart(3, '0')}6304A1B2`
    );
  });

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

  protected selecionarMetodo(metodo: 'cartao' | 'pix'): void {
    this.metodo.set(metodo);
  }

  // Máscaras dos campos do cartão
  protected mascararNumero(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 16);
    this.cartaoForm.controls.numero.setValue(digitos.replace(/(\d{4})(?=\d)/g, '$1 '));
  }

  protected mascararValidade(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.cartaoForm.controls.validade.setValue(
      digitos.length > 2 ? `${digitos.slice(0, 2)}/${digitos.slice(2)}` : digitos,
    );
  }

  protected mascararCvc(evento: Event): void {
    const digitos = (evento.target as HTMLInputElement).value.replace(/\D/g, '').slice(0, 4);
    this.cartaoForm.controls.cvc.setValue(digitos);
  }

  /** Mostra o erro do campo só depois que o usuário mexeu nele. */
  protected campoInvalido(nome: 'numero' | 'validade' | 'cvc' | 'nome'): boolean {
    const campo = this.cartaoForm.controls[nome];
    return campo.invalid && campo.touched;
  }

  /** Abre a confirmacao, primeiro passo do RF010. */
  protected abrirConfirmacaoPagamento(): void {
    if (this.metodo() === 'cartao' && this.cartaoForm.invalid) {
      this.cartaoForm.markAllAsTouched();
      return;
    }

    this.erro.set('');
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
        this.etapa.set(this.metodo() === 'pix' ? 'pixGerado' : 'pagamentoConfirmado');
      },
      error: () => this.mostrarErroPagamento(),
    });
  }

  /** Reabilita os botões e avisa o usuário que o pagamento não foi registrado. */
  private mostrarErroPagamento(): void {
    this.enviandoPagamento.set(false);
    this.erro.set('Não foi possível registrar o pagamento. Verifique a conexão e tente novamente.');
  }

  /** Ao fechar o modal (sucesso ou código Pix), volta para a Pagina Inicial do Cliente. */
  protected voltarParaInicio(): void {
    this.router.navigate(['/home']);
  }
}