import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { EstadoSolicitacao, FuncionarioApi, NovaSolicitacao, Solicitacao, SolicitacaoApi } from '../models/solicitacao.model';

/** Converte a data do backend em Date. */
function paraData(valor: unknown): Date | undefined {
  if (Array.isArray(valor)) {
    const [ano, mes, dia, hora = 0, minuto = 0, segundo = 0] = valor as number[];
    return new Date(ano, mes - 1, dia, hora, minuto, segundo);
  }
  if (typeof valor === 'string' && valor) {
    return new Date(valor);
  }
  return undefined;
}


@Injectable({ providedIn: 'root' })
export class SolicitacaoService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/solicitacoes';

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
        { dataHora: new Date('2026-08-10T09:15:00'), estado: EstadoSolicitacao.ABERTA, },
        { dataHora: new Date('2026-08-11T14:02:00'), estado: EstadoSolicitacao.ORCADA, funcionario: 'Maria', },
      ],
    },
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
        { dataHora: new Date('2026-09-14T20:15:00'), estado: EstadoSolicitacao.ABERTA },
      ],
    },
    {
      id: 6,
      dataHoraAbertura: new Date('2026-09-05T09:15:00'),
      descricaoEquipamento: 'Notebook Lenovo ThinkPad',
      categoriaEquipamento: 'Notebook',
      descricaoDefeito: 'O botão CTRL não está mais funcionando.',
      estado: EstadoSolicitacao.FINALIZADA,
      clienteNome: 'Jonas',
      clienteCpf: '167.908.435-12',
      clienteTelefone: '(41) 99866-8909',
      clienteEndereco: 'Rua João Besciak, 305 - Araucária/PR',
      valorOrcamento: 75.9,
      dataHoraPagamento: new Date('2026-09-12T16:09:00'), 
      dataHoraOrcamento: new Date('2026-09-15T19:59:00'),
      funcionarioOrcamento: 'Maria',
      historico: [
        { dataHora: new Date('2026-09-05T09:15:00'), estado: EstadoSolicitacao.ABERTA, },
        { dataHora: new Date('2026-09-11T14:02:00'), estado: EstadoSolicitacao.ORCADA, funcionario: 'Maria',},
        { dataHora: new Date('2026-09-12T16:09:00'), estado: EstadoSolicitacao.PAGA, },
        { dataHora: new Date('2026-09-13T14:26:00'), estado: EstadoSolicitacao.ARRUMADA, funcionario: 'Maria', },
        { dataHora: new Date('2026-09-14T12:45:00'), estado: EstadoSolicitacao.FINALIZADA, }
      ],
    },
    {
      id: 7,
      dataHoraAbertura: new Date('2026-09-18T08:30:00'),
      descricaoEquipamento: 'Impressora HP DeskJet',
      categoriaEquipamento: 'Impressora',
      descricaoDefeito: 'Não puxa o papel corretamente.',
      estado: EstadoSolicitacao.ARRUMADA,
      clienteNome: 'João',
      clienteCpf: '123.456.789-00',
      clienteTelefone: '(41) 91234-5678',
      clienteEndereco: 'Rua das Flores, 45 - Curitiba/PR',
      valorOrcamento: 180.5,
      dataHoraOrcamento: new Date('2026-09-19T10:00:00'),
      funcionarioOrcamento: 'Mário',
      historico: [
        { dataHora: new Date('2026-09-18T08:30:00'), estado: EstadoSolicitacao.ABERTA, },
        { dataHora: new Date('2026-09-19T10:00:00'),estado: EstadoSolicitacao.ORCADA, funcionario: 'Mário',},
        { dataHora: new Date('2026-09-20T09:15:00'), estado: EstadoSolicitacao.APROVADA, },
        { dataHora: new Date('2026-09-21T14:40:00'), estado: EstadoSolicitacao.ARRUMADA, funcionario: 'Mário',},
      ],
    },
    {
      id: 8,
      dataHoraAbertura: new Date('2026-09-16T10:00:00'),
      descricaoEquipamento: 'Microfone Redragon Seyfert GM300',
      categoriaEquipamento: 'Microfone',
      descricaoDefeito: 'Microfone está com muito chiado.',
      estado: EstadoSolicitacao.APROVADA,
      clienteNome: 'Joaquina',
      clienteCpf: '404.119.570-58',
      clienteTelefone: '(41) 99111-2233',
      clienteEndereco: 'Avenida Paraná, 346 - Acrelândia/AC',
      valorOrcamento: 60,
      dataHoraOrcamento: new Date('2026-09-16T15:00:00'),
      funcionarioOrcamento: 'Mário',
      historico: [
        { dataHora: new Date('2026-09-16T10:00:00'), estado: EstadoSolicitacao.ABERTA },
        { dataHora: new Date('2026-09-16T15:00:00'), estado: EstadoSolicitacao.ORCADA, funcionario: 'Mário' },
        { dataHora: new Date('2026-09-17T09:00:00'), estado: EstadoSolicitacao.APROVADA },
      ],
    },
    {
      id: 9,
      dataHoraAbertura: new Date('2026-09-20T11:00:00'),
      descricaoEquipamento: 'Notebook Acer Aspire A515-45',
      categoriaEquipamento: 'Notebook',
      descricaoDefeito: 'Superaquecendo e desligando sozinho após alguns minutos de uso.',
      estado: EstadoSolicitacao.REDIRECIONADA,
      clienteNome: 'João',
      clienteCpf: '123.456.789-00',
      clienteTelefone: '(41) 91234-5678',
      clienteEndereco: 'Rua Dr. Alcides Vieira Arcoverde, 1225 - Curitiba/PR',
      valorOrcamento: 250.0,
      dataHoraOrcamento: new Date('2026-09-21T09:30:00'),
      funcionarioOrcamento: 'Mário',
      funcionarioDestino: 'Maria',
      historico: [
        { dataHora: new Date('2026-09-20T11:00:00'), estado: EstadoSolicitacao.ABERTA },
        { dataHora: new Date('2026-09-21T09:30:00'), estado: EstadoSolicitacao.ORCADA, funcionario: 'Mário' },
        { dataHora: new Date('2026-09-21T15:00:00'), estado: EstadoSolicitacao.APROVADA },
        {
          dataHora: new Date('2026-09-22T10:00:00'),
          estado: EstadoSolicitacao.REDIRECIONADA,
          funcionario: 'Mário', funcionarioDestino: 'Maria',
          observacao: 'Redirecionado para Maria devido a especialidade no modelo.'
        },
      ],
    },
  ]);

  /** Converte a solicitação do backend para o formato usado pelas telas. */
  private converterDoBackend(api: SolicitacaoApi): Solicitacao {
    const c = api.cliente;
    return {
      id: api.id,
      dataHoraAbertura: paraData(api.dataHoraAbertura) ?? new Date(),
      descricaoEquipamento: api.descricaoEquipamento,
      categoriaEquipamento: api.categoriaEquipamento?.name ?? '',
      descricaoDefeito: api.descricaoDefeito,
      estado: api.estado,

      clienteNome: c?.name ?? '',
      clienteCpf: c?.cpf ?? '',
      clienteTelefone: c?.telefone ?? '',
      clienteEndereco: c ? `${c.endereco}, ${c.numero} - ${c.cidade}/${c.estado}` : '',

      valorOrcamento: api.valorOrcamento ?? undefined,
      dataHoraOrcamento: paraData(api.dataHoraOrcamento),
      funcionarioOrcamento: api.funcionarioOrcamento?.name,

      motivoRejeicao: api.motivoRejeicao ?? undefined,
      dataHoraPagamento: paraData(api.dataHoraPagamento),

      descricaoManutencao: api.descricaoManutencao ?? undefined,
      orientacoesCliente: api.orientacoesCliente ?? undefined,
      dataHoraManutencao: paraData(api.dataHoraManutencao),
      funcionarioManutencao: api.funcionarioManutencao?.name,

      funcionarioDestinoId: api.funcionarioDestino?.id,
      funcionarioDestino: api.funcionarioDestino?.name,

      dataHoraFinalizacao: paraData(api.dataHoraFinalizacao),
      funcionarioFinalizacao: api.funcionarioFinalizacao?.name,

      historico: (api.historico ?? []).map((h) => ({
        dataHora: paraData(h.dataHora) ?? new Date(),
        estado: h.estado,
        funcionario: h.funcionario?.name,
        observacao: h.observacao ?? undefined,
        funcionarioDestino: h.funcionarioDestino?.name,
      })),
    };
  }

  getByIdNoBackend(id: number): Observable<Solicitacao | undefined> {
    return this.http.get<SolicitacaoApi>(`${this.apiUrl}/${id}`).pipe(
      map((api) => this.converterDoBackend(api)),
      catchError(() => of(undefined)),
    );
  }

  listarAbertasNoBackend(): Observable<Solicitacao[]> {
    return this.http
      .get<SolicitacaoApi[]>(`${this.apiUrl}/abertas`)
      .pipe(map((lista) => lista.map((api) => this.converterDoBackend(api))));
  }

  listarPorCliente(clienteId: number): Observable<Solicitacao[]> {
    return this.http
      .get<SolicitacaoApi[]>(`${this.apiUrl}/client/${clienteId}`)
      .pipe(map((lista) => lista.map((api) => this.converterDoBackend(api))));
  }

  /** Abre a solicitação no estado ABERTA. */
  criar(clienteId: number, dados: NovaSolicitacao): Observable<Solicitacao> {
    return this.http
      .post<SolicitacaoApi>(this.apiUrl, dados, { params: { clienteId } })
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  aprovarServico(id: number): Observable<Solicitacao | undefined> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/aprovacao`, {})
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  rejeitarServico(id: number, motivo: string): Observable<Solicitacao | undefined> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/rejeicao`, { motivo })
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  pagarServico(id: number): Observable<Solicitacao | undefined> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/pagamento`, {})
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  listarTodas(): Observable<Solicitacao[]> {
    return this.http
      .get<SolicitacaoApi[]>(this.apiUrl)
      .pipe(map((lista) => lista.map((api) => this.converterDoBackend(api))));
  }

  /** Busca uma solicitação pelo id (RF005 / RF008). */
  getById(id: number): Observable<Solicitacao | undefined> {
    return of(this.solicitacoes().find((s) => s.id === id));
  }

  /** RF009 - Resgatar Serviço: solicitação REJEITADA volta para APROVADA. */
  resgatarServico(id: number): Observable<Solicitacao | undefined> {
    return this.aprovarServico(id);
  }

  /** RF012 - Efetuar Orçamento: ABERTA passa para ORCADA. */
  efetuarOrcamento(
    id: number,
    valor: number,
    funcionarioId: number,
  ): Observable<Solicitacao> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/orcamento`, { funcionarioId, valor })
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  /** RF014 - Efetuar Manutenção: APROVADA/REDIRECIONADA passa para ARRUMADA */
  efetuarManutencao(
    id: number,
    descricaoManutencao: string,
    orientacoesCliente: string,
    funcionarioId: number,
  ): Observable<Solicitacao> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/manutencao`, {
        funcionarioId,
        descricaoManutencao,
        orientacoesCliente,
      })
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  /** RF015 - Redirecionar Manutenção: passa para REDIRECIONADA */
  redirecionarManutencao(
    id: number,
    funcionarioOrigemId: number,
    funcionarioDestinoId: number,
  ): Observable<Solicitacao> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/redirecionamento`, {
        funcionarioOrigemId,
        funcionarioDestinoId,
      })
      .pipe(map((api) => this.converterDoBackend(api)));
  }

  listarFuncionariosAtivos(): Observable<FuncionarioApi[]> {
    return this.http.get<FuncionarioApi[]>('http://localhost:8080/api/employee');
  }

  /** RF016 - Finalizar: PAGA passa para FINALIZADA */
  finalizarSolicitacao(id: number, funcionarioId: number): Observable<Solicitacao> {
    return this.http
      .patch<SolicitacaoApi>(`${this.apiUrl}/${id}/finalizacao`, {}, { params: { funcionarioId } })
      .pipe(map((api) => this.converterDoBackend(api)));
  }
}