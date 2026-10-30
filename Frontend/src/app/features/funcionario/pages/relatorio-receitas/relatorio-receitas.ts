import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LinhaReceita, RelatorioService } from '../../../../shared/services/relatorio.service';

@Component({
  selector: 'app-relatorio-receitas',
  imports: [ReactiveFormsModule],
  templateUrl: './relatorio-receitas.html',
  styleUrl: './relatorio-receitas.css',
})
export class RelatorioReceitas implements OnInit {
  private readonly relatorioService = inject(RelatorioService);

  protected readonly linhas = signal<LinhaReceita[]>([]);
  protected readonly periodoInvalido = signal(false);
  protected readonly total = computed(() => this.linhas().reduce((acc, l) => acc + l.total, 0));
  protected readonly quantidade = computed(() => this.linhas().reduce((acc, l) => acc + l.quantidade, 0));

  protected readonly inicioControl = new FormControl<string>('', { nonNullable: true });
  protected readonly fimControl = new FormControl<string>('', { nonNullable: true });

  ngOnInit(): void {
    this.filtrar();
  }

  protected filtrar(): void {
    const inicio = this.inicioControl.value;
    const fim = this.fimControl.value;

    if (inicio && fim && inicio > fim) {
      this.periodoInvalido.set(true);
      return;
    }

    this.periodoInvalido.set(false);
    this.relatorioService.receitaPorDia(inicio, fim).subscribe((l) => this.linhas.set(l));
  }

  protected limpar(): void {
    this.inicioControl.reset('');
    this.fimControl.reset('');
    this.filtrar();
  }

  protected gerarPdf(): void {
    const inicio = this.formatar(this.inicioControl.value);
    const fim = this.formatar(this.fimControl.value);
    const periodo = `Período: ${inicio || 'início'} a ${fim || 'hoje'}`;

    this.relatorioService.gerarPdf(
      'Relatório de Receitas por Dia',
      periodo,
      'Data',
      this.linhas(),
      'relatorio-receitas.pdf',
    );
  }

  protected moeda(valor: number): string {
    return this.relatorioService.formatarMoeda(valor);
  }

  private formatar(iso: string): string {
    if (!iso) return '';
    const [a, m, d] = iso.split('-');
    return `${d}/${m}/${a}`;
  }
}