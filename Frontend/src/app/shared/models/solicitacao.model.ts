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
  funcionarioDestino?: string;

  historico: HistoricoSolicitacao[];
}
