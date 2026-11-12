import { Component, OnInit, ViewChild, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { ModalService } from '../../../../shared/services/modal.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoryService = inject(CategoryService);
  private readonly modalService = inject(ModalService);

  @ViewChild('formCategoria') formulario!: NgForm;

  readonly categorias = signal<Category[]>([]);
  readonly emEdicao = signal(false);
  readonly enviando = signal(false);
  readonly erro = signal('');
  categoria: Category = new Category();

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.categoryService.listarCategorias().subscribe({
      next: (categorias) => this.categorias.set(categorias),
      error: () => this.erro.set('Não foi possível carregar as categorias. Verifique a conexão e tente novamente.'),
    });
  }

  editarCategoria(categoria: Category): void {
    this.categoria = { ...categoria };
    this.emEdicao.set(true);
    this.erro.set('');
  }

  salvarCategoria(): void {
    if (!this.formulario.form.valid || this.enviando()) {
      return;
    }

    this.categoria.name = this.categoria.name.trim();
    this.erro.set('');
    this.enviando.set(true);

    const requisicao = this.emEdicao()
      ? this.categoryService.atualizar(this.categoria)
      : this.categoryService.inserir(this.categoria);

    requisicao.subscribe({
      next: () => {
        this.enviando.set(false);
        this.cancelarEdicao();
        this.listarTodos();
      },
      error: (resposta: HttpErrorResponse) => {
        this.enviando.set(false); 
        this.erro.set(
          resposta.status === 409
            ? 'A categoria já existe.'
            : 'Não foi possível salvar a categoria. Verifique a conexão e tente novamente.',
        );
      },
    });
  }


  get TotalCategorias(): number {
    return this.categorias().length;
  }

  cancelarEdicao(): void {
    this.categoria = new Category();
    this.emEdicao.set(false);
    this.formulario.resetForm();
    this.erro.set('');
  }

  async removerCategoria(categoria: Category): Promise<void> {
    const confirmou = await this.modalService.confirmar(
      'Remover Categoria',
      `Deseja realmente remover a categoria "${categoria.name}"?`,
      'Remover',
      'Cancelar'
    );
    if (!confirmou) {
      return;
    }

    this.categoryService.remover(categoria.id).subscribe({
      next: () => { 
        if (this.categoria.id === categoria.id) {
          this.cancelarEdicao();
        }

        this.listarTodos();
      },
      error: () => this.erro.set('Não foi possível remover a categoria. Verifique a conexão e tente novamente.'),
    });
  }
}