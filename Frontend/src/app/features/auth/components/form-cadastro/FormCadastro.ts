import { Component, inject, OnInit, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apicep } from '../../services/apicep';
import { takeUntil } from 'rxjs/internal/operators/takeUntil';
import { distinctUntilChanged } from 'rxjs/internal/operators/distinctUntilChanged';
import { debounceTime } from 'rxjs/internal/operators/debounceTime';
import { Subject } from 'rxjs/internal/Subject';
import { BtnSubmit } from '../../../../shared/components/btn-submit/btn-submit';
import { InputTexto } from '../../../../shared/components/input-texto/input-texto';
import { CommonModule } from '@angular/common';
import { Client } from '../../../../features/cliente/models/client.model';
import { User } from '../../../../shared/models/user.model';

import { CpfValidator } from '../../../../shared/validators/cpf.validator';
import { Autenticador } from '../../../../shared/services/auth/autenticador';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-form-cadastro',
  imports: [CommonModule, ReactiveFormsModule, InputTexto, BtnSubmit],
  templateUrl: './FormCadastro.html',
  styleUrl: './FormCadastro.css',
})
export class FormCadastro implements OnInit {
  private loginAutenticador = inject(Autenticador);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  message!: string;

  formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    /* TODO: de acordo com documentação, a senha seria mandada por email, não cadastrada
    Logo, tirar daqui depois de implementar */
    cpf: new FormControl('', [
      Validators.required,
      Validators.maxLength(14),
      Validators.minLength(14),
      CpfValidator.validar(),
    ]),
    telefone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^\(?\d{2}\)?\s?(9\d{4}|[2-8]\d{3})\-?\d{4}$/),
    ]),
    cep: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.pattern(/^\d{5}-?\d{3}$/)]),
    endereco: new FormControl('', Validators.required),
    numero: new FormControl('', Validators.required),
    complemento: new FormControl(''),
    bairro: new FormControl('', Validators.required),
    cidade: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
  });
  dadosCep: any;

  constructor(private apicep: Apicep) {}

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loginAutenticador.autentica()

    this.formCadastro.controls.cep.valueChanges
      .pipe(
        debounceTime(400), // Aguarda 400ms de inatividade após o último clique
        distinctUntilChanged(), // Só emite se o texto atual for diferente do anterior
        takeUntil(this.destroy$), // Cancela a inscrição quando o componente sumir
      )
      .subscribe((valor) => {
        this.executarAcao(valor);
      });
  }

  validacep = /^[0-9]{8}$/;
  executarAcao(texto: string | null): void {
    console.log('O usuário parou de digitar. Texto final:', texto);

    const cep = (texto ?? '').replace(/\D/g, '');

    if (cep.length === 8) {
      if (this.validacep.test(cep)) {
        this.apicep.obterDados(cep).subscribe({
          next: (resposta) => {
            this.dadosCep = resposta;
            this.formCadastro.patchValue({
              endereco: this.dadosCep.logradouro,
              bairro: this.dadosCep.bairro,
              cidade: this.dadosCep.localidade,
              estado: this.dadosCep.uf,
            });
          },
        });
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  corfundo: string = 'bg-blue-800';
  piscar: string = '';
  readonly enviando = signal(false);
  readonly erro = signal('');

  async aoEnviar() {
    this.piscar = 'piscando';
    if (this.formCadastro.valid) {
      if (this.enviando()) return;

      this.formCadastro.value.cpf = this.formCadastro.value.cpf?.replace(/[.-]/g, '');
      console.log('Dados enviados:', this.formCadastro.value);
      const user = {
        name:this.formCadastro.value.nome,
        cpf:this.formCadastro.value.cpf,
        email:this.formCadastro.value.email,
        telefone:this.formCadastro.value.telefone,
        cep:this.formCadastro.value.cep,
        numero:this.formCadastro.value.numero,
        complemento:this.formCadastro.value.complemento,
        endereco:this.formCadastro.value.endereco,
        bairro:this.formCadastro.value.bairro,
        cidade:this.formCadastro.value.cidade,
        estado:this.formCadastro.value.estado,
      };
      this.erro.set('');
      this.enviando.set(true);

      this.loginAutenticador.inserirCliente(user).subscribe({
        next: () => {
          this.enviando.set(false);
          alert('Cadastro realizado com sucesso! A senha de acesso foi enviada para o seu e-mail.');
          this.router.navigate(['/login']);
        },
        error: (resposta: HttpErrorResponse) => {
          this.enviando.set(false);
          this.erro.set(this.mensagemErro(resposta));
        },
      });
    }
  }

  /** Traduz a recusa do backend em mensagem para o usuário. */
  private mensagemErro(resposta: HttpErrorResponse): string {
    const corpo = resposta.error;
    const recusa = [400, 409, 502].includes(resposta.status);

    // Regra de negócio recusada: o motivo vem em "error" (ex.: "CPF já cadastrado.").
    if (recusa && typeof corpo?.error === 'string' && corpo.error !== 'Bad Request') return corpo.error;

    // Falha no envio da senha por e-mail: o motivo vem em "message".
    if (recusa && typeof corpo?.message === 'string' && corpo.message) return corpo.message;

    if (resposta.status === 400) return 'Dados inválidos. Confira os campos e tente novamente.';

    return 'Não foi possível concluir o cadastro. Verifique a conexão e tente novamente.';
  }
}
