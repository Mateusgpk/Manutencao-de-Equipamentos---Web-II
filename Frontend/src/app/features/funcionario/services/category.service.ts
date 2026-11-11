import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:8080/api/categories';

  listarCategorias(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  inserir(category: Category): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, { name: category.name });
  }

  atualizar(category: Category): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${category.id}`, { name: category.name });
  }

  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}