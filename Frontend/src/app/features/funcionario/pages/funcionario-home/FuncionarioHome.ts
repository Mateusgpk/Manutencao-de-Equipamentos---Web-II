import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Autenticador } from '../../../../shared/services/auth/autenticador';

type Filtro = 'todas' | 'hoje' | 'periodo';

const COR_ESTADO: Record<EstadoSolicitacao, string> = {
  ABERTA: 'bg-slate-100',
  ORCADA: 'bg-amber-900/10',
  REJEITADA: 'bg-red-100',
  APROVADA: 'bg-yellow-100',
  REDIRECIONADA: 'bg-purple-100',
  ARRUMADA: 'bg-blue-100',
  PAGA: 'bg-orange-100',
  FINALIZADA: 'bg-green-100',
};

function dia(data: Date): string {
  const mes = String(data.getMonth() + 1).padStart(2, '0');
  const d = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${mes}-${d}`;
}

@Component({
  selector: 'app-funcionario-homepage',
  imports: [RouterLink, DatePipe, SlicePipe],
  templateUrl: './FuncionarioHome.html',
  styleUrl: './FuncionarioHome.css',
})
export class FuncionarioHome implements OnInit {
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly autenticador = inject(Autenticador);
  private readonly route = inject(ActivatedRoute);

  protected readonly EstadoSolicitacao = EstadoSolicitacao;
  protected readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  protected readonly corEstado = COR_ESTADO;

  protected readonly visaoAbertas = signal(true);
  protected readonly filtro = signal<Filtro>('todas');
  protected readonly inicio = signal('');
  protected readonly fim = signal('');
  protected readonly erro = signal('');

  private readonly todas = signal<Solicitacao[]>([]);
  protected readonly solicitacaoSelecionada = signal<Solicitacao | undefined>(undefined);
  protected readonly solicitacaoParaFinalizar = signal<Solicitacao | undefined>(undefined);

  protected readonly solicitacoes = computed(() => {
    const lista = this.todas();
    const filtro = this.filtro();

    if (this.visaoAbertas() || filtro === 'todas') {
      return lista;
    }

    if (filtro === 'hoje') {
      const hoje = dia(new Date());
      return lista.filter((s) => dia(s.dataHoraAbertura) === hoje);
    }

    const inicio = this.inicio();
    const fim = this.fim();
    return lista.filter((s) => {
      const abertura = dia(s.dataHoraAbertura);
      return (!inicio || abertura >= inicio) && (!fim || abertura <= fim);
    });
  });

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.visaoAbertas.set(params.get('visao') !== 'todas');
      this.filtro.set('todas');
      this.inicio.set('');
      this.fim.set('');
      this.carregar();
    });
  }

  private carregar(): void {
    const meuId = this.autenticador.usuarioLogado?.id;
    const origem = this.visaoAbertas()
      ? this.solicitacaoService.listarAbertasNoBackend()
      : this.solicitacaoService.listarTodasNoBackend();

    origem.subscribe({
      next: (lista) => {
        this.erro.set('');
        this.todas.set(
          lista
            .filter((s) => s.estado !== EstadoSolicitacao.REDIRECIONADA || s.funcionarioDestinoId === meuId)
            .sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime()),
        );
      },
      error: () => this.erro.set('Não foi possível carregar as solicitações.'),
    });
  }

  visualizarHistorico(solicitacao: Solicitacao): void {
    this.solicitacaoSelecionada.set(solicitacao);
  }

  fecharHistorico(): void {
    this.solicitacaoSelecionada.set(undefined);
  }

  abrirFinalizacao(solicitacao: Solicitacao): void {
    this.solicitacaoParaFinalizar.set(solicitacao);
  }

  cancelarFinalizacao(): void {
    this.solicitacaoParaFinalizar.set(undefined);
  }

  confirmarFinalizacao(): void {
    const s = this.solicitacaoParaFinalizar();
    const funcionarioId = this.autenticador.usuarioLogado?.id;
    if (!s || funcionarioId == null) {
      alert('Sessão expirada. Faça login novamente.');
      return;
    }

    this.solicitacaoService.finalizarSolicitacao(s.id, Number(funcionarioId)).subscribe({
      next: () => {
        this.solicitacaoParaFinalizar.set(undefined);
        this.carregar();
      },
      error: (err) => alert(err.error?.message ?? 'Ocorreu um erro ao finalizar a solicitação.'),
    });
  }
}