import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, FuncionarioApi, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { ModalService } from '../../../../shared/services/modal.service';
import { Autenticador } from '../../../../shared/services/auth/autenticador';

type Etapa = 'carregando' | 'naoEncontrada' | 'formulario' | 'manutencaoRegistrada' | 'redirecionada';

const ESTADOS_PERMITIDOS = [EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA];

@Component({
  selector: 'app-efetuar-manutencao',
  imports: [ReactiveFormsModule, RouterLink, DatePipe],
  templateUrl: './EfetuarManutencao.html',
  styleUrl: './EfetuarManutencao.css',
})
export class EfetuarManutencao implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly autenticador = inject(Autenticador);
  private readonly modalService = inject(ModalService);

  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviando = signal(false);

  protected readonly mostrarFormularioManutencao = signal(false);
  protected readonly mostrarModalRedirecionar = signal(false);

  protected readonly funcionariosDisponiveis = signal<FuncionarioApi[]>([]);

  protected readonly descricaoManutencaoControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
  });

  protected readonly orientacoesClienteControl = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.minLength(5)],
  });

  protected readonly funcionarioDestinoControl = new FormControl<number | null>(null, {
    validators: [Validators.required],
  });

  private funcionarioLogadoId(): number | null {
    const logado = this.autenticador.usuarioLogado;
    if (!logado || logado.user.role !== 'FUNCIONARIO' || logado.id == null) {
      return null;
    }
    return Number(logado.id);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }

    this.solicitacaoService.getByIdNoBackend(id).subscribe((solicitacao) => {
      if (!solicitacao || !ESTADOS_PERMITIDOS.includes(solicitacao.estado)) {
        this.etapa.set('naoEncontrada');
        return;
      }

      const meuId = this.funcionarioLogadoId();
      if (
        solicitacao.estado === EstadoSolicitacao.REDIRECIONADA &&
        meuId != null &&
        solicitacao.funcionarioDestinoId !== meuId
      ) {
        this.etapa.set('naoEncontrada');
        return;
      }

      this.solicitacao.set(solicitacao);
      this.etapa.set('formulario');
    });
  }

  protected abrirFormularioManutencao(): void {
    this.mostrarFormularioManutencao.set(true);
  }

  protected cancelarManutencao(): void {
    this.mostrarFormularioManutencao.set(false);
    this.descricaoManutencaoControl.reset('');
    this.orientacoesClienteControl.reset('');
  }

  protected confirmarManutencao(): void {
    if (this.descricaoManutencaoControl.invalid || this.orientacoesClienteControl.invalid) {
      this.descricaoManutencaoControl.markAsTouched();
      this.orientacoesClienteControl.markAsTouched();
      return;
    }

    const s = this.solicitacao();
    if (!s || this.enviando()) {
      return;
    }

    const meuId = this.funcionarioLogadoId();
    if (meuId == null) {
      this.modalService.aviso('Sessão Expirada', 'Sessão expirada. Faça login novamente.');
      return;
    }

    this.enviando.set(true);

    this.solicitacaoService
      .efetuarManutencao(
        s.id,
        this.descricaoManutencaoControl.value.trim(),
        this.orientacoesClienteControl.value.trim(),
        meuId,
      )
      .subscribe({
        next: (atualizada) => {
          this.enviando.set(false);
          this.solicitacao.set(atualizada);
          this.etapa.set('manutencaoRegistrada');
        },
        error: (err) => {
          this.enviando.set(false);
          this.modalService.erro('Erro na Manutenção', err.error?.message ?? 'Ocorreu um erro ao registrar a manutenção.');
        },
      });
  }

  protected abrirRedirecionamento(): void {
    const meuId = this.funcionarioLogadoId();
    if (meuId == null) {
      this.modalService.aviso('Sessão Expirada', 'Sessão expirada. Faça login novamente.');
      return;
    }

    this.solicitacaoService.listarFuncionariosAtivos().subscribe({
      next: (lista) => {
        this.funcionariosDisponiveis.set(lista.filter((f) => f.id !== meuId));
        this.mostrarModalRedirecionar.set(true);
      },
      error: () => this.modalService.erro('Erro ao Carregar', 'Não foi possível carregar a lista de funcionários.'),
    });
  }

  protected cancelarRedirecionamento(): void {
    this.mostrarModalRedirecionar.set(false);
    this.funcionarioDestinoControl.reset(null);
  }

  protected confirmarRedirecionamento(): void {
    if (this.funcionarioDestinoControl.invalid) {
      this.funcionarioDestinoControl.markAsTouched();
      return;
    }

    const s = this.solicitacao();
    if (!s || this.enviando()) {
      return;
    }

    const meuId = this.funcionarioLogadoId();
    if (meuId == null) {
      this.modalService.aviso('Sessão Expirada', 'Sessão expirada. Faça login novamente.');
      return;
    }

    this.enviando.set(true);

    this.solicitacaoService
      .redirecionarManutencao(s.id, meuId, this.funcionarioDestinoControl.value!)
      .subscribe({
        next: () => {
          this.enviando.set(false);
          this.mostrarModalRedirecionar.set(false);
          this.etapa.set('redirecionada');
        },
        error: (err) => {
          this.enviando.set(false);
          this.modalService.erro('Erro no Redirecionamento', err.error?.message ?? 'Ocorreu um erro ao redirecionar a manutenção.');
        },
      });
  }

  protected voltarParaInicio(): void {
    this.router.navigate(['/employee/home']);
  }
}