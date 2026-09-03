import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class CategoriesComponent implements OnInit {
  private readonly categoryService = inject(CategoryService);

  @ViewChild('formCategoria') formulario!: NgForm;

  categorias: Category[] = [];
  categoria: Category = new Category();
  emEdicao = false;

  ngOnInit(): void {
    this.listarTodos();
  }

  listarTodos(): void {
    this.categorias = this.categoryService.listarTodos();
  }

  editarCategoria(categoria: Category): void {
    this.categoria = { ...categoria };
    this.emEdicao = true;
  }

  salvarCategoria(): void {
    if (!this.formulario.form.valid) {
      return;
    }

    if (this.emEdicao) {
      this.categoryService.atualizar(this.categoria);
    } else {
      this.categoryService.inserir(this.categoria);
    }

    this.cancelarEdicao();
    this.listarTodos();
  }

  cancelarEdicao(): void {
    this.categoria = new Category();
    this.emEdicao = false;
    this.formulario.resetForm();
  }

  removerCategoria(categoria: Category): void {
    if (confirm(`Remover a categoria "${categoria.name}"?`)) {
      this.categoryService.remover(categoria.id);
      this.listarTodos();
    }
  }
}