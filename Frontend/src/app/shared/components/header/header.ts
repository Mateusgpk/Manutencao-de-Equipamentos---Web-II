import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticador } from '../../services/auth';
import { CommonModule } from '@angular/common';
import { Client } from '../../../features/cliente/models/client.model';
import { Employee } from '../../../features/funcionario/models/employee.model';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  private autentica = inject(Autenticador);
  private router = inject(Router);

  get logado(): boolean {
    return !!this.autentica.usuarioLogado;
  }

  get usuario(): Employee | Client | null {
    return this.autentica.usuarioLogado;
  }
  
  menuAberto: boolean = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  acao() {
    this.menuAberto = false;
    this.autentica.logout();
    this.router.navigate(['/login']);
  }
}
