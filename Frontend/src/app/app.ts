import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './shared/components/header/header';
import { CadastroComponent } from './features/Autocadastro/pages/cadastro';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, CadastroComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Frontend');
}
