import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  private readonly categoryService = inject(CategoryService);

  @ViewChild('formCategoria') formulario!: NgForm;

  categorias: Category[] = [];
  categoria: Category = new Category();
  emEdicao = false;
  erroDuplicado = false;

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

    const nomeTrim = this.categoria.name.trim();
    const duplicado = this.categorias.find(
      (cat) => cat.name.toLowerCase() === nomeTrim.toLowerCase() && cat.id !== this.categoria.id);

    if (duplicado) {
      this.erroDuplicado = true;
      return;
    }

    this.erroDuplicado = false;
    this.categoria.name = nomeTrim;

    if (this.emEdicao) {
      this.categoryService.atualizar(this.categoria);
    } else {
      this.categoryService.inserir(this.categoria);
    }

    this.cancelarEdicao();
    this.listarTodos();
  }

  get TotalCategorias(): number {
    return this.categorias.length;
  }

  cancelarEdicao(): void {
    this.categoria = new Category();
    this.emEdicao = false;
    this.formulario.resetForm();
    this.erroDuplicado = false;
  }

  removerCategoria(categoria: Category): void {
    if (confirm(`Remover a categoria "${categoria.name}"?`)) {
      this.categoryService.remover(categoria.id);
      this.listarTodos();
    }
  }
}