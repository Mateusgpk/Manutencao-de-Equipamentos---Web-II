import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { Autenticador } from '../../../../shared/services/auth/autenticador';

type Etapa = 'carregando' | 'naoEncontrada' | 'formulario' | 'orcamentoRegistrado';

@Component({
  selector: 'app-efetuar-orcamento',
  imports: [ReactiveFormsModule, RouterLink, InputTexto, DatePipe],
  templateUrl: './EfetuarOrcamento.html',
  styleUrl: './EfetuarOrcamento.css',
})
export class EfetuarOrcamento implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly autenticador = inject(Autenticador);
  private readonly modalService = inject(ModalService);

  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviando = signal(false);

  protected readonly valorControl = new FormControl<number | null>(null, {
    validators: [Validators.required, Validators.min(0.01)],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }

    this.solicitacaoService.getByIdNoBackend(id).subscribe((solicitacao) => {
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

    const funcionario = this.autenticador.usuarioLogado;
    if (!funcionario || funcionario.user.role !== 'FUNCIONARIO') {
      this.modalService.aviso('Sessão Expirada', 'Sessão expirada. Faça login novamente.');
      return;
    }

    this.enviando.set(true);

    this.solicitacaoService
      .efetuarOrcamento(s.id, this.valorControl.value!, Number(funcionario.id!))
      .subscribe({
        next: async (atualizada) => {
          this.enviando.set(false);
          await this.modalService.sucesso(
            'Orçamento Registrado',
            `Orçamento da solicitação #${s.id} foi registrado com sucesso!`
          );
          this.router.navigate(['/employee/home']);
        },
        error: (err) => {
          this.enviando.set(false);
          this.modalService.erro('Erro no Orçamento', err.error?.message ?? 'Ocorreu um erro ao registrar o orçamento.');
        },
      });
  }

  protected voltarParaInicio(): void {
    this.router.navigate(['/employee/home']);
  }
}