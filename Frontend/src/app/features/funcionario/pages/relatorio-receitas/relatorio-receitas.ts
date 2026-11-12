import { CurrencyPipe, DatePipe, SlicePipe } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ReceitaDia, RelatorioService } from '../../../../shared/services/relatorio.service';
import { PaginacaoComponent } from '../../../../shared/components/paginacao/paginacao';

@Component({
  selector: 'app-relatorio-receitas',
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe, PaginacaoComponent, SlicePipe],
  templateUrl: './relatorio-receitas.html',
  styleUrl: './relatorio-receitas.css',
})

export class RelatorioReceitas implements OnInit {
  private readonly relatorioService = inject(RelatorioService);

  protected readonly linhas = signal<ReceitaDia[]>([]);
  protected readonly periodoInvalido = signal(false);
  protected readonly total = computed(() => this.linhas().reduce((acc, l) => acc + l.total, 0));
  protected readonly quantidade = computed(() => this.linhas().reduce((acc, l) => acc + l.quantidade, 0));

  protected readonly inicioControl = new FormControl<string>('', { nonNullable: true });
  protected readonly fimControl = new FormControl<string>('', { nonNullable: true });

  pagina = signal(1);
  readonly porPagina = 8;

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
    this.relatorioService.baixarPdfReceitas(this.inicioControl.value, this.fimControl.value);
  }
}