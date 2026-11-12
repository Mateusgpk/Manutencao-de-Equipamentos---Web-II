import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { ModalTipo } from '../../models/modal.model';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.css',
})
export class Modal {
  protected readonly modalService = inject(ModalService);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.modalService.modalAtivo()) {
      this.modalService.cancelarAcao();
    }
  }

  getIconClass(tipo?: ModalTipo): string {
    switch (tipo) {
      case 'sucesso':
        return 'fa-solid fa-circle-check text-emerald-500';
      case 'erro':
        return 'fa-solid fa-circle-xmark text-rose-500';
      case 'aviso':
        return 'fa-solid fa-triangle-exclamation text-amber-500';
      case 'confirmacao':
        return 'fa-solid fa-circle-question text-sky-500';
      case 'info':
      default:
        return 'fa-solid fa-circle-info text-sky-500';
    }
  }

  getHeaderBg(tipo?: ModalTipo): string {
    switch (tipo) {
      case 'sucesso':
        return 'bg-emerald-50/80 text-emerald-900 border-emerald-100';
      case 'erro':
        return 'bg-rose-50/80 text-rose-900 border-rose-100';
      case 'aviso':
        return 'bg-amber-50/80 text-amber-900 border-amber-100';
      case 'confirmacao':
        return 'bg-sky-50/80 text-sky-900 border-sky-100';
      case 'info':
      default:
        return 'bg-sky-50/80 text-sky-900 border-sky-100';
    }
  }
}
