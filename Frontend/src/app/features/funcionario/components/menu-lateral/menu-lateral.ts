import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu-lateral',
  imports: [RouterLink],
  templateUrl: './menu-lateral.html',
  styleUrl: './menu-lateral.css',
})
export class MenuLateral {
  menuAberto = false;

alternarMenu() {
  this.menuAberto = !this.menuAberto;
}
}
