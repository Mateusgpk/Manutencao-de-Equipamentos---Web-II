import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { LinhaReceita, RelatorioService } from '../../../../shared/services/relatorio.service';

@Component({
  selector: 'app-relatorio-categorias',
  imports: [],
  templateUrl: './relatorio-categorias.html',
  styleUrl: './relatorio-categorias.css',
})
export class RelatorioCategorias implements OnInit {
  private readonly relatorioService = inject(RelatorioService);

  protected readonly linhas = signal<LinhaReceita[]>([]);
  protected readonly total = computed(() => this.linhas().reduce((acc, l) => acc + l.total, 0));
  protected readonly quantidade = computed(() => this.linhas().reduce((acc, l) => acc + l.quantidade, 0));

  ngOnInit(): void {
    this.relatorioService.receitaPorCategoria().subscribe((l) => this.linhas.set(l));
  }

  protected gerarPdf(): void {
    this.relatorioService.gerarPdf(
      'Relatório de Receitas por Categoria',
      'Receita desde sempre, agrupada por categoria de equipamento',
      'Categoria',
      this.linhas(),
      'relatorio-categorias.pdf',
    );
  }

  protected moeda(valor: number): string {
    return this.relatorioService.formatarMoeda(valor);
  }
}