import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuLateral } from '../menu-lateral/menu-lateral';

@Component({
  selector: 'app-layout',
  imports: [MenuLateral,RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.css',
})
export class Layout {

}
