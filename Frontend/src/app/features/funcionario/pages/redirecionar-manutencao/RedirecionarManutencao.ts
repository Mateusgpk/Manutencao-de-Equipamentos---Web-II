import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';
import { Employee } from '../../models/employee.model';
import { EmployeeService } from '../../services/employee.service';

type Etapa = 'carregando' | 'naoEncontrada' | 'formulario' | 'redirecionado';

/** Estados a partir dos quais é permitido redirecionar a manutenção (RF013 / RF014). */
const ESTADOS_PERMITIDOS = [EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA];

@Component({
  selector: 'app-redirecionar-manutencao',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './redirecionar-manutencao.html',
  styleUrl: './redirecionar-manutencao.css',
})
export class RedirecionarManutencao implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly solicitacaoService = inject(SolicitacaoService);
  private readonly employeeService = inject(EmployeeService);

  protected readonly etapa = signal<Etapa>('carregando');
  protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
  protected readonly enviando = signal(false);
  protected funcionariosDisponiveis: Employee[] = [];

  // implementar: pegar do login do funcionário logado
  private readonly funcionarioLogadoId = 1;
  private readonly funcionarioLogadoNome = 'Maria';

  protected readonly funcionarioDestinoControl = new FormControl<number | null>(null, {
    validators: [Validators.required],
  });

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (!id) {
      this.etapa.set('naoEncontrada');
      return;
    }

    this.solicitacaoService.getById(id).subscribe((solicitacao) => {
      if (!solicitacao || !ESTADOS_PERMITIDOS.includes(solicitacao.estado)) {
        this.etapa.set('naoEncontrada');
        return;
      }

      this.solicitacao.set(solicitacao);
      this.funcionariosDisponiveis = this.employeeService.listAllExcept(this.funcionarioLogadoId);
      this.etapa.set('formulario');
    });
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

    const destinoId = this.funcionarioDestinoControl.value!;
    const destino = this.funcionariosDisponiveis.find((f) => f.id === destinoId);
    if (!destino) {
      return;
    }

    this.enviando.set(true);

    this.solicitacaoService
      .redirecionarManutencao(s.id, this.funcionarioLogadoNome, destino.name)
      .subscribe({
        next: (atualizada) => {
          this.enviando.set(false);
          if (atualizada) {
            this.solicitacao.set(atualizada);
          }
          this.etapa.set('redirecionado');
        },
        error: () => {
          this.enviando.set(false);
          alert('Ocorreu um erro ao redirecionar a manutenção.');
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
