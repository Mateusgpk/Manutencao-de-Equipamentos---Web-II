import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { ComponentCadastro } from '../components/component-cadastro/component-cadastro';
import { ComponentLogin } from '../components/component-login/component-login';
@Component({
  selector: 'forms-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,ComponentCadastro, ComponentLogin],
  templateUrl:`./forms-cadastro.html`,
})
export class FormsCadastroComponent {
  tamanho="h-165";
  abaAtiva: 'login' | 'cadastro' = 'cadastro'; 

constructor(private router: Router) {}

  ngOnInit() {
    if (this.router.url === '/login') {
      this.trocarAba('login');
    } else if (this.router.url === '/cadastro') {
      this.trocarAba('cadastro');
    }
  }

  trocarAba(aba: 'login' | 'cadastro') {
    this.abaAtiva = aba;
    this.tamanho = aba === 'login' ? 'h-70' : 'h-165';
     this.router.navigate([`/${aba}`]);
  }
}