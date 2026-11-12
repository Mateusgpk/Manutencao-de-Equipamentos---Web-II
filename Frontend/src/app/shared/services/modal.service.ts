import { Injectable, signal } from '@angular/core';
import { ModalEstado, ModalOpcoes, ModalTipo } from '../models/modal.model';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private estado = signal<ModalEstado | null>(null);

  readonly modalAtivo = this.estado.asReadonly();

  abrir(opcoes: ModalOpcoes): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const tipo: ModalTipo = opcoes.tipo ?? 'info';
      const textoConfirmar = opcoes.textoConfirmar ?? (tipo === 'confirmacao' ? 'Confirmar' : 'OK');
      const textoCancelar = opcoes.textoCancelar ?? 'Cancelar';

      this.estado.set({
        opcoes: {
          ...opcoes,
          tipo,
          textoConfirmar,
          textoCancelar,
        },
        resolve,
      });
    });
  }

  sucesso(titulo: string, mensagem: string, textoBotao = 'OK'): Promise<boolean> {
    return this.abrir({ titulo, mensagem, tipo: 'sucesso', textoConfirmar: textoBotao });
  }

  erro(titulo: string, mensagem: string, textoBotao = 'OK'): Promise<boolean> {
    return this.abrir({ titulo, mensagem, tipo: 'erro', textoConfirmar: textoBotao });
  }

  aviso(titulo: string, mensagem: string, textoBotao = 'OK'): Promise<boolean> {
    return this.abrir({ titulo, mensagem, tipo: 'aviso', textoConfirmar: textoBotao });
  }

  info(titulo: string, mensagem: string, textoBotao = 'OK'): Promise<boolean> {
    return this.abrir({ titulo, mensagem, tipo: 'info', textoConfirmar: textoBotao });
  }

  confirmar(
    titulo: string,
    mensagem: string,
    textoConfirmar = 'Confirmar',
    textoCancelar = 'Cancelar'
  ): Promise<boolean> {
    return this.abrir({
      titulo,
      mensagem,
      tipo: 'confirmacao',
      textoConfirmar,
      textoCancelar,
    });
  }

  confirmarAcao(): void {
    const atual = this.estado();
    if (atual) {
      this.estado.set(null);
      atual.resolve(true);
    }
  }

  cancelarAcao(): void {
    const atual = this.estado();
    if (atual) {
      this.estado.set(null);
      atual.resolve(false);
    }
  }
}
