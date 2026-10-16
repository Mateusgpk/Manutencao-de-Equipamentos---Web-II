import { Component, inject, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Autenticador } from '../../services/auth';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css'
})

export class Header {
  private autentica=inject(Autenticador)
  logado: boolean = !!this.autentica.usuarioLogado;
  acao(){
    console.log("aoooo")
    this.autentica.logout()
    this.autentica.autentica()
  }

}
