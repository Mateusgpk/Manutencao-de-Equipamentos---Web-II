import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; 
import { FormCadastro } from '../../components/form-cadastro/FormCadastro';
import { FormLogin } from '../../components/form-login/FormLogin';

@Component({
  selector: 'cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ,FormCadastro, FormLogin],
  templateUrl:`./cadastro.html`,
})
export class Cadastro {
  tamanho="h-185";
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
    this.tamanho = aba === 'login' ? 'h-70' : 'h-185';
     this.router.navigate([`/${aba}`]);
  }
}