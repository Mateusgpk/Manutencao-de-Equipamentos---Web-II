import { Component, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EstadoSolicitacao, Solicitacao } from '../../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../../shared/services/solicitacao.service';

type Etapa = 'carregando' | 'naoEncontrada' | 'formulario' | 'manutencaoRegistrada';

const ESTADOS_PERMITIDOS = [EstadoSolicitacao.APROVADA, EstadoSolicitacao.REDIRECIONADA];

@Component({
    selector: 'app-efetuar-manutencao',
    imports: [ReactiveFormsModule, RouterLink],
    templateUrl: './EfetuarManutencao.html',
    styleUrl: './EfetuarManutencao.css',
})

export class EfetuarManutencao implements OnInit {
    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly solicitacaoService = inject(SolicitacaoService);

    protected readonly etapa = signal<Etapa>('carregando');
    protected readonly solicitacao = signal<Solicitacao | undefined>(undefined);
    protected readonly enviando = signal(false);


    protected readonly mostrarFormularioManutencao = signal(false);

    private readonly funcionarioLogado = 'Maria'; // implementar: pegar do login do funcionário logado

    protected readonly descricaoManutencaoControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
    });

    protected readonly orientacoesClienteControl = new FormControl<string>('', {
        nonNullable: true,
        validators: [Validators.required, Validators.minLength(5)],
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

        this.enviando.set(true);

        this.solicitacaoService
            .efetuarManutencao(
                s.id,
                this.descricaoManutencaoControl.value,
                this.orientacoesClienteControl.value,
                this.funcionarioLogado,
            )
            .subscribe({
                next: (atualizada) => {
                    this.enviando.set(false);
                    if (atualizada) {
                        this.solicitacao.set(atualizada);
                    }
                    this.etapa.set('manutencaoRegistrada');
                },
                error: () => {
                    this.enviando.set(false);
                    alert('Ocorreu um erro ao registrar a manutenção.');
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