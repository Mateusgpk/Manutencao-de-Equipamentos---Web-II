import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';

@Component({
  selector: 'app-paginacao',
  standalone: true,
  template: `
    @if (total > porPagina) {
      <nav class="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm" aria-label="Paginação">
        <p class="text-slate-500">Mostrando {{ primeiro }}–{{ ultimo }} de {{ total }}</p>

        <div class="flex items-center gap-1">
          <button type="button" (click)="ir(pagina - 1)" [disabled]="pagina <= 1"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            Anterior
          </button>

          @for (p of paginas; track $index) {
            @if (p === 0) {
              <span class="px-1 text-slate-400">…</span>
            } @else {
              <button type="button" (click)="ir(p)"
                class="min-w-9 rounded-lg border px-3 py-1.5 transition"
                [class]="p === pagina
                  ? 'border-blue-600 bg-blue-600 font-medium text-white'
                  : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'">
                {{ p }}
              </button>
            }
          }

          <button type="button" (click)="ir(pagina + 1)" [disabled]="pagina >= totalPaginas"
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            Próxima
          </button>
        </div>
      </nav>
    }
  `,
})
export class PaginacaoComponent implements OnChanges {
  @Input() total = 0;
  @Input() pagina = 1;
  @Input() porPagina = 8;
  @Output() paginaChange = new EventEmitter<number>();

  get totalPaginas(): number {
    return Math.max(1, Math.ceil(this.total / this.porPagina));
  }

  get primeiro(): number {
    return this.total === 0 ? 0 : (this.pagina - 1) * this.porPagina + 1;
  }

  get ultimo(): number {
    return Math.min(this.pagina * this.porPagina, this.total);
  }

  /** Números das páginas; 0 representa as reticências. */
  get paginas(): number[] {
    const t = this.totalPaginas;
    const c = this.pagina;
    if (t <= 7) return Array.from({ length: t }, (_, i) => i + 1);

    const ordenadas = [...new Set([1, t, c - 1, c, c + 1].filter((p) => p >= 1 && p <= t))].sort((a, b) => a - b);
    const resultado: number[] = [];
    ordenadas.forEach((p, i) => {
      if (i > 0 && p - ordenadas[i - 1] > 1) resultado.push(0);
      resultado.push(p);
    });
    return resultado;
  }

  ngOnChanges(): void {
    if (this.pagina > this.totalPaginas) {
      Promise.resolve().then(() => this.paginaChange.emit(this.totalPaginas));
    }
  }

  ir(p: number): void {
    if (p >= 1 && p <= this.totalPaginas && p !== this.pagina) this.paginaChange.emit(p);
  }
}