import { CurrencyPipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ReceitaCategoria, RelatorioService } from '../../../../shared/services/relatorio.service';

@Component({
  selector: 'app-relatorio-categorias',
  imports: [CurrencyPipe],
  templateUrl: './relatorio-categorias.html',
  styleUrl: './relatorio-categorias.css',
})
export class RelatorioCategorias implements OnInit {
  private readonly relatorioService = inject(RelatorioService);

  protected readonly linhas = signal<ReceitaCategoria[]>([]);
  protected readonly total = computed(() => this.linhas().reduce((acc, l) => acc + l.total, 0));
  protected readonly quantidade = computed(() => this.linhas().reduce((acc, l) => acc + l.quantidade, 0));

  ngOnInit(): void {
    this.relatorioService.receitaPorCategoria().subscribe((l) => this.linhas.set(l));
  }

  protected gerarPdf(): void {
    this.relatorioService.baixarPdfCategorias();
  }
}