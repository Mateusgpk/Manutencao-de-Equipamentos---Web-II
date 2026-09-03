/** Estados possíveis de uma solicitacao */
export enum EstadoSolicitacao{
    ABERTA = 'ABERTA',
    ORCADA = 'ORCADA',
    APROVADA = 'APROVADA',
    REJEITADA = 'REJEITADA',
    ARRUMADA = 'ARRUMADA',
}

export const ESTADO_SOLICITACAO_LABEL: Record<EstadoSolicitacao, string> = {
    [EstadoSolicitacao.ABERTA]: 'Aberta',
    [EstadoSolicitacao.ORCADA]: 'Orçada',
    [EstadoSolicitacao.APROVADA]: 'Aprovada',
    [EstadoSolicitacao.REJEITADA]: 'Rejeitada',
    [EstadoSolicitacao.ARRUMADA]: 'Arrumada',
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

  historico: HistoricoSolicitacao[];
}
