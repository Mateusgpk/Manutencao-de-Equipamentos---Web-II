import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';

type Etapa = 'carregando' | 'naoEncontrada' | 'formulario' | 'orcamentoRegistrado';

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [ReactiveFormsModule, RouterLink, InputTexto],
  templateUrl: './efetuar-orcamento.html',
  styleUrl: './efetuar-orcamento.css',
})
export class EfetuarOrcamento implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);

  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviando = signal(false);

  private readonly funcionarioLogado = 'Maria'; // implementar: pegar do login do funcionário logado

  protected readonly valorControl = new FormControl<number | null>(null, {
    validators: [Validators.required, Validators.min(0.01)],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }

    this.solicitacaoService.getById(id).subscribe((solicitacao) => {
      if (!solicitacao || solicitacao.estado !== EstadoSolicitacao.ABERTA) {
        this.etapa.set('naoEncontrada');
        return;
      }

      this.solicitacao.set(solicitacao);
      this.etapa.set('formulario');
    });
  }

  protected confirmarOrcamento(): void {
    if (this.valorControl.invalid) {
      this.valorControl.markAsTouched();
      return;
    }

    const s = this.solicitacao();
    if (!s || this.enviando()) {
      return;
    }

    const valor = this.valorControl.value!;
    this.enviando.set(true);

    this.solicitacaoService
      .efetuarOrcamento(s.id, valor, this.funcionarioLogado)
      .subscribe({
        next: (atualizada) => {
          this.enviando.set(false);
          if (atualizada) {
            this.solicitacao.set(atualizada);
          }
          this.etapa.set('orcamentoRegistrado');
        },
        error: () => {
          this.enviando.set(false);
          alert('Ocorreu um erro ao registrar o orçamento.');
        },
      });
  }

  protected voltarParaInicio(): void {
    this.router.navigate(['/employee/home']);
  }

  protected formatarDataHora(data: Date | undefined): string {
    if (!data) return '';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }
}