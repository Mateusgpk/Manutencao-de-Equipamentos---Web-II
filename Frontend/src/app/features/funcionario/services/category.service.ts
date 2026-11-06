import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http  = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8000/api/categories';

  listarCategorias(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }


  private nextId = 6;

  private readonly categories = signal<Category[]>([
    new Category(1, 'Notebook'),
    new Category(2, 'Desktop'),
    new Category(3, 'Impressora'),
    new Category(4, 'Mouse'),
    new Category(5, 'Teclado'),
  ]);

  listarTodos(): Category[] {
    return this.categories();
  }

  buscarPorId(id: number): Category | undefined {
    return this.categories().find((c) => c.id === id);
  }

  inserir(category: Category): void {
    category.id = this.nextId++;
    this.categories.update((list) => [...list, category]);
  }

  atualizar(category: Category): void {
    this.categories.update((list) =>
      list.map((c) => (c.id === category.id ? { ...category } : c)),
    );
  }

  // A desativação é controlada pelo backend
  remover(id: number): void {
    this.categories.update((list) => list.filter((c) => c.id !== id));
  }
}