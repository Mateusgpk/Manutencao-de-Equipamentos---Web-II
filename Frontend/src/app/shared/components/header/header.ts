import { Component, inject, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Autenticador } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {
  private autentica=inject(Autenticador)
  private router = inject(Router)
  get logado(): boolean {
    return !!this.autentica.usuarioLogado;
  }
  acao(){
    this.autentica.logout()
    this.router.navigate(['/login']);
  }

}
