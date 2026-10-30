import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Solicitacao } from '../models/solicitacao.model';
import { SolicitacaoService } from './solicitacao.service';

export interface LinhaReceita {
  chave: string;
  rotulo: string;    
  quantidade: number;
  total: number;
}

@Injectable({ providedIn: 'root' })
export class RelatorioService {
  private readonly solicitacaoService = inject(SolicitacaoService);

  /** RF019 - receita agrupada por dia do pagamento */
  receitaPorDia(inicio: string, fim: string): Observable<LinhaReceita[]> {
    return this.solicitacaoService.listarTodas().pipe(
      map((lista) => {
        const grupos = new Map<string, LinhaReceita>();
        for (const s of this.pagas(lista)) {
          const dia = this.dia(s.dataHoraPagamento!);
          if ((inicio && dia < inicio) || (fim && dia > fim)) continue;
          this.somar(grupos, dia, this.formatarDia(dia), s.valorOrcamento!);
        }
        return [...grupos.values()].sort((a, b) => a.chave.localeCompare(b.chave));
      }),
    );
  }

  /** RF020 - receita de sempre, agrupada por categoria. */
  receitaPorCategoria(): Observable<LinhaReceita[]> {
    return this.solicitacaoService.listarTodas().pipe(
      map((lista) => {
        const grupos = new Map<string, LinhaReceita>();
        for (const s of this.pagas(lista)) {
          this.somar(grupos, s.categoriaEquipamento, s.categoriaEquipamento, s.valorOrcamento!);
        }
        return [...grupos.values()].sort((a, b) => a.rotulo.localeCompare(b.rotulo));
      }),
    );
  }

  gerarPdf(titulo: string, subtitulo: string, colunaRotulo: string, linhas: LinhaReceita[], arquivo: string): void {
    const totalGeral = linhas.reduce((acc, l) => acc + l.total, 0);
    const qtdGeral = linhas.reduce((acc, l) => acc + l.quantidade, 0);

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(titulo, 14, 18);
    doc.setFontSize(10);
    doc.text(subtitulo, 14, 25);
    doc.text(`Gerado em ${new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(new Date())}`, 14, 30);

    autoTable(doc, {
      startY: 36,
      head: [[colunaRotulo, 'Qtd. de serviços', 'Receita']],
      body: linhas.map((l) => [l.rotulo, String(l.quantidade), this.formatarMoeda(l.total)]),
      foot: [['Total', String(qtdGeral), this.formatarMoeda(totalGeral)]],
      headStyles: { fillColor: [59, 130, 246] },
      footStyles: { fillColor: [226, 232, 240], textColor: 20 },
      columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' } },
    });

    doc.save(arquivo);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
  }

  private pagas(lista: Solicitacao[]): Solicitacao[] {
    return lista.filter((s) => !!s.dataHoraPagamento && s.valorOrcamento !== undefined);
  }

  private somar(grupos: Map<string, LinhaReceita>, chave: string, rotulo: string, valor: number): void {
    const atual = grupos.get(chave) ?? { chave, rotulo, quantidade: 0, total: 0 };
    atual.quantidade += 1;
    atual.total += valor;
    grupos.set(chave, atual);
  }

  private dia(data: Date): string {
    const m = String(data.getMonth() + 1).padStart(2, '0');
    const d = String(data.getDate()).padStart(2, '0');
    return `${data.getFullYear()}-${m}-${d}`;
  }

  private formatarDia(chave: string): string {
    const [a, m, d] = chave.split('-');
    return `${d}/${m}/${a}`;
  }
}