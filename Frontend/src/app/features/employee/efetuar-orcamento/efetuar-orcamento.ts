import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { InputTexto } from '../../../shared/component/input-texto/input-texto';

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
    // implementar
  }

  protected voltarParaInicio(): void {
    this.router.navigate(['/employee/home']);
  }

  protected formatarDataHora(data: Date | undefined): string {
    if (!data) return '';
    return new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(data);
  }
}