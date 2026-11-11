/** Estados possíveis de uma solicitacao */
export enum EstadoSolicitacao{
    ABERTA = 'ABERTA',
    ORCADA = 'ORCADA',
    APROVADA = 'APROVADA',
    REJEITADA = 'REJEITADA',
    REDIRECIONADA = 'REDIRECIONADA',
    ARRUMADA = 'ARRUMADA',
    PAGA = 'PAGA',
    FINALIZADA = 'FINALIZADA',
}

export const ESTADO_SOLICITACAO_LABEL: Record<EstadoSolicitacao, string> = {
    [EstadoSolicitacao.ABERTA]: 'Aberta',
    [EstadoSolicitacao.ORCADA]: 'Orçada',
    [EstadoSolicitacao.APROVADA]: 'Aprovada',
    [EstadoSolicitacao.REJEITADA]: 'Rejeitada',
    [EstadoSolicitacao.REDIRECIONADA]: 'Redirecionada',
    [EstadoSolicitacao.ARRUMADA]: 'Arrumada',
    [EstadoSolicitacao.PAGA]: 'Paga',
    [EstadoSolicitacao.FINALIZADA]: 'Finalizada',
}

export interface HistoricoSolicitacao {
  dataHora: Date;
  estado: EstadoSolicitacao;
  funcionario?: string;
  observacao?: string;
  funcionarioDestino?: string;
}

export interface Solicitacao {
  id: number;
  dataHoraAbertura: Date;
  descricaoEquipamento: string;
  categoriaEquipamento: string;
  descricaoDefeito: string;
  estado: EstadoSolicitacao;

  clienteNome: string;
  clienteCpf: string;
  clienteTelefone: string;
  clienteEndereco: string;

  // Preenchidos ao entrar no estado ORÇADA (RF012)
  valorOrcamento?: number;
  dataHoraOrcamento?: Date;
  funcionarioOrcamento?: string;

  // Preenchido ao entrar no estado REJEITADA (RF007)
  motivoRejeicao?: string;
  dataHoraPagamento?: Date;

  // Preenchido ao entrar no estado ARRUMADA (RF014)
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  dataHoraManutencao?: Date;
  funcionarioManutencao?: string;

  // Preenchido ao entrar no estado REDIRECIONADA (RF015)
  funcionarioDestino?: string;

  // Preenchido ao entrar no estado FINALIZADA (RF016)
  dataHoraFinalizacao?: Date;
  funcionarioFinalizacao?: string;

  historico: HistoricoSolicitacao[];
}

export interface FuncionarioApi {
  id: number;
  name: string;
}

export interface HistoricoApi {
  dataHora: unknown;
  estado: EstadoSolicitacao;
  funcionario?: FuncionarioApi | null;
  observacao?: string | null;
  funcionarioDestino?: FuncionarioApi | null;
}

export interface SolicitacaoApi {
  id: number;
  dataHoraAbertura: unknown;
  descricaoEquipamento: string;
  categoriaEquipamento: { name: string };
  descricaoDefeito: string;
  estado: EstadoSolicitacao;
  cliente: {
    name: string;
    cpf: string;
    telefone: string;
    endereco: string;
    numero: string;
    cidade: string;
    estado: string;
  };
  valorOrcamento?: number | null;
  dataHoraOrcamento?: unknown;
  funcionarioOrcamento?: FuncionarioApi | null;
  motivoRejeicao?: string | null;
  dataHoraPagamento?: unknown;
  descricaoManutencao?: string | null;
  orientacoesCliente?: string | null;
  dataHoraManutencao?: unknown;
  funcionarioManutencao?: FuncionarioApi | null;
  funcionarioDestino?: FuncionarioApi | null;
  historico?: HistoricoApi[] | null;
}

/** Dados enviados na abertura da solicitação */
export interface NovaSolicitacao {
  descricaoEquipamento: string;
  categoriaId: number;
  descricaoDefeito: string;
}