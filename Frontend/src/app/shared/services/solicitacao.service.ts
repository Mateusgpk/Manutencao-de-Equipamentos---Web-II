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
      clienteCpf: '123.456.789-00',
      clienteTelefone: '(41) 91234-5678',
      clienteEndereco: 'Rua Dr. Alcides Vieira Arcoverde, 1225 - Curitiba/PR',
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
    // Solicitação ABERTA para testes.
    {
      id: 2,
      dataHoraAbertura: new Date('2026-08-20T09:15:00'),
      descricaoEquipamento: 'Impressora HP LaserJet',
      categoriaEquipamento: 'Impressora',
      descricaoDefeito: 'A impressora morreu :(',
      estado: EstadoSolicitacao.ABERTA,
      clienteNome: 'José',
      clienteCpf: '987.654.321-00',
      clienteTelefone: '(41) 98765-4321',
      clienteEndereco: 'Av. Vitor do Amaral - Araucária/PR',
      historico: [
        { dataHora: new Date('2026-08-20T09:15:00'), estado: EstadoSolicitacao.ABERTA },
      ],
    },
    {
      id: 3,
      dataHoraAbertura: new Date('2026-08-12T10:30:00'),
      descricaoEquipamento: 'Desktop Lenovo ThinkCentre',
      categoriaEquipamento: 'Desktop',
      descricaoDefeito: 'A tela fica piscando direto e em alguns até mesmo apaga completamente.',
      estado: EstadoSolicitacao.PAGA,
      clienteNome: 'Joana',
      clienteCpf: '143.543.235-12',
      clienteTelefone: '(41) 90874-5464',
      clienteEndereco: 'Rua João sei lá, 187 - Araucária/PR',
      valorOrcamento: 420,
      dataHoraPagamento: new Date('2026-08-14T16:20:00'),
      historico: [
        { dataHora: new Date('2026-08-12T10:30:00'), estado: EstadoSolicitacao.ABERTA },
        { dataHora: new Date('2026-08-13T09:10:00'), estado: EstadoSolicitacao.ORCADA, funcionario: 'Maria' },
        { dataHora: new Date('2026-08-14T16:20:00'), estado: EstadoSolicitacao.PAGA },
      ],
    },
    {
      id: 4,
      dataHoraAbertura: new Date('2026-08-15T08:45:00'),
      descricaoEquipamento: 'Teclado Logitech K120',
      categoriaEquipamento: 'Teclado',
      descricaoDefeito: 'Teclas não estão digitando as letras que quero.',
      estado: EstadoSolicitacao.PAGA,
      clienteNome: 'Maria',
      clienteCpf: '555.666.777-88',
      clienteTelefone: '(41) 90000-2222',
      clienteEndereco: 'Av. Bolacha, 254 - Curitiba/PR',
      valorOrcamento: 95,
      dataHoraPagamento: new Date('2026-08-16T11:05:00'),
      historico: [
        { dataHora: new Date('2026-08-15T08:45:00'), estado: EstadoSolicitacao.ABERTA },
        { dataHora: new Date('2026-08-16T11:05:00'), estado: EstadoSolicitacao.PAGA },
      ],
    },
    {
      id: 5,
      dataHoraAbertura: new Date('2026-09-14T20:15:00'),
      descricaoEquipamento: 'Mouse logitech',
      categoriaEquipamento: 'Mouse',
      descricaoDefeito: 'Mouse está falhando constantemente no botão direito.',
      estado: EstadoSolicitacao.ABERTA,
      clienteNome: 'Miles',
      clienteCpf: '453.564.232-56',
      clienteTelefone: '(41) 98763-9763',
      clienteEndereco: 'Rua Homem Aranha, 453 - Nova York',
      historico: [
        {dataHora: new Date('2026-09-14T20:15:00'), estado:
          EstadoSolicitacao.ABERTA },
      ],
    },
    {
      id: 6,
      dataHoraAbertura: new Date('2026-08-10T09:15:00'),
      descricaoEquipamento: 'Notebook Lenovo ThinkPad',
      categoriaEquipamento: 'Notebook',
      descricaoDefeito: 'O botão CTRL não está mais funcionando.',
      estado: EstadoSolicitacao.FINALIZADA,
      clienteNome: 'Jonas',
      clienteCpf: '167.908.435-12',
      clienteTelefone: '(41) 99866-8909',
      clienteEndereco: 'Rua João Besciak, 305 - Araucária/PR',
      valorOrcamento: 75.9,
      dataHoraOrcamento: new Date('2026-09-15T19:59:00'),
      funcionarioOrcamento: 'Maria',
      historico: [
        {
          dataHora: new Date('2026-09-10T09:15:00'),
          estado: EstadoSolicitacao.ABERTA,
        },
        {
          dataHora: new Date('2026-09-11T14:02:00'),
          estado: EstadoSolicitacao.ORCADA,
          funcionario: 'Maria',
        },
        { dataHora: new Date('2026-09-13T16:09:00'),
          estado: EstadoSolicitacao.PAGA,
        },
        { dataHora: new Date('2026-09-14T14:26:00'),
          estado: EstadoSolicitacao.ARRUMADA,
        },
        { dataHora: new Date('2026-09-15T12:45:00'),
          estado: EstadoSolicitacao.FINALIZADA,
        }
      ],
    },
  ]);

  listarTodas(): Observable<Solicitacao[]> { return of([...this.solicitacoes()]); }

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

  /** RF009 - Resgatar Serviço: solicitação REJEITADA volta para APROVADA. */
  resgatarServico(id: number): Observable<Solicitacao | undefined> {
    this.solicitacoes.update((lista) =>
      lista.map((s) =>
        s.id === id && s.estado === EstadoSolicitacao.REJEITADA
          ? {
              ...s,
              estado: EstadoSolicitacao.APROVADA,
              historico: [
                ...s.historico,
                {
                  dataHora: new Date(),
                  estado: EstadoSolicitacao.APROVADA,
                  observacao: 'Serviço resgatado pelo cliente',
                },
              ],
            }
          : s,
      ),
    );
    return this.getById(id);
  }

  /** RF012 - Efetuar Orçamento: solicitação ABERTA passa para ORÇADA*/
  efetuarOrcamento(
    id: number,
    valorOrcamento: number,
    funcionario: string,
  ): Observable<Solicitacao | undefined> {
    const agora = new Date();

    this.solicitacoes.update((lista) =>
      lista.map((s) =>
        s.id === id
          ? {
              ...s,
              estado: EstadoSolicitacao.ORCADA,
              valorOrcamento : valorOrcamento,
              dataHoraOrcamento: agora,
              funcionarioOrcamento: funcionario,
              historico: [
                ...s.historico,
                {
                  dataHora: agora,
                  estado: EstadoSolicitacao.ORCADA,
                  funcionario: funcionario
                },
              ],
            }
          : s,
      ),
    );

    return this.getById(id);
  }
}
