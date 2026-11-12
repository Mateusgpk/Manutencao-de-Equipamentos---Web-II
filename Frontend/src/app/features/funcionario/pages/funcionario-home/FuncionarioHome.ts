import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe, SlicePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { ESTADO_SOLICITACAO_LABEL, EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Autenticador } from '../../../../shared/services/auth/autenticador';
import { ModalService } from '../../../../shared/services/modal.service';

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

/** yyyy-MM-dd no fuso local (toISOString usaria UTC e deslocaria o dia). */
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
  private readonly modalService = inject(ModalService);
  private readonly route = inject(ActivatedRoute);

  protected readonly EstadoSolicitacao = EstadoSolicitacao;
  protected readonly estadoLabel = ESTADO_SOLICITACAO_LABEL;
  protected readonly corEstado = COR_ESTADO;

  /** true = Home (só ABERTAS, RF011); false = Solicitações (todas + filtros, RF013). */
  protected readonly visaoAbertas = signal(true);
  protected readonly filtro = signal<Filtro>('todas');
  protected readonly inicio = signal('');
  protected readonly fim = signal('');
  protected readonly erro = signal('');

  private readonly todas = signal<Solicitacao[]>([]);
  protected readonly solicitacaoSelecionada = signal<Solicitacao | undefined>(undefined);
  protected readonly solicitacaoParaFinalizar = signal<Solicitacao | undefined>(undefined);
  protected readonly finalizando = signal(false);

  /** Lido na hora do uso porque o localStorage só existe no navegador. */
  private get funcionarioLogadoId(): number | null {
    const id = this.autenticador.usuarioLogado?.id;
    return id == null ? null : Number(id);
  }

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
    const meuId = this.funcionarioLogadoId;
    const origem = this.visaoAbertas()
      ? this.solicitacaoService.listarAbertasNoBackend()
      : this.solicitacaoService.listarTodas();

    origem.subscribe({
      next: (lista) => {
        this.erro.set('');
        this.todas.set(
          lista
            // REDIRECIONADA só aparece para o funcionário de destino
            .filter((s) => s.estado !== EstadoSolicitacao.REDIRECIONADA || s.funcionarioDestinoId === meuId)
            .sort((a, b) => a.dataHoraAbertura.getTime() - b.dataHoraAbertura.getTime()),
        );
      },
      error: () => this.erro.set('Não foi possível carregar as solicitações. Verifique a conexão e tente novamente.'),
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

  async confirmarFinalizacao(): Promise<void> {
    const s = this.solicitacaoParaFinalizar();
    if (!s || this.finalizando()) return;

    const funcionarioId = this.funcionarioLogadoId;
    if (funcionarioId == null) {
      this.solicitacaoParaFinalizar.set(undefined);
      this.erro.set('Sessão expirada. Faça login novamente.');
      return;
    }

    this.erro.set('');
    this.finalizando.set(true);

    try {
      await firstValueFrom(
        this.solicitacaoService.finalizarSolicitacao(s.id, funcionarioId)
      );
      this.finalizando.set(false);
      this.solicitacaoParaFinalizar.set(undefined);
      await this.modalService.sucesso(
        'Solicitação Finalizada',
        `A solicitação #${s.id} foi finalizada com sucesso!`
      );
      this.carregar();
    } catch (err: any) {
      this.finalizando.set(false);
      this.solicitacaoParaFinalizar.set(undefined);
      this.modalService.erro(
        'Erro ao Finalizar',
        err.error?.message ?? 'Não foi possível finalizar a solicitação. Tente novamente.'
      );
    }
  }
}