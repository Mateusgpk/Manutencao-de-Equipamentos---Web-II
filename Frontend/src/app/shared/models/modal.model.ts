export type ModalTipo = 'sucesso' | 'erro' | 'aviso' | 'info' | 'confirmacao';

export interface ModalOpcoes {
  titulo: string;
  mensagem: string;
  tipo?: ModalTipo;
  textoConfirmar?: string;
  textoCancelar?: string;
  icone?: string;
}

export interface ModalEstado {
  opcoes: ModalOpcoes;
  resolve: (valor: boolean) => void;
}
