import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticador } from '../../services/auth';
import {CommonModule} from '@angular/common'

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {
  private autentica=inject(Autenticador)
  private router = inject(Router)
  get logado(): boolean {
    return !!this.autentica.usuarioLogado;
  }
  usuario = this.autentica.usuarioLogado;
  
  menuAberto: boolean = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
  acao(){
    this.autentica.logout()
    this.router.navigate(['/login']);
  }

}
