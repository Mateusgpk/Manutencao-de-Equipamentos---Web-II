import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ReceitaDia { dia: string; quantidade: number; total: number; }
export interface ReceitaCategoria { categoria: string; quantidade: number; total: number; }

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly http = inject(HttpClient);
  private readonly url = 'http://localhost:8080/api/relatorios';

  receitaPorDia(inicio: string, fim: string): Observable<ReceitaDia[]> {
    return this.http.get<ReceitaDia[]>(`${this.url}/receitas`, { params: this.params(inicio, fim) });
  }

  receitaPorCategoria(): Observable<ReceitaCategoria[]> {
    return this.http.get<ReceitaCategoria[]>(`${this.url}/categorias`);
  }

  baixarPdfReceitas(inicio: string, fim: string): void {
    this.baixar(`${this.url}/receitas/pdf`, 'relatorio-receitas.pdf', this.params(inicio, fim));
  }

  baixarPdfCategorias(): void {
    this.baixar(`${this.url}/categorias/pdf`, 'relatorio-categorias.pdf');
  }

  private params(inicio: string, fim: string): Record<string, string> {
    const p: Record<string, string> = {};
    if (inicio) p['inicio'] = inicio;
    if (fim) p['fim'] = fim;
    return p;
  }

  private baixar(url: string, nome: string, params: Record<string, string> = {}): void {
    this.http.get(url, { params, responseType: 'blob' }).subscribe((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = nome;
      a.click();
      URL.revokeObjectURL(a.href);
    });
  }
}