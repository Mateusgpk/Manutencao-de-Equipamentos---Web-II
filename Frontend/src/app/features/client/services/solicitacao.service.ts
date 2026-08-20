import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import {
  EstadoSolicitacao,
  Solicitacao,
} from '../models/solicitacao.model';

@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private readonly solicitacoes = signal<Solicitacao[]>([
    {
      id: 1,
      dataHoraAbertura: new Date('2026-08-10T09:15:00'),
      descricaoEquipamento: 'Notebook Dell Inspiron 15',
      categoriaEquipamento: 'Notebook',
      descricaoDefeito: 'Não liga mais, tela permanece preta mesmo conectado na energia.',
      estado: EstadoSolicitacao.ORCADA,
      clienteNome: 'João',
      valorOrcamento: 350.9,
      dataHoraOrcamento: new Date('2026-08-11T14:02:00'),
      funcionarioOrcamento: 'Maria',
      historico: [
        {
          dataHora: new Date('2026-08-10T09:15:00'),
          estado: EstadoSolicitacao.ABERTA,
        },
        {
          dataHora: new Date('2026-08-11T14:02:00'),
          estado: EstadoSolicitacao.ORCADA,
          funcionario: 'Maria',
        },
      ],
    },
  ]);

  /** Busca uma solicitação pelo id (RF005 / RF008). */
  getById(id: number): Observable<Solicitacao | undefined> {
    return of(this.solicitacoes().find((s) => s.id === id));
  }

  /** RF006 - Aprovar Serviço: solicitação passa para o estado APROVADA. */
  aprovarServico(id: number): Observable<Solicitacao | undefined> {
    this.solicitacoes.update((lista) =>
      lista.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: EstadoSolicitacao.APROVADA,
              historico: [
                ...s.historico,
                { dataHora: new Date(), estado: EstadoSolicitacao.APROVADA },
              ],
            }
          : s,
      ),
    );
    return this.getById(id);
  }

  /** RF007 - Rejeitar Serviço: solicitação passa para o estado REJEITADA, com motivo. */
  rejeitarServico(id: number, motivo: string): Observable<Solicitacao | undefined> {
    this.solicitacoes.update((lista) =>
      lista.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: EstadoSolicitacao.REJEITADA,
              motivoRejeicao: motivo,
              historico: [
                ...s.historico,
                {
                  dataHora: new Date(),
                  estado: EstadoSolicitacao.REJEITADA,
                  observacao: motivo,
                },
              ],
            }
          : s,
      ),
    );
    return this.getById(id);
  }
}
